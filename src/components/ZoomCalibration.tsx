import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinReference } from '../utils/coinReferences';
import ZoomableImage from './ZoomableImageV2';

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
  selectedCoin: CoinReference;
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
}

export default function ZoomCalibration({
  imageUri,
  selectedCoin,
  onComplete,
  onCancel,
}: ZoomCalibrationProps) {
  const insets = useSafeAreaInsets();
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  
  // Pick ONE random color on mount (don't rotate during use)
  const [currentColor] = useState(() => VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)]);

  // Reference circle in center of screen - represents the coin's actual diameter
  const referenceCenterX = SCREEN_WIDTH / 2;
  const referenceCenterY = SCREEN_HEIGHT / 2;
  
  // Start with a reasonable reference size (e.g., 100 pixels for the coin diameter)
  // User will zoom the IMAGE to match this reference circle
  const referenceRadiusPixels = 100; // This is arbitrary - user zooms image to match

  const handleLockIn = () => {
    // When user locks in:
    // - The reference circle is referenceRadiusPixels (100px radius = 200px diameter)
    // - The zoom scale tells us how much they zoomed the image
    // - The coin's actual diameter is selectedCoin.diameter (in mm)
    
    // Calculate: How many pixels in the ORIGINAL (unzoomed) image represent the coin diameter?
    // If reference is 200px and zoom is 2x, then original image had coin at 100px diameter
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

      {/* Reference Circle Overlay - Beautiful glowing ring */}
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
          
          {/* Main circle - clean, minimal stroke */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r={referenceRadiusPixels}
            fill="none"
            stroke={currentColor}
            strokeWidth="3"
            opacity="0.6"
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

      {/* Instructions - watery glassmorphic */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 20,
          left: 20,
          right: 20,
        }}
        pointerEvents="none"
      >
        <BlurView
          intensity={35}
          tint="light"
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: currentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.35)',
          }}>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.85)',
              fontWeight: '700',
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: -0.3,
            }}>
              Zoom to Match 🎯
            </Text>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.65)',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 20,
            }}>
              Pinch to zoom until your <Text style={{ fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCoin.name}</Text> matches the circle perfectly
            </Text>
          </View>
        </BlurView>
      </View>

      {/* Bottom Controls - REDESIGNED with fluid aesthetic */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 40,
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
        
        {/* Go Back button - subtle, bottom */}
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => ({
            paddingVertical: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            opacity: pressed ? 0.5 : 1,
            marginTop: 12,
          })}
        >
          <Ionicons name="arrow-back" size={16} color="rgba(255, 255, 255, 0.6)" style={{ marginRight: 6 }} />
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontWeight: '600', 
            fontSize: 14,
            letterSpacing: 0.2,
          }}>
            Go Back
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
