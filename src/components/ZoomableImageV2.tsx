import React, { useEffect } from 'react';
import { Image, Dimensions, StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import UniversalFingerprints from './UniversalFingerprints';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ZoomableImageProps {
  imageUri: string;
  onTransformChange?: (scale: number, translateX: number, translateY: number, rotation: number) => void;
  onDoubleTapWhenLocked?: () => void; // Called when user double-taps while locked (e.g., to switch to Measure mode)
  onPanStart?: (x: number, y: number) => void; // Called when pan gesture starts (for fingerprints)
  fingerColor?: string; // Color for pan fingerprints
  initialScale?: number;
  initialTranslateX?: number;
  initialTranslateY?: number;
  initialRotation?: number;
  zoomToCenter?: boolean; // If true, zoom toward screen center; if false, zoom toward focal point
  showLevelLine?: boolean; // Show level reference line (only during panning, not in measurements)
  locked?: boolean; // If true, disable pan/zoom gestures
  opacity?: number; // Opacity of the image (0-1), default 1
  singleFingerPan?: boolean; // If true, allow one-finger panning (for calibration screen)
}

export default function ZoomableImage({ 
  imageUri, 
  onTransformChange,
  onDoubleTapWhenLocked,
  onPanStart,
  fingerColor = '#3B82F6',
  initialScale = 1,
  initialTranslateX = 0,
  initialTranslateY = 0,
  initialRotation = 0,
  zoomToCenter = false,
  showLevelLine = false,
  locked = false,
  opacity = 1,
  singleFingerPan = false,
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
  const fadeOpacity = useSharedValue(1);
  const gestureWasActive = useSharedValue(false);
  const gestureJustEnded = useSharedValue(false); // Debounce cooldown flag
  
  // Helper function to clear gesture cooldown after delay
  const clearGestureCooldown = () => {
    setTimeout(() => {
      gestureJustEnded.value = false;
      __DEV__ && console.log('🔓 Gesture cooldown cleared - buttons should be responsive now');
    }, 50);
  };
  
  // Smooth fade when switching between locked/unlocked to prevent flash
  useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 150 });
  }, [locked]);

  // Cleanup: Reset transform values when imageUri changes to ensure fresh state
  useEffect(() => {
    // Reset to initial values when image changes
    scale.value = initialScale;
    savedScale.value = initialScale;
    translateX.value = initialTranslateX;
    translateY.value = initialTranslateY;
    savedTranslateX.value = initialTranslateX;
    savedTranslateY.value = initialTranslateY;
    rotation.value = initialRotation;
    savedRotation.value = initialRotation;
  }, [imageUri]);

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
          // COMMENTED OUT TO REDUCE LOG SPAM
          // __DEV__ && console.log('📊 Transform changed:', current.scale.toFixed(2), current.x.toFixed(0), current.y.toFixed(0), current.rotation.toFixed(1));
          runOnJS(onTransformChange)(current.scale, current.x, current.y, current.rotation);
        }
      }
    }
  );

  const pinchGesture = Gesture.Pinch()
    .enabled(!locked) // Disable when locked to allow menu touches through
    .shouldCancelWhenOutside(true) // Release immediately when fingers leave
    .onUpdate((event) => {
      gestureWasActive.value = true;
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 35));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      gestureWasActive.value = false; // Mark gesture as complete
    })
    .onFinalize(() => {
      // Ensure gesture is fully complete
      savedScale.value = scale.value;
      gestureWasActive.value = false; // Ensure gesture state is cleared
    });
  
  const rotationGesture = Gesture.Rotation()
    .enabled(!locked) // Disable when locked to allow menu touches through
    .shouldCancelWhenOutside(true) // Release immediately when fingers leave
    .onUpdate((event) => {
      gestureWasActive.value = true;
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
      gestureWasActive.value = false; // Mark gesture as complete
      
      // ROTATION DEBOUNCE: 50ms cooldown prevents buttons from sticking after rotation
      gestureJustEnded.value = true;
      runOnJS(clearGestureCooldown)();
    })
    .onFinalize(() => {
      // Ensure gesture is fully complete
      savedRotation.value = rotation.value;
      gestureWasActive.value = false; // Ensure gesture state is cleared
      
      // Additional safety: set cooldown here too (in case onEnd didn't fire)
      gestureJustEnded.value = true;
      runOnJS(clearGestureCooldown)();
    });

  const panGesture = Gesture.Pan()
    .enabled(!locked || singleFingerPan) // Allow pan when NOT locked OR when singleFingerPan is enabled
    .minDistance(singleFingerPan ? 5 : 10) // Lower for single-finger, normal for 2-finger
    .minPointers(singleFingerPan ? 1 : 2) // Allow 1 finger in calibration, require 2 in measurement
    .maxPointers(singleFingerPan ? 2 : 2) // Allow up to 2 fingers in calibration (for flexibility)
    .shouldCancelWhenOutside(true) // Release immediately when fingers leave
    .onStart(() => {
      if (__DEV__ && singleFingerPan) {
        console.log('🖐️ Pan gesture started (single-finger mode enabled)');
      }
    })
    .onUpdate((event) => {
      gestureWasActive.value = true;
      // Reduce sensitivity by 30% (multiply by 0.7)
      translateX.value = savedTranslateX.value + event.translationX * 0.7;
      translateY.value = savedTranslateY.value + event.translationY * 0.7;
    })
    .onEnd(() => {
      if (__DEV__ && singleFingerPan) {
        console.log('✅ Pan gesture ended');
      }
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      gestureWasActive.value = false; // Mark gesture as complete
      
      // PAN DEBOUNCE: 50ms cooldown prevents buttons from sticking after pan
      gestureJustEnded.value = true;
      runOnJS(clearGestureCooldown)();
    })
    .onFinalize(() => {
      // Ensure gesture is fully complete and release control
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      gestureWasActive.value = false; // Ensure gesture state is cleared
      
      // Additional safety: set cooldown here too (in case onEnd didn't fire)
      gestureJustEnded.value = true;
      runOnJS(clearGestureCooldown)();
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

  // Double-tap when LOCKED to switch to Measure mode (power-user shortcut)
  const doubleTapWhenLockedGesture = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(locked)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      if (onDoubleTapWhenLocked) {
        runOnJS(onDoubleTapWhenLocked)();
      }
    });

  // Use simple simultaneous gestures for both modes
  // Compose gestures - use Race so double-tap and pan/zoom can coexist
  const composedGesture = Gesture.Race(
    doubleTapGesture,
    doubleTapWhenLockedGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture, panGesture)
  );


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
    opacity: fadeOpacity.value,
  }));

  return (
    <>
      {/* Universal fingerprints for pan gestures (multi-touch) */}
      <UniversalFingerprints color={fingerColor} enabled={true} captureMultiTouch={true} />
      
      <View 
        style={StyleSheet.absoluteFill} 
        pointerEvents="box-none"
      >
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} collapsable={false}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, opacity }}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
      </View>
      
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
