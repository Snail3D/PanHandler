import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
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
    // User sees circle at screen center, but image might be translated/zoomed
    // React Native applies: screen = (original + translate) * scale
    // So inverse is: original = screen / scale - translate
    const originalImageCenterX = referenceCenterX / zoomScale - zoomTranslate.x;
    const originalImageCenterY = referenceCenterY / zoomScale - zoomTranslate.y;
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
          {/* Filled blue circle with semi-transparency */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r={referenceRadiusPixels}
            fill="rgba(59, 130, 246, 0.5)"
            stroke="#3B82F6"
            strokeWidth="3"
          />
          
          {/* Crosshair for precision */}
          <Circle
            cx={referenceCenterX}
            cy={referenceCenterY}
            r="4"
            fill="#3B82F6"
          />
        </Svg>
        
        {/* Text instruction inside the circle */}
        <View
          style={{
            position: 'absolute',
            left: referenceCenterX - 80,
            top: referenceCenterY - 30,
            width: 160,
          }}
        >
          <Text style={{ color: '#3B82F6', fontSize: 16, fontWeight: 'bold', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
            Cover the{'\n'}{selectedCoin.name}
          </Text>
        </View>
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
        <View className="bg-blue-500/90 rounded-2xl px-6 py-4">
          <Text className="text-white font-bold text-lg text-center mb-2">
            Zoom to Match Coin
          </Text>
          <Text className="text-white text-center text-sm">
            Pinch to zoom until the <Text className="font-bold">{selectedCoin.name}</Text> in your photo matches the blue circle
          </Text>
          <View className="mt-3 bg-white/20 rounded-lg px-3 py-2">
            <Text className="text-white text-center text-xs">
              📏 Reference: {selectedCoin.diameter}mm diameter
            </Text>
          </View>
        </View>
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
        <View className="bg-white/95 rounded-2xl px-6 py-4">
          <Text className="text-gray-600 text-center text-sm mb-4">
            Current Zoom: <Text className="font-bold text-gray-900">{zoomScale.toFixed(2)}x</Text>
          </Text>
          
          <View className="flex-row space-x-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 bg-gray-200 rounded-xl py-3 flex-row items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#374151" />
              <Text className="text-gray-700 font-semibold ml-2">Cancel</Text>
            </Pressable>
            
            <Pressable
              onPress={handleLockIn}
              className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Lock In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
