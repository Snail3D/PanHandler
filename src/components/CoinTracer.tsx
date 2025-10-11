import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinReference } from '../utils/coinReferences';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CoinTracerProps {
  selectedCoin: CoinReference;
  onComplete: (circleData: { centerX: number; centerY: number; radius: number }) => void;
  onCancel: () => void;
}

export default function CoinTracer({ selectedCoin, onComplete, onCancel }: CoinTracerProps) {
  const insets = useSafeAreaInsets();
  const [centerPoint, setCenterPoint] = useState<{ x: number; y: number } | null>(null);
  const [edgePoint, setEdgePoint] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    if (!centerPoint) {
      // First tap: set center
      setCenterPoint({ x: locationX, y: locationY });
    } else if (!isDrawing) {
      // Second tap: start drawing edge
      setIsDrawing(true);
      setEdgePoint({ x: locationX, y: locationY });
    }
  };

  const handleMove = (event: any) => {
    if (isDrawing && centerPoint) {
      const { locationX, locationY } = event.nativeEvent;
      setEdgePoint({ x: locationX, y: locationY });
    }
  };

  const handleRelease = () => {
    if (isDrawing && centerPoint && edgePoint) {
      const radius = Math.sqrt(
        Math.pow(edgePoint.x - centerPoint.x, 2) + 
        Math.pow(edgePoint.y - centerPoint.y, 2)
      );
      
      onComplete({
        centerX: centerPoint.x,
        centerY: centerPoint.y,
        radius: radius,
      });
    }
  };

  const handleReset = () => {
    setCenterPoint(null);
    setEdgePoint(null);
    setIsDrawing(false);
  };

  const radius = centerPoint && edgePoint
    ? Math.sqrt(
        Math.pow(edgePoint.x - centerPoint.x, 2) + 
        Math.pow(edgePoint.y - centerPoint.y, 2)
      )
    : 0;

  return (
    <>
      <View
        onStartShouldSetResponder={() => true}
        onResponderGrant={handlePress}
        onResponderMove={handleMove}
        onResponderRelease={handleRelease}
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
          {/* Draw circle if we have center and edge */}
          {centerPoint && edgePoint && (
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
              
              {/* Edge point */}
              <Circle
                cx={edgePoint.x}
                cy={edgePoint.y}
                r="6"
                fill="#F59E0B"
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}
          
          {/* Just center point if only center is set */}
          {centerPoint && !edgePoint && (
            <Circle
              cx={centerPoint.x}
              cy={centerPoint.y}
              r="8"
              fill="#F59E0B"
              stroke="white"
              strokeWidth="3"
            />
          )}
        </Svg>
      </View>

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
            <View className="w-10 h-10 rounded-full bg-amber-500 items-center justify-center mr-3">
              <Ionicons name="cash" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold">
                {selectedCoin.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                {selectedCoin.diameter}mm diameter
              </Text>
            </View>
          </View>

          {/* Instructions */}
          {!centerPoint && (
            <View className="flex-row items-start">
              <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3 mt-0.5">
                <Text className="text-amber-700 font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Tap the center of the coin
                </Text>
                <Text className="text-gray-600 text-sm">
                  Place your finger at the center point of the coin in the photo
                </Text>
              </View>
            </View>
          )}

          {centerPoint && !isDrawing && (
            <View className="flex-row items-start">
              <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3 mt-0.5">
                <Text className="text-amber-700 font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Tap and drag to the edge
                </Text>
                <Text className="text-gray-600 text-sm">
                  Touch the edge of the coin and drag to trace its size
                </Text>
              </View>
            </View>
          )}

          {isDrawing && (
            <View className="flex-row items-start">
              <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3 mt-0.5">
                <Text className="text-amber-700 font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Release to confirm
                </Text>
                <Text className="text-gray-600 text-sm">
                  Adjust the circle to match the coin, then lift your finger
                </Text>
              </View>
            </View>
          )}

          {/* Action buttons */}
          <View className="flex-row space-x-3 mt-4">
            {centerPoint && (
              <Pressable
                onPress={handleReset}
                className="flex-1 bg-gray-100 rounded-xl py-3"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Reset
                </Text>
              </Pressable>
            )}
            
            <Pressable
              onPress={onCancel}
              className="flex-1 bg-gray-700 rounded-xl py-3"
            >
              <Text className="text-white text-center font-semibold">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}
