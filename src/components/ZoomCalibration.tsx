import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, TextInput, Keyboard, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';
import ZoomableImage from './ZoomableImageV2';
import * as Haptics from 'expo-haptics';
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
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  
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

  // Reference circle in center of screen - represents the coin's actual diameter
  const referenceCenterX = SCREEN_WIDTH / 2;
  const referenceCenterY = SCREEN_HEIGHT / 2;
  
  // BIGGER circle = easier alignment, more accuracy!
  // User will zoom the IMAGE to match this reference circle
  // 130px radius = 260px diameter (30% bigger than before for better precision)
  const referenceRadiusPixels = 130;

  const handleLockIn = () => {
    if (!selectedCoin) return;
    
    // Haptic feedback for locking in
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
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

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Zoomable Image */}
      <ZoomableImage
        imageUri={imageUri}
        zoomToCenter={true}
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
              top: referenceCenterY - 15,
              width: 240,
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
          </View>
        </View>
      )}

      {/* Coin Selector at Top - watery glassmorphic */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 20,
          left: 20,
          right: 20,
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

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <ScrollView 
                    style={{ maxHeight: 200 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {searchResults.slice(0, 4).map((coin) => (
                      <Pressable
                        key={`${coin.country}-${coin.name}`}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          Keyboard.dismiss();
                          setSelectedCoin(coin);
                          setSearchQuery('');
                        }}
                        style={({ pressed }) => ({
                          paddingVertical: 12,
                          paddingHorizontal: 12,
                          marginBottom: 8,
                          borderRadius: 10,
                          backgroundColor: pressed 
                            ? 'rgba(255, 255, 255, 0.9)' 
                            : 'rgba(255, 255, 255, 0.6)',
                          borderWidth: 1,
                          borderColor: pressed 
                            ? 'rgba(0, 0, 0, 0.12)' 
                            : 'rgba(0, 0, 0, 0.06)',
                        })}
                      >
                        <Text style={{ 
                          color: 'rgba(0, 0, 0, 0.85)', 
                          fontWeight: '600', 
                          fontSize: 14,
                          marginBottom: 2,
                          textAlign: 'center',
                        }}>
                          {coin.name}
                        </Text>
                        <Text style={{ 
                          color: 'rgba(0, 0, 0, 0.5)', 
                          fontSize: 12, 
                          fontWeight: '500',
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

      {/* Help button - top-left, tasteful like camera */}
      {onHelp && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 20,
            left: 20,
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
            left: 20,
            right: 20,
          }}
        >
          {/* Small zoom indicator on the left */}
          <View style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            zIndex: 10,
          }}>
            <BlurView
              intensity={30}
              tint="light"
              style={{
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}>
                <Text style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                  {zoomScale.toFixed(2)}×
                </Text>
              </View>
            </BlurView>
          </View>

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
                fontSize: 32,
                textAlign: 'center',
                letterSpacing: 2,
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
    </View>
  );
}
