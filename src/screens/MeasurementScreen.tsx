import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { DeviceMotion } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSequence } from 'react-native-reanimated';
import useStore from '../state/measurementStore';
import VerbalScaleModal from '../components/VerbalScaleModal';
import ZoomCalibration from '../components/ZoomCalibration';
import DimensionOverlay from '../components/DimensionOverlay';
import ZoomableImage from '../components/ZoomableImageV2';
import HelpModal from '../components/HelpModal';
import { CoinReference } from '../utils/coinReferences';
import { VerbalScale } from '../state/measurementStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ScreenMode = 'camera' | 'zoomCalibrate' | 'measurement';

export default function MeasurementScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [mode, setMode] = useState<ScreenMode>('camera');
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [measurementZoom, setMeasurementZoom] = useState({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1); // For 50% opacity capture
  const [showVerbalScaleModal, setShowVerbalScaleModal] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false); // Flash OFF by default, torch when enabled
  const [isTransitioning, setIsTransitioning] = useState(false); // Track if we're mid-transition
  
  // Cinematic fade-in animation for camera screen
  const cameraOpacity = useSharedValue(0);
  const blackOverlayOpacity = useSharedValue(1); // Start with black overlay
  
  // Universal screen transition opacity for smooth mode changes
  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1); // For liquid morphing effect
  const screenBlur = useSharedValue(0); // For water-like blur during transition
  const transitionBlackOverlay = useSharedValue(0); // FORCE black overlay for ALL transitions
  
  // Auto-capture states
  const [isHoldingShutter, setIsHoldingShutter] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isStable, setIsStable] = useState(false);
  const [alignmentStatus, setAlignmentStatus] = useState<'good' | 'warning' | 'bad'>('bad');
  const recentAngles = useRef<number[]>([]);
  const lastHapticRef = useRef<'good' | 'warning' | 'bad'>('bad');
  
  const cameraRef = useRef<CameraView>(null);
  const measurementViewRef = useRef<View | null>(null);
  const doubleTapToMeasureRef = useRef<(() => void) | null>(null);
  const insets = useSafeAreaInsets();
  
  const currentImageUri = useStore((s) => s.currentImageUri);
  const calibration = useStore((s) => s.calibration);
  const coinCircle = useStore((s) => s.coinCircle);
  const imageOrientation = useStore((s) => s.imageOrientation);
  const savedZoomState = useStore((s) => s.savedZoomState);
  const measurements = useStore((s) => s.completedMeasurements);
  const currentPoints = useStore((s) => s.currentPoints);
  const setImageUri = useStore((s) => s.setImageUri);
  const setImageOrientation = useStore((s) => s.setImageOrientation);
  const setCalibration = useStore((s) => s.setCalibration);
  const setCoinCircle = useStore((s) => s.setCoinCircle);
  const setSavedZoomState = useStore((s) => s.setSavedZoomState);
  
  // Smooth mode transition helper - fade out, change mode, fade in WITH liquid morph
  const smoothTransitionToMode = (newMode: ScreenMode, delay: number = 1500) => {
    setIsTransitioning(true); // Lock out interactions
    
    // Bring up BLACK overlay FASTER to cover content before it scales
    transitionBlackOverlay.value = withTiming(1, {
      duration: delay * 0.7, // 70% of delay = 1050ms (finish earlier!)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
    screenScale.value = withTiming(0.90, { // More pronounced scale down (water pulling in)
      duration: delay,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
    
    setTimeout(() => {
      setMode(newMode);
      
      // If transitioning TO camera, let camera handle its own fade
      if (newMode === 'camera') {
        screenScale.value = 1; // Reset scale for camera
        // Camera's useEffect will clear transitionBlackOverlay and handle fade-in
        // Unlock after camera's fade completes (300ms delay + 1500ms fade)
        setTimeout(() => setIsTransitioning(false), 1800);
      } else {
        // For non-camera modes, morph in from black (1.5 seconds in)
        // Wait longer for mode switch and render to prevent snap
        setTimeout(() => {
          screenScale.value = 1.10; // Start MORE scaled up (water flowing in)
          screenScale.value = withTiming(1, { // Settle to normal scale
            duration: delay,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          });
          // Fade out black overlay as content appears
          transitionBlackOverlay.value = withTiming(0, {
            duration: delay,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          });
        }, 200); // Increased to 200ms for full render (was 100ms)
        
        // Unlock AFTER transition fully completes + buffer time + gesture queue clear
        setTimeout(() => {
          transitionBlackOverlay.value = 0; // Force to 0 to ensure it's gone
          // Use requestAnimationFrame to ensure all queued gestures/renders complete
          requestAnimationFrame(() => {
            setIsTransitioning(false);
          });
        }, delay + 400); // Extra buffer (was 300ms)
      }
    }, delay);
  };
  
  // Determine if pan/zoom should be locked
  const isPanZoomLocked = measurements.length > 0 || currentPoints.length > 0;

  // Helper to detect orientation based on image (for future use)
  const detectOrientation = async (uri: string) => {
    try {
      await new Promise<void>((resolve) => {
        Image.getSize(uri, (width, height) => {
          __DEV__ && console.log('📐 Image dimensions:', width, 'x', height);
          const isLandscape = width > height;
          const orientation = isLandscape ? 'LANDSCAPE' : 'PORTRAIT';
          __DEV__ && console.log('📱 Image orientation:', orientation);
          setImageOrientation(orientation);
          resolve();
        }, (error) => {
          console.error('Error getting image size:', error);
          resolve();
        });
      });
    } catch (error) {
      console.error('Error detecting orientation:', error);
    }
  };

  // Helper to calculate pixelsPerUnit from verbal scale
  const calculatePixelsPerUnitFromScale = (scale: VerbalScale, imageWidth: number): number => {
    // 1. Convert screen distance to pixels
    // Assume standard phone screen physical dimensions
    const screenWidthCm = 10.8; // ~4.25 inches
    const screenWidthIn = 4.25;
    const screenWidthPhysical = scale.screenUnit === 'cm' ? screenWidthCm : screenWidthIn;
    const pixelsPerScreenUnit = imageWidth / screenWidthPhysical;
    const screenDistancePixels = scale.screenDistance * pixelsPerScreenUnit;
    
    // 2. Convert real distance to mm (internal unit)
    let realDistanceMM: number;
    switch (scale.realUnit) {
      case 'km':
        realDistanceMM = scale.realDistance * 1000000; // 1 km = 1,000,000 mm
        break;
      case 'mi':
        realDistanceMM = scale.realDistance * 1609344; // 1 mi = 1,609,344 mm
        break;
      case 'm':
        realDistanceMM = scale.realDistance * 1000; // 1 m = 1,000 mm
        break;
      case 'ft':
        realDistanceMM = scale.realDistance * 304.8; // 1 ft = 304.8 mm
        break;
    }
    
    // 3. Calculate pixels per mm
    return screenDistancePixels / realDistanceMM;
  };

  // Handle verbal scale calibration
  const handleVerbalScaleComplete = (scale: VerbalScale) => {
    const imageWidth = SCREEN_WIDTH * 2; // Assume 2x pixel density (retina)
    const pixelsPerUnit = calculatePixelsPerUnitFromScale(scale, imageWidth);
    
    setCalibration({
      pixelsPerUnit,
      unit: 'mm',
      referenceDistance: 1,
      calibrationType: 'verbal',
      verbalScale: scale,
    });
    
    setCoinCircle(null); // No coin circle for verbal scale
    setShowVerbalScaleModal(false);
    setMode('measurement'); // Skip ZoomCalibration, go straight to measurement
  };

  // Monitor device tilt for auto-capture when holding shutter
  useEffect(() => {
    if (mode !== 'camera') return;

    DeviceMotion.setUpdateInterval(100);

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const beta = data.rotation.beta * (180 / Math.PI);
        const absBeta = Math.abs(beta);
        
        // Auto-detect horizontal (0°) or vertical (90°)
        const targetOrientation = absBeta < 45 ? 'horizontal' : 'vertical';
        const absTilt = targetOrientation === 'horizontal' ? absBeta : Math.abs(absBeta - 90);
        
        setTiltAngle(absTilt);
        
        // Track stability
        recentAngles.current.push(absTilt);
        if (recentAngles.current.length > 10) recentAngles.current.shift();
        
        if (recentAngles.current.length >= 5) {
          const maxAngle = Math.max(...recentAngles.current);
          const minAngle = Math.min(...recentAngles.current);
          const stable = (maxAngle - minAngle) <= 2;
          setIsStable(stable);
        }

        // Alignment status (strict 2° tolerance when holding)
        let status: 'good' | 'warning' | 'bad';
        if (absTilt <= 2) status = 'good';
        else if (absTilt <= 10) status = 'warning';
        else status = 'bad';

        setAlignmentStatus(status);

        // Progressive haptic feedback "hot and cold" style (only when holding)
        if (isHoldingShutter) {
          if (status === 'bad') {
            // Far away / RED = Slow, light tapping (tap...tap...tap)
            if (status !== lastHapticRef.current) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              lastHapticRef.current = status;
            }
          } else if (status === 'warning') {
            // Getting warmer / YELLOW = Medium speed tapping (tap.tap.tap.tap.tap)
            if (status !== lastHapticRef.current) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Create burst pattern for warning
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 80);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 160);
              lastHapticRef.current = status;
            }
          } else if (status === 'good') {
            // HOT! / GREEN = Fast rapid tapping then SNAP! (taptaptaptaptap...SNAP!)
            if (status !== lastHapticRef.current) {
              // Rapid fire taps
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 40);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 80);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 120);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 160);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 240);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 280);
              // Success notification will come when photo is taken
              setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 320);
              lastHapticRef.current = status;
            }
          }
        }
      }
    });

    return () => subscription.remove();
  }, [mode, isHoldingShutter]);

  // Auto-capture when holding and conditions are met
  useEffect(() => {
    if (!isHoldingShutter || isCapturing) return;

    if (alignmentStatus === 'good' && isStable) {
      // Perfect conditions - auto snap!
      takePicture();
    }
  }, [isHoldingShutter, alignmentStatus, isStable, isCapturing]);

  // Restore session on mount if there's a persisted image
  useEffect(() => {
    if (currentImageUri && calibration && coinCircle) {
      __DEV__ && console.log('📦 Restoring previous session');
      setMode('measurement');
      // Restore saved zoom state if available
      if (savedZoomState) {
        __DEV__ && console.log('🔄 Restoring zoom state:', savedZoomState);
        setMeasurementZoom({ ...savedZoomState, rotation: savedZoomState.rotation || 0 });
      } else {
        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
      }
    }
  }, []); // Only run on mount

  // Watch for image changes and reset mode to camera when image is cleared
  useEffect(() => {
    if (!currentImageUri && mode !== 'camera') {
      setMode('camera');
    }
  }, [currentImageUri, mode]);

  // Cinematic fade-in when entering camera mode
  useEffect(() => {
    if (mode === 'camera') {
      cameraOpacity.value = 0;
      blackOverlayOpacity.value = 1;
      transitionBlackOverlay.value = 0; // Clear transition overlay so camera's fade works
      
      // Delay slightly to let camera initialize, then 1.5 second fade-in
      setTimeout(() => {
        cameraOpacity.value = withTiming(1, {
          duration: 1500, // 1.5 second smooth fade
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
        blackOverlayOpacity.value = withTiming(0, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
      }, 300); // 300ms delay to let camera initialize
    }
  }, [mode]);

  const cameraAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cameraOpacity.value,
  }));

  const blackOverlayStyle = useAnimatedStyle(() => ({
    opacity: blackOverlayOpacity.value,
  }));

  const screenTransitionStyle = useAnimatedStyle(() => ({
    // Don't fade content opacity - let the black overlay handle all opacity transitions
    // Only use scale for the liquid morph effect
    transform: [{ scale: screenScale.value }],
  }));

  const transitionBlackOverlayStyle = useAnimatedStyle(() => ({
    opacity: transitionBlackOverlay.value,
  }));

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Ionicons name="camera-outline" size={64} color="white" />
        <Text className="text-white text-xl text-center mt-4 mb-6">
          Camera access is needed to take measurement photos
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    const wasAutoCapture = alignmentStatus === 'good' && isStable;
    
    try {
      setIsCapturing(true);
      setIsHoldingShutter(false); // Release hold state
      
      // Take photo (torch is controlled by enableTorch prop on CameraView)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      
      if (photo?.uri) {
        // Request media library permission if not granted
        let canSave = mediaLibraryPermission?.granted || false;
        if (!canSave) {
          const { granted } = await requestMediaLibraryPermission();
          canSave = granted;
          if (!granted) {
            __DEV__ && console.log('Media library permission not granted');
          }
        }

        // Save to camera roll
        if (canSave) {
          try {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            __DEV__ && console.log('✅ Photo saved to camera roll');
          } catch (saveError) {
            console.error('Failed to save to camera roll:', saveError);
          }
        }

        // Set image URI (auto-captured if it was via hold)
        setImageUri(photo.uri, wasAutoCapture);
        await detectOrientation(photo.uri);
        
        // Smooth 1.5s fade to black, then to calibration screen
        setIsTransitioning(true);
        transitionBlackOverlay.value = withTiming(1, {
          duration: 1050, // 70% of 1500ms - cover screen quickly
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
        cameraOpacity.value = withTiming(0, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
        blackOverlayOpacity.value = withTiming(1, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
        
        // Wait 1.5s for fade to black, then switch mode and fade in
        setTimeout(() => {
          setMode('zoomCalibrate');
          
          // Wait for mode switch before morphing in
          setTimeout(() => {
            screenScale.value = 1.10; // Start scaled up
            screenScale.value = withTiming(1, {
              duration: 1500,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
            transitionBlackOverlay.value = withTiming(0, {
              duration: 1500,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
          }, 50);
          
          // Unlock after transition
          setTimeout(() => {
            transitionBlackOverlay.value = 0;
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          }, 1750);
        }, 1500);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const wasAutoCapture = alignmentStatus === 'good' && isStable;

  const handleCoinSelected = (coin: CoinReference) => {
    setSelectedCoin(coin);
    setMode('zoomCalibrate');
  };

  const handleCalibrationComplete = (calibrationData: any) => {
    setCalibration({
      pixelsPerUnit: calibrationData.pixelsPerUnit,
      unit: calibrationData.unit,
      referenceDistance: calibrationData.referenceDistance,
    });

    setCoinCircle(calibrationData.coinCircle);
    
    // Set the initial measurement zoom from calibration
    setMeasurementZoom({
      scale: calibrationData.initialZoom.scale,
      translateX: calibrationData.initialZoom.translateX,
      translateY: calibrationData.initialZoom.translateY,
      rotation: calibrationData.initialZoom.rotation || 0,
    });
    
    smoothTransitionToMode('measurement');
  };

  const handleCancelCalibration = () => {
    setMode('camera'); // Go back to camera
    setSelectedCoin(null);
  };

  const handleRetakePhoto = () => {
    setImageUri(null);
    setCoinCircle(null);
    setCalibration(null);
    setImageOrientation(null);
    setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
    setMode('camera');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      await detectOrientation(result.assets[0].uri);
      setMode('zoomCalibrate'); // Go straight to combined screen
    }
  };

  // Camera Mode
  if (mode === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Animated.View style={[{ flex: 1 }, cameraAnimatedStyle]}>
          <CameraView 
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
            enableTorch={flashEnabled}
          >
            {/* Top controls */}
            <View 
              className="absolute top-0 left-0 right-0 z-10"
              style={{ paddingTop: insets.top + 16 }}
            >
              <View className="flex-row justify-between items-center px-6">
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => {
                      __DEV__ && console.log('🔵 Help button pressed in camera screen');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowHelpModal(true);
                    }}
                    className="w-10 h-10 items-center justify-center"
                  >
                    <Ionicons name="help-circle-outline" size={28} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setFlashEnabled(!flashEnabled);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="w-10 h-10 items-center justify-center ml-2"
                  >
                    <Ionicons 
                      name={flashEnabled ? "flash" : "flash-off"} 
                      size={26} 
                      color={flashEnabled ? "#FFD700" : "white"} 
                    />
                  </Pressable>
                </View>
                <Text className="text-white text-lg font-semibold">Take Photo</Text>
                {/* Spacer to keep title centered */}
                <View className="w-10 h-10" />
              </View>
            </View>

            {/* Crosshairs overlay - center of screen */}
            <View 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 100,
                height: 100,
                marginLeft: -50,
                marginTop: -50,
              }}
              pointerEvents="none"
            >
              {/* Horizontal line - color reactive */}
              <View
                style={{
                  position: 'absolute',
                  top: 49,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: alignmentStatus === 'good' 
                    ? 'rgba(76, 175, 80, 0.9)' 
                    : alignmentStatus === 'warning'
                    ? 'rgba(255, 183, 77, 0.9)'
                    : 'rgba(239, 83, 80, 0.9)',
                }}
              />
              {/* Vertical line - color reactive */}
              <View
                style={{
                  position: 'absolute',
                  left: 49,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  backgroundColor: alignmentStatus === 'good' 
                    ? 'rgba(76, 175, 80, 0.9)' 
                    : alignmentStatus === 'warning'
                    ? 'rgba(255, 183, 77, 0.9)'
                    : 'rgba(239, 83, 80, 0.9)',
                }}
              />
              {/* Center dot */}
              <View
                style={{
                  position: 'absolute',
                  top: 47,
                  left: 47,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
              />
              
              {/* "Center object here" text below crosshairs with hint */}
              <View
                style={{
                  position: 'absolute',
                  top: 110,
                  left: -75,
                  width: 250,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  Center object here
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: 11,
                    fontStyle: 'italic',
                    marginTop: 2,
                  }}
                >
                  (place coin in the middle)
                </Text>
              </View>
            </View>

            {/* Bottom controls */}
            <View 
              className="absolute bottom-0 left-0 right-0 z-10"
              style={{ paddingBottom: insets.bottom + 32 }}
            >
              <View className="items-center">
                {/* Photo Library Button */}
                <Pressable
                  onPress={pickImage}
                  className="absolute left-8 bottom-0 w-14 h-14 rounded-full bg-gray-800/80 items-center justify-center"
                  style={{ marginBottom: 3 }}
                >
                  <Ionicons name="images-outline" size={28} color="white" />
                </Pressable>

                {/* Camera Shutter - HOLD ONLY for auto-level capture */}
                <Pressable
                  onPressIn={() => {
                    setIsHoldingShutter(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  onPressOut={() => setIsHoldingShutter(false)}
                  disabled={isCapturing}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'white',
                    borderWidth: 4,
                    borderColor: isHoldingShutter 
                      ? (alignmentStatus === 'good' ? 'rgba(76, 175, 80, 0.9)' : alignmentStatus === 'warning' ? 'rgba(255, 183, 77, 0.9)' : 'rgba(239, 83, 80, 0.9)')
                      : '#D1D5DB',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: 32, 
                    backgroundColor: isHoldingShutter 
                      ? (alignmentStatus === 'good' ? 'rgba(76, 175, 80, 0.8)' : alignmentStatus === 'warning' ? 'rgba(255, 183, 77, 0.8)' : 'rgba(239, 83, 80, 0.8)')
                      : 'white',
                  }} />
                </Pressable>
                
                <Text className="text-white text-sm mt-4">
                  {isHoldingShutter 
                    ? (alignmentStatus === 'good' && isStable ? 'Perfect! Capturing...' : 'Hold steady...') 
                    : 'Hold level to auto-capture'
                  }
                </Text>
              </View>
            </View>
          </CameraView>
          
          {/* Black overlay that fades out for smooth transition */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                pointerEvents: 'none',
              },
              blackOverlayStyle,
            ]}
          />
        </Animated.View>
        
        {/* UNIVERSAL BLACK TRANSITION OVERLAY - ABOVE EVERYTHING in camera mode */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              zIndex: 999999,
            },
            transitionBlackOverlayStyle,
          ]}
        />
        
        {/* Help Modal - needs to be here for camera mode */}
        <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
      </View>
    );
  }

  // Calibration or Measurement Mode
  return (
    <Animated.View style={[{ flex: 1, backgroundColor: 'black' }, screenTransitionStyle]}>
      {currentImageUri && (
        <>
          {/* Zoom Calibration Mode */}
          {mode === 'zoomCalibrate' && (
            <ZoomCalibration
              imageUri={currentImageUri}
              onComplete={handleCalibrationComplete}
              onCancel={handleCancelCalibration}
              onHelp={() => setShowHelpModal(true)}
            />
          )}

          {/* Measurement Mode */}
          {mode === 'measurement' && (
            <View style={{ flex: 1 }}>
              {/* Capture container for the image + measurements */}
              <View 
                ref={measurementViewRef} 
                collapsable={false} 
                style={{ flex: 1 }}
                onLayout={() => {
                  // Debug: Log when view is laid out and ref should be attached
                  __DEV__ && console.log('📐 Measurement view laid out, ref should be attached:', !!measurementViewRef.current);
                }}
              >
                <ZoomableImage 
                  imageUri={currentImageUri}
                  initialScale={measurementZoom.scale}
                  initialTranslateX={measurementZoom.translateX}
                  initialTranslateY={measurementZoom.translateY}
                  initialRotation={measurementZoom.rotation}
                  showLevelLine={false}
                  locked={isPanZoomLocked}
                  opacity={imageOpacity}
                  onTransformChange={(scale, translateX, translateY, rotation) => {
                    const newZoom = { scale, translateX, translateY, rotation };
                    setMeasurementZoom(newZoom);
                    // Save zoom state to store for session restoration
                    setSavedZoomState(newZoom);
                  }}
                  onDoubleTapWhenLocked={() => {
                    // Call the DimensionOverlay's measure mode switcher
                    if (doubleTapToMeasureRef.current) {
                      doubleTapToMeasureRef.current();
                    }
                  }}
                />
                {/* Measurement overlay needs to be sibling to image for capture */}
                <DimensionOverlay 
                  zoomScale={measurementZoom.scale}
                  zoomTranslateX={measurementZoom.translateX}
                  zoomTranslateY={measurementZoom.translateY}
                  zoomRotation={measurementZoom.rotation}
                  viewRef={measurementViewRef}
                  setImageOpacity={setImageOpacity}
                  onRegisterDoubleTapCallback={(callback) => {
                    doubleTapToMeasureRef.current = callback;
                  }}
                  onReset={() => smoothTransitionToMode('camera')}
                />
              </View>
            </View>
          )}

          {/* Verbal Scale Modal */}
          <VerbalScaleModal
            visible={showVerbalScaleModal}
            onComplete={handleVerbalScaleComplete}
            onDismiss={() => {
              setShowVerbalScaleModal(false);
              setMode('camera'); // Go back to camera
            }}
          />
        </>
      )}

      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {/* FORCE BLACK Transition Overlay - ALWAYS rendered, above everything */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            zIndex: 999999,
          },
          transitionBlackOverlayStyle,
        ]}
      />
    </Animated.View>
  );
}
