import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface FingerprintTouch {
  x: number;
  y: number;
  id: string;
  pressure: number;
  seed: number;
}

interface UniversalFingerprintsProps {
  color?: string; // Main color for fingerprints
  enabled?: boolean; // Enable/disable fingerprints
  captureMultiTouch?: boolean; // If true, capture all touches including gestures
}

export default function UniversalFingerprints({ 
  color = '#3B82F6',
  enabled = true,
  captureMultiTouch = false,
}: UniversalFingerprintsProps) {
  const [fingerTouches, setFingerTouches] = useState<FingerprintTouch[]>([]);
  
  const fingerOpacity = useSharedValue(0);
  const fingerScale = useSharedValue(1);
  const fingerRotation = useSharedValue(0);

  const fingerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fingerOpacity.value,
    transform: [
      { scale: fingerScale.value },
      { rotate: `${fingerRotation.value}deg` },
    ],
  }));

  if (!enabled) {
    return null;
  }

  // For multi-touch mode (pan gestures), we need onTouchStart/End
  if (captureMultiTouch) {
    return (
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
        pointerEvents="box-none"
        onTouchStart={(event) => {
          const touches = event.nativeEvent.touches;
          const newTouches = Array.from(touches).map((touch, index) => ({
            x: touch.pageX,
            y: touch.pageY,
            id: `multi-touch-${Date.now()}-${index}`,
            pressure: touch.force || 0.5,
            seed: Math.random()
          }));
          
          setFingerTouches(newTouches);
          fingerOpacity.value = withTiming(1, { duration: 150 });
          fingerScale.value = 1;
          fingerRotation.value = 0;
        }}
        onTouchEnd={() => {
          fingerOpacity.value = withTiming(0, { 
            duration: 800, 
            easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
          });
          fingerScale.value = withTiming(1.5, { 
            duration: 800, 
            easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
          });
          fingerRotation.value = withTiming(15, { 
            duration: 800, 
            easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
          });
        }}
      >
        {/* Render fingerprints */}
        {fingerTouches.map((touch) => (
          <Animated.View
            key={touch.id}
            style={[
              {
                position: 'absolute',
                left: touch.x - 50,
                top: touch.y - 50,
                width: 100,
                height: 100,
                pointerEvents: 'none',
              },
              fingerAnimatedStyle,
            ]}
          >
            <Svg width={100} height={100} style={{ position: 'absolute' }}>
              <Defs>
                <RadialGradient id={`fingerGradient-${touch.id}`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={color} stopOpacity="0.6" />
                  <Stop offset="70%" stopColor={color} stopOpacity="0.15" />
                  <Stop offset="100%" stopColor={color} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill={`url(#fingerGradient-${touch.id})`} 
              />
              {/* Ridges for fingerprint texture */}
              {[0, 1, 2, 3, 4].map((i) => {
                const radius = 15 + i * 6;
                const wobble = Math.sin(touch.seed * 10 + i) * 2;
                return (
                  <Circle
                    key={i}
                    cx={50 + wobble}
                    cy={50}
                    r={radius}
                    stroke={color}
                    strokeWidth={1.5}
                    fill="none"
                    opacity={0.3 * (1 - i * 0.15)}
                  />
                );
              })}
            </Svg>
          </Animated.View>
        ))}
      </View>
    );
  }

  // Default single-touch mode (for taps)
  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
      pointerEvents="box-none"
      onStartShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        const { pageX, pageY } = event.nativeEvent;
        const pressure = event.nativeEvent.force || 0.5;
        
        // Create fingerprint at touch location
        setFingerTouches([{ 
          x: pageX, 
          y: pageY, 
          id: `universal-touch-${Date.now()}`,
          pressure: pressure,
          seed: Math.random()
        }]);
        
        fingerOpacity.value = withTiming(1, { duration: 150 });
        fingerScale.value = 1;
        fingerRotation.value = 0;
      }}
      onResponderRelease={() => {
        // Fade out fingerprint
        fingerOpacity.value = withTiming(0, { 
          duration: 800, 
          easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
        });
        fingerScale.value = withTiming(1.5, { 
          duration: 800, 
          easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
        });
        fingerRotation.value = withTiming(15, { 
          duration: 800, 
          easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
        });
      }}
    >
      {/* Render fingerprints */}
      {fingerTouches.map((touch) => (
        <Animated.View
          key={touch.id}
          style={[
            {
              position: 'absolute',
              left: touch.x - 50,
              top: touch.y - 50,
              width: 100,
              height: 100,
              pointerEvents: 'none',
            },
            fingerAnimatedStyle,
          ]}
        >
          <Svg width={100} height={100} style={{ position: 'absolute' }}>
            <Defs>
              <RadialGradient id={`fingerGradient-${touch.id}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={color} stopOpacity="0.6" />
                <Stop offset="70%" stopColor={color} stopOpacity="0.15" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill={`url(#fingerGradient-${touch.id})`} 
            />
            {/* Ridges for fingerprint texture */}
            {[0, 1, 2, 3, 4].map((i) => {
              const radius = 15 + i * 6;
              const wobble = Math.sin(touch.seed * 10 + i) * 2;
              return (
                <Circle
                  key={i}
                  cx={50 + wobble}
                  cy={50}
                  r={radius}
                  stroke={color}
                  strokeWidth={1.5}
                  fill="none"
                  opacity={0.3 * (1 - i * 0.15)}
                />
              );
            })}
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
