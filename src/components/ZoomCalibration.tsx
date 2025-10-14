import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Circle } from 'react-native-svg';
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

      {/* Reference Circle Overlay - FIXED in center, doesn't move */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          {/* Vibrant colored circle with glow */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r={referenceRadiusPixels}
            fill={`${currentColor}15`}
            stroke={currentColor}
            strokeWidth="4"
          />
          
          {/* Center dot for precision */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r="5"
            fill={currentColor}
          />
        </Svg>
        
        {/* Coin text inside the circle - BIGGER and vibrant color */}
        <View
          style={{
            position: 'absolute',
            left: referenceCenterX - 120,
            top: referenceCenterY - 50,
            width: 240,
          }}
        >
          <Text style={{ 
            color: currentColor, 
            fontSize: 28, 
            fontWeight: '900', 
            textAlign: 'center', 
            textShadowColor: 'rgba(0,0,0,0.9)', 
            textShadowOffset: { width: 0, height: 3 }, 
            textShadowRadius: 8,
            letterSpacing: 0.5,
          }}>
            Cover the{'\n'}{selectedCoin.name}
          </Text>
        </View>
      </View>

      {/* Subtle level guides - center crosshairs */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        {/* Vertical center line - very subtle */}
        <View
          style={{
            position: 'absolute',
            left: SCREEN_WIDTH / 2 - 0.5,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        
        {/* Horizontal center line - very subtle */}
        <View
          style={{
            position: 'absolute',
            top: SCREEN_HEIGHT / 2 - 0.5,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />
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
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
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
            }}>
              Zoom to Match Coin
            </Text>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.65)',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 20,
            }}>
              Pinch to zoom until the <Text style={{ fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCoin.name}</Text> in your photo matches the circle
            </Text>
            <View style={{
              marginTop: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}>
              <Text style={{
                color: 'rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: '600',
              }}>
                📏 Reference: {selectedCoin.diameter}mm diameter
              </Text>
            </View>
          </View>
        </BlurView>
      </View>

      {/* Bottom Controls - Moved up but not TOO much */}
      <View
        style={{
          position: 'absolute',
          bottom: SCREEN_HEIGHT / 2 - referenceRadiusPixels - 210, // Halfway between original and too-high position
          left: 20,
          right: 20,
        }}
      >
        <BlurView
          intensity={35}
          tint="light"
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.35)',
          }}>
            {/* Current Zoom Display */}
            <Text style={{
              color: 'rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
              fontSize: 15,
              marginBottom: 16,
              fontWeight: '600',
            }}>
              Current <Text style={{ fontWeight: '700', color: '#F59E0B' }}>Zoom: {zoomScale.toFixed(2)}x</Text>
            </Text>
            
            {/* GIANT Lock In Button - centered, no icon */}
            <Pressable
              onPress={handleLockIn}
              style={({ pressed }) => ({
                backgroundColor: pressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                borderRadius: 16,
                paddingVertical: 20,
                marginBottom: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
              })}
            >
              <Text style={{ 
                color: 'rgba(0, 0, 0, 0.85)', 
                fontWeight: '800', 
                fontSize: 26,
                textAlign: 'center',
              }}>
                LOCK IN
              </Text>
            </Pressable>
            
            {/* Cancel button - smaller, below */}
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => ({
                backgroundColor: 'transparent',
                paddingVertical: 10,
                alignItems: 'center',
              })}
            >
              <Text style={{ 
                color: 'rgba(0, 0, 0, 0.5)', 
                fontWeight: '600', 
                fontSize: 15,
              }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
