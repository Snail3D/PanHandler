import React, { useRef, useEffect } from 'react';
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
  locked?: boolean;  // When true, disables pan/zoom gestures
}

export default function ZoomableImage({
  imageUri,
  onTransformChange,
  initialScale = 1,
  initialTranslateX = 0,
  initialTranslateY = 0,
  locked = false,
}: ZoomableImageProps) {
  // Use shared value for locked state to avoid stale closures in gesture handlers
  // This is critical for production builds where Hermes optimization can freeze callbacks
  const isLockedShared = useSharedValue(locked);

  // Update shared value when locked prop changes
  useEffect(() => {
    isLockedShared.value = locked;
  }, [locked, isLockedShared]);

  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translateX = useSharedValue(initialTranslateX);
  const translateY = useSharedValue(initialTranslateY);
  const savedTranslateX = useSharedValue(initialTranslateX);
  const savedTranslateY = useSharedValue(initialTranslateY);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      'worklet';
      // Check locked state - use shared value to avoid stale closures in production builds
      if (isLockedShared.value) return;

      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 35));
    })
    .onEnd(() => {
      'worklet';
      if (isLockedShared.value) return;

      savedScale.value = scale.value;
      if (onTransformChange) {
        runOnJS(onTransformChange)(scale.value, translateX.value, translateY.value);
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      // Check locked state - use shared value to avoid stale closures in production builds
      if (isLockedShared.value) return;

      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      'worklet';
      if (isLockedShared.value) return;

      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      if (onTransformChange) {
        runOnJS(onTransformChange)(scale.value, translateX.value, translateY.value);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      // Check locked state - use shared value to avoid stale closures in production builds
      if (isLockedShared.value) return;

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
