import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Dimensions, TextInput, Keyboard, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';
import ZoomableImage from './ZoomableImageV2';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, Easing, withTiming } from 'react-native-reanimated';
import useStore from '../state/measurementStore';

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

export default function ZoomCalibration({
  imageUri,
  onComplete,
  onCancel,
  onHelp,
}: ZoomCalibrationProps) {
  const insets = useSafeAreaInsets();
  const hasSeenPinchTutorial = useStore((s) => s.hasSeenPinchTutorial);
  const setHasSeenPinchTutorial = useStore((s) => s.setHasSeenPinchTutorial);
  const [showTutorial, setShowTutorial] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  
  // Pinch tutorial animation values
  const leftFingerX = useSharedValue(SCREEN_WIDTH / 2 - 30);
  const leftFingerY = useSharedValue(SCREEN_HEIGHT / 2 + 100); // Below the coin (moved down)
  const rightFingerX = useSharedValue(SCREEN_WIDTH / 2 + 30);
  const rightFingerY = useSharedValue(SCREEN_HEIGHT / 2 + 100); // Below the coin (moved down)
  const tutorialOpacity = useSharedValue(0);
  const coinTextOpacity = useSharedValue(0); // For "select coin" text
  const arrowOpacity = useSharedValue(0); // For arrow pointing to coin selector
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  const initialZoomScale = useRef(1);
  
  // Coin selection state
  const lastSelectedCoin = useStore((s) => s.lastSelectedCoin);
  const setLastSelectedCoin = useStore((s) => s.setLastSelectedCoin);
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoinReference[]>([]);
  
  // Pick ONE random color on mount (don't rotate during use)
  const [currentColor] = useState(() => VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)]);

  // Load last selected coin on mount
  useEffect(() => {
    if (lastSelectedCoin) {
      const coin = getCoinByName(lastSelectedCoin);
      if (coin) {
        setSelectedCoin(coin);
      }
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
      
      // Auto-hide after 7 seconds - CINEMATIC FADE OUT 🎬
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

  // Reference circle in center of screen - represents the coin's actual diameter
  const referenceCenterX = SCREEN_WIDTH / 2;
  const referenceCenterY = SCREEN_HEIGHT / 2;
  
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
      {/* Zoomable Image */}
      <ZoomableImage
        imageUri={imageUri}
        zoomToCenter={true}
        singleFingerPan={true}
        onTransformChange={(scale, translateX, translateY) => {
          setZoomScale(scale);
          setZoomTranslate({ x: translateX, y: translateY });
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
            </Defs>
            
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

      {/* Coin Selector at Top - watery glassmorphic - HIGHEST z-index when open */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 20,
          left: SCREEN_WIDTH * 0.15, // 30% narrower (15% on each side)
          right: SCREEN_WIDTH * 0.15,
          zIndex: searchQuery.trim().length > 0 ? 1000 : 100, // Higher z-index when search is active
        }}
        pointerEvents="box-none"
      >
        <BlurView
          intensity={35}
          tint="light"
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: selectedCoin ? '#4CAF50' : currentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.35)',
          }}>
            {selectedCoin ? (
              // Selected coin display
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6,
                }}>
                  <View style={{
                    backgroundColor: 'rgba(76, 175, 80, 0.25)',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    marginRight: 8,
                  }}>
                    <Text style={{ 
                      color: '#2E7D32', 
                      fontSize: 10, 
                      fontWeight: '700', 
                      letterSpacing: 0.5 
                    }}>
                      SELECTED
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedCoin(null);
                    }}
                    style={{
                      padding: 5,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 14,
                    }}
                  >
                    <Ionicons name="swap-horizontal" size={18} color="rgba(0, 0, 0, 0.5)" />
                  </Pressable>
                </View>
                <Text style={{ 
                  color: 'rgba(0, 0, 0, 0.9)', 
                  fontWeight: '700', 
                  fontSize: 17,
                  marginBottom: 2,
                }}>
                  {selectedCoin.name}
                </Text>
                <Text style={{ 
                  color: 'rgba(0, 0, 0, 0.55)', 
                  fontSize: 13, 
                  fontWeight: '500',
                }}>
                  {selectedCoin.diameter}mm • {selectedCoin.country}
                </Text>
              </View>
            ) : (
              // Coin search UI
              <View>
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
                    autoFocus={false}
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

                {/* Search Results - Better spacing and larger tap targets */}
                {searchResults.length > 0 && (
                  <ScrollView 
                    style={{ maxHeight: 240 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {searchResults.slice(0, 5).map((coin) => (
                      <Pressable
                        key={`${coin.country}-${coin.name}`}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          Keyboard.dismiss();
                          setSelectedCoin(coin);
                          setLastSelectedCoin(coin.name);
                          setSearchQuery('');
                        }}
                        style={({ pressed }) => ({
                          paddingVertical: 16, // Increased from 12 for bigger tap target
                          paddingHorizontal: 16, // Increased from 12
                          marginBottom: 10, // Increased from 8 for more separation
                          borderRadius: 12, // Slightly larger radius
                          backgroundColor: pressed 
                            ? 'rgba(255, 255, 255, 0.95)' 
                            : 'rgba(255, 255, 255, 0.7)',
                          borderWidth: 1.5, // Thicker border
                          borderColor: pressed 
                            ? 'rgba(0, 0, 0, 0.15)' 
                            : 'rgba(0, 0, 0, 0.08)',
                          shadowColor: '#000', // Added shadow for depth
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: pressed ? 0.15 : 0.08,
                          shadowRadius: 4,
                          elevation: pressed ? 3 : 1,
                        })}
                      >
                        <Text style={{ 
                          color: 'rgba(0, 0, 0, 0.9)', // Darker for better contrast
                          fontWeight: '700', // Bolder
                          fontSize: 15, // Slightly larger
                          marginBottom: 3, // More spacing
                          textAlign: 'center',
                        }}>
                          {coin.name}
                        </Text>
                        <Text style={{ 
                          color: 'rgba(0, 0, 0, 0.55)', // Better contrast
                          fontSize: 13, // Larger
                          fontWeight: '600', // Bolder
                          textAlign: 'center',
                        }}>
                          {coin.diameter}mm • {coin.country}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        </BlurView>
      </View>

      {/* Help button - top-right corner, out of the way */}
      {onHelp && (
        <View
        style={{
          position: 'absolute',
          top: insets.top + 28,
          right: SCREEN_WIDTH * 0.15 + 8, // Align with coin selector + small offset
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
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.25)',
              })}
            >
              <Ionicons name="help-circle-outline" size={24} color="rgba(0, 0, 0, 0.7)" />
            </Pressable>
          </BlurView>
        </View>
      )}

      {/* Bottom Controls - only show when coin is selected */}
      {selectedCoin && (
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 80, // Raised 10% higher (was 40, now 80)
            left: SCREEN_WIDTH * 0.15, // Narrower, matches coin selector
            right: SCREEN_WIDTH * 0.15,
          }}
        >
          {/* LOCK IN Button - centered, dynamic color, HUGE */}
          <BlurView
            intensity={35}
            tint="light"
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: currentColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 24,
            }}
          >
            <Pressable
              onPress={handleLockIn}
              style={({ pressed }) => ({
                backgroundColor: pressed ? `${currentColor}E6` : `${currentColor}F2`,
                borderRadius: 24,
                paddingVertical: 22,
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
                letterSpacing: 2.5,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}>
                LOCK IN
              </Text>
            </Pressable>
          </BlurView>
        </View>
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
          {/* Coin selection prompt - above the coin circle (moved up 10%) */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: SCREEN_HEIGHT / 2 - 260, // Moved up 10% (~40px more)
                alignItems: 'center',
                paddingHorizontal: 40,
              },
              { opacity: coinTextOpacity },
            ]}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '700', // Sexy fun font weight!
                color: 'rgba(255, 255, 255, 0.85)', // Lighter color
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.7)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
            >
              Make sure the right coin is selected
            </Text>
          </Animated.View>

          {/* Arrow removed - text is enough! */}

          {/* Pinch tutorial text - moved up more (off the circle) */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: SCREEN_HEIGHT / 2 - 220, // Moved up 10% more (was -180, now -220)
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
              {"Match the coin's edge to the circle"}
            </Text>
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
