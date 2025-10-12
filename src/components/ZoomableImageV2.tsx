import React, { useEffect } from 'react';
import { Image, Dimensions, StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ZoomableImageProps {
  imageUri: string;
  onTransformChange?: (scale: number, translateX: number, translateY: number, rotation: number) => void;
  initialScale?: number;
  initialTranslateX?: number;
  initialTranslateY?: number;
  initialRotation?: number;
  zoomToCenter?: boolean; // If true, zoom toward screen center; if false, zoom toward focal point
  showLevelLine?: boolean; // Show level reference line (only during panning, not in measurements)
  locked?: boolean; // If true, disable pan/zoom gestures
}

export default function ZoomableImage({ 
  imageUri, 
  onTransformChange,
  initialScale = 1,
  initialTranslateX = 0,
  initialTranslateY = 0,
  initialRotation = 0,
  zoomToCenter = false,
  showLevelLine = false,
  locked = false,
}: ZoomableImageProps) {
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translateX = useSharedValue(initialTranslateX);
  const translateY = useSharedValue(initialTranslateY);
  const savedTranslateX = useSharedValue(initialTranslateX);
  const savedTranslateY = useSharedValue(initialTranslateY);
  const rotation = useSharedValue(initialRotation);
  const savedRotation = useSharedValue(initialRotation);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const isPinching = useSharedValue(false);

  // Notify parent of initial transform values on mount
  useEffect(() => {
    if (onTransformChange) {
      onTransformChange(initialScale, initialTranslateX, initialTranslateY, initialRotation);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Continuously notify parent of transform changes during gestures
  useAnimatedReaction(
    () => ({ scale: scale.value, x: translateX.value, y: translateY.value, rotation: rotation.value }),
    (current, previous) => {
      if (onTransformChange && previous) {
        // Only update if values actually changed
        if (current.scale !== previous.scale || current.x !== previous.x || current.y !== previous.y || current.rotation !== previous.rotation) {
          console.log('📊 Transform changed:', current.scale.toFixed(2), current.x.toFixed(0), current.y.toFixed(0), current.rotation.toFixed(1));
          runOnJS(onTransformChange)(current.scale, current.x, current.y, current.rotation);
        }
      }
    }
  );

  const pinchGesture = Gesture.Pinch()
    .enabled(!locked)
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 20));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });
  
  const rotationGesture = Gesture.Rotation()
    .enabled(!locked)
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const panGesture = Gesture.Pan()
    .enabled(!locked)
    .onUpdate((event) => {
      // Reduce sensitivity by 30% (multiply by 0.7)
      translateX.value = savedTranslateX.value + event.translationX * 0.7;
      translateY.value = savedTranslateY.value + event.translationY * 0.7;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(!locked)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        rotation.value = withSpring(0);
        savedRotation.value = 0;
      } else {
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
      if (onTransformChange) {
        runOnJS(onTransformChange)(scale.value, translateX.value, translateY.value, rotation.value);
      }
    });

  const composedGesture = Gesture.Race(
    doubleTapGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
      
      {/* Level reference line - 3/4 up the screen (only during zoom/pan) */}
      {showLevelLine && (
        <>
          {/* Horizontal level line */}
          <View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT * 0.25,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
            pointerEvents="none"
          />
          
          {/* "LEVEL" text */}
          <View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT * 0.25 - 20,
              left: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 4,
            }}
            pointerEvents="none"
          >
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontWeight: '500' }}>
              LEVEL
            </Text>
          </View>
          
          {/* Center crosshairs - very faint for centering objects */}
          {/* Vertical center line */}
          <View
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH / 2,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
            pointerEvents="none"
          />
          
          {/* Horizontal center line */}
          <View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT / 2,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
            pointerEvents="none"
          />
        </>
      )}
    </>
  );
}
