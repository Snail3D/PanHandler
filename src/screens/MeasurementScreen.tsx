import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import CalibrationModal from '../components/CalibrationModal';
import CoinTracer from '../components/CoinTracer';
import DimensionOverlay from '../components/DimensionOverlay';
import ZoomableImage from '../components/ZoomableImage';
import { CoinReference } from '../utils/coinReferences';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ScreenMode = 'camera' | 'selectCoin' | 'traceCoin' | 'measurement';

export default function MeasurementScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScreenMode>('camera');
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  
  const currentImageUri = useStore((s) => s.currentImageUri);
  const setImageUri = useStore((s) => s.setImageUri);
  const setCalibration = useStore((s) => s.setCalibration);
  const setCoinCircle = useStore((s) => s.setCoinCircle);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Ionicons name="camera-outline" size={64} color="white" />
        <Text className="text-white text-xl text-center mt-4 mb-6">
          Camera access is needed to take measurement photos
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      
      if (photo?.uri) {
        setImageUri(photo.uri);
        setMode('selectCoin');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCoinSelected = (coin: CoinReference) => {
    setSelectedCoin(coin);
    setMode('traceCoin');
  };

  const handleCoinTraceComplete = (circleData: { centerX: number; centerY: number; radius: number }) => {
    if (!selectedCoin) return;

    // Calculate pixels per unit from the traced circle
    // Circle diameter in pixels = radius * 2
    // Coin diameter in mm = selectedCoin.diameter
    const pixelDiameter = circleData.radius * 2;
    const pixelsPerMM = pixelDiameter / selectedCoin.diameter;

    setCalibration({
      pixelsPerUnit: pixelsPerMM,
      unit: 'mm',
      referenceDistance: selectedCoin.diameter,
    });

    setCoinCircle({
      centerX: circleData.centerX,
      centerY: circleData.centerY,
      radius: circleData.radius,
      coinName: selectedCoin.name,
      coinDiameter: selectedCoin.diameter,
    });

    setMode('measurement');
  };

  const handleCancelCoinTrace = () => {
    setMode('selectCoin');
    setSelectedCoin(null);
  };

  const handleRetakePhoto = () => {
    setImageUri(null);
    setMode('camera');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setMode('selectCoin');
    }
  };

  // Camera Mode
  if (mode === 'camera') {
    return (
      <View className="flex-1 bg-black">
        <CameraView 
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
        >
          {/* Top controls */}
          <View 
            className="absolute top-0 left-0 right-0 z-10"
            style={{ paddingTop: insets.top + 16 }}
          >
            <View className="flex-row justify-between items-center px-6">
              <View className="w-10" />
              <Text className="text-white text-lg font-semibold">Take Photo</Text>
              <Pressable
                onPress={toggleCameraFacing}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="camera-reverse-outline" size={28} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Bottom controls */}
          <View 
            className="absolute bottom-0 left-0 right-0 z-10"
            style={{ paddingBottom: insets.bottom + 32 }}
          >
            <View className="items-center">
              {/* Photo Library Button */}
              <Pressable
                onPress={pickImage}
                className="absolute left-8 bottom-0 w-14 h-14 rounded-full bg-gray-800/80 items-center justify-center"
                style={{ marginBottom: 3 }}
              >
                <Ionicons name="images-outline" size={28} color="white" />
              </Pressable>

              {/* Camera Shutter */}
              <Pressable
                onPress={takePicture}
                disabled={isCapturing}
                className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 items-center justify-center active:scale-95"
              >
                <View className="w-16 h-16 rounded-full bg-white" />
              </Pressable>
              
              <Text className="text-white text-sm mt-4">
                Tap to capture photo
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Calibration or Measurement Mode
  return (
    <View className="flex-1 bg-black">
      {currentImageUri && (
        <>
          {/* Zoomable Image Layer */}
          {(mode === 'measurement' || mode === 'traceCoin') && (
            <ZoomableImage imageUri={currentImageUri} />
          )}

          {/* Static Image for Coin Selection */}
          {mode === 'selectCoin' && (
            <Image
              source={{ uri: currentImageUri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              resizeMode="contain"
            />
          )}
          
          {mode === 'measurement' && <DimensionOverlay />}
          
          {mode === 'traceCoin' && selectedCoin && (
            <CoinTracer
              selectedCoin={selectedCoin}
              onComplete={handleCoinTraceComplete}
              onCancel={handleCancelCoinTrace}
            />
          )}
          
          {/* Top bar with retake button */}
          <View 
            className="absolute top-0 left-0 right-0 z-20 bg-black/50"
            style={{ paddingTop: insets.top + 12, paddingBottom: 12 }}
          >
            <View className="flex-row justify-between items-center px-6">
              <Pressable
                onPress={handleRetakePhoto}
                className="flex-row items-center"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text className="text-white text-base font-medium ml-2">Retake</Text>
              </Pressable>
              
              {mode === 'measurement' && (
                <Pressable
                  onPress={() => setMode('selectCoin')}
                  className="flex-row items-center bg-white/20 rounded-full px-3 py-2"
                >
                  <Ionicons name="settings-outline" size={20} color="white" />
                  <Text className="text-white text-sm font-medium ml-2">Settings</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Coin Selection Modal */}
          <CalibrationModal
            visible={mode === 'selectCoin'}
            onComplete={handleCoinSelected}
          />
        </>
      )}
    </View>
  );
}
