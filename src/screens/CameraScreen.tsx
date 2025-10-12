import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import HelpModal from '../components/HelpModal';

interface CameraScreenProps {
  onPhotoTaken: (uri: string, isAutoCaptured: boolean) => void;
}

export default function CameraScreen({ onPhotoTaken }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = React.useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const [isCapturing, setIsCapturing] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [alignmentStatus, setAlignmentStatus] = useState<'good' | 'warning' | 'bad'>('good');
  const lastHapticRef = React.useRef<'good' | 'warning' | 'bad'>('good');
  const [orientationMode, setOrientationMode] = useState<'horizontal' | 'vertical' | 'auto'>('auto');
  const [detectedOrientation, setDetectedOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isStable, setIsStable] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [readyToCapture, setReadyToCapture] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Stability tracking
  const recentAngles = React.useRef<number[]>([]);
  const stabilityCheckInterval = React.useRef<NodeJS.Timeout | null>(null);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Ionicons name="camera-outline" size={64} color="white" />
        <Text className="text-white text-xl text-center mt-4 mb-6">
          Camera access is needed to take reference photos
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
      
      // Take the photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      
      if (!photo?.uri) return;

      let finalUri = photo.uri;

      // Add auto-capture badge if in auto mode
      if (autoMode) {
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              resize: { width: photo.width, height: photo.height }
            }
          ],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
          }
        );

        // Now add the badge overlay using a second manipulation
        const badgeSize = Math.min(photo.width, photo.height) * 0.08; // 8% of smallest dimension
        const badgeX = 20;
        const badgeY = 20;

        // Create badge with text overlay
        const withBadge = await ImageManipulator.manipulateAsync(
          manipResult.uri,
          [],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        finalUri = withBadge.uri;
      }

      // Request media library permission if not granted
      if (!mediaLibraryPermission?.granted) {
        const { granted } = await requestMediaLibraryPermission();
        if (!granted) {
          console.log('Media library permission not granted');
        }
      }

      // Save to camera roll
      if (mediaLibraryPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(finalUri);
        console.log('✅ Photo saved to camera roll');
      }

      // Pass to next screen
      onPhotoTaken(finalUri, autoMode);
      
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setIsCapturing(false);
      setAutoMode(false);
      setCountdown(null);
    }
  };

  const toggleAutoMode = () => {
    const newMode = !autoMode;
    setAutoMode(newMode);
    if (newMode) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCountdown(null);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleOrientationMode = () => {
    setOrientationMode((current) => {
      let newMode: 'horizontal' | 'vertical' | 'auto';
      if (current === 'auto') newMode = 'horizontal';
      else if (current === 'horizontal') newMode = 'vertical';
      else newMode = 'auto';
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return newMode;
    });
  };

  // Monitor device tilt for horizontal/vertical alignment and stability
  useEffect(() => {
    DeviceMotion.setUpdateInterval(100); // Update 10 times per second

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const beta = data.rotation.beta * (180 / Math.PI); // Forward/backward tilt in degrees
        
        // Auto-detect orientation based on device angle
        const absBeta = Math.abs(beta);
        const currentOrientation = absBeta < 45 ? 'horizontal' : 'vertical';
        setDetectedOrientation(currentOrientation);
        
        // Determine target orientation
        const targetOrientation = orientationMode === 'auto' ? currentOrientation : orientationMode;
        
        // Calculate tilt from target
        let absTilt: number;
        if (targetOrientation === 'horizontal') {
          absTilt = Math.abs(beta);
        } else {
          absTilt = Math.abs(Math.abs(beta) - 90);
        }
        
        setTiltAngle(absTilt);
        
        // Track angles for stability check
        recentAngles.current.push(absTilt);
        if (recentAngles.current.length > 10) {
          recentAngles.current.shift(); // Keep last 10 readings (1 second)
        }
        
        // Check stability: all recent angles within 2° range
        if (recentAngles.current.length >= 5) {
          const maxAngle = Math.max(...recentAngles.current);
          const minAngle = Math.min(...recentAngles.current);
          const angleVariation = maxAngle - minAngle;
          const stable = angleVariation <= 2; // Within 2° tolerance
          setIsStable(stable);
        }

        // Determine alignment status (stricter for auto mode)
        let status: 'good' | 'warning' | 'bad';
        const tolerance = autoMode ? 2 : 10; // Stricter in auto mode
        
        if (absTilt <= tolerance) {
          status = 'good';
        } else if (absTilt <= 25) {
          status = 'warning';
        } else {
          status = 'bad';
        }

        setAlignmentStatus(status);

        // Haptic feedback when status changes (only if not in countdown)
        if (status !== lastHapticRef.current && !countdown) {
          if (status === 'good') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else if (status === 'warning') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          lastHapticRef.current = status;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [orientationMode, autoMode, countdown]);

  // Auto-capture logic with countdown
  useEffect(() => {
    if (!autoMode || isCapturing) {
      setReadyToCapture(false);
      setCountdown(null);
      return;
    }

    // Check if all conditions are met
    const ready = alignmentStatus === 'good' && isStable;
    setReadyToCapture(ready);

    if (ready && !countdown) {
      // Start countdown
      setCountdown(3);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (!ready && countdown) {
      // Lost alignment/stability - cancel countdown
      setCountdown(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [autoMode, alignmentStatus, isStable, isCapturing, countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        // Capture!
        setCountdown(0);
        takePicture();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        zoom={0}
      >
        {/* Top controls */}
        <View 
          className="absolute top-0 left-0 right-0 z-10"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-row justify-between items-center px-6">
            <View className="flex-row items-center">
              <Pressable
                onPress={toggleOrientationMode}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons 
                  name={
                    orientationMode === 'auto' 
                      ? 'infinite' 
                      : orientationMode === 'horizontal' 
                      ? 'swap-horizontal' 
                      : 'swap-vertical'
                  } 
                  size={24} 
                  color="white" 
                />
              </Pressable>
              <Pressable
                onPress={() => setShowHelpModal(true)}
                className="w-10 h-10 items-center justify-center ml-2"
              >
                <Ionicons name="help-circle-outline" size={26} color="white" />
              </Pressable>
            </View>
            <Text className="text-white text-lg font-semibold">Take Reference Photo</Text>
            <Pressable
              onPress={toggleCameraFacing}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Instructions */}
        <View 
          className="absolute top-0 left-0 right-0 z-10"
          style={{ paddingTop: insets.top + 70, paddingHorizontal: 20 }}
        >
          <View 
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text className="text-white text-sm text-center font-medium leading-5">
              • Center the object in frame{'\n'}
              • Keep camera {orientationMode === 'auto' ? detectedOrientation : orientationMode} to object{'\n'}
              • Place coin near the center{autoMode && '\n• Hold steady for auto-capture'}
            </Text>
          </View>
        </View>

        {/* Alignment overlay - full screen tint */}
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 
              alignmentStatus === 'good' 
                ? 'rgba(0, 255, 0, 0.1)' 
                : alignmentStatus === 'warning'
                ? 'rgba(255, 255, 0, 0.15)'
                : 'rgba(255, 0, 0, 0.2)',
            pointerEvents: 'none',
          }}
        />

        {/* Alignment status indicator */}
        <View 
          className="absolute left-0 right-0 z-10"
          style={{ bottom: insets.bottom + 140, paddingHorizontal: 20 }}
        >
          <View 
            style={{
              backgroundColor: 
                alignmentStatus === 'good'
                  ? 'rgba(0, 200, 0, 0.9)'
                  : alignmentStatus === 'warning'
                  ? 'rgba(255, 200, 0, 0.9)'
                  : 'rgba(255, 50, 50, 0.9)',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Ionicons 
              name={
                alignmentStatus === 'good'
                  ? 'checkmark-circle'
                  : alignmentStatus === 'warning'
                  ? 'warning'
                  : 'close-circle'
              } 
              size={20} 
              color="white" 
            />
            <Text className="text-white text-sm font-bold ml-2">
              {countdown !== null && countdown > 0
                ? `Capturing in ${countdown}...`
                : alignmentStatus === 'good'
                ? isStable
                  ? `Perfect! ${detectedOrientation === 'horizontal' ? '↔' : '↕'} (${tiltAngle.toFixed(0)}°)`
                  : `Hold Steady (${tiltAngle.toFixed(0)}°)`
                : alignmentStatus === 'warning'
                ? `Adjust Angle (${tiltAngle.toFixed(0)}°)`
                : `Too Tilted! (${tiltAngle.toFixed(0)}°)`
              }
            </Text>
          </View>
        </View>

        {/* Countdown display - large centered */}
        {countdown !== null && countdown > 0 && (
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <View 
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: 'rgba(0, 200, 0, 0.9)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>
                {countdown}
              </Text>
            </View>
          </View>
        )}

        {/* Bottom controls */}
        <View 
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <View className="items-center">
            {/* Auto mode toggle */}
            <Pressable
              onPress={toggleAutoMode}
              style={{
                marginBottom: 16,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: autoMode ? 'rgba(0, 200, 0, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons 
                name={autoMode ? 'flash' : 'flash-off'} 
                size={20} 
                color="white" 
              />
              <Text className="text-white text-sm font-bold ml-2">
                {autoMode ? 'AUTO MODE ON' : 'AUTO MODE OFF'}
              </Text>
            </Pressable>

            <Pressable
              onPress={autoMode ? undefined : takePicture}
              disabled={isCapturing || autoMode}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: autoMode ? 'rgba(255, 255, 255, 0.3)' : 'white',
                borderWidth: 4,
                borderColor: autoMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(200, 200, 200, 1)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 32, 
                backgroundColor: autoMode ? 'rgba(255, 255, 255, 0.5)' : 'white',
              }} />
            </Pressable>
            <Text className="text-white text-sm mt-4">
              {autoMode ? 'Hold steady to auto-capture' : 'Tap to capture'}
            </Text>
          </View>
        </View>
      </CameraView>
      
      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </View>
  );
}
