// DimensionOverlay v5.4.0 - QUOTE IMMEDIATE - NO TYPING ANIMATION
// CACHE BUST v5.4.0 - Quote shows immediately, tap to dismiss
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Dimensions, Modal, Image, ScrollView, Linking, PixelRatio } from 'react-native';
import { Svg, Line, Circle, Path, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing, interpolate } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef, captureScreen } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as MailComposer from 'expo-mail-composer';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { DeviceMotion } from 'expo-sensors';
import { BlurView } from 'expo-blur';
import useStore, { CompletedMeasurement } from '../state/measurementStore';
import { formatMeasurement, formatAreaMeasurement, formatVolumeMeasurement, convertUnit } from '../utils/unitConversion';
import HelpModal from './HelpModal';
import VerbalScaleModal from './VerbalScaleModal';
import BlueprintPlacementModal from './BlueprintPlacementModal';
import BlueprintDistanceModal from './BlueprintDistanceModal';
import LabelModal from './LabelModal';
import EmailPromptModal from './EmailPromptModal';
import AlertModal from './AlertModal';
import TypewriterText from './TypewriterText';
import BattlingBotsModal from './BattlingBotsModal';
import { getRandomQuote } from '../utils/makerQuotes';
import { getRandomChuckNorrisJoke } from '../utils/chuckNorrisJokes';
import SnailIcon from './SnailIcon';
import {
  scaleFontSize,
  scalePadding,
  scaleMargin,
  scaleSize,
  scaleBorderRadius,
  scaleIconSize,
  scaleGap
} from '../utils/deviceScale';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define type first before using it
type MeasurementMode = 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand' | 'polygon';

// Vibrant color palette for measurements (professional but fun)
const MEASUREMENT_COLORS: Record<MeasurementMode, Array<{ main: string; glow: string; name: string }>> = {
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
  circle: [
    { main: '#EF4444', glow: '#EF4444', name: 'Red' },       // Vibrant red
    { main: '#F97316', glow: '#F97316', name: 'Orange' },    // Bright orange
    { main: '#FBBF24', glow: '#FBBF24', name: 'Yellow' },    // Golden yellow
    { main: '#84CC16', glow: '#84CC16', name: 'Lime' },      // Lime green
    { main: '#22D3EE', glow: '#22D3EE', name: 'Sky' },       // Sky blue
  ],
  rectangle: [
    { main: '#DC2626', glow: '#DC2626', name: 'Crimson' },   // Deep crimson
    { main: '#DB2777', glow: '#DB2777', name: 'Magenta' },   // Magenta
    { main: '#9333EA', glow: '#9333EA', name: 'Purple' },    // Royal purple
    { main: '#4F46E5', glow: '#4F46E5', name: 'Indigo' },    // Royal indigo
    { main: '#0EA5E9', glow: '#0EA5E9', name: 'Blue' },      // Sky blue
  ],
  freehand: [
    { main: '#10B981', glow: '#10B981', name: 'Green' },     // Start with green for freehand
    { main: '#3B82F6', glow: '#3B82F6', name: 'Blue' },      
    { main: '#F59E0B', glow: '#F59E0B', name: 'Amber' },     
    { main: '#EC4899', glow: '#EC4899', name: 'Pink' },      
    { main: '#8B5CF6', glow: '#8B5CF6', name: 'Purple' },    
  ],
  polygon: [
    { main: '#F97316', glow: '#F97316', name: 'Orange' },    // Polygons get orange (unified look)
    { main: '#EAB308', glow: '#EAB308', name: 'Yellow' },
    { main: '#84CC16', glow: '#84CC16', name: 'Lime' },
    { main: '#14B8A6', glow: '#14B8A6', name: 'Teal' },
    { main: '#A855F7', glow: '#A855F7', name: 'Purple' },
  ],
};

interface Measurement {
  id: string;
  points: Array<{ x: number; y: number }>;
  value: string;
  mode: MeasurementMode;
  calibrationMode?: 'coin' | 'map'; // Track which calibration mode was used when creating this measurement
  mapScaleData?: {screenDistance: number, screenUnit: 'cm' | 'in', realDistance: number, realUnit: 'km' | 'mi' | 'm' | 'ft'}; // Store map scale if created in map mode
  // For circles: points[0] = center, points[1] = edge point (defines radius)
  // For rectangles: points[0-3] = all 4 corners (top-left, top-right, bottom-right, bottom-left)
  radius?: number; // For circles
  width?: number;  // For rectangles
  height?: number; // For rectangles
  area?: number;   // For closed freehand loops (lasso mode)
  isClosed?: boolean; // For freehand paths - indicates if it's a closed loop
  perimeter?: string; // For closed freehand loops - just the perimeter for inline display
}

interface DimensionOverlayProps {
  zoomScale?: number;
  zoomTranslateX?: number;
  zoomTranslateY?: number;
  zoomRotation?: number;
  viewRef?: React.RefObject<View | null>;
  setImageOpacity?: (opacity: number) => void;
  sessionColor?: { main: string; glow: string }; // Session color from camera for visual continuity
  onRegisterDoubleTapCallback?: (callback: () => void) => void; // Receives callback to switch to Measure mode
  onReset?: (recalibrateMode?: boolean) => void; // Called when "New Photo" button is pressed or "Recalibrate" button is pressed
  onMeasurementModeChange?: (isActive: boolean) => void; // Called when measurement mode changes
  onPanZoomLockChange?: (shouldLock: boolean) => void; // Called when pan/zoom should be locked/unlocked
  skipToMapMode?: boolean; // If true, open map scale modal immediately on mount (from calibration screen's "Map Scale" button)
  skipToBlueprintMode?: boolean; // If true, open blueprint placement modal immediately on mount
  skipToAerialMode?: boolean; // If true, open aerial placement modal (blueprint with aerial language) immediately on mount
  // NOTE: Opening quote removed from here - now handled by App.tsx
}

export default function DimensionOverlay({
  zoomScale = 1,
  zoomTranslateX = 0,
  zoomTranslateY = 0,
  zoomRotation = 0,
  viewRef: externalViewRef,
  setImageOpacity,
  sessionColor,
  onRegisterDoubleTapCallback,
  onReset,
  onMeasurementModeChange,
  onPanZoomLockChange,
  skipToMapMode = false,
  skipToBlueprintMode = false,
  skipToAerialMode = false,
}: DimensionOverlayProps) {
  // CACHE BUST v4.0 - Verify new bundle is loaded
  // console.log('✅ DimensionOverlay v4.0 loaded - Static Tetris active');
  
  const insets = useSafeAreaInsets();
  
  const [mode, setMode] = useState<MeasurementMode>('distance');
  const internalViewRef = useRef<View>(null);
  const viewRef = externalViewRef !== undefined ? externalViewRef : internalViewRef; // Use external ref if provided
  
  // Lock-in animation
  const lockInOpacity = useSharedValue(0);
  const lockInScale = useSharedValue(1);
  
  // Use store for persistent state
  const calibration = useStore((s) => s.calibration);
  const setCalibration = useStore((s) => s.setCalibration);
  const unitSystem = useStore((s) => s.unitSystem);
  const setUnitSystem = useStore((s) => s.setUnitSystem);
  const prevUnitSystemRef = useRef<'metric' | 'imperial' | null>(null); // Track previous unit system (start null to force first recalc)
  const currentImageUri = useStore((s) => s.currentImageUri);
  const isAutoCaptured = useStore((s) => s.isAutoCaptured);
  const coinCircle = useStore((s) => s.coinCircle);
  const savedZoomState = useStore((s) => s.savedZoomState);
  const currentPoints = useStore((s) => s.currentPoints);
  const setCurrentPoints = useStore((s) => s.setCurrentPoints);
  const measurements = useStore((s) => s.completedMeasurements);
  const setMeasurements = useStore((s) => s.setCompletedMeasurements);
  const userEmail = useStore((s) => s.userEmail);
  const setUserEmail = useStore((s) => s.setUserEmail);
  const hasSeenPanTutorial = useStore((s) => s.hasSeenPanTutorial);
  const setHasSeenPanTutorial = useStore((s) => s.setHasSeenPanTutorial);
  const magneticDeclination = useStore((s) => s.magneticDeclination); // For azimuth correction
  const isDonor = useStore((s) => s.isDonor); // Check if user is a supporter
  
  // STUB: Pro/Free system removed - Freehand is now free for everyone!
  const isProUser = true; // All users have access to all features
  const freehandTrialUsed = 0; // No trial system
  const freehandTrialLimit = 999; // No limits
  const incrementFreehandTrial = () => {}; // No-op
  const freehandOfferDismissed = true; // No offers
  const dismissFreehandOffer = () => {}; // No-op
  const setIsProUser = () => {}; // No-op
  const [showProModal, setShowProModal] = useState(false); // Unused
  const [showFreehandOfferModal, setShowFreehandOfferModal] = useState(false); // Unused
  const [showFreehandConfirmModal, setShowFreehandConfirmModal] = useState(false); // Unused
  
  // Pan tutorial state
  const [showPanTutorial, setShowPanTutorial] = useState(false);
  const panTutorialOpacity = useSharedValue(0);
  const panTutorialScale = useSharedValue(1); // For zoom-responsive scaling
  const panTutorialTranslateX = useSharedValue(0); // Track horizontal movement
  const panTutorialTranslateY = useSharedValue(0); // Track vertical movement
  const tutorialStartPosition = useRef({ x: zoomTranslateX, y: zoomTranslateY }); // Initial position when tutorial starts
  const lastPanPosition = useRef({ x: zoomTranslateX, y: zoomTranslateY });
  const lastZoomScale = useRef(zoomScale);
  const lastRotation = useRef(zoomRotation); // Track rotation too!
  const isDismissing = useRef(false); // Prevent multiple dismissals
  
  // Freehand mode activation (long-press on Distance button)
  const freehandLongPressRef = useRef<NodeJS.Timeout | null>(null);
  
  // Label modal for save/email
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showEmailPromptModal, setShowEmailPromptModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false); // Success modal for saves
  const [pendingAction, setPendingAction] = useState<'save' | 'email' | null>(null);
  const labelViewRef = useRef<View>(null); // For capturing photo with label
  const fusionViewRef = useRef<View>(null); // For capturing unzoomed transparent canvas
  const fusionZoomedViewRef = useRef<View>(null); // For capturing zoomed transparent canvas
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  
  // Alert modal state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
  });
  
  // Helper function to show alerts
  const showAlert = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    confirmText?: string,
    cancelText?: string,
    onConfirm?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
    });
  };
  
  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };
  
  // Smart calibration hint state
  interface MeasurementAttempt {
    type: 'distance' | 'circle' | 'rectangle' | 'angle' | 'freehand' | 'polygon';
    centerX: number;
    centerY: number;
    timestamp: number;
  }
  
  const [attemptHistory, setAttemptHistory] = useState<MeasurementAttempt[]>([]);
  const [hasShownCalibrationHint, setHasShownCalibrationHint] = useState(false);
  const [showCalibrationHint, setShowCalibrationHint] = useState(false);
  const hintOpacity = useSharedValue(0);
  const hintScale = useSharedValue(0.8);
  const hintColorShift = useSharedValue(0); // 0-1 for color animation
  
  // Selected measurement for delete/drag
  const [draggedMeasurementId, setDraggedMeasurementId] = useState<string | null>(null);
  const [resizingPoint, setResizingPoint] = useState<{ measurementId: string, pointIndex: number } | null>(null);
  const dragStartPos = useSharedValue({ x: 0, y: 0 });
  const dragCurrentPos = useSharedValue({ x: 0, y: 0 });
  const [didDrag, setDidDrag] = useState(false); // Track if user actually dragged
  
  // Rapid tap to delete feature
  const [tapDeleteState, setTapDeleteState] = useState<{ measurementId: string, count: number, lastTapTime: number } | null>(null);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string | null>(null);
  
  // Label editing feature - double tap to add/edit label
  const [labelEditingMeasurementId, setLabelEditingMeasurementId] = useState<string | null>(null);
  const [showLabelEditModal, setShowLabelEditModal] = useState(false);
  const [labelTapState, setLabelTapState] = useState<{ measurementId: string, lastTapTime: number } | null>(null);
  
  // Undo history for measurement edits - stores original state before first edit
  const [measurementHistory, setMeasurementHistory] = useState<Map<string, Measurement>>(new Map());
  
  // Freehand drawing state
  const [isDrawingFreehand, setIsDrawingFreehand] = useState(false);
  const [freehandPath, setFreehandPath] = useState<Array<{ x: number; y: number }>>([]);
  const [drawingPressure, setDrawingPressure] = useState(0); // 0-1 for red->yellow->green
  const [showFreehandCursor, setShowFreehandCursor] = useState(false);
  const freehandActivationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [freehandActivating, setFreehandActivating] = useState(false); // Waiting for activation
  const [freehandClosedLoop, setFreehandClosedLoop] = useState(false); // Track if loop is closed (lasso mode)
  const freehandClosedLoopRef = useRef(false); // Sync ref to avoid async state issues
  // Lock zoom/pan/rotation when freehand drawing starts to prevent coordinate drift
  const freehandZoomLockRef = useRef<{ scale: number; translateX: number; translateY: number; rotation: number } | null>(null);
  const [isShowingSpeedWarning, setIsShowingSpeedWarning] = useState(false); // Track if showing "too fast" message to prevent flicker

  // Chuck Norris Easter egg - Triple tap on Angle/Azimuth button
  const [azimuthTaps, setAzimuthTaps] = useState<number[]>([]); // Track timestamps of taps
  const azimuthTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showChuckNorrisModal, setShowChuckNorrisModal] = useState(false);
  const [currentChuckNorrisJoke, setCurrentChuckNorrisJoke] = useState('');
  const chuckNorrisOpacity = useSharedValue(0);

  // CRITICAL: Track ALL haptic timers to prevent memory leaks
  const hapticTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Helper function to schedule haptic with cleanup tracking
  const scheduleHaptic = (callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    hapticTimersRef.current.push(timer);
    return timer;
  };

  // Clear all pending haptic timers
  const clearAllHapticTimers = () => {
    hapticTimersRef.current.forEach(timer => clearTimeout(timer));
    hapticTimersRef.current = [];
  };

  // Cleanup haptic timers when component unmounts or navigates away
  useEffect(() => {
    return () => {
      clearAllHapticTimers();
    };
  }, []);
  
  // Lock-in animation states
  const [showLockedInAnimation, setShowLockedInAnimation] = useState(false);
  const [hasShownAnimation, setHasShownAnimation] = useState(false); // Always start false - only show animation on first calibration
  const lockInTimersRef = useRef<NodeJS.Timeout[]>([]); // Track lock-in animation timers for cleanup
  const prevZoomRef = useRef({ scale: zoomScale, x: zoomTranslateX, y: zoomTranslateY });
  
  // Reset animation flag when image changes (new photo = new session)
  useEffect(() => {
    setHasShownAnimation(false);
  }, [currentImageUri]);
  
  // Measurement mode states
  const [measurementMode, setMeasurementMode] = useState(false); // false = pan/zoom, true = place points
  
  // DEBUG: Track touch interceptions
  const [debugInfo, setDebugInfo] = useState({ lastTouch: 0, interceptor: '', mode: '' });
  
  // Register the callback with parent so it can be called on double-tap
  useEffect(() => {
    if (onRegisterDoubleTapCallback) {
      const switchToMeasureMode = () => {
        setMeasurementMode(true);
        setShowCursor(true);
        setCursorPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      };
      onRegisterDoubleTapCallback(switchToMeasureMode);
    }
  }, [onRegisterDoubleTapCallback]);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState(false); // Track if cursor is snapped to horizontal/vertical
  const [lastHapticPosition, setLastHapticPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [lastHapticTime, setLastHapticTime] = useState<number>(Date.now());
  const [fingerTouches, setFingerTouches] = useState<Array<{x: number, y: number, id: string, pressure: number, seed: number}>>([]);
  const fingerOpacity = useSharedValue(0);
  const fingerScale = useSharedValue(1);
  const fingerRotation = useSharedValue(0);

  // Animated style for evaporation effect
  const evaporationStyle = useAnimatedStyle(() => ({
    opacity: fingerOpacity.value,
    transform: [
      { scale: fingerScale.value },
      { rotate: `${fingerRotation.value}deg` }
    ]
  }));

  // Menu button fingerprints (session color)
  const [menuFingerTouches, setMenuFingerTouches] = useState<Array<{x: number, y: number, id: string, pressure: number, seed: number}>>([]);
  const menuFingerOpacity = useSharedValue(0);
  const menuFingerScale = useSharedValue(1);
  
  // Swipe trail effect (for menu closing)
  const [swipeTrail, setSwipeTrail] = useState<Array<{x: number, y: number, id: string, timestamp: number}>>([]);
  
  const cursorOffsetY = 40; // Reduced from 120 to ~1cm above finger
  const HAPTIC_DISTANCE = 2; // ~0.5mm on screen for frequent haptic feedback
  const MAGNIFICATION_SCALE = 1.2; // 20% zoom magnification
  
  // Cursor movement speed tracking for dynamic glow
  const [cursorSpeed, setCursorSpeed] = useState(0); // pixels per millisecond
  const lastCursorUpdateRef = useRef({ x: 0, y: 0, time: Date.now() });
  
  // Menu states
  const [menuMinimized, setMenuMinimized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hideMeasurementsForCapture, setHideMeasurementsForCapture] = useState(false); // Hide measurements/legend for transparent capture
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [menuHidden, setMenuHidden] = useState(false);
  const [tabSide, setTabSide] = useState<'left' | 'right'>('right'); // Which side the tab is on
  const menuTranslateX = useSharedValue(0);
  const menuOpacity = useSharedValue(1); // For shake fade animation
  const tabPositionY = useSharedValue(SCREEN_HEIGHT / 2); // Draggable tab position
  const menuHiddenShared = useSharedValue(false); // Shared value for gesture worklets
  
  // Legend collapse state
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  
  // Hide measurement labels toggle
  const [hideMeasurementLabels, setHideMeasurementLabels] = useState(false);
  const [labelEditMode, setLabelEditMode] = useState(false);
  
  // Easter egg: 7 rapid taps on Imperial button
  const [imperialTapCount, setImperialTapCount] = useState(0);
  const [imperialTapTimestamps, setImperialTapTimestamps] = useState<number[]>([]);
  const imperialTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Map Mode state
  const [isMapMode, setIsMapMode] = useState(false);
  const [mapScale, setMapScale] = useState<{screenDistance: number, screenUnit: 'cm' | 'in', realDistance: number, realUnit: 'km' | 'mi' | 'm' | 'ft'} | null>(null);
  const [showMapScaleModal, setShowMapScaleModal] = useState(false);
  
  // Blueprint scale placement
  const [showBlueprintPlacementModal, setShowBlueprintPlacementModal] = useState(false);
  const [isPlacingBlueprint, setIsPlacingBlueprint] = useState(false); // Actually placing pins
  const [isAerialMode, setIsAerialMode] = useState(false); // Track if blueprint is for aerial photos (shows drones instead of circles)
  const [blueprintPoints, setBlueprintPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [showBlueprintDistanceModal, setShowBlueprintDistanceModal] = useState(false);
  const blueprintLineOpacity = useSharedValue(1); // For fade-out animation
  
  // Vibrant colors for mode buttons - rotates each time a mode is selected
  const [modeColorIndex, setModeColorIndex] = useState(0);
  const vibrantColors = [
    { main: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' },  // Blue
    { main: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.6)' },  // Purple
    { main: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)' },  // Pink
    { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)' },  // Amber
    { main: '#10B981', glow: 'rgba(16, 185, 129, 0.6)' },  // Emerald
    { main: '#EF4444', glow: 'rgba(239, 68, 68, 0.6)' },   // Red
    { main: '#06B6D4', glow: 'rgba(6, 182, 212, 0.6)' },   // Cyan
    { main: '#F43F5E', glow: 'rgba(244, 63, 94, 0.6)' },   // Rose
    { main: '#84CC16', glow: 'rgba(132, 204, 22, 0.6)' },  // Lime
    { main: '#A855F7', glow: 'rgba(168, 85, 247, 0.6)' },  // Violet
  ];
  
  // Get current vibrant color
  const getCurrentModeColor = () => vibrantColors[modeColorIndex % vibrantColors.length];
  
  // Imperial button 7-tap easter egg handler
  const handleImperialTap = () => {
    const now = Date.now();
    const newTimestamps = [...imperialTapTimestamps, now];
    
    // Keep only recent taps (within 2 seconds)
    const recentTaps = newTimestamps.filter(t => now - t < 2000);
    setImperialTapTimestamps(recentTaps);
    
    // Clear existing timeout
    if (imperialTapTimeoutRef.current) {
      clearTimeout(imperialTapTimeoutRef.current);
    }
    
    // Check if we have 7 rapid taps
    if (recentTaps.length === 7) {
      // SUCCESS! Trigger easter egg
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Open the same link as the auto-flash button easter egg
      setTimeout(() => {
        Linking.openURL('https://youtu.be/Aq5WXmQQooo?si=Ptp9PPm8Mou1TU98');
      }, 300);
      
      // Clear taps
      setImperialTapTimestamps([]);
    } else {
      // Light haptic feedback for each tap
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Reset after 2 seconds of inactivity
      imperialTapTimeoutRef.current = setTimeout(() => {
        setImperialTapTimestamps([]);
      }, 2000);
    }
  };
  
  // Mode swipe animation for finger tracking
  const modeSwipeOffset = useSharedValue(0);

  // NOTE: Opening quote state removed - now handled by App.tsx

  // Toast notification state (for save success)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useSharedValue(0);
  
  // Easter egg states
  const [calibratedTapCount, setCalibrateTapCount] = useState(0);
  const [autoLevelTapCount, setAutoLevelTapCount] = useState(0);
  const [showCalculatorWords, setShowCalculatorWords] = useState(false);
  const [stepBrothersMode, setStepBrothersMode] = useState(false); // Step Brothers Easter egg!
  const calibratedTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoLevelTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Undo long-press state
  const undoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Tetris Easter egg state - simplified static version
  const [showTetris, setShowTetris] = useState(false);
  const tetrisOpacity = useSharedValue(0);
  const [hasTriggeredTetris, setHasTriggeredTetris] = useState(false);
  
  // Initialize measurement mode based on whether there are existing measurements
  // If there are measurements on reload, pan/zoom should be locked
  // IMPORTANT: This useEffect must be AFTER all other hooks to avoid hooks order issues
  useEffect(() => {
    if (measurements.length > 0) {
      setMeasurementMode(false); // Keep in pan mode but locked
    }
  }, []); // Only run on mount

  // NOTE: Quote animated styles removed - now handled by App.tsx

  // Animated style for toast notification
  const toastAnimatedStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [
      { translateY: interpolate(toastOpacity.value, [0, 1], [20, 0]) }
    ],
  }));
  
  // Animated style for mode swipe
  const modeSwipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: modeSwipeOffset.value * 0.3 }], // Dampened movement (30% of finger)
  }));
  
  // Animated style for pan tutorial with zoom-responsive scaling
  const panTutorialAnimatedStyle = useAnimatedStyle(() => ({
    opacity: panTutorialOpacity.value,
  }));
  
  // Menu fingerprint animated style
  const menuEvaporationStyle = useAnimatedStyle(() => ({
    opacity: menuFingerOpacity.value,
    transform: [
      { scale: menuFingerScale.value },
    ]
  }));

  // Chuck Norris modal animated style
  const chuckNorrisAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chuckNorrisOpacity.value,
  }));

  // Show inspirational quote overlay

  // Clean up freehand state when switching away from freehand mode
  useEffect(() => {
    if (mode !== 'freehand') {
      setIsDrawingFreehand(false);
      setShowFreehandCursor(false);
      setFreehandPath([]);
      setShowCursor(false);
    }
  }, [mode]);

  // Show pan tutorial on first load for NEW photos (fresh session with no measurements)
  useEffect(() => {
    // Only show for fresh photos (no measurements yet = new session)
    // Don't show if user is returning to saved work with existing measurements
    const isFreshPhoto = measurements.length === 0;
    
    if (isFreshPhoto) {
      // Show tutorial after a brief delay
      const timer = setTimeout(() => {
        // Record starting position when tutorial appears
        tutorialStartPosition.current = { x: zoomTranslateX, y: zoomTranslateY };
        lastPanPosition.current = { x: zoomTranslateX, y: zoomTranslateY };
        lastZoomScale.current = zoomScale;
        lastRotation.current = zoomRotation;
        
        setShowPanTutorial(true);
        panTutorialOpacity.value = withSpring(1, { damping: 20, stiffness: 100 });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount

  // Detect panning/measuring/zooming/rotating and fade out tutorial - CINEMATIC
  useEffect(() => {
    if (!showPanTutorial || isDismissing.current) return; // Don't process if already dismissing!
    
    // Dismiss if user switches to measure mode
    if (measurementMode) {
      isDismissing.current = true;
      // Cinematic fade out
      panTutorialOpacity.value = withTiming(0, { 
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Silky smooth cubic bezier
      });
      setTimeout(() => {
        setShowPanTutorial(false); // Remove from DOM after animation completes
        isDismissing.current = false; // Reset for next time
      }, 800);
      return;
    }
    
    // Calculate total movement from START position
    const deltaX = zoomTranslateX - tutorialStartPosition.current.x;
    const deltaY = zoomTranslateY - tutorialStartPosition.current.y;
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const zoomDelta = Math.abs(zoomScale - lastZoomScale.current);
    const rotationDelta = Math.abs(zoomRotation - lastRotation.current);
    
    // ANY movement detected? Fade out CINEMATICALLY!
    const anyMovement = totalMovement > 10 || zoomDelta > 0.02 || rotationDelta > 1;
    
    if (anyMovement) {
      isDismissing.current = true; // Lock it so we don't fire multiple times!
      
      // Cinematic fade - like entering a movie scene 🎬
      panTutorialOpacity.value = withTiming(0, { 
        duration: 800, // Longer, more graceful
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Silky smooth cubic bezier
      });
      
      setTimeout(() => {
        setShowPanTutorial(false); // Remove from DOM after animation completes
        isDismissing.current = false; // Reset for next time
      }, 800);
    }
  }, [zoomTranslateX, zoomTranslateY, zoomScale, zoomRotation, showPanTutorial, measurementMode]);

  // Restore map mode state from persisted calibration
  useEffect(() => {
    // When component mounts or calibration changes, check if we have map scale calibration
    if (calibration?.calibrationType === 'verbal' && calibration.verbalScale) {
      // Restore map mode state from calibration
      setIsMapMode(true);
      setMapScale(calibration.verbalScale);
    } else if (calibration?.calibrationType === 'coin' || calibration?.calibrationType === 'blueprint') {
      // Ensure map mode is off for coin/blueprint calibration
      setIsMapMode(false);
      setMapScale(null);
    }
  }, [calibration]); // Run when calibration changes (including on app restore)
  
  // Handle skipToMapMode prop (from calibration screen's "Map Scale" button)
  const hasTriggeredSkipToMap = useRef(false);
  useEffect(() => {
    if (skipToMapMode && !mapScale && !hasTriggeredSkipToMap.current) {
      // User clicked "Map Scale" button in calibration - open modal immediately
      console.log('🗺️ skipToMapMode triggered - opening map scale modal');
      hasTriggeredSkipToMap.current = true;
      setShowMapScaleModal(true);
    }
  }, [skipToMapMode, mapScale]);
  
  // Handle skipToBlueprintMode prop (from photo type selection)
  const hasTriggeredSkipToBlueprint = useRef(false);
  useEffect(() => {
    if (skipToBlueprintMode && !hasTriggeredSkipToBlueprint.current) {
      // User selected blueprint from photo type selection - open modal immediately
      console.log('📐 skipToBlueprintMode triggered - opening blueprint placement modal');
      hasTriggeredSkipToBlueprint.current = true;
      setIsAerialMode(false); // Blueprint mode
      setShowBlueprintPlacementModal(true);
      setMenuHidden(true); // Hide menu when modal appears
    }
  }, [skipToBlueprintMode]);
  
  // Handle skipToAerialMode prop (from photo type selection)
  const hasTriggeredSkipToAerial = useRef(false);
  useEffect(() => {
    if (skipToAerialMode && !hasTriggeredSkipToAerial.current) {
      // User selected aerial from photo type selection - open modal immediately with aerial language
      console.log('✈️ skipToAerialMode triggered - opening aerial placement modal');
      hasTriggeredSkipToAerial.current = true;
      setIsAerialMode(true); // Aerial mode
      setShowBlueprintPlacementModal(true);
      setMenuHidden(true); // Hide menu when modal appears
    }
  }, [skipToAerialMode]);
  
  // CRITICAL: Reset blueprint modal states when starting a new photo session
  // sessionColor changes with each new photo, so we use it as a signal to reset
  useEffect(() => {
    if (sessionColor) {
      console.log('📸 New photo detected (sessionColor changed) - resetting blueprint modal states');
      setShowBlueprintPlacementModal(false);
      setShowBlueprintDistanceModal(false);
      setIsPlacingBlueprint(false);
      setBlueprintPoints([]);
      // Reset the skip trigger refs so they can fire again for the new photo
      hasTriggeredSkipToBlueprint.current = false;
      hasTriggeredSkipToAerial.current = false;
      hasTriggeredSkipToMap.current = false;
    }
  }, [sessionColor]);

  // NOTE: Opening quote system removed - now handled by App.tsx
  // All quote-related state, functions, and UI removed to avoid conflicts

  // Toast notification functions
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    
    // Fade in
    toastOpacity.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      toastOpacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setShowToast)(false);
      });
    }, 3000);
  };
  
  // Create menu button fingerprint with session color
  const createMenuFingerprint = (x: number, y: number) => {
    const touch = {
      x,
      y,
      id: `menu-touch-${Date.now()}`,
      pressure: 0.7, // Default pressure for button taps
      seed: Math.random(),
    };
    
    setMenuFingerTouches([touch]);
    
    // Fade in
    menuFingerOpacity.value = 0;
    menuFingerScale.value = 0.8;
    menuFingerOpacity.value = withTiming(1, { duration: 150 });
    menuFingerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    
    // Fade out after 600ms
    setTimeout(() => {
      menuFingerOpacity.value = withTiming(0, { 
        duration: 400,
        easing: Easing.out(Easing.ease)
      }, () => {
        runOnJS(setMenuFingerTouches)([]);
      });
      menuFingerScale.value = withTiming(1.2, { duration: 400 });
    }, 600);
  };
  
  // 🎮 Game-inspired haptic sequences for measurement modes
  const playModeHaptic = (mode: MeasurementMode) => {
    switch(mode) {
      case 'distance':
        // Sonic Spin Dash - Quick ascending buzz (BEEFED UP!)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Upgraded from Light
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 40);
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 80);
        break;
      case 'angle':
        // Street Fighter Hadouken - Charge then release (BEEFED UP!)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Upgraded from Medium
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
        scheduleHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 120); // Extra punch!
        break;
      case 'circle':
        // Pac-Man wakka - Quick oscillating (BEEFED UP!)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Upgraded from Light
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 60); // Upgraded
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 120); // Upgraded
        break;
      case 'rectangle':
        // Tetris rotate - Solid mechanical click (BEEFED UP!)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 50); // Upgraded from Light
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100); // Extra thump!
        break;
      case 'freehand':
        // Mario Paint - Creative bounce (BEEFED UP!)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Upgraded from Light
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 70); // Upgraded
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 140); // Upgraded
        scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 210); // Upgraded
        break;
    }
  };
  
  const CALCULATOR_WORDS = ['HELLO', 'BOOBS', '80085', '5318008', 'SHELL', '07734', 'GOOGLE', '376616', 'BOOBLESS', '553780085'];
  
  // Easter egg: Calibrated badge tap handler
  const handleCalibratedTap = () => {
    // Clear existing timeout
    if (calibratedTapTimeoutRef.current) {
      clearTimeout(calibratedTapTimeoutRef.current);
    }

    const newCount = calibratedTapCount + 1;
    setCalibrateTapCount(newCount);

    if (newCount >= 5) {
      // Activate Easter eggs! Step Brothers + Calculator words
      // Stronger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      scheduleHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 100);

      setShowCalculatorWords(true);
      setStepBrothersMode(true); // "YEP!" mode
      setCalibrateTapCount(0);

      // Auto-dismiss after 5 seconds
      scheduleHaptic(() => {
        setShowCalculatorWords(false);
        setStepBrothersMode(false);
      }, 5000);
    } else {
      // Reset counter after 2 seconds of no taps
      calibratedTapTimeoutRef.current = setTimeout(() => {
        setCalibrateTapCount(0);
      }, 2000);
    }
  };
  
  // Easter egg: AUTO LEVEL badge tap handler - WITH HAPTIC RICKROLL! 🎵
  const handleAutoLevelTap = () => {
    // Clear existing timeout
    if (autoLevelTapTimeoutRef.current) {
      clearTimeout(autoLevelTapTimeoutRef.current);
    }

    const newCount = autoLevelTapCount + 1;
    setAutoLevelTapCount(newCount);

    if (newCount >= 7) {
      // HAPTIC RICKROLL SEQUENCE! 🎵 (BEEFED UP!)
      // Mimics the iconic rhythm and feel of that famous song
      setAutoLevelTapCount(0);

      // Intro beats (iconic piano notes) - BEEFED UP!
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Upgraded from Medium
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200); // Upgraded from Light
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 550); // Upgraded

      // First phrase rhythm (4 beats) - MORE PUNCH!
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 800);
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1000); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1200); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 1350); // Upgraded

      // Second phrase rhythm (4 beats) - KEEP IT STRONG!
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1600);
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1800); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 1950); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 2100); // Upgraded

      // Third phrase rhythm (4 beats) - CLIMAX!
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 2400);
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 2600); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 2800); // Upgraded
      scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 2950); // Upgraded

      // Final beat + SUCCESS! - DOUBLE IMPACT!
      scheduleHaptic(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        scheduleHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 50);

        // NOW open the video! 😂
        const youtubeUrl = 'https://youtu.be/Aq5WXmQQooo?si=Ptp9PPm8Mou1TU98';
        Linking.openURL(youtubeUrl).catch(err => {
          showAlert('Error', 'Could not open video', 'error');
          console.error('Failed to open URL:', err);
        });
      }, 3200);

    } else {
      // Reset counter after 2 seconds of no taps
      autoLevelTapTimeoutRef.current = setTimeout(() => {
        setAutoLevelTapCount(0);
      }, 2000);
    }
  };
  
  // Get calculator word for a measurement value
  const getCalculatorWord = (value: string): string => {
    const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return CALCULATOR_WORDS[hash % CALCULATOR_WORDS.length];
  };
  
  // Tetris animation trigger - EPIC GAME OVER sequence!
  // Static Tetris animation - simple fade in/out (v4.0)
  const triggerTetrisAnimation = () => {
    console.log('🎮 STATIC TETRIS v4.0 - Simple fade animation');
    setShowTetris(true);
    
    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Fade in the static screen
    tetrisOpacity.value = withTiming(1, { duration: 600 });
    
    // Hold for 3 seconds, then fade out and clear everything
    setTimeout(() => {
      tetrisOpacity.value = withTiming(0, { duration: 800 }, (finished) => {
        'worklet';
        if (finished) {
          runOnJS(setShowTetris)(false);
          
          // CLEAR ALL MEASUREMENTS! 🧹
          runOnJS(setMeasurements)([]);
          runOnJS(setCurrentPoints)([]);
          runOnJS(setHasTriggeredTetris)(false); // Allow trigger again if they rebuild
          
          // Clear the saved label since measurements are cleared
          runOnJS(setCurrentLabel)(null);
          
          // Success haptic for the reset - wrapped in runOnJS
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
        }
      });
    }, 3000);
  };
  
  // Get color for measurement based on index
  const getMeasurementColor = (index: number, measurementMode: MeasurementMode) => {
    const colors = MEASUREMENT_COLORS[measurementMode];
    return colors[index % colors.length];
  };

  // Get complementary/opposing vibrant color for cursor glow
  const getComplementaryColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate complementary color (rotate hue by 180 degrees)
    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const l = (max + min) / 2;
    
    let h = 0;
    let s = 0;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      if (max === rNorm) {
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
      } else if (max === gNorm) {
        h = ((bNorm - rNorm) / d + 2) / 6;
      } else {
        h = ((rNorm - gNorm) / d + 4) / 6;
      }
    }
    
    // Rotate hue by 180 degrees for complementary color
    h = (h + 0.5) % 1;
    
    // Convert back to RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let rComp, gComp, bComp;
    
    if (s === 0) {
      rComp = gComp = bComp = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rComp = hue2rgb(p, q, h + 1/3);
      gComp = hue2rgb(p, q, h);
      bComp = hue2rgb(p, q, h - 1/3);
    }
    
    // Convert back to hex
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(rComp)}${toHex(gComp)}${toHex(bComp)}`;
  };

  // Helper to check if tap is near any measurement point (works for all types)
  const getTappedMeasurementPoint = (tapX: number, tapY: number): { measurementId: string, pointIndex: number } | null => {
    const POINT_THRESHOLD = 40; // pixels
    const RECTANGLE_CORNER_THRESHOLD = 25; // Tighter threshold for rectangle corners
    
    for (const measurement of measurements) {
      // For rectangles, use a much tighter threshold for corner points
      // This makes it easier to drag the whole rectangle vs editing corners
      const threshold = measurement.mode === 'rectangle' ? RECTANGLE_CORNER_THRESHOLD : POINT_THRESHOLD;
      
      // Check all points in the measurement
      for (let i = 0; i < measurement.points.length; i++) {
        const point = imageToScreen(measurement.points[i].x, measurement.points[i].y);
        
        const distToPoint = Math.sqrt(
          Math.pow(tapX - point.x, 2) + Math.pow(tapY - point.y, 2)
        );
        
        if (distToPoint < threshold) {
          return { measurementId: measurement.id, pointIndex: i };
        }
      }
    }
    return null;
  };

  // Helper to check if tap is near a rectangle corner (kept for backward compatibility)
  const getTappedRectangleCorner = (tapX: number, tapY: number): { measurementId: string, pointIndex: 0 | 1 } | null => {
    const point = getTappedMeasurementPoint(tapX, tapY);
    if (point && measurements.find(m => m.id === point.measurementId)?.mode === 'rectangle') {
      return { measurementId: point.measurementId, pointIndex: point.pointIndex as 0 | 1 };
    }
    return null;
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

  // Smart calibration hint - detect when user struggles with measurements
  const checkForCalibrationIssues = (newMeasurement: Measurement) => {
    // Don't show if already shown for this photo
    if (hasShownCalibrationHint) return;
    
    // Calculate center point of new measurement
    const centerX = newMeasurement.points.reduce((sum, p) => sum + p.x, 0) / newMeasurement.points.length;
    const centerY = newMeasurement.points.reduce((sum, p) => sum + p.y, 0) / newMeasurement.points.length;
    
    // Create new attempt
    const attempt: MeasurementAttempt = {
      type: newMeasurement.mode,
      centerX,
      centerY,
      timestamp: Date.now(),
    };
    
    // Filter recent attempts (last 20 seconds)
    const now = Date.now();
    const recentAttempts = attemptHistory.filter(a => now - a.timestamp < 20000);
    
    // Count attempts in same area (80px radius) and same type
    const nearbyAttempts = recentAttempts.filter(a => {
      const distance = Math.sqrt(
        Math.pow(a.centerX - centerX, 2) + 
        Math.pow(a.centerY - centerY, 2)
      );
      return distance < 80 && a.type === newMeasurement.mode;
    });
    
    // Check threshold (distance = 4, others = 5) - less sensitive to avoid false positives
    const threshold = newMeasurement.mode === 'distance' ? 3 : 4; // -1 because we count the new one
    
    if (nearbyAttempts.length >= threshold) {
      // Trigger hint!
      console.log('🎯 Calibration hint triggered:', {
        attempts: nearbyAttempts.length + 1,
        type: newMeasurement.mode,
        threshold: threshold + 1,
      });
      setShowCalibrationHint(true);
      setHasShownCalibrationHint(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    // Update history (keep last 10 attempts)
    const updatedHistory = [...recentAttempts, attempt].slice(-10);
    setAttemptHistory(updatedHistory);
  };

  // Helper to snap cursor to horizontal/vertical alignment with first point
  const snapCursorToAlignment = (cursorX: number, cursorY: number): { x: number, y: number, snapped: boolean } => {
    // Special case: Map Mode + Angle mode + placing second point (north reference) → ALWAYS lock to vertical
    if (isMapMode && mode === 'angle' && currentPoints.length === 1) {
      const firstPoint = imageToScreen(currentPoints[0].x, currentPoints[0].y);
      const dy = cursorY - firstPoint.y;
      
      // Don't snap if too close to first point (less than 20px)
      const distance = Math.abs(dy);
      if (distance < 20) {
        return { x: cursorX, y: cursorY, snapped: false };
      }
      
      // ALWAYS lock to vertical line (north reference)
      return { x: firstPoint.x, y: cursorY, snapped: true };
    }
    
    // Snap when placing second point in distance mode OR second point in angle mode (before vertex) OR blueprint mode
    const shouldSnap = (mode === 'distance' && currentPoints.length === 1) || 
                       (mode === 'angle' && currentPoints.length === 1) ||
                       (isPlacingBlueprint && blueprintPoints.length === 1);
    
    if (!shouldSnap) {
      return { x: cursorX, y: cursorY, snapped: false };
    }
    
    // Get the first point (either from currentPoints or blueprintPoints)
    let firstPoint;
    if (isPlacingBlueprint && blueprintPoints.length === 1) {
      firstPoint = imageToScreen(blueprintPoints[0].x, blueprintPoints[0].y);
    } else if (currentPoints.length > 0) {
      firstPoint = imageToScreen(currentPoints[0].x, currentPoints[0].y);
    } else {
      return { x: cursorX, y: cursorY, snapped: false };
    }
    
    const dx = cursorX - firstPoint.x;
    const dy = cursorY - firstPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Don't snap if too close to first point (less than 20px)
    if (distance < 20) {
      return { x: cursorX, y: cursorY, snapped: false };
    }
    
    // Calculate angle from first point
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Snap thresholds: very subtle!
    // Smaller entry threshold = harder to enter snap
    // Slightly larger exit threshold = easier to break free
    const snapEntryThreshold = 3;  // Only snap if within 3° 
    const snapExitThreshold = 4;   // Stay snapped until 4° away (very subtle)
    
    // Use different threshold based on whether we're already snapped
    const threshold = isSnapped ? snapExitThreshold : snapEntryThreshold;
    
    // Check for horizontal snap (0° or 180°)
    const horizontalAngle = Math.abs(angle) % 180;
    if (horizontalAngle < threshold || horizontalAngle > (180 - threshold)) {
      return { x: cursorX, y: firstPoint.y, snapped: true };
    }
    
    // Check for vertical snap (90° or -90°)
    const verticalAngle = Math.abs(Math.abs(angle) - 90);
    if (verticalAngle < threshold) {
      return { x: firstPoint.x, y: cursorY, snapped: true };
    }
    
    // No snap
    return { x: cursorX, y: cursorY, snapped: false };
  };

  // Helper to detect if a path self-intersects
  // Ignores first and last 5% of path to account for natural hand jitter
  const doesPathSelfIntersect = (path: Array<{ x: number; y: number }>): boolean => {
    if (path.length < 4) return false; // Need at least 4 points to self-intersect
    
    // Calculate exclusion zones (first and last 5% of path)
    const exclusionZoneSize = Math.ceil(path.length * 0.05); // 5% of path length
    const startExclusionEnd = exclusionZoneSize;
    const endExclusionStart = path.length - exclusionZoneSize - 1;
    
    console.log(`🔍 Self-intersection check: path length ${path.length}, excluding first ${exclusionZoneSize} and last ${exclusionZoneSize} segments`);
    
    // Check each line segment against all other non-adjacent line segments
    for (let i = 0; i < path.length - 1; i++) {
      // Skip segments in the exclusion zones
      if (i < startExclusionEnd || i >= endExclusionStart) {
        continue;
      }
      
      const seg1Start = path[i];
      const seg1End = path[i + 1];
      
      // Start checking from i+2 to avoid adjacent segments
      for (let j = i + 2; j < path.length - 1; j++) {
        // Skip segments in the exclusion zones
        if (j < startExclusionEnd || j >= endExclusionStart) {
          continue;
        }
        
        // Don't check the last segment against the first (they're supposed to connect in a loop)
        if (i === 0 && j === path.length - 2) continue;
        
        const seg2Start = path[j];
        const seg2End = path[j + 1];
        
        // Check if segments intersect
        if (doSegmentsIntersect(seg1Start, seg1End, seg2Start, seg2End)) {
          console.log(`❌ Self-intersection detected between segment ${i} and segment ${j}`);
          return true;
        }
      }
    }
    
    console.log('✅ No self-intersection detected (excluding start/end zones)');
    return false;
  };
  
  // Helper to check if two line segments intersect
  const doSegmentsIntersect = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ): boolean => {
    const ccw = (A: { x: number; y: number }, B: { x: number; y: number }, C: { x: number; y: number }) => {
      return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    };
    
    return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
  };

  // Helper to snap cursor to nearby existing measurement points
  // moveMode: when true (moving points), use larger threshold (7mm) for easier snapping
  const snapToNearbyPoint = (cursorX: number, cursorY: number, moveMode: boolean = false): { x: number, y: number, snapped: boolean } => {
    // Calculate snap distance in pixels based on calibration
    // Use very small threshold (0.5mm) when moving points for smooth, fluid movement
    // Use 2mm for normal placement - only snap when cursor is very close (within a couple mm)
    const SNAP_DISTANCE_MM = moveMode ? 0.5 : 2;
    const SNAP_DISTANCE = calibration 
      ? SNAP_DISTANCE_MM * calibration.pixelsPerUnit 
      : (moveMode ? 5 : 30); // fallback pixels if not calibrated (5px when moving, very tight)
    
    // Check all existing measurement points
    for (const measurement of measurements) {
      for (const point of measurement.points) {
        const screenPoint = imageToScreen(point.x, point.y);
        const distance = Math.sqrt(
          Math.pow(cursorX - screenPoint.x, 2) + 
          Math.pow(cursorY - screenPoint.y, 2)
        );
        
        // If cursor is close enough, snap to this point
        if (distance < SNAP_DISTANCE) {
          return { x: screenPoint.x, y: screenPoint.y, snapped: true };
        }
      }
    }
    
    // Also check current points being placed (for connecting within same measurement)
    for (const point of currentPoints) {
      const screenPoint = imageToScreen(point.x, point.y);
      const distance = Math.sqrt(
        Math.pow(cursorX - screenPoint.x, 2) + 
        Math.pow(cursorY - screenPoint.y, 2)
      );
      
      // If cursor is close enough, snap to this point
      if (distance < SNAP_DISTANCE) {
        return { x: screenPoint.x, y: screenPoint.y, snapped: true };
      }
    }
    
    return { x: cursorX, y: cursorY, snapped: false };
  };

  // Helper: Convert pixel distance to map scale units
  const convertToMapScale = (pixelDistance: number): number => {
    if (!mapScale) return 0;
    
    // Calculate how many screen units (cm/in) the measurement is
    const screenWidthCm = 10.8; // Standard phone screen width
    const screenWidthIn = 4.25;
    const imageWidth = SCREEN_WIDTH * 2; // Assume 2x pixel density
    
    const screenWidthPhysical = mapScale.screenUnit === 'cm' ? screenWidthCm : screenWidthIn;
    const pixelsPerScreenUnit = imageWidth / screenWidthPhysical;
    const screenUnits = pixelDistance / pixelsPerScreenUnit;
    
    // Convert to map units and return directly (not in mm)
    const mapDistance = screenUnits * (mapScale.realDistance / mapScale.screenDistance);
    return mapDistance;
  };

  // Helper: Format a value that's already in map units
  const formatMapValue = (valueInMapUnits: number): string => {
    if (!mapScale) return '';
    
    // Format based on map's real unit and user's preferred unit system
    if (mapScale.realUnit === 'km') {
      return unitSystem === 'imperial' 
        ? `${(valueInMapUnits * 0.621371).toFixed(2)} mi` // km to mi
        : `${valueInMapUnits.toFixed(2)} km`;
    } else if (mapScale.realUnit === 'mi') {
      return unitSystem === 'metric'
        ? `${(valueInMapUnits * 1.60934).toFixed(2)} km` // mi to km
        : `${valueInMapUnits.toFixed(2)} mi`;
    } else if (mapScale.realUnit === 'm') {
      return unitSystem === 'imperial'
        ? `${(valueInMapUnits * 3.28084).toFixed(0)} ft` // m to ft
        : `${valueInMapUnits.toFixed(0)} m`;
    } else { // ft
      return unitSystem === 'metric'
        ? `${(valueInMapUnits * 0.3048).toFixed(0)} m` // ft to m
        : `${valueInMapUnits.toFixed(0)} ft`;
    }
  };

  // Helper: Format map scale distance (for lines, perimeters)
  const formatMapScaleDistance = (pixelDistance: number): string => {
    if (!mapScale) return "";
    
    const mapDistance = convertToMapScale(pixelDistance);
    
    // Convert based on user's unit system preference (metric vs imperial)
    // Start with map scale's unit, then convert if needed
    const isMapMetric = mapScale.realUnit === "km" || mapScale.realUnit === "m";
    const isMapImperial = mapScale.realUnit === "mi" || mapScale.realUnit === "ft";
    
    // If user wants metric and map is metric, or user wants imperial and map is imperial, use as-is
    if ((unitSystem === 'metric' && isMapMetric) || (unitSystem === 'imperial' && isMapImperial)) {
      if (mapScale.realUnit === "km") {
        return `${mapDistance.toFixed(2)} km`;
      } else if (mapScale.realUnit === "mi") {
        return `${mapDistance.toFixed(2)} mi`;
      } else if (mapScale.realUnit === "m") {
        return `${mapDistance.toFixed(0)} m`;
      } else { // ft
        // Format as feet'inches"
        const totalInches = Math.round(mapDistance * 12);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        
        if (inches === 0) {
          return `${feet}'`;
        }
        return `${feet}'${inches}"`;
      }
    }
    
    // User wants metric, but map is imperial - convert to metric
    if (unitSystem === 'metric' && isMapImperial) {
      let meters = 0;
      if (mapScale.realUnit === "mi") {
        meters = mapDistance * 1609.34; // miles to meters
      } else { // ft
        meters = mapDistance * 0.3048; // feet to meters
      }
      
      // Choose appropriate metric unit
      if (meters < 1) {
        return `${(meters * 100).toFixed(0)} cm`;
      } else if (meters < 1000) {
        return `${meters.toFixed(1)} m`;
      } else {
        return `${(meters / 1000).toFixed(2)} km`;
      }
    }
    
    // User wants imperial, but map is metric - convert to imperial
    if (unitSystem === 'imperial' && isMapMetric) {
      let feet = 0;
      if (mapScale.realUnit === "km") {
        feet = mapDistance * 3280.84; // km to feet
      } else { // m
        feet = mapDistance * 3.28084; // meters to feet
      }
      
      // Choose appropriate imperial unit
      if (feet < 5280) {
        // Format as feet'inches"
        const totalInches = Math.round(feet * 12);
        const feetPart = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        
        if (inches === 0) {
          return `${feetPart}'`;
        }
        return `${feetPart}'${inches}"`;
      } else {
        // Use miles
        return `${(feet / 5280).toFixed(2)} mi`;
      }
    }
    
    // Fallback (shouldn't reach here)
    return `${mapDistance.toFixed(2)} ${mapScale.realUnit}`;
  };

  // Helper: Format map scale area (for rectangles, circles, freehand)
  const formatMapScaleArea = (areaInMapUnits2: number): string => {
    if (!mapScale) return '';

    // Convert based on user's unit system preference (metric vs imperial)
    const isMapMetric = mapScale.realUnit === "km" || mapScale.realUnit === "m";
    const isMapImperial = mapScale.realUnit === "mi" || mapScale.realUnit === "ft";

    // Helper to format acres with K/M suffixes
    const formatAcres = (acres: number): string => {
      if (acres >= 1000000) {
        return `${(acres / 1000000).toFixed(2)}M ac`;
      } else if (acres >= 1000) {
        return `${(acres / 1000).toFixed(2)}K ac`;
      } else if (acres >= 100) {
        return `${Math.round(acres)} ac`;
      } else {
        return `${acres.toFixed(2)} ac`;
      }
    };

    // Helper to format km² with K/M suffixes
    const formatKm2 = (km2: number): string => {
      if (km2 >= 1000000) {
        return `${(km2 / 1000000).toFixed(2)}M km²`;
      } else if (km2 >= 1000) {
        return `${(km2 / 1000).toFixed(2)}K km²`;
      } else {
        return `${km2.toFixed(2)} km²`;
      }
    };

    // Helper to format mi² with K/M suffixes
    const formatMi2 = (mi2: number): string => {
      if (mi2 >= 1000000) {
        return `${(mi2 / 1000000).toFixed(2)}M mi²`;
      } else if (mi2 >= 1000) {
        return `${(mi2 / 1000).toFixed(2)}K mi²`;
      } else {
        return `${mi2.toFixed(2)} mi²`;
      }
    };

    // Helper to format m² with K/M suffixes
    const formatM2 = (m2: number): string => {
      if (m2 >= 1000000) {
        return `${(m2 / 1000000).toFixed(2)}M m²`;
      } else if (m2 >= 1000) {
        return `${(m2 / 1000).toFixed(2)}K m²`;
      } else {
        return `${m2.toFixed(0)} m²`;
      }
    };

    // Helper to format ft² with K/M suffixes
    const formatFt2 = (ft2: number): string => {
      if (ft2 >= 1000000) {
        return `${(ft2 / 1000000).toFixed(2)}M ft²`;
      } else if (ft2 >= 1000) {
        return `${(ft2 / 1000).toFixed(2)}K ft²`;
      } else {
        return `${ft2.toFixed(0)} ft²`;
      }
    };

    // If user wants metric and map is metric, or user wants imperial and map is imperial, use as-is
    if ((unitSystem === 'metric' && isMapMetric) || (unitSystem === 'imperial' && isMapImperial)) {
      if (mapScale.realUnit === 'km') {
        return formatKm2(areaInMapUnits2);
      } else if (mapScale.realUnit === 'mi') {
        const acres = areaInMapUnits2 * 640; // 1 mi² = 640 acres
        return `${formatMi2(areaInMapUnits2)} (${formatAcres(acres)})`;
      } else if (mapScale.realUnit === 'm') {
        return formatM2(areaInMapUnits2);
      } else { // ft
        const acres = areaInMapUnits2 / 43560; // 1 acre = 43,560 ft²
        return `${formatFt2(areaInMapUnits2)} (${formatAcres(acres)})`;
      }
    }
    
    // User wants metric, but map is imperial - convert to metric
    if (unitSystem === 'metric' && isMapImperial) {
      let m2 = 0;
      if (mapScale.realUnit === "mi") {
        m2 = areaInMapUnits2 * 2589988.11; // square miles to square meters
      } else { // ft
        m2 = areaInMapUnits2 * 0.092903; // square feet to square meters
      }

      // Choose appropriate metric unit
      if (m2 < 10000) {
        return formatM2(m2);
      } else {
        const km2 = m2 / 1000000;
        return formatKm2(km2);
      }
    }

    // User wants imperial, but map is metric - convert to imperial
    if (unitSystem === 'imperial' && isMapMetric) {
      let ft2 = 0;
      if (mapScale.realUnit === "km") {
        ft2 = areaInMapUnits2 * 10763910.4; // square km to square feet
      } else { // m
        ft2 = areaInMapUnits2 * 10.7639; // square meters to square feet
      }

      // Choose appropriate imperial unit
      if (ft2 < 27878400) { // Less than 1 square mile
        const acres = ft2 / 43560;
        return `${formatFt2(ft2)} (${formatAcres(acres)})`;
      } else {
        const mi2 = ft2 / 27878400;
        const acres = mi2 * 640;
        return `${formatMi2(mi2)} (${formatAcres(acres)})`;
      }
    }
    
    // Fallback (shouldn't reach here)
    return `${areaInMapUnits2.toFixed(2)} ${mapScale.realUnit}²`;
  };

  // Calculate distance in pixels and convert to real units
  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const pixelDistance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    
    if (!calibration) {
      return `${pixelDistance.toFixed(0)} px`;
    }
    
    const realDistance = pixelDistance / calibration.pixelsPerUnit;
    
    // Map Mode: Apply scale conversion and respect Metric/Imperial
    if (isMapMode && mapScale) {
      return formatMapScaleDistance(pixelDistance);
    }
    
    return formatMeasurement(realDistance, calibration.unit, unitSystem, 2);
  };

  // Calculate angle between three points (or azimuth in Map Mode)
  const calculateAngle = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
    // Safety check
    if (!p1 || !p2 || !p3 || p1.y === undefined || p2.y === undefined || p3.y === undefined) {
      console.warn('⚠️ calculateAngle called with undefined points');
      return '0°';
    }
    
    // Map Mode: Calculate azimuth (bearing) - clockwise angle from north
    if (isMapMode) {
      // p1 = starting point
      // p2 = north reference point (defines north direction)
      // p3 = destination point
      
      // Vector from p1 to p2 (north reference)
      const northX = p2.x - p1.x;
      const northY = p2.y - p1.y;
      
      // Vector from p1 to p3 (destination)
      const destX = p3.x - p1.x;
      const destY = p3.y - p1.y;
      
      // Calculate angle of north vector from horizontal (in radians)
      const northAngle = Math.atan2(-northY, northX); // Negative Y because screen coords are inverted
      
      // Calculate angle of destination vector from horizontal
      const destAngle = Math.atan2(-destY, destX);
      
      // Calculate clockwise angle from north to destination
      let azimuth = (destAngle - northAngle) * (180 / Math.PI);
      
      // Apply magnetic declination correction
      // Positive declination (East) = add to azimuth to get true bearing
      // Negative declination (West) = subtract from azimuth to get true bearing
      azimuth += magneticDeclination;
      
      // Normalize to 0-360 range
      if (azimuth < 0) azimuth += 360;
      if (azimuth >= 360) azimuth -= 360;
      
      return `${azimuth.toFixed(1)}° (Azimuth)`;
    }
    
    // Normal Mode: Calculate interior angle
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = Math.abs((angle2 - angle1) * (180 / Math.PI));
    
    // Normalize to 0-180 range
    if (angle > 180) {
      angle = 360 - angle;
    }
    
    return `${angle.toFixed(1)}°`;
  };

  // Helper to check if a tap is near a measurement
  const getTappedMeasurement = (tapX: number, tapY: number): string | null => {
    const TAP_THRESHOLD = 30; // pixels
    
    for (const measurement of measurements) {
      if (measurement.mode === 'distance') {
        const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        const distToLine = distanceToLineSegment(tapX, tapY, p0.x, p0.y, p1.x, p1.y);
        if (distToLine < TAP_THRESHOLD) return measurement.id;
      } else if (measurement.mode === 'angle') {
        const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        const p2 = imageToScreen(measurement.points[2].x, measurement.points[2].y);
        const dist1 = distanceToLineSegment(tapX, tapY, p1.x, p1.y, p0.x, p0.y);
        const dist2 = distanceToLineSegment(tapX, tapY, p1.x, p1.y, p2.x, p2.y);
        if (dist1 < TAP_THRESHOLD || dist2 < TAP_THRESHOLD) return measurement.id;
      } else if (measurement.mode === 'circle') {
        const center = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const edge = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        const radius = Math.sqrt(
          Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
        );
        const distFromCenter = Math.sqrt(
          Math.pow(tapX - center.x, 2) + Math.pow(tapY - center.y, 2)
        );
        if (Math.abs(distFromCenter - radius) < TAP_THRESHOLD || distFromCenter < radius) {
          return measurement.id;
        }
      } else if (measurement.mode === 'rectangle') {
        // Calculate bounding box from all 4 corners
        const corners = measurement.points.map(p => imageToScreen(p.x, p.y));
        const xCoords = corners.map(c => c.x);
        const yCoords = corners.map(c => c.y);
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);
        
        const onEdge = (
          (Math.abs(tapX - minX) < TAP_THRESHOLD && tapY >= minY && tapY <= maxY) ||
          (Math.abs(tapX - maxX) < TAP_THRESHOLD && tapY >= minY && tapY <= maxY) ||
          (Math.abs(tapY - minY) < TAP_THRESHOLD && tapX >= minX && tapX <= maxX) ||
          (Math.abs(tapY - maxY) < TAP_THRESHOLD && tapX >= minX && tapX <= maxX)
        );
        const inside = (tapX >= minX && tapX <= maxX && tapY >= minY && tapY <= maxY);
        if (onEdge || inside) return measurement.id;
      } else if (measurement.mode === 'freehand') {
        // Check if tap is near any segment of the freehand path
        if (measurement.points.length < 2) continue;
        
        for (let i = 1; i < measurement.points.length; i++) {
          const p0 = imageToScreen(measurement.points[i - 1].x, measurement.points[i - 1].y);
          const p1 = imageToScreen(measurement.points[i].x, measurement.points[i].y);
          const distToSegment = distanceToLineSegment(tapX, tapY, p0.x, p0.y, p1.x, p1.y);
          if (distToSegment < TAP_THRESHOLD) return measurement.id;
        }
      }
    }
    return null;
  };

  const distanceToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Save original measurement state before editing (for undo)
  const saveOriginalState = (measurementId: string) => {
    // Only save if not already saved
    if (!measurementHistory.has(measurementId)) {
      const measurement = measurements.find(m => m.id === measurementId);
      if (measurement) {
        setMeasurementHistory(new Map(measurementHistory.set(measurementId, { ...measurement })));
        console.log('💾 Saved original state for measurement:', measurementId);
      }
    }
  };

  // Helper function to recalculate measurement values after points are moved
  const recalculateMeasurement = (measurement: Measurement, overrideCalibration?: typeof calibration): Measurement => {
    const { mode, points } = measurement;
    
    // Use override calibration if provided, otherwise use component state
    const activeCalibration = overrideCalibration !== undefined ? overrideCalibration : calibration;
    
    // Determine if we're in map mode (verbal scale)
    // When recalibrating with new verbal scale, use the override calibration's verbal scale
    const isUsingMapMode = overrideCalibration?.calibrationType === 'verbal' 
      ? true 
      : isMapMode;
    const activeMapScale = overrideCalibration?.calibrationType === 'verbal' && overrideCalibration.verbalScale
      ? overrideCalibration.verbalScale
      : mapScale;
    
    if (mode === 'distance') {
      const value = calculateDistance(points[0], points[1]);
      return { ...measurement, value };
    } else if (mode === 'angle') {
      const value = calculateAngle(points[0], points[1], points[2]);
      return { ...measurement, value };
    } else if (mode === 'circle') {
      // Recalculate radius and diameter
      const radius = Math.sqrt(
        Math.pow(points[1].x - points[0].x, 2) + 
        Math.pow(points[1].y - points[0].y, 2)
      );
      
      // Map Mode: Apply scale conversion
      if (isUsingMapMode && activeMapScale) {
        const diameterPx = radius * 2;
        const diameterDist = convertToMapScale(diameterPx);
        const value = `⌀ ${formatMapScaleDistance(diameterPx)}`;
        return { ...measurement, value, radius };
      }
      
      const radiusInUnits = radius / (activeCalibration?.pixelsPerUnit || 1);
      const diameter = radiusInUnits * 2;
      const value = `⌀ ${formatMeasurement(diameter, activeCalibration?.unit || 'mm', unitSystem, 2)}`;
      return { ...measurement, value, radius };
    } else if (mode === 'rectangle') {
      // Recalculate width and height from all 4 corners
      const p0 = points[0]; // top-left
      const p2 = points[2]; // bottom-right
      const widthPx = Math.abs(p2.x - p0.x);
      const heightPx = Math.abs(p2.y - p0.y);

      // Map Mode: Apply scale conversion
      if (isUsingMapMode && activeMapScale) {
        const widthDist = convertToMapScale(widthPx);
        const heightDist = convertToMapScale(heightPx);
        const widthStr = formatMapScaleDistance(widthPx);
        const heightStr = formatMapScaleDistance(heightPx);
        const areaDist2 = widthDist * heightDist;
        const areaStr = formatMapScaleArea(areaDist2);
        const value = `${widthStr} × ${heightStr} (A: ${areaStr})`;
        return { ...measurement, value, width: widthDist, height: heightDist, area: areaDist2 };
      }

      const width = widthPx / (activeCalibration?.pixelsPerUnit || 1);
      const height = heightPx / (activeCalibration?.pixelsPerUnit || 1);
      const widthStr = formatMeasurement(width, activeCalibration?.unit || 'mm', unitSystem, 2);
      const heightStr = formatMeasurement(height, activeCalibration?.unit || 'mm', unitSystem, 2);
      const area = width * height;
      const areaStr = formatAreaMeasurement(area, activeCalibration?.unit || 'mm', unitSystem);
      const value = `${widthStr} × ${heightStr} (A: ${areaStr})`;
      return { ...measurement, value, width, height, area };
    } else if (mode === 'freehand') {
      // Recalculate path length for freehand (both closed and open paths)
      let totalLength = 0;
      
      if (measurement.isClosed) {
        // Closed loop - connect back to start
        for (let i = 0; i < points.length; i++) {
          const p1 = points[i];
          const p2 = points[(i + 1) % points.length];
          const segmentLength = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
          );
          totalLength += segmentLength;
        }
      } else {
        // Open path - don't connect back to start
        for (let i = 1; i < points.length; i++) {
          const dx = points[i].x - points[i - 1].x;
          const dy = points[i].y - points[i - 1].y;
          totalLength += Math.sqrt(dx * dx + dy * dy);
        }
      }
      
      // Map Mode: Apply scale conversion
      let lengthStr: string;
      if (isUsingMapMode && activeMapScale) {
        lengthStr = formatMapScaleDistance(totalLength);
      } else {
        const lengthInUnits = totalLength / (activeCalibration?.pixelsPerUnit || 1);
        lengthStr = formatMeasurement(lengthInUnits, activeCalibration?.unit || 'mm', unitSystem, 2);
      }
      
      // If closed loop, clear area (not accurate after recalibration)
      if (measurement.isClosed) {
        console.log('⚠️ Freehand closed loop recalibrated - removing area (perimeter still valid)');
        return { 
          ...measurement, 
          perimeter: lengthStr, 
          value: lengthStr,
          area: undefined, // Clear area - no longer accurate after recalibration
          isClosed: true
        };
      } else {
        // Open path - just update the length
        return { 
          ...measurement, 
          value: lengthStr
        };
      }
    } else if (mode === 'polygon') {
      // Recalculate perimeter and area for polygons
      let perimeter = 0;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const segmentLength = Math.sqrt(
          Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
        );
        perimeter += segmentLength;
      }
      
      // Calculate area using Shoelace formula
      let areaPixels = 0;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        areaPixels += (p1.x * p2.y - p2.x * p1.y);
      }
      areaPixels = Math.abs(areaPixels) / 2;
      
      // Map Mode: Apply scale conversion
      let perimeterStr: string;
      let areaStr: string;
      let area: number;
      if (isUsingMapMode && activeMapScale) {
        perimeterStr = formatMapScaleDistance(perimeter);
        area = areaPixels * Math.pow(activeMapScale.realDistance / activeMapScale.screenDistance, 2);
        areaStr = formatMapScaleArea(area);
      } else {
        const perimeterInUnits = perimeter / (activeCalibration?.pixelsPerUnit || 1);
        perimeterStr = formatMeasurement(perimeterInUnits, activeCalibration?.unit || 'mm', unitSystem, 2);
        const pixelsPerUnit = activeCalibration?.pixelsPerUnit || 1;
        area = areaPixels / (pixelsPerUnit * pixelsPerUnit);
        areaStr = formatAreaMeasurement(area, activeCalibration?.unit || 'mm', unitSystem);
      }
      
      return { 
        ...measurement, 
        perimeter: perimeterStr, 
        value: `${perimeterStr} (A: ${areaStr})`, // Show both perimeter and area in legend
        area: area,
      };
    }
    
    return measurement;
  };

  // 🔷 POLYGON AUTO-DETECTION: Detect closed polygons from connected distance lines
  const detectAndMergePolygon = (allMeasurements: Measurement[]) => {
    const SNAP_TOLERANCE = 30; // pixels - how close endpoints need to be to snap
    
    console.log('🔷 detectAndMergePolygon called with', allMeasurements.length, 'total measurements');
    
    // Only check distance measurements
    const distanceLines = allMeasurements.filter(m => m.mode === 'distance');
    
    console.log('🔷 Found', distanceLines.length, 'distance lines');
    
    // Need at least 3 lines to form a polygon (triangle, square, etc.)
    if (distanceLines.length < 3) {
      console.log('🔷 Not enough lines for polygon (need 3+)');
      return;
    }
    
    // Get the most recently added line (the one that might close the polygon)
    const lastLine = distanceLines[distanceLines.length - 1];
    const lastLineEnd = lastLine.points[1];
    
    console.log('🔷 Last line end point:', lastLineEnd);
    
    // Find all connected chains of lines that START from various points
    const findConnectedChain = (startLine: Measurement, usedIds: Set<string>): Measurement[] => {
      const chain: Measurement[] = [startLine];
      usedIds.add(startLine.id);
      
      let currentEndpoint = startLine.points[1]; // End of current line
      let foundConnection = true;
      
      while (foundConnection) {
        foundConnection = false;
        
        // Find a line that starts where current line ends
        for (const line of distanceLines) {
          if (usedIds.has(line.id)) continue;
          
          const lineStart = line.points[0];
          const lineEnd = line.points[1];
          
          // Check if line starts at current endpoint
          const distToStart = Math.sqrt(
            Math.pow(lineStart.x - currentEndpoint.x, 2) + 
            Math.pow(lineStart.y - currentEndpoint.y, 2)
          );
          
          // Check if line ends at current endpoint (reverse direction)
          const distToEnd = Math.sqrt(
            Math.pow(lineEnd.x - currentEndpoint.x, 2) + 
            Math.pow(lineEnd.y - currentEndpoint.y, 2)
          );
          
          if (distToStart < SNAP_TOLERANCE) {
            // Line connects forward
            chain.push(line);
            usedIds.add(line.id);
            currentEndpoint = lineEnd;
            foundConnection = true;
            break;
          } else if (distToEnd < SNAP_TOLERANCE) {
            // Line connects backward - reverse it
            const reversedLine = {
              ...line,
              points: [lineEnd, lineStart]
            };
            chain.push(reversedLine);
            usedIds.add(line.id);
            currentEndpoint = lineStart;
            foundConnection = true;
            break;
          }
        }
      }
      
      return chain;
    };
    
    // ONLY check if the chain that contains the LAST line closes
    // This prevents premature snapping - only snaps when user explicitly closes back to start
    const usedIds = new Set<string>();
    const chain = findConnectedChain(lastLine, usedIds);
    
    console.log('🔷 Chain found from last line:', chain.length, 'lines connected');
    
    // Only proceed if we have at least 3 lines in the chain
    if (chain.length < 3) {
      console.log('🔷 Chain too short, need at least 3 lines');
      return;
    }
    
    // Check if THIS specific chain forms a closed loop
    const firstPoint = chain[0].points[0];
    const lastPoint = chain[chain.length - 1].points[1];
    
    const closingDistance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + 
      Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    console.log('🔷 Closing distance:', closingDistance.toFixed(2), 'px (tolerance:', SNAP_TOLERANCE, 'px)');
    console.log('🔷 First point:', firstPoint, 'Last point:', lastPoint);
    
    if (closingDistance < SNAP_TOLERANCE) {
      // 🎉 FOUND A CLOSED POLYGON!
      console.log('🔷 Polygon detected! Merging', chain.length, 'lines');
        
        // Extract all unique points in order
        // For each line, add its start point (end point is the next line's start)
        const polygonPoints: Array<{x: number, y: number}> = [];
        for (let i = 0; i < chain.length; i++) {
          const line = chain[i];
          const point = { x: line.points[0].x, y: line.points[0].y };
          polygonPoints.push(point);
          console.log(`  Point ${i}:`, point);
        }
        
        console.log('🔷 Polygon points extracted:', polygonPoints.length, 'points');
        
        // Check if all points are at the same location (collapsed polygon)
        if (polygonPoints.length >= 2) {
          const first = polygonPoints[0];
          const allSame = polygonPoints.every(p => 
            Math.abs(p.x - first.x) < 1 && Math.abs(p.y - first.y) < 1
          );
          if (allSame) {
            console.log('⚠️ All polygon points are at the same location (collapsed), skipping');
            return;
          }
        }
        
        // Validate polygon has at least 3 unique points
        if (polygonPoints.length < 3) {
          console.log('⚠️ Polygon has fewer than 3 points, skipping');
          return;
        }
        
        // Calculate perimeter (sum of all line lengths)
        let perimeterPx = 0;
        for (const line of chain) {
          const p1 = line.points[0];
          const p2 = line.points[1];
          const length = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
          );
          perimeterPx += length;
        }
        
        // Calculate area using shoelace formula
        let areaPx2 = 0;
        for (let i = 0; i < polygonPoints.length; i++) {
          const p1 = polygonPoints[i];
          const p2 = polygonPoints[(i + 1) % polygonPoints.length];
          areaPx2 += (p1.x * p2.y - p2.x * p1.y);
        }
        areaPx2 = Math.abs(areaPx2) / 2;
        
        // Validate that area is not zero (collinear points)
        // Only reject if EXACTLY zero or extremely small (< 0.5 px²) to be more forgiving
        if (areaPx2 < 0.5) {
          console.log('⚠️ Polygon area too small (collinear or nearly flat), skipping. Area:', areaPx2.toFixed(2), 'px²');
          // Silently skip - don't show error alert (was causing blank modal issues)
          // Just don't create the polygon, let user continue placing lines
          return;
        }
        
        console.log('✅ Polygon area:', areaPx2, 'px²');
        
        // Convert to physical units
        let perimeterStr: string;
        let areaStr: string;
        let physicalArea: number;
        
        if (isMapMode && mapScale) {
          // Map mode
          const perimeterDist = convertToMapScale(perimeterPx);
          perimeterStr = formatMapValue(perimeterDist);
          
          // For area, we need to square the scale factor
          const scaleFactor = convertToMapScale(1); // Get scale for 1 pixel
          const areaDist2 = areaPx2 * scaleFactor * scaleFactor;
          physicalArea = areaDist2;
          areaStr = formatMapScaleArea(areaDist2);
        } else {
          // Coin calibration mode
          const perimeterInUnits = perimeterPx / (calibration?.pixelsPerUnit || 1);
          perimeterStr = formatMeasurement(perimeterInUnits, calibration?.unit || 'mm', unitSystem, 2);
          
          const areaInUnits2 = areaPx2 / Math.pow(calibration?.pixelsPerUnit || 1, 2);
          physicalArea = areaInUnits2;
          areaStr = formatAreaMeasurement(areaInUnits2, calibration?.unit || 'mm', unitSystem);
        }
        
        // Create new polygon measurement
        const polygonMeasurement: Measurement = {
          id: Date.now().toString(),
          points: polygonPoints,
          value: `${perimeterStr} (A: ${areaStr})`, // Show both perimeter and area
          perimeter: perimeterStr, // For inline label
          mode: 'polygon' as any, // New mode type
          area: physicalArea,
          isClosed: true,
          calibrationMode: isMapMode ? 'map' : 'coin',
          ...(isMapMode && mapScale && { mapScaleData: mapScale }),
        };
        
        // Remove the individual lines and add the polygon
        const remainingMeasurements = allMeasurements.filter(m => !usedIds.has(m.id));
        setMeasurements([...remainingMeasurements, polygonMeasurement]);
        
        // Success haptic!
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        console.log('🔷 Polygon created:', {
          sides: chain.length,
          perimeter: perimeterStr,
          area: areaStr
        });
        
        return; // Only merge one polygon at a time
      }
  };

  const placePoint = (x: number, y: number) => {
    // Convert screen tap to original image coordinates
    const imageCoords = screenToImage(x, y);
    console.log('🎯 Placing point:');
    console.log('  Screen coords:', x, y);
    console.log('  Image coords:', imageCoords.x.toFixed(1), imageCoords.y.toFixed(1));
    console.log('  Current zoom:', zoomScale.toFixed(2), 'translate:', zoomTranslateX.toFixed(0), zoomTranslateY.toFixed(0));
    
    const requiredPoints = mode === 'distance' ? 2 
      : mode === 'angle' ? 3 
      : mode === 'circle' ? 2 
      : 2; // rectangle
    const newPoint = { x: imageCoords.x, y: imageCoords.y, id: Date.now().toString() };
    
    if (currentPoints.length + 1 < requiredPoints) {
      // Still need more points
      setCurrentPoints([...currentPoints, newPoint]);
      
      // Auto-enable measurement mode after first point (async to avoid blocking)
      if (currentPoints.length === 0 && measurements.length === 0) {
        setTimeout(() => setMeasurementMode(true), 0);
      }
    } else {
      // This completes a measurement
      let completedPoints = [...currentPoints, newPoint];
      
      // Calculate measurement value
      let value: string;
      let radius: number | undefined;
      let width: number | undefined;
      let height: number | undefined;
      
      if (mode === 'distance') {
        value = calculateDistance(completedPoints[0], completedPoints[1]);
      } else if (mode === 'angle') {
        value = calculateAngle(completedPoints[0], completedPoints[1], completedPoints[2]);
      } else if (mode === 'circle') {
        // Calculate radius (in pixels) and convert to diameter
        radius = Math.sqrt(
          Math.pow(completedPoints[1].x - completedPoints[0].x, 2) +
          Math.pow(completedPoints[1].y - completedPoints[0].y, 2)
        );

        // Map Mode: Apply scale conversion
        if (isMapMode && mapScale) {
          const diameterPx = radius * 2;
          value = `⌀ ${formatMapScaleDistance(diameterPx)}`;
        } else {
          // Convert radius in pixels to diameter in mm/inches
          const radiusInUnits = radius / (calibration?.pixelsPerUnit || 1);
          const diameter = radiusInUnits * 2;
          value = `⌀ ${formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2)}`;
        }
      } else {
        // Rectangle: calculate width and height, and store all 4 corners
        const p0 = completedPoints[0];
        const p1 = completedPoints[1];
        const widthPx = Math.abs(p1.x - p0.x);
        const heightPx = Math.abs(p1.y - p0.y);

        // Map Mode: Apply scale conversion
        if (isMapMode && mapScale) {
          const widthDist = convertToMapScale(widthPx);
          const heightDist = convertToMapScale(heightPx);
          width = widthDist;
          height = heightDist;
          const widthStr = formatMapScaleDistance(widthPx);
          const heightStr = formatMapScaleDistance(heightPx);
          const areaDist2 = widthDist * heightDist;
          const areaStr = formatMapScaleArea(areaDist2);
          value = `${widthStr} × ${heightStr} (A: ${areaStr})`;
        } else {
          width = widthPx / (calibration?.pixelsPerUnit || 1);
          height = heightPx / (calibration?.pixelsPerUnit || 1);
          const widthStr = formatMeasurement(width, calibration?.unit || 'mm', unitSystem, 2);
          const heightStr = formatMeasurement(height, calibration?.unit || 'mm', unitSystem, 2);
          const area = width * height;
          const areaStr = formatAreaMeasurement(area, calibration?.unit || 'mm', unitSystem);
          value = `${widthStr} × ${heightStr} (A: ${areaStr})`;
        }

        // Calculate all 4 corners from the 2 opposite corners
        const minX = Math.min(p0.x, p1.x);
        const maxX = Math.max(p0.x, p1.x);
        const minY = Math.min(p0.y, p1.y);
        const maxY = Math.max(p0.y, p1.y);

        // Store all 4 corners: top-left, top-right, bottom-right, bottom-left
        completedPoints = [
          { x: minX, y: minY, id: Date.now().toString() + '-0' },        // top-left
          { x: maxX, y: minY, id: Date.now().toString() + '-1' },        // top-right
          { x: maxX, y: maxY, id: Date.now().toString() + '-2' },        // bottom-right
          { x: minX, y: maxY, id: Date.now().toString() + '-3' },        // bottom-left
        ];
      }
      
      // Save as completed measurement
      let area: number | undefined;
      if (mode === 'rectangle' && width !== undefined && height !== undefined) {
        area = width * height;
      }

      const newMeasurement: Measurement = {
        id: Date.now().toString(),
        points: completedPoints.map(p => ({ x: p.x, y: p.y })),
        value,
        mode,
        calibrationMode: isMapMode ? 'map' : 'coin', // Store which calibration was used
        ...(isMapMode && mapScale && { mapScaleData: mapScale }), // Store map scale data if in map mode
        ...(radius !== undefined && { radius }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(area !== undefined && { area }),
      };
      
      console.log('📏 Created measurement:', {
        mode,
        hasWidth: width !== undefined,
        hasHeight: height !== undefined,
        width,
        height,
        value,
      });
      
      setMeasurements([...measurements, newMeasurement]);
      
      // 🔷 POLYGON AUTO-DETECTION: Check if this distance line closes a polygon
      // Require at least 4 lines (squares/rectangles) to prevent premature triangle snapping
      if (mode === 'distance') {
        detectAndMergePolygon([...measurements, newMeasurement]);
      }
      
      checkForCalibrationIssues(newMeasurement); // Check if user is struggling
      setCurrentPoints([]); // Reset for next measurement
    }
  };

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

      // Clear any existing lock-in timers
      lockInTimersRef.current.forEach(timer => clearTimeout(timer));
      lockInTimersRef.current = [];

      // Double haptic feedback for "Locked In!"
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => {
        lockInTimersRef.current.push(setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 100));
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
      lockInTimersRef.current.push(setTimeout(blink, 350));
      lockInTimersRef.current.push(setTimeout(blink, 700));

      // Auto-hide animation after blinking (if not dismissed by pan)
      lockInTimersRef.current.push(setTimeout(() => {
        setShowLockedInAnimation(false);
        lockInTimersRef.current = []; // Clear after completion
      }, 1200));
    }
  }, [coinCircle, hasShownAnimation]);
  
  // Cleanup undo long-press timers and lock-in animation timers on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
      // Clear lock-in animation timers
      lockInTimersRef.current.forEach(timer => clearTimeout(timer));
      lockInTimersRef.current = [];
    };
  }, []);
  
  // Reset calibration hint for new photos
  useEffect(() => {
    // Reset hint state when image changes
    setAttemptHistory([]);
    setHasShownCalibrationHint(false);
    setShowCalibrationHint(false);
    hintOpacity.value = 0;
    hintScale.value = 0.8;
  }, [currentImageUri]);
  
  // Animate hint appearance
  useEffect(() => {
    if (showCalibrationHint) {
      // Graceful fade in + scale up
      hintOpacity.value = withTiming(1, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      hintScale.value = withTiming(1, { duration: 600, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }); // Spring-like ease
      
      // Color shift animation (loops forever)
      hintColorShift.value = withTiming(1, { 
        duration: 3000, 
        easing: Easing.inOut(Easing.ease) 
      }, (finished) => {
        if (finished) {
          hintColorShift.value = 0;
          hintColorShift.value = withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) });
        }
      });
    } else {
      // Fade out
      hintOpacity.value = withTiming(0, { duration: 300 });
      hintScale.value = withTiming(0.9, { duration: 300 });
    }
  }, [showCalibrationHint]);
  
  // Animated styles for hint (must be at top level, not inside conditional)
  const hintBackgroundStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));
  
  const hintCardStyle = useAnimatedStyle(() => {
    // Color shift between amber, orange, and rose
    const r = interpolate(hintColorShift.value, [0, 0.5, 1], [245, 251, 251]);
    const g = interpolate(hintColorShift.value, [0, 0.5, 1], [158, 146, 113]);
    const b = interpolate(hintColorShift.value, [0, 0.5, 1], [11, 59, 133]);
    
    return {
      transform: [{ scale: hintScale.value }],
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`, // Very transparent for glass effect
      borderRadius: 28, // Match the BlurView radius for smooth corners
      overflow: 'hidden', // Ensure children respect the rounded corners
    };
  });
  
  // Tetris Easter egg trigger - detect when legend fills screen
  useEffect(() => {
    if (hasTriggeredTetris || measurements.length === 0) return;
    
    // Calculate legend height: each measurement is ~10px + margins
    const legendItemHeight = 10; // 8px font + 2px margin
    const legendHeight = measurements.length * legendItemHeight + 8; // +8 for padding
    
    // Trigger if legend is taller than 70% of screen height
    const triggerHeight = SCREEN_HEIGHT * 0.7;
    
    if (legendHeight >= triggerHeight) {
      console.log('🎮 TETRIS EASTER EGG TRIGGERED!', measurements.length, 'measurements');
      setHasTriggeredTetris(true);
      triggerTetrisAnimation();
    }
  }, [measurements.length, hasTriggeredTetris]);

  // Shake detection to toggle menu visibility
  useEffect(() => {
    DeviceMotion.setUpdateInterval(100);
    let lastShakeTime = 0;
    const SHAKE_THRESHOLD = 15; // Higher threshold - need a proper shake!
    const SHAKE_COOLDOWN = 1500; // 1.5 seconds cooldown between shakes

    const subscription = DeviceMotion.addListener((data) => {
      if (!data.acceleration) return;

      const now = Date.now();
      if (now - lastShakeTime < SHAKE_COOLDOWN) return; // Cooldown to prevent rapid toggles

      const { x, y, z } = data.acceleration;
      
      // Detect HORIZONTAL shake only (x and z axes, not y)
      // This prevents karate chop (vertical Y motion) from triggering shake
      const horizontalAcceleration = Math.abs(x) + Math.abs(z);

      // Detect shake - need significant HORIZONTAL acceleration
      if (horizontalAcceleration > SHAKE_THRESHOLD) {
        lastShakeTime = now;
        
        // Toggle menu using menuHidden (same as swipe/tab controls)
        setMenuHidden(prev => {
          const newState = !prev;
          
          // Sync shared value for gesture worklets
          menuHiddenShared.value = newState;
          
          // Animate menu position AND opacity
          if (newState) {
            // Hide menu - fade out while sliding
            menuTranslateX.value = withSpring(SCREEN_WIDTH, {
              damping: 25,
              stiffness: 300,
            });
            menuOpacity.value = withTiming(0, { duration: 300 });
          } else {
            // Show menu - fade in while sliding
            menuTranslateX.value = withSpring(0, {
              damping: 25,
              stiffness: 300,
            });
            menuOpacity.value = withTiming(1, { duration: 300 });
          }
          
          Haptics.impactAsync(
            newState ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
          );
          return newState;
        });
      }
    });

    return () => subscription.remove();
  }, []);

  // Recalculate all measurement values when unit system changes
  useEffect(() => {
    // Don't run on mount or if no measurements exist
    if (measurements.length === 0) {
      return;
    }

    // Only recalculate if unit system actually changed
    if (prevUnitSystemRef.current === unitSystem) {
      return;
    }

    console.log('🔄 Unit system changed, recalculating all measurements...');
    prevUnitSystemRef.current = unitSystem;

    const updatedMeasurements = measurements.map(m => {
      let newValue = m.value;
      let width, height, radius, area, newPerimeter;
      
      if (m.mode === 'distance') {
        newValue = calculateDistance(m.points[0], m.points[1]);
      } else if (m.mode === 'angle') {
        newValue = calculateAngle(m.points[0], m.points[1], m.points[2]);
      } else if (m.mode === 'circle') {
        const radiusPx = Math.sqrt(
          Math.pow(m.points[1].x - m.points[0].x, 2) + 
          Math.pow(m.points[1].y - m.points[0].y, 2)
        );
        radius = radiusPx / (calibration?.pixelsPerUnit || 1);
        const diameter = radius * 2;
        newValue = `⌀ ${formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2)}`;
      } else if (m.mode === 'rectangle') {
        // Use opposite corners (points[0] and points[2]) for correct width/height
        const widthPx = Math.abs(m.points[2].x - m.points[0].x);
        const heightPx = Math.abs(m.points[2].y - m.points[0].y);
        width = widthPx / (calibration?.pixelsPerUnit || 1);
        height = heightPx / (calibration?.pixelsPerUnit || 1);
        const widthStr = formatMeasurement(width, calibration?.unit || 'mm', unitSystem, 2);
        const heightStr = formatMeasurement(height, calibration?.unit || 'mm', unitSystem, 2);
        const area = width * height;
        const areaStr = formatAreaMeasurement(area, calibration?.unit || 'mm', unitSystem);
        newValue = `${widthStr} × ${heightStr} (A: ${areaStr})`;
      } else if (m.mode === 'freehand') {
        // Recalculate freehand path length
        let totalLength = 0;
        for (let i = 1; i < m.points.length; i++) {
          const dx = m.points[i].x - m.points[i - 1].x;
          const dy = m.points[i].y - m.points[i - 1].y;
          totalLength += Math.sqrt(dx * dx + dy * dy);
        }
        
        // Map Mode: Apply scale conversion
        let perimeterStr: string;
        if (isMapMode && mapScale) {
          perimeterStr = formatMapScaleDistance(totalLength);
        } else {
          const physicalLength = totalLength / (calibration?.pixelsPerUnit || 1);
          perimeterStr = formatMeasurement(physicalLength, calibration?.unit || 'mm', unitSystem);
        }
        
        // If it has area (closed non-intersecting loop), recalculate area display
        let newPerimeter;
        if (m.area !== undefined) {
          // Map Mode: Apply scale conversion for area
          let areaStr: string;
          if (isMapMode && mapScale) {
            // Convert area pixels to map scale area
            const areaPx = m.area * (calibration?.pixelsPerUnit || 1) * (calibration?.pixelsPerUnit || 1);
            const areaDist2 = convertToMapScale(Math.sqrt(areaPx)) ** 2;
            areaStr = formatMapScaleArea(areaDist2);
          } else {
            areaStr = formatAreaMeasurement(m.area, calibration?.unit || 'mm', unitSystem);
          }
          newValue = `${perimeterStr} ⊞ ${areaStr}`;
          newPerimeter = perimeterStr; // Store perimeter separately for inline display
        } else {
          newValue = perimeterStr;
        }
      } else if (m.mode === 'polygon') {
        // Recalculate polygon perimeter
        let perimeter = 0;
        for (let i = 0; i < m.points.length; i++) {
          const p1 = m.points[i];
          const p2 = m.points[(i + 1) % m.points.length];
          const segmentLength = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
          );
          perimeter += segmentLength;
        }
        
        // Map Mode: Apply scale conversion
        let perimeterStr: string;
        if (isMapMode && mapScale) {
          perimeterStr = formatMapScaleDistance(perimeter);
        } else {
          const perimeterInUnits = perimeter / (calibration?.pixelsPerUnit || 1);
          perimeterStr = formatMeasurement(perimeterInUnits, calibration?.unit || 'mm', unitSystem, 2);
        }
        
        // Recalculate area if it exists
        if (m.area !== undefined) {
          let areaStr: string;
          if (isMapMode && mapScale) {
            // Area is already stored in real units, just need to format it
            const areaDisplay = m.area;
            areaStr = formatMapScaleArea(areaDisplay);
          } else {
            areaStr = formatAreaMeasurement(m.area, calibration?.unit || 'mm', unitSystem);
          }
          newValue = `${perimeterStr} (A: ${areaStr})`;
          newPerimeter = perimeterStr; // Store perimeter separately for inline display
        } else {
          newValue = perimeterStr;
        }
      }
      
      return {
        ...m,
        value: newValue,
        ...(newPerimeter !== undefined && { perimeter: newPerimeter }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(radius !== undefined && { radius }),
        ...(area !== undefined && { area }),
      };
    });
    
    console.log('✅ Updated', updatedMeasurements.length, 'measurements for', unitSystem, 'system');
    setMeasurements(updatedMeasurements);
  }, [unitSystem, measurements, calibration, isMapMode, mapScale, calculateDistance, calculateAngle, formatMeasurement, formatAreaMeasurement, formatMapScaleDistance, formatMapScaleArea, convertToMapScale]); // Include all dependencies

  const handleClear = () => {
    // Priority 1: If user is placing points, undo last point
    if (currentPoints.length > 0) {
      // Remove just the last point, not all points
      setCurrentPoints(currentPoints.slice(0, -1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log('↩️ Removed last point, remaining:', currentPoints.length - 1);
      return;
    }
    
    // Priority 2: Check if the last measurement has been edited (has history)
    if (measurements.length > 0) {
      const lastMeasurement = measurements[measurements.length - 1];
      
      if (measurementHistory.has(lastMeasurement.id)) {
        // Revert to original state instead of deleting
        const originalState = measurementHistory.get(lastMeasurement.id)!;
        const updatedMeasurements = measurements.map(m => 
          m.id === lastMeasurement.id ? originalState : m
        );
        setMeasurements(updatedMeasurements);
        
        // Remove from history
        const newHistory = new Map(measurementHistory);
        newHistory.delete(lastMeasurement.id);
        setMeasurementHistory(newHistory);
        
        console.log('↩️ Reverted measurement to original state:', lastMeasurement.id);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        // No edits - delete the measurement
        setMeasurements(measurements.slice(0, -1));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  // Long-press handlers for undo button (like holding backspace)
  const startUndoLongPress = () => {
    // Clear any existing timers
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    
    // First undo happens immediately on press
    handleClear();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let deleteCount = 0; // Track how many deletions for acceleration
    
    // Start with slower interval, then speed up like backspace
    const startDeletion = (interval: number) => {
      undoIntervalRef.current = setInterval(() => {
        // Get current measurements from store
        const currentMeasurements = useStore.getState().completedMeasurements;
        const currentPointsState = useStore.getState().currentPoints;
        
        // If nothing left to delete, stop the interval
        if (currentMeasurements.length === 0 && currentPointsState.length === 0) {
          if (undoIntervalRef.current) {
            clearInterval(undoIntervalRef.current);
            undoIntervalRef.current = null;
          }
          return;
        }
        
        // Delete one measurement
        if (currentMeasurements.length > 0) {
          setMeasurements(currentMeasurements.slice(0, -1));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (currentPointsState.length > 0) {
          setCurrentPoints([]);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        deleteCount++;
        
        // Accelerate after certain milestones (like backspace)
        if (deleteCount === 3 && interval === 300) {
          // After 3 deletions at slow speed, speed up to medium
          clearInterval(undoIntervalRef.current!);
          startDeletion(150);
        } else if (deleteCount === 8 && interval === 150) {
          // After 5 more at medium speed, speed up to fast
          clearInterval(undoIntervalRef.current!);
          startDeletion(75);
        } else if (deleteCount === 15 && interval === 75) {
          // After 7 more at fast speed, speed up to very fast
          clearInterval(undoIntervalRef.current!);
          startDeletion(40);
        }
      }, interval);
    };
    
    // After 400ms delay, start slow deletion (300ms intervals)
    undoTimeoutRef.current = setTimeout(() => {
      startDeletion(300); // Start slow
    }, 400);
  };
  
  const stopUndoLongPress = () => {
    // Clear both timers when user releases
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    if (undoIntervalRef.current) {
      clearInterval(undoIntervalRef.current);
      undoIntervalRef.current = null;
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
    
    // Show label modal first
    setPendingAction('save');
    setShowLabelModal(true);
  };

  const performSave = async (label: string | null) => {
    if (!currentImageUri) {
      showAlert('Export Error', 'No image to export. Please take a photo first.', 'error');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Required', 'Please grant photo library access.', 'warning');
        return;
      }
      
      setIsCapturing(true);
      setCurrentLabel(label);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (!externalViewRef?.current) {
        showAlert('View Error', 'View ref not available. Try again.', 'error');
        setIsCapturing(false);
        setCurrentLabel(null);
        return;
      }
      
      const measurementsUri = await captureRef(externalViewRef.current, { 
        format: 'jpg', 
        quality: 0.9,
        result: 'tmpfile',
      });
      const measurementsAsset = await MediaLibrary.createAssetAsync(measurementsUri);
      
      // Add to "PanHandler Measurements" album
      try {
        const album = await MediaLibrary.getAlbumAsync('PanHandler Measurements');
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([measurementsAsset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync('PanHandler Measurements', measurementsAsset, false);
        }
        __DEV__ && console.log('✅ Measurements saved to Camera Roll + PanHandler Measurements album');
      } catch (albumError) {
        console.error('Failed to add to PanHandler Measurements album:', albumError);
        __DEV__ && console.log('✅ Measurements saved to Camera Roll only');
      }
      
      setHideMeasurementsForCapture(true);
      if (setImageOpacity) setImageOpacity(0.5);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (!externalViewRef?.current) {
        showAlert('Error', 'View lost during capture.', 'error');
        setIsCapturing(false);
        setCurrentLabel(null);
        setHideMeasurementsForCapture(false);
        if (setImageOpacity) setImageOpacity(1);
        return;
      }
      
      const labelOnlyUri = await captureRef(externalViewRef.current, { 
        format: 'png', 
        quality: 1.0,
        result: 'tmpfile',
      });
      const labelOnlyAsset = await MediaLibrary.createAssetAsync(labelOnlyUri);
      
      // Add label-only version to "PanHandler Measurements" album
      try {
        const album = await MediaLibrary.getAlbumAsync('PanHandler Measurements');
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([labelOnlyAsset], album, false);
        }
        __DEV__ && console.log('✅ Label-only version also saved to PanHandler Measurements album');
      } catch (albumError) {
        console.error('Failed to add label-only to album:', albumError);
      }
      
      if (setImageOpacity) setImageOpacity(1);
      setHideMeasurementsForCapture(false);
      setIsCapturing(false);
      setCurrentLabel(null);
      
      // Show success modal instead of toast
      setShowSaveSuccessModal(true);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setIsCapturing(false);
      setCurrentLabel(null);
      setHideMeasurementsForCapture(false);
      if (setImageOpacity) setImageOpacity(1);
      showAlert('Save Error', `${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleEmail = async () => {
    // Show label modal first
    setPendingAction('email');
    setShowLabelModal(true);
  };

  const performEmail = async (label: string | null) => {
    if (!currentImageUri) {
      showAlert('Email Error', 'No image to export.', 'error');
      return;
    }
    
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        showAlert('Email Not Available', 'No email app is configured.', 'warning');
        return;
      }

      let emailToUse = userEmail;
      if (!emailToUse) {
        await new Promise<void>((resolve) => {
          const handleEmailComplete = (email: string | null) => {
            if (email && email.trim()) {
              emailToUse = email.trim();
              setUserEmail(emailToUse);
              // Show confirmation that email was saved
              setTimeout(() => {
                showAlert(
                  'Email Saved',
                  'Your email has been saved for future reports. Tip: You can reset it anytime by long-pressing the Help (?) button.',
                  'success'
                );
              }, 500);
            }
            setShowEmailPromptModal(false);
            resolve();
          };
          
          const handleEmailDismiss = () => {
            setShowEmailPromptModal(false);
            resolve();
          };
          
          (window as any)._emailPromptHandlers = { handleEmailComplete, handleEmailDismiss };
          setShowEmailPromptModal(true);
        });
      }
      
      setIsCapturing(true);
      setCurrentLabel(label);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (!externalViewRef?.current) {
        showAlert('Error', 'View not ready. Wait and try again.', 'error');
        setIsCapturing(false);
        setCurrentLabel(null);
        return;
      }
      
      const measurementsUri = await captureRef(externalViewRef.current, { 
        format: 'jpg', 
        quality: 0.9,
        result: 'tmpfile',
      });
      
      // Build email body
      let measurementText = label ? `${label} - Measurements by PanHandler\n` : 'PanHandler Measurements\n';
      measurementText += '========================================\n\n';
      
      if (coinCircle) {
        const coinDiameterDisplay = unitSystem === 'imperial' 
          ? formatMeasurement(coinCircle.coinDiameter, 'mm', 'imperial', 2)
          : `${coinCircle.coinDiameter.toFixed(2)}mm`;
        measurementText += `Calibration: ${coinDiameterDisplay} (${coinCircle.coinName})\n`;
      } else if (calibration?.calibrationType === 'verbal' && calibration.verbalScale) {
        const scale = calibration.verbalScale;
        measurementText += `Calibration: Map Scale (${scale.screenDistance}${scale.screenUnit} = ${scale.realDistance}${scale.realUnit})\n`;
      }
      
      measurementText += `Unit: ${unitSystem === 'metric' ? 'Metric' : 'Imperial'}\n\nMeasurements:\n`;
      
      measurements.forEach((m, idx) => {
        const colorInfo = getMeasurementColor(idx, m.mode);
        const valueOnly = m.value.replace(/^(Blue|Green|Red|Purple|Orange|Yellow|Pink|Amber|Cyan|Rose|Teal|Violet|Crimson|Magenta|Indigo|Sky|Lime)\s+/i, '');
        measurementText += `${valueOnly} (${colorInfo.name})\n`;
      });
      
      measurementText += `\n\nAttached: 2 photos\n`;
      if (!isProUser) {
        measurementText += '\n═══════════════════════════\nMade with PanHandler for iOS\n═══════════════════════════';
      }

      const attachments: string[] = [];
      const measurementsFilename = label ? `${label}_Measurements.jpg` : 'Measurements.jpg';
      const measurementsDest = `${FileSystem.cacheDirectory}${measurementsFilename}`;
      await FileSystem.copyAsync({ from: measurementsUri, to: measurementsDest });
      attachments.push(measurementsDest);
      
      // Capture label only (transparent overlay with just the label)
      setHideMeasurementsForCapture(true);
      if (setImageOpacity) setImageOpacity(0.5);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (!externalViewRef?.current) {
        showAlert('Error', 'View lost during label capture.', 'error');
        setIsCapturing(false);
        setCurrentLabel(null);
        setHideMeasurementsForCapture(false);
        if (setImageOpacity) setImageOpacity(1);
        return;
      }
      
      const labelOnlyUri = await captureRef(externalViewRef.current, { 
        format: 'png', 
        quality: 1.0,
        result: 'tmpfile',
      });
      
      if (setImageOpacity) setImageOpacity(1);
      setHideMeasurementsForCapture(false);
      
      const labelOnlyFilename = label ? `${label}_Label.png` : 'Label.png';
      const labelOnlyDest = `${FileSystem.cacheDirectory}${labelOnlyFilename}`;
      await FileSystem.copyAsync({ from: labelOnlyUri, to: labelOnlyDest });
      attachments.push(labelOnlyDest);
      
      setIsCapturing(false);
      setCurrentLabel(null);
      
      const subject = label ? `${label} - Measurements` : 'PanHandler Measurements';
      const recipients = emailToUse ? [emailToUse] : [];
      
      await MailComposer.composeAsync({
        recipients,
        ccRecipients: recipients,
        subject,
        body: measurementText,
        attachments,
      });
      
    } catch (error) {
      setIsCapturing(false);
      setCurrentLabel(null);
      showAlert('Email Error', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };


  const handleReset = () => {
    // Don't clear state here - let the parent's transition handle it properly
    // This prevents the measurement screen from unmounting before the transition starts
    
    // Call parent's reset callback to return to camera mode
    onReset?.();

    // Camera shutter haptic: da-da-da-da! 📸
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 80);
    scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 160);
    scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 240);
  };

  const hasAnyMeasurements = measurements.length > 0 || currentPoints.length > 0;
  const requiredPoints = mode === 'distance' ? 2 
    : mode === 'angle' ? 3 
    : mode === 'circle' ? 2  // center + edge point
    : 2;  // rectangle: 2 corners
  
  // Lock pan/zoom once any points are placed
  // EXCEPT during blueprint/aerial placement - allow pan/zoom until calibration complete
  const isPanZoomLocked = isPlacingBlueprint ? false : hasAnyMeasurements;
  
  // Handle label modal completion
  const handleLabelComplete = (data: { label: string | null; depth?: number; depthUnit?: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi' }) => {
    setShowLabelModal(false);

    // Remember the label for this session
    setCurrentLabel(data.label);

    if (pendingAction === 'save') {
      performSave(data.label);
    } else if (pendingAction === 'email') {
      performEmail(data.label);
    }

    setPendingAction(null);
  };

  const handleLabelDismiss = () => {
    setShowLabelModal(false);
    setPendingAction(null);
  };

  // Handle label editing for existing measurements (double-tap feature)
  const handleLabelEditComplete = (data: { label: string | null; depth?: number; depthUnit?: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi' }) => {
    setShowLabelEditModal(false);

    if (labelEditingMeasurementId) {
      // Update the measurement with the new label and depth (if provided)
      const updatedMeasurements = measurements.map(m => {
        if (m.id === labelEditingMeasurementId) {
          return {
            ...m,
            label: data.label,
            depth: data.depth,
            depthUnit: data.depthUnit
          };
        }
        return m;
      });
      setMeasurements(updatedMeasurements);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('✅ Label and depth updated for measurement:', labelEditingMeasurementId);
    }

    setLabelEditingMeasurementId(null);
  };
  
  const handleLabelEditDismiss = () => {
    setShowLabelEditModal(false);
    setLabelEditingMeasurementId(null);
  };
  
  // Animated style for menu sliding
  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: menuTranslateX.value }],
    opacity: menuOpacity.value,
  }));
  
  // Animated style for tab position
  const tabAnimatedStyle = useAnimatedStyle(() => ({
    top: tabPositionY.value - 40, // Center the 80px tall tab
  }));
  
  // Pan gesture for sliding menu in/out - requires FAST swipe to avoid conflicts

  // Swipe gesture for cycling through measurement modes - SIMPLE VERSION that doesn't interfere with buttons
  const modeSwitchGesture = Gesture.Pan()
    .minDistance(20) // Require 20px movement before activating - allows taps to work instantly
    .shouldCancelWhenOutside(true) // Cancel if finger leaves gesture area
    .maxPointers(1) // Only single finger swipes, prevents interference with pinch gestures
    .onStart(() => {
      // Reset offset when gesture starts
      modeSwipeOffset.value = 0;
    })
    .onUpdate((event) => {
      // Track finger position in real-time for fluid feedback
      modeSwipeOffset.value = event.translationX;
    })
    .onEnd((event) => {
      // Very relaxed thresholds for fluid swiping
      const threshold = 30; // 30px swipe to trigger mode change
      const modes: MeasurementMode[] = ['distance', 'angle', 'circle', 'rectangle', 'freehand'];
      const currentIndex = modes.indexOf(mode);
      
      // Detect primarily horizontal swipes
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      
      if (isHorizontal && Math.abs(event.translationX) > threshold) {
        if (event.translationX < 0) {
          // Swipe left - next mode
          let nextIndex = (currentIndex + 1) % modes.length;
          let nextMode = modes[nextIndex];
          
          // Freehand is now always available (donation-based, not paywall)
          
          runOnJS(setMode)(nextMode);
          runOnJS(setModeColorIndex)(nextIndex);
          runOnJS(setCurrentPoints)([]);
          runOnJS(setMeasurementMode)(true);
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          // Swipe right - previous mode
          let prevIndex = (currentIndex - 1 + modes.length) % modes.length;
          let prevMode = modes[prevIndex];
          
          // Freehand is now always available (donation-based, not paywall)
          
          runOnJS(setMode)(prevMode);
          runOnJS(setModeColorIndex)(prevIndex);
          runOnJS(setCurrentPoints)([]);
          runOnJS(setMeasurementMode)(true);
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
      
      // Reset offset with spring animation
      modeSwipeOffset.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
    });
  
  // Drag gesture for repositioning tab vertically
  const tabDragGesture = Gesture.Pan()
    .onStart(() => {
      // Store the starting position
      tabPositionY.value = tabPositionY.value;
    })
    .onUpdate((event) => {
      // Use absoluteY for smoother direct positioning
      const newY = event.absoluteY;
      // Keep tab within safe bounds
      tabPositionY.value = Math.max(insets.top + 80, Math.min(newY, SCREEN_HEIGHT - insets.bottom - 80));
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    });
  
  // Quick swipe gesture to collapse/expand menu
  const menuSwipeGesture = Gesture.Pan()
    .minDistance(40) // Require more movement before activating
    .maxPointers(1) // Only single finger
    .onStart(() => {
      'worklet';
      // Clear any existing trail when starting new swipe
      runOnJS(setSwipeTrail)([]);
    })
    .onUpdate((event) => {
      'worklet';
      // Record trail points during swipe
      const trailPoint = {
        x: event.absoluteX,
        y: event.absoluteY,
        id: `trail-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      console.log('🎨 Trail point recorded:', trailPoint);
      runOnJS(setSwipeTrail)((prev) => {
        // Safety check: ensure prev is always an array
        const currentTrail = Array.isArray(prev) ? prev : [];
        console.log('🎨 Current trail length:', currentTrail.length);
        return [...currentTrail, trailPoint];
      });
    })
    .onEnd((event) => {
      'worklet';
      // Detect horizontal swipe with velocity threshold
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY) * 2;
      const threshold = SCREEN_WIDTH * 0.25; // 25% of screen width
      const velocityThreshold = 800; // Faster swipe required = 800 units/sec
      
      // Swipe right OR left to collapse menu (both directions work!)
      if (isHorizontal && 
          (Math.abs(event.translationX) > threshold || Math.abs(event.velocityX) > velocityThreshold) &&
          !menuHiddenShared.value) {
        menuTranslateX.value = withSpring(SCREEN_WIDTH, {
          damping: 20,
          stiffness: 300,
        });
        menuOpacity.value = 1;
        menuHiddenShared.value = true;
        runOnJS(setMenuHidden)(true);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        
        // Start fading trail after 100ms
        runOnJS(setTimeout)(() => {
          runOnJS(setSwipeTrail)([]);
        }, 1000); // Clear after 1 second
      }
      // Swipe left OR right to open menu (when hidden)
      else if (isHorizontal && 
               (Math.abs(event.translationX) > threshold || Math.abs(event.velocityX) > velocityThreshold) &&
               menuHiddenShared.value) {
        menuTranslateX.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
        menuOpacity.value = 1;
        menuHiddenShared.value = false;
        runOnJS(setMenuHidden)(false);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Swipe didn't meet threshold, clear trail
        runOnJS(setSwipeTrail)([]);
      }
    });
  
  const toggleMenuFromTab = () => {
    if (menuHidden) {
      menuTranslateX.value = withSpring(0);
      menuOpacity.value = 1; // Ensure visible
      menuHiddenShared.value = false;
      setMenuHidden(false);
    } else {
      menuTranslateX.value = SCREEN_WIDTH; // Changed from withSpring to instant
      menuOpacity.value = 1; // Reset for next show
      menuHiddenShared.value = true;
      setMenuHidden(true);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const collapseMenu = () => {
    menuTranslateX.value = SCREEN_WIDTH; // Changed from withSpring to instant
    menuOpacity.value = 1; // Reset for next show
    menuHiddenShared.value = true;
    setMenuHidden(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Memoize measurement rendering to prevent re-calculating SVG on every state change
  const renderedMeasurements = useMemo(() => {
    if (hideMeasurementsForCapture) return null;
    
    return measurements.map((measurement, idx) => {
      const color = getMeasurementColor(idx, measurement.mode);
      
      if (measurement.mode === 'distance') {
        const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        
        return (
          <React.Fragment key={measurement.id}>
            {/* Outer glow layers */}
            <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={color.glow} strokeWidth="12" opacity="0.15" strokeLinecap="round" />
            <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={color.glow} strokeWidth="8" opacity="0.25" strokeLinecap="round" />
            {/* Main line */}
            <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={color.main} strokeWidth="2.5" strokeLinecap="round" />
            {/* End caps */}
            <Line x1={p0.x} y1={p0.y - 12} x2={p0.x} y2={p0.y + 12} stroke={color.main} strokeWidth="2" strokeLinecap="round" />
            <Line x1={p1.x} y1={p1.y - 12} x2={p1.x} y2={p1.y + 12} stroke={color.main} strokeWidth="2" strokeLinecap="round" />
            {/* Point markers with reduced glow (50%) */}
            {/* P0 glow layers */}
            <Circle cx={p0.x} cy={p0.y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={p0.x} cy={p0.y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={p0.x} cy={p0.y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={p0.x} cy={p0.y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={p0.x} cy={p0.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
            {/* P1 glow layers */}
            <Circle cx={p1.x} cy={p1.y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={p1.x} cy={p1.y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={p1.x} cy={p1.y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={p1.x} cy={p1.y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={p1.x} cy={p1.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
          </React.Fragment>
        );
      } else if (measurement.mode === 'angle') {
        const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        const p2 = imageToScreen(measurement.points[2].x, measurement.points[2].y);
        
        // In map mode (azimuth), draw from p0 (start) to p1 (north) and p2 (dest)
        // In normal mode, draw from p1 (vertex) to p0 and p2
        const vertex = isMapMode ? p0 : p1;
        const arm1 = isMapMode ? p1 : p0;
        const arm2 = isMapMode ? p2 : p2;
        
        return (
          <React.Fragment key={measurement.id}>
            {/* Glow layers */}
            <Line x1={vertex.x} y1={vertex.y} x2={arm1.x} y2={arm1.y} stroke={color.glow} strokeWidth="12" opacity="0.15" strokeLinecap="round" />
            <Line x1={vertex.x} y1={vertex.y} x2={arm1.x} y2={arm1.y} stroke={color.glow} strokeWidth="8" opacity="0.25" strokeLinecap="round" />
            <Line x1={vertex.x} y1={vertex.y} x2={arm2.x} y2={arm2.y} stroke={color.glow} strokeWidth="12" opacity="0.15" strokeLinecap="round" />
            <Line x1={vertex.x} y1={vertex.y} x2={arm2.x} y2={arm2.y} stroke={color.glow} strokeWidth="8" opacity="0.25" strokeLinecap="round" />
            {/* Main lines */}
            <Line x1={vertex.x} y1={vertex.y} x2={arm1.x} y2={arm1.y} stroke={color.main} strokeWidth="2.5" strokeLinecap="round" />
            <Line x1={vertex.x} y1={vertex.y} x2={arm2.x} y2={arm2.y} stroke={color.main} strokeWidth="2.5" strokeLinecap="round" />
            <Path d={isMapMode ? generateArcPath(p1, p0, p2) : generateArcPath(p0, p1, p2)} stroke={color.main} strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Point markers with reduced glow (50%) */}
            {/* P0 glow layers */}
            <Circle cx={p0.x} cy={p0.y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={p0.x} cy={p0.y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={p0.x} cy={p0.y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={p0.x} cy={p0.y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={p0.x} cy={p0.y} r={isMapMode ? "5" : "4"} fill={color.main} stroke="white" strokeWidth="1" />
            {/* P1 (vertex in normal mode, north ref in map mode) */}
            <Circle cx={p1.x} cy={p1.y} r="6.5" fill={color.glow} opacity="0.05" />
            <Circle cx={p1.x} cy={p1.y} r="5.5" fill={color.glow} opacity="0.075" />
            <Circle cx={p1.x} cy={p1.y} r="4.5" fill={color.main} opacity="0.05" />
            <Circle cx={p1.x} cy={p1.y} r="3.5" fill={color.main} opacity="0.1" />
            <Circle cx={p1.x} cy={p1.y} r={isMapMode ? "4" : "5"} fill={color.main} stroke="white" strokeWidth="1" />
            {/* P2 glow layers */}
            <Circle cx={p2.x} cy={p2.y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={p2.x} cy={p2.y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={p2.x} cy={p2.y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={p2.x} cy={p2.y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={p2.x} cy={p2.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
          </React.Fragment>
        );
      } else if (measurement.mode === 'circle') {
        const center = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const edge = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        const screenRadius = Math.sqrt(
          Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
        );
        
        return (
          <React.Fragment key={measurement.id}>
            {/* Glow layers */}
            <Circle cx={center.x} cy={center.y} r={screenRadius} fill="none" stroke={color.glow} strokeWidth="12" opacity="0.15" />
            <Circle cx={center.x} cy={center.y} r={screenRadius} fill="none" stroke={color.glow} strokeWidth="8" opacity="0.25" />
            {/* Main circle */}
            <Circle cx={center.x} cy={center.y} r={screenRadius} fill="none" stroke={color.main} strokeWidth="2.5" />
            {/* Center marker with reduced glow (50%) */}
            <Circle cx={center.x} cy={center.y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={center.x} cy={center.y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={center.x} cy={center.y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={center.x} cy={center.y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={center.x} cy={center.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
          </React.Fragment>
        );
      } else if (measurement.mode === 'rectangle') {
        // Get all 4 corners
        const corners = measurement.points.map(p => imageToScreen(p.x, p.y));
        
        // Calculate bounding box for rectangle rendering
        const xCoords = corners.map(c => c.x);
        const yCoords = corners.map(c => c.y);
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);
        const width = maxX - minX;
        const height = maxY - minY;
        
        return (
          <React.Fragment key={measurement.id}>
            {/* Glow layers */}
            <Rect x={minX} y={minY} width={width} height={height} fill="none" stroke={color.glow} strokeWidth="12" opacity="0.15" />
            <Rect x={minX} y={minY} width={width} height={height} fill="none" stroke={color.glow} strokeWidth="8" opacity="0.25" />
            {/* Main rectangle */}
            <Rect x={minX} y={minY} width={width} height={height} fill="none" stroke={color.main} strokeWidth="2.5" />
            {/* Corner markers - all 4 corners with reduced glow (50%) */}
            {corners.map((corner, cornerIdx) => (
              <React.Fragment key={`corner-${cornerIdx}`}>
                <Circle cx={corner.x} cy={corner.y} r="6" fill={color.glow} opacity="0.05" />
                <Circle cx={corner.x} cy={corner.y} r="5" fill={color.glow} opacity="0.075" />
                <Circle cx={corner.x} cy={corner.y} r="4" fill={color.main} opacity="0.05" />
                <Circle cx={corner.x} cy={corner.y} r="3" fill={color.main} opacity="0.1" />
                <Circle cx={corner.x} cy={corner.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      } else if (measurement.mode === 'freehand') {
        // Render freehand path
        if (measurement.points.length < 2) return null;
        
        // Convert all points to screen coordinates
        const screenPoints = measurement.points.map(p => imageToScreen(p.x, p.y));
        
        // Generate simple polyline that exactly follows the drawn path
        // This prevents morphing issues from Bezier curve interpolation
        let pathData = `M ${screenPoints[0].x} ${screenPoints[0].y}`;
        for (let i = 1; i < screenPoints.length; i++) {
          pathData += ` L ${screenPoints[i].x} ${screenPoints[i].y}`;
        }
        
        return (
          <React.Fragment key={measurement.id}>
            {/* Glow layers for freehand path */}
            <Path d={pathData} stroke={color.glow} strokeWidth="12" opacity="0.15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={pathData} stroke={color.glow} strokeWidth="8" opacity="0.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Main freehand path */}
            <Path d={pathData} stroke={color.main} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Start and end point markers with reduced glow (50%) */}
            {/* Start point */}
            <Circle cx={screenPoints[0].x} cy={screenPoints[0].y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={screenPoints[0].x} cy={screenPoints[0].y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={screenPoints[0].x} cy={screenPoints[0].y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={screenPoints[0].x} cy={screenPoints[0].y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={screenPoints[0].x} cy={screenPoints[0].y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
            {/* End point */}
            <Circle cx={screenPoints[screenPoints.length - 1].x} cy={screenPoints[screenPoints.length - 1].y} r="6" fill={color.glow} opacity="0.05" />
            <Circle cx={screenPoints[screenPoints.length - 1].x} cy={screenPoints[screenPoints.length - 1].y} r="5" fill={color.glow} opacity="0.075" />
            <Circle cx={screenPoints[screenPoints.length - 1].x} cy={screenPoints[screenPoints.length - 1].y} r="4" fill={color.main} opacity="0.05" />
            <Circle cx={screenPoints[screenPoints.length - 1].x} cy={screenPoints[screenPoints.length - 1].y} r="3" fill={color.main} opacity="0.1" />
            <Circle cx={screenPoints[screenPoints.length - 1].x} cy={screenPoints[screenPoints.length - 1].y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
          </React.Fragment>
        );
      } else if (measurement.mode === 'polygon') {
        // Render auto-detected polygon with filled area
        if (measurement.points.length < 3) return null;
        
        // Convert all points to screen coordinates
        const screenPoints = measurement.points.map(p => imageToScreen(p.x, p.y));
        
        // Generate polygon path (closed)
        let pathData = `M ${screenPoints[0].x} ${screenPoints[0].y}`;
        for (let i = 1; i < screenPoints.length; i++) {
          pathData += ` L ${screenPoints[i].x} ${screenPoints[i].y}`;
        }
        pathData += ' Z'; // Close the path
        
        // Calculate centroid for label placement
        let centroidX = 0, centroidY = 0;
        for (const p of screenPoints) {
          centroidX += p.x;
          centroidY += p.y;
        }
        centroidX /= screenPoints.length;
        centroidY /= screenPoints.length;
        
        return (
          <React.Fragment key={measurement.id}>
            {/* Filled area with transparency */}
            <Path d={pathData} fill={color.main} opacity="0.15" />
            {/* Glow layers for outline */}
            <Path d={pathData} stroke={color.glow} strokeWidth="12" opacity="0.15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={pathData} stroke={color.glow} strokeWidth="8" opacity="0.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Main outline */}
            <Path d={pathData} stroke={color.main} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Corner markers */}
            {screenPoints.map((point, i) => (
              <React.Fragment key={`corner-${i}`}>
                <Circle cx={point.x} cy={point.y} r="6" fill={color.glow} opacity="0.05" />
                <Circle cx={point.x} cy={point.y} r="5" fill={color.glow} opacity="0.075" />
                <Circle cx={point.x} cy={point.y} r="4" fill={color.main} opacity="0.05" />
                <Circle cx={point.x} cy={point.y} r="3" fill={color.main} opacity="0.1" />
                <Circle cx={point.x} cy={point.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      }
      return null;
    });
  }, [measurements, zoomScale, zoomTranslateX, zoomTranslateY, zoomRotation, hideMeasurementsForCapture, isMapMode]);

  return (
    <View 
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents={showBlueprintPlacementModal ? "box-none" : "auto"}
    >
      {/* Universal Touch Overlay - Captures ALL touches for fingerprints */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
        pointerEvents="box-none"
        onStartShouldSetResponder={() => true}
        onResponderGrant={(event) => {
          const { pageX, pageY } = event.nativeEvent;
          const pressure = event.nativeEvent.force || 0.5;
          
          // Create fingerprint at touch location with session color
          setFingerTouches([{ 
            x: pageX, 
            y: pageY, 
            id: `universal-touch-${Date.now()}`,
            pressure: pressure,
            seed: Math.random()
          }]);
          
          fingerOpacity.value = withTiming(1, { duration: 150 });
          fingerScale.value = 1;
          fingerRotation.value = 0;
        }}
        onResponderRelease={() => {
          // Fade out fingerprint
          fingerOpacity.value = withTiming(0, { 
            duration: 800, 
            easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
          });
          fingerScale.value = withTiming(1.5, { 
            duration: 800, 
            easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
          });
          fingerRotation.value = withTiming(15, { 
            duration: 800, 
            easing: Easing.bezier(0.4, 0.6, 0.2, 1) 
          });
        }}
      />
      
      {/* Persistent "Calibration Locked" indicator */}
      {(coinCircle || calibration || mapScale) && !showLockedInAnimation && (
        <Pressable
          onPress={handleCalibratedTap}
          style={{
            position: 'absolute',
            zIndex: 20,
            top: isAutoCaptured ? insets.top + 50 : insets.top + 16,
            right: 16,
            backgroundColor: stepBrothersMode ? 'rgba(59, 130, 246, 0.95)' : 'rgba(76, 175, 80, 0.9)', // Softer Material Design green
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={stepBrothersMode ? "thumbs-up" : "checkmark-circle"} size={scaleIconSize(16)} color="white" />
            <Text style={{ color: 'white', fontSize: scaleFontSize(12), fontWeight: '600', marginLeft: scaleMargin(4) }}>
              {stepBrothersMode ? "YEP!" : "Calibrated"}
            </Text>
          </View>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: scaleFontSize(9),
            fontWeight: '500',
            marginTop: scaleMargin(2)
          }}>
            {stepBrothersMode
              ? "Best friends? 🤝"
              : calibration?.calibrationType === 'blueprint' && calibration.blueprintScale
              ? `${calibration.blueprintScale.distance}${calibration.blueprintScale.unit} between points`
              : calibration?.calibrationType === 'verbal' && calibration.verbalScale
              ? `${calibration.verbalScale.screenDistance}${calibration.verbalScale.screenUnit} = ${calibration.verbalScale.realDistance}${calibration.verbalScale.realUnit}`
              : mapScale && !coinCircle
              ? `${mapScale.screenDistance}${mapScale.screenUnit} = ${mapScale.realDistance}${mapScale.realUnit}`
              : coinCircle
              ? `${coinCircle.coinName} • ${coinCircle.coinDiameter.toFixed(1)}mm`
              : 'Calibrated'
            }
          </Text>
          {/* Show "Verbal scale" and "Locked in" when map scale is locked in (regardless of current mode) */}
          {!stepBrothersMode && mapScale && coinCircle && (
            <View style={{ marginTop: scaleMargin(4), alignItems: 'center' }}>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: scaleFontSize(8),
                fontWeight: '600',
                letterSpacing: 0.3
              }}>
                Verbal scale
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: scaleFontSize(9),
                fontWeight: '700',
                letterSpacing: 0.2,
                marginTop: scaleMargin(1)
              }}>
                {mapScale.screenDistance}{mapScale.screenUnit} = {mapScale.realDistance}{mapScale.realUnit}
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: scaleFontSize(8),
                fontWeight: '600',
                letterSpacing: 0.3,
                marginTop: scaleMargin(1)
              }}>
                Locked in
              </Text>
            </View>
          )}
        </Pressable>
      )}
      
      {/* Recalibrate button - appears below calibration badge when there's any calibration */}
      {(coinCircle || calibration || mapScale) && !showLockedInAnimation && !isCapturing && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            // BLUEPRINT MODE: Reopen pin placement, keep measurements, recalculate with new calibration
            if (calibration?.calibrationType === 'blueprint') {
              console.log('📍 Recalibrating blueprint mode - keeping measurements');
              
              // CRITICAL: Lock pan/zoom if there are measurements to prevent them from appearing to move
              // (measurements are stored in image coords, but displayed in screen coords that change with pan/zoom)
              // If no measurements exist, allow pan/zoom for easier pin placement
              const shouldLockPanZoom = measurements.length > 0;
              if (shouldLockPanZoom) {
                console.log('🔒 Locking pan/zoom - measurements exist and would appear to move');
              } else {
                console.log('🔓 Allowing pan/zoom - no measurements to worry about');
              }
              
              // Notify parent to lock/unlock pan/zoom
              if (onPanZoomLockChange) {
                onPanZoomLockChange(shouldLockPanZoom);
              }
              
              // DON'T clear calibration yet - keep it so measurements display correctly
              // It will be replaced when new calibration is set
              // setCalibration(null); // REMOVED - keep old calibration until new one is ready
              setBlueprintPoints([]);
              // Reset measurement states
              setMeasurementMode(false);
              setIsPlacingBlueprint(false); // Not placing yet - just showing modal
              setMenuHidden(true); // Hide menu when modal appears
              
              // Small delay to ensure pan/zoom gestures remain responsive
              setTimeout(() => {
                setShowBlueprintPlacementModal(true);
              }, 150);
              
              // Measurements stay intact - will be recalculated when new pins placed
              return;
            }
            
            // Scenario 1: Map scale ONLY (no coin, no other calibration)
            // Reset map scale and reopen map scale modal (stay in measurement screen)
            if (mapScale && !calibration && !coinCircle) {
              console.log('📍 Recalibrating: Map scale only');
              setMapScale(null);
              setIsMapMode(false);
              setShowMapScaleModal(true);
            }
            // Scenario 2: Map scale + Verbal calibration
            // Reset map scale, reopen map modal (keep verbal as base calibration)
            else if (mapScale && calibration?.calibrationType === 'verbal') {
              console.log('📍 Recalibrating: Map scale with verbal base');
              setMapScale(null);
              setIsMapMode(false);
              setShowMapScaleModal(true);
            }
            // Scenario 3: Map scale + Coin calibration
            // User likely wants to recalibrate the coin, so go back to coin screen
            else if (mapScale && coinCircle) {
              console.log('📍 Recalibrating: Map scale with coin base - returning to coin screen');
              setMapScale(null);
              setIsMapMode(false);
              if (onReset) onReset(true); // Go to coin calibration screen
            }
            // Scenario 4: Coin calibration ONLY (no map scale)
            // Go back to coin calibration screen
            else if (coinCircle) {
              console.log('📍 Recalibrating: Coin only - returning to coin screen');
              if (onReset) onReset(true);
            }
            // Scenario 5: Verbal calibration ONLY (no map scale)
            // Go back to camera to retake photo (verbal modal is in MeasurementScreen)
            else if (calibration?.calibrationType === 'verbal') {
              console.log('📍 Recalibrating: Verbal only - returning to camera');
              if (onReset) onReset(false); // Go back to camera
            }
            // Fallback: Unknown state, go to coin screen
            else {
              console.log('📍 Recalibrating: Unknown state - returning to coin screen');
              if (onReset) onReset(true);
            }
          }}
          style={{
            position: 'absolute',
            zIndex: 20,
            top: mapScale 
              ? (isAutoCaptured ? insets.top + 50 + 95 : insets.top + 16 + 95)  // Extra space for map scale info (shown even when not in map mode)
              : (isAutoCaptured ? insets.top + 50 + 60 : insets.top + 16 + 60),   // Normal spacing
            right: 16,
            backgroundColor: 'rgba(239, 68, 68, 0.9)', // Red color for reset action
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 8,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="refresh-outline" size={scaleIconSize(14)} color="white" />
            <Text style={{ color: 'white', fontSize: scaleFontSize(11), fontWeight: '600', marginLeft: scaleMargin(4) }}>
              Recalibrate
            </Text>
          </View>
        </Pressable>
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
                width: scaleSize(44),
                height: scaleSize(80),
                backgroundColor: sessionColor ? sessionColor.main : 'rgba(128, 128, 128, 0.5)',
                borderTopLeftRadius: tabSide === 'right' ? scaleBorderRadius(16) : 0,
                borderBottomLeftRadius: tabSide === 'right' ? scaleBorderRadius(16) : 0,
                borderTopRightRadius: tabSide === 'left' ? scaleBorderRadius(16) : 0,
                borderBottomRightRadius: tabSide === 'left' ? scaleBorderRadius(16) : 0,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: sessionColor ? sessionColor.main : '#000',
                shadowOffset: { width: tabSide === 'right' ? scaleSize(-2) : scaleSize(2), height: 0 },
                shadowOpacity: sessionColor ? 0.4 : 0.1,
                shadowRadius: sessionColor ? scaleSize(8) : scaleSize(4),
                elevation: 4,
                borderWidth: scaleSize(1),
                borderColor: sessionColor ? 'rgba(255, 255, 255, 0.3)' : 'rgba(128, 128, 128, 0.3)',
                [tabSide === 'right' ? 'borderRightWidth' : 'borderLeftWidth']: 0,
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name={tabSide === 'right' ? 'chevron-back' : 'chevron-forward'}
                  size={scaleIconSize(20)}
                  color="rgba(255, 255, 255, 0.8)"
                />
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
            
            // CHECK: If in map mode without calibration, show alert
            console.log('🔍 Touch check:', { isMapMode, hasMapScale: !!mapScale });
            if (isMapMode && !mapScale) {
              console.log('⚠️ Blocking measurement - no map scale set');
              // Triple haptic warning to make it VERY obvious
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              scheduleHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 100);
              scheduleHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 200);
              showAlert(
                'Set Map Scale First',
                'Tap the Map button in the menu to set your map scale before measuring.',
                'warning'
              );
              return; // Prevent any measurement placement
            }
            
            // Track finger touch for visual indicator with random seed and pressure
            const pressure = event.nativeEvent.force || 0.5; // Default to 0.5 if force not available
            setFingerTouches([{ 
              x: pageX, 
              y: pageY, 
              id: 'touch-0',
              pressure: pressure,
              seed: Math.random()
            }]);
            fingerOpacity.value = withTiming(1, { duration: 150 });
            fingerScale.value = 1;
            fingerRotation.value = 0;
            
            // For freehand mode, start activation timer (1.5 seconds)
            if (mode === 'freehand') {
              setFreehandActivating(true);
              setShowFreehandCursor(true);
              
              // Gradient horizontal offset for cursor positioning
              const distanceFromCenter = pageX - (SCREEN_WIDTH / 2);
              const normalizedPosition = distanceFromCenter / (SCREEN_WIDTH / 2);
              const maxOffset = 30;
              const horizontalOffset = normalizedPosition * maxOffset;
              const rawCursorX = pageX + horizontalOffset;
              const rawCursorY = pageY - cursorOffsetY;
              
              setCursorPosition({ x: rawCursorX, y: rawCursorY });
              
              // Start activation timer (1.5 seconds)
              if (freehandActivationTimerRef.current) {
                clearTimeout(freehandActivationTimerRef.current);
              }

              // 🌟 Samus Charge Beam - Progressive power build-up (RESTORED!)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);  // 0.0s - Initial press
              scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 300);   // 0.3s
              scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 600);  // 0.6s
              scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 900);  // 0.9s
              scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1200);  // 1.2s

              freehandActivationTimerRef.current = setTimeout(() => {
                // 1.5s - FULLY CHARGED! Ready to fire! 🔥
                setIsDrawingFreehand(true);
                setFreehandActivating(false);
                
                // LOCK zoom/pan/rotation state to prevent coordinate drift during drawing
                freehandZoomLockRef.current = {
                  scale: zoomScale,
                  translateX: zoomTranslateX,
                  translateY: zoomTranslateY,
                  rotation: zoomRotation,
                };
                console.log('🔒 Locked zoom state:', freehandZoomLockRef.current);
                
                // Powerful "weapon charged" haptic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                console.log('🎨 Freehand drawing activated!');
              }, 1500);
              return; // Skip normal cursor logic for freehand
            }
            
            // Normal cursor logic for other modes...
            // Gradient horizontal offset: crosshair leans in direction of movement
            // At center: 0 offset
            // Moving left: crosshair shifts left (negative)
            // Moving right: crosshair shifts right (positive)
            const distanceFromCenter = pageX - (SCREEN_WIDTH / 2);
            const normalizedPosition = distanceFromCenter / (SCREEN_WIDTH / 2); // -1 (left) to +1 (right)
            const maxOffset = 30;
            const horizontalOffset = normalizedPosition * maxOffset; // Positive = right, Negative = left
            
            // Calculate raw cursor position
            const rawCursorX = pageX + horizontalOffset;
            const rawCursorY = pageY - cursorOffsetY;
            
            // Apply point snapping FIRST (highest priority), then alignment snapping
            const pointSnapped = snapToNearbyPoint(rawCursorX, rawCursorY);
            const finalPosition = pointSnapped.snapped 
              ? pointSnapped 
              : snapCursorToAlignment(rawCursorX, rawCursorY);
            
            setShowCursor(true);
            setCursorPosition({ x: finalPosition.x, y: finalPosition.y });
            setIsSnapped(finalPosition.snapped);
            setLastHapticPosition({ x: pageX, y: pageY });
            
            // Haptic for activation
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onResponderMove={(event) => {
            try {
              // CACHE BUST v2: Extra safe touch handling
              const touch = event?.nativeEvent?.touches?.[0];
              if (!touch) return;
              
              const { pageX, pageY } = touch;
              
              // Update finger touch positions for all touches with pressure and random seeds
              const nativeTouches = event?.nativeEvent?.touches;
              const touches = nativeTouches && Array.isArray(nativeTouches) 
                ? Array.from(nativeTouches).map((t: any, idx: number) => ({
                    x: t.pageX || 0,
                    y: t.pageY || 0,
                    id: `touch-${idx}`,
                    pressure: t.force || 0.5,
                    seed: Math.random()
                  }))
                : [];
              setFingerTouches(touches);
              
              // Handle freehand drawing mode
              if (mode === 'freehand') {
                // Update cursor position with offset (above finger)
                const distanceFromCenter = pageX - (SCREEN_WIDTH / 2);
                const normalizedPosition = distanceFromCenter / (SCREEN_WIDTH / 2);
                const maxOffset = 30;
                const horizontalOffset = normalizedPosition * maxOffset;
                const rawCursorX = pageX + horizontalOffset;
                const rawCursorY = pageY - cursorOffsetY;
                
                // Calculate speed for freehand cursor
                const now = Date.now();
                const deltaTime = now - lastCursorUpdateRef.current.time;
                const deltaX = rawCursorX - lastCursorUpdateRef.current.x;
                const deltaY = rawCursorY - lastCursorUpdateRef.current.y;
                const cursorDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const cursorMoveSpeed = deltaTime > 0 ? cursorDistance / deltaTime : 0;
                
                lastCursorUpdateRef.current = { x: rawCursorX, y: rawCursorY, time: now };
                setCursorSpeed(cursorMoveSpeed);
                setCursorPosition({ x: rawCursorX, y: rawCursorY });
                
                // Handle speed-based activation control with hysteresis
                if (freehandActivating) {
                  // Hysteresis: Different thresholds for starting/stopping warning
                  const speedThresholdHigh = 0.3; // Show warning when speed exceeds this
                  const speedThresholdLow = 0.15; // Hide warning when speed drops below this
                  
                  // Update warning state with hysteresis
                  if (!isShowingSpeedWarning && cursorMoveSpeed > speedThresholdHigh) {
                    setIsShowingSpeedWarning(true);
                  } else if (isShowingSpeedWarning && cursorMoveSpeed < speedThresholdLow) {
                    setIsShowingSpeedWarning(false);
                  }
                  
                  // Cancel timer if moving too fast
                  if (cursorMoveSpeed > speedThresholdHigh) {
                    if (freehandActivationTimerRef.current) {
                      clearTimeout(freehandActivationTimerRef.current);
                      freehandActivationTimerRef.current = null;
                    }
                  } 
                  // Restart timer if slowed down and timer isn't already running
                  else if (!freehandActivationTimerRef.current) {
                    // Restart the 1.5s timer
                    freehandActivationTimerRef.current = setTimeout(() => {
                      setIsDrawingFreehand(true);
                      setFreehandActivating(false);
                      setIsShowingSpeedWarning(false);
                      
                      // LOCK zoom/pan/rotation state
                      freehandZoomLockRef.current = {
                        scale: zoomScale,
                        translateX: zoomTranslateX,
                        translateY: zoomTranslateY,
                        rotation: zoomRotation,
                      };
                      
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      console.log('🎨 Freehand drawing activated after slowing down!');
                    }, 1500);
                  }
                }
                
                // If already drawing, add points to path
                // IMPORTANT: Use cursor position (rawCursorX, rawCursorY), not finger position (pageX, pageY)
                if (isDrawingFreehand) {
                  // Use locked zoom state to prevent coordinate drift from zoom changes during drawing
                  const lockedZoom = freehandZoomLockRef.current || { scale: zoomScale, translateX: zoomTranslateX, translateY: zoomTranslateY, rotation: zoomRotation };
                  const imageX = (rawCursorX - lockedZoom.translateX) / lockedZoom.scale;
                  const imageY = (rawCursorY - lockedZoom.translateY) / lockedZoom.scale;
                  
                  // Only add point if it's far enough from the last point (smooth path)
                  // Use functional update to ensure we have the latest state
                  setFreehandPath(prevPath => {
                    if (prevPath.length === 0) {
                      // FIRST POINT: No snapping to existing measurements
                      // Freehand draws freely - user can manually start at a point if needed
                      return [{ x: imageX, y: imageY }];
                    }
                    
                    const lastPoint = prevPath[prevPath.length - 1];
                    const distance = Math.sqrt(
                      Math.pow(imageX - lastPoint.x, 2) +
                      Math.pow(imageY - lastPoint.y, 2)
                    );
                    
                    // Minimum distance: 0.5 image pixels for smooth, fluid lines
                    if (distance > 0.5) {
                      // LASSO SNAP: Check if we're close to the starting point (to close the loop)
                      // Need MANY points before allowing snap - prevents accidental tiny loops
                      if (prevPath.length >= 30) { // 30 points = meaningful path before allowing closure
                        const firstPoint = prevPath[0];
                        const distToStart = Math.sqrt(
                          Math.pow(imageX - firstPoint.x, 2) + Math.pow(imageY - firstPoint.y, 2)
                        );
                        
                        // Snap threshold: Use PIXELS for universal, scale-independent behavior
                        // 8 pixels = very tight, deliberate closure (half of 15px)
                        const snapThresholdPixels = 8; // Requires precise aim at starting point
                        
                        if (distToStart < snapThresholdPixels) {
                          // Check if path self-intersects - if it does, DON'T snap (allow free drawing)
                          const testPath = [...prevPath, { x: firstPoint.x, y: firstPoint.y }];
                          const selfIntersects = doesPathSelfIntersect(testPath);
                          
                          if (!selfIntersects) {
                            console.log('🎯 LASSO SNAP! Closing loop at', distToStart.toFixed(1), 'pixels from start');
                            // Strong haptic feedback for successful lasso close
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setFreehandClosedLoop(true);
                            freehandClosedLoopRef.current = true; // Update ref synchronously
                            // Snap to exact start point to close the loop
                            return [...prevPath, { x: firstPoint.x, y: firstPoint.y }];
                          } else {
                            console.log('⚠️ Path self-intersects - NOT snapping to start point (allowing free drawing)');
                            // Continue drawing normally without snapping
                            return [...prevPath, { x: imageX, y: imageY }];
                          }
                        }
                      }
                      
                      // No snapping to other measurements - freehand draws freely
                      return [...prevPath, { x: imageX, y: imageY }];
                    }
                    
                    return prevPath;
                  });
                }
                
                return; // Skip normal cursor logic for freehand
              }
              
              // Normal cursor logic for other modes...
              // Gradient horizontal offset: crosshair leans in direction of movement
              // At center: 0 offset
              // Moving left: crosshair shifts left (negative)
              // Moving right: crosshair shifts right (positive)
              const distanceFromCenter = pageX - (SCREEN_WIDTH / 2);
              const normalizedPosition = distanceFromCenter / (SCREEN_WIDTH / 2); // -1 (left) to +1 (right)
              const maxOffset = 30;
              const horizontalOffset = normalizedPosition * maxOffset; // Positive = right, Negative = left
              
              // Calculate raw cursor position
              const rawCursorX = pageX + horizontalOffset;
              const rawCursorY = pageY - cursorOffsetY;
              
              // Apply point snapping FIRST (highest priority - magnetic snap to existing points)
              const pointSnapped = snapToNearbyPoint(rawCursorX, rawCursorY);
              
              // If not snapped to a point, try horizontal/vertical alignment snapping
              const finalPosition = pointSnapped.snapped 
                ? pointSnapped 
                : snapCursorToAlignment(rawCursorX, rawCursorY);
              
              // Update cursor with final snapped position AND calculate speed
              const now = Date.now();
              const deltaTime = now - lastCursorUpdateRef.current.time;
              const deltaX = finalPosition.x - lastCursorUpdateRef.current.x;
              const deltaY = finalPosition.y - lastCursorUpdateRef.current.y;
              const cursorDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              const cursorMoveSpeed = deltaTime > 0 ? cursorDistance / deltaTime : 0; // pixels per millisecond
              
              lastCursorUpdateRef.current = { x: finalPosition.x, y: finalPosition.y, time: now };
              setCursorSpeed(cursorMoveSpeed);
              setCursorPosition({ x: finalPosition.x, y: finalPosition.y });
              
              // Haptic feedback when snapping occurs
              if (finalPosition.snapped && !isSnapped) {
                // Just entered snap zone - medium haptic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsSnapped(true);
              } else if (!finalPosition.snapped && isSnapped) {
                // Just left snap zone - light haptic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsSnapped(false);
              }
              
              // Adaptive haptic feedback based on movement speed
              const distance = Math.sqrt(
                Math.pow(pageX - lastHapticPosition.x, 2) + 
                Math.pow(pageY - lastHapticPosition.y, 2)
              );
              
              const currentTime = Date.now();
              const timeDelta = currentTime - lastHapticTime;
              
              // Calculate speed (pixels per millisecond)
              const speed = distance / Math.max(timeDelta, 1);
              
              // Dynamic haptic distance based on speed:
              // - Fast movements: larger distance between haptics (slow tick...tick...tick)
              // - Slow movements: smaller distance between haptics (fast tickticktick)
              let dynamicHapticDistance;
              if (speed < 0.3) {
                // Very slow/precise - frequent ticks
                dynamicHapticDistance = 2;  // tick tick tick tick tick
              } else if (speed < 0.8) {
                // Medium slow - moderate ticks
                dynamicHapticDistance = 5;  // tick tick tick
              } else if (speed < 2) {
                // Medium fast - slower ticks
                dynamicHapticDistance = 15; // tick...tick...tick
              } else {
                // Very fast - very slow ticks
                dynamicHapticDistance = 30; // tick.....tick.....tick
              }
              
              if (distance >= dynamicHapticDistance) {
                // Use light haptic for all movement feedback
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                
                setLastHapticPosition({ x: pageX, y: pageY });
                setLastHapticTime(currentTime);
              }
            } catch (error) {
              // Silently handle any touch errors to prevent crashes
              console.warn('Touch handling error:', error);
            }
          }}
          onResponderRelease={() => {
            console.log('✅ Touch released');
            
            // Reset snap state
            setIsSnapped(false);
            
            // Handle freehand mode
            if (mode === 'freehand') {
              // Cancel activation timer if they released early
              if (freehandActivationTimerRef.current) {
                clearTimeout(freehandActivationTimerRef.current);
                freehandActivationTimerRef.current = null;
              }
              
              // If they were just waiting (not drawing yet), reset
              if (freehandActivating && !isDrawingFreehand) {
                setFreehandActivating(false);
                setShowFreehandCursor(false);
                setFreehandPath([]); // IMPORTANT: Clear any points that might have been captured
                console.log('⚠️ Freehand activation cancelled (released too early)');
                
                // Continue to evaporation effect
              } else if (isDrawingFreehand && freehandPath.length >= 2) {
                // If they were drawing, complete the measurement (require at least 2 points for a line)
                // Use ref instead of state to avoid async state issues
                const isClosedLoop = freehandClosedLoopRef.current;
                console.log('🎨 Freehand path points captured:', freehandPath.length, 'Closed loop:', isClosedLoop);
                
                // Calculate total path length (perimeter)
                let totalLength = 0;
                for (let i = 1; i < freehandPath.length; i++) {
                  const dx = freehandPath[i].x - freehandPath[i - 1].x;
                  const dy = freehandPath[i].y - freehandPath[i - 1].y;
                  totalLength += Math.sqrt(dx * dx + dy * dy);
                }
                
                // Convert to physical units
                const pixelsPerUnit = calibration?.pixelsPerUnit || 1;
                const physicalLength = totalLength / pixelsPerUnit;
                
                // Check if path self-intersects
                const selfIntersects = doesPathSelfIntersect(freehandPath);
                console.log('🔍 Self-intersection check:', selfIntersects);
                console.log('🔍 Closed loop state:', isClosedLoop);
                console.log('🔍 Path length:', freehandPath.length);
                
                // Calculate area only if loop is closed AND doesn't self-intersect
                let area = 0;
                if (isClosedLoop && !selfIntersects && freehandPath.length >= 3) {
                  console.log('✅ Conditions met for area calculation!');
                  
                  // Shoelace formula for polygon area
                  for (let i = 0; i < freehandPath.length - 1; i++) {
                    area += freehandPath[i].x * freehandPath[i + 1].y;
                    area -= freehandPath[i + 1].x * freehandPath[i].y;
                  }
                  area = Math.abs(area) / 2;
                  
                  console.log('📐 Raw area in pixels²:', area.toFixed(2));
                  
                  // Convert from pixel² to physical units²
                  const physicalArea = area / (pixelsPerUnit * pixelsPerUnit);
                  
                  console.log('📐 Physical area:', physicalArea.toFixed(2), 'square units');
                  console.log('📐 Calibration unit:', calibration?.unit);
                  console.log('📐 Unit system:', unitSystem);
                  
                  // Format measurement with both perimeter and area
                  let perimeterStr: string;
                  let areaStr: string;
                  
                  // Map Mode: Apply scale conversion
                  if (isMapMode && mapScale) {
                    // Convert perimeter to map scale
                    const totalPixelLength = freehandPath.reduce((sum, point, i) => {
                      if (i === freehandPath.length - 1) return sum;
                      const next = freehandPath[i + 1];
                      return sum + Math.sqrt(Math.pow(next.x - point.x, 2) + Math.pow(next.y - point.y, 2));
                    }, 0);
                    perimeterStr = formatMapScaleDistance(totalPixelLength);
                    
                    // Convert area to map scale
                    // Get a linear pixel measurement to establish scale ratio
                    const samplePixelLength = Math.sqrt(area); // approximate side length
                    const sampleMapLength = convertToMapScale(samplePixelLength);
                    // Area scales by the square of linear scale
                    const scaleRatio = sampleMapLength / samplePixelLength;
                    const areaDist2 = area * (scaleRatio * scaleRatio);
                    areaStr = formatMapScaleArea(areaDist2);
                  } else {
                    perimeterStr = formatMeasurement(physicalLength, calibration?.unit || 'mm', unitSystem);
                    areaStr = formatAreaMeasurement(physicalArea, calibration?.unit || 'mm', unitSystem);
                  }
                  
                  const formattedValue = `${perimeterStr} ⊞ ${areaStr}`;
                  
                  console.log('📐 Formatted perimeter:', perimeterStr);
                  console.log('📐 Formatted area:', areaStr);
                  console.log('📐 Final value string:', formattedValue);
                  
                  // Create completed measurement with area
                  const newMeasurement: Measurement = {
                    id: Date.now().toString(),
                    points: [...freehandPath],
                    value: formattedValue, // Full display with area (for legend)
                    perimeter: perimeterStr, // Just perimeter (for inline label)
                    mode: 'freehand',
                    area: physicalArea, // Store raw area value
                    isClosed: true, // Mark as closed loop
                    calibrationMode: isMapMode ? 'map' : 'coin', // Store which calibration was used
                    ...(isMapMode && mapScale && { mapScaleData: mapScale }), // Store map scale data if in map mode
                  };
                  
                  console.log('📐 Created measurement:', JSON.stringify(newMeasurement, null, 2));
                  
                  setMeasurements([...measurements, newMeasurement]);
                  
                  // Increment freehand trial counter if not Pro
                  if (!isProUser && freehandTrialUsed < freehandTrialLimit) {
                    incrementFreehandTrial();
                  }
                } else {
                  console.log('⚠️ Area calculation skipped - conditions not met:', {
                    isClosedLoop,
                    selfIntersects,
                    pathLength: freehandPath.length,
                  });
                  
                  // Open path OR self-intersecting - just show length
                  let formattedValue: string;
                  
                  // Map Mode: Apply scale conversion
                  if (isMapMode && mapScale) {
                    formattedValue = formatMapScaleDistance(totalLength);
                  } else {
                    formattedValue = formatMeasurement(physicalLength, calibration?.unit || 'mm', unitSystem);
                  }
                  
                  const newMeasurement: Measurement = {
                    id: Date.now().toString(),
                    points: [...freehandPath],
                    value: formattedValue,
                    mode: 'freehand',
                    isClosed: isClosedLoop, // Still mark as closed even if self-intersecting
                    calibrationMode: isMapMode ? 'map' : 'coin', // Store which calibration was used
                    ...(isMapMode && mapScale && { mapScaleData: mapScale }), // Store map scale data if in map mode
                  };
                  
                  setMeasurements([...measurements, newMeasurement]);
                  
                  // Increment freehand trial counter if not Pro
                  if (!isProUser && freehandTrialUsed < freehandTrialLimit) {
                    incrementFreehandTrial();
                  }
                  
                  // Log reason for no area
                  if (isClosedLoop && selfIntersects) {
                    console.log('⚠️ Closed loop detected, but path self-intersects - area calculation skipped');
                  }
                }
                
                console.log('🎨 Creating freehand measurement with', freehandPath.length, 'points');
                
                // Reset freehand state
                setFreehandPath([]);
                setIsDrawingFreehand(false);
                setShowFreehandCursor(false);
                setFreehandActivating(false);
                setFreehandClosedLoop(false); // Reset closed loop state
                freehandClosedLoopRef.current = false; // Reset ref too
                freehandZoomLockRef.current = null; // Clear zoom lock
                console.log('🔓 Cleared zoom lock');
                // Success haptic
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                console.log('🎨 Freehand measurement completed with', freehandPath.length, 'points');
              } else if (isDrawingFreehand) {
                // Path too short, just reset
                console.log('⚠️ Path too short (', freehandPath.length, 'points), need at least 2 - discarding');
                setFreehandPath([]);
                setIsDrawingFreehand(false);
                setShowFreehandCursor(false);
                setFreehandActivating(false);
                freehandZoomLockRef.current = null; // Clear zoom lock
                console.log('🔓 Cleared zoom lock (path too short)');
              }
              
              // Evaporation effect for freehand mode - organic fade with slight expansion and dissipation
              // Like condensation evaporating from cold glass
              fingerOpacity.value = withTiming(0, { 
                duration: 450, // Fluid evaporation
                easing: Easing.bezier(0.4, 0.0, 0.6, 1) // Organic easing curve
              });
              
              // Slight expansion as it evaporates (like water spreading then disappearing)
              fingerScale.value = withTiming(1.3, { 
                duration: 450,
                easing: Easing.out(Easing.quad)
              });
              
              // Subtle random rotation for organic feel (±5 degrees)
              const randomRotation = (Math.random() - 0.5) * 10;
              fingerRotation.value = withTiming(randomRotation, { 
                duration: 450,
                easing: Easing.out(Easing.cubic)
              });
              
              // Clear fingerprints after evaporation completes
              setTimeout(() => {
                setFingerTouches([]);
                // Reset values for next touch
                fingerScale.value = 1;
                fingerRotation.value = 0;
              }, 500);
              
              // IMPORTANT: Return early for freehand mode to prevent placing a stray point
              // The freehand logic above completely handles the touch lifecycle
              return;
            }
            
            // Evaporation effect - organic fade with slight expansion and dissipation
            // Like condensation evaporating from cold glass
            fingerOpacity.value = withTiming(0, { 
              duration: 450, // Fluid evaporation
              easing: Easing.bezier(0.4, 0.0, 0.6, 1) // Organic easing curve
            });
            
            // Slight expansion as it evaporates (like water spreading then disappearing)
            fingerScale.value = withTiming(1.3, { 
              duration: 450,
              easing: Easing.out(Easing.quad)
            });
            
            // Subtle random rotation for organic feel (±5 degrees)
            const randomRotation = (Math.random() - 0.5) * 10;
            fingerRotation.value = withTiming(randomRotation, { 
              duration: 450,
              easing: Easing.out(Easing.cubic)
            });
            
            // Clear fingerprints after evaporation completes
            setTimeout(() => {
              setFingerTouches([]);
              // Reset values for next touch
              fingerScale.value = 1;
              fingerRotation.value = 0;
            }, 500);
            
            // Blueprint placement mode
            if (isPlacingBlueprint) {
              // Convert screen position to image coordinates for blueprint points
              const imageCoords = screenToImage(cursorPosition.x, cursorPosition.y);
              const newPoint = { x: imageCoords.x, y: imageCoords.y };
              const updatedPoints = [...blueprintPoints, newPoint];
              setBlueprintPoints(updatedPoints);
              
              // Haptic feedback
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              
              // If we've placed 2 points, show distance input modal
              if (updatedPoints.length === 2) {
                setIsPlacingBlueprint(false);
                setMeasurementMode(false);
                setShowCursor(false);
                setTimeout(() => {
                  setShowBlueprintDistanceModal(true);
                }, 100);
              }
              // After first point, keep cursor visible for second point
              // (cursor stays visible, just give haptic feedback)
            }
            // For circle mode
            else if (mode === 'circle') {
              if (currentPoints.length === 0) {
                // First tap: place center point
                placePoint(cursorPosition.x, cursorPosition.y);
                setShowCursor(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              } else if (currentPoints.length === 1) {
                // Second tap: place edge point, which will auto-complete the circle via placePoint
                placePoint(cursorPosition.x, cursorPosition.y);
                setShowCursor(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              }
            } else {
              // For other modes, place point normally
              placePoint(cursorPosition.x, cursorPosition.y);
              setShowCursor(false);
              
              // Heavy haptic for point placement
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          }}
        />
      )}

      {/* Tap detection overlay for selecting/deleting measurements - always active when not in measurement mode */}
      {/* CRITICAL: Don't block touches when blueprint modal is showing (user needs pan/zoom access) */}
      {!measurementMode && measurements.length > 0 && !showBlueprintPlacementModal && !isPlacingBlueprint && (
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={(event) => {
            // Only respond to move if we're dragging or resizing
            return draggedMeasurementId !== null || resizingPoint !== null;
          }}
          onResponderGrant={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            setDebugInfo({ lastTouch: Date.now(), interceptor: 'TAP_OVERLAY', mode: measurementMode ? 'MEASURE' : 'PAN' });
            
            // Check if tapping any measurement point first (distance, angle, circle, rectangle)
            const point = getTappedMeasurementPoint(pageX, pageY);
            if (point) {
              const measurement = measurements.find(m => m.id === point.measurementId);
              
              // Set selected measurement for context instructions
              setSelectedMeasurementId(point.measurementId);
              
              // Special case for circles: if tapping the center point (point 0) and the tap is
              // inside the circle area (not near the edge), treat it as a drag operation
              if (measurement && measurement.mode === 'circle' && point.pointIndex === 0) {
                const center = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const edge = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                const radius = Math.sqrt(
                  Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
                );
                const distFromCenter = Math.sqrt(
                  Math.pow(pageX - center.x, 2) + Math.pow(pageY - center.y, 2)
                );
                
                // If tap is inside the circle but not very close to center (> 20px from center),
                // treat as whole circle drag instead of point resize
                if (distFromCenter > 20 && distFromCenter < radius - 20) {
                  // This is a circle drag, not point resize - fall through to measurement tap logic
                } else {
                  // Near center or edge - allow point resize (expand/contract circle)
                  saveOriginalState(point.measurementId); // Save state before editing
                  setResizingPoint(point);
                  setDidDrag(false);
                  setIsSnapped(false);
                  dragStartPos.value = { x: pageX, y: pageY };
                  dragCurrentPos.value = { x: pageX, y: pageY };
                  
                  // Double-tap haptic feedback: tap...pause...tap (indicates expansion mode)
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }, 150); // 150ms pause between taps
                  
                  return;
                }
              } else if (measurement && measurement.mode === 'rectangle' && measurement.points.length === 4) {
                // For rectangles, check if tap is VERY close to the detected corner
                // and far from other corners to avoid accidental corner grabs
                const corners = measurement.points.map(p => imageToScreen(p.x, p.y));
                const tappedCorner = corners[point.pointIndex];
                const distToTappedCorner = Math.sqrt(
                  Math.pow(pageX - tappedCorner.x, 2) + Math.pow(pageY - tappedCorner.y, 2)
                );
                
                // Only resize corner if within 20px AND it's the closest corner
                if (distToTappedCorner < 20) {
                  // Check if this is the closest corner
                  let isClosestCorner = true;
                  for (let i = 0; i < corners.length; i++) {
                    if (i === point.pointIndex) continue;
                    const distToOther = Math.sqrt(
                      Math.pow(pageX - corners[i].x, 2) + Math.pow(pageY - corners[i].y, 2)
                    );
                    if (distToOther < distToTappedCorner) {
                      isClosestCorner = false;
                      break;
                    }
                  }
                  
                  if (isClosestCorner) {
                    // Very close to this corner and it's the closest - allow corner resize
                    saveOriginalState(point.measurementId); // Save state before editing
                    setResizingPoint(point);
                    setDidDrag(false);
                    setIsSnapped(false);
                    dragStartPos.value = { x: pageX, y: pageY };
                    dragCurrentPos.value = { x: pageX, y: pageY };
                    
                    // Double-tap haptic feedback: tap...pause...tap (indicates expansion mode)
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setTimeout(() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }, 150); // 150ms pause between taps
                    
                    return;
                  }
                }
                // Otherwise, fall through to treat as rectangle drag/tap
              } else {
                // Not a circle center or rectangle - normal point resize behavior (polygons/freehand)
                saveOriginalState(point.measurementId); // Save state before editing
                setResizingPoint(point);
                setDidDrag(false);
                setIsSnapped(false); // Reset snap state when starting to resize
                dragStartPos.value = { x: pageX, y: pageY };
                dragCurrentPos.value = { x: pageX, y: pageY };
                
                // Double-tap haptic feedback: tap...pause...tap (indicates expansion mode)
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setTimeout(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }, 150); // 150ms pause between taps
                
                return;
              }
            }
            
            // Check if tapping a measurement body (for dragging whole measurement)
            const tappedId = getTappedMeasurement(pageX, pageY);
            
            // Reset drag flag and states
            setDidDrag(false);
            setDraggedMeasurementId(null);
            setResizingPoint(null);
            
            if (tappedId) {
              // Store start position for potential drag
              dragStartPos.value = { x: pageX, y: pageY };
              dragCurrentPos.value = { x: pageX, y: pageY };
            } else {
              // Tapped empty space - no action needed
            }
          }}
          onResponderMove={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            
            // Handle point resizing/moving
            if (resizingPoint) {
              setDidDrag(true);
              
              // Check what type of measurement we're resizing
              const measurement = measurements.find(m => m.id === resizingPoint.measurementId);
              
              // Disable snapping for:
              // - Circle edge points (for smooth radius adjustment)
              // - Freehand paths (to preserve organic shapes and prevent distortion when crossing other measurements)
              const shouldCheckSnapping = !(
                (measurement?.mode === 'circle' && resizingPoint.pointIndex === 1) ||
                (measurement?.mode === 'freehand')
              );
              
              // Use raw position for smooth movement, only snap when actually close to a point
              let finalPosition = { x: pageX, y: pageY };
              let isCurrentlySnapped = false;
              
              if (shouldCheckSnapping) {
                const snappedPosition = snapToNearbyPoint(pageX, pageY, true);
                if (snappedPosition.snapped) {
                  finalPosition = snappedPosition;
                  isCurrentlySnapped = true;
                }
              }
              
              const imageCoords = screenToImage(finalPosition.x, finalPosition.y);
              
              // Haptic feedback only when snap state changes
              if (isCurrentlySnapped && !isSnapped) {
                // Entering snap - double haptic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).then(() => {
                  setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }, 50);
                });
                setIsSnapped(true);
              } else if (!isCurrentlySnapped && isSnapped) {
                // Leaving snap - single haptic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsSnapped(false);
              }
              
              const updatedMeasurements = measurements.map(m => {
                if (m.id === resizingPoint.measurementId) {
                  const newPoints = [...m.points];
                  
                  // Special case: moving circle center point - move both points to maintain radius
                  if (m.mode === 'circle' && resizingPoint.pointIndex === 0) {
                    const oldCenter = m.points[0];
                    const deltaX = imageCoords.x - oldCenter.x;
                    const deltaY = imageCoords.y - oldCenter.y;
                    
                    // Move both center and edge point by the same delta
                    newPoints[0] = imageCoords;
                    newPoints[1] = {
                      x: m.points[1].x + deltaX,
                      y: m.points[1].y + deltaY
                    };
                    
                    // Value stays the same (radius unchanged) - just update points
                    return {
                      ...m,
                      points: newPoints,
                    };
                  }
                  
                  // Special case: moving rectangle corner - update adjacent corners to maintain axis-aligned rectangle
                  // IMPORTANT: Only apply to actual rectangles, NOT freehand paths
                  if (m.mode === 'rectangle' && m.points.length === 4) {
                    // Rectangle corners: 0=top-left, 1=top-right, 2=bottom-right, 3=bottom-left
                    // Update adjacent corners to maintain axis alignment
                    const movedIdx = resizingPoint.pointIndex;
                    
                    // Update the dragged corner
                    newPoints[movedIdx] = imageCoords;
                    
                    if (movedIdx === 0) {
                      // Moving top-left: update top-right's Y and bottom-left's X
                      newPoints[1] = { ...m.points[1], y: imageCoords.y };
                      newPoints[3] = { ...m.points[3], x: imageCoords.x };
                    } else if (movedIdx === 1) {
                      // Moving top-right: update top-left's Y and bottom-right's X
                      newPoints[0] = { ...m.points[0], y: imageCoords.y };
                      newPoints[2] = { ...m.points[2], x: imageCoords.x };
                    } else if (movedIdx === 2) {
                      // Moving bottom-right: update bottom-left's Y and top-right's X
                      newPoints[3] = { ...m.points[3], y: imageCoords.y };
                      newPoints[1] = { ...m.points[1], x: imageCoords.x };
                    } else if (movedIdx === 3) {
                      // Moving bottom-left: update bottom-right's Y and top-left's X
                      newPoints[2] = { ...m.points[2], y: imageCoords.y };
                      newPoints[0] = { ...m.points[0], x: imageCoords.x };
                    }
                    
                    return {
                      ...m,
                      points: newPoints,
                    };
                  }
                  
                  // Normal point movement - update points immediately, skip expensive calculations
                  // Value will be recalculated on release for better performance
                  // This applies to: distance, angle, freehand, and any other measurement types
                  
                  // Special smoothing for freehand paths - make reshaping more fluid and organic
                  if (m.mode === 'freehand' && m.points.length > 3) {
                    const draggedIdx = resizingPoint.pointIndex;
                    newPoints[draggedIdx] = imageCoords;
                    
                    // If this is a closed loop and we're moving the first or last point, sync them
                    if (m.isClosed) {
                      if (draggedIdx === 0) {
                        // Moving first point - update last point to match
                        newPoints[newPoints.length - 1] = imageCoords;
                      } else if (draggedIdx === newPoints.length - 1) {
                        // Moving last point - update first point to match
                        newPoints[0] = imageCoords;
                      }
                    }
                    
                    // Calculate influence radius (how many neighboring points to smooth)
                    const influenceRadius = 2; // Affect 2 points on each side
                    
                    // Smooth neighboring points for organic curve reshaping
                    for (let i = 1; i <= influenceRadius; i++) {
                      // Smooth points BEFORE the dragged point
                      const beforeIdx = draggedIdx - i;
                      if (beforeIdx >= 0 && !(m.isClosed && beforeIdx === newPoints.length - 1)) {
                        const weight = 1 - (i / (influenceRadius + 1)); // Decreasing influence (0.67, 0.33)
                        const originalPoint = m.points[beforeIdx];
                        newPoints[beforeIdx] = {
                          x: originalPoint.x + (imageCoords.x - m.points[draggedIdx].x) * weight,
                          y: originalPoint.y + (imageCoords.y - m.points[draggedIdx].y) * weight,
                        };
                      }
                      
                      // Smooth points AFTER the dragged point
                      const afterIdx = draggedIdx + i;
                      if (afterIdx < m.points.length && !(m.isClosed && afterIdx === newPoints.length - 1)) {
                        const weight = 1 - (i / (influenceRadius + 1)); // Decreasing influence
                        const originalPoint = m.points[afterIdx];
                        newPoints[afterIdx] = {
                          x: originalPoint.x + (imageCoords.x - m.points[draggedIdx].x) * weight,
                          y: originalPoint.y + (imageCoords.y - m.points[draggedIdx].y) * weight,
                        };
                      }
                    }
                  } else {
                    // For non-freehand measurements, just update the single point
                    newPoints[resizingPoint.pointIndex] = imageCoords;
                  }
                  
                  return {
                    ...m,
                    points: newPoints,
                  };
                }
                return m;
              });
              
              setMeasurements(updatedMeasurements.map(m => 
                m.id === resizingPoint.measurementId ? recalculateMeasurement(m) : m
              ));
              
              // Reduced haptic feedback - only if not snapping and movement is significant
              // This prevents jittery feeling from too many haptics
              return;
            }
            
            // Check if user moved enough to start dragging
            const dragDistance = Math.sqrt(
              Math.pow(pageX - dragStartPos.value.x, 2) +
              Math.pow(pageY - dragStartPos.value.y, 2)
            );
            
            // Start dragging if moved > 10px and not already dragging
            if (dragDistance > 10 && !draggedMeasurementId) {
              const tappedId = getTappedMeasurement(dragStartPos.value.x, dragStartPos.value.y);
              if (tappedId) {
                const measurement = measurements.find(m => m.id === tappedId);
                // Allow dragging for circles and rectangles, but NOT freehand (freehand can only be reshaped by points)
                if (measurement && (measurement.mode === 'circle' || measurement.mode === 'rectangle')) {
                  saveOriginalState(tappedId); // Save state before dragging
                  setDraggedMeasurementId(tappedId);
                  setDidDrag(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }
            }
            
            // Continue dragging if active
            if (draggedMeasurementId) {
              dragCurrentPos.value = { x: pageX, y: pageY };
              
              // Calculate offset from start
              const deltaX = pageX - dragStartPos.value.x;
              const deltaY = pageY - dragStartPos.value.y;
              
              // Update measurement position
              const measurement = measurements.find(m => m.id === draggedMeasurementId);
              if (measurement) {
                const deltaImageX = deltaX / zoomScale;
                const deltaImageY = deltaY / zoomScale;
                
                const updatedMeasurements = measurements.map(m => {
                  if (m.id === draggedMeasurementId) {
                    return {
                      ...m,
                      points: m.points.map(p => ({
                        x: p.x + deltaImageX,
                        y: p.y + deltaImageY,
                      })),
                    };
                  }
                  return m;
                });
                
                setMeasurements(updatedMeasurements);
                dragStartPos.value = { x: pageX, y: pageY };
                
                // No haptic during drag - smooth movement
              }
            }
          }}
          onResponderRelease={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            
            // Check for rapid tap to delete (only if didn't drag)
            if (!didDrag) {
              const tappedId = getTappedMeasurement(pageX, pageY);
              if (tappedId) {
                const now = Date.now();
                const TAP_TIMEOUT = 500; // 500ms between taps
                
                if (tapDeleteState?.measurementId === tappedId && (now - tapDeleteState.lastTapTime) < TAP_TIMEOUT) {
                  // Same measurement tapped within timeout
                  const newCount = tapDeleteState.count + 1;
                  
                  if (newCount >= 4) {
                    // 4th tap - delete the measurement!
                    const updatedMeasurements = measurements.filter(m => m.id !== tappedId);
                    setMeasurements(updatedMeasurements);
                    setTapDeleteState(null);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    console.log('🗑️ Measurement deleted via 4 rapid taps');
                    
                    // Reset all states and return early
                    setDraggedMeasurementId(null);
                    setResizingPoint(null);
                    setDidDrag(false);
                    setIsSnapped(false);
                    return;
                  } else {
                    // Increment tap count (1, 2, 3...)
                    setTapDeleteState({ measurementId: tappedId, count: newCount, lastTapTime: now });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                } else {
                  // First tap or timeout expired - reset counter
                  setTapDeleteState({ measurementId: tappedId, count: 1, lastTapTime: now });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }
            }
            
            if (resizingPoint && !didDrag) {
              // Released without dragging - check for 4-tap delete
              const tappedId = resizingPoint.measurementId;
              const now = Date.now();
              const TAP_TIMEOUT = 500; // 500ms between taps
              
              if (tapDeleteState?.measurementId === tappedId && (now - tapDeleteState.lastTapTime) < TAP_TIMEOUT) {
                // Same measurement tapped within timeout
                const newCount = tapDeleteState.count + 1;
                
                if (newCount >= 4) {
                  // 4th tap - delete the measurement!
                  const updatedMeasurements = measurements.filter(m => m.id !== tappedId);
                  setMeasurements(updatedMeasurements);
                  setTapDeleteState(null);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  console.log('🗑️ Measurement deleted via 4 rapid taps');
                  
                  // Reset all states and return early
                  setDraggedMeasurementId(null);
                  setResizingPoint(null);
                  setDidDrag(false);
                  setIsSnapped(false);
                  return;
                } else {
                  // Increment tap count (1, 2, 3...)
                  setTapDeleteState({ measurementId: tappedId, count: newCount, lastTapTime: now });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              } else {
                // First tap or timeout expired - reset counter
                setTapDeleteState({ measurementId: tappedId, count: 1, lastTapTime: now });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }
            
            if (resizingPoint) {
              // Recalculate measurement values after point movement completes using our helper function
              const updatedMeasurements = measurements.map(m => {
                if (m.id === resizingPoint.measurementId) {
                  return recalculateMeasurement(m);
                }
                return m;
              });
              
              setMeasurements(updatedMeasurements);
              
              // Finished resizing
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else if (draggedMeasurementId) {
              // Finished dragging
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            
            // Always reset drag state and snap state
            setDraggedMeasurementId(null);
            setResizingPoint(null);
            setDidDrag(false);
            setIsSnapped(false);
            
            // Clear selection after a delay if no longer dragging
            setTimeout(() => {
              if (!didDrag) {
                setSelectedMeasurementId(null);
              }
            }, 2000); // Keep selection visible for 2 seconds
          }}
        />
      )}

      {/* Floating cursor container */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }} pointerEvents="none">
        {/* Freehand cursor - looks like regular cursor but with activation states */}
        {(showFreehandCursor || showCursor) && mode === 'freehand' && (() => {
          const nextMeasurementIndex = measurements.length;
          const nextColor = getMeasurementColor(nextMeasurementIndex, mode);
          const cursorColor = nextColor.main;
          const glowColor = getComplementaryColor(cursorColor);
          
          // Calculate dynamic glow opacity based on cursor speed
          // Speed ranges: 0 (still) to ~3+ (very fast) pixels per millisecond
          // Map to opacity: 0.07 (slow/still) to 0.14 (fast) - 30% reduced from original
          const minGlowOpacity = 0.07; // 30% less than 0.105
          const maxGlowOpacity = 0.14; // 30% less than 0.2
          const speedFactor = Math.min(cursorSpeed / 2, 1); // Normalize to 0-1 range
          const dynamicGlowOpacity = minGlowOpacity + (maxGlowOpacity - minGlowOpacity) * speedFactor;
          
          // Determine label based on state
          let label = 'Hold to start';
          if (freehandActivating) {
            // Use state to show warning (prevents flickering with hysteresis)
            if (isShowingSpeedWarning) {
              label = 'Slow down to draw';
            } else {
              label = 'Hold...';
            }
          } else if (isDrawingFreehand) {
            label = 'Drawing';
          }
          
          return (
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
                {/* Outer ring glow layers - complementary color with dynamic opacity */}
                <Circle cx={50} cy={50} r={32} fill="none" stroke={glowColor} strokeWidth="8" opacity={dynamicGlowOpacity * 0.7} />
                <Circle cx={50} cy={50} r={31} fill="none" stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                {/* Outer ring - pulses when activating */}
                <Circle 
                  cx={50} 
                  cy={50} 
                  r={30} 
                  fill="none" 
                  stroke={cursorColor} 
                  strokeWidth="3" 
                  opacity={freehandActivating ? 0.6 : 0.8} 
                />
                {/* Inner circle */}
                <Circle cx={50} cy={50} r={15} fill={`${cursorColor}33`} stroke={cursorColor} strokeWidth="2" />
                {/* Crosshair lines with complementary glow and dynamic opacity */}
                <Line x1={10} y1={50} x2={35} y2={50} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={10} y1={50} x2={35} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={cursorColor} strokeWidth="2" />
                
                {/* Center dot - yellow with glow */}
                <Circle cx={50} cy={50} r={4} fill="#FFFF00" opacity={0.2} />
                <Circle cx={50} cy={50} r={3} fill="#FFFF00" opacity={0.3} />
                <Circle cx={50} cy={50} r={2} fill="#000000" opacity={1} />
                <Circle cx={50} cy={50} r={2.5} fill="#FFFF00" opacity={0.3} />
                <Circle cx={50} cy={50} r={1} fill="#FFFF00" opacity={1} />
              </Svg>
              <View style={{
                position: 'absolute',
                top: scaleMargin(-35),
                left: 0,
                right: 0,
                backgroundColor: cursorColor,
                paddingHorizontal: scalePadding(12),
                paddingVertical: scalePadding(4),
                borderRadius: scaleBorderRadius(12)
              }}>
                <Text style={{ color: 'white', fontSize: scaleFontSize(12), fontWeight: 'bold', textAlign: 'center' }}>
                  {label}
                </Text>
              </View>
            </View>
          );
        })()}
        
        {/* Blueprint cursor (gray) */}
        {showCursor && isPlacingBlueprint && (() => {
          // Gray colors for blueprint mode
          const cursorColor = 'rgba(100, 100, 100, 0.8)';
          const glowColor = 'rgba(150, 150, 150, 0.6)';
          
          // Calculate dynamic glow opacity based on cursor speed
          const minGlowOpacity = 0.07;
          const maxGlowOpacity = 0.14;
          const speedFactor = Math.min(cursorSpeed / 2, 1);
          const dynamicGlowOpacity = minGlowOpacity + (maxGlowOpacity - minGlowOpacity) * speedFactor;
          
          return (
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
                {/* Outer ring glow layers - gray */}
                <Circle cx={50} cy={50} r={32} fill="none" stroke={glowColor} strokeWidth="8" opacity={dynamicGlowOpacity * 0.7} />
                <Circle cx={50} cy={50} r={31} fill="none" stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                {/* Outer ring - gray */}
                <Circle cx={50} cy={50} r={30} fill="none" stroke={cursorColor} strokeWidth="3" opacity={0.8} />
                {/* Inner circle - gray */}
                <Circle cx={50} cy={50} r={15} fill="rgba(100, 100, 100, 0.2)" stroke={cursorColor} strokeWidth="2" />
                {/* Crosshair lines - gray */}
                <Line x1={10} y1={50} x2={35} y2={50} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={10} y1={50} x2={35} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={cursorColor} strokeWidth="2" />
                
                {/* Yellow center dot */}
                <Circle cx={50} cy={50} r={4} fill="#FFFF00" opacity={0.2} />
                <Circle cx={50} cy={50} r={3} fill="#FFFF00" opacity={0.3} />
                <Circle cx={50} cy={50} r={2} fill="#000000" opacity={1} />
                <Circle cx={50} cy={50} r={2.5} fill="#FFFF00" opacity={0.3} />
                <Circle cx={50} cy={50} r={1} fill="#FFFF00" opacity={1} />
              </Svg>
              <View style={{ position: 'absolute', top: scaleMargin(-35), left: 0, right: 0, backgroundColor: cursorColor, paddingHorizontal: scalePadding(12), paddingVertical: scalePadding(4), borderRadius: scaleBorderRadius(12) }}>
                <Text style={{ color: 'white', fontSize: scaleFontSize(12), fontWeight: 'bold', textAlign: 'center' }}>
                  {blueprintPoints.length === 0 && 'Place first point'}
                  {blueprintPoints.length === 1 && 'Place second point'}
                </Text>
              </View>
            </View>
          );
        })()}
        
        {/* Regular cursor (for other modes) */}
        {showCursor && mode !== 'freehand' && !isPlacingBlueprint && (() => {
          // Determine which measurement this will be (if completing current or starting new)
          const nextMeasurementIndex = currentPoints.length === requiredPoints 
            ? measurements.length + 1  // Current measurement will be saved, this is the next one
            : measurements.length;      // This is for the current measurement being placed
          
          // Get the color for the next measurement
          const nextColor = getMeasurementColor(nextMeasurementIndex, mode);
          const cursorColor = nextColor.main;
          const glowColor = getComplementaryColor(cursorColor);
          
          // Calculate dynamic glow opacity based on cursor speed
          // Speed ranges: 0 (still) to ~3+ (very fast) pixels per millisecond
          // Map to opacity: 0.07 (slow/still) to 0.14 (fast) - 30% reduced from original
          const minGlowOpacity = 0.07; // 30% less than 0.105
          const maxGlowOpacity = 0.14; // 30% less than 0.2
          const speedFactor = Math.min(cursorSpeed / 2, 1); // Normalize to 0-1 range
          const dynamicGlowOpacity = minGlowOpacity + (maxGlowOpacity - minGlowOpacity) * speedFactor;
          
          return (
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
                {/* Outer ring glow layers - complementary color with dynamic opacity */}
                <Circle cx={50} cy={50} r={32} fill="none" stroke={glowColor} strokeWidth="8" opacity={dynamicGlowOpacity * 0.7} />
                <Circle cx={50} cy={50} r={31} fill="none" stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                {/* Outer ring with next measurement color */}
                <Circle cx={50} cy={50} r={30} fill="none" stroke={cursorColor} strokeWidth="3" opacity={0.8} />
                {/* Inner circle with next measurement color */}
                <Circle cx={50} cy={50} r={15} fill={`${cursorColor}33`} stroke={cursorColor} strokeWidth="2" />
                {/* Crosshair lines with complementary glow and dynamic opacity */}
                <Line x1={10} y1={50} x2={35} y2={50} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={glowColor} strokeWidth="6" opacity={dynamicGlowOpacity} />
                <Line x1={10} y1={50} x2={35} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={cursorColor} strokeWidth="2" />
                
                {/* Neon yellow center dot with glow */}
                <Circle cx={50} cy={50} r={4} fill="#FFFF00" opacity={0.2} />
                <Circle cx={50} cy={50} r={3} fill="#FFFF00" opacity={0.3} />
                <Circle cx={50} cy={50} r={2} fill="#000000" opacity={1} />
                <Circle cx={50} cy={50} r={2.5} fill="#FFFF00" opacity={0.3} />
                <Circle cx={50} cy={50} r={1} fill="#FFFF00" opacity={1} />
              </Svg>
              <View style={{ position: 'absolute', top: scaleMargin(-35), left: 0, right: 0, backgroundColor: cursorColor, paddingHorizontal: scalePadding(12), paddingVertical: scalePadding(4), borderRadius: scaleBorderRadius(12) }}>
                <Text style={{ color: 'white', fontSize: scaleFontSize(12), fontWeight: 'bold', textAlign: 'center' }}>
                  {mode === 'distance' && currentPoints.length === 0 && 'Point 1'}
                  {mode === 'distance' && currentPoints.length === 1 && 'Point 2'}
                  {mode === 'angle' && currentPoints.length === 0 && (isMapMode ? 'Start location' : 'Point 1')}
                  {mode === 'angle' && currentPoints.length === 1 && (isMapMode ? 'North reference' : 'Point 2 (vertex)')}
                  {mode === 'angle' && currentPoints.length === 2 && (isMapMode ? 'Destination' : 'Point 3')}
                  {mode === 'circle' && currentPoints.length === 0 && 'Center of circle'}
                  {mode === 'circle' && currentPoints.length === 1 && 'Outside of circle'}
                  {mode === 'rectangle' && currentPoints.length === 0 && 'First corner'}
                  {mode === 'rectangle' && currentPoints.length === 1 && 'Second corner'}
                </Text>
              </View>
            </View>
          );
        })()}
      </View>

      {/* Finger touch indicators - organic fingerprint-like patterns with evaporation */}
      {(() => {
        // Use session color for ALL fingerprints (universal approach)
        const fingerColor = sessionColor ? sessionColor.main : '#3B82F6'; // Fallback to blue

        return fingerTouches.map((touch) => {
          // Size based on pressure (subtle variation: 85% to 115% of base size)
          const pressureScale = 0.85 + (touch.pressure * 0.3);
          const baseRadius = 18 * pressureScale;
          
          // Create organic fingerprint-like pattern with randomization
          // Using the seed to create pseudo-random but consistent pattern
          const ridges = [];
          const numRidges = 5;
          
          for (let i = 0; i < numRidges; i++) {
            const radiusOffset = (touch.seed * 2 - 1) * 3; // -3 to +3 variation
            const radius = baseRadius * (0.3 + i * 0.15) + radiusOffset;
            const opacityVariation = 0.05 + (Math.sin(touch.seed * 10 + i) * 0.03);
            
            ridges.push({
              radius,
              opacity: 0.18 - (i * 0.025) + opacityVariation
            });
          }
          
          return (
            <Animated.View
              key={touch.id}
              style={[
                {
                  position: 'absolute',
                  left: touch.x - baseRadius - 5,
                  top: touch.y - baseRadius - 5,
                  width: (baseRadius + 5) * 2,
                  height: (baseRadius + 5) * 2,
                  pointerEvents: 'none',
                },
                evaporationStyle
              ]}
            >
              <Svg width={(baseRadius + 5) * 2} height={(baseRadius + 5) * 2}>
                {/* Organic fingerprint ridges - outermost first for layering */}
                {ridges.reverse().map((ridge, idx) => (
                  <Circle 
                    key={idx}
                    cx={baseRadius + 5} 
                    cy={baseRadius + 5} 
                    r={ridge.radius} 
                    fill={fingerColor} 
                    opacity={ridge.opacity}
                  />
                ))}
                
                {/* Add some subtle irregular "pores" for realism */}
                {[...Array(8)].map((_, idx) => {
                  const angle = (touch.seed * Math.PI * 2) + (idx * Math.PI / 4);
                  const distance = baseRadius * (0.4 + (Math.sin(touch.seed * 20 + idx) * 0.2));
                  const poreX = (baseRadius + 5) + Math.cos(angle) * distance;
                  const poreY = (baseRadius + 5) + Math.sin(angle) * distance;
                  const poreSize = 0.8 + (Math.cos(touch.seed * 30 + idx) * 0.4);
                  
                  return (
                    <Circle 
                      key={`pore-${idx}`}
                      cx={poreX} 
                      cy={poreY} 
                      r={poreSize} 
                      fill={fingerColor} 
                      opacity={0.12}
                    />
                  );
                })}
              </Svg>
            </Animated.View>
          );
        });
      })()}

      {/* Menu button fingerprints (session color) */}
      {(() => {
        if (menuFingerTouches.length === 0 || !sessionColor) return null;
        
        const fingerColor = sessionColor.main;
        
        return menuFingerTouches.map((touch) => {
          const pressureScale = 0.85 + (touch.pressure * 0.3);
          const baseRadius = 18 * pressureScale;
          
          const ridges = [];
          const numRidges = 5;
          
          for (let i = 0; i < numRidges; i++) {
            const radiusOffset = (touch.seed * 2 - 1) * 3;
            const radius = baseRadius * (0.3 + i * 0.15) + radiusOffset;
            const opacityVariation = 0.05 + (Math.sin(touch.seed * 10 + i) * 0.03);
            
            ridges.push({
              radius,
              opacity: 0.18 - (i * 0.025) + opacityVariation
            });
          }
          
          return (
            <Animated.View
              key={touch.id}
              style={[
                {
                  position: 'absolute',
                  left: touch.x - baseRadius - 5,
                  top: touch.y - baseRadius - 5,
                  width: (baseRadius + 5) * 2,
                  height: (baseRadius + 5) * 2,
                  pointerEvents: 'none',
                },
                menuEvaporationStyle
              ]}
            >
              <Svg width={(baseRadius + 5) * 2} height={(baseRadius + 5) * 2}>
                {ridges.reverse().map((ridge, idx) => (
                  <Circle 
                    key={idx}
                    cx={baseRadius + 5} 
                    cy={baseRadius + 5} 
                    r={ridge.radius} 
                    fill={fingerColor} 
                    opacity={ridge.opacity}
                  />
                ))}
                
                {[...Array(8)].map((_, idx) => {
                  const angle = (touch.seed * Math.PI * 2) + (idx * Math.PI / 4);
                  const distance = baseRadius * (0.4 + (Math.sin(touch.seed * 20 + idx) * 0.2));
                  const poreX = (baseRadius + 5) + Math.cos(angle) * distance;
                  const poreY = (baseRadius + 5) + Math.sin(angle) * distance;
                  const poreSize = 0.8 + (Math.cos(touch.seed * 30 + idx) * 0.4);
                  
                  return (
                    <Circle 
                      key={`pore-${idx}`}
                      cx={poreX} 
                      cy={poreY} 
                      r={poreSize} 
                      fill={fingerColor} 
                      opacity={0.12}
                    />
                  );
                })}
              </Svg>
            </Animated.View>
          );
        });
      })()}

      {/* Swipe trail effect (fading fingerprints along swipe path) */}
      {(() => {
        console.log('🎨 Swipe Trail Check:', { 
          isArray: Array.isArray(swipeTrail), 
          length: swipeTrail?.length, 
          hasSessionColor: !!sessionColor 
        });
        
        if (!Array.isArray(swipeTrail) || swipeTrail.length === 0 || !sessionColor) return null;
        
        console.log('🎨 Rendering', swipeTrail.length, 'trail points');
        
        const fingerColor = sessionColor.main;
        const now = Date.now();
        const trailDuration = 1000; // 1 second fade
        
        return swipeTrail.map((point, index) => {
          const age = now - point.timestamp;
          const progress = Math.min(age / trailDuration, 1);
          
          // Fade out from start to end
          const startProgress = index / swipeTrail.length;
          const fadeOpacity = (1 - progress) * (1 - startProgress * 0.5);
          
          const baseRadius = 12;
          
          return (
            <View
              key={point.id}
              style={{
                position: 'absolute',
                left: point.x - baseRadius - 3,
                top: point.y - baseRadius - 3,
                width: (baseRadius + 3) * 2,
                height: (baseRadius + 3) * 2,
                opacity: fadeOpacity,
                pointerEvents: 'none',
              }}
            >
              <Svg width={(baseRadius + 3) * 2} height={(baseRadius + 3) * 2}>
                <Circle 
                  cx={baseRadius + 3} 
                  cy={baseRadius + 3} 
                  r={baseRadius * 0.8} 
                  fill={fingerColor} 
                  opacity={0.15}
                />
                <Circle 
                  cx={baseRadius + 3} 
                  cy={baseRadius + 3} 
                  r={baseRadius * 0.5} 
                  fill={fingerColor} 
                  opacity={0.2}
                />
              </Svg>
            </View>
          );
        });
      })()}

      {/* Subtle guide lines - only show in Pan mode after calibration, hide when measurements exist */}
      {!measurementMode && calibration && Array.isArray(measurements) && measurements.length === 0 && (
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        >
          {/* Vertical center line - subtle but visible */}
          <View
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH / 2 - 0.5,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }}
          />
          
          {/* Horizontal center line - subtle but visible */}
          <View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT / 2 - 0.5,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }}
          />
          
          {/* Upper horizontal red guide line - for leveling assistance */}
          <View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT * 0.2 - 0.5,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            }}
          />
          
          {/* Lower horizontal red guide line - for leveling assistance */}
          <View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT * 0.35 - 0.5,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            }}
          />
        </View>
      )}

      {/* Visual overlay for measurements */}
      <View
        ref={viewRef}
        collapsable={false}
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
            {renderedMeasurements}

            {/* Draw live freehand path preview while drawing */}
            {mode === 'freehand' && isDrawingFreehand && freehandPath.length > 1 && (() => {
              const screenPoints = freehandPath.map(p => imageToScreen(p.x, p.y));
              const nextColor = getMeasurementColor(measurements.length, 'freehand');
              
              // Generate path
              let pathData = `M ${screenPoints[0].x} ${screenPoints[0].y}`;
              for (let i = 1; i < screenPoints.length; i++) {
                pathData += ` L ${screenPoints[i].x} ${screenPoints[i].y}`;
              }
              
              return (
                <>
                  {/* Beautiful glow layers - same as completed measurements */}
                  <Path d={pathData} stroke={nextColor.glow} strokeWidth="12" opacity="0.15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d={pathData} stroke={nextColor.glow} strokeWidth="8" opacity="0.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Main path */}
                  <Path d={pathData} stroke={nextColor.main} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </>
              );
            })()}

            {/* Draw current points being placed */}
            {mode === 'distance' && currentPoints.length === 2 && (() => {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              const nextColor = getMeasurementColor(measurements.length, 'distance');
              return (
                <>
                  <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={nextColor.main} strokeWidth="2" />
                  <Line x1={p0.x} y1={p0.y - 10} x2={p0.x} y2={p0.y + 10} stroke={nextColor.main} strokeWidth="1.5" />
                  <Line x1={p1.x} y1={p1.y - 10} x2={p1.x} y2={p1.y + 10} stroke={nextColor.main} strokeWidth="1.5" />
                </>
              );
            })()}

            {mode === 'angle' && currentPoints.length >= 2 && (() => {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              const p2 = currentPoints.length === 3 ? imageToScreen(currentPoints[2].x, currentPoints[2].y) : null;
              const nextColor = getMeasurementColor(measurements.length, 'angle');
              
              return (
                <>
                  <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke={nextColor.main} strokeWidth="2" />
                  {p2 && (
                    <>
                      <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={nextColor.main} strokeWidth="2" />
                      <Path d={generateArcPath(p0, p1, p2)} stroke={nextColor.main} strokeWidth="1.5" fill="none" />
                    </>
                  )}
                </>
              );
            })()}

            {/* Draw live circle preview while dragging */}
            {mode === 'circle' && currentPoints.length === 2 && (() => {
              const center = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const edge = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              const radius = Math.sqrt(
                Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
              );
              const nextColor = getMeasurementColor(measurements.length, 'circle');
              
              return (
                <>
                  <Circle cx={center.x} cy={center.y} r={radius} fill="none" stroke={nextColor.main} strokeWidth="2" opacity="0.8" />
                  <Line x1={center.x} y1={center.y} x2={edge.x} y2={edge.y} stroke={nextColor.main} strokeWidth="1.5" strokeDasharray="5,5" />
                </>
              );
            })()}

            {/* Draw live rectangle preview */}
            {mode === 'rectangle' && currentPoints.length === 2 && (() => {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              const nextColor = getMeasurementColor(measurements.length, 'rectangle');
              
              return (
                <Rect 
                  x={Math.min(p0.x, p1.x)} 
                  y={Math.min(p0.y, p1.y)} 
                  width={Math.abs(p1.x - p0.x)} 
                  height={Math.abs(p1.y - p0.y)} 
                  fill="none" 
                  stroke={nextColor.main} 
                  strokeWidth="2" 
                  opacity="0.8"
                />
              );
            })()}

            {/* Draw current point markers with glow */}
            {currentPoints.map((point, index) => {
              const screenPos = imageToScreen(point.x, point.y);
              const nextColor = getMeasurementColor(measurements.length, mode);
              return (
                <React.Fragment key={point.id}>
                  <Circle cx={screenPos.x} cy={screenPos.y} r="6" fill={nextColor.glow} opacity="0.05" />
                  <Circle cx={screenPos.x} cy={screenPos.y} r="5" fill={nextColor.glow} opacity="0.075" />
                  <Circle cx={screenPos.x} cy={screenPos.y} r="4" fill={nextColor.main} opacity="0.05" />
                  <Circle cx={screenPos.x} cy={screenPos.y} r="3" fill={nextColor.main} opacity="0.1" />
                  <Circle cx={screenPos.x} cy={screenPos.y} r="4" fill={nextColor.main} stroke="white" strokeWidth="1" />
                </React.Fragment>
              );
            })}
          </Svg>

          {/* "Locked In!" message during animation */}
          {showLockedInAnimation && (
            <View
              style={{
                position: 'absolute',
                top: SCREEN_HEIGHT / 2 - scaleSize(100),
                left: SCREEN_WIDTH / 2 - scaleSize(80),
                width: scaleSize(160),
                backgroundColor: '#00FF41',
                paddingVertical: scalePadding(12),
                paddingHorizontal: scalePadding(20),
                borderRadius: scaleBorderRadius(16),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              pointerEvents="none"
            >
              <Text style={{ color: '#000', fontSize: scaleFontSize(20), fontWeight: 'bold', textAlign: 'center' }}>
                ✓ Locked In!
              </Text>
            </View>
          )}
          {/* Label for current measurement in progress */}
          {currentPoints.length === requiredPoints && (() => {
            let screenX, screenY, value;
            const nextColor = getMeasurementColor(measurements.length, mode);
            
            if (mode === 'distance') {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              screenX = (p0.x + p1.x) / 2 - 50;
              screenY = (p0.y + p1.y) / 2 - 40;
              value = calculateDistance(currentPoints[0], currentPoints[1]);
            } else if (mode === 'angle' && currentPoints.length >= 3 && currentPoints[2]) {
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              screenX = p1.x - 50;
              screenY = p1.y - 60;
              value = calculateAngle(currentPoints[0], currentPoints[1], currentPoints[2]);
            } else if (mode === 'circle' && currentPoints.length >= 2) {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              screenX = p0.x + 10;
              screenY = p0.y - 40;
              const radius = Math.sqrt(
                Math.pow(currentPoints[1].x - currentPoints[0].x, 2) + 
                Math.pow(currentPoints[1].y - currentPoints[0].y, 2)
              );
              const radiusInUnits = radius / (calibration?.pixelsPerUnit || 1);
              const diameter = radiusInUnits * 2;
              value = `⌀ ${formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2)}`;
            } else if (mode === 'rectangle' && currentPoints.length >= 2) {
              const p0 = imageToScreen(currentPoints[0].x, currentPoints[0].y);
              const p1 = imageToScreen(currentPoints[1].x, currentPoints[1].y);
              screenX = (p0.x + p1.x) / 2 - 50;
              screenY = Math.min(p0.y, p1.y) - 50;
              const widthPx = Math.abs(currentPoints[1].x - currentPoints[0].x);
              const heightPx = Math.abs(currentPoints[1].y - currentPoints[0].y);
              const width = widthPx / (calibration?.pixelsPerUnit || 1);
              const height = heightPx / (calibration?.pixelsPerUnit || 1);
              const widthStr = formatMeasurement(width, calibration?.unit || 'mm', unitSystem, 2);
              const heightStr = formatMeasurement(height, calibration?.unit || 'mm', unitSystem, 2);
              value = `${widthStr} × ${heightStr}`;
            } else {
              return null; // Safety fallback
            }
            
            return (
              <View
                style={{
                  position: 'absolute',
                  left: screenX,
                  top: screenY,
                  backgroundColor: nextColor.main,
                  paddingHorizontal: scalePadding(12),
                  paddingVertical: scalePadding(6),
                  borderRadius: scaleBorderRadius(8),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                pointerEvents="none"
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: scaleFontSize(16) }}>
                  {value}
                </Text>
              </View>
            );
          })()}
          
          {/* Label and coin info - upper-left corner (always visible when capturing) */}
          {(currentLabel || isCapturing) && (
            <View
              style={{
                position: 'absolute',
                top: insets.top + scaleMargin(16),
                left: scaleMargin(12),
              }}
              pointerEvents="none"
            >
              {/* Title */}
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  paddingHorizontal: scalePadding(10),
                  paddingVertical: scalePadding(5),
                  borderRadius: scaleBorderRadius(6),
                  marginBottom: scaleMargin(4),
                }}
              >
                <Text style={{ color: 'white', fontSize: scaleFontSize(13), fontWeight: '600' }}>
                  {currentLabel || 'PanHandler Measurements'}
                </Text>
              </View>
              
              {/* Coin/Drone reference info */}
              {calibration && coinCircle && (
                <View
                  style={{
                    backgroundColor: coinCircle.coinName.startsWith('Auto:')
                      ? 'rgba(0, 200, 255, 0.15)' // Cyan tint for drone
                      : 'rgba(0, 0, 0, 0.7)', // Black for coin
                    paddingHorizontal: scalePadding(8),
                    paddingVertical: scalePadding(4),
                    borderRadius: scaleBorderRadius(5),
                    borderWidth: coinCircle.coinName.startsWith('Auto:') ? 1 : 0,
                    borderColor: 'rgba(0, 200, 255, 0.3)',
                  }}
                >
                  {coinCircle.coinName.startsWith('Auto:') ? (
                    <>
                      <Text style={{ color: '#00D4FF', fontSize: scaleFontSize(11), fontWeight: '700' }}>
                        🚁 {coinCircle.coinName.replace('Auto: ', '')}
                      </Text>
                      <Text style={{ color: '#A0E0FF', fontSize: scaleFontSize(9), fontWeight: '500' }}>
                        Auto-calibrated from altitude
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: '#A0A0A0', fontSize: scaleFontSize(10), fontWeight: '500' }}>
                        {coinCircle.coinName}
                      </Text>
                      <Text style={{ color: '#A0A0A0', fontSize: scaleFontSize(10), fontWeight: '500' }}>
                        {unitSystem === 'imperial'
                          ? formatMeasurement(coinCircle.coinDiameter, 'mm', 'imperial', 2)
                          : `${coinCircle.coinDiameter.toFixed(2)}mm`}
                      </Text>
                    </>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Measurement legend in upper-left corner - show when there are measurements */}
          {!hideMeasurementsForCapture && measurements.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: (currentLabel || isCapturing) ? insets.top + scaleMargin(16) + scaleSize(80) : insets.top + scaleMargin(16),
                left: scaleMargin(12),
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                paddingHorizontal: scalePadding(6),
                paddingVertical: scalePadding(4),
                borderRadius: scaleBorderRadius(4),
              }}
              pointerEvents={isCapturing ? 'none' : 'box-none'}
            >
              {/* Header with collapse/expand button */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: legendCollapsed ? 0 : scaleMargin(4), paddingBottom: legendCollapsed ? 0 : scalePadding(4), borderBottomWidth: legendCollapsed ? 0 : 1, borderBottomColor: 'rgba(255,255,255,0.2)' }}>
                <Text style={{ color: 'white', fontSize: scaleFontSize(8), fontWeight: '700', opacity: 0.7 }}>
                  LEGEND
                </Text>
                {/* Collapse/Expand button - only visible when NOT capturing */}
                {!isCapturing && (
                  <Pressable
                    onPress={() => {
                      setLegendCollapsed(!legendCollapsed);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      marginLeft: scaleMargin(8),
                      paddingHorizontal: scalePadding(4),
                      paddingVertical: scalePadding(2),
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: scaleFontSize(10), fontWeight: '700' }}>
                      {legendCollapsed ? '+' : '−'}
                    </Text>
        </Pressable>
      )}
              </View>

              {/* Measurement items - hidden when collapsed (except during capture) */}
              {(!legendCollapsed || isCapturing) && measurements.map((measurement, idx) => {
                const color = getMeasurementColor(idx, measurement.mode);
                return (
                  <View
                    key={`legend-${measurement.id}`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: scaleMargin(1),
                    }}
                  >
                    {/* Line number */}
                    <Text style={{ color: 'white', fontSize: scaleFontSize(8), fontWeight: '600', marginRight: scaleMargin(3) }}>
                      {idx + 1}.
                    </Text>
                    {/* Color indicator */}
                    <View
                      style={{
                        width: scaleSize(12),
                        height: scaleSize(8),
                        backgroundColor: color.main,
                        borderRadius: scaleBorderRadius(2),
                        marginRight: scaleMargin(4),
                      }}
                    />
                    {/* Measurement value with area for circles and rectangles */}
                    <Text style={{ color: 'white', fontSize: scaleFontSize(8), fontWeight: '600' }}>
                      {showCalculatorWords ? getCalculatorWord(measurement.value) : (() => {
                        // Recalculate display value based on current unit system
                        let displayValue = measurement.value;
                        
                        if (measurement.mode === 'distance') {
                          // Recalculate distance in current units
                          displayValue = calculateDistance(measurement.points[0], measurement.points[1]);
                        } else if (measurement.mode === 'angle') {
                          // Recalculate angle
                          displayValue = calculateAngle(measurement.points[0], measurement.points[1], measurement.points[2]);
                        } else if (measurement.mode === 'circle' && measurement.radius !== undefined) {
                          // Recalculate circle diameter and area
                          // measurement.radius is stored in PIXELS, convert to real units

                          // IMPORTANT: Only use map scale if BOTH:
                          // 1. We're currently in map mode (isMapMode)
                          // 2. The measurement was created in map mode (calibrationMode === 'map')
                          // This prevents incorrect conversions when switching modes
                          const wasCreatedInMapMode = measurement.calibrationMode === 'map';

                          // Map Mode: Apply scale conversion
                          if (isMapMode && mapScale && wasCreatedInMapMode) {
                            const diameterPx = measurement.radius * 2;
                            const diameterDist = convertToMapScale(diameterPx);
                            displayValue = `⌀ ${formatMapScaleDistance(diameterPx)}`;
                            // Calculate area in map units
                            const radiusDist = diameterDist / 2;
                            const areaDist2 = Math.PI * radiusDist * radiusDist;
                            const areaStr = formatMapScaleArea(areaDist2);

                            // Add volume if depth is present
                            if (measurement.depth !== undefined && measurement.depthUnit) {
                              // Convert depth to map scale unit (km, mi, m, or ft)
                              const depthInMapUnit = convertUnit(measurement.depth, measurement.depthUnit, mapScale.realUnit);
                              const volumeInMapUnits = areaDist2 * depthInMapUnit;
                              const volumeStr = formatVolumeMeasurement(volumeInMapUnits, mapScale.realUnit, unitSystem);
                              return `${displayValue} (A: ${areaStr} | V: ${volumeStr})`;
                            }

                            return `${displayValue} (A: ${areaStr})`;
                          }

                          // Coin calibration mode (or showing map measurement in coin mode)
                          const radiusInUnits = measurement.radius / (calibration?.pixelsPerUnit || 1);
                          const diameter = radiusInUnits * 2;
                          displayValue = `⌀ ${formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2)}`;
                          const area = Math.PI * radiusInUnits * radiusInUnits;
                          const areaStr = formatAreaMeasurement(area, calibration?.unit || 'mm', unitSystem);

                          // Add volume if depth is present
                          if (measurement.depth !== undefined && measurement.depthUnit) {
                            // Convert depth to the same base unit as area (calibration unit)
                            const depthInBaseUnit = convertUnit(measurement.depth, measurement.depthUnit, calibration?.unit || 'mm');
                            const volume = area * depthInBaseUnit;
                            const volumeStr = formatVolumeMeasurement(volume, calibration?.unit || 'mm', unitSystem);
                            return `${displayValue} (A: ${areaStr} | V: ${volumeStr})`;
                          }

                          return `${displayValue} (A: ${areaStr})`;

                        } else if (measurement.mode === 'rectangle' && measurement.width !== undefined && measurement.height !== undefined) {
                          // Recalculate rectangle dimensions and area

                          // IMPORTANT: Only use map scale if BOTH:
                          // 1. We're currently in map mode (isMapMode)
                          // 2. The measurement was created in map mode (calibrationMode === 'map')
                          const wasCreatedInMapMode = measurement.calibrationMode === 'map';

                          // Map Mode: Apply scale conversion
                          if (isMapMode && mapScale && wasCreatedInMapMode) {
                            // measurement.width and measurement.height are already in map units
                            const widthStr = formatMapValue(measurement.width);
                            const heightStr = formatMapValue(measurement.height);
                            displayValue = `${widthStr} × ${heightStr}`;
                            const areaDist2 = measurement.width * measurement.height;
                            const areaStr = formatMapScaleArea(areaDist2);

                            // Add volume if depth is present
                            if (measurement.depth !== undefined && measurement.depthUnit) {
                              // Convert depth to map scale unit (km, mi, m, or ft)
                              const depthInMapUnit = convertUnit(measurement.depth, measurement.depthUnit, mapScale.realUnit);
                              const volumeInMapUnits = areaDist2 * depthInMapUnit;
                              const volumeStr = formatVolumeMeasurement(volumeInMapUnits, mapScale.realUnit, unitSystem);
                              return `${displayValue} (A: ${areaStr} | V: ${volumeStr})`;
                            }

                            return `${displayValue} (A: ${areaStr})`;
                          }

                          // Coin calibration mode
                          const widthStr = formatMeasurement(measurement.width, calibration?.unit || 'mm', unitSystem, 2);
                          const heightStr = formatMeasurement(measurement.height, calibration?.unit || 'mm', unitSystem, 2);
                          displayValue = `${widthStr} × ${heightStr}`;
                          const area = measurement.width * measurement.height;
                          const areaStr = formatAreaMeasurement(area, calibration?.unit || 'mm', unitSystem);

                          // Add volume if depth is present
                          if (measurement.depth !== undefined && measurement.depthUnit) {
                            // Convert depth to the same base unit as area (calibration unit)
                            const depthInBaseUnit = convertUnit(measurement.depth, measurement.depthUnit, calibration?.unit || 'mm');
                            const volume = area * depthInBaseUnit;
                            const volumeStr = formatVolumeMeasurement(volume, calibration?.unit || 'mm', unitSystem);
                            return `${displayValue} (A: ${areaStr} | V: ${volumeStr})`;
                          }

                          return `${displayValue} (A: ${areaStr})`;

                        } else if ((measurement.mode === 'freehand' || measurement.mode === 'polygon') && measurement.perimeter && measurement.area !== undefined) {
                          // Show perimeter and area for closed freehand loops and polygons
                          let displayStr = measurement.value; // Already formatted as "perimeter (A: area)"

                          // Add volume if depth is present
                          if (measurement.depth !== undefined && measurement.depthUnit && measurement.area !== undefined) {
                            // Convert depth to the same base unit as area (calibration unit)
                            const depthInBaseUnit = convertUnit(measurement.depth, measurement.depthUnit, calibration?.unit || 'mm');
                            const volume = measurement.area * depthInBaseUnit;
                            const volumeStr = formatVolumeMeasurement(volume, calibration?.unit || 'mm', unitSystem);
                            // Replace closing paren with | V: volume)
                            displayStr = displayStr.replace(/\)$/, ` | V: ${volumeStr})`);
                          }

                          return displayStr;
                        }
                        
                        return displayValue;
                      })()}
                    </Text>
                    {/* Label text if present */}
                    {measurement.label && (
                      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: scaleFontSize(7), fontWeight: '500', fontStyle: 'italic', marginTop: scaleMargin(4) }}>
                        {measurement.label}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
          
          {/* "Made with PanHandler" watermark - only visible during capture for free users */}
          {isCapturing && !isProUser && (
            <View
              style={{
                position: 'absolute',
                bottom: insets.bottom + scaleMargin(20),
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
              pointerEvents="none"
            >
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  paddingHorizontal: scalePadding(12),
                  paddingVertical: scalePadding(6),
                  borderRadius: scaleBorderRadius(6),
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: scaleFontSize(10), fontWeight: '500' }}>
                  Made with PanHandler
                </Text>
              </View>
            </View>
          )}
      </View>

          {/* Interactive labels wrapper - allows tapping labels while parent View has pointerEvents="none" for pan/zoom */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }} pointerEvents={labelEditMode ? "box-none" : "none"}>

          {/* Measurement labels for completed measurements with smart positioning */}
          {!hideMeasurementsForCapture && !hideMeasurementLabels && (() => {
            // Calculate initial positions for all labels
            const labelData = measurements
              .map((measurement, originalIdx) => ({ measurement, originalIdx }))
              .map(({ measurement, originalIdx }) => {
              const color = getMeasurementColor(originalIdx, measurement.mode);
              let screenX = 0, screenY = 0;
              if (measurement.mode === 'distance') {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                screenX = (p0.x + p1.x) / 2;
                screenY = (p0.y + p1.y) / 2 - 25; // Position slightly above the line
              } else if (measurement.mode === 'angle') {
                // In map mode, label at starting point (p0)
                // In normal mode, label at vertex (p1)
                const labelPoint = isMapMode ? measurement.points[0] : measurement.points[1];
                const p1 = imageToScreen(labelPoint.x, labelPoint.y);
                screenX = p1.x;
                screenY = p1.y - 70;
              } else if (measurement.mode === 'circle') {
                // Label in center of circle
                const center = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                screenX = center.x;
                screenY = center.y;
              } else if (measurement.mode === 'rectangle') {
                // Label at top center of rectangle
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                screenX = (p0.x + p1.x) / 2;
                screenY = Math.min(p0.y, p1.y) - 40;
              } else if (measurement.mode === 'freehand') {
                // Label at centroid of freehand path
                if (measurement.points && measurement.points.length > 0) {
                  // Calculate centroid
                  let sumX = 0, sumY = 0;
                  measurement.points.forEach(p => {
                    const screenPoint = imageToScreen(p.x, p.y);
                    sumX += screenPoint.x;
                    sumY += screenPoint.y;
                  });
                  screenX = sumX / measurement.points.length;
                  screenY = sumY / measurement.points.length;
                }
              } else if (measurement.mode === 'polygon') {
                // Label at centroid of polygon
                if (measurement.points && measurement.points.length > 0) {
                  // Calculate centroid
                  let sumX = 0, sumY = 0;
                  measurement.points.forEach(p => {
                    const screenPoint = imageToScreen(p.x, p.y);
                    sumX += screenPoint.x;
                    sumY += screenPoint.y;
                  });
                  screenX = sumX / measurement.points.length;
                  screenY = sumY / measurement.points.length;
                }
              }
              return { measurement, idx: originalIdx, color, screenX, screenY };
            });

            // Smart label positioning algorithm to prevent overlaps
            const LABEL_WIDTH = 120;
            const LABEL_HEIGHT = 60; // badge + value height
            const MIN_SEPARATION = 10;

            // Detect and resolve overlaps
            for (let i = 0; i < labelData.length; i++) {
              for (let j = i + 1; j < labelData.length; j++) {
                const label1 = labelData[i];
                const label2 = labelData[j];

                // Check if labels overlap horizontally
                const xOverlap = Math.abs(label1.screenX - label2.screenX) < LABEL_WIDTH;
                
                if (xOverlap) {
                  // Check if they overlap vertically
                  const yDistance = Math.abs(label1.screenY - label2.screenY);
                  
                  if (yDistance < LABEL_HEIGHT + MIN_SEPARATION) {
                    // Overlap detected! Adjust positions
                    // Move the lower label down further
                    if (label1.screenY < label2.screenY) {
                      label2.screenY = label1.screenY + LABEL_HEIGHT + MIN_SEPARATION;
                    } else {
                      label1.screenY = label2.screenY + LABEL_HEIGHT + MIN_SEPARATION;
                    }
                  }
                }
              }
            }

            // Render labels with adjusted positions
            return labelData.map(({ measurement, idx, color, screenX, screenY }) => {
              // Handle tap on label to open edit modal when in edit mode
              const handleLabelPress = () => {
                if (labelEditMode) {
                  setLabelEditingMeasurementId(measurement.id);
                  setShowLabelEditModal(true);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              };

              return (
                <Pressable
                  key={measurement.id}
                  style={{
                    position: 'absolute',
                    left: screenX - 60,
                    top: screenY,
                    alignItems: 'center',
                  }}
                  onPress={handleLabelPress}
                  hitSlop={20}
                  pointerEvents={labelEditMode ? "auto" : "none"}
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
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1.5 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3,
                      elevation: 4,
                      borderWidth: labelEditMode ? 3 : 0,
                      borderColor: labelEditMode ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                      {/* For closed freehand loops and polygons, show only perimeter on label (area is in legend) */}
                      {(measurement.mode === 'freehand' || measurement.mode === 'polygon') && measurement.perimeter
                        ? (showCalculatorWords ? getCalculatorWord(measurement.perimeter) : measurement.perimeter)
                        : (showCalculatorWords ? getCalculatorWord(measurement.value) : measurement.value)
                      }
                    </Text>
                  </View>
                  {/* Custom label text if present */}
                  {measurement.label && (
                    <View
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        paddingHorizontal: 6,
                        paddingVertical: 3,
                        borderRadius: 4,
                        marginTop: 4,
                        maxWidth: 120,
                      }}
                    >
                      <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 8, fontWeight: '500', fontStyle: 'italic', textAlign: 'center' }}>
                        {measurement.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            });
          })()}

          {/* Side labels for rectangles - Width on left, Height on top */}
          {!hideMeasurementsForCapture && !hideMeasurementLabels && measurements.filter(m => m.mode === 'rectangle').map((measurement, idx) => {
            const color = getMeasurementColor(measurements.indexOf(measurement), measurement.mode);
            
            // Rectangle is stored with 4 corners: [0] top-left, [1] top-right, [2] bottom-right, [3] bottom-left
            // Use points[0] (top-left) and points[2] (bottom-right) for opposite corners
            const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
            const p2 = imageToScreen(measurement.points[2].x, measurement.points[2].y);
            
            const minX = Math.min(p0.x, p2.x);
            const maxX = Math.max(p0.x, p2.x);
            const minY = Math.min(p0.y, p2.y);
            const maxY = Math.max(p0.y, p2.y);
            const centerY = (minY + maxY) / 2;
            const centerX = (minX + maxX) / 2;
            
            // Calculate width and height using IMAGE coordinates from opposite corners
            const widthPx = Math.abs(measurement.points[2].x - measurement.points[0].x);
            const heightPx = Math.abs(measurement.points[2].y - measurement.points[0].y);
            const widthValue = widthPx / (calibration?.pixelsPerUnit || 1);
            const heightValue = heightPx / (calibration?.pixelsPerUnit || 1);
            const widthLabel = formatMeasurement(widthValue, calibration?.unit || 'mm', unitSystem, 2);
            const heightLabel = formatMeasurement(heightValue, calibration?.unit || 'mm', unitSystem, 2);
            
            // Handle tap on label to open edit modal when in edit mode
            const handleRectLabelPress = () => {
              if (labelEditMode) {
                setLabelEditingMeasurementId(measurement.id);
                setShowLabelEditModal(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            };
            
            return (
              <React.Fragment key={`${measurement.id}-sides`}>
                {/* Width label on left side (vertical dimension) */}
                <Pressable
                  style={{
                    position: 'absolute',
                    left: minX - 70,
                    top: centerY - 15,
                  }}
                  onPress={handleRectLabelPress}
                  hitSlop={20}
                  pointerEvents={labelEditMode ? "auto" : "none"}
                >
                  <View
                    style={{
                      backgroundColor: color.main,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderRadius: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1.5 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 3,
                      borderWidth: labelEditMode ? 2 : 0,
                      borderColor: labelEditMode ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                      H: {showCalculatorWords ? getCalculatorWord(heightLabel) : heightLabel}
                    </Text>
                  </View>
                </Pressable>
                
                {/* Length label on top side (horizontal dimension) */}
                <Pressable
                  style={{
                    position: 'absolute',
                    left: centerX - 40,
                    top: minY - 35,
                  }}
                  onPress={handleRectLabelPress}
                  hitSlop={20}
                  pointerEvents={labelEditMode ? "auto" : "none"}
                >
                  <View
                    style={{
                      backgroundColor: color.main,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderRadius: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1.5 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 3,
                      borderWidth: labelEditMode ? 2 : 0,
                      borderColor: labelEditMode ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                      L: {showCalculatorWords ? getCalculatorWord(widthLabel) : widthLabel}
                    </Text>
                  </View>
                  {/* Custom label text for rectangle - appears below width line */}
                  {measurement.label && (
                    <View
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        paddingHorizontal: 6,
                        paddingVertical: 3,
                        borderRadius: 4,
                        marginTop: 4,
                        maxWidth: 100,
                        alignSelf: 'center',
                      }}
                    >
                      <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 8, fontWeight: '500', fontStyle: 'italic', textAlign: 'center' }}>
                        {measurement.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}

          </View>
          {/* End interactive labels wrapper */}


      {/* PanHandler Supporter Badge - Bottom Right Corner */}
      {isDonor && (
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + scaleMargin(16), // Bottom safe area + padding
            right: scaleMargin(16),
            backgroundColor: 'rgba(255, 20, 147, 0.9)', // Deep pink/magenta for love
            paddingHorizontal: scalePadding(8),
            paddingVertical: scalePadding(6),
            borderRadius: scaleBorderRadius(8),
            alignItems: 'center',
            zIndex: 31,
            shadowColor: '#FF1493',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <View style={{ alignItems: 'center', gap: scaleGap(1) }}>
            <Text style={{ fontSize: scaleFontSize(12) }}>❤️</Text>
            <Text style={{
              color: 'white',
              fontSize: scaleFontSize(8),
              fontWeight: '700',
              letterSpacing: 0.3,
              textAlign: 'center',
            }}>
              PanHandler
            </Text>
            <Text style={{
              color: 'white',
              fontSize: scaleFontSize(8),
              fontWeight: '700',
              letterSpacing: 0.3,
              textAlign: 'center',
            }}>
              Supporter
            </Text>
          </View>
        </View>
      )}

      {/* Auto-capture badge - top-right corner */}
      {isAutoCaptured && (
        <Pressable
          onPress={handleAutoLevelTap}
          style={{
            position: 'absolute',
            top: insets.top + scaleMargin(16), // Normal position (donor badge moved to bottom)
            right: scaleMargin(12),
            backgroundColor: 'rgba(76, 175, 80, 0.9)', // Softer Material Design green
            paddingHorizontal: scalePadding(8),
            paddingVertical: scalePadding(4),
            borderRadius: scaleBorderRadius(6),
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 30,
          }}
        >
          <Ionicons name="flash" size={scaleIconSize(12)} color="white" />
          <Text style={{ color: 'white', fontSize: scaleFontSize(8), fontWeight: '700', marginLeft: scaleMargin(3) }}>
            AUTO LEVEL
          </Text>
        </Pressable>
      )}

      {/* Bottom toolbar - Water droplet style */}
      {!menuMinimized && !isCapturing && !isPlacingBlueprint && !showBlueprintPlacementModal && (
        <GestureDetector gesture={menuSwipeGesture}>
          <Animated.View
            pointerEvents="auto"
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                zIndex: 9999, // Super high priority
                bottom: insets.bottom + scaleMargin(16),
                paddingHorizontal: scalePadding(24),
              },
              menuAnimatedStyle
            ]}
          >
            <BlurView
              intensity={35}
              tint="light"
              style={{
                borderRadius: scaleBorderRadius(20),
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
                borderRadius: scaleBorderRadius(20),
                paddingHorizontal: scalePadding(10),
                paddingTop: scalePadding(10),
                paddingBottom: scalePadding(10),
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}>

                {/* Header with undo button and hide menu on same line */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: (measurements.length > 0 || currentPoints.length > 0) ? scaleMargin(8) : scaleMargin(16),
                  paddingHorizontal: scalePadding(4),
                }}>
                  {/* Left: Hide labels toggle - only show if there are measurements */}
                  {measurements.length > 0 ? (
                    <Pressable
                      onPress={() => {
                        setHideMeasurementLabels(!hideMeasurementLabels);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View style={{
                        width: scaleSize(28),
                        height: scaleSize(28),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Ionicons
                          name={hideMeasurementLabels ? "eye-off-outline" : "eye-outline"}
                          size={scaleIconSize(16)}
                          color="rgba(0, 0, 0, 0.5)"
                        />
                      </View>
                      <Text style={{ fontSize: scaleFontSize(12), color: 'rgba(0, 0, 0, 0.4)', marginLeft: scaleMargin(6) }}>
                        {hideMeasurementLabels ? "Show" : "Hide"}
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={{ width: scaleSize(70) }} />
                  )}

                  {/* Center: Edit Labels mode toggle - only show if there are measurements AND in Edit/Pan mode */}
                  {measurements.length > 0 && !measurementMode ? (
                    <Pressable
                      onPress={() => {
                        setLabelEditMode(!labelEditMode);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{
                        width: scaleSize(24),
                        height: scaleSize(24),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Ionicons
                          name={labelEditMode ? "pencil" : "pencil-outline"}
                          size={scaleIconSize(14)}
                          color={labelEditMode ? "rgba(0, 122, 255, 1)" : "rgba(0, 0, 0, 0.5)"}
                        />
                      </View>
                      <Text style={{ fontSize: scaleFontSize(12), color: labelEditMode ? "rgba(0, 122, 255, 1)" : "rgba(0, 0, 0, 0.4)", marginLeft: scaleMargin(4) }}>
                        Edit labels
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}

                  {/* Right: Undo button - only show if there are measurements or current points */}
                  {(measurements.length > 0 || currentPoints.length > 0) ? (
                    <Pressable
                      onPressIn={startUndoLongPress}
                      onPressOut={stopUndoLongPress}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.35)',
                        borderRadius: scaleBorderRadius(8),
                        paddingVertical: scalePadding(5),
                        paddingHorizontal: scalePadding(10),
                        borderWidth: 0.5,
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <View style={{ opacity: 0.6 }}>
                        <SnailIcon size={scaleIconSize(16)} color="#1C1C1E" />
                      </View>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontWeight: '600',
                        fontSize: scaleFontSize(14),
                        marginLeft: scaleMargin(5),
                      }}>
                        {measurements.length > 0
                          ? `Undo (${measurements.length})`
                          : 'Clear'}
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={{ width: scaleSize(90) }} />
                  )}
                </View>

          {/* Mode Toggle: Edit/Move vs Measure */}
          <View style={{ flexDirection: 'row', marginBottom: scaleMargin(8), backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: scaleBorderRadius(9), padding: scalePadding(1.5) }}>
            <Pressable
              onPress={(event) => {
                setDebugInfo({ lastTouch: Date.now(), interceptor: 'PAN_BUTTON', mode: 'PRESS' });
                setMeasurementMode(false);
                setShowCursor(false);
                setSelectedMeasurementId(null);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                // Create fingerprint at touch location
                const { pageX, pageY } = event.nativeEvent;
                createMenuFingerprint(pageX, pageY);
              }}
              onPressIn={() => {
                setDebugInfo({ lastTouch: Date.now(), interceptor: 'PAN_BTN_IN', mode: 'IN' });
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                flex: 1,
                paddingVertical: scalePadding(6),
                borderRadius: scaleBorderRadius(7.5),
                backgroundColor: !measurementMode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name={isPanZoomLocked ? "hand-left-outline" : "move-outline"}
                  size={scaleIconSize(14)}
                  color={!measurementMode ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'}
                />
                <Text style={{
                  marginLeft: scaleMargin(4),
                  fontWeight: '600',
                  fontSize: scaleFontSize(12),
                  color: !measurementMode ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  {isPanZoomLocked ? 'Edit' : 'Pan'}
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={(event) => {
                const { pageX, pageY } = event.nativeEvent;
                createMenuFingerprint(pageX, pageY);
                setDebugInfo({ lastTouch: Date.now(), interceptor: 'MEASURE_BUTTON', mode: 'PRESS' });
                setMeasurementMode(true);
                setShowCursor(true);
                setCursorPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              onPressIn={() => {
                setDebugInfo({ lastTouch: Date.now(), interceptor: 'MEASURE_BTN_IN', mode: 'IN' });
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                flex: 1,
                paddingVertical: scalePadding(6),
                borderRadius: scaleBorderRadius(7.5),
                backgroundColor: measurementMode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="create-outline"
                  size={scaleIconSize(14)}
                  color={measurementMode ? '#34C759' : 'rgba(0, 0, 0, 0.45)'}
                />
                <Text style={{
                  marginLeft: scaleMargin(4),
                  fontWeight: '600',
                  fontSize: scaleFontSize(12),
                  color: measurementMode ? '#34C759' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Measure
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Measurement Type Toggle - Single Row (Box, Circle, Angle, Freehand, Distance) */}
          <GestureDetector gesture={modeSwitchGesture}>
            <Animated.View style={[{ marginBottom: scaleMargin(8) }, modeSwipeAnimatedStyle]}>
              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: scaleBorderRadius(9), padding: scalePadding(1.5) }}>
                {/* Box (Rectangle) */}
                <Pressable
                onPress={(event) => {
                  const { pageX, pageY } = event.nativeEvent;
                  createMenuFingerprint(pageX, pageY);
                  playModeHaptic('rectangle');
                  setMode('rectangle');
                  setCurrentPoints([]);
                  setMeasurementMode(true);
                  setModeColorIndex((prev) => prev + 1);
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(6),
                  paddingHorizontal: scalePadding(2),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: mode === 'rectangle' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  shadowColor: mode === 'rectangle' ? getCurrentModeColor().main : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: mode === 'rectangle' ? 0.8 : 0,
                  shadowRadius: mode === 'rectangle' ? 8 : 0,
                  elevation: mode === 'rectangle' ? 8 : 0,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons
                    name="square-outline"
                    size={scaleIconSize(20)}
                    color={mode === 'rectangle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'}
                  />
                  <Text style={{
                    marginTop: scaleMargin(2),
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: scaleFontSize(10),
                    color: mode === 'rectangle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)',
                    textShadowColor: mode === 'rectangle' ? getCurrentModeColor().glow : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: mode === 'rectangle' ? 4 : 0,
                  }}>
                    Box
                  </Text>
                </View>
              </Pressable>

              {/* Circle */}
              <Pressable
                onPress={(event) => {
                  const { pageX, pageY } = event.nativeEvent;
                  createMenuFingerprint(pageX, pageY);
                  playModeHaptic('circle');
                  setMode('circle');
                  setCurrentPoints([]);
                  setMeasurementMode(true);
                  setModeColorIndex((prev) => prev + 1);
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(6),
                  paddingHorizontal: scalePadding(2),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: mode === 'circle' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  shadowColor: mode === 'circle' ? getCurrentModeColor().main : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: mode === 'circle' ? 0.8 : 0,
                  shadowRadius: mode === 'circle' ? 8 : 0,
                  elevation: mode === 'circle' ? 8 : 0,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons
                    name="ellipse-outline"
                    size={scaleIconSize(20)}
                    color={mode === 'circle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'}
                  />
                  <Text style={{
                    marginTop: scaleMargin(2),
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: scaleFontSize(10),
                    color: mode === 'circle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)',
                    textShadowColor: mode === 'circle' ? getCurrentModeColor().glow : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: mode === 'circle' ? 4 : 0,
                  }}>
                    Circle
                  </Text>
                </View>
              </Pressable>

              {/* Angle */}
              <Pressable
                onPress={() => {
                  // Easter egg: Triple tap to show Chuck Norris joke
                  const now = Date.now();
                  const newTaps = [...azimuthTaps, now].filter(t => now - t < 1000); // Keep only taps within last second
                  setAzimuthTaps(newTaps);

                  // Clear timeout
                  if (azimuthTapTimeoutRef.current) {
                    clearTimeout(azimuthTapTimeoutRef.current);
                  }

                  // Check for triple tap
                  if (newTaps.length >= 3) {
                    // Triple tap detected!
                    setAzimuthTaps([]);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                    // Show Chuck Norris modal
                    const joke = getRandomChuckNorrisJoke();
                    setCurrentChuckNorrisJoke(joke);
                    setShowChuckNorrisModal(true);

                    // Fade in
                    chuckNorrisOpacity.value = withTiming(1, { duration: 400 });

                    // Auto-dismiss after 4 seconds
                    setTimeout(() => {
                      chuckNorrisOpacity.value = withTiming(0, { duration: 400 }, () => {
                        runOnJS(setShowChuckNorrisModal)(false);
                      });
                    }, 4000);
                  } else {
                    // Normal button behavior
                    playModeHaptic('angle');
                    setMode('angle');
                    setCurrentPoints([]);
                    setMeasurementMode(true);
                    setModeColorIndex((prev) => prev + 1);

                    // Reset taps after 1 second
                    azimuthTapTimeoutRef.current = setTimeout(() => {
                      setAzimuthTaps([]);
                    }, 1000);
                  }
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(6),
                  paddingHorizontal: scalePadding(2),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: mode === 'angle' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  shadowColor: mode === 'angle' ? getCurrentModeColor().main : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: mode === 'angle' ? 0.8 : 0,
                  shadowRadius: mode === 'angle' ? 8 : 0,
                  elevation: mode === 'angle' ? 8 : 0,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {/* Custom angle icon */}
                  <Svg width={scaleIconSize(20)} height={scaleIconSize(20)} viewBox="0 0 16 16">
                    <Line x1="3" y1="13" x2="13" y2="3" stroke={mode === 'angle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.5" strokeLinecap="round" />
                    <Line x1="3" y1="13" x2="13" y2="13" stroke={mode === 'angle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.5" strokeLinecap="round" />
                    <Path d="M 7 13 A 5.66 5.66 0 0 1 6 8" stroke={mode === 'angle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.3" fill="none" />
                    <Line x1="6" y1="12" x2="6.8" y2="12.8" stroke={mode === 'angle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1" strokeLinecap="round" />
                    <Line x1="5.2" y1="10" x2="4.4" y2="10.2" stroke={mode === 'angle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1" strokeLinecap="round" />
                  </Svg>
                  <Text style={{
                    marginTop: scaleMargin(2),
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: scaleFontSize(10),
                    color: mode === 'angle' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)',
                    textShadowColor: mode === 'angle' ? getCurrentModeColor().glow : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: mode === 'angle' ? 4 : 0,
                  }}>
                    {isMapMode ? 'Azimuth' : 'Angle'}
                  </Text>
                </View>
              </Pressable>

              {/* Distance (long-press also activates freehand) */}
              <Pressable
                onPress={() => {
                  playModeHaptic('distance');
                  setMode('distance');
                  setCurrentPoints([]);
                  setMeasurementMode(true);
                  setModeColorIndex((prev) => prev + 1);
                }}
                onPressIn={() => {
                  // Start long-press timer for freehand mode
                  if (freehandLongPressRef.current) {
                    clearTimeout(freehandLongPressRef.current);
                  }
                  freehandLongPressRef.current = setTimeout(() => {
                    // Activate freehand mode - check trial
                    if (!isProUser) {
                      // Check if trial exhausted
                      if (freehandTrialUsed >= freehandTrialLimit) {
                        console.log('🤖 Freehand trial exhausted! Opening modal...');
                        if (freehandOfferDismissed) {
                          console.log('🤖 Offer was dismissed, showing Battling Bots Modal');
                          setShowProModal(true);
                        } else {
                          console.log('📧 Showing freehand offer modal first');
                          setShowFreehandOfferModal(true);
                        }
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        return;
                      }
                    }
                    playModeHaptic('freehand');
                    setMode('freehand');
                    setCurrentPoints([]);
                    setMeasurementMode(true);
                    setIsDrawingFreehand(false);
                    setModeColorIndex((prev) => prev + 1);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    console.log('🎨 Freehand mode activated via long-press');
                  }, 500); // 500ms long-press
                }}
                onPressOut={() => {
                  // Cancel long-press if released before timeout
                  if (freehandLongPressRef.current) {
                    clearTimeout(freehandLongPressRef.current);
                    freehandLongPressRef.current = null;
                  }
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(6),
                  paddingHorizontal: scalePadding(2),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: mode === 'distance' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  shadowColor: mode === 'distance' ? getCurrentModeColor().main : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: mode === 'distance' ? 0.8 : 0,
                  shadowRadius: mode === 'distance' ? 8 : 0,
                  elevation: mode === 'distance' ? 8 : 0,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={scaleIconSize(20)} height={scaleIconSize(20)} viewBox="0 0 16 16">
                    <Line x1="3" y1="8" x2="13" y2="8" stroke={mode === 'distance' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.5" />
                    <Circle cx="3" cy="8" r="2" fill={mode === 'distance' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} />
                    <Circle cx="13" cy="8" r="2" fill={mode === 'distance' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'} />
                  </Svg>
                  <Text style={{
                    marginTop: scaleMargin(2),
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: scaleFontSize(10),
                    color: mode === 'distance' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)',
                    textShadowColor: mode === 'distance' ? getCurrentModeColor().glow : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: mode === 'distance' ? 4 : 0,
                  }}>
                    Line
                  </Text>
                </View>
              </Pressable>

              {/* Freehand (FREE TRIAL: 10 uses, then PRO) */}
              <Pressable
                onPress={() => {
                  // Check if user is pro
                  if (isProUser) {
                    playModeHaptic('freehand');
                    setMode('freehand');
                    setCurrentPoints([]);
                    setMeasurementMode(true);
                    setIsDrawingFreehand(false);
                    setModeColorIndex((prev) => prev + 1);
                    return;
                  }

                  // Check if trial is exhausted and offer dismissed
                  if (freehandTrialUsed >= freehandTrialLimit && freehandOfferDismissed) {
                    // Show Pro modal
                    setShowProModal(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    return;
                  }

                  // Check if trial is exhausted but offer not yet dismissed
                  if (freehandTrialUsed >= freehandTrialLimit && !freehandOfferDismissed) {
                    // Show special offer modal
                    setShowFreehandOfferModal(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    return;
                  }

                  // User still has free tries - activate freehand
                  playModeHaptic('freehand');
                  setMode('freehand');
                  setCurrentPoints([]);
                  setMeasurementMode(true);
                  setIsDrawingFreehand(false);
                  setModeColorIndex((prev) => prev + 1);
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(6),
                  paddingHorizontal: scalePadding(2),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: mode === 'freehand' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  shadowColor: mode === 'freehand' ? getCurrentModeColor().main : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: mode === 'freehand' ? 0.8 : 0,
                  shadowRadius: mode === 'freehand' ? 8 : 0,
                  elevation: mode === 'freehand' ? 8 : 0,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={scaleIconSize(20)} height={scaleIconSize(20)} viewBox="0 0 16 16">
                    <Path
                      d="M 2 8 Q 4 6, 6 8 T 10 8 Q 12 9, 14 7"
                      stroke={mode === 'freehand' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)'}
                      strokeWidth="2" 
                      fill="none" 
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text style={{
                    marginTop: scaleMargin(2),
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: scaleFontSize(10),
                    color: mode === 'freehand' ? getCurrentModeColor().main : 'rgba(0, 0, 0, 0.45)',
                    textShadowColor: mode === 'freehand' ? getCurrentModeColor().glow : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: mode === 'freehand' ? 4 : 0,
                  }}>
                    Free
                  </Text>
                </View>
              </Pressable>
            </View>
            </Animated.View>
          </GestureDetector>

          {/* Unit System and Map Mode Row */}
          <View style={{ flexDirection: 'row', marginBottom: scaleMargin(8), gap: scaleGap(6) }}>
            {/* Unit System Toggle: Metric vs Imperial - Compact */}
            <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: scaleBorderRadius(9), padding: scalePadding(1.5) }}>
              <Pressable
                onPress={() => {
                  setUnitSystem('metric');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(5),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: unitSystem === 'metric' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{
                    fontWeight: '600',
                    fontSize: scaleFontSize(10),
                    color: unitSystem === 'metric' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                  }}>
                    Metric
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setUnitSystem('imperial');
                  handleImperialTap();
                }}
                style={{
                  flex: 1,
                  paddingVertical: scalePadding(5),
                  borderRadius: scaleBorderRadius(7.5),
                  backgroundColor: unitSystem === 'imperial' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{
                    fontWeight: '600',
                    fontSize: scaleFontSize(10),
                    color: unitSystem === 'imperial' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                  }}>
                    Imperial
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Map Mode Toggle */}
            <Pressable
              onPress={() => {
                console.log('🗺️ Map button pressed:', { isMapMode, hasMapScale: !!mapScale });
                if (!isMapMode) {
                  // Turning ON map mode
                  if (mapScale) {
                    // Scale already exists for this photo - just activate map mode
                    console.log('✅ Activating map mode (scale exists)');
                    setIsMapMode(true);
                    // Dora "We did it!" - Triumphant celebratory sequence! 🗺️
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 80);
                    scheduleHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 160);
                    scheduleHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 300);
                  } else {
                    // No scale yet - show modal to set scale
                    console.log('📋 No scale - showing modal');
                    setShowMapScaleModal(true);
                  }
                } else {
                  // Turning OFF map mode - keep scale for this photo session
                  console.log('⏸️ Deactivating map mode (keeping scale)');
                  setIsMapMode(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={{
                flex: 1,
                paddingVertical: scalePadding(5),
                borderRadius: scaleBorderRadius(9),
                backgroundColor: isMapMode ? 'rgba(100, 150, 255, 0.25)' : 'rgba(120, 120, 128, 0.18)',
                borderWidth: isMapMode ? 1.5 : 0,
                borderColor: isMapMode ? 'rgba(100, 150, 255, 0.5)' : 'transparent',
                paddingHorizontal: scalePadding(8),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {/* Map icon - folded map with panels */}
                <Svg width={scaleIconSize(16)} height={scaleIconSize(16)} viewBox="0 0 24 24" style={{ marginRight: scaleMargin(4) }}>
                  {/* Three vertical panels of a folded map */}
                  <Path
                    d="M3 4 L8 2 L8 22 L3 20 Z"
                    stroke={isMapMode ? '#0066FF' : 'rgba(0, 0, 0, 0.45)'}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <Path
                    d="M8 2 L16 4 L16 22 L8 22"
                    stroke={isMapMode ? '#0066FF' : 'rgba(0, 0, 0, 0.45)'}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <Path
                    d="M16 4 L21 2 L21 20 L16 22"
                    stroke={isMapMode ? '#0066FF' : 'rgba(0, 0, 0, 0.45)'}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
                <Text style={{
                  fontWeight: '600',
                  fontSize: scaleFontSize(10),
                  color: isMapMode ? '#0066FF' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Map
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Tip */}
          {/* Helper instructions - always show based on mode */}
          {currentPoints.length === 0 && (
            <View style={{
              backgroundColor: measurementMode ? 'rgba(240, 253, 244, 1)' : selectedMeasurementId ? 'rgba(250, 245, 255, 1)' : 'rgba(239, 246, 255, 1)',
              borderRadius: scaleBorderRadius(8),
              paddingHorizontal: scalePadding(12),
              paddingVertical: scalePadding(8),
              marginBottom: scaleMargin(12)
            }}>
              <Text style={{
                color: isPlacingBlueprint ? 'rgba(100, 100, 100, 1)' : measurementMode ? 'rgba(22, 101, 52, 1)' : selectedMeasurementId ? 'rgba(107, 33, 168, 1)' : 'rgba(30, 64, 175, 1)',
                fontSize: isPlacingBlueprint ? scaleFontSize(14.4) : scaleFontSize(12), // 20% bigger when placing blueprint (12 * 1.2 = 14.4)
                textAlign: 'center',
                textShadowColor: isPlacingBlueprint ? 'rgba(255, 255, 255, 0.8)' : undefined,
                textShadowOffset: isPlacingBlueprint ? { width: 0, height: 1 } : undefined,
                textShadowRadius: isPlacingBlueprint ? 2 : undefined,
              }}>
                {isPlacingBlueprint
                  ? blueprintPoints.length === 0
                    ? '📍 Pinch to zoom • Drag to pan • Then tap to place first pin'
                    : '📍 Tap to place second pin on known distance'
                  : measurementMode 
                  ? mode === 'circle' 
                    ? '⭕ Tap center, then tap edge of circle'
                    : mode === 'rectangle'
                    ? '⬜ Tap first corner, then tap opposite corner'
                    : mode === 'freehand'
                    ? (() => {
                        // Dynamic helper for freehand drawing
                        if (isDrawingFreehand && freehandPath.length > 5) {
                          // Check if path self-intersects
                          const selfIntersects = doesPathSelfIntersect(freehandPath);
                          if (selfIntersects) {
                            return '❌ Cannot find surface area - path crossed itself';
                          } else {
                            return '💡 Connect end to first point to find surface area';
                          }
                        }
                        return '✏️ Touch and drag to draw freehand path';
                      })()
                    : mode === 'angle'
                    ? isMapMode
                      ? '🧭 Tap 3 points: start location, north reference, destination'
                      : '📐 Tap 3 points: start, vertex (center), end'
                    : '📏 Tap to place 2 points for distance'
                  : selectedMeasurementId
                  ? (() => {
                      const selected = measurements.find(m => m.id === selectedMeasurementId);
                      if (selected?.mode === 'circle') {
                        return '⭕ Selected Circle: Drag center to move • Drag edge to resize';
                      } else if (selected?.mode === 'rectangle') {
                        return '⬜ Selected Rectangle: Drag corners to resize • Drag edges to move';
                      } else if (selected?.mode === 'distance') {
                        return '📏 Selected Line: Drag endpoints to adjust • Tap line to move';
                      } else if (selected?.mode === 'angle') {
                        return isMapMode 
                          ? '🧭 Selected Azimuth: Drag points to adjust bearing'
                          : '📐 Selected Angle: Drag any point to adjust angle';
                      } else if (selected?.mode === 'freehand') {
                        return '✏️ Selected Path: Drag any point to reshape path';
                      }
                      return '✏️ Tap any measurement to select';
                    })()
                  : measurements.length > 0
                  ? '✏️ Edit Mode: Tap any measurement to select • Tap trash icon to delete'
                  : '👉👉👉 Swipe to Close Menu'
                }
              </Text>
            </View>
          )}
          
          {/* Locked notice */}
          {isPanZoomLocked && (
            <View style={{ backgroundColor: 'rgba(254, 243, 199, 1)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 }}>
              <Text style={{ color: 'rgba(146, 64, 14, 1)', fontSize: 12, textAlign: 'center' }}>
                🔒 Pan/zoom locked • Remove all measurements to unlock
              </Text>
            </View>
          )}
          
          {/* Action Buttons - Always show Save and Email */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
            <>
              <Pressable
                onPress={handleExport}
                hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                style={{
                  flex: 1,
                  backgroundColor: true ? 'rgba(0, 122, 255, 0.85)' : 'rgba(128, 128, 128, 0.3)',
                  borderRadius: 10,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="images-outline" size={12} color={true ? "white" : "rgba(128, 128, 128, 0.6)"} />
                <Text style={{ color: true ? 'white' : 'rgba(128, 128, 128, 0.6)', fontWeight: '600', fontSize: 11, marginLeft: 5 }}>Save</Text>
              </Pressable>
              
              <Pressable
                onPress={handleEmail}
                hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                style={{
                  flex: 1,
                  backgroundColor: true ? 'rgba(52, 199, 89, 0.85)' : 'rgba(128, 128, 128, 0.3)',
                  borderRadius: 10,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="mail-outline" size={12} color={true ? "white" : "rgba(128, 128, 128, 0.6)"} />
                <Text style={{ color: true ? 'white' : 'rgba(128, 128, 128, 0.6)', fontWeight: '600', fontSize: 11, marginLeft: 5 }}>Email</Text>
              </Pressable>
            </>

            {/* New Photo button - always visible in the same row */}
            <Pressable
              onPress={() => {
                // Longer delay to ensure gestures are fully released
                // requestAnimationFrame wasn't enough, use 100ms timeout
                setTimeout(() => {
                  handleReset();
                }, 100);
              }}
              hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
              style={{
                flex: 1,
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
          </View>
          
          {/* Pro status footer - REMOVED: Now donation-based via BattlingBots */}
        </View>
        </BlurView>
          </Animated.View>
        </GestureDetector>
      )}
      
      {/* Battling Bots Pro Upgrade Modal */}
      {/* REMOVED: Old Pro upgrade modal - Now using donation-based BattlingBots in MeasurementScreen */}

      {/* Help Button - Positioned next to AUTO LEVEL badge */}
      {(coinCircle || calibration || mapScale) && !showLockedInAnimation && !isCapturing && (
        <Pressable
          onPress={() => setShowHelpModal(true)}
          onLongPress={() => {
            // Secret: Long-press to clear saved email (for testing)
            setUserEmail(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            showAlert('Email Cleared', 'Your saved email has been cleared. You can now test the email prompt again!', 'success');
          }}
          style={{
            position: 'absolute',
            zIndex: 30, // Same as AUTO LEVEL badge
            top: insets.top + 16, // Same vertical position as AUTO LEVEL
            right: isAutoCaptured 
              ? 128  // Position right next to AUTO LEVEL badge (with small gap) - moved left
              : (coinCircle || calibration || mapScale) 
                ? 128  // Position left of Calibrated badge when no AUTO LEVEL - moved left
                : 16,  // Position in top right when no badges present
            backgroundColor: sessionColor ? `${sessionColor.main}dd` : 'rgba(100, 149, 237, 0.85)', // Session color with opacity
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: sessionColor ? sessionColor.main : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.35,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <Ionicons name="help-circle-outline" size={18} color="white" />
        </Pressable>
      )}

      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />

      {/* Chuck Norris Easter Egg Modal */}
      {showChuckNorrisModal && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              pointerEvents: 'none', // Allow touches through
            },
            chuckNorrisAnimatedStyle,
          ]}
        >
          <View
            style={{
              backgroundColor: '#DC143C', // Vibrant crimson red
              borderRadius: 24,
              padding: 36,
              marginHorizontal: 30,
              maxWidth: 380,
              borderWidth: 3,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              shadowColor: '#DC143C',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 25,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                textAlign: 'center',
                marginBottom: 16,
                letterSpacing: 4,
              }}
            >
              🥷 🔥 🥋 ⚡ 🥷
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 26,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {currentChuckNorrisJoke}
            </Text>
            <Text
              style={{
                fontSize: 32,
                textAlign: 'center',
                marginTop: 16,
                letterSpacing: 4,
              }}
            >
              ⚡ 🥋 🔥 🥷 ⚡
            </Text>
          </View>
        </Animated.View>
      )}
      
      {/* Label Modal */}
      <LabelModal 
        visible={showLabelModal} 
        onComplete={handleLabelComplete}
        onDismiss={handleLabelDismiss}
        initialValue={currentLabel}
        isMapMode={isMapMode}
        actionType={pendingAction || 'save'}
      />
      
      {/* Label Edit Modal - for editing existing measurement labels via double-tap */}
      <LabelModal
        visible={showLabelEditModal}
        onComplete={handleLabelEditComplete}
        onDismiss={handleLabelEditDismiss}
        initialValue={labelEditingMeasurementId ? measurements.find(m => m.id === labelEditingMeasurementId)?.label : null}
        initialDepth={labelEditingMeasurementId ? measurements.find(m => m.id === labelEditingMeasurementId)?.depth : undefined}
        initialDepthUnit={labelEditingMeasurementId ? measurements.find(m => m.id === labelEditingMeasurementId)?.depthUnit : undefined}
        hasArea={labelEditingMeasurementId ? (() => {
          const m = measurements.find(m => m.id === labelEditingMeasurementId);
          if (!m) return false;
          // Has area if: rectangle, circle, or closed polygon/freehand
          return m.mode === 'rectangle' || m.mode === 'circle' || (m.mode === 'polygon' && m.area !== undefined) || (m.mode === 'freehand' && m.isClosed && m.area !== undefined);
        })() : false}
        isMapMode={isMapMode}
        measurementMode={labelEditingMeasurementId ? measurements.find(m => m.id === labelEditingMeasurementId)?.mode : undefined}
        unitSystem={unitSystem}
      />
      
      {/* Email Prompt Modal */}
      <EmailPromptModal 
        visible={showEmailPromptModal} 
        onComplete={(email) => {
          if ((window as any)._emailPromptHandlers) {
            (window as any)._emailPromptHandlers.handleEmailComplete(email);
          }
        }}
        onDismiss={() => {
          if ((window as any)._emailPromptHandlers) {
            (window as any)._emailPromptHandlers.handleEmailDismiss();
          }
        }}
      />
      
      {/* Hidden view for capturing CAD canvas image (light/washed out, FULL unzoomed but with locked rotation) */}
      <View
        ref={fusionViewRef}
        collapsable={false}
        style={{
          position: 'absolute',
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          top: 0,
          left: -10000, // Position off-screen
          backgroundColor: 'white', // White background makes image appear lighter
        }}
      >
        {currentImageUri && (
          <Animated.View
            style={{
              position: 'absolute',
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              opacity: 0.35,
              transform: [
                { rotate: `${zoomRotation}deg` },
              ],
            }}
          >
            <Image
              source={{ uri: currentImageUri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              resizeMode="contain"
            />
          </Animated.View>
        )}
        
        {/* Title and coin info overlay - ALWAYS SHOW */}
        <View
          style={{
            position: 'absolute',
            top: insets.top + 16,
            left: 12,
          }}
          pointerEvents="none"
        >
          {/* Title - smaller secondary text */}
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
              {currentLabel || 'Measurement'}
            </Text>
            <Text style={{ color: '#A0A0A0', fontSize: 9, fontWeight: '500', marginTop: 1 }}>
              PanHandler Import
            </Text>
          </View>
          
          {/* Coin reference info */}
          {calibration && coinCircle && (
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: '500' }}>
                {coinCircle.coinName}
              </Text>
              <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: '500' }}>
                {unitSystem === 'imperial' 
                  ? formatMeasurement(coinCircle.coinDiameter, 'mm', 'imperial', 2)
                  : `${coinCircle.coinDiameter.toFixed(2)}mm`}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Hidden view for capturing CAD canvas image - ZOOMED (35% opacity, current zoom/pan) */}
      <View
        ref={fusionZoomedViewRef}
        collapsable={false}
        style={{
          position: 'absolute',
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          top: 0,
          left: -10000, // Position off-screen
          backgroundColor: 'transparent', // Transparent for PNG export
        }}
      >
        {currentImageUri && (
          <View
            style={{
              position: 'absolute',
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              opacity: 0.35,
              transform: [
                { translateX: zoomTranslateX },
                { translateY: zoomTranslateY },
                { scale: zoomScale },
                { rotate: `${zoomRotation}deg` },
              ],
            }}
          >
            <Image
              source={{ uri: currentImageUri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              resizeMode="contain"
            />
          </View>
        )}
        
        {/* Title and coin info overlay - ALWAYS SHOW */}
        <View
          style={{
            position: 'absolute',
            top: insets.top + 16,
            left: 12,
          }}
          pointerEvents="none"
        >
          {/* Title - smaller secondary text */}
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
              {currentLabel || 'Measurement'}
            </Text>
            <Text style={{ color: '#A0A0A0', fontSize: 9, fontWeight: '500', marginTop: 1 }}>
              PanHandler Import
            </Text>
          </View>
          
          {/* Coin reference info */}
          {calibration && coinCircle && (
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: '500' }}>
                {coinCircle.coinName}
              </Text>
              <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: '500' }}>
                {unitSystem === 'imperial' 
                  ? formatMeasurement(coinCircle.coinDiameter, 'mm', 'imperial', 2)
                  : `${coinCircle.coinDiameter.toFixed(2)}mm`}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Toast Notification - appears behind modals */}
      {showToast && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: insets.bottom + 100,
              alignSelf: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 25,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            },
            toastAnimatedStyle
          ]}
          pointerEvents="none"
        >
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      {/* NOTE: Opening quote Modal removed - now handled by App.tsx */}

      {/* Tetris Easter Egg Overlay - Static version */}
      <Modal
        visible={showTetris}
        transparent
        animationType="none"
        onRequestClose={() => {}}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            opacity: tetrisOpacity.value,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Static Tetris board with overflow */}
          <View
            style={{
              width: SCREEN_WIDTH - 40,
              height: SCREEN_HEIGHT * 0.7,
              borderWidth: 4,
              borderColor: '#00FF00',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Static overflowing Tetris blocks - creating a stacked board */}
            {Array.from({ length: 50 }).map((_, idx) => {
              const blockSize = 35;
              const blocksPerRow = Math.floor((SCREEN_WIDTH - 48) / blockSize);
              const row = Math.floor(idx / blocksPerRow);
              const col = idx % blocksPerRow;
              const colors = ['#00F0F0', '#F0F000', '#A000F0', '#F0A000', '#0000F0', '#00F000', '#F00000'];
              
              return (
                <View
                  key={`tetris-block-${idx}`}
                  style={{
                    position: 'absolute',
                    left: col * blockSize,
                    bottom: row * blockSize - 50, // Overflow at top
                    width: blockSize - 2,
                    height: blockSize - 2,
                    backgroundColor: colors[idx % colors.length],
                    borderWidth: 1.5,
                    borderColor: '#FFFFFF',
                    borderRadius: 3,
                  }}
                />
              );
            })}
            
            {/* GAME OVER text overlay */}
            <View
              style={{
                position: 'absolute',
                top: '35%',
                left: 0,
                right: 0,
                alignItems: 'center',
                backgroundColor: 'rgba(255, 0, 0, 0.4)',
                paddingVertical: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: '#FF0000',
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  borderRadius: 12,
                  borderWidth: 4,
                  borderColor: '#FFFFFF',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 40,
                    fontWeight: 'bold',
                    fontFamily: 'Courier',
                    textAlign: 'center',
                    textShadowColor: '#000000',
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 4,
                    letterSpacing: 4,
                  }}
                >
                  GAME OVER
                </Text>
              </View>
            </View>
          </View>
          
          {/* Centered congratulations text */}
          <Animated.View
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              alignItems: 'center',
              transform: [{ translateY: 100 }],
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: '#FFFF00',
                fontSize: 22,
                fontWeight: 'bold',
                fontFamily: 'Courier',
                textAlign: 'center',
                textShadowColor: '#FFFF00',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
                lineHeight: 32,
              }}
            >
              WE CAN PLAY GAMES TOO {';)'}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Courier',
                textAlign: 'center',
                marginTop: 12,
                textShadowColor: '#000000',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {"You're starting fresh"}
            </Text>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Map Scale Modal */}
      <VerbalScaleModal
        visible={showMapScaleModal}
        onComplete={(scale) => {
          console.log('🚨🚨🚨 MAP SCALE LOCK IN - BEFORE:', {
            showBlueprintPlacementModal,
            showBlueprintDistanceModal,
            isPlacingBlueprint
          });
          
          // NUCLEAR OPTION: Clear ALL blueprint-related state first
          setShowBlueprintPlacementModal(false);
          setShowBlueprintDistanceModal(false);
          setIsPlacingBlueprint(false);
          setBlueprintPoints([]);
          
          console.log('🚨🚨🚨 MAP SCALE LOCK IN - AFTER setting to false');
          
          setMapScale(scale);
          setIsMapMode(true);
          setShowMapScaleModal(false);
          
          // Create calibration from verbal scale
          // Convert screen measurement to pixels
          const DPI = 160; // Standard Android DPI (iOS ~163, but 160 is close enough)
          const pixelsPerInch = DPI;
          const pixelsPerCm = DPI / 2.54;
          
          const screenPixels = scale.screenUnit === 'cm' 
            ? scale.screenDistance * pixelsPerCm 
            : scale.screenDistance * pixelsPerInch;
          
          // Convert real-world distance to mm for calibration
          let realDistanceMm = 0;
          if (scale.realUnit === 'km') {
            realDistanceMm = scale.realDistance * 1000000; // km to mm
          } else if (scale.realUnit === 'mi') {
            realDistanceMm = scale.realDistance * 1609344; // mi to mm
          } else if (scale.realUnit === 'm') {
            realDistanceMm = scale.realDistance * 1000; // m to mm
          } else if (scale.realUnit === 'ft') {
            realDistanceMm = scale.realDistance * 304.8; // ft to mm
          }
          
          // Calculate pixels per mm
          const pixelsPerMm = screenPixels / realDistanceMm;
          
          // Create calibration object
          const newCalibration = {
            pixelsPerUnit: pixelsPerMm,
            unit: 'mm' as const,
            referenceDistance: realDistanceMm,
            calibrationType: 'verbal' as const,
            verbalScale: scale,
          };
          
          setCalibration(newCalibration);
          
          // FAILSAFE: Ensure blueprint modals stay closed after setting verbal calibration
          setTimeout(() => {
            setShowBlueprintPlacementModal(false);
            setShowBlueprintDistanceModal(false);
          }, 100);
          
          // Recalculate ALL existing measurements with new calibration (same as blueprint recalibration)
          if (measurements.length > 0) {
            console.log('🔄 Recalculating', measurements.length, 'measurements with new verbal scale calibration');
            // Pass the NEW calibration directly to ensure it uses the new scale
            const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m, newCalibration));
            
            // Update measurements immediately
            setMeasurements(recalibratedMeasurements);
            
            // Force unit system ref to null so the useEffect will recalculate display values
            // This ensures the UI updates with the new calibration
            prevUnitSystemRef.current = null;
            
            console.log('✅ Measurements recalculated with new verbal scale calibration');
          }
          
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
        onBlueprintMode={() => {
          // User wants to place points for blueprint scale
          setShowMapScaleModal(false);
          setShowBlueprintPlacementModal(true);
          setMenuHidden(true); // Hide menu when blueprint modal appears
        }}
        onDismiss={() => {
          // If dismissing without setting scale, turn off map mode and clear blueprint modals
          setIsMapMode(false);
          setShowMapScaleModal(false);
          setShowBlueprintPlacementModal(false);
          setShowBlueprintDistanceModal(false);
        }}
      />

      {/* Blueprint/Aerial Placement Modal - Only render if actually visible AND map scale modal is not open */}
      {showBlueprintPlacementModal && !showMapScaleModal && (
      <BlueprintPlacementModal
        key={`blueprint-${showBlueprintPlacementModal}-${showMapScaleModal}`}
        visible={true}
        mode={isAerialMode ? 'aerial' : 'blueprint'}
        onStartPlacement={() => {
          // User clicked "READY - PLACE PINS" button
          // NOW start measurement mode for blueprint placement
          setShowBlueprintPlacementModal(false);
          setIsPlacingBlueprint(true);
          setMeasurementMode(true); // Activate touch overlay for pin placement
          setShowCursor(true);
          setCursorPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        onDismiss={() => {
          // ALWAYS close the blueprint modal first, regardless of path
          setShowBlueprintPlacementModal(false);
          setBlueprintPoints([]);
          
          // If user came from "Known Scale" button directly (skipToBlueprintMode or skipToAerialMode),
          // dismissing without placing points should reset to camera for fresh start
          if (skipToBlueprintMode || skipToAerialMode) {
            console.log('🔄 Known Scale dismissed without calibration - resetting to camera');
            handleReset(); // Go back to camera screen
          } else {
            // Regular dismissal (from coin calibration → Map → Place Points, or recalibration)
            // Just close modal and stay on measurement screen
            console.log('📐 Blueprint modal dismissed - staying on measurement screen');
            setIsMapMode(false); // Turn off map mode if it was on
            setMenuHidden(false); // Show menu again
          }
        }}
      />
      )}


      {/* Blueprint Points Visualization */}
      {isPlacingBlueprint && blueprintPoints.length > 0 && (
        <Animated.View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 25,
          opacity: blueprintLineOpacity,
        }} pointerEvents="none">
          <Svg style={{ width: '100%', height: '100%' }}>
            {/* Draw line between points if we have 2 */}
            {blueprintPoints.length === 2 && (() => {
              const p0 = imageToScreen(blueprintPoints[0].x, blueprintPoints[0].y);
              const p1 = imageToScreen(blueprintPoints[1].x, blueprintPoints[1].y);
              return (
                <Line
                  x1={p0.x}
                  y1={p0.y}
                  x2={p1.x}
                  y2={p1.y}
                  stroke="rgba(100, 100, 100, 0.8)"
                  strokeWidth={3}
                  strokeDasharray="8,4"
                />
              );
            })()}
            
            {/* Draw circles for each point */}
            {blueprintPoints.map((point, idx) => {
              const screenPoint = imageToScreen(point.x, point.y);
              return (
                <React.Fragment key={idx}>
                  {/* Outer glow */}
                  <Circle
                    cx={screenPoint.x}
                    cy={screenPoint.y}
                    r={20}
                    fill="rgba(100, 100, 100, 0.3)"
                  />
                  {/* Main circle */}
                  <Circle
                    cx={screenPoint.x}
                    cy={screenPoint.y}
                    r={12}
                    fill="rgba(100, 100, 100, 0.8)"
                    stroke="white"
                    strokeWidth={3}
                  />
                  {/* Center dot */}
                  <Circle
                    cx={screenPoint.x}
                    cy={screenPoint.y}
                    r={3}
                    fill="white"
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        </Animated.View>
      )}

      {/* Blueprint Distance Input Modal */}
      <BlueprintDistanceModal
        visible={showBlueprintDistanceModal}
        mode={isAerialMode ? 'aerial' : 'blueprint'}
        onComplete={(distance, unit) => {
          // Fade out the line gracefully
          blueprintLineOpacity.value = withTiming(0, {
            duration: 400,
            easing: Easing.out(Easing.ease),
          });
          
          // Calculate pixel distance between the two points
          const dx = blueprintPoints[1].x - blueprintPoints[0].x;
          const dy = blueprintPoints[1].y - blueprintPoints[0].y;
          const pixelDistance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate pixels per unit
          const pixelsPerUnit = pixelDistance / distance;
          
          // Create calibration object
          const newCalibration = {
            pixelsPerUnit,
            unit,
            referenceDistance: distance,
            calibrationType: 'blueprint' as const,
            blueprintScale: { distance, unit }, // Store for display in badge
          };
          
          // Store calibration FIRST
          useStore.getState().setCalibration(newCalibration);
          
          // Recalculate ALL existing measurements with new calibration
          // Force immediate update by triggering unit system ref reset
          if (measurements.length > 0) {
            console.log('🔄 Recalculating', measurements.length, 'measurements with new blueprint calibration');
            console.log('📐 New calibration unit:', newCalibration.unit, 'Old unit was:', calibration?.unit);
            // Pass the NEW calibration directly to ensure it uses the new unit
            const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m, newCalibration));
            
            // Update measurements immediately
            setMeasurements(recalibratedMeasurements);
            
            // Force unit system ref to null so the useEffect will recalculate display values
            // This ensures the UI updates with the new calibration
            prevUnitSystemRef.current = null;
            
            console.log('✅ Measurements recalculated and unit system ref reset to force display update');
          }
          
          // Show menu again and clean up after fade
          setTimeout(() => {
            setMenuHidden(false);
            setShowBlueprintDistanceModal(false);
            setShowBlueprintPlacementModal(false); // CRITICAL: Also close the placement modal
            setBlueprintPoints([]);
            setIsMapMode(false);
            blueprintLineOpacity.value = 1; // Reset for next time
            
            // Unlock pan/zoom now that calibration is complete
            if (onPanZoomLockChange) {
              onPanZoomLockChange(false);
              console.log('🔓 Unlocking pan/zoom - blueprint calibration complete');
            }
          }, 400);
          
          // Success haptic
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          console.log('🎯 Blueprint calibration complete:', {
            pixelDistance,
            realDistance: distance,
            unit,
            pixelsPerUnit,
          });
        }}
        onDismiss={() => {
          // If user came from "Known Scale" button directly and dismisses without entering distance,
          // reset to camera for fresh start (same as dismissing placement modal)
          if (skipToBlueprintMode || skipToAerialMode) {
            console.log('🔄 Known Scale distance input dismissed without calibration - resetting to camera');
            handleReset(); // Go back to camera screen
          } else {
            // Regular dismissal (from coin calibration path or recalibration)
            // Cancel - fade out and clean up, stay on measurement screen
            console.log('📐 Blueprint distance input dismissed - cleaning up');
            blueprintLineOpacity.value = withTiming(0, {
              duration: 300,
              easing: Easing.out(Easing.ease),
            });
            
            setTimeout(() => {
              setMenuHidden(false);
              setShowBlueprintDistanceModal(false);
              setBlueprintPoints([]);
              setIsMapMode(false);
              blueprintLineOpacity.value = 1; // Reset for next time
              
              // Unlock pan/zoom when dismissing (cancelled calibration)
              if (onPanZoomLockChange) {
                onPanZoomLockChange(false);
                console.log('🔓 Unlocking pan/zoom - blueprint calibration cancelled');
              }
            }, 300);
          }
        }}
      />

      {/* Pan Tutorial Overlay - Shows on first load after calibration - moved down 10% */}
      {showPanTutorial && (
        <Animated.View
          style={[{
            position: 'absolute',
            top: SCREEN_HEIGHT / 2 - 40, // Moved down 10% (was -120, now -40)
            left: 40,
            right: 40,
            alignItems: 'center',
            pointerEvents: 'none',
          }, panTutorialAnimatedStyle]}
        >
          {/* Instructional Text - 15% BIGGER (confident & polished!) */}
          <Text
            style={{
              fontSize: 17, // Was 15, now ~15% bigger (rounded)
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              marginBottom: 21, // Was 18, now ~15% bigger (rounded)
              textShadowColor: 'rgba(0, 0, 0, 0.6)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
              lineHeight: 24, // Was 21, now ~15% bigger (rounded)
              letterSpacing: 0.3,
            }}
          >
            {"Pan around and align your photo\nusing the guides, then select\nyour measurement"}
          </Text>

          {/* Measurement Mode Icons - 15% BIGGER */}
          {/* Was gap: 16, now 18 (~15% bigger rounded) */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
            {/* Box */}
            <View style={{ alignItems: 'center' }}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Rect x="4" y="4" width="16" height="16" stroke="white" strokeWidth="2" fill="none" />
              </Svg>
            </View>

            {/* Circle */}
            <View style={{ alignItems: 'center' }}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" fill="none" />
              </Svg>
            </View>

            {/* Angle */}
            <View style={{ alignItems: 'center' }}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <Line x1="4" y1="20" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 10 20 A 8 8 0 0 1 8 12" stroke="white" strokeWidth="1.5" fill="none" />
              </Svg>
            </View>

            {/* Line */}
            <View style={{ alignItems: 'center' }}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Line x1="4" y1="12" x2="20" y2="12" stroke="white" strokeWidth="2" />
                <Circle cx="4" cy="12" r="3" fill="white" />
                <Circle cx="20" cy="12" r="3" fill="white" />
              </Svg>
            </View>

            {/* Freehand */}
            <View style={{ alignItems: 'center' }}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path 
                  d="M 4 12 Q 7 8, 10 12 T 16 12 Q 18 13, 20 10" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Save Success Modal - Glassmorphic & Beautiful */}
      {showSaveSuccessModal && (
        <Pressable
          onPress={() => setShowSaveSuccessModal(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 30,
              minWidth: 280,
            }}
          >
            {/* Success Icon */}
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Ionicons name="checkmark-circle" size={48} color="rgba(76, 175, 80, 1)" />
            </View>

            {/* Success Message */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: 'white',
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              Saved!
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Your measurements have been{'\n'}saved to Photos
            </Text>

            {/* Tap anywhere hint */}
            <Text
              style={{
                fontSize: 13,
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: 24,
                fontStyle: 'italic',
              }}
            >
              Tap anywhere to continue
            </Text>
          </View>
        </Pressable>
      )}

      {/* Smart Calibration Hint */}
      {showCalibrationHint && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            hintBackgroundStyle,
          ]}
        >
          <Pressable
            onPress={() => {
              setShowCalibrationHint(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <Animated.View style={hintCardStyle} pointerEvents="none">
            <BlurView
              intensity={100}
              tint="light"
              style={{
                padding: 28,
                borderRadius: 28,
                maxWidth: SCREEN_WIDTH * 0.85,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 12,
                overflow: 'hidden',
              }}
            >
              <View style={{ marginBottom: 16 }}>
                <Ionicons name="warning-outline" size={40} color="rgba(255, 255, 255, 0.95)" />
              </View>
              
              <Text style={{ 
                fontSize: 20, 
                fontWeight: '800', 
                color: 'white', 
                marginBottom: 10, 
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}>
                Measurements seem off?
              </Text>
              
              <Text style={{ 
                fontSize: 16, 
                color: 'rgba(255, 255, 255, 0.95)', 
                textAlign: 'center', 
                marginBottom: 20,
                fontWeight: '600',
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}>
                Check your calibration (upper right)
              </Text>
              
              <Text style={{ 
                fontSize: 13, 
                color: 'rgba(255, 255, 255, 0.7)', 
                textAlign: 'center', 
                fontStyle: 'italic',
                fontWeight: '500',
              }}>
                Tap anywhere to dismiss
              </Text>
            </BlurView>
          </Animated.View>
        </Animated.View>
      )}

      {/* Freehand Trial Offer Modal - First Time */}
      <Modal
        visible={showFreehandOfferModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFreehandOfferModal(false)}
      >
        <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
            onPress={() => {
              // Don't dismiss on backdrop tap - force user to make choice
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 400,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 30,
                elevation: 20,
              }}
            >
              {/* Typewriter message */}
              <TypewriterText
                text="Hey there! I noticed you're out of free freehand measurements. Would you like to upgrade to Pro for just $6.97 (normally $9.97)?"
                speed={25}
                style={{
                  fontSize: 16,
                  color: '#1C1C1E',
                  lineHeight: 24,
                  marginBottom: 24,
                }}
              />

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => {
                    setShowFreehandOfferModal(false);
                    setShowFreehandConfirmModal(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E' }}>
                    No Thanks
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setShowFreehandOfferModal(false);
                    setShowProModal(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#007AFF',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                    Upgrade Now
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </BlurView>
      </Modal>

      {/* Freehand Trial Confirm Modal - Second Chance */}
      <Modal
        visible={showFreehandConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFreehandConfirmModal(false)}
      >
        <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
            onPress={() => {
              // Don't dismiss on backdrop tap
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 400,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 30,
                elevation: 20,
              }}
            >
              {/* Typewriter message */}
              <TypewriterText
                text="Are you sure? This special offer won't be shown again."
                speed={25}
                style={{
                  fontSize: 16,
                  color: '#1C1C1E',
                  lineHeight: 24,
                  marginBottom: 24,
                }}
              />

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => {
                    setShowFreehandConfirmModal(false);
                    dismissFreehandOffer();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E' }}>
                    {"I'm Sure"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setShowFreehandConfirmModal(false);
                    setShowProModal(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#34C759',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                    Yes, Upgrade
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </BlurView>
      </Modal>

      {/* Alert Modal */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={() => {
          if (alertConfig.onConfirm) alertConfig.onConfirm();
          closeAlert();
        }}
        onClose={closeAlert}
      />
    </View>
  );
}
