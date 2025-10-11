import React, { useEffect } from 'react';
import { Image, Dimensions, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ZoomableImageProps {
  imageUri: string;
  onTransformChange?: (scale: number, translateX: number, translateY: number) => void;
  initialScale?: number;
  initialTranslateX?: number;
  initialTranslateY?: number;
  zoomToCenter?: boolean; // If true, zoom toward screen center; if false, zoom toward focal point
}

export default function ZoomableImage({ 
  imageUri, 
  onTransformChange,
  initialScale = 1,
  initialTranslateX = 0,
  initialTranslateY = 0,
  zoomToCenter = false,
}: ZoomableImageProps) {
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translateX = useSharedValue(initialTranslateX);
  const translateY = useSharedValue(initialTranslateY);
  const savedTranslateX = useSharedValue(initialTranslateX);
  const savedTranslateY = useSharedValue(initialTranslateY);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const isPinching = useSharedValue(false);

  // Notify parent of initial transform values on mount
  useEffect(() => {
    if (onTransformChange) {
      onTransformChange(initialScale, initialTranslateX, initialTranslateY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      isPinching.value = true;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onUpdate((event) => {
      const newScale = Math.max(1, Math.min(savedScale.value * event.scale, 20));
      
      // Track how the focal point moves during pinch
      const focalDeltaX = event.focalX - focalX.value;
      const focalDeltaY = event.focalY - focalY.value;
      
      // Compensate translate for focal point movement
      translateX.value = translateX.value + focalDeltaX;
      translateY.value = translateY.value + focalDeltaY;
      
      // Update focal point for next frame
      focalX.value = event.focalX;
      focalY.value = event.focalY;
      
      scale.value = newScale;
    })
    .onEnd(() => {
      isPinching.value = false;
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      if (onTransformChange) {
        runOnJS(onTransformChange)(scale.value, translateX.value, translateY.value);
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only pan if not currently pinching
      if (!isPinching.value) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      if (!isPinching.value) {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
        if (onTransformChange) {
          runOnJS(onTransformChange)(scale.value, translateX.value, translateY.value);
        }
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
      if (onTransformChange) {
        runOnJS(onTransformChange)(scale.value, translateX.value, translateY.value);
      }
    });

  const composedGesture = Gesture.Race(
    doubleTapGesture,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}
