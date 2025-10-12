import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, Alert, Linking, ScrollView, TextInput, Modal, Image } from 'react-native';
import { Svg, Line, Circle, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as MailComposer from 'expo-mail-composer';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import useStore from '../state/measurementStore';
import { formatMeasurement } from '../utils/unitConversion';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Vibrant color palette for measurements (professional but fun)
const MEASUREMENT_COLORS = {
  distance: [
    { main: '#3B82F6', glow: '#3B82F6', name: 'Blue' },      // Classic blue
    { main: '#8B5CF6', glow: '#8B5CF6', name: 'Purple' },    // Vibrant purple
    { main: '#EC4899', glow: '#EC4899', name: 'Pink' },      // Hot pink
    { main: '#F59E0B', glow: '#F59E0B', name: 'Amber' },     // Warm amber
    { main: '#06B6D4', glow: '#06B6D4', name: 'Cyan' },      // Bright cyan
  ],
  angle: [
    { main: '#10B981', glow: '#10B981', name: 'Green' },     // Classic green
    { main: '#6366F1', glow: '#6366F1', name: 'Indigo' },    // Deep indigo
    { main: '#F43F5E', glow: '#F43F5E', name: 'Rose' },      // Vibrant rose
    { main: '#14B8A6', glow: '#14B8A6', name: 'Teal' },      // Fresh teal
    { main: '#A855F7', glow: '#A855F7', name: 'Violet' },    // Rich violet
  ],
};

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
  viewRef?: React.RefObject<View | null>;
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
  const setUnitSystem = useStore((s) => s.setUnitSystem);
  const currentImageUri = useStore((s) => s.currentImageUri);
  const coinCircle = useStore((s) => s.coinCircle);
  const currentPoints = useStore((s) => s.currentPoints);
  const setCurrentPoints = useStore((s) => s.setCurrentPoints);
  const measurements = useStore((s) => s.completedMeasurements);
  const setMeasurements = useStore((s) => s.setCompletedMeasurements);
  const userEmail = useStore((s) => s.userEmail);
  const setUserEmail = useStore((s) => s.setUserEmail);
  const isProUser = useStore((s) => s.isProUser);
  const setIsProUser = useStore((s) => s.setIsProUser);
  
  // Pro upgrade modal
  const [showProModal, setShowProModal] = useState(false);
  const [proTapCount, setProTapCount] = useState(0);
  const proTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get color for measurement based on index
  const getMeasurementColor = (index: number, measurementMode: MeasurementMode) => {
    const colors = MEASUREMENT_COLORS[measurementMode];
    return colors[index % colors.length];
  };

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
    // Check if user is trying to add more than 1 measurement without pro
    if (!isProUser && measurements.length >= 1 && currentPoints.length === 0) {
      // Show paywall modal
      setShowProModal(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
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
  const [hasShownAnimation, setHasShownAnimation] = useState(false);
  const prevZoomRef = useRef({ scale: zoomScale, x: zoomTranslateX, y: zoomTranslateY });

  // Detect pan/zoom changes and dismiss animation immediately
  useEffect(() => {
    const zoomChanged = 
      Math.abs(zoomScale - prevZoomRef.current.scale) > 0.01 ||
      Math.abs(zoomTranslateX - prevZoomRef.current.x) > 1 ||
      Math.abs(zoomTranslateY - prevZoomRef.current.y) > 1;
    
    if (zoomChanged && showLockedInAnimation) {
      console.log('🚫 Pan/zoom detected - dismissing lock-in animation');
      setShowLockedInAnimation(false);
    }
    
    prevZoomRef.current = { scale: zoomScale, x: zoomTranslateX, y: zoomTranslateY };
  }, [zoomScale, zoomTranslateX, zoomTranslateY, showLockedInAnimation]);

  // Show locked-in animation when coin circle first appears
  useEffect(() => {
    if (coinCircle && !hasShownAnimation) {
      setShowLockedInAnimation(true);
      setHasShownAnimation(true);
      
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
      
      // Auto-hide animation after blinking (if not dismissed by pan)
      setTimeout(() => {
        setShowLockedInAnimation(false);
      }, 1200);
    }
  }, [coinCircle, hasShownAnimation]);

  // Measurement mode toggle
  const [measurementMode, setMeasurementMode] = useState(false); // false = pan/zoom, true = place points
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [lastHapticPosition, setLastHapticPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const cursorOffsetY = 120;
  const HAPTIC_DISTANCE = 20;
  const MAGNIFICATION_SCALE = 1.2; // 20% zoom magnification

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
    if (!viewRef || !viewRef.current || !currentImageUri) {
      console.error('❌ Export failed: viewRef or currentImageUri is missing');
      Alert.alert('Export Error', 'Unable to capture measurement. Please try again.');
      return;
    }

    try {
      console.log('📸 Starting capture...');
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to save images.');
        return;
      }

      console.log('📸 Hiding menu and capturing view...');
      
      // Hide menu for capture
      setIsCapturing(true);
      
      // Wait a frame for the UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const uri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
      });

      console.log('📸 Captured URI:', uri);
      console.log('💾 Saving to library...');
      await MediaLibrary.saveToLibraryAsync(uri);
      
      // Show menu again
      setIsCapturing(false);
      
      console.log('✅ Save successful!');
      Alert.alert('Success', 'Measurement saved to Photos!');
      
      // Haptic feedback for success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setIsCapturing(false);
      console.error('❌ Export error:', error);
      Alert.alert('Save Error', `Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEmail = async () => {
    if (!viewRef || !viewRef.current || !currentImageUri) {
      console.error('❌ Email failed: viewRef or currentImageUri is missing');
      Alert.alert('Email Error', 'Unable to capture measurement. Please try again.');
      return;
    }
    
    // Check if user has multiple measurements without pro
    if (!isProUser && measurements.length > 1) {
      setShowProModal(true);
      return;
    }

    try {
      // Check if email is available
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Email Not Available', 'No email app is configured on this device.');
        return;
      }

      // Prompt for email if not set
      let emailToUse = userEmail;
      if (!emailToUse) {
        await new Promise<void>((resolve) => {
          Alert.prompt(
            'Email Address',
            'Enter your email address to auto-populate for future use:\n\n(This is secure and not shared with us or anyone. It is simply to make sending emails faster for you in the future)',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => resolve(),
              },
              {
                text: 'Save',
                onPress: (email) => {
                  if (email && email.trim()) {
                    emailToUse = email.trim();
                    setUserEmail(emailToUse);
                  }
                  resolve();
                },
              },
            ],
            'plain-text',
            '',
            'email-address'
          );
        });
      }

      console.log('📸 Hiding menu and capturing view for email...');
      
      // Hide menu for capture
      setIsCapturing(true);
      
      // Wait a frame for the UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the image with measurements
      const uri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
      });
      
      // Show menu again
      setIsCapturing(false);

      console.log('📸 Captured URI for email:', uri);

      // Build measurement text with scale information
      let measurementText = 'PanHandler Measurements\n';
      measurementText += '======================\n\n';
      
      // Add coin reference information at the top
      if (coinCircle) {
        measurementText += `Reference Coin: ${coinCircle.coinName}\n`;
        measurementText += `Coin Diameter: ${coinCircle.coinDiameter.toFixed(2)} mm\n\n`;
      }
      
      measurementText += `Unit System: ${unitSystem === 'metric' ? 'Metric' : 'Imperial'}\n\n`;
      measurementText += 'Measurements:\n';
      measurementText += '-------------\n';
      
      measurements.forEach((m, idx) => {
        measurementText += `${idx + 1}. ${m.value}\n`;
      });
      
      // Add calibration/scale information
      if (calibration) {
        measurementText += `\n---\nCalibration Info:\n`;
        measurementText += `Scale: ${calibration.pixelsPerUnit.toFixed(2)} pixels per ${calibration.unit}\n`;
        measurementText += `Reference Distance: ${calibration.referenceDistance.toFixed(2)} ${calibration.unit}`;
        if (coinCircle) {
          measurementText += ` (${coinCircle.coinName})`;
        }
        measurementText += `\n\nFor CAD/Design Software:\n`;
        measurementText += `Set scale to ${calibration.pixelsPerUnit.toFixed(2)} px/${calibration.unit}`;
      }

      console.log('📧 Opening email composer...');
      
      // Build recipients array - use saved email for both to/cc if available
      const recipients = emailToUse ? [emailToUse] : [];
      const ccRecipients = emailToUse ? [emailToUse] : [];
      
      // Compose email with attachment
      await MailComposer.composeAsync({
        recipients,
        ccRecipients,
        subject: 'PanHandler Measurements',
        body: measurementText,
        attachments: [uri],
      });
      
      console.log('✅ Email composer opened');
    } catch (error) {
      setIsCapturing(false);
      console.error('❌ Email error:', error);
      Alert.alert('Email Error', `Failed to prepare email: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  
  // Hide menu during capture
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Menu slide-to-hide with side tab
  const [menuHidden, setMenuHidden] = useState(false);
  const [tabSide, setTabSide] = useState<'left' | 'right'>('right'); // Which side the tab is on
  const menuTranslateX = useSharedValue(0);
  const tabPositionY = useSharedValue(SCREEN_HEIGHT / 2); // Draggable tab position
  
  // Animated style for menu sliding
  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: menuTranslateX.value }],
  }));
  
  // Animated style for tab position
  const tabAnimatedStyle = useAnimatedStyle(() => ({
    top: tabPositionY.value - 40, // Center the 80px tall tab
  }));
  
  // Pan gesture for sliding menu in/out
  const menuPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only respond to horizontal swipes
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        if (event.translationX < -50 && !menuHidden) {
          // Swipe left to hide (to right side)
          menuTranslateX.value = Math.max(event.translationX, -SCREEN_WIDTH);
        } else if (event.translationX > 50 && menuHidden && tabSide === 'right') {
          // Swipe right to show (from right side)
          menuTranslateX.value = Math.min(SCREEN_WIDTH + event.translationX, 0);
        }
      }
    })
    .onEnd((event) => {
      const threshold = SCREEN_WIDTH * 0.2;
      if (Math.abs(event.translationX) > threshold) {
        // Hide menu to the right
        menuTranslateX.value = withSpring(SCREEN_WIDTH, {}, () => {
          runOnJS(setMenuHidden)(true);
        });
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Show menu
        menuTranslateX.value = withSpring(0);
        runOnJS(setMenuHidden)(false);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    });
  
  // Drag gesture for repositioning tab vertically
  const tabDragGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = tabPositionY.value + event.translationY;
      // Keep tab within safe bounds
      tabPositionY.value = Math.max(insets.top + 80, Math.min(newY, SCREEN_HEIGHT - insets.bottom - 80));
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    });
  
  const toggleMenuFromTab = () => {
    if (menuHidden) {
      menuTranslateX.value = withSpring(0);
      setMenuHidden(false);
    } else {
      menuTranslateX.value = withSpring(SCREEN_WIDTH);
      setMenuHidden(true);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const collapseMenu = () => {
    menuTranslateX.value = withSpring(SCREEN_WIDTH);
    setMenuHidden(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <>
      {/* Persistent "Calibration Locked" indicator */}
      {coinCircle && !showLockedInAnimation && (
        <View 
          className="absolute z-20"
          style={{
            top: insets.top + 16,
            right: 16,
            backgroundColor: 'rgba(52, 199, 89, 0.9)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
          pointerEvents="none"
        >
          <Ionicons name="checkmark-circle" size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
            Calibrated
          </Text>
        </View>
      )}

      {/* Draggable side tab - appears when menu is hidden */}
      {menuHidden && !isCapturing && (
        <GestureDetector gesture={tabDragGesture}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                [tabSide]: 0,
                top: 0,
                zIndex: 25,
              },
              tabAnimatedStyle
            ]}
          >
            <Pressable
              onPress={toggleMenuFromTab}
              style={{
                width: 44,
                height: 80,
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                borderTopLeftRadius: tabSide === 'right' ? 16 : 0,
                borderBottomLeftRadius: tabSide === 'right' ? 16 : 0,
                borderTopRightRadius: tabSide === 'left' ? 16 : 0,
                borderBottomRightRadius: tabSide === 'left' ? 16 : 0,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: tabSide === 'right' ? -2 : 2, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                [tabSide === 'right' ? 'borderRightWidth' : 'borderLeftWidth']: 0,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Ionicons 
                  name={tabSide === 'right' ? 'chevron-back' : 'chevron-forward'} 
                  size={20} 
                  color="#007AFF" 
                />
                <View style={{ 
                  width: 24, 
                  height: 3, 
                  backgroundColor: 'rgba(0, 122, 255, 0.5)', 
                  borderRadius: 2,
                  marginTop: 4
                }} />
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      )}

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
              {/* Ultra-bright yellow center dot with bold black outline for maximum visibility */}
              {/* Outer black stroke layers for bold outline */}
              <Circle cx={50} cy={50} r={3} fill="#000000" opacity={1} />
              <Circle cx={50} cy={50} r={2.5} fill="#000000" opacity={1} />
              {/* Yellow glow layers */}
              <Circle cx={50} cy={50} r={6} fill="#FFFF00" opacity={0.2} />
              <Circle cx={50} cy={50} r={4} fill="#FFFF00" opacity={0.4} />
              {/* Core yellow dot - tiny for precision */}
              <Circle cx={50} cy={50} r={1.5} fill="#FFFFFF" opacity={1} />
              <Circle cx={50} cy={50} r={1.5} fill="#FFFF00" opacity={1} />
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
              const color = getMeasurementColor(idx, measurement.mode);
              
              if (measurement.mode === 'distance') {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                const midX = (p0.x + p1.x) / 2;
                const midY = (p0.y + p1.y) / 2;
                
                return (
                  <React.Fragment key={measurement.id}>
                    {/* Outer glow layers - multiple for smooth gradient */}
                    <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={color.glow} strokeWidth="12" opacity="0.15" strokeLinecap="round" />
                    <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={color.glow} strokeWidth="8" opacity="0.25" strokeLinecap="round" />
                    {/* Main line */}
                    <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={color.main} strokeWidth="4" strokeLinecap="round" />
                    {/* End caps with glow */}
                    <Line x1={p0.x} y1={p0.y - 12} x2={p0.x} y2={p0.y + 12} stroke={color.main} strokeWidth="3" strokeLinecap="round" />
                    <Line x1={p1.x} y1={p1.y - 12} x2={p1.x} y2={p1.y + 12} stroke={color.main} strokeWidth="3" strokeLinecap="round" />
                    {/* Point markers with layered glow */}
                    <Circle cx={p0.x} cy={p0.y} r="16" fill={color.main} opacity="0.1" />
                    <Circle cx={p0.x} cy={p0.y} r="12" fill={color.main} opacity="0.2" />
                    <Circle cx={p0.x} cy={p0.y} r="8" fill={color.main} stroke="white" strokeWidth="3" />
                    <Circle cx={p1.x} cy={p1.y} r="16" fill={color.main} opacity="0.1" />
                    <Circle cx={p1.x} cy={p1.y} r="12" fill={color.main} opacity="0.2" />
                    <Circle cx={p1.x} cy={p1.y} r="8" fill={color.main} stroke="white" strokeWidth="3" />
                  </React.Fragment>
                );
              } else {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                const p2 = imageToScreen(measurement.points[2].x, measurement.points[2].y);
                
                return (
                  <React.Fragment key={measurement.id}>
                    {/* Glow layers */}
                    <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke={color.glow} strokeWidth="12" opacity="0.15" strokeLinecap="round" />
                    <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke={color.glow} strokeWidth="8" opacity="0.25" strokeLinecap="round" />
                    <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color.glow} strokeWidth="12" opacity="0.15" strokeLinecap="round" />
                    <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color.glow} strokeWidth="8" opacity="0.25" strokeLinecap="round" />
                    {/* Main lines */}
                    <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke={color.main} strokeWidth="4" strokeLinecap="round" />
                    <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color.main} strokeWidth="4" strokeLinecap="round" />
                    <Path d={generateArcPath(p0, p1, p2)} stroke={color.main} strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Point markers with layered glow */}
                    <Circle cx={p0.x} cy={p0.y} r="16" fill={color.main} opacity="0.1" />
                    <Circle cx={p0.x} cy={p0.y} r="12" fill={color.main} opacity="0.2" />
                    <Circle cx={p0.x} cy={p0.y} r="8" fill={color.main} stroke="white" strokeWidth="3" />
                    <Circle cx={p1.x} cy={p1.y} r="18" fill={color.main} opacity="0.1" />
                    <Circle cx={p1.x} cy={p1.y} r="14" fill={color.main} opacity="0.2" />
                    <Circle cx={p1.x} cy={p1.y} r="10" fill={color.main} stroke="white" strokeWidth="3" />
                    <Circle cx={p2.x} cy={p2.y} r="16" fill={color.main} opacity="0.1" />
                    <Circle cx={p2.x} cy={p2.y} r="12" fill={color.main} opacity="0.2" />
                    <Circle cx={p2.x} cy={p2.y} r="8" fill={color.main} stroke="white" strokeWidth="3" />
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
            const color = getMeasurementColor(idx, measurement.mode);
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
                    backgroundColor: color.main,
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

      {/* Bottom toolbar - Water droplet style with slide gesture */}
      {!menuMinimized && !isCapturing && (
        <GestureDetector gesture={menuPanGesture}>
          <Animated.View
            className="absolute left-0 right-0 z-20"
            style={[
              { 
                bottom: insets.bottom + 16,
                paddingHorizontal: 24,
              },
              menuAnimatedStyle
            ]}
          >
            <BlurView
              intensity={35}
              tint="light"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 16,
              }}
            >
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingTop: 10,
                paddingBottom: 10,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}>
                
                {/* Header with collapse button */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: 'rgba(0, 0, 0, 0.5)', marginLeft: 4 }}>
                    CONTROLS
                  </Text>
                  <Pressable
                    onPress={collapseMenu}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.5)" />
                  </Pressable>
                </View>
          {/* Unit System Toggle: Metric vs Imperial */}
          <View className="flex-row mb-2" style={{ backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: 9, padding: 1.5 }}>
            <Pressable
              onPress={() => {
                setUnitSystem('metric');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                paddingVertical: 5,
                borderRadius: 7.5,
                backgroundColor: unitSystem === 'metric' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center">
                <Text style={{
                  fontWeight: '600',
                  fontSize: 10,
                  color: unitSystem === 'metric' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Metric
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setUnitSystem('imperial');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                paddingVertical: 5,
                borderRadius: 7.5,
                backgroundColor: unitSystem === 'imperial' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center">
                <Text style={{
                  fontWeight: '600',
                  fontSize: 10,
                  color: unitSystem === 'imperial' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Imperial
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Mode Toggle: Pan/Zoom vs Measure */}
          <View className="flex-row mb-2" style={{ backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: 9, padding: 1.5 }}>
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
                paddingVertical: 5,
                borderRadius: 7.5,
                backgroundColor: !measurementMode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                opacity: isPanZoomLocked ? 0.5 : 1,
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name={isPanZoomLocked ? "lock-closed" : "move-outline"}
                  size={12} 
                  color={isPanZoomLocked ? 'rgba(0, 0, 0, 0.3)' : (!measurementMode ? '#007AFF' : 'rgba(0, 0, 0, 0.45)')} 
                />
                <Text style={{
                  marginLeft: 4,
                  fontWeight: '600',
                  fontSize: 10,
                  color: isPanZoomLocked ? 'rgba(0, 0, 0, 0.3)' : (!measurementMode ? '#007AFF' : 'rgba(0, 0, 0, 0.45)')
                }}>
                  {isPanZoomLocked ? 'Locked' : 'Pan'}
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
                paddingVertical: 5,
                borderRadius: 7.5,
                backgroundColor: measurementMode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name="create-outline" 
                  size={12} 
                  color={measurementMode ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} 
                />
                <Text style={{
                  marginLeft: 4,
                  fontWeight: '600',
                  fontSize: 10,
                  color: measurementMode ? '#34C759' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Measure
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Measurement Type Toggle */}
          <View className="flex-row mb-2" style={{ backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: 9, padding: 1.5 }}>
            <Pressable
              onPress={() => {
                setMode('distance');
                setCurrentPoints([]);
                setMeasurementMode(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                paddingVertical: 5,
                borderRadius: 7.5,
                backgroundColor: mode === 'distance' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons 
                  name="resize-outline" 
                  size={12} 
                  color={mode === 'distance' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'} 
                />
                <Text style={{
                  marginLeft: 4,
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 10,
                  color: mode === 'distance' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Distance
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setMode('angle');
                setCurrentPoints([]);
                setMeasurementMode(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                paddingVertical: 5,
                borderRadius: 7.5,
                backgroundColor: mode === 'angle' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons 
                  name="git-compare-outline" 
                  size={12} 
                  color={mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} 
                />
                <Text style={{
                  marginLeft: 4,
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 10,
                  color: mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Angle
                </Text>
              </View>
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
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  borderRadius: 10,
                  paddingVertical: 8,
                  marginBottom: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0.5,
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                }}
              >
                <Ionicons name="arrow-undo-outline" size={14} color="rgba(0, 0, 0, 0.6)" />
                <Text style={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontWeight: '600',
                  fontSize: 11,
                  marginLeft: 6,
                }}>
                  {measurements.length > 0 
                    ? `Remove Last (${measurements.length})` 
                    : 'Clear Points'}
                </Text>
              </Pressable>

              {measurements.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
                  <Pressable
                    onPress={handleExport}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 122, 255, 0.85)',
                      borderRadius: 10,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="images-outline" size={12} color="white" />
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 11, marginLeft: 5 }}>Save</Text>
                  </Pressable>
                  
                  <Pressable
                    onPress={handleEmail}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(52, 199, 89, 0.85)',
                      borderRadius: 10,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="mail-outline" size={12} color="white" />
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 11, marginLeft: 5 }}>Email</Text>
                  </Pressable>
                </View>
              )}

              <Pressable
                onPress={handleReset}
                style={{
                  backgroundColor: 'rgba(255, 59, 48, 0.85)',
                  borderRadius: 10,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="camera-outline" size={14} color="white" />
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 11, marginLeft: 6 }}>New Photo</Text>
              </Pressable>
            </>
          )}
          
          {/* Pro status footer */}
          <Pressable
            onPress={() => {
              // Secret backdoor: 5 fast taps to unlock pro
              const newCount = proTapCount + 1;
              setProTapCount(newCount);
              
              if (proTapTimeoutRef.current) {
                clearTimeout(proTapTimeoutRef.current);
              }
              
              if (newCount >= 5) {
                // Unlock pro!
                setIsProUser(true);
                setProTapCount(0);
                Alert.alert('🎉 Pro Unlocked!', 'All pro features are now available!');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } else {
                // Reset counter after 2 seconds
                proTapTimeoutRef.current = setTimeout(() => {
                  setProTapCount(0);
                }, 2000);
                
                // Only show modal on 1st tap (not during rapid tapping)
                if (newCount === 1 && !isProUser) {
                  setTimeout(() => {
                    // Check if user didn't continue tapping (still at 1 tap after 500ms)
                    if (proTapCount === 1) {
                      setShowProModal(true);
                    }
                  }, 500);
                }
                
                // Haptic feedback for tap counting
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            style={{
              marginTop: 8,
              paddingVertical: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 9, color: 'rgba(0, 0, 0, 0.4)', fontWeight: '500' }}>
              {isProUser ? '✨ Pro User' : 'Tap for Pro Features'}
            </Text>
          </Pressable>
        </View>
        </BlurView>
          </Animated.View>
        </GestureDetector>
      )}
      
      {/* Pro Upgrade Modal */}
      <Modal
        visible={showProModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <BlurView
            intensity={100}
            tint="light"
            style={{ borderRadius: 24, overflow: 'hidden', width: '100%', maxWidth: 400 }}
          >
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 24 }}>
              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ backgroundColor: '#007AFF', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                  <Ionicons name="star" size={32} color="white" />
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 4 }}>
                  Upgrade to Pro
                </Text>
                <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
                  Unlock unlimited measurements
                </Text>
              </View>
              
              {/* Features list */}
              <View style={{ marginBottom: 24 }}>
                {[
                  'Unlimited measurements per photo',
                  'Email multiple measurements',
                  'Vibrant color-coded lines',
                  'Priority support',
                ].map((feature, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ backgroundColor: '#34C759', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                    <Text style={{ fontSize: 15, color: '#333', flex: 1 }}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              {/* Price */}
              <View style={{ backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>$5.99</Text>
                <Text style={{ fontSize: 13, color: '#666' }}>One-time purchase • Lifetime access</Text>
              </View>
              
              {/* Buttons */}
              <Pressable
                onPress={() => {
                  setShowProModal(false);
                  // Here you would integrate actual payment (Stripe, RevenueCat, etc.)
                  Alert.alert('Pro Upgrade', 'Payment integration would go here. For now, tap the footer 5 times fast to unlock!');
                }}
                style={{ backgroundColor: '#007AFF', borderRadius: 14, paddingVertical: 16, marginBottom: 12 }}
              >
                <Text style={{ color: 'white', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Upgrade Now</Text>
              </Pressable>
              
              <Pressable
                onPress={() => setShowProModal(false)}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ color: '#666', fontSize: 15, textAlign: 'center' }}>Maybe Later</Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </Modal>
    </>
  );
}
