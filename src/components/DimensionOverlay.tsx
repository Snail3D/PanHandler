import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, Alert, Linking, ScrollView } from 'react-native';
import { Svg, Line, Circle, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as MailComposer from 'expo-mail-composer';
import * as Haptics from 'expo-haptics';
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
  viewRef?: React.RefObject<View>;
}

export default function DimensionOverlay({ 
  zoomScale = 1, 
  zoomTranslateX = 0, 
  zoomTranslateY = 0,
  viewRef: externalViewRef
}: DimensionOverlayProps = {}) {
  const insets = useSafeAreaInsets();
  
  const [mode, setMode] = useState<MeasurementMode>('distance');
  const internalViewRef = useRef<View>(null);
  const viewRef = externalViewRef || internalViewRef; // Use external ref if provided
  
  // Lock-in animation
  const lockInOpacity = useSharedValue(0);
  const lockInScale = useSharedValue(1);
  
  // Use store for persistent state
  const calibration = useStore((s) => s.calibration);
  const unitSystem = useStore((s) => s.unitSystem);
  const currentImageUri = useStore((s) => s.currentImageUri);
  const coinCircle = useStore((s) => s.coinCircle);
  const currentPoints = useStore((s) => s.currentPoints);
  const setCurrentPoints = useStore((s) => s.setCurrentPoints);
  const measurements = useStore((s) => s.completedMeasurements);
  const setMeasurements = useStore((s) => s.setCompletedMeasurements);

  // Helper to convert screen coordinates to original image coordinates
  const screenToImage = (screenX: number, screenY: number) => {
    // screen = original * scale + translate, so: original = (screen - translate) / scale
    const imageX = (screenX - zoomTranslateX) / zoomScale;
    const imageY = (screenY - zoomTranslateY) / zoomScale;
    return { x: imageX, y: imageY };
  };

  // Helper to convert original image coordinates to screen coordinates
  const imageToScreen = (imageX: number, imageY: number) => {
    // screen = original * scale + translate
    const screenX = imageX * zoomScale + zoomTranslateX;
    const screenY = imageY * zoomScale + zoomTranslateY;
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
    console.log('🎯 Placing point:');
    console.log('  Screen coords:', x, y);
    console.log('  Image coords:', imageCoords.x.toFixed(1), imageCoords.y.toFixed(1));
    console.log('  Current zoom:', zoomScale.toFixed(2), 'translate:', zoomTranslateX.toFixed(0), zoomTranslateY.toFixed(0));
    
    const requiredPoints = mode === 'distance' ? 2 : 3;
    const newPoint = { x: imageCoords.x, y: imageCoords.y, id: Date.now().toString() };
    
    // Auto-enable measurement mode and lock pan/zoom after first point
    if (currentPoints.length === 0 && measurements.length === 0) {
      setMeasurementMode(true);
    }
    
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

  const [showLockedInAnimation, setShowLockedInAnimation] = useState(false);

  // Show locked-in animation when coin circle first appears
  useEffect(() => {
    if (coinCircle && !showLockedInAnimation) {
      setShowLockedInAnimation(true);
      
      // Double haptic feedback for "Locked In!"
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => {
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 100);
      });
      
      // Green blink animation (3 blinks)
      lockInOpacity.value = 0;
      lockInScale.value = 1;
      
      const blink = () => {
        lockInOpacity.value = withTiming(1, { duration: 150 }, () => {
          lockInOpacity.value = withTiming(0, { duration: 150 });
        });
        lockInScale.value = withTiming(1.2, { duration: 150 }, () => {
          lockInScale.value = withTiming(1, { duration: 150 });
        });
      };
      
      blink();
      setTimeout(blink, 350);
      setTimeout(blink, 700);
      
      // Hide animation after blinking
      setTimeout(() => {
        setShowLockedInAnimation(false);
      }, 1200);
    }
  }, [coinCircle]);

  // Measurement mode toggle
  const [measurementMode, setMeasurementMode] = useState(false); // false = pan/zoom, true = place points
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [lastHapticPosition, setLastHapticPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const cursorOffsetY = 120;
  const HAPTIC_DISTANCE = 20;

  const handleClear = () => {
    // Remove one measurement at a time (last first)
    if (measurements.length > 0) {
      setMeasurements(measurements.slice(0, -1));
    } else if (currentPoints.length > 0) {
      // If no completed measurements, clear current points
      setCurrentPoints([]);
    }
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
      // Check if email is available
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Email Not Available', 'No email app is configured on this device.');
        return;
      }

      // Capture the image with measurements
      const uri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 1,
      });

      // Build measurement text - one per line
      let measurementText = 'Measurements:\n\n';
      measurements.forEach((m, idx) => {
        measurementText += `${idx + 1}. ${m.value}\n`;
      });

      // Compose email with attachment
      await MailComposer.composeAsync({
        subject: 'Measurement Results',
        body: measurementText,
        attachments: [uri],
      });
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
  
  // Lock pan/zoom once any points are placed
  const isPanZoomLocked = hasAnyMeasurements;
  
  // Menu minimization
  const [menuMinimized, setMenuMinimized] = useState(false);

  return (
    <>
      {/* Sexy iOS-styled minimize button */}
      <Pressable
        onPress={() => {
          setMenuMinimized(!menuMinimized);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        className="absolute z-30"
        style={{ 
          bottom: menuMinimized ? insets.bottom + 20 : insets.bottom + 20,
          left: '50%',
          marginLeft: -35,
        }}
      >
        <View className="bg-white rounded-full shadow-2xl" style={{ 
          width: 70, 
          height: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)',
        }}>
          {menuMinimized ? (
            <View className="items-center">
              <Ionicons name="menu" size={28} color="#007AFF" />
              <Text style={{ fontSize: 8, color: '#007AFF', fontWeight: '600', marginTop: 2 }}>MENU</Text>
            </View>
          ) : (
            <View className="items-center">
              <Ionicons name="chevron-down" size={20} color="#8E8E93" />
              <View className="w-8 h-1 bg-gray-300 rounded-full mt-1" />
            </View>
          )}
        </View>
      </Pressable>

      {/* Touch overlay - only active in measurement mode */}
      {measurementMode && (
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            console.log('👆 Touch started - activating cursor');
            setShowCursor(true);
            setCursorPosition({ x: pageX, y: pageY - cursorOffsetY });
            setLastHapticPosition({ x: pageX, y: pageY });
            
            // Haptic for activation
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onResponderMove={(event) => {
            const touch = event.nativeEvent.touches[0];
            if (!touch) return;
            
            const { pageX, pageY } = touch;
            
            // Update cursor
            setCursorPosition({ x: pageX, y: pageY - cursorOffsetY });
            
            // Haptic feedback every 20px
            const distance = Math.sqrt(
              Math.pow(pageX - lastHapticPosition.x, 2) + 
              Math.pow(pageY - lastHapticPosition.y, 2)
            );
            if (distance >= HAPTIC_DISTANCE) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setLastHapticPosition({ x: pageX, y: pageY });
            }
          }}
          onResponderRelease={() => {
            console.log('✅ Touch released - placing point and hiding cursor');
            placePoint(cursorPosition.x, cursorPosition.y);
            setShowCursor(false);
            
            // Success haptic
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        />
      )}

      {/* Floating cursor container */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }} pointerEvents="none">
        {/* Floating cursor */}
        {showCursor && (
          <View
            style={{
              position: 'absolute',
              left: cursorPosition.x - 50,
              top: cursorPosition.y - 50,
              width: 100,
              height: 100,
            }}
            pointerEvents="none"
          >
            <Svg width={100} height={100}>
              <Circle cx={50} cy={50} r={30} fill="none" stroke={mode === 'distance' ? '#3B82F6' : '#10B981'} strokeWidth="3" opacity={0.8} />
              <Circle cx={50} cy={50} r={15} fill={mode === 'distance' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'} stroke={mode === 'distance' ? '#3B82F6' : '#10B981'} strokeWidth="2" />
              <Line x1={10} y1={50} x2={35} y2={50} stroke={mode === 'distance' ? '#3B82F6' : '#10B981'} strokeWidth="2" />
              <Line x1={65} y1={50} x2={90} y2={50} stroke={mode === 'distance' ? '#3B82F6' : '#10B981'} strokeWidth="2" />
              <Line x1={50} y1={10} x2={50} y2={35} stroke={mode === 'distance' ? '#3B82F6' : '#10B981'} strokeWidth="2" />
              <Line x1={50} y1={65} x2={50} y2={90} stroke={mode === 'distance' ? '#3B82F6' : '#10B981'} strokeWidth="2" />
              <Circle cx={50} cy={50} r={3} fill={mode === 'distance' ? '#3B82F6' : '#10B981'} />
            </Svg>
            <View style={{ position: 'absolute', top: -35, left: 0, right: 0, backgroundColor: mode === 'distance' ? '#3B82F6' : '#10B981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Release to place</Text>
            </View>
          </View>
        )}
      </View>

      {/* Visual overlay for measurements */}
      <View
        ref={viewRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        {/* SVG overlay for drawing */}
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
            {/* Lock-in animation - green blinking circle (only shows during animation) */}
            {showLockedInAnimation && coinCircle && (() => {
              const screenPos = imageToScreen(coinCircle.centerX, coinCircle.centerY);
              const screenRadius = coinCircle.radius * zoomScale;
              
              return (
                <>
                  {/* Animated green circle that blinks */}
                  <Circle
                    cx={screenPos.x}
                    cy={screenPos.y}
                    r={screenRadius}
                    fill="rgba(0, 255, 65, 0.5)"
                    stroke="#00FF41"
                    strokeWidth="3"
                  />
                  <Circle
                    cx={screenPos.x}
                    cy={screenPos.y}
                    r="4"
                    fill="#00FF41"
                  />
                </>
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

          {/* "Locked In!" message during animation */}
          {showLockedInAnimation && (
            <View
              style={{
                position: 'absolute',
                top: SCREEN_HEIGHT / 2 - 100,
                left: SCREEN_WIDTH / 2 - 80,
                width: 160,
                backgroundColor: '#00FF41',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              pointerEvents="none"
            >
              <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                ✓ Locked In!
              </Text>
            </View>
          )}

          {/* Measurement labels for completed measurements */}
          {measurements.map((measurement, idx) => {
            let screenX, screenY;
            if (measurement.mode === 'distance') {
              const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
              const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
              screenX = (p0.x + p1.x) / 2;
              screenY = (p0.y + p1.y) / 2 - 50;
            } else {
              const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
              screenX = p1.x;
              screenY = p1.y - 70;
            }
            
            return (
              <View
                key={measurement.id}
                style={{
                  position: 'absolute',
                  left: screenX - 60,
                  top: screenY,
                  alignItems: 'center',
                }}
                pointerEvents="none"
              >
                {/* Small number badge */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {idx + 1}
                  </Text>
                </View>
                {/* Measurement value */}
                <View
                  style={{
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
                >
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                    {measurement.value}
                  </Text>
                </View>
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

      {/* Bottom toolbar */}
      {!menuMinimized && (
        <View
          className="absolute left-0 right-0 z-20"
          style={{ 
            bottom: insets.bottom + 110,
            paddingHorizontal: 16,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.04)',
          }}>
          {/* Mode Toggle: Pan/Zoom vs Measure */}
          <View className="flex-row mb-4" style={{ backgroundColor: '#F2F2F7', borderRadius: 14, padding: 4 }}>
            <Pressable
              onPress={() => {
                if (isPanZoomLocked) return;
                setMeasurementMode(false);
                setShowCursor(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              disabled={isPanZoomLocked}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 11,
                backgroundColor: !measurementMode ? '#FFFFFF' : 'transparent',
                opacity: isPanZoomLocked ? 0.5 : 1,
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name={isPanZoomLocked ? "lock-closed" : "move-outline"}
                  size={18} 
                  color={isPanZoomLocked ? '#8E8E93' : (!measurementMode ? '#007AFF' : '#8E8E93')} 
                />
                <Text style={{
                  marginLeft: 6,
                  fontWeight: '600',
                  fontSize: 15,
                  color: isPanZoomLocked ? '#8E8E93' : (!measurementMode ? '#007AFF' : '#8E8E93')
                }}>
                  {isPanZoomLocked ? 'Locked' : 'Pan/Zoom'}
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setMeasurementMode(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 11,
                backgroundColor: measurementMode ? '#FFFFFF' : 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name="create-outline" 
                  size={18} 
                  color={measurementMode ? '#34C759' : '#8E8E93'} 
                />
                <Text style={{
                  marginLeft: 6,
                  fontWeight: '600',
                  fontSize: 15,
                  color: measurementMode ? '#34C759' : '#8E8E93'
                }}>
                  Measure
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Measurement Type Toggle */}
          <View className="flex-row mb-4" style={{ backgroundColor: '#F2F2F7', borderRadius: 14, padding: 4 }}>
            <Pressable
              onPress={() => {
                setMode('distance');
                setCurrentPoints([]);
                setMeasurementMode(true); // Auto-enable measurement mode
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                setMeasurementMode(true); // Auto-enable measurement mode
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 py-2 rounded-md ${mode === 'angle' ? 'bg-white' : ''}`}
            >
              <Text className={`text-center font-semibold ${mode === 'angle' ? 'text-green-600' : 'text-gray-600'}`}>
                Angle
              </Text>
            </Pressable>
          </View>

          {/* Tip */}
          {measurements.length === 0 && currentPoints.length === 0 && (
            <View className={`${measurementMode ? 'bg-green-50' : 'bg-blue-50'} rounded-lg px-3 py-2 mb-3`}>
              <Text className={`${measurementMode ? 'text-green-800' : 'text-blue-800'} text-xs text-center`}>
                {measurementMode 
                  ? '💡 Tap to place points • Pan/zoom will lock after first point'
                  : '💡 Pinch to zoom • Drag to pan • Switch to Measure to begin'
                }
              </Text>
            </View>
          )}
          
          {/* Locked notice */}
          {isPanZoomLocked && (
            <View className="bg-amber-50 rounded-lg px-3 py-2 mb-3">
              <Text className="text-amber-800 text-xs text-center">
                🔒 Pan/zoom locked • Remove all measurements to unlock
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
          {currentPoints.length === 0 && measurements.length === 0 && measurementMode && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="finger-print-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium flex-1">
                {mode === 'distance' ? 'Tap to place 2 points' : 'Tap to place 3 points (vertex in center)'}
              </Text>
            </View>
          )}
          
          {currentPoints.length > 0 && currentPoints.length < requiredPoints && (
            <View className="flex-row items-center mb-3">
              <View className={`w-3 h-3 rounded-full ${mode === 'distance' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <Text className="ml-3 text-gray-700 font-medium">
                {mode === 'distance' && currentPoints.length === 1 && 'Tap for point 2'}
                {mode === 'angle' && currentPoints.length === 1 && 'Tap on vertex (center point)'}
                {mode === 'angle' && currentPoints.length === 2 && 'Tap for point 3'}
              </Text>
            </View>
          )}
          
          {/* Action Buttons */}
          {hasAnyMeasurements && (
            <>
              <Pressable
                onPress={handleClear}
                className="bg-gray-100 rounded-xl py-3 mb-3 flex-row items-center justify-center"
              >
                <Ionicons name="arrow-undo-outline" size={18} color="#374151" />
                <Text className="text-gray-700 font-semibold ml-2">
                  {measurements.length > 0 
                    ? `Remove Last (${measurements.length} total)` 
                    : 'Clear Points'}
                </Text>
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
      )}
    </>
  );
}
