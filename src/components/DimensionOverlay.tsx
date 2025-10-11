import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, Alert, Linking, ScrollView } from 'react-native';
import { Svg, Line, Circle, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import useStore from '../state/measurementStore';
import { formatMeasurement } from '../utils/unitConversion';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MeasurementMode = 'distance' | 'angle';

interface Measurement {
  id: string;
  points: Array<{ x: number; y: number }>;
  value: string;
  mode: MeasurementMode;
}

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
  
  // Current points being placed (in ORIGINAL image coordinates)
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number; id: string }>>([]);
  
  // Completed measurements
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  
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
    // Transform order: translate then scale, so inverse is: unscale then untranslate
    const imageX = (screenX / zoomScale) - zoomTranslateX;
    const imageY = (screenY / zoomScale) - zoomTranslateY;
    return { x: imageX, y: imageY };
  };

  // Helper to convert original image coordinates to screen coordinates
  const imageToScreen = (imageX: number, imageY: number) => {
    // Transform order: translate then scale
    const screenX = (imageX + zoomTranslateX) * zoomScale;
    const screenY = (imageY + zoomTranslateY) * zoomScale;
    return { x: screenX, y: screenY };
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

  const placePoint = (x: number, y: number) => {
    // Convert screen tap to original image coordinates
    const imageCoords = screenToImage(x, y);
    
    const requiredPoints = mode === 'distance' ? 2 : 3;
    const newPoint = { x: imageCoords.x, y: imageCoords.y, id: Date.now().toString() };
    
    if (currentPoints.length + 1 < requiredPoints) {
      // Still need more points
      setCurrentPoints([...currentPoints, newPoint]);
    } else {
      // This completes a measurement
      const completedPoints = [...currentPoints, newPoint];
      
      // Calculate measurement value
      let value: string;
      if (mode === 'distance') {
        value = calculateDistance(completedPoints[0], completedPoints[1]);
      } else {
        value = calculateAngle(completedPoints[0], completedPoints[1], completedPoints[2]);
      }
      
      // Save as completed measurement
      const newMeasurement: Measurement = {
        id: Date.now().toString(),
        points: completedPoints.map(p => ({ x: p.x, y: p.y })),
        value,
        mode,
      };
      
      setMeasurements([...measurements, newMeasurement]);
      setCurrentPoints([]); // Reset for next measurement
    }
  };

  const [placementMode, setPlacementMode] = useState(false);

  // Long press state management
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressStart, setLongPressStart] = useState<{x: number, y: number} | null>(null);

  const handlePressIn = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setLongPressStart({ x: locationX, y: locationY });
    pressX.value = locationX;
    pressY.value = locationY;
    setShowPressIndicator(true);
    pressProgress.value = withTiming(1, { duration: 1500 });
    
    const timer = setTimeout(() => {
      placePoint(locationX, locationY);
      setShowPressIndicator(false);
      pressProgress.value = 0;
      setLongPressStart(null);
    }, 1500);
    
    setLongPressTimer(timer);
  };

  const handlePressOut = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setShowPressIndicator(false);
    pressProgress.value = 0;
    setLongPressStart(null);
  };

  // Animated style for press indicator
  const pressIndicatorStyle = useAnimatedStyle(() => {
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
    setCurrentPoints([]);
    setMeasurements([]);
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

  const handleEmail = async () => {
    if (!viewRef.current || !currentImageUri) return;

    try {
      // Capture the image with measurements
      const uri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 1,
      });

      // Build measurement text
      let measurementText = 'Measurements:\\n\\n';
      measurements.forEach((m, idx) => {
        measurementText += `${idx + 1}. ${m.value}\\n`;
      });

      const subject = 'Measurement Results';
      const body = measurementText;

      // Create mailto link
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const canOpen = await Linking.canOpenURL(mailto);
      if (canOpen) {
        await Linking.openURL(mailto);
      } else {
        Alert.alert('Error', 'Cannot open email app');
      }
    } catch (error) {
      Alert.alert('Email Error', 'Failed to prepare email. Please try again.');
      console.error('Email error:', error);
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

  const hasAnyMeasurements = measurements.length > 0 || currentPoints.length > 0;
  const requiredPoints = mode === 'distance' ? 2 : 3;

  return (
    <>
      {/* Touch overlay - only active in placement mode */}
      {placementMode ? (
        <View 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(evt) => {
            const touch = evt.nativeEvent.touches[0];
            handlePressIn({ nativeEvent: { locationX: touch.pageX, locationY: touch.pageY } });
          }}
          onResponderRelease={handlePressOut}
          onResponderTerminate={handlePressOut}
        >
          {showPressIndicator && (
            <Animated.View style={pressIndicatorStyle} pointerEvents="none" />
          )}
        </View>
      ) : (
        <View 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        >
          {showPressIndicator && (
            <Animated.View style={pressIndicatorStyle} pointerEvents="none" />
          )}
        </View>
      )}

      {/* Visual overlay - no touch interaction */}
      <View
        ref={viewRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        {/* SVG overlay for drawing */}
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
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

            {/* Draw completed measurements */}
            {measurements.map((measurement, idx) => {
              if (measurement.mode === 'distance') {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                const midX = (p0.x + p1.x) / 2;
                const midY = (p0.y + p1.y) / 2;
                
                return (
                  <React.Fragment key={measurement.id}>
                    <Line
                      x1={p0.x}
                      y1={p0.y}
                      x2={p1.x}
                      y2={p1.y}
                      stroke="#3B82F6"
                      strokeWidth="3"
                    />
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
                    <Circle cx={p0.x} cy={p0.y} r="8" fill="#3B82F6" stroke="white" strokeWidth="3" />
                    <Circle cx={p1.x} cy={p1.y} r="8" fill="#3B82F6" stroke="white" strokeWidth="3" />
                  </React.Fragment>
                );
              } else {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                const p2 = imageToScreen(measurement.points[2].x, measurement.points[2].y);
                
                return (
                  <React.Fragment key={measurement.id}>
                    <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke="#10B981" strokeWidth="3" />
                    <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#10B981" strokeWidth="3" />
                    <Path d={generateArcPath(p0, p1, p2)} stroke="#10B981" strokeWidth="2" fill="none" />
                    <Circle cx={p0.x} cy={p0.y} r="8" fill="#10B981" stroke="white" strokeWidth="3" />
                    <Circle cx={p1.x} cy={p1.y} r="8" fill="#059669" stroke="white" strokeWidth="3" />
                    <Circle cx={p2.x} cy={p2.y} r="8" fill="#10B981" stroke="white" strokeWidth="3" />
                  </React.Fragment>
                );
              }
            })}

            {/* Draw current points being placed */}
            {mode === 'distance' && currentPoints.length === 2 && (() => {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              return (
                <>
                  <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#3B82F6" strokeWidth="3" />
                  <Line x1={p0.x} y1={p0.y - 10} x2={p0.x} y2={p0.y + 10} stroke="#3B82F6" strokeWidth="2" />
                  <Line x1={p1.x} y1={p1.y - 10} x2={p1.x} y2={p1.y + 10} stroke="#3B82F6" strokeWidth="2" />
                </>
              );
            })()}

            {mode === 'angle' && currentPoints.length >= 2 && (() => {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              const p2 = currentPoints.length === 3 ? imageToScreen(currentPoints[2].x, currentPoints[2].y) : null;
              
              return (
                <>
                  <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke="#10B981" strokeWidth="3" />
                  {p2 && (
                    <>
                      <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#10B981" strokeWidth="3" />
                      <Path d={generateArcPath(p0, p1, p2)} stroke="#10B981" strokeWidth="2" fill="none" />
                    </>
                  )}
                </>
              );
            })()}

            {/* Draw current point markers */}
            {currentPoints.map((point, index) => {
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

          {/* Measurement labels for completed measurements */}
          {measurements.map((measurement, idx) => {
            let screenX, screenY;
            if (measurement.mode === 'distance') {
              const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
              const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
              screenX = (p0.x + p1.x) / 2 - 50;
              screenY = (p0.y + p1.y) / 2 - 40;
            } else {
              const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
              screenX = p1.x - 50;
              screenY = p1.y - 60;
            }
            
            return (
              <View
                key={measurement.id}
                style={{
                  position: 'absolute',
                  left: screenX,
                  top: screenY,
                  backgroundColor: measurement.mode === 'distance' ? '#3B82F6' : '#10B981',
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
                <Text className="text-white font-bold text-sm">
                  {idx + 1}. {measurement.value}
                </Text>
              </View>
            );
          })}

          {/* Label for current measurement in progress */}
          {currentPoints.length === requiredPoints && (() => {
            let screenX, screenY, value;
            if (mode === 'distance') {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              screenX = (p0.x + p1.x) / 2 - 50;
              screenY = (p0.y + p1.y) / 2 - 40;
              value = calculateDistance(currentPoints[0], currentPoints[1]);
            } else {
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              screenX = p1.x - 50;
              screenY = p1.y - 60;
              value = calculateAngle(currentPoints[0], currentPoints[1], currentPoints[2]);
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
                  {value}
                </Text>
              </View>
            );
          })()}
      </View>

      {/* Floating placement mode toggle button */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 80,
          right: 20,
        }}
      >
        <Pressable
          onPress={() => setPlacementMode(!placementMode)}
          className={`rounded-full w-14 h-14 items-center justify-center shadow-lg ${placementMode ? 'bg-blue-500' : 'bg-gray-700/80'}`}
        >
          <Ionicons 
            name={placementMode ? "hand-left" : "move"} 
            size={24} 
            color="white" 
          />
        </Pressable>
      </View>

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
                setCurrentPoints([]);
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
                setCurrentPoints([]);
              }}
              className={`flex-1 py-2 rounded-md ${mode === 'angle' ? 'bg-white' : ''}`}
            >
              <Text className={`text-center font-semibold ${mode === 'angle' ? 'text-green-600' : 'text-gray-600'}`}>
                Angle
              </Text>
            </Pressable>
          </View>

          {/* Zoom tip */}
          {measurements.length === 0 && currentPoints.length === 0 && (
            <View className="bg-blue-50 rounded-lg px-3 py-2 mb-3">
              <Text className="text-blue-800 text-xs text-center">
                {placementMode 
                  ? "📍 Placement Mode: Hold 1.5s to place point • Tap hand icon to zoom" 
                  : "💡 Tap hand icon to place points • Pinch to zoom • Double-tap to reset"}
              </Text>
            </View>
          )}

          {/* Measurements list */}
          {measurements.length > 0 && (
            <View className="mb-3 max-h-24">
              <ScrollView className="bg-gray-50 rounded-lg p-2">
                {measurements.map((m, idx) => (
                  <Text key={m.id} className="text-gray-700 text-sm mb-1">
                    {idx + 1}. {m.value}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Status/Result Display */}
          {currentPoints.length === 0 && measurements.length === 0 && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="finger-print-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium flex-1">
                {mode === 'distance' ? 'Hold 1.5s to place points (need 2)' : 'Hold 1.5s to place points (need 3)'}
              </Text>
            </View>
          )}
          
          {currentPoints.length > 0 && currentPoints.length < requiredPoints && (
            <View className="flex-row items-center mb-3">
              <View className={`w-3 h-3 rounded-full ${mode === 'distance' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <Text className="ml-3 text-gray-700 font-medium">
                {mode === 'distance' && currentPoints.length === 1 && 'Hold 1.5s for point 2'}
                {mode === 'angle' && currentPoints.length === 1 && 'Hold 1.5s on vertex (center)'}
                {mode === 'angle' && currentPoints.length === 2 && 'Hold 1.5s for point 3'}
              </Text>
            </View>
          )}
          
          {/* Action Buttons */}
          {hasAnyMeasurements && (
            <>
              <Pressable
                onPress={handleClear}
                className="bg-gray-100 rounded-xl py-3 mb-3"
              >
                <Text className="text-gray-700 font-semibold text-center">Clear All</Text>
              </Pressable>

              {measurements.length > 0 && (
                <View className="flex-row space-x-2 mb-3">
                  <Pressable
                    onPress={handleExport}
                    className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"
                  >
                    <Ionicons name="save-outline" size={18} color="white" />
                    <Text className="text-white font-semibold ml-2">Save</Text>
                  </Pressable>
                  
                  <Pressable
                    onPress={handleEmail}
                    className="flex-1 bg-green-500 rounded-xl py-3 flex-row items-center justify-center"
                  >
                    <Ionicons name="mail-outline" size={18} color="white" />
                    <Text className="text-white font-semibold ml-2">Email</Text>
                  </Pressable>
                </View>
              )}

              <Pressable
                onPress={handleReset}
                className="bg-red-500 rounded-xl py-3 flex-row items-center justify-center"
              >
                <Ionicons name="refresh-outline" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Reset</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </>
  );
}
