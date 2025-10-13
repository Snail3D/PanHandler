// DimensionOverlay v2.3 - TEMP: Fingerprints disabled for cache workaround
// CACHE BUST v4.0 - Static Tetris - Force Bundle Refresh
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, Alert, Modal, Image, ScrollView, Linking, PixelRatio } from 'react-native';
import { Svg, Line, Circle, Path, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as MailComposer from 'expo-mail-composer';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { BlurView } from 'expo-blur';
import useStore from '../state/measurementStore';
import { formatMeasurement } from '../utils/unitConversion';
import HelpModal from './HelpModal';
import LabelModal from './LabelModal';
import PaywallModal from './PaywallModal';
import { getRandomQuote } from '../utils/makerQuotes';

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
};

type MeasurementMode = 'distance' | 'angle' | 'circle' | 'rectangle';

interface Measurement {
  id: string;
  points: Array<{ x: number; y: number }>;
  value: string;
  mode: MeasurementMode;
  // For circles: points[0] = center, points[1] = edge point (defines radius)
  // For rectangles: points[0] = first corner, points[1] = opposite corner
  radius?: number; // For circles
  width?: number;  // For rectangles
  height?: number; // For rectangles
}

interface DimensionOverlayProps {
  zoomScale?: number;
  zoomTranslateX?: number;
  zoomTranslateY?: number;
  zoomRotation?: number;
  viewRef?: React.RefObject<View | null>;
}

export default function DimensionOverlay({ 
  zoomScale = 1, 
  zoomTranslateX = 0, 
  zoomTranslateY = 0,
  zoomRotation = 0,
  viewRef: externalViewRef
}: DimensionOverlayProps = {}) {
  // CACHE BUST v4.0 - Verify new bundle is loaded
  console.log('✅ DimensionOverlay v4.0 loaded - Static Tetris active');
  
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
  const isAutoCaptured = useStore((s) => s.isAutoCaptured);
  const coinCircle = useStore((s) => s.coinCircle);
  const savedZoomState = useStore((s) => s.savedZoomState);
  const currentPoints = useStore((s) => s.currentPoints);
  const setCurrentPoints = useStore((s) => s.setCurrentPoints);
  const measurements = useStore((s) => s.completedMeasurements);
  const setMeasurements = useStore((s) => s.setCompletedMeasurements);
  const userEmail = useStore((s) => s.userEmail);
  const setUserEmail = useStore((s) => s.setUserEmail);
  const isProUser = useStore((s) => s.isProUser);
  const setIsProUser = useStore((s) => s.setIsProUser);
  const canSave = useStore((s) => s.canSave);
  const canEmail = useStore((s) => s.canEmail);
  const incrementSaveCount = useStore((s) => s.incrementSaveCount);
  const incrementEmailCount = useStore((s) => s.incrementEmailCount);
  const monthlySaveCount = useStore((s) => s.monthlySaveCount);
  const monthlyEmailCount = useStore((s) => s.monthlyEmailCount);
  
  // Pro upgrade modal
  const [showProModal, setShowProModal] = useState(false);
  const [proTapCount, setProTapCount] = useState(0);
  const proTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Paywall modal for halfway point (5 saves/emails)
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  
  // Label modal for save/email
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'email' | null>(null);
  const labelViewRef = useRef<View>(null); // For capturing photo with label
  const fusionViewRef = useRef<View>(null); // For capturing unzoomed transparent canvas
  const fusionZoomedViewRef = useRef<View>(null); // For capturing zoomed transparent canvas
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  
  // Selected measurement for delete/drag
  const [draggedMeasurementId, setDraggedMeasurementId] = useState<string | null>(null);
  const [resizingPoint, setResizingPoint] = useState<{ measurementId: string, pointIndex: number } | null>(null);
  const dragStartPos = useSharedValue({ x: 0, y: 0 });
  const dragCurrentPos = useSharedValue({ x: 0, y: 0 });
  const [didDrag, setDidDrag] = useState(false); // Track if user actually dragged
  
  // Lock-in animation states
  const [showLockedInAnimation, setShowLockedInAnimation] = useState(false);
  const [hasShownAnimation, setHasShownAnimation] = useState(coinCircle ? true : false); // Start true if coinCircle already exists
  const prevZoomRef = useRef({ scale: zoomScale, x: zoomTranslateX, y: zoomTranslateY });
  
  // Measurement mode states
  const [measurementMode, setMeasurementMode] = useState(false); // false = pan/zoom, true = place points
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState(false); // Track if cursor is snapped to horizontal/vertical
  const [lastHapticPosition, setLastHapticPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [lastHapticTime, setLastHapticTime] = useState<number>(Date.now());
  const [fingerTouches, setFingerTouches] = useState<Array<{x: number, y: number, id: string, pressure: number, seed: number}>>([]);
  const fingerOpacity = useSharedValue(0);
  const fingerScale = useSharedValue(1);
  const fingerRotation = useSharedValue(0);
  const cursorOffsetY = 40; // Reduced from 120 to ~1cm above finger
  const HAPTIC_DISTANCE = 2; // ~0.5mm on screen for frequent haptic feedback
  const MAGNIFICATION_SCALE = 1.2; // 20% zoom magnification
  
  // Initialize measurement mode based on whether there are existing measurements
  // If there are measurements on reload, pan/zoom should be locked
  useEffect(() => {
    if (measurements.length > 0) {
      // Pan/zoom is locked when measurements exist
      setMeasurementMode(false); // Keep in pan mode but locked
    }
  }, []); // Only run on mount
  
  // Menu states
  const [menuMinimized, setMenuMinimized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [menuHidden, setMenuHidden] = useState(false);
  const [tabSide, setTabSide] = useState<'left' | 'right'>('right'); // Which side the tab is on
  const menuTranslateX = useSharedValue(0);
  const tabPositionY = useSharedValue(SCREEN_HEIGHT / 2); // Draggable tab position
  
  // Inspirational quote overlay state
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<{text: string, author: string, year?: string} | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const quoteOpacity = useSharedValue(0);
  const [quoteTapCount, setQuoteTapCount] = useState(0);
  
  // Animated styles for quote overlay
  const quoteBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${quoteOpacity.value})`,
  }));
  
  const quoteContentStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));
  
  // Easter egg states
  const [calibratedTapCount, setCalibrateTapCount] = useState(0);
  const [autoLevelTapCount, setAutoLevelTapCount] = useState(0);
  const [showCalculatorWords, setShowCalculatorWords] = useState(false);
  const calibratedTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoLevelTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Undo long-press state
  const undoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Tetris Easter egg state - simplified static version
  const [showTetris, setShowTetris] = useState(false);
  const tetrisOpacity = useSharedValue(0);
  const [hasTriggeredTetris, setHasTriggeredTetris] = useState(false);
  
  // Show inspirational quote overlay
  const showQuoteOverlay = () => {
    const quote = getRandomQuote();
    setCurrentQuote(quote);
    setDisplayedText('');
    setQuoteTapCount(0);
    setShowQuote(true);
    
    // Smooth fade in with spring physics for buttery smoothness
    quoteOpacity.value = withSpring(1, {
      damping: 20,
      stiffness: 90,
      mass: 0.5,
    });
    
    // Type out the quote text
    const fullText = `"${quote.text}"`;
    const authorText = `- ${quote.author}${quote.year ? `, ${quote.year}` : ''}`;
    const completeText = `${fullText}\n\n${authorText}`;
    
    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character (normal reading speed)
    
    const typeInterval = setInterval(() => {
      if (currentIndex < completeText.length) {
        setDisplayedText(completeText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Auto-dismiss after 5 seconds of being fully displayed
        setTimeout(() => {
          dismissQuote();
        }, 5000);
      }
    }, typingSpeed);
    
    return () => clearInterval(typeInterval);
  };
  
  const dismissQuote = () => {
    quoteOpacity.value = withTiming(0, { 
      duration: 500,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1) // Smooth deceleration
    }, () => {
      runOnJS(setShowQuote)(false);
      runOnJS(setCurrentQuote)(null);
      runOnJS(setDisplayedText)('');
    });
  };
  
  const handleQuoteTap = () => {
    setQuoteTapCount(prev => prev + 1);
    if (quoteTapCount >= 2) {
      // User tapped 3+ times, dismiss immediately
      dismissQuote();
    }
  };
  
  // Calculator words for Easter egg (classic upside-down calculator words)
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
      // Activate Easter egg!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowCalculatorWords(true);
      setCalibrateTapCount(0);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowCalculatorWords(false);
      }, 5000);
    } else {
      // Reset counter after 2 seconds of no taps
      calibratedTapTimeoutRef.current = setTimeout(() => {
        setCalibrateTapCount(0);
      }, 2000);
    }
  };
  
  // Easter egg: AUTO LEVEL badge tap handler
  const handleAutoLevelTap = () => {
    // Clear existing timeout
    if (autoLevelTapTimeoutRef.current) {
      clearTimeout(autoLevelTapTimeoutRef.current);
    }
    
    const newCount = autoLevelTapCount + 1;
    setAutoLevelTapCount(newCount);
    
    if (newCount >= 7) {
      // Activate Easter egg!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAutoLevelTapCount(0);
      
      // Open YouTube video with autoplay
      const youtubeUrl = 'https://youtu.be/Aq5WXmQQooo?si=Ptp9PPm8Mou1TU98';
      Linking.openURL(youtubeUrl).catch(err => {
        Alert.alert('Error', 'Could not open video');
        console.error('Failed to open URL:', err);
      });
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
      tetrisOpacity.value = withTiming(0, { duration: 800 }, () => {
        runOnJS(setShowTetris)(false);
        
        // CLEAR ALL MEASUREMENTS! 🧹
        runOnJS(setMeasurements)([]);
        runOnJS(setCurrentPoints)([]);
        runOnJS(setHasTriggeredTetris)(false); // Allow trigger again if they rebuild
        
        // Success haptic for the reset
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
    }, 3000);
  };
  
  // Get color for measurement based on index
  const getMeasurementColor = (index: number, measurementMode: MeasurementMode) => {
    const colors = MEASUREMENT_COLORS[measurementMode];
    return colors[index % colors.length];
  };

  // Helper to check if tap is near any measurement point (works for all types)
  const getTappedMeasurementPoint = (tapX: number, tapY: number): { measurementId: string, pointIndex: number } | null => {
    const POINT_THRESHOLD = 40; // pixels
    
    for (const measurement of measurements) {
      // Check all points in the measurement
      for (let i = 0; i < measurement.points.length; i++) {
        const point = imageToScreen(measurement.points[i].x, measurement.points[i].y);
        
        const distToPoint = Math.sqrt(
          Math.pow(tapX - point.x, 2) + Math.pow(tapY - point.y, 2)
        );
        
        if (distToPoint < POINT_THRESHOLD) {
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

  // Helper to snap cursor to horizontal/vertical alignment with first point
  const snapCursorToAlignment = (cursorX: number, cursorY: number): { x: number, y: number, snapped: boolean } => {
    // Snap when placing second point in distance mode OR second point in angle mode (before vertex)
    const shouldSnap = (mode === 'distance' && currentPoints.length === 1) || 
                       (mode === 'angle' && currentPoints.length === 1);
    
    if (!shouldSnap) {
      return { x: cursorX, y: cursorY, snapped: false };
    }
    
    const firstPoint = imageToScreen(currentPoints[0].x, currentPoints[0].y);
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

  // Helper to snap cursor to nearby existing measurement points
  const snapToNearbyPoint = (cursorX: number, cursorY: number): { x: number, y: number, snapped: boolean } => {
    const SNAP_DISTANCE = 30; // pixels - very close range for magnetic snap
    
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
    // Safety check
    if (!p1 || !p2 || !p3 || p1.y === undefined || p2.y === undefined || p3.y === undefined) {
      console.warn('⚠️ calculateAngle called with undefined points');
      return '0°';
    }
    
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
        const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
        const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
        const minX = Math.min(p0.x, p1.x);
        const maxX = Math.max(p0.x, p1.x);
        const minY = Math.min(p0.y, p1.y);
        const maxY = Math.max(p0.y, p1.y);
        const onEdge = (
          (Math.abs(tapX - minX) < TAP_THRESHOLD && tapY >= minY && tapY <= maxY) ||
          (Math.abs(tapX - maxX) < TAP_THRESHOLD && tapY >= minY && tapY <= maxY) ||
          (Math.abs(tapY - minY) < TAP_THRESHOLD && tapX >= minX && tapX <= maxX) ||
          (Math.abs(tapY - maxY) < TAP_THRESHOLD && tapX >= minX && tapX <= maxX)
        );
        const inside = (tapX >= minX && tapX <= maxX && tapY >= minY && tapY <= maxY);
        if (onEdge || inside) return measurement.id;
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
        // Convert radius in pixels to diameter in mm/inches
        const radiusInUnits = radius / (calibration?.pixelsPerUnit || 1);
        const diameter = radiusInUnits * 2;
        value = `⌀ ${formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2)}`;
      } else {
        // Rectangle: calculate width and height
        const p0 = completedPoints[0];
        const p1 = completedPoints[1];
        const widthPx = Math.abs(p1.x - p0.x);
        const heightPx = Math.abs(p1.y - p0.y);
        width = widthPx / (calibration?.pixelsPerUnit || 1);
        height = heightPx / (calibration?.pixelsPerUnit || 1);
        const widthStr = formatMeasurement(width, calibration?.unit || 'mm', unitSystem, 2);
        const heightStr = formatMeasurement(height, calibration?.unit || 'mm', unitSystem, 2);
        value = `${widthStr} × ${heightStr}`;
      }
      
      // Save as completed measurement
      const newMeasurement: Measurement = {
        id: Date.now().toString(),
        points: completedPoints.map(p => ({ x: p.x, y: p.y })),
        value,
        mode,
        ...(radius !== undefined && { radius }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
      };
      
      setMeasurements([...measurements, newMeasurement]);
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
  
  // Cleanup undo long-press timers on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    };
  }, []);
  
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

  const handleClear = () => {
    // Remove one measurement at a time (last first)
    if (measurements.length > 0) {
      setMeasurements(measurements.slice(0, -1));
    } else if (currentPoints.length > 0) {
      // If no completed measurements, clear current points
      setCurrentPoints([]);
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
    
    // After 500ms delay, start repeating undo every 333ms (1/3 second)
    undoTimeoutRef.current = setTimeout(() => {
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
        
        if (currentMeasurements.length > 0) {
          setMeasurements(currentMeasurements.slice(0, -1));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (currentPointsState.length > 0) {
          setCurrentPoints([]);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 333); // Delete one every 1/3 second
    }, 500); // 500ms initial delay before repeating
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
    // Check if user can save (monthly limit for free users)
    if (!canSave()) {
      Alert.alert(
        'Monthly Limit Reached',
        `You have used all 10 saves this month. Upgrade to Pro for unlimited saves!\n\nUsed this month: ${monthlySaveCount}/10`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to Pro', onPress: () => setShowProModal(true) }
        ]
      );
      return;
    }
    
    // Show paywall at exactly 5 saves (halfway point)
    if (!isProUser && monthlySaveCount === 4) {
      setShowPaywallModal(true);
      return;
    }
    
    // Show label modal first
    setPendingAction('save');
    setShowLabelModal(true);
  };

  const performSave = async (label: string | null) => {
    if (!viewRef || !viewRef.current || !currentImageUri) {
      console.error('❌ Export failed: viewRef or currentImageUri is missing');
      Alert.alert('Export Error', 'Unable to capture measurement. Please try again.');
      return;
    }

    try {
      console.log('📸 Starting capture with label:', label);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to save images.');
        return;
      }

      console.log('📸 Hiding menu and capturing view...');
      
      // Hide menu for capture
      setIsCapturing(true);
      setCurrentLabel(label);
      
      // Wait a frame for the UI to update with label
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture measurements photo
      const measurementsUri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
      });

      console.log('📸 Captured measurements URI:', measurementsUri);
      
      // Save measurements photo with custom filename
      const measurementsFilename = label ? `${label}_Measurements` : 'PanHandler_Measurements';
      const measurementsAsset = await MediaLibrary.createAssetAsync(measurementsUri);
      
      // Capture CAD Canvas - Zoomed (35% opacity, shows current zoom/pan)
      if (fusionZoomedViewRef.current) {
        try {
          console.log('📸 Capturing zoomed CAD canvas...');
          
          const zoomedUri = await captureRef(fusionZoomedViewRef.current, {
            format: 'jpg',
            quality: 0.9,
            result: 'tmpfile',
          });
          
          await MediaLibrary.createAssetAsync(zoomedUri);
          console.log('✅ Saved zoomed CAD canvas!');
        } catch (error) {
          console.error('Failed to capture zoomed CAD canvas:', error);
        }
      }
      
      // Capture CAD Canvas - Full (35% opacity, unzoomed full image)
      if (fusionViewRef.current) {
        try {
          console.log('📸 Capturing full CAD canvas...');
          
          const fullUri = await captureRef(fusionViewRef.current, {
            format: 'jpg',
            quality: 0.9,
            result: 'tmpfile',
          });
          
          await MediaLibrary.createAssetAsync(fullUri);
          console.log('✅ Saved full CAD canvas!');
        } catch (error) {
          console.error('Failed to capture full CAD canvas:', error);
        }
      }
      
      // Clear state
      setIsCapturing(false);
      setCurrentLabel(null);
      
      console.log('✅ Save successful!');
      Alert.alert('Success', label ? `"${label}" saved to Photos!` : 'Measurement saved to Photos!');
      
      // Increment save counter for free users
      incrementSaveCount();
      
      // Haptic feedback for success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show inspirational quote overlay
      setTimeout(() => showQuoteOverlay(), 500);
    } catch (error) {
      setIsCapturing(false);
      setCurrentLabel(null);
      console.error('❌ Export error:', error);
      Alert.alert('Save Error', `Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEmail = async () => {
    // Check if user can email (monthly limit for free users)
    if (!canEmail()) {
      Alert.alert(
        'Monthly Limit Reached',
        `You have used all 10 emails this month. Upgrade to Pro for unlimited emails!\n\nUsed this month: ${monthlyEmailCount}/10`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to Pro', onPress: () => setShowProModal(true) }
        ]
      );
      return;
    }
    
    // Show paywall at exactly 5 emails (halfway point)
    if (!isProUser && monthlyEmailCount === 4) {
      setShowPaywallModal(true);
      return;
    }
    
    // Show label modal first
    setPendingAction('email');
    setShowLabelModal(true);
  };

  const performEmail = async (label: string | null) => {
    if (!viewRef || !viewRef.current || !currentImageUri) {
      console.error('❌ Email failed: viewRef or currentImageUri is missing');
      Alert.alert('Email Error', 'Unable to capture measurement. Please try again.');
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
      
      // Hide menu for capture and set label
      setIsCapturing(true);
      setCurrentLabel(label);
      
      // Wait a frame for the UI to update with label
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the image with measurements
      const uri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
      });
      
      // Show menu again and clear label
      setIsCapturing(false);
      setCurrentLabel(null);

      console.log('📸 Captured URI for email:', uri);

      // Build measurement text with scale information
      let measurementText = 'PanHandler Measurements\n';
      measurementText += '======================\n\n';
      
      // Add label if provided
      if (label) {
        measurementText += `Item: ${label}\n\n`;
      }
      
      // Add coin reference information at the top - simplified
      if (coinCircle) {
        const coinDiameterDisplay = unitSystem === 'imperial' 
          ? formatMeasurement(coinCircle.coinDiameter, 'mm', 'imperial', 2)
          : `${coinCircle.coinDiameter.toFixed(2)}mm`;
        measurementText += `Calibration Coin: ${coinCircle.coinName} (${coinDiameterDisplay})\n\n`;
      }
      
      measurementText += `Unit System: ${unitSystem === 'metric' ? 'Metric' : 'Imperial'}\n\n`;
      measurementText += 'Measurements:\n';
      measurementText += '-------------\n';
      
      measurements.forEach((m, idx) => {
        const color = getMeasurementColor(idx, m.mode);
        measurementText += `${idx + 1}. ${m.value} (${color.name})\n`;
      });
      
      // Add simple calibration information footer
      if (calibration && coinCircle) {
        measurementText += `\n\n═══ CAD Import Info ═══\n`;
        measurementText += `The transparent photos can be imported as canvas backgrounds.\n`;
        measurementText += `Calibrate using the reference coin:\n`;
        const coinDiameterDisplay = unitSystem === 'imperial' 
          ? formatMeasurement(coinCircle.coinDiameter, 'mm', 'imperial', 2)
          : `${coinCircle.coinDiameter.toFixed(2)}mm`;
        measurementText += `  ${coinCircle.coinName} = ${coinDiameterDisplay} diameter\n`;
      }
      
      // Add footer (only for non-Pro users)
      if (!isProUser) {
        measurementText += '\n\n\n';
        measurementText += '═══════════════════════════\n';
        measurementText += '   Made with the PanHandler App on iOS\n';
        measurementText += '═══════════════════════════';
      }

      console.log('📧 Opening email composer...');
      
      // Build recipients array - use saved email for both to/cc if available
      const recipients = emailToUse ? [emailToUse] : [];
      const ccRecipients = emailToUse ? [emailToUse] : [];
      
      // Prepare attachments with proper filenames
      const attachments: string[] = [];
      
      // 1. Measurements photo (labeled with all measurements)
      const measurementsFilename = label ? `${label}_Labeled.jpg` : 'PanHandler_Labeled.jpg';
      const measurementsDest = `${FileSystem.cacheDirectory}${measurementsFilename}`;
      await FileSystem.copyAsync({ from: uri, to: measurementsDest });
      attachments.push(measurementsDest);
      
      // 2. CAD Canvas - Zoomed (35% opacity, shows current zoom/pan, with title + coin info)
      if (fusionZoomedViewRef.current) {
        try {
          console.log('📸 Capturing zoomed CAD canvas for email...');
          
          const zoomedUri = await captureRef(fusionZoomedViewRef.current, {
            format: 'jpg',
            quality: 0.9,
            result: 'tmpfile',
          });
          
          const zoomedFilename = label ? `${label}_CAD_Zoomed.jpg` : 'PanHandler_CAD_Zoomed.jpg';
          const zoomedDest = `${FileSystem.cacheDirectory}${zoomedFilename}`;
          await FileSystem.copyAsync({ from: zoomedUri, to: zoomedDest });
          attachments.push(zoomedDest);
          
          console.log('✅ Added zoomed CAD canvas to email');
        } catch (error) {
          console.error('Failed to capture zoomed CAD canvas:', error);
        }
      }
      
      // 3. CAD Canvas - Full (35% opacity, unzoomed full image, with title + coin info)
      if (fusionViewRef.current) {
        try {
          console.log('📸 Capturing full CAD canvas for email...');
          
          const fullUri = await captureRef(fusionViewRef.current, {
            format: 'jpg',
            quality: 0.9,
            result: 'tmpfile',
          });
          
          const fullFilename = label ? `${label}_CAD_Full.jpg` : 'PanHandler_CAD_Full.jpg';
          const fullDest = `${FileSystem.cacheDirectory}${fullFilename}`;
          await FileSystem.copyAsync({ from: fullUri, to: fullDest });
          attachments.push(fullDest);
          
          console.log('✅ Added full CAD canvas to email');
        } catch (error) {
          console.error('Failed to capture full CAD canvas:', error);
        }
      }
      
      // Build subject with label
      const subject = label 
        ? `PanHandler Measurements - ${label}` 
        : 'PanHandler Measurements';
      
      // Compose email with attachments
      await MailComposer.composeAsync({
        recipients,
        ccRecipients,
        subject,
        body: measurementText,
        attachments,
      });
      
      console.log('✅ Email composer opened');
      
      // Increment email counter for free users (counts when composer opens)
      incrementEmailCount();
      
      // Show inspirational quote overlay
      setTimeout(() => showQuoteOverlay(), 500);
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
  const requiredPoints = mode === 'distance' ? 2 
    : mode === 'angle' ? 3 
    : mode === 'circle' ? 2  // center + edge point
    : 2;  // rectangle: 2 corners
  
  // Lock pan/zoom once any points are placed
  const isPanZoomLocked = hasAnyMeasurements;
  
  // Handle label modal completion
  const handleLabelComplete = (label: string | null) => {
    setShowLabelModal(false);
    
    if (pendingAction === 'save') {
      performSave(label);
    } else if (pendingAction === 'email') {
      performEmail(label);
    }
    
    setPendingAction(null);
  };
  
  const handleLabelDismiss = () => {
    setShowLabelModal(false);
    setPendingAction(null);
  };
  
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
        <Pressable
          onPress={handleCalibratedTap}
          className="absolute z-20"
          style={{
            top: isAutoCaptured ? insets.top + 50 : insets.top + 16,
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
        >
          <Ionicons name="checkmark-circle" size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
            Calibrated
          </Text>
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
                width: 44,
                height: 80,
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderTopLeftRadius: tabSide === 'right' ? 16 : 0,
                borderBottomLeftRadius: tabSide === 'right' ? 16 : 0,
                borderTopRightRadius: tabSide === 'left' ? 16 : 0,
                borderBottomRightRadius: tabSide === 'left' ? 16 : 0,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: tabSide === 'right' ? -2 : 2, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.3)',
                [tabSide === 'right' ? 'borderRightWidth' : 'borderLeftWidth']: 0,
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons 
                  name={tabSide === 'right' ? 'chevron-back' : 'chevron-forward'} 
                  size={20} 
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
              
              // Update cursor with final snapped position
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
            
            // For circle mode
            if (mode === 'circle') {
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
      {!measurementMode && measurements.length > 0 && (
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={(event) => {
            // Only respond to move if we're dragging or resizing
            return draggedMeasurementId !== null || resizingPoint !== null;
          }}
          onResponderGrant={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            
            // Check if tapping any measurement point first (distance, angle, circle, rectangle)
            const point = getTappedMeasurementPoint(pageX, pageY);
            if (point) {
              setResizingPoint(point);
              setDidDrag(false);
              dragStartPos.value = { x: pageX, y: pageY };
              dragCurrentPos.value = { x: pageX, y: pageY };
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              return;
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
              const imageCoords = screenToImage(pageX, pageY);
              
              const updatedMeasurements = measurements.map(m => {
                if (m.id === resizingPoint.measurementId) {
                  const newPoints = [...m.points];
                  newPoints[resizingPoint.pointIndex] = imageCoords;
                  
                  // Recalculate value based on measurement type
                  let newValue = m.value;
                  let width, height, radius;
                  
                  if (m.mode === 'distance') {
                    newValue = calculateDistance(newPoints[0], newPoints[1]);
                  } else if (m.mode === 'angle') {
                    newValue = calculateAngle(newPoints[0], newPoints[1], newPoints[2]);
                  } else if (m.mode === 'circle') {
                    const radiusPx = Math.sqrt(
                      Math.pow(newPoints[1].x - newPoints[0].x, 2) + 
                      Math.pow(newPoints[1].y - newPoints[0].y, 2)
                    );
                    radius = radiusPx / (calibration?.pixelsPerUnit || 1);
                    const diameter = radius * 2;
                    newValue = `⌀ ${formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2)}`;
                  } else if (m.mode === 'rectangle') {
                    const widthPx = Math.abs(newPoints[1].x - newPoints[0].x);
                    const heightPx = Math.abs(newPoints[1].y - newPoints[0].y);
                    width = widthPx / (calibration?.pixelsPerUnit || 1);
                    height = heightPx / (calibration?.pixelsPerUnit || 1);
                    const widthStr = formatMeasurement(width, calibration?.unit || 'mm', unitSystem, 2);
                    const heightStr = formatMeasurement(height, calibration?.unit || 'mm', unitSystem, 2);
                    newValue = `${widthStr} × ${heightStr}`;
                  }
                  
                  return {
                    ...m,
                    points: newPoints,
                    value: newValue,
                    ...(width !== undefined && { width }),
                    ...(height !== undefined && { height }),
                    ...(radius !== undefined && { radius }),
                  };
                }
                return m;
              });
              
              setMeasurements(updatedMeasurements);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                if (measurement && (measurement.mode === 'circle' || measurement.mode === 'rectangle')) {
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
                
                // Haptic feedback while dragging
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }
          }}
          onResponderRelease={() => {
            if (resizingPoint) {
              // Finished resizing
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else if (draggedMeasurementId) {
              // Finished dragging
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            
            // Always reset drag state
            setDraggedMeasurementId(null);
            setResizingPoint(null);
            setDidDrag(false);
          }}
        />
      )}

      {/* Floating cursor container */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }} pointerEvents="none">
        {/* Floating cursor */}
        {showCursor && (() => {
          // Determine which measurement this will be (if completing current or starting new)
          const nextMeasurementIndex = currentPoints.length === requiredPoints 
            ? measurements.length + 1  // Current measurement will be saved, this is the next one
            : measurements.length;      // This is for the current measurement being placed
          
          // Get the color for the next measurement
          const nextColor = getMeasurementColor(nextMeasurementIndex, mode);
          const cursorColor = nextColor.main;
          
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
                {/* Outer ring with next measurement color */}
                <Circle cx={50} cy={50} r={30} fill="none" stroke={cursorColor} strokeWidth="3" opacity={0.8} />
                {/* Inner circle with next measurement color */}
                <Circle cx={50} cy={50} r={15} fill={`${cursorColor}33`} stroke={cursorColor} strokeWidth="2" />
                {/* Crosshair lines with next measurement color */}
                <Line x1={10} y1={50} x2={35} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={65} y1={50} x2={90} y2={50} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={10} x2={50} y2={35} stroke={cursorColor} strokeWidth="2" />
                <Line x1={50} y1={65} x2={50} y2={90} stroke={cursorColor} strokeWidth="2" />
                
                {/* Neon yellow center dot - smaller and less glowy */}
                {/* Black outline for contrast */}
                <Circle cx={50} cy={50} r={2} fill="#000000" opacity={1} />
                {/* Minimal glow - just one layer */}
                <Circle cx={50} cy={50} r={2.5} fill="#FFFF00" opacity={0.3} />
                {/* Core neon yellow dot - smaller for precision */}
                <Circle cx={50} cy={50} r={1} fill="#FFFF00" opacity={1} />
              </Svg>
              <View style={{ position: 'absolute', top: -35, left: 0, right: 0, backgroundColor: cursorColor, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                  {mode === 'distance' && currentPoints.length === 0 && 'Point 1'}
                  {mode === 'distance' && currentPoints.length === 1 && 'Point 2'}
                  {mode === 'angle' && currentPoints.length === 0 && 'Point 1'}
                  {mode === 'angle' && currentPoints.length === 1 && 'Point 2 (vertex)'}
                  {mode === 'angle' && currentPoints.length === 2 && 'Point 3'}
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
        const nextMeasurementIndex = currentPoints.length === requiredPoints 
          ? measurements.length + 1 
          : measurements.length;
        const nextColor = getMeasurementColor(nextMeasurementIndex, mode);
        const fingerColor = nextColor.main;
        
        // Animated style for evaporation effect
        const evaporationStyle = useAnimatedStyle(() => ({
          opacity: fingerOpacity.value,
          transform: [
            { scale: fingerScale.value },
            { rotate: `${fingerRotation.value}deg` }
          ]
        }));
        
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

      {/* Subtle guide lines - only show in Pan mode after calibration */}
      {!measurementMode && calibration && (
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
        </View>
      )}

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
                    {/* Point markers */}
                    <Circle cx={p0.x} cy={p0.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={p0.x} cy={p0.y} r="6" fill={color.main} opacity="0.2" />
                    <Circle cx={p0.x} cy={p0.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
                    <Circle cx={p1.x} cy={p1.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={p1.x} cy={p1.y} r="6" fill={color.main} opacity="0.2" />
                    <Circle cx={p1.x} cy={p1.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
                  </React.Fragment>
                );
              } else if (measurement.mode === 'angle') {
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
                    <Line x1={p1.x} y1={p1.y} x2={p0.x} y2={p0.y} stroke={color.main} strokeWidth="2.5" strokeLinecap="round" />
                    <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color.main} strokeWidth="2.5" strokeLinecap="round" />
                    <Path d={generateArcPath(p0, p1, p2)} stroke={color.main} strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Point markers */}
                    <Circle cx={p0.x} cy={p0.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={p0.x} cy={p0.y} r="6" fill={color.main} opacity="0.2" />
                    <Circle cx={p0.x} cy={p0.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
                    <Circle cx={p1.x} cy={p1.y} r="9" fill={color.main} opacity="0.1" />
                    <Circle cx={p1.x} cy={p1.y} r="7" fill={color.main} opacity="0.2" />
                    <Circle cx={p1.x} cy={p1.y} r="5" fill={color.main} stroke="white" strokeWidth="1" />
                    <Circle cx={p2.x} cy={p2.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={p2.x} cy={p2.y} r="6" fill={color.main} opacity="0.2" />
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
                    {/* Center marker */}
                    <Circle cx={center.x} cy={center.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={center.x} cy={center.y} r="6" fill={color.main} opacity="0.2" />
                    <Circle cx={center.x} cy={center.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
                  </React.Fragment>
                );
              } else if (measurement.mode === 'rectangle') {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                
                return (
                  <React.Fragment key={measurement.id}>
                    {/* Glow layers */}
                    <Rect x={Math.min(p0.x, p1.x)} y={Math.min(p0.y, p1.y)} width={Math.abs(p1.x - p0.x)} height={Math.abs(p1.y - p0.y)} fill="none" stroke={color.glow} strokeWidth="12" opacity="0.15" />
                    <Rect x={Math.min(p0.x, p1.x)} y={Math.min(p0.y, p1.y)} width={Math.abs(p1.x - p0.x)} height={Math.abs(p1.y - p0.y)} fill="none" stroke={color.glow} strokeWidth="8" opacity="0.25" />
                    {/* Main rectangle */}
                    <Rect x={Math.min(p0.x, p1.x)} y={Math.min(p0.y, p1.y)} width={Math.abs(p1.x - p0.x)} height={Math.abs(p1.y - p0.y)} fill="none" stroke={color.main} strokeWidth="2.5" />
                    {/* Corner markers */}
                    <Circle cx={p0.x} cy={p0.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={p0.x} cy={p0.y} r="6" fill={color.main} opacity="0.2" />
                    <Circle cx={p0.x} cy={p0.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
                    <Circle cx={p1.x} cy={p1.y} r="8" fill={color.main} opacity="0.1" />
                    <Circle cx={p1.x} cy={p1.y} r="6" fill={color.main} opacity="0.2" />
                    <Circle cx={p1.x} cy={p1.y} r="4" fill={color.main} stroke="white" strokeWidth="1" />
                  </React.Fragment>
                );
              }
              return null;
            })}

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

            {/* Draw current point markers */}
            {currentPoints.map((point, index) => {
              const screenPos = imageToScreen(point.x, point.y);
              const nextColor = getMeasurementColor(measurements.length, mode);
              return (
                <React.Fragment key={point.id}>
                  <Circle cx={screenPos.x} cy={screenPos.y} r="8" fill={nextColor.main} opacity="0.1" />
                  <Circle cx={screenPos.x} cy={screenPos.y} r="6" fill={nextColor.main} opacity="0.2" />
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

          {/* Measurement labels for completed measurements with smart positioning */}
          {(() => {
            // Calculate initial positions for all labels, EXCLUDING rectangles (they have side labels only)
            const labelData = measurements
              .filter(m => m.mode !== 'rectangle')
              .map((measurement, idx) => {
              const color = getMeasurementColor(idx, measurement.mode);
              let screenX = 0, screenY = 0;
              if (measurement.mode === 'distance') {
                const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
                screenX = (p0.x + p1.x) / 2;
                screenY = (p0.y + p1.y) / 2 - 50;
              } else if (measurement.mode === 'angle') {
                const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
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
              }
              return { measurement, idx, color, screenX, screenY };
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
            return labelData.map(({ measurement, idx, color, screenX, screenY }) => (
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
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1.5 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {showCalculatorWords ? getCalculatorWord(measurement.value) : measurement.value}
                  </Text>
                </View>
              </View>
            ));
          })()}

          {/* Side labels for rectangles - Width on left, Height on top */}
          {measurements.filter(m => m.mode === 'rectangle').map((measurement, idx) => {
            const color = getMeasurementColor(measurements.indexOf(measurement), measurement.mode);
            const p0 = imageToScreen(measurement.points[0].x, measurement.points[0].y);
            const p1 = imageToScreen(measurement.points[1].x, measurement.points[1].y);
            
            const minX = Math.min(p0.x, p1.x);
            const maxX = Math.max(p0.x, p1.x);
            const minY = Math.min(p0.y, p1.y);
            const maxY = Math.max(p0.y, p1.y);
            const centerY = (minY + maxY) / 2;
            const centerX = (minX + maxX) / 2;
            
            // Calculate width and height with 2 decimals
            const widthPx = Math.abs(p1.x - p0.x) / zoomScale;
            const heightPx = Math.abs(p1.y - p0.y) / zoomScale;
            const widthValue = widthPx / (calibration?.pixelsPerUnit || 1);
            const heightValue = heightPx / (calibration?.pixelsPerUnit || 1);
            const widthLabel = formatMeasurement(widthValue, calibration?.unit || 'mm', unitSystem, 2);
            const heightLabel = formatMeasurement(heightValue, calibration?.unit || 'mm', unitSystem, 2);
            
            return (
              <React.Fragment key={`${measurement.id}-sides`}>
                {/* Width label on left side (vertical dimension) */}
                <View
                  style={{
                    position: 'absolute',
                    left: minX - 70,
                    top: centerY - 15,
                  }}
                  pointerEvents="none"
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
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                      H: {showCalculatorWords ? getCalculatorWord(heightLabel) : heightLabel}
                    </Text>
                  </View>
                </View>
                
                {/* Length label on top side (horizontal dimension) */}
                <View
                  style={{
                    position: 'absolute',
                    left: centerX - 40,
                    top: minY - 35,
                  }}
                  pointerEvents="none"
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
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                      L: {showCalculatorWords ? getCalculatorWord(widthLabel) : widthLabel}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}

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
              const diameter = radius * 2 * (calibration?.pixelsPerUnit || 1);
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
          
          {/* Label and scale info - upper-left corner (always visible when capturing) */}
          {currentLabel && (
            <View
              style={{
                position: 'absolute',
                top: insets.top + 16,
                left: 12,
              }}
              pointerEvents="none"
            >
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  marginBottom: 4,
                }}
              >
                <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>
                  {currentLabel}
                </Text>
              </View>
              
              {calibration && (
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 5,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: '500' }}>
                    CAD Scale: {(1 / calibration.pixelsPerUnit).toFixed(6)} mm/px
                  </Text>
                  {coinCircle && (
                    <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: '500' }}>
                      Ref: {coinCircle.coinName}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Measurement legend in upper-left corner - only show if there are measurements */}
          {measurements.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: currentLabel ? insets.top + 16 + 70 : insets.top + 16,
                left: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 4,
              }}
              pointerEvents="none"
            >
              {measurements.map((measurement, idx) => {
                const color = getMeasurementColor(idx, measurement.mode);
                return (
                  <View
                    key={`legend-${measurement.id}`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 1,
                    }}
                  >
                    {/* Line number */}
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '600', marginRight: 3 }}>
                      {idx + 1}.
                    </Text>
                    {/* Color indicator */}
                    <View
                      style={{
                        width: 12,
                        height: 8,
                        backgroundColor: color.main,
                        borderRadius: 2,
                        marginRight: 4,
                      }}
                    />
                    {/* Measurement value */}
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                      {showCalculatorWords ? getCalculatorWord(measurement.value) : measurement.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
          
          {/* "Made with PanHandler" banner - bottom center (only when capturing/saving) */}
          {!isCapturing && !isProUser && (
            <View
              style={{
                position: 'absolute',
                bottom: insets.bottom + 20,
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
              pointerEvents="none"
            >
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '500' }}>
                  Made with PanHandler
                </Text>
                <Text style={{ color: '#A0A0A0', fontSize: 9, fontWeight: '400', marginLeft: 6 }}>
                  • Remove with Pro
                </Text>
              </View>
            </View>
          )}
      </View>

      {/* Auto-capture badge - top-right corner (OUTSIDE viewRef to allow taps) */}
      {isAutoCaptured && (
        <Pressable
          onPress={handleAutoLevelTap}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 12,
            backgroundColor: 'rgba(0, 200, 0, 0.9)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 30,
          }}
        >
          <Ionicons name="flash" size={12} color="white" />
          <Text style={{ color: 'white', fontSize: 8, fontWeight: '700', marginLeft: 3 }}>
            AUTO LEVEL
          </Text>
        </Pressable>
      )}

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
                
                {/* Header with undo button and hide menu on same line */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginBottom: (measurements.length > 0 || currentPoints.length > 0) ? 8 : 16, 
                  position: 'relative' 
                }}>
                  {/* Center: Undo button - only show if there are measurements or current points */}
                  {(measurements.length > 0 || currentPoints.length > 0) && (
                    <Pressable
                      onPressIn={startUndoLongPress}
                      onPressOut={stopUndoLongPress}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.35)',
                        borderRadius: 8,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderWidth: 0.5,
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <Image 
                        source={require('../../assets/snail-logo.png')} 
                        style={{ width: 16, height: 16, opacity: 0.6 }}
                        resizeMode="contain"
                      />
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontWeight: '600',
                        fontSize: 14,
                        marginLeft: 5,
                      }}>
                        {measurements.length > 0 
                          ? `Undo (${measurements.length})` 
                          : 'Clear'}
                      </Text>
                    </Pressable>
                  )}
                  
                  {/* Right side: Hide menu text and button - positioned absolutely */}
                  <View style={{ position: 'absolute', right: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.4)', marginRight: 6 }}>
                      Hide menu
                    </Text>
                    <Pressable
                      onPress={collapseMenu}
                      style={{
                        width: 28,
                        height: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.5)" />
                    </Pressable>
                  </View>
                </View>

          {/* Mode Toggle: Edit/Move vs Measure */}
          <View className="flex-row mb-2" style={{ backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: 9, padding: 1.5 }}>
            <Pressable
              onPress={() => {
                setMeasurementMode(false);
                setShowCursor(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                paddingVertical: 6,
                borderRadius: 7.5,
                backgroundColor: !measurementMode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name={isPanZoomLocked ? "hand-left-outline" : "move-outline"}
                  size={14} 
                  color={!measurementMode ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'} 
                />
                <Text style={{
                  marginLeft: 4,
                  fontWeight: '600',
                  fontSize: 12,
                  color: !measurementMode ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  {isPanZoomLocked ? 'Edit' : 'Pan'}
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
                paddingVertical: 6,
                borderRadius: 7.5,
                backgroundColor: measurementMode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name="create-outline" 
                  size={14} 
                  color={measurementMode ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} 
                />
                <Text style={{
                  marginLeft: 4,
                  fontWeight: '600',
                  fontSize: 12,
                  color: measurementMode ? '#34C759' : 'rgba(0, 0, 0, 0.45)'
                }}>
                  Measure
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Measurement Type Toggle - 2x2 Grid */}
          <View style={{ marginBottom: 8 }}>
            {/* Row 1: Distance and Angle */}
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
                  {/* Custom distance icon: two points with line */}
                  <Svg width={18} height={18} viewBox="0 0 16 16">
                    <Line x1="3" y1="8" x2="13" y2="8" stroke={mode === 'distance' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.5" />
                    <Circle cx="3" cy="8" r="2" fill={mode === 'distance' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'} />
                    <Circle cx="13" cy="8" r="2" fill={mode === 'distance' ? '#007AFF' : 'rgba(0, 0, 0, 0.45)'} />
                  </Svg>
                  <Text style={{
                    marginLeft: 4,
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 12,
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
                  {/* Custom angle icon: 45 degree acute angle with arc and measurement marks */}
                  <Svg width={18} height={18} viewBox="0 0 16 16">
                    {/* Acute angle lines - 45 degrees */}
                    <Line x1="3" y1="13" x2="13" y2="3" stroke={mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.5" strokeLinecap="round" />
                    <Line x1="3" y1="13" x2="13" y2="13" stroke={mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.5" strokeLinecap="round" />
                    {/* Angle arc showing acute angle */}
                    <Path d="M 7 13 A 5.66 5.66 0 0 1 6 8" stroke={mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1.3" fill="none" />
                    {/* Small tick marks on arc to show measurement */}
                    <Line x1="6" y1="12" x2="6.8" y2="12.8" stroke={mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1" strokeLinecap="round" />
                    <Line x1="5.2" y1="10" x2="4.4" y2="10.2" stroke={mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'} strokeWidth="1" strokeLinecap="round" />
                  </Svg>
                  <Text style={{
                    marginLeft: 4,
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 12,
                    color: mode === 'angle' ? '#34C759' : 'rgba(0, 0, 0, 0.45)'
                  }}>
                    Angle
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Row 2: Circle and Rectangle */}
            <View className="flex-row" style={{ backgroundColor: 'rgba(120, 120, 128, 0.18)', borderRadius: 9, padding: 1.5 }}>
              <Pressable
                onPress={() => {
                  setMode('circle');
                  setCurrentPoints([]);
                  setMeasurementMode(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 5,
                  borderRadius: 7.5,
                  backgroundColor: mode === 'circle' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons 
                    name="ellipse-outline" 
                    size={18} 
                    color={mode === 'circle' ? '#EF4444' : 'rgba(0, 0, 0, 0.45)'} 
                  />
                  <Text style={{
                    marginLeft: 4,
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 12,
                    color: mode === 'circle' ? '#EF4444' : 'rgba(0, 0, 0, 0.45)'
                  }}>
                    Circle
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMode('rectangle');
                  setCurrentPoints([]);
                  setMeasurementMode(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 5,
                  borderRadius: 7.5,
                  backgroundColor: mode === 'rectangle' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons 
                    name="square-outline" 
                    size={18} 
                    color={mode === 'rectangle' ? '#DC2626' : 'rgba(0, 0, 0, 0.45)'} 
                  />
                  <Text style={{
                    marginLeft: 4,
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 12,
                    color: mode === 'rectangle' ? '#DC2626' : 'rgba(0, 0, 0, 0.45)'
                  }}>
                    Box
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Unit System Toggle: Metric vs Imperial - Moved below measurement types */}
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

          {/* Tip */}
          {measurements.length === 0 && currentPoints.length === 0 && (
            <View className={`${measurementMode ? 'bg-green-50' : 'bg-blue-50'} rounded-lg px-3 py-2 mb-3`}>
              <Text className={`${measurementMode ? 'text-green-800' : 'text-blue-800'} text-xs text-center`}>
                {measurementMode 
                  ? mode === 'circle' 
                    ? '⭕ Press center, drag to size, release to finish'
                    : mode === 'rectangle'
                    ? '⬜ Tap first corner, then tap opposite corner'
                    : '💡 Tap to place points • Pan/zoom will lock after first point'
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

          
          {/* Status/Result Display */}
          {currentPoints.length === 0 && measurements.length === 0 && measurementMode && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="finger-print-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium flex-1">
                {mode === 'distance' && 'Tap to place 2 points'}
                {mode === 'angle' && 'Tap to place 3 points (vertex in center)'}
                {mode === 'circle' && 'Tap center, then tap edge of circle'}
                {mode === 'rectangle' && 'Tap to place 2 corners'}
              </Text>
            </View>
          )}
          
          {/* Action Buttons - Always show Save and Email */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
            <>
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
            </>

            {/* New Photo button - always visible in the same row */}
            <Pressable
              onPress={handleReset}
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
              marginTop: 4,
              paddingVertical: 1,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, color: 'rgba(0, 0, 0, 0.4)', fontWeight: '500' }}>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <BlurView
              intensity={100}
              tint="light"
              style={{ borderRadius: 24, overflow: 'hidden', width: '100%', maxWidth: 420, marginVertical: 20 }}
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
                    Unlock unlimited precision
                  </Text>
                </View>
                
                {/* Usage Tracker - Only show for free users */}
                {!isProUser && (
                  <View style={{ backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 12, textAlign: 'center' }}>
                      YOUR MONTHLY USAGE
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                          <Text style={{ fontSize: 28, fontWeight: 'bold', color: monthlySaveCount >= 10 ? '#FF3B30' : '#007AFF' }}>
                            {10 - monthlySaveCount}
                          </Text>
                          <Text style={{ fontSize: 16, color: '#666', marginLeft: 2 }}>/10</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#666' }}>Saves Left</Text>
                      </View>
                      <View style={{ width: 1, backgroundColor: '#D1D5DB', marginHorizontal: 12 }} />
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                          <Text style={{ fontSize: 28, fontWeight: 'bold', color: monthlyEmailCount >= 10 ? '#FF3B30' : '#007AFF' }}>
                            {10 - monthlyEmailCount}
                          </Text>
                          <Text style={{ fontSize: 16, color: '#666', marginLeft: 2 }}>/10</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#666' }}>Emails Left</Text>
                      </View>
                    </View>
                  </View>
                )}
                
                {/* Comparison Chart */}
                <View style={{ marginBottom: 20 }}>
                  {/* Table Header */}
                  <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#E5E7EB', paddingBottom: 12, marginBottom: 12 }}>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#666' }}>FEATURE</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#666' }}>FREE</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#007AFF' }}>PRO</Text>
                    </View>
                  </View>
                  
                  {/* Table Rows */}
                  {[
                    { feature: 'Saves per month', free: '10', pro: '∞' },
                    { feature: 'Emails per month', free: '10', pro: '∞' },
                    { feature: 'Measurements per photo', free: '∞', pro: '∞' },
                    { feature: 'Remove watermarks', free: false, pro: true },
                  ].map((row, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: idx < 3 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#333' }}>{row.feature}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                          ) : (
                            <Ionicons name="close-circle" size={20} color="#D1D5DB" />
                          )
                        ) : (
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>{row.free}</Text>
                        )}
                      </View>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                          ) : (
                            <Ionicons name="close-circle" size={20} color="#D1D5DB" />
                          )
                        ) : (
                          <Text style={{ fontSize: 16, fontWeight: '700', color: '#007AFF' }}>{row.pro}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
                
                {/* Price */}
                <View style={{ backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#007AFF' }}>$9.97</Text>
                  <Text style={{ fontSize: 13, color: '#666' }}>One-time purchase • Lifetime access</Text>
                </View>
                
                {/* Purchase Button */}
                <Pressable
                  onPress={() => {
                    setShowProModal(false);
                    // Here you would integrate actual payment (Stripe, RevenueCat, etc.)
                    Alert.alert('Pro Upgrade', 'Payment integration would go here. For now, tap the footer 5 times fast to unlock!');
                  }}
                  style={{ backgroundColor: '#007AFF', borderRadius: 14, paddingVertical: 16, marginBottom: 12 }}
                >
                  <Text style={{ color: 'white', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Purchase Pro</Text>
                </Pressable>
                
                {/* Restore Purchase Button */}
                <Pressable
                  onPress={() => {
                    Alert.alert('Restore Purchase', 'Checking for previous purchases...\n\nThis would connect to your payment provider (App Store, Google Play, etc.)');
                  }}
                  style={{ paddingVertical: 12, marginBottom: 8 }}
                >
                  <Text style={{ color: '#007AFF', fontSize: 15, textAlign: 'center', fontWeight: '500' }}>Restore Purchase</Text>
                </Pressable>
                
                {/* Maybe Later Button */}
                <Pressable
                  onPress={() => setShowProModal(false)}
                  style={{ paddingVertical: 12 }}
                >
                  <Text style={{ color: '#666', fontSize: 15, textAlign: 'center' }}>Maybe Later</Text>
                </Pressable>
              </View>
            </BlurView>
          </ScrollView>
        </View>
      </Modal>

      {/* Help Button - Floating centered horizontally */}
      {!menuHidden && !isCapturing && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 20,
            left: SCREEN_WIDTH / 2 - 13,
            zIndex: 50,
          }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={() => setShowHelpModal(true)}
            style={{
              backgroundColor: 'rgba(0, 122, 255, 0.9)',
              width: 26,
              height: 26,
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Ionicons name="help-circle-outline" size={16} color="white" />
          </Pressable>
        </View>
      )}

      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {/* Label Modal */}
      <LabelModal 
        visible={showLabelModal} 
        onComplete={handleLabelComplete}
        onDismiss={handleLabelDismiss}
      />
      
      {/* Hidden view for capturing CAD canvas image (light/washed out, zoomed view matching measurements) */}
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
                { translateX: zoomTranslateX },
                { translateY: zoomTranslateY },
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
          {/* Title */}
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>
              {currentLabel || 'PanHandler Measurements'}
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
          {/* Title */}
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>
              {currentLabel || 'PanHandler Measurements'}
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
      
      {/* Inspirational Quote Overlay */}
      <Modal
        visible={showQuote}
        transparent
        animationType="none"
        onRequestClose={dismissQuote}
      >
        <Animated.View
          style={[
            {
              flex: 1,
            },
            quoteBackgroundStyle
          ]}
        >
          <Pressable
            onPress={handleQuoteTap}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
            }}
          >
            <Animated.View
              style={[
                {
                  maxWidth: 600,
                },
                quoteContentStyle
              ]}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: '400',
                  textAlign: 'center',
                  lineHeight: 32,
                  textShadowColor: 'rgba(255, 255, 255, 0.3)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                  fontFamily: 'System',
                  letterSpacing: 0.5,
                }}
              >
                {displayedText}
              </Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>
      
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
      
      {/* Paywall Modal - Shown at 5 saves/emails */}
      <PaywallModal
        visible={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUpgrade={() => {
          setShowPaywallModal(false);
          setShowProModal(true);
        }}
        remainingSaves={10 - monthlySaveCount}
        remainingEmails={10 - monthlyEmailCount}
      />
    </>
  );
}
