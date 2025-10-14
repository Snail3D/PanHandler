import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinReference } from '../utils/coinReferences';
import ZoomableImage from './ZoomableImageV2';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
          {/* Filled red circle with low opacity for sexy, subtle look */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r={referenceRadiusPixels}
            fill="rgba(239, 68, 68, 0.15)"
            stroke="#EF4444"
            strokeWidth="3"
          />
          
          {/* Crosshair for precision */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r="4"
            fill="#EF4444"
          />
        </Svg>
        
        {/* Text instruction inside the circle - larger, bolder, red */}
        <View
          style={{
            position: 'absolute',
            left: referenceCenterX - 100,
            top: referenceCenterY - 40,
            width: 200,
          }}
        >
          <Text style={{ 
            color: '#EF4444', 
            fontSize: 22, 
            fontWeight: '800', 
            textAlign: 'center', 
            textShadowColor: 'rgba(0,0,0,0.8)', 
            textShadowOffset: { width: 0, height: 2 }, 
            textShadowRadius: 6,
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

      {/* Instructions */}
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
          intensity={40}
          tint="light"
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.4)',
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
              Pinch to zoom until the <Text style={{ fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCoin.name}</Text> in your photo matches the red circle
            </Text>
            <View style={{
              marginTop: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.06)',
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

      {/* Bottom Controls */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          left: 20,
          right: 20,
        }}
      >
        <BlurView
          intensity={40}
          tint="light"
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.4)',
          }}>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
              fontSize: 14,
              marginBottom: 14,
              fontWeight: '600',
            }}>
              Current Zoom: <Text style={{ fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>{zoomScale.toFixed(2)}x</Text>
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: pressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 14,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                })}
              >
                <Ionicons name="close" size={20} color="rgba(0, 0, 0, 0.6)" />
                <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontWeight: '700', marginLeft: 6, fontSize: 15 }}>
                  Cancel
                </Text>
              </Pressable>
              
              <Pressable
                onPress={handleLockIn}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: pressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 14,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                })}
              >
                <Ionicons name="checkmark-circle" size={20} color="rgba(0, 0, 0, 0.6)" />
                <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontWeight: '700', marginLeft: 6, fontSize: 15 }}>
                  Lock In
                </Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
