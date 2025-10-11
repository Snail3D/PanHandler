import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, Alert, TouchableWithoutFeedback } from 'react-native';
import { Svg, Line, Circle, Path } from 'react-native-svg';
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
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const [mode, setMode] = useState<MeasurementMode>('distance');
  const viewRef = useRef<View>(null);
  
  const calibration = useStore((s) => s.calibration);
  const unitSystem = useStore((s) => s.unitSystem);
  const currentImageUri = useStore((s) => s.currentImageUri);
  const coinCircle = useStore((s) => s.coinCircle);

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const imageX = (locationX - zoomTranslateX) / zoomScale;
    const imageY = (locationY - zoomTranslateY) / zoomScale;
    const requiredPoints = mode === 'distance' ? 2 : 3;
    
    if (points.length >= requiredPoints) {
      setPoints([{ x: imageX, y: imageY, id: Date.now().toString() }]);
    } else {
      setPoints([...points, { x: imageX, y: imageY, id: Date.now().toString() }]);
    }
  };

  const handleClear = () => setPoints([]);

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const pixelDistance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    if (!calibration) return `${pixelDistance.toFixed(0)} px`;
    const realDistance = pixelDistance / calibration.pixelsPerUnit;
    return formatMeasurement(realDistance, calibration.unit, unitSystem, 2);
  };

  const calculateAngle = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = Math.abs((angle2 - angle1) * (180 / Math.PI));
    if (angle > 180) angle = 360 - angle;
    return `${angle.toFixed(1)}°`;
  };

  const getMidpoint = (p1: { x: number; y: number }, p2: { x: number; y: number }) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to save images.');
        return;
      }
      const uri = await captureRef(viewRef.current, { format: 'jpg', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success', 'Measurement saved to Photos!');
    } catch (error) {
      Alert.alert('Save Error', 'Failed to save image. Please try again.');
    }
  };

  const handleReset = () => {
    Alert.alert('Reset Measurements', 'This will clear all measurements and return to the camera. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        useStore.getState().setImageUri(null);
        useStore.getState().setCoinCircle(null);
        useStore.getState().setCalibration(null);
      }}
    ]);
  };

  const hasCompleteMeasurement = (mode === 'distance' && points.length === 2) || (mode === 'angle' && points.length === 3);

  // Transform to screen coordinates
  const screenCoinCircle = coinCircle ? {
    cx: coinCircle.centerX * zoomScale + zoomTranslateX,
    cy: coinCircle.centerY * zoomScale + zoomTranslateY,
    r: coinCircle.radius * zoomScale,
  } : null;

  const screenPoints = points.map(p => ({
    id: p.id,
    x: p.x * zoomScale + zoomTranslateX,
    y: p.y * zoomScale + zoomTranslateY,
  }));

  const labelPos = hasCompleteMeasurement ? (
    mode === 'distance' ? {
      x: ((points[0].x + points[1].x) / 2) * zoomScale + zoomTranslateX - 50,
      y: ((points[0].y + points[1].y) / 2) * zoomScale + zoomTranslateY - 40,
    } : {
      x: points[1].x * zoomScale + zoomTranslateX - 50,
      y: points[1].y * zoomScale + zoomTranslateY - 60,
    }
  ) : null;

  return (
    <>
      <View ref={viewRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
              {screenCoinCircle && <Circle cx={screenCoinCircle.cx} cy={screenCoinCircle.cy} r={screenCoinCircle.r} stroke="#F59E0B" strokeWidth="2" fill="none" strokeDasharray="8,4" opacity={0.6} />}
              {mode === 'distance' && screenPoints.length === 2 && (
                <>
                  <Line x1={screenPoints[0].x} y1={screenPoints[0].y} x2={screenPoints[1].x} y2={screenPoints[1].y} stroke="#3B82F6" strokeWidth="3" />
                  <Line x1={screenPoints[0].x} y1={screenPoints[0].y - 10} x2={screenPoints[0].x} y2={screenPoints[0].y + 10} stroke="#3B82F6" strokeWidth="2" />
                  <Line x1={screenPoints[1].x} y1={screenPoints[1].y - 10} x2={screenPoints[1].x} y2={screenPoints[1].y + 10} stroke="#3B82F6" strokeWidth="2" />
                </>
              )}
              {mode === 'angle' && screenPoints.length >= 2 && (
                <>
                  <Line x1={screenPoints[1].x} y1={screenPoints[1].y} x2={screenPoints[0].x} y2={screenPoints[0].y} stroke="#10B981" strokeWidth="3" />
                  {screenPoints.length === 3 && (
                    <>
                      <Line x1={screenPoints[1].x} y1={screenPoints[1].y} x2={screenPoints[2].x} y2={screenPoints[2].y} stroke="#10B981" strokeWidth="3" />
                      <Path d={generateArcPath(screenPoints[0], screenPoints[1], screenPoints[2])} stroke="#10B981" strokeWidth="2" fill="none" />
                    </>
                  )}
                </>
              )}
              {screenPoints.map((p, i) => <Circle key={p.id} cx={p.x} cy={p.y} r="8" fill={mode === 'distance' ? '#3B82F6' : i === 1 ? '#059669' : '#10B981'} stroke="white" strokeWidth="3" />)}
            </Svg>
            {labelPos && (
              <View style={{ position: 'absolute', left: labelPos.x, top: labelPos.y, backgroundColor: mode === 'distance' ? '#3B82F6' : '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} pointerEvents="none">
                <Text className="text-white font-bold text-base">{mode === 'distance' ? calculateDistance(points[0], points[1]) : calculateAngle(points[0], points[1], points[2])}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View className="absolute left-0 right-0 z-20" style={{ bottom: insets.bottom + 20, paddingHorizontal: 20 }}>
        <View className="bg-white/95 rounded-2xl px-6 py-4 shadow-lg">
          <View className="flex-row mb-3 bg-gray-100 rounded-lg p-1">
            <Pressable onPress={() => { setMode('distance'); setPoints([]); }} className={`flex-1 py-2 rounded-md ${mode === 'distance' ? 'bg-white' : ''}`}>
              <Text className={`text-center font-semibold ${mode === 'distance' ? 'text-blue-600' : 'text-gray-600'}`}>Distance</Text>
            </Pressable>
            <Pressable onPress={() => { setMode('angle'); setPoints([]); }} className={`flex-1 py-2 rounded-md ${mode === 'angle' ? 'bg-white' : ''}`}>
              <Text className={`text-center font-semibold ${mode === 'angle' ? 'text-green-600' : 'text-gray-600'}`}>Angle</Text>
            </Pressable>
          </View>
          {points.length === 0 && <View className="bg-blue-50 rounded-lg px-3 py-2 mb-3"><Text className="text-blue-800 text-xs text-center">💡 Pinch to zoom • Double-tap to reset</Text></View>}
          {points.length === 0 && <View className="flex-row items-center"><Ionicons name="hand-left-outline" size={20} color="#6B7280" /><Text className="ml-3 text-gray-700 font-medium">{mode === 'distance' ? 'Tap two points to measure distance' : 'Tap three points to measure angle'}</Text></View>}
          {mode === 'distance' && points.length === 1 && <View className="flex-row items-center"><View className="w-3 h-3 rounded-full bg-blue-500" /><Text className="ml-3 text-gray-700 font-medium">Tap second point to complete</Text></View>}
          {mode === 'angle' && points.length > 0 && points.length < 3 && <View className="flex-row items-center"><View className="w-3 h-3 rounded-full bg-green-500" /><Text className="ml-3 text-gray-700 font-medium">{points.length === 1 ? 'Tap vertex (center) point' : 'Tap third point to complete'}</Text></View>}
          {hasCompleteMeasurement && (
            <>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm capitalize">{mode}</Text>
                  <Text className="text-gray-900 font-bold text-lg">{mode === 'distance' ? calculateDistance(points[0], points[1]) : calculateAngle(points[0], points[1], points[2])}</Text>
                </View>
                <Pressable onPress={handleClear} className="bg-gray-100 rounded-xl px-4 py-3"><Text className="text-gray-700 font-semibold">New</Text></Pressable>
              </View>
              <View className="flex-row space-x-2 pt-3 border-t border-gray-200">
                <Pressable onPress={handleExport} className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"><Ionicons name="save-outline" size={18} color="white" /><Text className="text-white font-semibold ml-2">Save to Photos</Text></Pressable>
                <Pressable onPress={handleReset} className="bg-red-500 rounded-xl px-6 py-3 flex-row items-center justify-center"><Ionicons name="refresh-outline" size={18} color="white" /><Text className="text-white font-semibold ml-2">Reset</Text></Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
}
