import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Dimensions, TextInput, Keyboard, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Circle, Defs, RadialGradient, Stop, Path, Rect, Mask } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';
import ZoomableImage from './ZoomableImageV2';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, Easing, withTiming } from 'react-native-reanimated';
import useStore from '../state/measurementStore';
import TouchOverlayFingerprints from './TouchOverlayFingerprints';
import { extractDroneMetadata, DroneMetadata } from '../utils/droneEXIF';
import { CoinIcon } from './CalibrationIcons';
import {
  scaleFontSize,
  scalePadding,
  scaleMargin,
  scaleSize,
  scaleBorderRadius,
  scaleIconSize
} from '../utils/deviceScale';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Vibrant color palette for the circle/text (same as measurement colors)
const VIBRANT_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Green
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

interface CoinCalibrationProps {
  imageUri: string;
  sessionColor?: { main: string; glow: string }; // Optional session color from camera for visual continuity
  onComplete: (calibrationData: {
    pixelsPerUnit: number;
    unit: string;
    referenceDistance: number;
    coinCircle: {
      centerX: number;
      centerY: number;
      radius: number;
      coinName: string;
      coinDiameter: number;
    };
    initialZoom: {
      scale: number;
      translateX: number;
      translateY: number;
    };
  }) => void;
  onCancel: () => void;
  onHelp?: () => void;
}

// ═══════════════════════════════════════════════════════════════
// COIN CALIBRATION SCREEN - Zoom and align coin for scale reference
// User pinches/zooms to fit the coin into the calibration circle
// ═══════════════════════════════════════════════════════════════
export default function CoinCalibration({
  imageUri,
  sessionColor,
  onComplete,
  onCancel,
  onHelp,
}: CoinCalibrationProps) {
  const insets = useSafeAreaInsets();
  const hasSeenPinchTutorial = useStore((s) => s.hasSeenPinchTutorial);
  const setHasSeenPinchTutorial = useStore((s) => s.setHasSeenPinchTutorial);
  const [showTutorial, setShowTutorial] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  
  // Drone detection state
  const [droneData, setDroneData] = useState<DroneMetadata | null>(null);
  const [isDroneDetected, setIsDroneDetected] = useState(false);
  
  // Lock-in button fade-in animation
  const lockInOpacity = useSharedValue(0);
  const [hasUserPanned, setHasUserPanned] = useState(false);
  
  // Pinch tutorial animation values
  const leftFingerX = useSharedValue(SCREEN_WIDTH / 2 - 30);
  const leftFingerY = useSharedValue(SCREEN_HEIGHT * 0.33 + 160); // Just below the coin circle (inside visible area)
  const rightFingerX = useSharedValue(SCREEN_WIDTH / 2 + 30);
  const rightFingerY = useSharedValue(SCREEN_HEIGHT * 0.33 + 160); // Just below the coin circle (inside visible area)
  const tutorialOpacity = useSharedValue(0);
  const coinTextOpacity = useSharedValue(0); // For "select coin" text
  const arrowOpacity = useSharedValue(0); // For arrow pointing to coin selector
  const instructionTextOpacity = useSharedValue(0); // For zoom-responsive instruction text (fades in when zoomed out)
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  const initialZoomScale = useRef(1);
  
  // Coin selection state
  const lastSelectedCoin = useStore((s) => s.lastSelectedCoin);
  const setLastSelectedCoin = useStore((s) => s.setLastSelectedCoin);
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoinReference[]>([]);
  const [showCoinSelector, setShowCoinSelector] = useState(false);

  // Track haptic timers for cleanup
  const hapticTimersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Coin selector fade animation
  const coinSelectorOpacity = useSharedValue(0);
  const coinSelectorTranslateY = useSharedValue(-20);
  
  // Animate coin selector in/out
  useEffect(() => {
    if (showCoinSelector) {
      coinSelectorOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      coinSelectorTranslateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    } else {
      coinSelectorOpacity.value = withTiming(0, { duration: 200 });
      coinSelectorTranslateY.value = withTiming(-20, { duration: 200 });
    }
  }, [showCoinSelector]);
  
  const coinSelectorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: coinSelectorOpacity.value,
    transform: [{ translateY: coinSelectorTranslateY.value }],
  }));
  
  // Use session color if provided (from camera screen), otherwise fallback to random for backwards compatibility
  const [currentColor] = useState(() => {
    if (sessionColor) {
      return sessionColor.main; // Use main color for consistency
    }
    return VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
  });
  
  // Get color name for instructions
  const getColorName = (color: string): string => {
    const colorNames: Record<string, string> = {
      '#3B82F6': 'blue',
      '#8B5CF6': 'purple',
      '#EC4899': 'pink',
      '#F59E0B': 'amber',
      '#10B981': 'green',
      '#EF4444': 'red',
      '#06B6D4': 'cyan',
    };
    return colorNames[color] || 'colored';
  };
  
  // Rotating ring animation for circle edge
  const ringDashOffset = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Start elegant pulsing animation for text and ring (always show)
    // Calculate circumference for dash offset animation
    const circumference = 2 * Math.PI * referenceRadiusPixels;
    
    // Animate dash offset to create spinning effect (slowed down to reduce heat)
    ringDashOffset.value = withRepeat(
      withTiming(circumference, { duration: 8000, easing: Easing.linear }), // 8s instead of 4s
      -1, // Infinite loop
      false
    );
    
    // Sexy pulsing opacity - breathes in and out (slowed down to reduce heat)
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) }), // 2.5s instead of 1.5s
        withTiming(0.3, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) })  // 2.5s instead of 1.5s
      ),
      -1, // Infinite pulse
      false
    );
  }, []);
  
  // Animated style for ring opacity only
  const animatedRingOpacityStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));
  
  // Pulsing opacity without rotation (for text)
  const animatedTextPulseStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  // Load last selected coin on mount
  useEffect(() => {
    if (lastSelectedCoin) {
      const coin = getCoinByName(lastSelectedCoin);
      if (coin) {
        setSelectedCoin(coin);
        // Don't open selector if we have a valid coin
      } else {
        // Last coin name exists but coin not found - open selector immediately
        setShowCoinSelector(true);
      }
    } else {
      // No last selected coin - use Quarter as default AND open selector
      const defaultCoin = getCoinByName('Quarter');
      if (defaultCoin) {
        setSelectedCoin(defaultCoin);
      }
      setShowCoinSelector(true);
    }
  }, [lastSelectedCoin]);

  // Update search results
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchCoins(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Detect drone photo on mount
  useEffect(() => {
    const detectDrone = async () => {
      try {
        const metadata = await extractDroneMetadata(imageUri);
        if (metadata) {
          setDroneData(metadata);
          setIsDroneDetected(true);
          
          // If it's an overhead drone photo, auto-calibrate and complete
          if (metadata.isOverhead && metadata.groundSampleDistance && metadata.specs) {
            alert(`🎉 AUTO-CALIBRATION TRIGGERED!\n\nWill calculate from:\nAlt: ${metadata.gps?.altitude}m\nGSD: ${metadata.groundSampleDistance} cm/px\n\nPress OK to auto-calibrate...`);
            
            const debugInfo = {
              drone: metadata.displayName,
              altitude: metadata.gps?.altitude,
              gsd: metadata.groundSampleDistance,
              resolution: metadata.specs.resolution,
            };
            console.log('🚁 AUTO-CALIBRATING:', JSON.stringify(debugInfo));
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Auto-calculate calibration from drone altitude
            // GSD is in cm/pixel, we need pixels/mm
            // Example: GSD = 0.52 cm/pixel means 1 pixel = 5.2 mm
            // So: 1 mm = 1/5.2 pixels = 0.192 pixels
            const mmPerPixel = metadata.groundSampleDistance * 10; // Convert cm to mm
            const pixelsPerMM = 1 / mmPerPixel;
            
            alert(`📐 CALIBRATION CALCULATED\n\n1 pixel = ${mmPerPixel.toFixed(2)} mm\n1 mm = ${pixelsPerMM.toFixed(4)} pixels\n\nCalling onComplete() now...`);
            
            // Complete calibration immediately with drone data
            onComplete({
              pixelsPerUnit: pixelsPerMM,
              unit: 'mm',
              referenceDistance: metadata.groundSampleDistance * 10, // GSD in mm
              coinCircle: {
                centerX: metadata.specs.resolution.width / 2,
                centerY: metadata.specs.resolution.height / 2,
                radius: 100, // Arbitrary reference
                coinName: `Auto: ${metadata.displayName || 'Drone'}`,
                coinDiameter: metadata.groundSampleDistance * 10, // GSD in mm
              },
              initialZoom: {
                scale: 1,
                translateX: 0,
                translateY: 0,
              },
            });
            
            alert(`✅ onComplete() called! Should skip to measurement screen now.`);
          }
        }
      } catch (error) {
        console.error('Error detecting drone:', error);
        // Silently fail - just proceed with manual calibration
      }
    };
    
    detectDrone();
  }, [imageUri]);

  // Show pinch-zoom tutorial on first use
  // Pinch tutorial disabled - users know how to pinch!
  // Show instruction text but NOT finger animations
  useEffect(() => {
    initialZoomScale.current = zoomScale;
    
    // Fade in instruction text after a short delay
    setTimeout(() => {
      instructionTextOpacity.value = withTiming(1, { 
        duration: 800, 
        easing: Easing.bezier(0.4, 0, 0.2, 1) 
      });
    }, 500);
  }, []);
  
  // Detect zoom and dismiss tutorial gracefully - CINEMATIC 🎬
  // ALSO dismiss when user opens coin selector
  useEffect(() => {
    if (showTutorial && (Math.abs(zoomScale - initialZoomScale.current) > 0.1 || searchQuery.trim().length > 0)) {
      // User started zooming OR opened coin search - dismiss tutorial CINEMATICALLY
      tutorialOpacity.value = withTiming(0, { 
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      coinTextOpacity.value = withTiming(0, { 
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      arrowOpacity.value = withTiming(0, { 
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      setTimeout(() => {
        setShowTutorial(false);
      }, 800);
    }
  }, [zoomScale, showTutorial, searchQuery]);
  
  // Chef's kiss: Fade instruction text back in when user zooms out (but keep it translucent)
  useEffect(() => {
    if (!showTutorial && selectedCoin) {
      // If zoom is close to 1.0 (within 0.15), fade text in at 50% opacity
      // If zoom is > 1.15, fade text out
      if (zoomScale < 1.15) {
        instructionTextOpacity.value = withTiming(0.5, { 
          duration: 600, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
      } else {
        instructionTextOpacity.value = withTiming(0, { 
          duration: 400, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
      }
    }
  }, [zoomScale, showTutorial, selectedCoin]);

  // CRITICAL: Cleanup haptic timers on unmount
  useEffect(() => {
    return () => {
      hapticTimersRef.current.forEach(timer => clearTimeout(timer));
      hapticTimersRef.current = [];
    };
  }, []);

  // Reference circle in center of screen - represents the coin's actual diameter
  // MOVED UP: Now at 2/3 of screen height for better menu layout
  const referenceCenterX = SCREEN_WIDTH / 2;
  const referenceCenterY = SCREEN_HEIGHT * 0.33; // Was SCREEN_HEIGHT / 2, now moved to 1/3 from top (2/3 up from bottom)
  
  // BIGGER circle = easier alignment, more accuracy!
  // User will zoom the IMAGE to match this reference circle
  // 130px radius = 260px diameter (30% bigger than before for better precision)
  const referenceRadiusPixels = 130;

  const handleLockIn = () => {
    if (!selectedCoin) return;

    // Zelda "Item Get" haptic sequence - da-na-na-NAAAA! 🎵 (BEEFED UP!)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);  // da (upgraded from Light)
    hapticTimersRef.current.push(setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100));  // na (upgraded)
    hapticTimersRef.current.push(setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200));  // na (upgraded to Heavy!)
    hapticTimersRef.current.push(setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);  // NAAAA!
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);  // Double tap for emphasis!
      hapticTimersRef.current.push(setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 50));
    }, 300));
    
    // Save coin preference
    setLastSelectedCoin(selectedCoin.name);
    
    // When user locks in:
    // - The reference circle is referenceRadiusPixels (130px radius = 260px diameter)
    // - The zoom scale tells us how much they zoomed the image
    // - The coin's actual diameter is selectedCoin.diameter (in mm)
    
    // Calculate: How many pixels in the ORIGINAL (unzoomed) image represent the coin diameter?
    // If reference is 260px and zoom is 2x, then original image had coin at 130px diameter
    const originalImageCoinDiameterPixels = (referenceRadiusPixels * 2) / zoomScale;
    
    // So: originalImageCoinDiameterPixels represents selectedCoin.diameter mm
    const pixelsPerMM = originalImageCoinDiameterPixels / selectedCoin.diameter;

    // Calculate the coin circle position in the ORIGINAL image coordinates
    // screen = original * scale + translate, so: original = (screen - translate) / scale
    const originalImageCenterX = (referenceCenterX - zoomTranslate.x) / zoomScale;
    const originalImageCenterY = (referenceCenterY - zoomTranslate.y) / zoomScale;
    const originalImageRadius = referenceRadiusPixels / zoomScale;

    onComplete({
      pixelsPerUnit: pixelsPerMM,
      unit: 'mm',
      referenceDistance: selectedCoin.diameter,
      coinCircle: {
        centerX: originalImageCenterX,
        centerY: originalImageCenterY,
        radius: originalImageRadius,
        coinName: selectedCoin.name,
        coinDiameter: selectedCoin.diameter,
      },
      initialZoom: {
        scale: zoomScale,
        translateX: zoomTranslate.x,
        translateY: zoomTranslate.y,
      },
    });
  };

  // Animated styles for tutorial
  const leftFingerStyle = useAnimatedStyle(() => ({
    opacity: tutorialOpacity.value,
    transform: [
      { translateX: leftFingerX.value },
      { translateY: leftFingerY.value },
    ],
  }));

  const rightFingerStyle = useAnimatedStyle(() => ({
    opacity: tutorialOpacity.value,
    transform: [
      { translateX: rightFingerX.value },
      { translateY: rightFingerY.value },
    ],
  }));

  const tutorialTextStyle = useAnimatedStyle(() => ({
    opacity: instructionTextOpacity.value, // Use instructionTextOpacity (not tutorialOpacity)
  }));

  return (
    <TouchOverlayFingerprints color={sessionColor?.main || currentColor} enabled={true}>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {/* Zoomable Image */}
      <ZoomableImage
        imageUri={imageUri}
        fingerColor={sessionColor?.main || currentColor}
        zoomToCenter={true}
        singleFingerPan={true}
        onTransformChange={(scale, translateX, translateY) => {
          setZoomScale(scale);
          setZoomTranslate({ x: translateX, y: translateY });
          
          // Fade in lock-in button on first pan/zoom movement
          if (!hasUserPanned && (Math.abs(translateX) > 5 || Math.abs(translateY) > 5 || Math.abs(scale - 1) > 0.05)) {
            setHasUserPanned(true);
            lockInOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
          }
        }}
      />

      {/* Reference Circle Overlay - Beautiful glowing ring (only show when coin selected) */}
      {selectedCoin && (
        <>
          {/* SVG overlay with pointer events disabled */}
          <View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          >
            <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
              <Defs>
                <RadialGradient id="glowGradient" cx="50%" cy="50%">
                  <Stop offset="0%" stopColor={currentColor} stopOpacity="0.08" />
                  <Stop offset="70%" stopColor={currentColor} stopOpacity="0.03" />
                  <Stop offset="100%" stopColor={currentColor} stopOpacity="0" />
                </RadialGradient>
                
                {/* Mask to create the clear circle "window" */}
                <Mask id="circleMask">
                  {/* White = visible, Black = hidden */}
                  <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="white" />
                  <Circle cx={referenceCenterX} cy={referenceCenterY} r={referenceRadiusPixels} fill="black" />
                </Mask>
              </Defs>
              
              {/* Dynamic blur overlay OUTSIDE the circle - intensity increases with zoom */}
              {/* Two-phase blur: Fast ramp 1x→6x (15%→50%), slow ramp 6x→35x (50%→60%) */}
              {/* Inside the coin circle stays crystal clear as focal point */}
              <Rect 
                x="0" 
                y="0" 
                width={SCREEN_WIDTH} 
                height={SCREEN_HEIGHT} 
                fill={`rgba(255, 255, 255, ${
                  zoomScale <= 6
                    ? Math.min(0.15 + (zoomScale - 1) * 0.07, 0.50)  // Fast: 1x→6x = 15%→50% (7% per zoom unit)
                    : Math.min(0.50 + (zoomScale - 6) * 0.0034, 0.60) // Slow: 6x→35x = 50%→60% (0.34% per zoom unit)
                })`}
                mask="url(#circleMask)"
              />
              
              {/* Outer glow */}
              <Circle
                cx={referenceCenterX}
                cy={referenceCenterY}
                r={referenceRadiusPixels + 30}
                fill="url(#glowGradient)"
              />
              
              {/* Main circle - clean, minimal stroke, 10% darker */}
              <Circle
                cx={referenceCenterX}
                cy={referenceCenterY}
                r={referenceRadiusPixels}
                fill="none"
                stroke={currentColor}
                strokeWidth="3"
                opacity="0.7"
              />
              
              {/* Inner highlight ring for depth */}
              <Circle
                cx={referenceCenterX}
                cy={referenceCenterY}
                r={referenceRadiusPixels - 3}
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.5"
              />
            </Svg>
            
            {/* Animated rotating ring overlay - shows during tutorial */}
            {showTutorial && (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                  },
                  animatedRingOpacityStyle,
                ]}
                pointerEvents="none"
              >
                <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
                  <Circle
                    cx={referenceCenterX}
                    cy={referenceCenterY}
                    r={referenceRadiusPixels}
                    fill="none"
                    stroke={currentColor}
                    strokeWidth="8"
                    strokeDasharray="50 30"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
            )}
          </View>
          
          {/* Coin name - floating beautifully inside, tappable to change */}
          {/* IMPORTANT: This is OUTSIDE the pointerEvents="none" View so it's tappable */}
          <View
            style={{
              position: 'absolute',
              left: referenceCenterX - scaleSize(120),
              top: referenceCenterY - scaleSize(40), // Moved up a bit more for tap hint
              width: scaleSize(240),
              alignItems: 'center',
            }}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCoinSelector(true);
              }}
              style={({ pressed }) => ({
                transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
                alignItems: 'center',
                padding: scalePadding(8), // Add padding for larger tap area
              })}
            >
              <Text style={{
                color: 'white',
                fontSize: scaleFontSize(20),
                fontWeight: '700',
                textAlign: 'center',
                textShadowColor: 'rgba(0,0,0,0.6)',
                textShadowOffset: { width: 0, height: scaleSize(2) },
                textShadowRadius: scaleSize(8),
                letterSpacing: 0.3,
              }}>
                {selectedCoin.name}
              </Text>

              {/* Hint text */}
              <Text style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: scaleFontSize(11),
                fontWeight: '600',
                textAlign: 'center',
                marginTop: scaleMargin(4),
                textShadowColor: 'rgba(0,0,0,0.6)',
                textShadowOffset: { width: 0, height: scaleSize(1) },
                textShadowRadius: scaleSize(3),
                letterSpacing: 0.3,
              }}>
                (Tap to Change Coin)
              </Text>
            </Pressable>

            {/* Zoom indicator below coin name and hint */}
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: scaleFontSize(14),
              fontWeight: '700',
              textAlign: 'center',
              marginTop: scaleMargin(8),
              textShadowColor: 'rgba(0,0,0,0.6)',
              textShadowOffset: { width: 0, height: scaleSize(1) },
              textShadowRadius: scaleSize(4),
              letterSpacing: 0.5,
            }}>
              {zoomScale.toFixed(2)}×
            </Text>
          </View>
        </>
      )}



      {/* Bottom Controls - Always visible, taller design */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + scaleSize(40),
          left: SCREEN_WIDTH * 0.10,
          right: SCREEN_WIDTH * 0.10,
        }}
      >
        <BlurView
          intensity={35}
          tint="light"
          style={{
            borderRadius: scaleBorderRadius(28),
            overflow: 'hidden',
            shadowColor: currentColor,
            shadowOffset: { width: 0, height: scaleSize(8) },
            shadowOpacity: 0.3,
            shadowRadius: scaleSize(20),
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderRadius: scaleBorderRadius(28),
            padding: scalePadding(14), // Reduced from 20
            borderWidth: scaleSize(1),
            borderColor: 'rgba(255, 255, 255, 0.35)',
          }}>
            {/* Single Row: LOCK IN centered */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: scaleSize(72) }}>
              {/* LOCK IN - centered */}
              <Pressable
                onPress={handleLockIn}
                disabled={!selectedCoin}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: !selectedCoin
                    ? 'rgba(150, 150, 150, 0.4)'
                    : pressed ? `${currentColor}E6` : `${currentColor}F2`,
                  borderRadius: scaleBorderRadius(20),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: scaleSize(2),
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                  opacity: !selectedCoin ? 0.5 : 1,
                  height: scaleSize(72),
                })}
              >
                {/* LOCK IN text */}
                <Text style={{
                  color: !selectedCoin ? '#FFFFFF' : currentColor,
                  fontWeight: '900',
                  fontSize: scaleFontSize(48),
                  letterSpacing: 2,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0, height: scaleSize(2) },
                  textShadowRadius: scaleSize(4),
                }}>
                  LOCK IN
                </Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>

      {/* Coin Search Modal - Shows at TOP when selector button is tapped */}
      {showCoinSelector && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: insets.top + scaleSize(16),
              left: SCREEN_WIDTH * 0.10,
              right: SCREEN_WIDTH * 0.10,
              zIndex: 1000,
            },
            coinSelectorAnimatedStyle,
          ]}
        >
          <BlurView
            intensity={35}
            tint="light"
            style={{
              borderRadius: scaleBorderRadius(24),
              overflow: 'hidden',
              shadowColor: currentColor,
              shadowOffset: { width: 0, height: scaleSize(8) },
              shadowOpacity: 0.3,
              shadowRadius: scaleSize(20),
            }}
          >
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: scaleBorderRadius(24),
              padding: scalePadding(20),
              borderWidth: scaleSize(1),
              borderColor: 'rgba(255, 255, 255, 0.35)',
            }}>
              {/* Title */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: scaleMargin(12),
              }}>
                <Text style={{ fontSize: scaleFontSize(20), marginRight: scaleMargin(8) }}>🪙</Text>
                <Text style={{
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: '700',
                  fontSize: scaleFontSize(16),
                }}>
                  Select Reference Coin
                </Text>
              </View>

              {/* Search Bar */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: scaleBorderRadius(12),
                paddingHorizontal: scalePadding(14),
                paddingVertical: scalePadding(10),
                borderWidth: scaleSize(1),
                borderColor: 'rgba(0, 0, 0, 0.06)',
                marginBottom: searchResults.length > 0 ? scaleMargin(12) : 0,
              }}>
                <Ionicons name="search" size={scaleIconSize(16)} color="rgba(0, 0, 0, 0.35)" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search coins..."
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                  style={{
                    flex: 1,
                    marginLeft: scaleMargin(10),
                    fontSize: scaleFontSize(14),
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontWeight: '500',
                  }}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSearchQuery('');
                    }}
                    style={{ padding: scalePadding(4) }}
                  >
                    <Ionicons name="close-circle" size={scaleIconSize(16)} color="rgba(0, 0, 0, 0.35)" />
                  </Pressable>
                )}
              </View>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <ScrollView
                  style={{ maxHeight: scaleSize(280) }}
                  showsVerticalScrollIndicator={false}
                >
                  {searchResults.slice(0, 5).map((coin, index) => (
                    <Pressable
                      key={`${coin.country}-${coin.name}`}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        Keyboard.dismiss();
                        setSelectedCoin(coin);
                        setLastSelectedCoin(coin.name);
                        setSearchQuery('');
                        setShowCoinSelector(false); // Close selector
                      }}
                      style={({ pressed }) => ({
                        paddingVertical: scalePadding(18),
                        paddingHorizontal: scalePadding(16),
                        marginBottom: scaleMargin(6),
                        borderRadius: scaleBorderRadius(10),
                        backgroundColor: pressed
                          ? 'rgba(0, 0, 0, 0.12)'
                          : index % 2 === 0
                            ? 'rgba(255, 255, 255, 0.85)'
                            : 'rgba(240, 240, 245, 0.85)',
                        borderWidth: scaleSize(1),
                        borderColor: 'rgba(0, 0, 0, 0.06)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: scaleSize(1) },
                        shadowOpacity: 0.05,
                        shadowRadius: scaleSize(2),
                        elevation: 1,
                      })}
                    >
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.95)',
                        fontWeight: '700',
                        fontSize: scaleFontSize(16),
                        marginBottom: scaleMargin(4),
                        textAlign: 'center',
                      }}>
                        {coin.name}
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: scaleFontSize(13),
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                        {coin.diameter}mm • {coin.country}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          </BlurView>
        </Animated.View>
      )}

      {/* Back button - left middle edge, 2× bigger */}
      <View
        style={{
          position: 'absolute',
          left: scaleSize(20),
          top: SCREEN_HEIGHT / 2 - scaleSize(40), // Adjusted for bigger size
        }}
      >
        <BlurView
          intensity={30}
          tint="light"
          style={{
            borderRadius: scaleBorderRadius(40),
            overflow: 'hidden',
          }}
        >
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => ({
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              width: scaleSize(80), // 2× bigger (was 48)
              height: scaleSize(80), // 2× bigger (was 48)
              borderRadius: scaleBorderRadius(40), // 2× bigger (was 24)
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
              borderWidth: scaleSize(1),
              borderColor: 'rgba(255, 255, 255, 0.25)',
            })}
          >
            <Ionicons name="arrow-back" size={scaleIconSize(72)} color="rgba(0, 0, 0, 0.7)" />
          </Pressable>
        </BlurView>
      </View>

      {/* Help button - top-right corner (moved left for safe area) */}
      {onHelp && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + scaleSize(16),
            right: scaleSize(24),
          }}
        >
          <BlurView
            intensity={30}
            tint="light"
            style={{
              borderRadius: scaleBorderRadius(20),
              overflow: 'hidden',
            }}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onHelp();
              }}
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                width: scaleSize(48),
                height: scaleSize(48),
                borderRadius: scaleBorderRadius(24),
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
                borderWidth: scaleSize(1),
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: scaleSize(2) },
                shadowOpacity: 0.15,
                shadowRadius: scaleSize(4),
              })}
            >
              <Ionicons name="help-circle-outline" size={scaleIconSize(28)} color="rgba(0, 0, 0, 0.7)" />
            </Pressable>
          </BlurView>
        </View>
      )}

      {/* Instruction text overlay - Always visible */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Instruction text - between circle and bottom controls - moved up 20% closer to circle */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: SCREEN_HEIGHT * 0.33 + scaleSize(208), // Moved up 20% (was 260, now 208)
              alignItems: 'center',
              paddingHorizontal: scalePadding(40),
            },
            tutorialTextStyle,
          ]}
        >
          <Text
            style={{
              fontSize: scaleFontSize(22),
              fontWeight: '700',
              color: 'white',
              textAlign: 'center',
              marginBottom: scaleMargin(8),
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0, height: scaleSize(2) },
              textShadowRadius: scaleSize(4),
            }}
          >
            Pinch to Zoom
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: scaleFontSize(16),
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: scaleSize(1) },
                textShadowRadius: scaleSize(3),
              }}
            >
              {"Match coin's OUTER edge to the "}
            </Text>
            <Animated.Text
              style={[
                {
                  fontSize: scaleFontSize(16),
                  fontWeight: '700',
                  color: currentColor,
                  textAlign: 'center',
                  textShadowColor: 'rgba(0, 0, 0, 0.9)',
                  textShadowOffset: { width: 0, height: scaleSize(2) },
                  textShadowRadius: scaleSize(4),
                },
                animatedTextPulseStyle,
              ]}
            >
              {getColorName(currentColor)}
            </Animated.Text>
            <Text
              style={{
                fontSize: scaleFontSize(16),
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: scaleSize(1) },
                textShadowRadius: scaleSize(3),
              }}
            >
              {" circle"}
            </Text>
          </View>

          {/* Moved instruction text here - below Pinch to Zoom */}
          <Text
            style={{
              fontSize: scaleFontSize(18),
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.7)',
              textShadowOffset: { width: 0, height: scaleSize(1) },
              textShadowRadius: scaleSize(4),
              lineHeight: scaleSize(24),
              marginTop: scaleMargin(16),
            }}
          >
            {"Make sure the right coin is selected"}
          </Text>
        </Animated.View>
      </View>

      {/* Finger circle animations - hidden (showTutorial always false) */}
      {showTutorial && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Animated finger indicators - positioned below coin circle */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: scaleSize(50),
                height: scaleSize(50),
                borderRadius: scaleBorderRadius(25),
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: scaleSize(3),
                borderColor: 'rgba(255, 255, 255, 0.8)',
              },
              leftFingerStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: scaleSize(50),
                height: scaleSize(50),
                borderRadius: scaleBorderRadius(25),
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: scaleSize(3),
                borderColor: 'rgba(255, 255, 255, 0.8)',
              },
              rightFingerStyle,
            ]}
          />
        </View>
      )}
    </View>
    </TouchOverlayFingerprints>
  );
}
