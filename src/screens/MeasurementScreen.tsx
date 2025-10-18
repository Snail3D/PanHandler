import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Dimensions, Platform, AccessibilityInfo, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';
import * as Device from 'expo-device';
import { DeviceMotion } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSequence, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Svg, Path } from 'react-native-svg';
import useStore from '../state/measurementStore';
import VerbalScaleModal from '../components/VerbalScaleModal';
import ZoomCalibration from '../components/ZoomCalibration';
import DimensionOverlay from '../components/DimensionOverlay';
import ZoomableImage from '../components/ZoomableImageV2';
import HelpModal from '../components/HelpModal';
import BattlingBotsModal from '../components/BattlingBotsModal';
import TypewriterText from '../components/TypewriterText';
import TouchOverlayFingerprints from '../components/TouchOverlayFingerprints';
import { CoinReference } from '../utils/coinReferences';
import { VerbalScale } from '../state/measurementStore';
import DiagnosticScreen from './DiagnosticScreen';
import PhotoTypeSelectionModal, { PhotoType } from '../components/PhotoTypeSelectionModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
type ScreenMode = 'camera' | 'zoomCalibrate' | 'measurement';

// Session color system: Each camera session gets a random set of 3 contrasting colors
// - Crosshair (camera + calibration): Main reference lines
// - Bubble: Complementary color for level indicator
// - Shutter: High-contrast action button color
// Colors regenerate every time user returns to camera mode (new photo session)
const COLOR_PAIRS = [
  { 
    crosshair: { main: '#3B82F6', glow: '#60A5FA' }, 
    bubble: { main: '#F59E0B', glow: '#FBBF24' },
    shutter: { main: '#EC4899', glow: '#F472B6' } // Pink
  },
  { 
    crosshair: { main: '#8B5CF6', glow: '#A78BFA' }, 
    bubble: { main: '#10B981', glow: '#34D399' },
    shutter: { main: '#F97316', glow: '#FB923C' } // Orange
  },
  { 
    crosshair: { main: '#EC4899', glow: '#F472B6' }, 
    bubble: { main: '#06B6D4', glow: '#22D3EE' },
    shutter: { main: '#84CC16', glow: '#A3E635' } // Lime
  },
  { 
    crosshair: { main: '#EF4444', glow: '#F87171' }, 
    bubble: { main: '#3B82F6', glow: '#60A5FA' },
    shutter: { main: '#10B981', glow: '#34D399' } // Green
  },
  { 
    crosshair: { main: '#10B981', glow: '#34D399' }, 
    bubble: { main: '#8B5CF6', glow: '#A78BFA' },
    shutter: { main: '#F59E0B', glow: '#FBBF24' } // Amber
  },
  { 
    crosshair: { main: '#F59E0B', glow: '#FBBF24' }, 
    bubble: { main: '#EC4899', glow: '#F472B6' },
    shutter: { main: '#06B6D4', glow: '#22D3EE' } // Cyan
  },
  { 
    crosshair: { main: '#06B6D4', glow: '#22D3EE' }, 
    bubble: { main: '#EF4444', glow: '#F87171' },
    shutter: { main: '#84CC16', glow: '#A3E635' } // Lime
  },
];

// Helper function to add "AUTO LEVEL" badge to image (top right corner)
// Captures a View containing the image + badge overlay
async function addAutoLevelBadge(compositeRef: React.RefObject<View>): Promise<string | null> {
  try {
    if (!compositeRef.current) {
      console.warn('Composite ref not available');
      return null;
    }
    
    // Capture the entire View (image + badge) as a single image
    const uri = await captureRef(compositeRef, {
      format: 'jpg',
      quality: 1.0,
      result: 'tmpfile',
    });
    
    return uri;
  } catch (error) {
    console.error('Error adding AUTO LEVEL badge:', error);
    return null;
  }
}

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
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null); // Local state to hold photo before AsyncStorage write
  
  // Manual altitude modal for drone photos
  const [showManualAltitudeModal, setShowManualAltitudeModal] = useState(false);
  const [pendingDroneData, setPendingDroneData] = useState<any>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false); // Diagnostic screen
  const [showPhotoTypeModal, setShowPhotoTypeModal] = useState(false);
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);
  const [currentPhotoType, setCurrentPhotoType] = useState<PhotoType | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false); // Track if camera is ready for capture
  const [skipToMapMode, setSkipToMapMode] = useState(false); // Track if user clicked "Map Scale" button in calibration
  const [skipToBlueprintMode, setSkipToBlueprintMode] = useState(false); // Track if user selected blueprint photo type
  const [skipToAerialMode, setSkipToAerialMode] = useState(false); // Track if user selected aerial photo type
  
  // Accessibility & Performance Detection
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  
  // Ref for the hidden composite view (photo + badge) to capture
  const compositeViewRef = useRef<View>(null);
  const [tempPhotoForBadge, setTempPhotoForBadge] = useState<string | null>(null);
  
  // Cinematic fade-in animation for camera screen
  const cameraOpacity = useSharedValue(0);
  const blackOverlayOpacity = useSharedValue(1); // Start with black overlay
  const cameraFlashOpacity = useSharedValue(0); // For camera flash effect
  
  // Universal screen transition opacity for smooth mode changes
  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1); // For liquid morphing effect
  const screenBlur = useSharedValue(0); // For water-like blur during transition
  const transitionBlackOverlay = useSharedValue(0); // FORCE black overlay for ALL transitions
  
  // Auto-capture states
  const [isHoldingShutter, setIsHoldingShutter] = useState(false);
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(false); // User must tap to enable
  const [showAutoCaptureButton, setShowAutoCaptureButton] = useState(false); // Hide auto-capture button - users can use bubble level and tap shutter
  const autoCaptureButtonOpacity = useSharedValue(1); // For fade animation
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isStable, setIsStable] = useState(false);
  const [alignmentStatus, setAlignmentStatus] = useState<'good' | 'warning' | 'bad'>('bad');
  const recentAngles = useRef<number[]>([]);
  const recentAccelerations = useRef<number[]>([]); // Track phone motion
  const lastHapticRef = useRef<'good' | 'warning' | 'bad'>('bad');
  const holdStartTimeRef = useRef<number>(0); // Track when user started holding
  
  // Low-pass filter for smooth sensor readings (reduce jitter)
  const smoothedBeta = useRef<number>(0);
  const smoothedGamma = useRef<number>(0);
  
  // Adaptive guidance system
  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);
  const guidanceOpacity = useSharedValue(0);
  const guidanceScale = useSharedValue(0.8);
  const lastGuidanceMessage = useRef<string | null>(null);
  const [accelerationVariance, setAccelerationVariance] = useState(0);
  const [currentBeta, setCurrentBeta] = useState(0);
  const [currentGamma, setCurrentGamma] = useState(0);
  
  // Instructions fade animation
  const instructionsOpacity = useSharedValue(1);
  
  // Animated opacity for look down / instructions fade transition
  const lookDownOpacity = useSharedValue(0); // "Look Down" message
  const instructionsDisplayOpacity = useSharedValue(1); // Instructions box (separate from hold fade)
  
  // Bubble level
  const bubbleX = useSharedValue(0);
  const bubbleY = useSharedValue(0);
  const isVerticalMode = useSharedValue(false); // Track if phone is vertical
  const isHorizontal = useSharedValue(true); // Track if phone is horizontal (looking down)
  const levelLinesOpacity = useSharedValue(1); // Smooth fade for red level lines
  
  // Session colors: Regenerate every time we enter camera mode for visual variety
  // This creates a fresh look for each photo session while maintaining consistency
  // within a single session (camera → calibration → measurement)
  const [sessionColors, setSessionColors] = useState(() => 
    COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)]
  );
  const crosshairColor = sessionColors.crosshair;
  const bubbleColor = sessionColors.bubble;
  const shutterColor = sessionColors.shutter;
  
  const crosshairGlow = useSharedValue(0); // 0-1, lights up when bubble is centered
  
  // Accessibility: Track time since holding shutter for Parkinson's/tremor support
  const holdStartTime = useRef<number>(0);
  
  // Instructional text state - fades after 10 seconds, shows encouragement message
  const [showInstructionalText, setShowInstructionalText] = useState(true);
  const [showEncouragementText, setShowEncouragementText] = useState(false);
  const [showReminderText, setShowReminderText] = useState(false);
  const instructionalTextOpacity = useSharedValue(1);
  const encouragementTextOpacity = useSharedValue(0);
  const reminderTextOpacity = useSharedValue(0);
  
  const cameraRef = useRef<CameraView>(null);
  const measurementViewRef = useRef<View | null>(null);
  const doubleTapToMeasureRef = useRef<(() => void) | null>(null);
  
  // ⚠️ CRITICAL: Debounce AsyncStorage writes to prevent 10-15s button lockup
  // See: NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md
  const zoomSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  const setCompletedMeasurements = useStore((s) => s.setCompletedMeasurements);
  const setCurrentPoints = useStore((s) => s.setCurrentPoints);
  const sessionCount = useStore((s) => s.sessionCount);
  const incrementSessionCount = useStore((s) => s.incrementSessionCount);
  const isDonor = useStore((s) => s.isDonor);
  const lastDonationSession = useStore((s) => s.lastDonationSession);
  const isFirstTimeDonor = useStore((s) => s.isFirstTimeDonor);
  const setIsFirstTimeDonor = useStore((s) => s.setIsFirstTimeDonor);
  
  // BattlingBots donation modal state  
  const [showBattlingBots, setShowBattlingBots] = useState(false);
  const [hasIncrementedSession, setHasIncrementedSession] = useState(false);
  
  // Trigger BattlingBots when entering measurement screen (not on app mount)
  useEffect(() => {
    if (mode === 'measurement' && currentImageUri) {
      // Increment session count ONCE when reaching measurement screen
      // This prevents blocking the camera → calibration transition
      if (!hasIncrementedSession) {
        incrementSessionCount();
        setHasIncrementedSession(true);
      }
      
      // Check if we should trigger BattlingBots (after incrementing)
      const triggerInterval = isDonor ? 40 : 10;
      const shouldTrigger = sessionCount % triggerInterval === 0;
      
      if (shouldTrigger) {
        // Show after 2 second delay
        setTimeout(() => {
          setShowBattlingBots(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          console.log(`🤖 BattlingBots triggered at session ${sessionCount} on measurement screen`);
        }, 2000);
      }
    }
    
    // Reset flag when returning to camera (for next session)
    if (mode === 'camera') {
      setHasIncrementedSession(false);
    }
  }, [mode, hasIncrementedSession]); // Trigger when mode changes or flag updates
  
  // Smooth mode transition helper - fade out, change mode, fade in WITH liquid morph
  const smoothTransitionToMode = (newMode: ScreenMode, delay: number = 1500) => {
    setIsTransitioning(true); // Lock out interactions
    
    // Bring up BLACK overlay FASTER to cover content before it scales
    transitionBlackOverlay.value = withTiming(1, {
      duration: delay * 0.5, // 50% of delay = 750ms (FASTER fade to black!)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
    screenScale.value = withTiming(0.90, { // More pronounced scale down (water pulling in)
      duration: delay,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
    
    setTimeout(() => {
      // Force black overlay to 1 before mode switch to prevent any flash
      transitionBlackOverlay.value = 1;
      setMode(newMode);
      
      // If transitioning TO camera, let camera handle its own fade
      if (newMode === 'camera') {
        screenScale.value = 1; // Reset scale for camera
        
        // Clear image state so camera shows up
        setImageUri(null);
        setCoinCircle(null);
        setCalibration(null);
        setImageOrientation(null);
        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
        
        // Camera's useEffect will clear transitionBlackOverlay and handle fade-in
        // Unlock after camera's fade completes (300ms delay + 1500ms fade)
        setTimeout(() => setIsTransitioning(false), 1800);
      } else {
        // For non-camera modes, keep black overlay longer to hide any render snap
        // Wait MUCH LONGER before revealing to ensure full render
        setTimeout(() => {
          screenScale.value = 1.10; // Start MORE scaled up (water flowing in)
          screenScale.value = withTiming(1, { // Settle to normal scale
            duration: delay * 0.8, // Faster morph = 1200ms
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          });
          // Fade out black overlay as content appears
          transitionBlackOverlay.value = withTiming(0, {
            duration: delay * 0.8, // Faster fade out = 1200ms
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          });
        }, 600); // MUCH longer wait = 600ms for complete render
        
        // Unlock AFTER transition fully completes + buffer time + gesture queue clear
        setTimeout(() => {
          transitionBlackOverlay.value = 0; // Force to 0 to ensure it's gone
          // Use requestAnimationFrame to ensure all queued gestures/renders complete
          requestAnimationFrame(() => {
            setIsTransitioning(false);
          });
        }, delay * 2); // Extra long buffer for complex render
      }
    }, delay);
  };
  
  // Determine if pan/zoom should be locked
  // Determine if pan/zoom should be locked
  // Never lock - users should be able to pan/zoom/rotate at any time
  // This allows adjusting view while placing measurements
  const isPanZoomLocked = false; // Never lock - allow gestures always


  // Helper to detect orientation based on image (for future use)
  const detectOrientation = async (uri: string) => {
    try {
      await new Promise<void>((resolve) => {
        Image.getSize(uri, (width, height) => {
          __DEV__ && console.log('📐 Image dimensions:', width, 'x', height);
          const isLandscape = width > height;
          const orientation = isLandscape ? 'LANDSCAPE' : 'PORTRAIT';
          __DEV__ && console.log('📱 Image orientation:', orientation);
          
          // ⚠️ CRITICAL: Defer AsyncStorage write to prevent UI blocking
          setTimeout(() => {
            setImageOrientation(orientation);
          }, 200);
          
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

  // Regenerate session colors every time we enter camera mode for visual variety
  // This creates a fresh look for each photo session while maintaining consistency
  // within a single session (camera → calibration → measurement)
  useEffect(() => {
    if (mode === 'camera') {
      // Pick new random color pair
      const newColors = COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)];
      setSessionColors(newColors);
      // Reset skipToMapMode flag when returning to camera
      setSkipToMapMode(false);
    }
  }, [mode]);
  
  // Detect accessibility settings and device performance on mount
  useEffect(() => {
    async function detectAccessibilityAndPerformance() {
      try {
        // Check for iOS Reduce Motion setting
        const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setReduceMotion(isReduceMotionEnabled);
        
        // Detect low-end device based on multiple factors
        const deviceYear = Device.deviceYearClass || 2024; // Default to current year if unknown
        const isOldDevice = deviceYear < 2018; // Devices older than iPhone X / Pixel 2 era
        
        // Check available memory (if available)
        const totalMemory = Device.totalMemory || 4000000000; // Default to 4GB if unknown
        const hasLowMemory = totalMemory < 3000000000; // Less than 3GB RAM
        
        // Determine if device is low-end
        const isLowEnd = isOldDevice || hasLowMemory;
        setIsLowEndDevice(isLowEnd);
        
        if (isReduceMotionEnabled || isLowEnd) {
          __DEV__ && console.log('🎯 Accessibility Mode Enabled:', {
            reduceMotion: isReduceMotionEnabled,
            isLowEnd,
            deviceYear,
            totalMemory: (totalMemory / 1000000000).toFixed(1) + 'GB'
          });
        }
      } catch (error) {
        console.error('Error detecting accessibility settings:', error);
      }
    }
    
    detectAccessibilityAndPerformance();
  }, []); // Only on mount
  
  // Instructional text sequence: Initial → Encouragement → Reminder
  useEffect(() => {
    if (mode !== 'camera' || isCapturing) {
      // Reset all when not in camera mode
      setShowInstructionalText(true);
      setShowEncouragementText(false);
      setShowReminderText(false);
      instructionalTextOpacity.value = 1;
      encouragementTextOpacity.value = 0;
      reminderTextOpacity.value = 0;
      return;
    }
    
    // Animation durations - shorter for reduce motion, instant for extreme cases
    const fadeDuration = reduceMotion ? 150 : 500;
    const holdDuration = reduceMotion ? 2000 : 2500;
    
    // Phase 1: Show initial instructions for 10 seconds
    instructionalTextOpacity.value = withTiming(1, { duration: reduceMotion ? 100 : 300 });
    
    const timer1 = setTimeout(() => {
      // Fade out initial text
      instructionalTextOpacity.value = withTiming(0, { duration: fadeDuration });
      setTimeout(() => {
        setShowInstructionalText(false);
        
        // Phase 2: Show encouragement for 3 seconds (10-13s mark)
        setShowEncouragementText(true);
        encouragementTextOpacity.value = withSequence(
          withTiming(1, { duration: fadeDuration }),
          withTiming(1, { duration: holdDuration }),
          withTiming(0, { duration: fadeDuration })
        );
        
        setTimeout(() => {
          setShowEncouragementText(false);
          
          // Phase 3: Show reminder 2 seconds later (15-18s mark)
          setTimeout(() => {
            setShowReminderText(true);
            reminderTextOpacity.value = withSequence(
              withTiming(1, { duration: fadeDuration }),
              withTiming(1, { duration: holdDuration }),
              withTiming(0, { duration: fadeDuration })
            );
            
            setTimeout(() => {
              setShowReminderText(false);
            }, fadeDuration + holdDuration + fadeDuration);
          }, 2000);
        }, fadeDuration + holdDuration + fadeDuration);
      }, fadeDuration);
    }, 10000);
    
    return () => {
      clearTimeout(timer1);
    };
  }, [mode, isCapturing]);
  
  // Monitor device tilt for auto-capture when holding shutter
  useEffect(() => {
    if (mode !== 'camera') {
      holdStartTime.current = 0; // Reset when leaving camera
      return;
    }

    // Adjust update rate based on device capability
    // Low-end devices: 50ms (20fps) - smooth enough
    // Normal devices: 16ms (60fps) - buttery smooth like real bubble level
    const updateInterval = isLowEndDevice ? 50 : 16;
    DeviceMotion.setUpdateInterval(updateInterval);

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const betaRaw = data.rotation.beta * (180 / Math.PI);
        const gammaRaw = data.rotation.gamma * (180 / Math.PI);
        const alpha = data.rotation.alpha * (180 / Math.PI); // Rotation/roll
        
        // Apply low-pass filter (exponential moving average) to reduce jitter
        // Alpha = 0.5 gives good balance between smoothness and responsiveness
        const filterAlpha = 0.5;
        smoothedBeta.current = smoothedBeta.current * (1 - filterAlpha) + betaRaw * filterAlpha;
        smoothedGamma.current = smoothedGamma.current * (1 - filterAlpha) + gammaRaw * filterAlpha;
        
        // Use smoothed values for all calculations
        const beta = smoothedBeta.current;
        const gamma = smoothedGamma.current;
        const absBeta = Math.abs(beta);
        
        // Store for guidance system
        setCurrentBeta(beta);
        setCurrentGamma(gamma);
        
        // Auto-detect horizontal (0°) or vertical (90°)
        const targetOrientation = absBeta < 45 ? 'horizontal' : 'vertical';
        
        // Calculate total tilt considering BOTH axes
        let absTilt: number;
        if (targetOrientation === 'horizontal') {
          // Horizontal mode: device should be flat (beta ~0°, gamma ~0°)
          // Calculate total deviation from level using both axes
          absTilt = Math.sqrt(beta * beta + gamma * gamma);
        } else {
          // Vertical mode: only forward/backward tilt matters (beta ~90°)
          // Left/right tilt is ignored since user is looking straight at coin
          absTilt = Math.abs(absBeta - 90);
        }
        
        setTiltAngle(absTilt);
        
        // Track angle stability
        recentAngles.current.push(absTilt);
        if (recentAngles.current.length > 10) recentAngles.current.shift();
        
        // Track motion/acceleration stability
        if (data.acceleration) {
          const { x, y, z } = data.acceleration;
          // Calculate total acceleration magnitude (movement intensity)
          const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
          recentAccelerations.current.push(totalAcceleration);
          if (recentAccelerations.current.length > 10) recentAccelerations.current.shift();
          
          // Calculate acceleration variance for guidance
          if (recentAccelerations.current.length >= 5) {
            const mean = recentAccelerations.current.reduce((a, b) => a + b, 0) / recentAccelerations.current.length;
            const variance = recentAccelerations.current.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentAccelerations.current.length;
            setAccelerationVariance(variance);
          }
        }
        
        // Animate bubble based on device tilt
        // SIMPLIFIED: Always use horizontal mode (downward facing camera)
        // This is the natural way to measure objects on a table
        const isVertical = false; // Disabled vertical mode
        isVerticalMode.value = isVertical;
        
        // Check if orientation changed
        const wasHorizontal = isHorizontal.value;
        const nowHorizontal = absBeta < 45; // Calculate new horizontal state
        isHorizontal.value = nowHorizontal; // Update shared value
        
        // Smooth 500ms fade transition between "Look Down" and instructions
        if (wasHorizontal !== nowHorizontal) {
          if (nowHorizontal) {
            // Switched to horizontal: fade out "Look Down", fade in instructions
            lookDownOpacity.value = withTiming(0, { duration: 500 });
            instructionsDisplayOpacity.value = withTiming(1, { duration: 500 });
          } else {
            // Switched to vertical: fade out instructions, fade in "Look Down"
            instructionsDisplayOpacity.value = withTiming(0, { duration: 500 });
            lookDownOpacity.value = withTiming(1, { duration: 500 });
          }
        }
        
        // Smooth fade for level lines and center crosshairs when orientation changes
        // Use withTiming instead of instant value change for graceful transitions
        const targetOpacity = nowHorizontal ? 1 : 0;
        if (Math.abs(levelLinesOpacity.value - targetOpacity) > 0.01) {
          levelLinesOpacity.value = withTiming(targetOpacity, { 
            duration: 400, // Smooth 400ms fade
            easing: Easing.inOut(Easing.ease),
          });
        }
        
        const maxBubbleOffset = 48; // Max pixels the bubble can move from center (120px crosshairs / 2.5)
        
        // HORIZONTAL MODE: Both X and Y movement
        const bubbleXOffset = -(gamma / 15) * maxBubbleOffset; // Left/right tilt (inverted)
        const bubbleYOffset = (beta / 15) * maxBubbleOffset; // Forward/back tilt
        
        // Clamp to circular boundary
        const distance = Math.sqrt(bubbleXOffset * bubbleXOffset + bubbleYOffset * bubbleYOffset);
        let finalX = bubbleXOffset;
        let finalY = bubbleYOffset;
        
        if (distance > maxBubbleOffset) {
          const scale = maxBubbleOffset / distance;
          finalX = bubbleXOffset * scale;
          finalY = bubbleYOffset * scale;
        }
        
        bubbleX.value = withSpring(finalX, { damping: 20, stiffness: 400, mass: 0.3 });
        bubbleY.value = withSpring(finalY, { damping: 20, stiffness: 400, mass: 0.3 });
        
        // Calculate crosshair glow (0-1) based on how centered the bubble is
        const distanceFromCenter = Math.sqrt(bubbleX.value * bubbleX.value + bubbleY.value * bubbleY.value);
        const glowAmount = Math.max(0, 1 - (distanceFromCenter / 15)); // Glow when within 15px of center
        crosshairGlow.value = withSpring(glowAmount, { damping: 20, stiffness: 400 });
        
        // Check BOTH angle stability AND motion stability
        // PRECISE for auto-capture: tighter thresholds for ~1mm accuracy
        if (recentAngles.current.length >= 3 && recentAccelerations.current.length >= 3) {
          // PRECISE angle stability: 1.5° tolerance to match alignment precision
          const angleThreshold = 1.5; // Tight tolerance for precise capture
          const maxAngle = Math.max(...recentAngles.current);
          const minAngle = Math.min(...recentAngles.current);
          const angleStable = (maxAngle - minAngle) <= angleThreshold;
          
          // PRECISE motion stability: minimal movement for accuracy
          const motionThreshold = 0.2; // Tight tolerance for stable capture
          const maxAccel = Math.max(...recentAccelerations.current);
          const minAccel = Math.min(...recentAccelerations.current);
          const motionStable = (maxAccel - minAccel) <= motionThreshold;
          
          // BOTH must be stable
          setIsStable(angleStable && motionStable);
        }

        // Alignment status - PRECISE: ~1mm on screen for auto-capture accuracy
        let status: 'good' | 'warning' | 'bad';
        
        // Calculate pixel distance from center (bubble position)
        const bubbleDistancePixels = Math.sqrt(finalX * finalX + finalY * finalY);
        
        // PRECISE thresholds for accurate auto-capture
        // Typical phone: ~160 PPI = 6.3 pixels/mm, so 6 pixels ≈ 1mm
        if (bubbleDistancePixels <= 6 && absTilt <= 1.5) {
          status = 'good';      // Within ~1mm (6px) and < 1.5° tilt = precise
        } else if (bubbleDistancePixels <= 12 && absTilt <= 5) {
          status = 'warning';   // Within ~2mm (12px) and < 5° tilt = getting close
        } else {
          status = 'bad';       // Too far off
        }

        setAlignmentStatus(status);

        // Progressive haptic feedback "hot and cold" style
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
    });

    return () => subscription.remove();
  }, [mode]);

  // Auto-capture when holding shutter button and lines align
  // ONLY in horizontal mode - vertical mode allows quick tap only
  useEffect(() => {
    // Guards: must have camera ref, correct mode, holding, not already capturing
    // MUST be in horizontal mode (phone looking down) for auto-capture
    if (!cameraRef.current || mode !== 'camera' || isCapturing || !isHoldingShutter) {
      return;
    }
    
    // Check if phone is in horizontal mode (looking down)
    const phoneIsHorizontal = isHorizontal.value;
    if (!phoneIsHorizontal) {
      // Vertical mode: auto-capture disabled, user must quick tap
      if (__DEV__) {
        console.log('⚠️ Auto-capture disabled in vertical mode - use quick tap');
      }
      return;
    }

    // Debug: Log when user is holding but conditions aren't perfect
    if (isHoldingShutter && __DEV__) {
      console.log('⏳ Holding shutter, waiting for alignment:', {
        alignmentStatus,
        isStable,
        needsGood: alignmentStatus !== 'good',
        needsStable: !isStable,
      });
    }

    if (alignmentStatus === 'good' && isStable) {
      // Trigger immediately when conditions are met (removed delay)
      __DEV__ && console.log('🎯 Auto-capture triggered!', {
        alignmentStatus,
        isStable,
        isHoldingShutter,
      });
      takePicture();
    }
  }, [mode, alignmentStatus, isStable, isCapturing, isHoldingShutter]);
  
  // Adaptive guidance system - determine PRIMARY issue and show appropriate message
  useEffect(() => {
    // Only show guidance in camera mode, not capturing
    if (mode !== 'camera' || isCapturing) {
      if (guidanceMessage) {
        guidanceOpacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => setGuidanceMessage(null), 300);
      }
      return;
    }
    
    // Calculate severity scores (0-1 scale)
    const motionSeverity = Math.min(accelerationVariance / 0.15, 1);
    const tiltSeverity = Math.min(tiltAngle / 25, 1);
    
    let newMessage: string | null = null;
    
    // Priority 1: Too much motion
    if (motionSeverity > 0.6) {
      newMessage = "Hold still";
    }
    // Priority 2: Significant tilt
    else if (tiltSeverity > 0.4 && tiltAngle > 5) {
      const absBeta = Math.abs(currentBeta);
      const targetOrientation = absBeta < 45 ? 'horizontal' : 'vertical';
      
      if (targetOrientation === 'horizontal') {
        if (currentBeta > 5) newMessage = "Tilt backward";
        else if (currentBeta < -5) newMessage = "Tilt forward";
        else if (Math.abs(currentGamma) > 5) {
          newMessage = currentGamma > 5 ? "Tilt left" : "Tilt right";
        }
      } else {
        const verticalDiff = Math.abs(currentBeta) - 90;
        if (verticalDiff > 5) {
          newMessage = currentBeta > 0 ? "Tilt forward" : "Tilt backward";
        } else if (Math.abs(currentGamma) > 5) {
          newMessage = currentGamma > 5 ? "Turn left" : "Turn right";
        }
      }
    }
    // Priority 3: Getting close
    else if (tiltSeverity < 0.3 && tiltAngle > 2 && tiltAngle <= 5 && motionSeverity < 0.4) {
      newMessage = "Almost there...";
    }
    // Priority 4: Hold position
    else if (alignmentStatus === 'good' && !isStable && motionSeverity > 0.2) {
      newMessage = "Hold that";
    }
    
    // Update message if changed
    if (newMessage !== lastGuidanceMessage.current) {
      lastGuidanceMessage.current = newMessage;
      
      if (newMessage) {
        setGuidanceMessage(newMessage);
        guidanceOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        guidanceScale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
      } else {
        guidanceOpacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => setGuidanceMessage(null), 300);
      }
    }
  }, [mode, accelerationVariance, tiltAngle, alignmentStatus, isStable, isCapturing, currentBeta, currentGamma]);
  
  // Animated style for guidance text
  const guidanceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: guidanceOpacity.value,
    transform: [{ scale: guidanceScale.value }],
  }));
  
  // Animated styles for bubble level crosshairs - simple gray with subtle glow
  const crosshairHorizontalStyle = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(156, 163, 175, 0.9)', // Gray-400
    shadowColor: '#9CA3AF',
    shadowOpacity: 0.5 + (crosshairGlow.value * 0.3),
    shadowRadius: 6 + (crosshairGlow.value * 6),
  }));
  
  const crosshairVerticalStyle = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(156, 163, 175, 0.9)', // Gray-400
    shadowColor: '#9CA3AF',
    shadowOpacity: 0.5 + (crosshairGlow.value * 0.3),
    shadowRadius: 6 + (crosshairGlow.value * 6),
  }));
  
  // Don't rotate crosshair - keep it fixed
  const crosshairContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: '0deg' } // No rotation in either mode
    ],
  }));
  
  const bubbleStyle = useAnimatedStyle(() => ({
    // No swapping needed if crosshair doesn't rotate
    transform: [
      { translateX: bubbleX.value + 60 - 7 },
      { translateY: bubbleY.value + 60 - 7 },
    ],
  }));
  
  const centerDotStyle = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(156, 163, 175, 0.9)', // Gray-400
    transform: [{ scale: 1 + (crosshairGlow.value * 0.5) }],
    shadowColor: '#9CA3AF',
    shadowOpacity: 0.5 + (crosshairGlow.value * 0.4),
    shadowRadius: 4 + (crosshairGlow.value * 6),
  }));
  
  const autoCaptureButtonStyle = useAnimatedStyle(() => ({
    opacity: autoCaptureButtonOpacity.value,
  }));

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
      // Reset states immediately
      setIsCapturing(false);
      setIsTransitioning(false);
      setIsHoldingShutter(false); // Reset hold state so user must press again
      setIsCameraReady(false); // Camera not ready yet
      
      cameraOpacity.value = 0;
      blackOverlayOpacity.value = 1;
      transitionBlackOverlay.value = 0; // Clear transition overlay so camera's fade works
      cameraFlashOpacity.value = 0; // Reset flash in case it's still visible
      instructionsOpacity.value = 1; // Reset instructions to visible (hold fade)
      instructionsDisplayOpacity.value = 1; // Start with instructions visible
      lookDownOpacity.value = 0; // Start with "Look Down" hidden
      
      // Faster fade-in (reduced from 1.5s to 0.6s)
      setTimeout(() => {
        cameraOpacity.value = withTiming(1, {
          duration: 600, // Faster 0.6 second fade
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
        blackOverlayOpacity.value = withTiming(0, {
          duration: 600,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
        
        // Camera is ready after fade-in completes
        setTimeout(() => {
          setIsCameraReady(true);
          __DEV__ && console.log('📷 Camera is ready for capture');
        }, 700); // Wait for fade + a bit extra for camera to fully initialize
      }, 150); // Reduced delay from 300ms to 150ms
    } else {
      // Not in camera mode, camera not ready
      setIsCameraReady(false);
      // PERFORMANCE FIX: Stop DeviceMotion sensors immediately when leaving camera
      // This prevents 60fps sensor updates during transitions, reducing CPU load
      DeviceMotion.removeAllListeners();
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

  const cameraFlashStyle = useAnimatedStyle(() => ({
    opacity: cameraFlashOpacity.value,
  }));
  
  const instructionalTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: instructionalTextOpacity.value,
  }));
  
  const encouragementTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: encouragementTextOpacity.value,
  }));
  
  const reminderTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: reminderTextOpacity.value,
  }));

  if (!permission) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
        <Text style={{ color: 'white' }}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', paddingHorizontal: 24 }}>
        <Ionicons name="camera-outline" size={64} color="white" />
        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginTop: 16, marginBottom: 24 }}>
          Camera access is needed to take measurement photos
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{ backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 9999 }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    // Prevent capture if camera isn't ready or already capturing
    if (!cameraRef.current || isCapturing || mode !== 'camera') {
      __DEV__ && console.log('⚠️ Skipping takePicture - camera not ready:', {
        hasCameraRef: !!cameraRef.current,
        isCapturing,
        mode,
        isCameraReady,
      });
      return;
    }
    
    // Warn if camera might not be fully ready but allow capture anyway
    if (!isCameraReady) {
      __DEV__ && console.log('⚠️ Camera not marked ready but attempting capture anyway');
    }
    
    // Disable holding state to prevent double-capture
    setIsHoldingShutter(false);
    
    const wasAutoCapture = alignmentStatus === 'good' && isStable;
    
    try {
      setIsCapturing(true);
      
      // Check camera permissions one more time
      if (!permission?.granted) {
        console.error('Camera permission not granted');
        setIsCapturing(false);
        return;
      }
      
      // ⚠️ CRITICAL: Check if camera ref exists
      if (!cameraRef.current) {
        console.error('Camera ref is null - camera not ready');
        setIsCapturing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      
      // Pleasant camera flash effect - MUST complete before transition
      cameraFlashOpacity.value = 1;
      cameraFlashOpacity.value = withTiming(0, {
        duration: 100, // Quick 100ms flash
        easing: Easing.out(Easing.ease),
      });
      
      // Wait a tiny bit for camera to be fully ready
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Take photo (torch is controlled by enableTorch prop on CameraView)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      
      if (photo?.uri) {
        // Store in local state immediately (no AsyncStorage blocking!)
        setCapturedPhotoUri(photo.uri);
        
        // Detect orientation to determine auto-flow (must be synchronous!)
        const photoOrientation: 'LANDSCAPE' | 'PORTRAIT' = await new Promise((resolve) => {
          Image.getSize(
            photo.uri, 
            (width, height) => {
              console.log(`📷 RAW IMAGE SIZE: ${width}x${height}`);
              const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
              console.log(`📷 DETECTED ORIENTATION: ${orientation} (width > height = ${width > height})`);
              // Defer AsyncStorage write
              setTimeout(() => {
                setImageOrientation(orientation);
              }, 300);
              resolve(orientation);
            }, 
            (error) => {
              console.error('Error detecting orientation:', error);
              resolve('LANDSCAPE'); // Default to landscape on error
            }
          );
        });
        
        console.log('📷 Photo captured - Final Orientation:', photoOrientation);
        console.log('📷 Decision: ' + (photoOrientation === 'LANDSCAPE' ? 'AUTO COIN CALIBRATION' : 'SHOW MENU'));
        
        // DECISION: Landscape photos auto-proceed to coin calibration
        // Portrait photos show photo type selection menu
        if (photoOrientation === 'LANDSCAPE') {
          // Horizontal/landscape photo → Auto-proceed to coin calibration
          console.log('📷 Landscape photo (table view) → Auto coin calibration');
          
          // CINEMATIC MORPH: Camera → Calibration (same photo, just morph the UI!)
          setIsTransitioning(true);
          
          // IMPORTANT: Immediately switch mode to prevent camera from being unmounted during transition
          // The camera view stays rendered but will fade out
          setTimeout(() => {
            setMode('zoomCalibrate');
          }, 30); // Minimal delay just for the flash to start
          
          // ⚠️ CRITICAL: Defer AsyncStorage write until AFTER transition completes
          // Writing to AsyncStorage blocks UI thread for 100-10,000ms causing 10-second freeze
          // Write happens in background after UI transition is smooth
          // See: SESSION_COMPLETE_OCT18_IMAGE_UNMOUNTING_FIX.md
          setTimeout(() => {
            setImageUri(photo.uri, wasAutoCapture);
            __DEV__ && console.log('✅ Deferred AsyncStorage write complete');
          }, 200); // Write after transition animations complete
          
          // Start the visual transition AFTER mode switch
          setTimeout(() => {
            // Fade out camera opacity to reveal the photo underneath
            cameraOpacity.value = withTiming(0, {
              duration: 150, // Much faster fade (was 300ms)
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
            
            // Slight zoom morph for drama
            screenScale.value = withSequence(
              withTiming(1.03, { duration: 75, easing: Easing.out(Easing.cubic) }), // Slight zoom in (reduced)
              withTiming(1, { duration: 75, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }) // Settle
            );
            
            // Unlock after full transition
            setTimeout(() => {
              setIsTransitioning(false);
            }, 150); // Match the fade duration
          }, 50); // Start animations quickly after flash
        } else {
          // Vertical/portrait photo → Show photo type selection menu
          console.log('📷 PORTRAIT PHOTO DETECTED (wall view) → Show photo type menu');
          
          // Transition to measurement screen first, then show modal
          setIsTransitioning(true);
          transitionBlackOverlay.value = withTiming(1, {
            duration: 150,
            easing: Easing.in(Easing.ease),
          });
          
          setTimeout(() => {
            setMode('measurement');
            
            // Store pending photo and show type selection
            setPendingPhotoUri(photo.uri);
            
            setTimeout(() => {
              console.log('🔴 Setting showPhotoTypeModal to TRUE');
              setShowPhotoTypeModal(true);
              
              // Defer AsyncStorage write
              setTimeout(() => {
                setImageUri(photo.uri, wasAutoCapture);
                __DEV__ && console.log('✅ Deferred AsyncStorage write complete (portrait)');
              }, 200);
              
              transitionBlackOverlay.value = withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.ease),
              });
              
              setTimeout(() => {
                setIsTransitioning(false);
              }, 250);
            }, 50);
          }, 150);
        }
        
        // Save to camera roll in background (non-blocking for UI)
        (async () => {
          try {
            // Request media library permission if not granted
            let canSave = mediaLibraryPermission?.granted || false;
            if (!canSave) {
              const { granted } = await requestMediaLibraryPermission();
              canSave = granted;
              if (!granted) {
                __DEV__ && console.log('Media library permission not granted');
                return;
              }
            }

            if (canSave) {
              let photoToSave = photo.uri;
              
              // Save photo to library
              const asset = await MediaLibrary.createAssetAsync(photoToSave);
              
              // Always save to "PanHandler" album in background (non-blocking)
              try {
                // Get or create "PanHandler" album
                let album = await MediaLibrary.getAlbumAsync('PanHandler');
                if (album) {
                  await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                } else {
                  album = await MediaLibrary.createAlbumAsync('PanHandler', asset, false);
                }
                
                __DEV__ && console.log('✅ Photo saved to PanHandler album');
              } catch (albumError) {
                console.error('Failed to add to PanHandler album:', albumError);
                __DEV__ && console.log('✅ Photo saved to camera roll only');
              }
            }
          } catch (saveError) {
            console.error('Failed to save to camera roll:', saveError);
          }
        })();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      // Make sure we reset states on error
      setIsCapturing(false);
      setIsHoldingShutter(false);
      setIsTransitioning(false);
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
    // Set the initial measurement zoom from calibration (local state, not persisted)
    setMeasurementZoom({
      scale: calibrationData.initialZoom.scale,
      translateX: calibrationData.initialZoom.translateX,
      translateY: calibrationData.initialZoom.translateY,
      rotation: calibrationData.initialZoom.rotation || 0,
    });
    
    // Clear local photo state now that it's persisted
    setCapturedPhotoUri(null);
    
    // Simpler approach: Just fade to black, switch instantly, fade in
    setIsTransitioning(true);
    
    // ⚠️ CRITICAL: Defer AsyncStorage writes to prevent measurement screen lockup
    // Writing calibration + coinCircle blocks UI thread for 100-1000ms
    // Must happen AFTER transition to measurement screen
    setTimeout(() => {
      setCalibration({
        pixelsPerUnit: calibrationData.pixelsPerUnit,
        unit: calibrationData.unit,
        referenceDistance: calibrationData.referenceDistance,
      });
      setCoinCircle(calibrationData.coinCircle);
      __DEV__ && console.log('✅ Deferred calibration AsyncStorage write complete');
    }, 600); // Write after transition to measurement completes
    
    // Fade to black quickly
    transitionBlackOverlay.value = withTiming(1, {
      duration: 400, // Fast fade to black
      easing: Easing.in(Easing.ease),
    });
    
    // After black screen, switch mode and fade in
    setTimeout(() => {
      setMode('measurement');
      
      // Small delay to let React render, then fade in
      setTimeout(() => {
        transitionBlackOverlay.value = withTiming(0, {
          duration: 600, // Smooth fade in
          easing: Easing.out(Easing.ease),
        });
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 700); // Unlock after fade completes
      }, 100); // Short delay for render
    }, 400); // Wait for black fade to complete
  };

  const handleCancelCalibration = () => {
    // Reset capturing states
    setIsCapturing(false);
    setIsTransitioning(false);
    setIsHoldingShutter(false); // Reset hold state
    
    // Clear calibration data
    setCoinCircle(null);
    setCalibration(null);
    setSelectedCoin(null);
    
    // IMPORTANT: Set mode to camera BEFORE clearing image
    // This prevents race condition with useEffect that watches imageUri
    setMode('camera');
    
    // Clear BOTH local and persisted image states
    setCapturedPhotoUri(null);
    setImageUri(null);
    
    __DEV__ && console.log('🔄 Cancelled calibration, returning to camera mode');
  };

  const handleManualAltitudeConfirm = (altitudeMeters: number) => {
    if (!pendingDroneData || !pendingDroneData.specs) {
      console.error('❌ No pending drone data');
      setShowManualAltitudeModal(false);
      return;
    }

    console.log(`✅ Manual altitude entered: ${altitudeMeters}m`);

    // Calculate GSD from manual altitude
    const { sensor, focalLength, resolution } = pendingDroneData.specs;
    const sensorWidthMM = sensor.width;
    const focalLengthMM = focalLength;
    const imageWidthPx = resolution.width;
    const altitudeMM = altitudeMeters * 1000;

    // GSD = (altitude * sensorWidth) / (focalLength * imageWidth)
    const gsdMM = (altitudeMM * sensorWidthMM) / (focalLengthMM * imageWidthPx);
    const gsdCM = gsdMM / 10;

    console.log(`📐 Calculated GSD: ${gsdCM.toFixed(4)} cm/px`);

    // Set calibration
    const mmPerPixel = gsdCM * 10;
    const pixelsPerMM = 1 / mmPerPixel;

    setCalibration({
      pixelsPerUnit: pixelsPerMM,
      unit: 'mm',
      referenceDistance: gsdCM * 10,
    });

    setCoinCircle({
      centerX: resolution.width / 2,
      centerY: resolution.height / 2,
      radius: 100,
      coinName: `${pendingDroneData.displayName || 'Drone'} @ ${altitudeMeters}m`,
      coinDiameter: gsdCM * 10,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Clean up
    setShowManualAltitudeModal(false);
    setPendingDroneData(null);

    // Transition to measurement mode
    setIsTransitioning(true);
    transitionBlackOverlay.value = withTiming(1, {
      duration: 150,
      easing: Easing.in(Easing.ease),
    });

    setTimeout(() => {
      setMode('measurement');
      setTimeout(() => {
        transitionBlackOverlay.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
        setTimeout(() => {
          setIsTransitioning(false);
        }, 250);
      }, 150);
    }, 150);
  };

  const handleManualAltitudeCancel = () => {
    console.log('❌ Manual altitude entry cancelled');
    setShowManualAltitudeModal(false);
    setPendingDroneData(null);
    // Stay in calibration mode with the imported image
  };

  const handleRetakePhoto = () => {
    // Reset all states
    setIsCapturing(false);
    setIsTransitioning(false);
    setImageUri(null);
    setCoinCircle(null);
    setCalibration(null);
    setImageOrientation(null);
    setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
    setMode('camera');
  };

  // Handle photo type selection from modal
  const handlePhotoTypeSelection = (type: PhotoType) => {
    setShowPhotoTypeModal(false);
    setCurrentPhotoType(type);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // COIN: Go to calibration screen for coin calibration
    if (type === 'coin') {
      setIsTransitioning(true);
      transitionBlackOverlay.value = withTiming(1, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });
      
      setTimeout(() => {
        setMode('zoomCalibrate');
        
        transitionBlackOverlay.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 250);
      }, 150);
    }
    // ALL OTHER TYPES: Skip calibration, go straight to measurement screen
    // The appropriate modal will be triggered there
    else {
      setIsTransitioning(true);
      transitionBlackOverlay.value = withTiming(1, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });
      
      setTimeout(() => {
        setMode('measurement');
        
        // Show the appropriate modal based on photo type
        setTimeout(() => {
          if (type === 'map') {
            setShowVerbalScaleModal(true);
          } else if (type === 'blueprint') {
            // Blueprint mode handles known scale, aerial photos, blueprints, rulers, etc.
            // User will be prompted if they want aerial mode (with aerial language) or blueprint mode
            setSkipToBlueprintMode(true);
          }
          
          transitionBlackOverlay.value = withTiming(0, {
            duration: 250,
            easing: Easing.out(Easing.ease),
          });
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 250);
        }, 50);
      }, 150);
    }
  };

  const pickImage = async () => {
    try {
      // Request media library permission first
      if (!mediaLibraryPermission?.granted) {
        console.log("📸 Requesting media library permission...");
        const { granted } = await requestMediaLibraryPermission();
        if (!granted) {
          alert("Permission to access photo library is required to import photos. Please enable it in Settings.");
          return;
        }
      }
      
      console.log("📸 Opening image picker...");
      console.log('📸 Photo library button: opening image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        exif: true, // Request EXIF data
      });

      console.log('📷 Image picker returned:', { canceled: result.canceled, hasAsset: !!result.assets?.[0] });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // ⚠️ CRITICAL: Use local state first, defer AsyncStorage write
        setCapturedPhotoUri(asset.uri); // Instant local state
        await detectOrientation(asset.uri); // Already deferred inside
        
        // Show photo type selection modal for all imported photos
        setPendingPhotoUri(asset.uri);
        setShowPhotoTypeModal(true);
        
        // Defer AsyncStorage write to prevent UI blocking during import
        setTimeout(() => {
          setImageUri(asset.uri, false); // Background persist
          __DEV__ && console.log('✅ Deferred imported photo AsyncStorage write complete');
        }, 300);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Diagnostic Mode
  if (showDiagnostic) {
    return <DiagnosticScreen onComplete={() => setShowDiagnostic(false)} />;
  }

  // Camera Mode
  if (mode === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Animated.View style={[{ flex: 1 }, cameraAnimatedStyle]}>
          <TouchOverlayFingerprints color={crosshairColor.main} enabled={true}>
            <CameraView 
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="back"
                enableTorch={flashEnabled}
                autofocus="off"
              >
              {/* Top controls */}
            <View 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 10,
                paddingTop: insets.top + 16 
              }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24 }}>
                  {/* Original Controls - Right Side */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Pressable
                      onPress={() => {
                        __DEV__ && console.log('🔵 Help button pressed in camera screen');
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowHelpModal(true);
                      }}
                      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="help-circle-outline" size={28} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setFlashEnabled(!flashEnabled);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons 
                        name={flashEnabled ? "flash" : "flash-off"} 
                        size={26} 
                        color={flashEnabled ? "#FFD700" : "white"} 
                      />
                    </Pressable>
                  </View>
                </View>
            </View>

            {/* Fixed gray crosshairs - REFERENCE (always centered) */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              pointerEvents="none"
            >
              {/* Horizontal gray line - always visible */}
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: 'rgba(156, 163, 175, 0.5)', // Gray
                  marginTop: -1,
                }}
              />
            </View>
            
            {/* Vertical gray line - ONLY in horizontal mode */}
            <Animated.View
              style={(() => {
                'worklet';
                const isVertical = isVerticalMode.value;
                return {
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  opacity: isVertical ? 0 : 1, // Hide in vertical mode
                };
              })()}
              pointerEvents="none"
            >
              <View
                style={{
                  width: 2,
                  height: '100%',
                  backgroundColor: 'rgba(156, 163, 175, 0.5)', // Gray
                  marginLeft: -1,
                }}
              />
            </Animated.View>

            {/* Floating RED crosshairs - LEVEL INDICATOR (moves with tilt) */}
            {/* Graceful fade when switching horizontal/vertical */}
            <Animated.View
              style={(() => {
                'worklet';
                return {
                  position: 'absolute',
                  top: -SCREEN_HEIGHT,
                  left: -SCREEN_WIDTH,
                  right: -SCREEN_WIDTH,
                  bottom: -SCREEN_HEIGHT,
                  opacity: levelLinesOpacity.value, // Smooth animated fade
                  transform: [
                    { translateX: bubbleX.value * 3 },
                    { translateY: bubbleY.value * 3 },
                  ],
                };
              })()}
              pointerEvents="none"
            >
              {/* Horizontal red line (horizon) */}
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: `${crosshairColor.main}CC`, // Use session color with 80% opacity
                  marginTop: -1,
                }}
              />
            </Animated.View>
            
            {/* Vertical red line - Graceful fade when switching horizontal/vertical */}
            <Animated.View
              style={(() => {
                'worklet';
                return {
                  position: 'absolute',
                  top: -SCREEN_HEIGHT,
                  left: -SCREEN_WIDTH,
                  right: -SCREEN_WIDTH,
                  bottom: -SCREEN_HEIGHT,
                  opacity: levelLinesOpacity.value, // Smooth animated fade
                  transform: [
                    { translateX: bubbleX.value * 3 },
                    { translateY: bubbleY.value * 3 },
                  ],
                };
              })()}
              pointerEvents="none"
            >
              <View
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: 3,
                  backgroundColor: `${crosshairColor.main}CC`, // Use session color with 80% opacity
                  marginLeft: -1.5,
                }}
              />
            </Animated.View>

            {/* Crosshairs overlay - center of screen */}
            {/* Always visible - bubble level for alignment */}
            <Animated.View 
              style={[
                {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 120, // 20% bigger (was 100)
                  height: 120,
                  marginLeft: -60, // Center it
                  marginTop: -60,
                },
                crosshairContainerStyle,
              ]}
              pointerEvents="none"
            >
              
              {/* Horizontal line - glows when bubble is centered */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 59, // Center in 120px container
                    left: 0,
                    right: 0,
                    height: 2,
                  },
                  crosshairHorizontalStyle,
                ]}
              />
              {/* Vertical line - glows when bubble is centered */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: 59, // Center in 120px container
                    top: 0,
                    bottom: 0,
                    width: 2,
                  },
                  crosshairVerticalStyle,
                ]}
              />
              
              {/* COSMIC ENERGY BALL - Disabled in favor of red crosshairs */}
              {false && (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                  },
                  bubbleStyle,
                ]}
              >
                {/* Dark cosmic base */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 7,
                    backgroundColor: bubbleColor.main, // Solid session color
                    opacity: 0.95,
                  }}
                />
                
                {/* Subtle inner highlight */}
                <View
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Subtle white highlight
                  }}
                />
              </Animated.View>
              )}
              
              {/* Center dot - morphs when bubble crosses */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 57, // Center in 120px container
                    left: 57,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                  },
                  centerDotStyle,
                ]}
              />
            </Animated.View>

            {/* "Aim Down" Message - Shows when NOT horizontal, same position as instructions */}
            <Animated.View
              style={(() => {
                'worklet';
                const opacity = lookDownOpacity.value;
                return {
                  position: 'absolute',
                  bottom: insets.bottom + 150, // Same position as instructions (above shutter)
                  left: 24,
                  right: 24,
                  alignItems: 'center',
                  opacity: opacity,
                  pointerEvents: 'none',
                };
              })()}
            >
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                  Aim down for auto level/capture
                </Text>
              </View>
            </Animated.View>

            {/* Instructions Message - Shows when horizontal, positioned above shutter button */}
            <Animated.View
              style={(() => {
                'worklet';
                const displayOpacity = instructionsDisplayOpacity.value;
                const holdOpacity = instructionsOpacity.value;
                return {
                  position: 'absolute',
                  bottom: insets.bottom + 150, // Above shutter button
                  left: 24,
                  right: 24,
                  alignItems: 'center',
                  opacity: displayOpacity * holdOpacity, // Combine both fade effects
                  pointerEvents: 'none',
                };
              })()}
            >
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 18 }}>
                  1. Place coin in center
                </Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 18 }}>
                  2. Line up the lines
                </Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 18 }}>
                  3. Tap to capture
                </Text>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: '500', textAlign: 'center', lineHeight: 16, opacity: 0.8 }}>
                  (hold for auto capture)
                </Text>
              </View>
            </Animated.View>

            {/* Coin Placement Circle - Single 25px circle in center */}
            <Animated.View
              style={(() => {
                'worklet';
                const horizontal = isHorizontal.value;
                return {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 25,
                  height: 25,
                  marginLeft: -12.5,
                  marginTop: -12.5,
                  opacity: horizontal ? 0.8 : 0,
                  pointerEvents: 'none',
                };
              })()}
            >
              <View style={{ 
                width: 25, 
                height: 25, 
                borderRadius: 12.5,
                borderWidth: 2,
                borderColor: 'rgba(59, 130, 246, 0.9)',
                backgroundColor: 'transparent',
              }} />
            </Animated.View>

            {/* Auto-Capture Button - Positioned close to crosshairs for visibility */}
            {showAutoCaptureButton && !autoCaptureEnabled && (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    top: '50%',
                    marginTop: 100, // Just below the crosshairs
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 15,
                  },
                  autoCaptureButtonStyle,
                ]}
              >
                <Pressable
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setAutoCaptureEnabled(true);
                    
                    // Fade out button after 2.5 seconds
                    setTimeout(() => {
                      autoCaptureButtonOpacity.value = withTiming(0, { duration: 800 });
                      setTimeout(() => setShowAutoCaptureButton(false), 800);
                    }, 2500);
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: pressed 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.15)',
                    paddingVertical: 20,
                    paddingHorizontal: 32,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                  })}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontWeight: '700',
                      textAlign: 'center',
                      letterSpacing: 0.5,
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                  >
                    Tap to Begin Auto Capture
                  </Text>
                </Pressable>
              </Animated.View>
            )}

            {/* Bottom controls */}
            <View 
              style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 25,
                paddingBottom: insets.bottom + 40,
                pointerEvents: 'box-none'
              }}
            >
              <View style={{ alignItems: 'center', pointerEvents: 'box-none' }}>
                {/* Photo Library Button - Same size as shutter (80x80) */}
                <Pressable
                  onPress={async () => {
                    console.log('📸 Photo library button pressed');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    await pickImage();
                  }}
                  style={{ 
                    position: 'absolute', 
                    left: 32, 
                    bottom: 0, 
                    width: 80, 
                    height: 80, 
                    borderRadius: 40, 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons name="images-outline" size={36} color="white" />
                </Pressable>

                {/* Instructional Text Sequence - Positioned halfway between crosshairs and bottom */}
                {!isCapturing && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      // Position halfway between crosshairs (center) and bottom
                      top: SCREEN_HEIGHT / 2 + (SCREEN_HEIGHT / 4),
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 32,
                    }}
                    pointerEvents="none"
                  >
                    {/* Phase 1: Initial Instructions (0-10s) */}
                    {showInstructionalText && (
                      <Animated.Text
                        style={[
                          {
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '700',
                            textAlign: 'center',
                            lineHeight: 26,
                            textShadowColor: 'rgba(0, 0, 0, 0.9)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 6,
                          },
                          instructionalTextAnimatedStyle,
                        ]}
                      >
                        Place object in crosshairs with coin, keep level
                      </Animated.Text>
                    )}
                    
                    {/* Phase 2: Encouragement (10-13s) */}
                    {showEncouragementText && (
                      <Animated.Text
                        style={[
                          {
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '700',
                            textAlign: 'center',
                            lineHeight: 26,
                            textShadowColor: 'rgba(0, 0, 0, 0.9)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 6,
                          },
                          encouragementTextAnimatedStyle,
                        ]}
                      >
                        Focus, keep this level, you got this!
                      </Animated.Text>
                    )}
                    
                    {/* Phase 3: Reminder (15-18s) */}
                    {showReminderText && (
                      <Animated.Text
                        style={[
                          {
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '700',
                            textAlign: 'center',
                            lineHeight: 26,
                            textShadowColor: 'rgba(0, 0, 0, 0.9)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 6,
                          },
                          reminderTextAnimatedStyle,
                        ]}
                      >
                        Remember to hold still and center the ball in the middle
                      </Animated.Text>
                    )}
                    
                    {/* "Capturing..." always visible during capture */}
                    {isCapturing && (
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 18,
                          fontWeight: '700',
                          textAlign: 'center',
                          textShadowColor: 'rgba(0, 0, 0, 0.9)',
                          textShadowOffset: { width: 0, height: 2 },
                          textShadowRadius: 6,
                        }}
                      >
                        Capturing...
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </CameraView>
          </TouchOverlayFingerprints>
          
          {/* Bottom Shutter Button */}
          {!isCapturing && (
            <View
              style={{
                position: 'absolute',
                bottom: insets.bottom + 40,
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 20,
              }}
            >
              <Pressable
                onPressIn={() => {
                  // Capture orientation at press start to maintain consistent behavior
                  const orientationAtPress = isHorizontal.value;
                  holdStartTimeRef.current = Date.now();
                  
                  // Only enable hold mode if in horizontal orientation
                  if (orientationAtPress) {
                    // Horizontal mode: Start holding - enable auto-capture mode
                    setIsHoldingShutter(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    
                    // Fade out instructions when user starts holding
                    instructionsOpacity.value = withTiming(0, {
                      duration: 400,
                      easing: Easing.out(Easing.ease),
                    });
                  } else {
                    // Vertical mode: Just haptic feedback, no hold state
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                onPressOut={() => {
                  // Release - check if it was a quick tap or hold
                  const holdDuration = Date.now() - holdStartTimeRef.current;
                  const wasHolding = isHoldingShutter;
                  setIsHoldingShutter(false);
                  holdStartTimeRef.current = 0;
                  
                  // Only fade instructions back in if we're still in camera mode and not capturing
                  if (mode === 'camera' && !isCapturing) {
                    instructionsOpacity.value = withTiming(1, {
                      duration: 400,
                      easing: Easing.in(Easing.ease),
                    });
                  }
                  
                  __DEV__ && console.log('📸 Shutter released:', {
                    holdDuration,
                    wasHolding,
                    isCapturing,
                    mode,
                    hasCameraRef: !!cameraRef.current,
                    isCameraReady,
                  });
                  
                  // Quick tap - capture in both orientations
                  // Longer threshold (500ms) for better UX - user doesn't have to be super quick
                  if (holdDuration < 500 && !isCapturing) {
                    takePicture();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  } else if (isCapturing) {
                    __DEV__ && console.log('⚠️ Already capturing, skipping takePicture');
                  } else if (wasHolding && holdDuration >= 500) {
                    __DEV__ && console.log('✅ Released after hold - auto-capture should have triggered');
                  }
                }}
                style={({ pressed }) => ({
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: pressed 
                    ? `${shutterColor.main}CC`  // 80% opacity when pressed
                    : `${shutterColor.main}E6`, // 90% opacity normally
                  borderWidth: 5,
                  borderColor: isHoldingShutter ? crosshairColor.main : shutterColor.glow, // Show crosshair color when holding (visual feedback)
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: shutterColor.main,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 12,
                  elevation: 10,
                })}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: isHoldingShutter ? crosshairColor.glow : shutterColor.glow, // Show crosshair color when holding
                  borderWidth: 3,
                  borderColor: '#333',
                }} />
              </Pressable>
            </View>
          )}
          
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
        
        {/* Camera Flash Effect - Pleasant white flash */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              zIndex: 1000000, // ABOVE black overlay so flash is visible
            },
            cameraFlashStyle,
          ]}
        />
        
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
  // Use capturedPhotoUri (local state) OR currentImageUri (persisted) for display
  const displayImageUri = capturedPhotoUri || currentImageUri;
  
  return (
    <Animated.View style={[{ flex: 1, backgroundColor: 'black' }, screenTransitionStyle]}>
      {displayImageUri && (
        <>
          {/* Zoom Calibration Mode */}
          {mode === 'zoomCalibrate' && (
            <ZoomCalibration
              key={displayImageUri}
              imageUri={displayImageUri}
              sessionColor={crosshairColor}
              onComplete={handleCalibrationComplete}
              onCancel={handleCancelCalibration}
              onHelp={() => setShowHelpModal(true)}
            />
          )}

          {/* Measurement Mode */}
          {mode === 'measurement' && (
            <View key={displayImageUri} style={{ flex: 1 }}>
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
                  key={displayImageUri}
                  imageUri={displayImageUri}
                  fingerColor={sessionColors.crosshair.main}
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
                    
                    // ⚠️ CRITICAL PERFORMANCE FIX (Oct 16, 2025)
                    // Debounce AsyncStorage writes to prevent 10-15 second button lockup
                    // Writing to AsyncStorage 60+ times/sec during gestures blocks JS thread
                    // See: NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md
                    // DO NOT REMOVE THIS DEBOUNCE OR BUTTONS WILL FREEZE AFTER PANNING
                    if (zoomSaveTimeoutRef.current) {
                      clearTimeout(zoomSaveTimeoutRef.current);
                    }
                    zoomSaveTimeoutRef.current = setTimeout(() => {
                      setSavedZoomState(newZoom);
                    }, 500);
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
                  sessionColor={shutterColor}
                  skipToMapMode={skipToMapMode}
                  skipToBlueprintMode={skipToBlueprintMode}
                  skipToAerialMode={skipToAerialMode}
                  onRegisterDoubleTapCallback={(callback) => {
                    doubleTapToMeasureRef.current = callback;
                  }}
                  onReset={(recalibrateMode = false) => {
                    // Transition to camera or recalibration
                    setIsTransitioning(true);
                    
                    // Fast fade to black
                    transitionBlackOverlay.value = withTiming(1, {
                      duration: 300, // Quick fade out
                      easing: Easing.in(Easing.ease),
                    });
                    
                    // After black screen, switch to appropriate mode
                    setTimeout(() => {
                      if (recalibrateMode) {
                        // Recalibrate: Keep image, clear calibration AND measurements, go to zoomCalibrate
                        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
                        setMode('zoomCalibrate');
                        
                        // ⚠️ CRITICAL: Defer AsyncStorage writes to prevent recalibration freeze
                        setTimeout(() => {
                          setCoinCircle(null);
                          setCalibration(null);
                          setCompletedMeasurements([]);
                          setCurrentPoints([]);
                          __DEV__ && console.log('✅ Deferred recalibrate AsyncStorage writes complete');
                        }, 300);
                        
                        // Fade in the calibration screen
                        transitionBlackOverlay.value = withTiming(0, {
                          duration: 500,
                          easing: Easing.out(Easing.ease),
                        });
                        setTimeout(() => {
                          setIsTransitioning(false);
                        }, 500);
                      } else {
                        // Full reset: Clear everything and go to camera
                        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
                        setMode('camera');
                        
                        // ⚠️ CRITICAL: Defer ALL AsyncStorage writes to prevent New Photo freeze
                        setTimeout(() => {
                          setCompletedMeasurements([]);
                          setCurrentPoints([]);
                          setCoinCircle(null);
                          setCalibration(null);
                          setImageOrientation(null);
                          setCapturedPhotoUri(null); // Clear local state too
                          setImageUri(null);
                          __DEV__ && console.log('✅ Deferred New Photo AsyncStorage writes complete');
                        }, 300);
                        
                        // Camera's useEffect will handle the fade in
                        setTimeout(() => {
                          setIsTransitioning(false);
                        }, 800);
                      }
                    }, 300); // Wait for black fade to complete
                  }}
                />
              </View>
            </View>
          )}

          {/* Verbal Scale Modal */}
          <VerbalScaleModal
            visible={showVerbalScaleModal}
            onComplete={handleVerbalScaleComplete}
            onBlueprintMode={() => {
              // For now, just dismiss - blueprint mode not supported in initial photo screen
              setShowVerbalScaleModal(false);
              setMode('camera');
            }}
            onDismiss={() => {
              setShowVerbalScaleModal(false);
              setMode('camera'); // Go back to camera
            }}
          />
        </>
      )}

      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {/* Photo Type Selection Modal - Works in all modes */}
      <PhotoTypeSelectionModal
        visible={showPhotoTypeModal}
        onSelect={handlePhotoTypeSelection}
        onCancel={() => setShowPhotoTypeModal(false)}
        sessionColor={crosshairColor}
      />
      
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

      {/* BattlingBots Donation Modal - RENDER AFTER BLACK OVERLAY */}
      <BattlingBotsModal 
        visible={showBattlingBots}
        onClose={() => {
          setShowBattlingBots(false);
          // Reset first-time donor flag after showing celebration
          if (isFirstTimeDonor) {
            setIsFirstTimeDonor(false);
          }
        }} 
        isDonor={isDonor}
        isFirstTimeDonor={isFirstTimeDonor}
      />

    </Animated.View>
  );
}
