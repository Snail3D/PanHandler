import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Dimensions, Platform, AccessibilityInfo } from 'react-native';
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
import TypewriterText from '../components/TypewriterText';
import { CoinReference } from '../utils/coinReferences';
import { VerbalScale } from '../state/measurementStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ScreenMode = 'camera' | 'zoomCalibrate' | 'measurement';

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
  const [showAutoCaptureButton, setShowAutoCaptureButton] = useState(true); // Show button initially
  const autoCaptureButtonOpacity = useSharedValue(1); // For fade animation
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isStable, setIsStable] = useState(false);
  const [alignmentStatus, setAlignmentStatus] = useState<'good' | 'warning' | 'bad'>('bad');
  const recentAngles = useRef<number[]>([]);
  const recentAccelerations = useRef<number[]>([]); // Track phone motion
  const lastHapticRef = useRef<'good' | 'warning' | 'bad'>('bad');
  
  // Adaptive guidance system
  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);
  const guidanceOpacity = useSharedValue(0);
  const guidanceScale = useSharedValue(0.8);
  const lastGuidanceMessage = useRef<string | null>(null);
  const [accelerationVariance, setAccelerationVariance] = useState(0);
  const [currentBeta, setCurrentBeta] = useState(0);
  const [currentGamma, setCurrentGamma] = useState(0);
  
  // Bubble level
  const bubbleX = useSharedValue(0);
  const bubbleY = useSharedValue(0);
  const isVerticalMode = useSharedValue(false); // Track if phone is vertical
  
  // Pick random complementary colors for crosshairs and bubble (per session)
  const [sessionColors] = useState(() => {
    const colorPairs = [
      { crosshair: { main: '#3B82F6', glow: '#60A5FA' }, bubble: { main: '#F59E0B', glow: '#FBBF24' } },    // Blue vs Amber
      { crosshair: { main: '#8B5CF6', glow: '#A78BFA' }, bubble: { main: '#10B981', glow: '#34D399' } },    // Purple vs Green
      { crosshair: { main: '#EC4899', glow: '#F472B6' }, bubble: { main: '#06B6D4', glow: '#22D3EE' } },    // Pink vs Cyan
      { crosshair: { main: '#EF4444', glow: '#F87171' }, bubble: { main: '#3B82F6', glow: '#60A5FA' } },    // Red vs Blue
      { crosshair: { main: '#10B981', glow: '#34D399' }, bubble: { main: '#8B5CF6', glow: '#A78BFA' } },    // Green vs Purple
      { crosshair: { main: '#F59E0B', glow: '#FBBF24' }, bubble: { main: '#EC4899', glow: '#F472B6' } },    // Amber vs Pink
      { crosshair: { main: '#06B6D4', glow: '#22D3EE' }, bubble: { main: '#EF4444', glow: '#F87171' } },    // Cyan vs Red
    ];
    return colorPairs[Math.floor(Math.random() * colorPairs.length)];
  });
  const crosshairColor = sessionColors.crosshair;
  const bubbleColor = sessionColors.bubble;
  
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
  
  // Tap-to-focus indicator
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const focusIndicatorOpacity = useSharedValue(0);
  const focusIndicatorScale = useSharedValue(1);
  
  // Debug: Display sensor values on screen
  const [debugGamma, setDebugGamma] = useState(0);
  const [debugBeta, setDebugBeta] = useState(0);
  const [debugBubbleX, setDebugBubbleX] = useState(0);
  const [debugBubbleY, setDebugBubbleY] = useState(0);
  const [debugBubbleXRaw, setDebugBubbleXRaw] = useState(0);
  const [debugBubbleYRaw, setDebugBubbleYRaw] = useState(0);
  
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
  const isProUser = useStore((s) => s.isProUser);
  const setIsProUser = useStore((s) => s.setIsProUser);
  const specialOfferTriggered = useStore((s) => s.specialOfferTriggered);
  const specialOfferSessionsLeft = useStore((s) => s.specialOfferSessionsLeft);
  const decrementSpecialOfferSessions = useStore((s) => s.decrementSpecialOfferSessions);
  const dismissSpecialOffer = useStore((s) => s.dismissSpecialOffer);
  
  // Special offer modal state
  const [showSpecialOffer, setShowSpecialOffer] = useState(false);
  const specialOfferOpacity = useSharedValue(0);
  const specialOfferTranslateY = useSharedValue(-100);
  
  // Get funny copy based on sessions left
  const getSpecialOfferCopy = (sessionsLeft: number) => {
    if (sessionsLeft === 3) {
      return {
        title: "⚠️ ERROR: Squiggly Line Not Found",
        message: "We noticed you haven't tried our fancy freehand tool yet. You know... for when straight lines are just too mainstream.",
        price: "$6.97",
        sessionsText: "3 sessions to decide",
      };
    } else if (sessionsLeft === 2) {
      return {
        title: "💪 You're Twisting Our Arm",
        message: "Alright tough guy, we'll drop it even MORE. But seriously, this squiggly line is pretty cool...",
        price: "$5.97",
        sessionsText: "Only 2 sessions left!",
      };
    } else {
      return {
        title: "🚨 LAST CHANCE ALERT",
        message: "This is it. Final price. We're basically giving it away. After this? Full price forever.",
        price: "$4.97",
        sessionsText: "LAST SESSION",
      };
    }
  };
  
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

  // Track sessions and trigger special offer (on mount only)
  useEffect(() => {
    // Increment session count
    incrementSessionCount();
    
    // Check if we should trigger special offer (sessions 50, 51, 52 for free users)
    const newSessionCount = sessionCount + 1; // Account for the increment we just did
    
    if (!isProUser && newSessionCount >= 50 && newSessionCount <= 52) {
      // Update store to mark offer as triggered if first time
      if (!specialOfferTriggered && newSessionCount === 50) {
        // First time hitting 50 - trigger the offer system
        useStore.setState({ specialOfferTriggered: true, specialOfferSessionsLeft: 3 });
      } else if (specialOfferTriggered && specialOfferSessionsLeft > 0) {
        // Already triggered, decrement counter
        decrementSpecialOfferSessions();
      }
      
      // Show modal if sessions left > 0
      if (specialOfferSessionsLeft > 0 || newSessionCount === 50) {
        setTimeout(() => {
          setShowSpecialOffer(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }, 2000); // Show 2s after app opens
      }
    }
  }, []); // Only on mount
  
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
  
  // Animate special offer banner in/out
  useEffect(() => {
    if (showSpecialOffer) {
      specialOfferOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      specialOfferTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    } else {
      specialOfferOpacity.value = withTiming(0, { duration: 300 });
      specialOfferTranslateY.value = withTiming(-100, { duration: 300 });
    }
  }, [showSpecialOffer]);
  
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
    // Low-end devices: 150ms (6.7fps) - gentler on CPU/battery
    // Normal devices: 100ms (10fps) - smooth but efficient
    const updateInterval = isLowEndDevice ? 150 : 100;
    DeviceMotion.setUpdateInterval(updateInterval);

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const beta = data.rotation.beta * (180 / Math.PI);
        const gamma = data.rotation.gamma * (180 / Math.PI);
        const alpha = data.rotation.alpha * (180 / Math.PI); // Rotation/roll
        const absBeta = Math.abs(beta);
        
        // Store for guidance system
        setCurrentBeta(beta);
        setCurrentGamma(gamma);
        
        // Auto-detect horizontal (0°) or vertical (90°)
        const targetOrientation = absBeta < 45 ? 'horizontal' : 'vertical';
        const absTilt = targetOrientation === 'horizontal' ? absBeta : Math.abs(absBeta - 90);
        
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
        // Detect if phone is horizontal or vertical
        const isVertical = absBeta > 45; // Phone is held vertically (portrait)
        isVerticalMode.value = isVertical; // Update shared value for crosshair rotation
        
        const maxBubbleOffset = 48; // Max pixels the bubble can move from center (120px crosshairs / 2.5)
        
        if (isVertical) {
          // VERTICAL MODE: Real physics - ball rolls in direction of tilt
          // When phone is held vertically (portrait):
          // 
          // FORWARD/BACKWARD TILT (beta):
          //   - beta ~90° = perfectly upright (ball centered)
          //   - beta > 90° = tilts forward (top toward you) → ball rolls DOWN (positive Y)
          //   - beta < 90° = tilts backward (top away) → ball rolls UP (negative Y)
          //
          // LEFT/RIGHT TILT (gamma): 
          //   - gamma ~0° = no tilt (ball centered)
          //   - gamma > 0 = tilts right → ball rolls LEFT (negative X, inverted for real physics)
          //   - gamma < 0 = tilts left → ball rolls RIGHT (positive X, inverted for real physics)
          
          // Calculate deviation from 90° (perfect vertical)
          const forwardBackwardTilt = beta - 90; // Positive = forward, negative = backward
          
          // IMPORTANT: In vertical mode, gamma can be offset by ~180°
          // Normalize gamma to -180 to +180 range centered around vertical orientation
          let normalizedGamma = gamma;
          if (gamma > 90) {
            normalizedGamma = gamma - 180; // Convert 179° to -1°, 90° to -90°, etc.
          }
          
          // Use same formula as horizontal mode (which works well!)
          const bubbleXOffset = (normalizedGamma / 15) * maxBubbleOffset; // Left/right tilt → X movement
          const bubbleYOffset = -(forwardBackwardTilt / 15) * maxBubbleOffset; // Forward/back tilt → Y movement (INVERTED for homing guide)
          
          // Clamp to circular boundary (stay within crosshairs)
          const distance = Math.sqrt(bubbleXOffset * bubbleXOffset + bubbleYOffset * bubbleYOffset);
          let finalX = bubbleXOffset;
          let finalY = bubbleYOffset;
          
          if (distance > maxBubbleOffset) {
            const scale = maxBubbleOffset / distance;
            finalX = bubbleXOffset * scale;
            finalY = bubbleYOffset * scale;
          }
          
          // VERTICAL MODE: Use same spring as horizontal (fast and responsive)
          bubbleX.value = withSpring(finalX, { 
            damping: 20,
            stiffness: 180,
            mass: 0.8
          });
          bubbleY.value = withSpring(finalY, { 
            damping: 20,
            stiffness: 180,
            mass: 0.8
          });
          
          // Update debug display (occasionally to avoid performance hit)
          if (Math.random() < 0.1) {
            setDebugGamma(gamma);
            setDebugBeta(beta);
            setDebugBubbleXRaw(bubbleXOffset);
            setDebugBubbleYRaw(bubbleYOffset);
            setDebugBubbleX(finalX);
            setDebugBubbleY(finalY);
          }
        } else {
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
          
          bubbleX.value = withSpring(finalX, { damping: 20, stiffness: 180, mass: 0.8 });
          bubbleY.value = withSpring(finalY, { damping: 20, stiffness: 180, mass: 0.8 });
        }
        
        // Calculate crosshair glow (0-1) based on how centered the bubble is
        const distanceFromCenter = Math.sqrt(bubbleX.value * bubbleX.value + bubbleY.value * bubbleY.value);
        const glowAmount = Math.max(0, 1 - (distanceFromCenter / 15)); // Glow when within 15px of center
        crosshairGlow.value = withSpring(glowAmount, { damping: 15, stiffness: 200 });
        
        // Check BOTH angle stability AND motion stability
        // Accessibility: After 10 seconds of holding, loosen requirements for Parkinson's/tremor support
        if (recentAngles.current.length >= 3 && recentAccelerations.current.length >= 3) {
          const holdDuration = holdStartTime.current > 0 ? (Date.now() - holdStartTime.current) / 1000 : 0;
          const isAccessibilityMode = holdDuration > 10; // After 10 seconds, be more forgiving
          
          // Angle stability: Much more relaxed - 5° is plenty good enough
          const angleThreshold = isAccessibilityMode ? 8 : 5;
          const maxAngle = Math.max(...recentAngles.current);
          const minAngle = Math.min(...recentAngles.current);
          const angleStable = (maxAngle - minAngle) <= angleThreshold;
          
          // Motion stability: Much more forgiving - allow natural hand movements
          const motionThreshold = isAccessibilityMode ? 0.6 : 0.4;
          const maxAccel = Math.max(...recentAccelerations.current);
          const minAccel = Math.min(...recentAccelerations.current);
          const motionStable = (maxAccel - minAccel) <= motionThreshold;
          
          // BOTH must be stable
          setIsStable(angleStable && motionStable);
        }

        // Alignment status - also relax tolerance after 10 seconds
        const holdDuration = holdStartTime.current > 0 ? (Date.now() - holdStartTime.current) / 1000 : 0;
        const isAccessibilityMode = holdDuration > 10;
        
        let status: 'good' | 'warning' | 'bad';
        if (isAccessibilityMode) {
          // More forgiving thresholds for accessibility
          if (absTilt <= 8) status = 'good';      // Very relaxed
          else if (absTilt <= 20) status = 'warning';
          else status = 'bad';
        } else {
          // Much more relaxed standard tolerance - captures sooner
          if (absTilt <= 5) status = 'good';      // Was 2° - now 5°
          else if (absTilt <= 15) status = 'warning';  // Was 10° - now 15°
          else status = 'bad';
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

  // Auto-capture when conditions are met (no button needed!)
  useEffect(() => {
    if (mode !== 'camera' || isCapturing || !autoCaptureEnabled) return;

    if (alignmentStatus === 'good' && isStable) {
      // Add small delay to ensure camera is fully mounted before taking picture
      const timer = setTimeout(() => {
        if (mode === 'camera' && !isCapturing && cameraRef.current && autoCaptureEnabled) {
          takePicture();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mode, alignmentStatus, isStable, isCapturing, autoCaptureEnabled]);
  
  // Reset auto-capture when entering camera mode (user must tap button again)
  useEffect(() => {
    if (mode === 'camera') {
      setAutoCaptureEnabled(false);
    }
  }, [mode]);
  
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
  
  // Rotate entire crosshair 90° when phone is vertical
  const crosshairContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: isVerticalMode.value ? '90deg' : '0deg' }
    ],
  }));
  
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: isVerticalMode.value
      ? [
          // When crosshair rotates 90°, we need to swap and adjust coordinates
          // Physical gamma (left/right tilt) → Visual Y-axis (up/down on screen)
          // Physical beta (forward/back) → Visual X-axis (left/right on screen)
          { translateX: -bubbleY.value + 60 - 7 }, // Use Y for X, negate for correct direction
          { translateY: bubbleX.value + 60 - 7 },  // Use X for Y
        ]
      : [
          // Normal mapping in horizontal mode
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
      cameraOpacity.value = 0;
      blackOverlayOpacity.value = 1;
      transitionBlackOverlay.value = 0; // Clear transition overlay so camera's fade works
      cameraFlashOpacity.value = 0; // Reset flash in case it's still visible
      
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

  const cameraFlashStyle = useAnimatedStyle(() => ({
    opacity: cameraFlashOpacity.value,
  }));
  
  const specialOfferAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: specialOfferTranslateY.value }],
    opacity: specialOfferOpacity.value,
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
  
  const focusIndicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: focusIndicatorOpacity.value,
    transform: [{ scale: focusIndicatorScale.value }],
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
        mode
      });
      return;
    }
    
    const wasAutoCapture = alignmentStatus === 'good' && isStable;
    
    try {
      setIsCapturing(true);
      
      // Check camera permissions one more time
      if (!permission?.granted) {
        console.error('Camera permission not granted');
        return;
      }
      
      // Pleasant camera flash effect - MUST complete before transition
      cameraFlashOpacity.value = 1;
      cameraFlashOpacity.value = withTiming(0, {
        duration: 150, // Quick 150ms flash
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
            let photoToSave = photo.uri;
            
            // If auto-captured, add badge to photo before saving
            if (wasAutoCapture) {
              // TODO: Add badge overlay here using a pre-made badge image
              // For now, just save the original photo
              // We'll need to either:
              // 1. Create a pre-made badge PNG asset and use a library that supports image compositing
              // 2. Use expo-gl or canvas to draw the badge
              // 3. Render a View with photo+badge and capture it with react-native-view-shot
            }
            
            // Save photo to library
            const asset = await MediaLibrary.createAssetAsync(photoToSave);
            
            // If auto-captured, also save to "Auto-Leveled" album
            if (wasAutoCapture) {
              try {
                // Get or create "Auto-Leveled" album
                const album = await MediaLibrary.getAlbumAsync('Auto-Leveled');
                if (album) {
                  await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                } else {
                  await MediaLibrary.createAlbumAsync('Auto-Leveled', asset, false);
                }
                __DEV__ && console.log('✅ Photo saved to camera roll + Auto-Leveled album (badge overlay pending)');
              } catch (albumError) {
                console.error('Failed to add to Auto-Leveled album:', albumError);
                __DEV__ && console.log('✅ Photo saved to camera roll only');
              }
            } else {
              __DEV__ && console.log('✅ Photo saved to camera roll');
            }
          } catch (saveError) {
            console.error('Failed to save to camera roll:', saveError);
          }
        }

        // Set image URI (auto-captured if it was via hold)
        setImageUri(photo.uri, wasAutoCapture);
        await detectOrientation(photo.uri);
        
        // CINEMATIC MORPH: Camera → Calibration (same photo, just morph the UI!)
        setIsTransitioning(true);
        
        // Immediately start the morph after flash (200ms after capture)
        setTimeout(() => {
          // Fade out camera opacity to reveal the photo underneath
          cameraOpacity.value = withTiming(0, {
            duration: 600, // Smooth fade
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          });
          
          // Slight zoom morph for drama
          screenScale.value = withSequence(
            withTiming(1.05, { duration: 300, easing: Easing.out(Easing.cubic) }), // Slight zoom in
            withTiming(1, { duration: 300, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }) // Settle
          );
          
          // Switch mode mid-transition so photo appears
          setTimeout(() => {
            setMode('zoomCalibrate');
          }, 300); // Switch halfway through the morph
          
          // Unlock after full transition
          setTimeout(() => {
            setIsTransitioning(false);
          }, 600);
        }, 200); // Wait for flash to complete
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
    
    // Simpler approach: Just fade to black, switch instantly, fade in
    setIsTransitioning(true);
    
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
          <Pressable 
            style={{ flex: 1 }}
            onPress={async (event) => {
              const { locationX, locationY } = event.nativeEvent;
              if (cameraRef.current) {
                try {
                  // Show focus indicator at tap location
                  setFocusPoint({ x: locationX, y: locationY });
                  
                  // Animate focus indicator
                  focusIndicatorOpacity.value = 1;
                  focusIndicatorScale.value = 1.5;
                  focusIndicatorScale.value = withSpring(1, { damping: 15, stiffness: 200 });
                  
                  // Fade out after animation
                  setTimeout(() => {
                    focusIndicatorOpacity.value = withTiming(0, { duration: 500 });
                  }, 800);
                  
                  // Focus camera at tap location
                  // Note: Expo Camera v15+ handles focus automatically on tap
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch (error) {
                  __DEV__ && console.log('Focus error:', error);
                }
              }
            }}
          >
            <CameraView 
              ref={cameraRef}
              style={{ flex: 1 }}
              facing="back"
              enableTorch={flashEnabled}
              autofocus="on"
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 }}>
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
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Take Photo</Text>
                {/* Spacer to keep title centered */}
                <View style={{ width: 40, height: 40 }} />
              </View>
            </View>

            {/* Debug Display - Top Left */}
            {mode === 'camera' && (
              <View
                style={{
                  position: 'absolute',
                  top: insets.top + 60,
                  left: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: 12,
                  borderRadius: 8,
                  zIndex: 100,
                }}
                pointerEvents="none"
              >
                <Text style={{ color: 'white', fontSize: 11, fontFamily: 'monospace' }}>
                  gamma: {debugGamma.toFixed(1)}°
                </Text>
                <Text style={{ color: 'white', fontSize: 11, fontFamily: 'monospace' }}>
                  beta: {debugBeta.toFixed(1)}°
                </Text>
                <Text style={{ color: 'yellow', fontSize: 11, fontFamily: 'monospace' }}>
                  raw X: {debugBubbleXRaw.toFixed(1)}
                </Text>
                <Text style={{ color: 'yellow', fontSize: 11, fontFamily: 'monospace' }}>
                  raw Y: {debugBubbleYRaw.toFixed(1)}
                </Text>
                <Text style={{ color: 'lime', fontSize: 11, fontFamily: 'monospace' }}>
                  final X: {debugBubbleX.toFixed(1)}
                </Text>
                <Text style={{ color: 'lime', fontSize: 11, fontFamily: 'monospace' }}>
                  final Y: {debugBubbleY.toFixed(1)}
                </Text>
              </View>
            )}

            {/* Crosshairs overlay - center of screen */}
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
              
              {/* COSMIC ENERGY BALL - Professional solid design */}
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
                zIndex: 10,
                paddingBottom: insets.bottom + 32 
              }}
            >
              <View style={{ alignItems: 'center' }}>
                {/* Photo Library Button */}
                <Pressable
                  onPress={pickImage}
                  style={{ 
                    position: 'absolute', 
                    left: 32, 
                    bottom: 0, 
                    width: 56, 
                    height: 56, 
                    borderRadius: 28, 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: 3 
                  }}
                >
                  <Ionicons name="images-outline" size={28} color="white" />
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
                onPress={() => {
                  // Toggle auto-capture mode
                  setAutoCaptureEnabled(!autoCaptureEnabled);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                style={({ pressed }) => ({
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: autoCaptureEnabled 
                    ? (pressed ? 'rgba(76, 175, 80, 0.8)' : 'rgba(76, 175, 80, 1)') 
                    : (pressed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                  borderWidth: 5,
                  borderColor: autoCaptureEnabled ? '#4CAF50' : 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: autoCaptureEnabled ? '#4CAF50' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 12,
                  elevation: 10,
                })}
              >
                {autoCaptureEnabled ? (
                  <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                ) : (
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: 'white',
                    borderWidth: 3,
                    borderColor: '#333',
                  }} />
                )}
              </Pressable>
              
              {/* Status text below button */}
              <Text
                style={{
                  marginTop: 12,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: '700',
                  textAlign: 'center',
                  textShadowColor: 'rgba(0, 0, 0, 0.9)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}
              >
                {autoCaptureEnabled ? '✓ Auto-Capture Active' : 'Tap to Begin'}
              </Text>
            </View>
          )}
          
          {/* Tap-to-Focus Indicator */}
          {focusPoint && (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  left: focusPoint.x - 40,
                  top: focusPoint.y - 40,
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                  borderColor: '#FFD700',
                  borderRadius: 40,
                  shadowColor: '#FFD700',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                },
                focusIndicatorAnimatedStyle,
              ]}
            />
          )}
          </Pressable>
          
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
                        setCoinCircle(null);
                        setCalibration(null);
                        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
                        setCompletedMeasurements([]); // Clear all measurements
                        setCurrentPoints([]); // Clear current drawing points
                        setMode('zoomCalibrate');
                        
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
                        setMode('camera');
                        
                        // Clear image state so camera shows up
                        setImageUri(null);
                        setCoinCircle(null);
                        setCalibration(null);
                        setImageOrientation(null);
                        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
                        setCompletedMeasurements([]); // Clear measurements
                        setCurrentPoints([]); // Clear points
                        
                        // Camera's useEffect will handle the fade in
                        setTimeout(() => {
                          setIsTransitioning(false);
                        }, 1800); // Wait for camera fade in
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
            onDismiss={() => {
              setShowVerbalScaleModal(false);
              setMode('camera'); // Go back to camera
            }}
          />
        </>
      )}

      {/* Special Offer Banner - Only show in measurement mode */}
      {mode === 'measurement' && !isProUser && showSpecialOffer && specialOfferSessionsLeft > 0 && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: insets.top + 20,
              left: 20,
              right: 20,
              zIndex: 100000,
            },
            specialOfferAnimatedStyle,
          ]}
        >
          <Pressable
            onPress={() => {
              setShowSpecialOffer(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{ flex: 1 }}
          >
            <BlurView
              intensity={100}
              tint="light"
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                shadowColor: '#5856D6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 12,
                borderWidth: 2,
                borderColor: 'rgba(88, 86, 214, 0.4)',
              }}
            >
              <View style={{ padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                {/* Squiggly Line Icon */}
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Svg width="50" height="50" viewBox="0 0 60 60">
                    <Path
                      d="M 10 30 Q 20 15, 30 30 T 50 30"
                      stroke="#5856D6"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <Path d="M 10 30 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" fill="#5856D6" />
                    <Path d="M 50 30 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" fill="#5856D6" />
                  </Svg>
                </View>

                {/* Title */}
                <Text style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: '#1C1C1E',
                  textAlign: 'center',
                  marginBottom: 10,
                  textShadowColor: 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}>
                  {getSpecialOfferCopy(specialOfferSessionsLeft).title}
                </Text>

                {/* Message - Typewriter Effect */}
                <TypewriterText
                  text={getSpecialOfferCopy(specialOfferSessionsLeft).message}
                  speed={25}
                  style={{
                    fontSize: 14,
                    color: '#3C3C43',
                    textAlign: 'center',
                    lineHeight: 20,
                    marginBottom: 16,
                  }}
                />

                {/* Price Badge */}
                <View style={{
                  backgroundColor: 'rgba(88, 86, 214, 0.2)',
                  borderRadius: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  alignSelf: 'center',
                  marginBottom: 12,
                  borderWidth: 1.5,
                  borderColor: 'rgba(88, 86, 214, 0.4)',
                }}>
                  <Text style={{ fontSize: 32, fontWeight: '900', color: '#5856D6', textAlign: 'center' }}>
                    {getSpecialOfferCopy(specialOfferSessionsLeft).price}
                  </Text>
                </View>

                {/* Countdown */}
                <View style={{
                  backgroundColor: 'rgba(255, 149, 0, 0.15)',
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignSelf: 'center',
                  marginBottom: 14,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255, 149, 0, 0.3)',
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#1C1C1E', textAlign: 'center' }}>
                    ⏰ {getSpecialOfferCopy(specialOfferSessionsLeft).sessionsText}
                  </Text>
                </View>

                {/* Tap to dismiss hint */}
                <Text style={{
                  fontSize: 12,
                  color: 'rgba(0, 0, 0, 0.5)',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}>
                  Tap to dismiss
                </Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
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
