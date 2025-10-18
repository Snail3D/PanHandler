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
import UniversalFingerprints from './UniversalFingerprints';

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

interface ZoomCalibrationProps {
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
  onSkipToMap?: () => void; // New prop for skipping to measurement screen without coin calibration
  onCancel: () => void;
  onHelp?: () => void;
}

export default function ZoomCalibration({
  imageUri,
  sessionColor,
  onComplete,
  onSkipToMap,
  onCancel,
  onHelp,
}: ZoomCalibrationProps) {
  const insets = useSafeAreaInsets();
  const hasSeenPinchTutorial = useStore((s) => s.hasSeenPinchTutorial);
  const setHasSeenPinchTutorial = useStore((s) => s.setHasSeenPinchTutorial);
  const [showTutorial, setShowTutorial] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  
  // Lock-in button fade-in animation
  const lockInOpacity = useSharedValue(0);
  const [hasUserPanned, setHasUserPanned] = useState(false);
  
  // Pinch tutorial animation values
  const leftFingerX = useSharedValue(SCREEN_WIDTH / 2 - 30);
  const leftFingerY = useSharedValue(SCREEN_HEIGHT * 0.33 + 100); // Below the coin (now at 1/3 height)
  const rightFingerX = useSharedValue(SCREEN_WIDTH / 2 + 30);
  const rightFingerY = useSharedValue(SCREEN_HEIGHT * 0.33 + 100); // Below the coin (now at 1/3 height)
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
    // Start elegant pulsing animation when tutorial shows
    if (showTutorial) {
      // Calculate circumference for dash offset animation
      const circumference = 2 * Math.PI * referenceRadiusPixels;
      
      // Animate dash offset to create spinning effect
      ringDashOffset.value = withRepeat(
        withTiming(circumference, { duration: 4000, easing: Easing.linear }),
        -1, // Infinite loop
        false
      );
      
      // Sexy pulsing opacity - breathes in and out
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withTiming(0.3, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
        ),
        -1, // Infinite pulse
        false
      );
    }
  }, [showTutorial]);
  
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
      // No last selected coin - open selector immediately
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

  // Show pinch-zoom tutorial on first use
  // Show tutorial animation (always, since it's pretty!)
  useEffect(() => {
    initialZoomScale.current = zoomScale;
    
    setTimeout(() => {
      setShowTutorial(true);
      
      // Fade in coin selection text + arrow first
      coinTextOpacity.value = withSpring(1, { damping: 20 });
      arrowOpacity.value = withSpring(1, { damping: 20 });
      
      // Fade in instruction text (will stay responsive to zoom)
      instructionTextOpacity.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      
      // Then show pinch animation after 1 second - CINEMATIC FADE IN 🎬
      setTimeout(() => {
        tutorialOpacity.value = withTiming(1, { 
          duration: 600,
          easing: Easing.bezier(0.4, 0, 0.2, 1), // Silky smooth
        });
        
        // Animate fingers pinching outward (zoom in gesture)
        const animatePinch = () => {
          leftFingerX.value = withSequence(
            withSpring(SCREEN_WIDTH / 2 - 30),
            withSpring(SCREEN_WIDTH / 2 - 80, { damping: 15 }),
            withSpring(SCREEN_WIDTH / 2 - 30, { damping: 15 })
          );
          rightFingerX.value = withSequence(
            withSpring(SCREEN_WIDTH / 2 + 30),
            withSpring(SCREEN_WIDTH / 2 + 80, { damping: 15 }),
            withSpring(SCREEN_WIDTH / 2 + 30, { damping: 15 })
          );
        };
        
        // Run animation 3 times (was 2)
        animatePinch();
        setTimeout(animatePinch, 2000); // Slowed down (was 1500)
        setTimeout(animatePinch, 4000); // Third animation
      }, 1000);
      
      // Auto-hide tutorial overlays after 7 seconds - but keep instruction text responsive to zoom
      setTimeout(() => {
        tutorialOpacity.value = withTiming(0, { 
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1), // Silky smooth
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
      }, 7000);
    }, 800); // Delay so user sees the screen first
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
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);  // na (upgraded)
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);  // na (upgraded to Heavy!)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);  // NAAAA!
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);  // Double tap for emphasis!
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 50);
    }, 300);
    
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
    opacity: tutorialOpacity.value,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Universal fingerprints for calibration taps */}
      <UniversalFingerprints color={sessionColor?.main || currentColor} enabled={true} />
      
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
          
          {/* Coin name - floating beautifully inside */}
          <View
            style={{
              position: 'absolute',
              left: referenceCenterX - 120,
              top: referenceCenterY - 30, // Moved up to make room for zoom
              width: 240,
              alignItems: 'center',
            }}
          >
            <Text style={{ 
              color: 'white', 
              fontSize: 20, 
              fontWeight: '700', 
              textAlign: 'center', 
              textShadowColor: 'rgba(0,0,0,0.6)', 
              textShadowOffset: { width: 0, height: 2 }, 
              textShadowRadius: 8,
              letterSpacing: 0.3,
            }}>
              {selectedCoin.name}
            </Text>
            
            {/* Zoom indicator below coin name */}
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
              fontWeight: '700',
              textAlign: 'center',
              marginTop: 8,
              textShadowColor: 'rgba(0,0,0,0.6)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
              letterSpacing: 0.5,
            }}>
              {zoomScale.toFixed(2)}×
            </Text>
          </View>
        </View>
      )}



      {/* Bottom Controls - Single row: Map | LOCK IN | Coin */}
      {selectedCoin && (
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 40,
            left: SCREEN_WIDTH * 0.10,
            right: SCREEN_WIDTH * 0.10,
          }}
        >
          <BlurView
            intensity={35}
            tint="light"
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: currentColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }}
          >
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              borderRadius: 24,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.35)',
            }}>
              {/* Single Row: Map Scale + LOCK IN + Coin */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {/* Map Scale - LEFT COLUMN (1/5) */}
                {onSkipToMap && (
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onSkipToMap();
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      backgroundColor: pressed ? 'rgba(66, 165, 245, 0.9)' : 'rgba(66, 165, 245, 0.8)',
                      borderRadius: 16,
                      paddingVertical: 20,
                      paddingHorizontal: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    })}
                  >
                    <Ionicons name="map-outline" size={24} color="white" />
                    <Text style={{ 
                      color: 'white', 
                      fontWeight: '700', 
                      fontSize: 10,
                      marginTop: 4,
                      textAlign: 'center',
                    }}>
                      Map{'\n'}Scale
                    </Text>
                  </Pressable>
                )}

                {/* LOCK IN - CENTER (3/5) */}
                <Pressable
                  onPress={handleLockIn}
                  style={({ pressed }) => ({
                    flex: 3,
                    backgroundColor: pressed ? `${currentColor}E6` : `${currentColor}F2`,
                    borderRadius: 20,
                    paddingVertical: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                  })}
                >
                  <Text style={{ 
                    color: '#FFFFFF', 
                    fontWeight: '900', 
                    fontSize: 38,
                    textAlign: 'center',
                    letterSpacing: 2,
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    LOCK IN
                  </Text>
                </Pressable>

                {/* Coin - RIGHT COLUMN (1/5) */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCoinSelector(true);
                    setSearchQuery('');
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: pressed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 16,
                    paddingVertical: 20,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                  })}
                >
                  <Text style={{ fontSize: 22, marginBottom: 4 }}>🪙</Text>
                  <Text style={{ 
                    color: 'rgba(0, 0, 0, 0.9)', 
                    fontWeight: '700', 
                    fontSize: 10,
                    textAlign: 'center',
                    lineHeight: 12,
                  }}>
                    {selectedCoin.name}
                  </Text>
                  <Text style={{ 
                    color: 'rgba(0, 0, 0, 0.5)', 
                    fontSize: 8,
                    fontWeight: '600',
                    marginTop: 2,
                  }}>
                    {selectedCoin.diameter}mm
                  </Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </View>
      )}

      {/* Coin Search Modal - Shows at TOP when selector button is tapped */}
      {showCoinSelector && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: insets.top + 16,
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
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: currentColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }}
          >
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.35)',
            }}>
              {/* Title */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>🪙</Text>
                <Text style={{
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: '700',
                  fontSize: 16,
                }}>
                  Select Reference Coin
                </Text>
              </View>
              
              {/* Search Bar */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.06)',
                marginBottom: searchResults.length > 0 ? 12 : 0,
              }}>
                <Ionicons name="search" size={16} color="rgba(0, 0, 0, 0.35)" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search coins..."
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    fontSize: 14,
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
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="close-circle" size={16} color="rgba(0, 0, 0, 0.35)" />
                  </Pressable>
                )}
              </View>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <ScrollView 
                  style={{ maxHeight: 280 }}
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
                        paddingVertical: 18,
                        paddingHorizontal: 16,
                        marginBottom: 6,
                        borderRadius: 10,
                        backgroundColor: pressed 
                          ? 'rgba(0, 0, 0, 0.12)' 
                          : index % 2 === 0 
                            ? 'rgba(255, 255, 255, 0.85)'
                            : 'rgba(240, 240, 245, 0.85)',
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.06)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      })}
                    >
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.95)',
                        fontWeight: '700',
                        fontSize: 16,
                        marginBottom: 4,
                        textAlign: 'center',
                      }}>
                        {coin.name}
                      </Text>
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: 13,
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
          left: 20,
          top: SCREEN_HEIGHT / 2 - 40, // Adjusted for bigger size
        }}
      >
        <BlurView
          intensity={30}
          tint="light"
          style={{
            borderRadius: 40,
            overflow: 'hidden',
          }}
        >
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => ({
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              width: 80, // 2× bigger (was 48)
              height: 80, // 2× bigger (was 48)
              borderRadius: 40, // 2× bigger (was 24)
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.25)',
            })}
          >
            <Ionicons name="arrow-back" size={36} color="rgba(0, 0, 0, 0.7)" />
          </Pressable>
        </BlurView>
      </View>

      {/* Help button - top-right corner */}
      {onHelp && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 16,
          }}
        >
          <BlurView
            intensity={30}
            tint="light"
            style={{
              borderRadius: 20,
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
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              })}
            >
              <Ionicons name="help-circle-outline" size={28} color="rgba(0, 0, 0, 0.7)" />
            </Pressable>
          </BlurView>
        </View>
      )}

      {/* Pinch-Zoom Tutorial Overlay - Always shows (animations are pretty!) */}
      {showTutorial && (
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
          {/* Coin selection prompt - above the coin circle */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: SCREEN_HEIGHT * 0.33 - 260, // Above coin at 1/3 height
                alignItems: 'center',
                paddingHorizontal: 40,
              },
              { opacity: coinTextOpacity },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: 'rgba(255, 255, 255, 0.85)',
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.7)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
                lineHeight: 22,
              }}
            >
              {"Make sure the right coin is selected.\nSelect the map icon for maps, blueprints or point to point scale measurements"}
            </Text>
          </Animated.View>

          {/* Arrow removed - text is enough! */}

          {/* Pinch tutorial text - moved up more (off the circle) */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: SCREEN_HEIGHT * 0.33 - 220, // Above coin at 1/3 height
                alignItems: 'center',
                paddingHorizontal: 40,
              },
              tutorialTextStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: 'white',
                textAlign: 'center',
                marginBottom: 8,
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Pinch to Zoom
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'center',
                  textShadowColor: 'rgba(0, 0, 0, 0.8)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {"Match coin's OUTER edge to the "}
              </Text>
              <Animated.Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: '700',
                    color: currentColor,
                    textAlign: 'center',
                    textShadowColor: 'rgba(0, 0, 0, 0.9)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  },
                  animatedTextPulseStyle, // Only pulsing, no rotation!
                ]}
              >
                {getColorName(currentColor)}
              </Animated.Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'center',
                  textShadowColor: 'rgba(0, 0, 0, 0.8)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {" circle"}
              </Text>
            </View>
          </Animated.View>

          {/* Animated finger indicators - positioned below coin circle */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 3,
                borderColor: 'rgba(255, 255, 255, 0.8)',
              },
              leftFingerStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 3,
                borderColor: 'rgba(255, 255, 255, 0.8)',
              },
              rightFingerStyle,
            ]}
          />
        </View>
      )}
    </View>
  );
}
