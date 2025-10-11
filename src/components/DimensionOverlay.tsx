import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Svg, Line, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import { formatMeasurement } from '../utils/unitConversion';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DimensionOverlay() {
  const insets = useSafeAreaInsets();
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: string }>>([]);
  
  const calibration = useStore((s) => s.calibration);
  const unitSystem = useStore((s) => s.unitSystem);

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (points.length >= 2) {
      // Reset and start new measurement
      setPoints([{ x: locationX, y: locationY, id: Date.now().toString() }]);
    } else {
      // Add point
      setPoints([...points, { x: locationX, y: locationY, id: Date.now().toString() }]);
    }
  };

  const handleClear = () => {
    setPoints([]);
  };

  // Calculate distance in pixels and convert to real units
  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const pixelDistance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    
    if (!calibration) {
      return `${pixelDistance.toFixed(0)} px`;
    }
    
    const realDistance = pixelDistance / calibration.pixelsPerUnit;
    return formatMeasurement(realDistance, calibration.unit, unitSystem, 2);
  };

  // Calculate midpoint for label positioning
  const getMidpoint = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };

  const hasCompleteMeasurement = points.length === 2;

  return (
    <>
      {/* Touchable overlay */}
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
        {/* SVG overlay for drawing */}
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          {/* Draw line between points */}
          {hasCompleteMeasurement && (
            <>
              <Line
                x1={points[0].x}
                y1={points[0].y}
                x2={points[1].x}
                y2={points[1].y}
                stroke="#3B82F6"
                strokeWidth="3"
              />
              
              {/* Extension lines at endpoints */}
              <Line
                x1={points[0].x}
                y1={points[0].y - 10}
                x2={points[0].x}
                y2={points[0].y + 10}
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <Line
                x1={points[1].x}
                y1={points[1].y - 10}
                x2={points[1].x}
                y2={points[1].y + 10}
                stroke="#3B82F6"
                strokeWidth="2"
              />
            </>
          )}

          {/* Draw points */}
          {points.map((point) => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="3"
            />
          ))}
        </Svg>

        {/* Dimension label */}
        {hasCompleteMeasurement && (
          <View
            style={{
              position: 'absolute',
              left: getMidpoint(points[0], points[1]).x - 50,
              top: getMidpoint(points[0], points[1]).y - 40,
              backgroundColor: '#3B82F6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text className="text-white font-bold text-base">
              {calculateDistance(points[0], points[1])}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Bottom toolbar */}
      <View
        className="absolute left-0 right-0 z-20"
        style={{ 
          bottom: insets.bottom + 20,
          paddingHorizontal: 20,
        }}
      >
        <View className="bg-white/95 rounded-2xl px-6 py-4 flex-row items-center justify-between shadow-lg">
          {points.length === 0 && (
            <View className="flex-1 flex-row items-center">
              <Ionicons name="hand-left-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium">
                Tap first point to start measuring
              </Text>
            </View>
          )}
          
          {points.length === 1 && (
            <View className="flex-1 flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-blue-500" />
              <Text className="ml-3 text-gray-700 font-medium">
                Tap second point to complete
              </Text>
            </View>
          )}
          
          {hasCompleteMeasurement && (
            <>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Measurement</Text>
                <Text className="text-gray-900 font-bold text-lg">
                  {calculateDistance(points[0], points[1])}
                </Text>
              </View>
              
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={handleClear}
                  className="bg-gray-100 rounded-xl px-4 py-3"
                >
                  <Text className="text-gray-700 font-semibold">New</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
}
