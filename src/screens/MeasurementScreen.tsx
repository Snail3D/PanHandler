import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { DeviceMotion } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import CalibrationModal from '../components/CalibrationModal';
import ZoomCalibration from '../components/ZoomCalibration';
import DimensionOverlay from '../components/DimensionOverlay';
import ZoomableImage from '../components/ZoomableImageV2';
import HelpModal from '../components/HelpModal';
import { CoinReference } from '../utils/coinReferences';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ScreenMode = 'camera' | 'selectCoin' | 'zoomCalibrate' | 'measurement';

export default function MeasurementScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [mode, setMode] = useState<ScreenMode>('camera');
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [measurementZoom, setMeasurementZoom] = useState({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Auto-capture states
  const [isHoldingShutter, setIsHoldingShutter] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isStable, setIsStable] = useState(false);
  const [alignmentStatus, setAlignmentStatus] = useState<'good' | 'warning' | 'bad'>('bad');
  const recentAngles = useRef<number[]>([]);
  const lastHapticRef = useRef<'good' | 'warning' | 'bad'>('bad');
  
  const cameraRef = useRef<CameraView>(null);
  const measurementViewRef = useRef<View | null>(null);
  const insets = useSafeAreaInsets();
  
  const currentImageUri = useStore((s) => s.currentImageUri);
  const calibration = useStore((s) => s.calibration);
  const coinCircle = useStore((s) => s.coinCircle);
  const imageOrientation = useStore((s) => s.imageOrientation);
  const savedZoomState = useStore((s) => s.savedZoomState);
  const setImageUri = useStore((s) => s.setImageUri);
  const setImageOrientation = useStore((s) => s.setImageOrientation);
  const setCalibration = useStore((s) => s.setCalibration);
  const setCoinCircle = useStore((s) => s.setCoinCircle);
  const setSavedZoomState = useStore((s) => s.setSavedZoomState);

  // Helper to detect orientation based on image (for future use)
  const detectOrientation = async (uri: string) => {
    try {
      await new Promise<void>((resolve) => {
        Image.getSize(uri, (width, height) => {
          console.log('📐 Image dimensions:', width, 'x', height);
          const isLandscape = width > height;
          const orientation = isLandscape ? 'LANDSCAPE' : 'PORTRAIT';
          console.log('📱 Image orientation:', orientation);
          setImageOrientation(orientation);
          resolve();
        }, (error) => {
          console.error('Error getting image size:', error);
          resolve();
        });
      });
    } catch (error) {
      console.error('Error detecting orientation:', error);
    }
  };

  // Monitor device tilt for auto-capture when holding shutter
  useEffect(() => {
    if (mode !== 'camera') return;

    DeviceMotion.setUpdateInterval(100);

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const beta = data.rotation.beta * (180 / Math.PI);
        const absBeta = Math.abs(beta);
        
        // Auto-detect horizontal (0°) or vertical (90°)
        const targetOrientation = absBeta < 45 ? 'horizontal' : 'vertical';
        const absTilt = targetOrientation === 'horizontal' ? absBeta : Math.abs(absBeta - 90);
        
        setTiltAngle(absTilt);
        
        // Track stability
        recentAngles.current.push(absTilt);
        if (recentAngles.current.length > 10) recentAngles.current.shift();
        
        if (recentAngles.current.length >= 5) {
          const maxAngle = Math.max(...recentAngles.current);
          const minAngle = Math.min(...recentAngles.current);
          const stable = (maxAngle - minAngle) <= 2;
          setIsStable(stable);
        }

        // Alignment status (strict 2° tolerance when holding)
        let status: 'good' | 'warning' | 'bad';
        if (absTilt <= 2) status = 'good';
        else if (absTilt <= 10) status = 'warning';
        else status = 'bad';

        setAlignmentStatus(status);

        // Haptic feedback on status change (only when holding)
        if (isHoldingShutter && status !== lastHapticRef.current) {
          if (status === 'good') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else if (status === 'warning') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          lastHapticRef.current = status;
        }
      }
    });

    return () => subscription.remove();
  }, [mode, isHoldingShutter]);

  // Auto-capture when holding and conditions are met
  useEffect(() => {
    if (!isHoldingShutter || isCapturing) return;

    if (alignmentStatus === 'good' && isStable) {
      // Perfect conditions - auto snap!
      takePicture();
    }
  }, [isHoldingShutter, alignmentStatus, isStable, isCapturing]);

  // Restore session on mount if there's a persisted image
  useEffect(() => {
    if (currentImageUri && calibration && coinCircle) {
      console.log('📦 Restoring previous session');
      setMode('measurement');
      // Restore saved zoom state if available
      if (savedZoomState) {
        console.log('🔄 Restoring zoom state:', savedZoomState);
        setMeasurementZoom({ ...savedZoomState, rotation: savedZoomState.rotation || 0 });
      } else {
        setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
      }
    }
  }, []); // Only run on mount

  // Watch for image changes and reset mode to camera when image is cleared
  useEffect(() => {
    if (!currentImageUri && mode !== 'camera') {
      setMode('camera');
    }
  }, [currentImageUri, mode]);

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
    
    const wasAutoCapture = alignmentStatus === 'good' && isStable;
    
    try {
      setIsCapturing(true);
      setIsHoldingShutter(false); // Release hold state
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      
      if (photo?.uri) {
        // Request media library permission if not granted
        let canSave = mediaLibraryPermission?.granted || false;
        if (!canSave) {
          const { granted } = await requestMediaLibraryPermission();
          canSave = granted;
          if (!granted) {
            console.log('Media library permission not granted');
          }
        }

        // Save to camera roll
        if (canSave) {
          try {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            console.log('✅ Photo saved to camera roll');
          } catch (saveError) {
            console.error('Failed to save to camera roll:', saveError);
          }
        }

        // Set image URI (auto-captured if it was via hold)
        setImageUri(photo.uri, wasAutoCapture);
        await detectOrientation(photo.uri);
        setMode('selectCoin');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const wasAutoCapture = alignmentStatus === 'good' && isStable;

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCoinSelected = (coin: CoinReference) => {
    setSelectedCoin(coin);
    setMode('zoomCalibrate');
  };

  const handleCalibrationComplete = (calibrationData: any) => {
    setCalibration({
      pixelsPerUnit: calibrationData.pixelsPerUnit,
      unit: calibrationData.unit,
      referenceDistance: calibrationData.referenceDistance,
    });

    setCoinCircle(calibrationData.coinCircle);
    
    // Set the initial measurement zoom from calibration
    setMeasurementZoom({
      scale: calibrationData.initialZoom.scale,
      translateX: calibrationData.initialZoom.translateX,
      translateY: calibrationData.initialZoom.translateY,
      rotation: calibrationData.initialZoom.rotation || 0,
    });
    
    setMode('measurement');
  };

  const handleCancelCalibration = () => {
    setMode('selectCoin');
    setSelectedCoin(null);
  };

  const handleRetakePhoto = () => {
    setImageUri(null);
    setCoinCircle(null);
    setCalibration(null);
    setImageOrientation(null);
    setMeasurementZoom({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
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
      await detectOrientation(result.assets[0].uri);
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
              <Pressable
                onPress={() => setShowHelpModal(true)}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="help-circle-outline" size={28} color="white" />
              </Pressable>
              <Text className="text-white text-lg font-semibold">Take Photo</Text>
              <Pressable
                onPress={toggleCameraFacing}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="camera-reverse-outline" size={28} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Crosshairs overlay - center of screen */}
          <View 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
            }}
            pointerEvents="none"
          >
            {/* Horizontal line */}
            <View
              style={{
                position: 'absolute',
                top: 49,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            />
            {/* Vertical line */}
            <View
              style={{
                position: 'absolute',
                left: 49,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            />
            {/* Center dot */}
            <View
              style={{
                position: 'absolute',
                top: 47,
                left: 47,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            />
            
            {/* "Center object here" text below crosshairs */}
            <Text
              style={{
                position: 'absolute',
                top: 110,
                left: -50,
                width: 200,
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 13,
                fontWeight: '500',
              }}
            >
              Center object here
            </Text>
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

              {/* Camera Shutter - press and hold for auto-capture */}
              <Pressable
                onPress={takePicture}
                onPressIn={() => {
                  setIsHoldingShutter(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                onPressOut={() => setIsHoldingShutter(false)}
                disabled={isCapturing}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'white',
                  borderWidth: 4,
                  borderColor: isHoldingShutter 
                    ? (alignmentStatus === 'good' ? '#00C800' : alignmentStatus === 'warning' ? '#FFC800' : '#FF3232')
                    : '#D1D5DB',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 32, 
                  backgroundColor: isHoldingShutter && alignmentStatus === 'good' ? '#00FF00' : 'white',
                }} />
              </Pressable>
              
              <Text className="text-white text-sm mt-4">
                {isHoldingShutter 
                  ? (alignmentStatus === 'good' && isStable ? 'Perfect! Capturing...' : 'Hold steady...') 
                  : 'Tap or hold for auto-capture'
                }
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
          {/* Zoom Calibration Mode */}
          {mode === 'zoomCalibrate' && selectedCoin && (
            <ZoomCalibration
              imageUri={currentImageUri}
              selectedCoin={selectedCoin}
              onComplete={handleCalibrationComplete}
              onCancel={handleCancelCalibration}
            />
          )}

          {/* Measurement Mode */}
          {mode === 'measurement' && (
            <View style={{ flex: 1 }}>
              {/* Capture container for the image + measurements */}
              <View ref={measurementViewRef} collapsable={false} style={{ flex: 1 }}>
                <ZoomableImage 
                  imageUri={currentImageUri}
                  initialScale={measurementZoom.scale}
                  initialTranslateX={measurementZoom.translateX}
                  initialTranslateY={measurementZoom.translateY}
                  initialRotation={measurementZoom.rotation}
                  onTransformChange={(scale, translateX, translateY, rotation) => {
                    const newZoom = { scale, translateX, translateY, rotation };
                    setMeasurementZoom(newZoom);
                    // Save zoom state to store for session restoration
                    setSavedZoomState(newZoom);
                  }}
                />
                {/* Measurement overlay needs to be sibling to image for capture */}
                <DimensionOverlay 
                  zoomScale={measurementZoom.scale}
                  zoomTranslateX={measurementZoom.translateX}
                  zoomTranslateY={measurementZoom.translateY}
                  viewRef={measurementViewRef}
                />
              </View>
            </View>
          )}

          {/* Static Image for Coin Selection */}
          {mode === 'selectCoin' && (
            <Image
              source={{ uri: currentImageUri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              resizeMode="contain"
            />
          )}

          {/* Coin Selection Modal */}
          <CalibrationModal
            visible={mode === 'selectCoin'}
            onComplete={handleCoinSelected}
            onDismiss={handleRetakePhoto}
          />
        </>
      )}

      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </View>
  );
}
