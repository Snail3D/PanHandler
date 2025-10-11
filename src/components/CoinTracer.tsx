import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import { CoinReference } from '../utils/coinReferences';
import { formatMeasurement } from '../utils/unitConversion';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CoinTracerProps {
  selectedCoin: CoinReference;
  onComplete: (circleData: { centerX: number; centerY: number; radius: number }) => void;
  onCancel: () => void;
}

export default function CoinTracer({ selectedCoin, onComplete, onCancel }: CoinTracerProps) {
  const insets = useSafeAreaInsets();
  const unitSystem = useStore((s) => s.unitSystem);
  const [centerPoint, setCenterPoint] = useState<{ x: number; y: number } | null>(null);

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    // Set center and automatically complete
    setCenterPoint({ x: locationX, y: locationY });
    
    // Calculate radius based on coin diameter
    // Use a reasonable default that will be adjusted by actual calibration
    const estimatedRadius = 50; // Default radius in pixels for visualization
    
    // Complete immediately after tap
    setTimeout(() => {
      onComplete({
        centerX: locationX,
        centerY: locationY,
        radius: estimatedRadius,
      });
    }, 100);
  };

  const radius = 50; // Fixed radius for visualization

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          {/* Show coin circle if center is set */}
          {centerPoint && (
            <>
              {/* Main circle */}
              <Circle
                cx={centerPoint.x}
                cy={centerPoint.y}
                r={radius}
                stroke="#F59E0B"
                strokeWidth="3"
                fill="rgba(245, 158, 11, 0.1)"
                strokeDasharray="10,5"
              />
              
              {/* Center point */}
              <Circle
                cx={centerPoint.x}
                cy={centerPoint.y}
                r="6"
                fill="#F59E0B"
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}
        </Svg>
      </Pressable>

      {/* Instructions overlay */}
      <View
        className="absolute left-0 right-0 z-20"
        style={{ 
          bottom: insets.bottom + 20,
          paddingHorizontal: 20,
        }}
      >
        <View className="bg-white/95 rounded-2xl px-6 py-4 shadow-lg">
          {/* Selected coin info */}
          <View className="flex-row items-center mb-4 pb-4 border-b border-gray-200">
            <View className="w-12 h-12 rounded-full bg-amber-500 items-center justify-center mr-3">
              <Ionicons name="cash" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">
                {selectedCoin.name}
              </Text>
              <Text className="text-gray-600">
                {formatMeasurement(selectedCoin.diameter, 'mm', unitSystem, 1)}
              </Text>
            </View>
          </View>

          {/* Instructions */}
          <View className="flex-row items-start mb-4">
            <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mr-3 mt-0.5">
              <Ionicons name="radio-button-on" size={24} color="#d97706" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg mb-1">
                Tap the coin center
              </Text>
              <Text className="text-gray-600 text-base">
                Simply tap the center of the coin in your photo. The app will automatically calibrate based on the coin size.
              </Text>
            </View>
          </View>

          {/* Action button */}
          <Pressable
            onPress={onCancel}
            className="bg-gray-700 rounded-xl py-3"
          >
            <Text className="text-white text-center font-semibold">
              Choose Different Coin
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
