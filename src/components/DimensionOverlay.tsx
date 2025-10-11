import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, Alert } from 'react-native';
import { Svg, Line, Circle, Path } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import useStore from '../state/measurementStore';
import { formatMeasurement } from '../utils/unitConversion';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MeasurementMode = 'distance' | 'angle';

interface DimensionOverlayProps {
  zoomScale?: number;
  zoomTranslateX?: number;
  zoomTranslateY?: number;
}

export default function DimensionOverlay({ 
  zoomScale = 1, 
  zoomTranslateX = 0, 
  zoomTranslateY = 0 
}: DimensionOverlayProps = {}) {
  const insets = useSafeAreaInsets();
  // Points are stored in ORIGINAL image coordinates (unzoomed)
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const [mode, setMode] = useState<MeasurementMode>('distance');
  const viewRef = useRef<View>(null);
  
  // Long press indicator animation
  const pressProgress = useSharedValue(0);
  const pressX = useSharedValue(0);
  const pressY = useSharedValue(0);
  const [showPressIndicator, setShowPressIndicator] = useState(false);
  
  const calibration = useStore((s) => s.calibration);
  const unitSystem = useStore((s) => s.unitSystem);
  const currentImageUri = useStore((s) => s.currentImageUri);
  const coinCircle = useStore((s) => s.coinCircle);

  // Helper to convert screen coordinates to original image coordinates
  const screenToImage = (screenX: number, screenY: number) => {
    const imageX = (screenX - zoomTranslateX) / zoomScale;
    const imageY = (screenY - zoomTranslateY) / zoomScale;
    return { x: imageX, y: imageY };
  };

  // Helper to convert original image coordinates to screen coordinates
  const imageToScreen = (imageX: number, imageY: number) => {
    const screenX = imageX * zoomScale + zoomTranslateX;
    const screenY = imageY * zoomScale + zoomTranslateY;
    return { x: screenX, y: screenY };
  };

  const placePoint = (x: number, y: number) => {
    // Convert screen tap to original image coordinates
    const imageCoords = screenToImage(x, y);
    
    const requiredPoints = mode === 'distance' ? 2 : 3;
    
    if (points.length >= requiredPoints) {
      // Reset and start new measurement - store in IMAGE coordinates
      setPoints([{ x: imageCoords.x, y: imageCoords.y, id: Date.now().toString() }]);
    } else {
      // Add point - store in IMAGE coordinates
      setPoints([...points, { x: imageCoords.x, y: imageCoords.y, id: Date.now().toString() }]);
    }
  };

  // Long press gesture to place points (2 seconds)
  const longPressGesture = Gesture.LongPress()
    .minDuration(2000)
    .onStart((event) => {
      pressX.value = event.x;
      pressY.value = event.y;
      runOnJS(setShowPressIndicator)(true);
      pressProgress.value = withTiming(1, { duration: 2000 });
    })
    .onEnd((event) => {
      runOnJS(setShowPressIndicator)(false);
      pressProgress.value = 0;
      runOnJS(placePoint)(event.x, event.y);
    })
    .onFinalize(() => {
      runOnJS(setShowPressIndicator)(false);
      pressProgress.value = 0;
    });

  // Animated style for press indicator
  const pressIndicatorStyle = useAnimatedStyle(() => {
    const scale = pressProgress.value * 50; // Grows to 50px radius
    return {
      position: 'absolute',
      left: pressX.value - 50,
      top: pressY.value - 50,
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: mode === 'distance' ? '#3B82F6' : '#10B981',
      backgroundColor: `${mode === 'distance' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'}`,
      transform: [{ scale: pressProgress.value }],
      opacity: 1 - pressProgress.value * 0.3,
    };
  });

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

  // Calculate angle between three points
  const calculateAngle = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = Math.abs((angle2 - angle1) * (180 / Math.PI));
    
    // Normalize to 0-180 range
    if (angle > 180) {
      angle = 360 - angle;
    }
    
    return `${angle.toFixed(1)}°`;
  };

  // Calculate midpoint for label positioning
  const getMidpoint = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };

  // Generate arc path for angle visualization
  const generateArcPath = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
    const radius = 40;
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    
    const startX = p2.x + radius * Math.cos(angle1);
    const startY = p2.y + radius * Math.sin(angle1);
    const endX = p2.x + radius * Math.cos(angle2);
    const endY = p2.y + radius * Math.sin(angle2);
    
    let angleDiff = angle2 - angle1;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    const largeArcFlag = Math.abs(angleDiff) > Math.PI ? 1 : 0;
    const sweepFlag = angleDiff > 0 ? 1 : 0;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  };

  const handleExport = async () => {
    if (!viewRef.current || !currentImageUri) return;

    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to save images.');
        return;
      }

      const uri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success', 'Measurement saved to Photos!');
    } catch (error) {
      Alert.alert('Save Error', 'Failed to save image. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Measurements',
      'This will clear all measurements and return to the camera. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            const setImageUri = useStore.getState().setImageUri;
            const setCoinCircle = useStore.getState().setCoinCircle;
            const setCalibration = useStore.getState().setCalibration;
            
            setImageUri(null);
            setCoinCircle(null);
            setCalibration(null);
          }
        },
      ]
    );
  };

  const hasCompleteMeasurement = 
    (mode === 'distance' && points.length === 2) ||
    (mode === 'angle' && points.length === 3);

  return (
    <>
      {/* Gesture overlay for long-press to place points */}
      <GestureDetector gesture={longPressGesture}>
        <Animated.View 
          ref={viewRef} 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
          pointerEvents="box-none"
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            pointerEvents="box-none"
          >
          {/* Long press indicator */}
          {showPressIndicator && (
            <Animated.View style={pressIndicatorStyle} pointerEvents="none" />
          )}
          
          {/* SVG overlay for drawing */}
          <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} pointerEvents="none">
            {/* Persistent coin circle reference - transform to screen coords */}
            {coinCircle && (() => {
              const screenPos = imageToScreen(coinCircle.centerX, coinCircle.centerY);
              const screenRadius = coinCircle.radius * zoomScale;
              return (
                <Circle
                  cx={screenPos.x}
                  cy={screenPos.y}
                  r={screenRadius}
                  stroke="#F59E0B"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  opacity={0.6}
                />
              );
            })()}

            {/* Distance mode: Draw line between two points */}
            {mode === 'distance' && points.length === 2 && (() => {
              const p0 = imageToScreen(points[0].x, points[0].y);
              const p1 = imageToScreen(points[1].x, points[1].y);
              return (
                <>
                  <Line
                    x1={p0.x}
                    y1={p0.y}
                    x2={p1.x}
                    y2={p1.y}
                    stroke="#3B82F6"
                    strokeWidth="3"
                  />
                  
                  {/* Extension lines at endpoints */}
                  <Line
                    x1={p0.x}
                    y1={p0.y - 10}
                    x2={p0.x}
                    y2={p0.y + 10}
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <Line
                    x1={p1.x}
                    y1={p1.y - 10}
                    x2={p1.x}
                    y2={p1.y + 10}
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                </>
              );
            })()}

            {/* Angle mode: Draw lines and arc for three points */}
            {mode === 'angle' && points.length >= 2 && (() => {
              const p0 = imageToScreen(points[0].x, points[0].y);
              const p1 = imageToScreen(points[1].x, points[1].y);
              const p2 = points.length === 3 ? imageToScreen(points[2].x, points[2].y) : null;
              
              return (
                <>
                  {/* First line */}
                  <Line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p0.x}
                    y2={p0.y}
                    stroke="#10B981"
                    strokeWidth="3"
                  />
                  
                  {/* Second line (if third point exists) */}
                  {p2 && (
                    <>
                      <Line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#10B981"
                        strokeWidth="3"
                      />
                      
                      {/* Arc to show angle */}
                      <Path
                        d={generateArcPath(p0, p1, p2)}
                        stroke="#10B981"
                        strokeWidth="2"
                        fill="none"
                      />
                    </>
                  )}
                </>
              );
            })()}

            {/* Draw points */}
            {points.map((point, index) => {
              const screenPos = imageToScreen(point.x, point.y);
              return (
                <Circle
                  key={point.id}
                  cx={screenPos.x}
                  cy={screenPos.y}
                  r="8"
                  fill={mode === 'distance' ? '#3B82F6' : index === 1 ? '#059669' : '#10B981'}
                  stroke="white"
                  strokeWidth="3"
                />
              );
            })}
          </Svg>

          {/* Measurement label */}
          {hasCompleteMeasurement && (() => {
            let screenX, screenY;
            if (mode === 'distance') {
              const mid = getMidpoint(points[0], points[1]);
              const screenMid = imageToScreen(mid.x, mid.y);
              screenX = screenMid.x - 50;
              screenY = screenMid.y - 40;
            } else {
              const screenP1 = imageToScreen(points[1].x, points[1].y);
              screenX = screenP1.x - 50;
              screenY = screenP1.y - 60;
            }
            
            return (
              <View
                style={{
                  position: 'absolute',
                  left: screenX,
                  top: screenY,
                  backgroundColor: mode === 'distance' ? '#3B82F6' : '#10B981',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                pointerEvents="none"
              >
                <Text className="text-white font-bold text-base">
                  {mode === 'distance' 
                    ? calculateDistance(points[0], points[1])
                    : calculateAngle(points[0], points[1], points[2])}
                </Text>
              </View>
            );
          })()}
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Bottom toolbar */}
      <View
        className="absolute left-0 right-0 z-20"
        style={{ 
          bottom: insets.bottom + 20,
          paddingHorizontal: 20,
        }}
      >
        <View className="bg-white/95 rounded-2xl px-6 py-4 shadow-lg">
          {/* Mode Toggle */}
          <View className="flex-row mb-3 bg-gray-100 rounded-lg p-1">
            <Pressable
              onPress={() => {
                setMode('distance');
                setPoints([]);
              }}
              className={`flex-1 py-2 rounded-md ${mode === 'distance' ? 'bg-white' : ''}`}
            >
              <Text className={`text-center font-semibold ${mode === 'distance' ? 'text-blue-600' : 'text-gray-600'}`}>
                Distance
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMode('angle');
                setPoints([]);
              }}
              className={`flex-1 py-2 rounded-md ${mode === 'angle' ? 'bg-white' : ''}`}
            >
              <Text className={`text-center font-semibold ${mode === 'angle' ? 'text-green-600' : 'text-gray-600'}`}>
                Angle
              </Text>
            </Pressable>
          </View>

          {/* Zoom tip */}
          {points.length === 0 && (
            <View className="bg-blue-50 rounded-lg px-3 py-2 mb-3">
              <Text className="text-blue-800 text-xs text-center">
                💡 Pinch to zoom • Double-tap to reset zoom
              </Text>
            </View>
          )}

          {/* Status/Result Display */}
          {points.length === 0 && (
            <View className="flex-row items-center">
              <Ionicons name="finger-print-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium">
                {mode === 'distance' ? 'Hold for 2s to place points (need 2)' : 'Hold for 2s to place points (need 3)'}
              </Text>
            </View>
          )}
          
          {mode === 'distance' && points.length === 1 && (
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-blue-500" />
              <Text className="ml-3 text-gray-700 font-medium">
                Hold for 2s to place second point
              </Text>
            </View>
          )}

          {mode === 'angle' && points.length > 0 && points.length < 3 && (
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500" />
              <Text className="ml-3 text-gray-700 font-medium">
                {points.length === 1 ? 'Hold for 2s on vertex (center) point' : 'Hold for 2s to place third point'}
              </Text>
            </View>
          )}
          
          {hasCompleteMeasurement && (
            <>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm capitalize">{mode}</Text>
                  <Text className="text-gray-900 font-bold text-lg">
                    {mode === 'distance' 
                      ? calculateDistance(points[0], points[1])
                      : calculateAngle(points[0], points[1], points[2])}
                  </Text>
                </View>
                
                <Pressable
                  onPress={handleClear}
                  className="bg-gray-100 rounded-xl px-4 py-3"
                >
                  <Text className="text-gray-700 font-semibold">New</Text>
                </Pressable>
              </View>

              {/* Export Buttons */}
              <View className="flex-row space-x-2 pt-3 border-t border-gray-200">
                <Pressable
                  onPress={handleExport}
                  className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"
                >
                  <Ionicons name="save-outline" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">Save to Photos</Text>
                </Pressable>
                
                <Pressable
                  onPress={handleReset}
                  className="bg-red-500 rounded-xl px-6 py-3 flex-row items-center justify-center"
                >
                  <Ionicons name="refresh-outline" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">Reset</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
}
