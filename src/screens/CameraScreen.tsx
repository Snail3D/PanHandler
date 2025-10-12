import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

interface CameraScreenProps {
  onPhotoTaken: (uri: string) => void;
}

export default function CameraScreen({ onPhotoTaken }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const [isCapturing, setIsCapturing] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0); // Tilt angle in degrees
  const [alignmentStatus, setAlignmentStatus] = useState<'good' | 'warning' | 'bad'>('good');
  const lastHapticRef = React.useRef<'good' | 'warning' | 'bad'>('good');
  const [orientationMode, setOrientationMode] = useState<'horizontal' | 'vertical'>('horizontal');

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
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      
      if (photo?.uri) {
        onPhotoTaken(photo.uri);
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

  const toggleOrientationMode = () => {
    setOrientationMode((current) => {
      const newMode = current === 'horizontal' ? 'vertical' : 'horizontal';
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return newMode;
    });
  };

  // Monitor device tilt for horizontal/vertical alignment
  useEffect(() => {
    DeviceMotion.setUpdateInterval(100); // Update 10 times per second

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        // Calculate tilt angle from target orientation
        const beta = data.rotation.beta * (180 / Math.PI); // Forward/backward tilt in degrees
        
        let absTilt: number;
        if (orientationMode === 'horizontal') {
          // For horizontal mode: device should be parallel to ground (beta close to 0)
          absTilt = Math.abs(beta);
        } else {
          // For vertical mode: device should be perpendicular to ground (beta close to 90)
          absTilt = Math.abs(Math.abs(beta) - 90);
        }
        
        setTiltAngle(absTilt);

        // Determine alignment status
        let status: 'good' | 'warning' | 'bad';
        if (absTilt <= 10) {
          status = 'good'; // Within 10 degrees - perfect
        } else if (absTilt <= 25) {
          status = 'warning'; // 10-25 degrees - warning
        } else {
          status = 'bad'; // Over 25 degrees - too tilted
        }

        setAlignmentStatus(status);

        // Haptic feedback when status changes
        if (status !== lastHapticRef.current) {
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
  }, [orientationMode]);

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
            <Pressable
              onPress={toggleOrientationMode}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons 
                name={orientationMode === 'horizontal' ? 'swap-horizontal' : 'swap-vertical'} 
                size={24} 
                color="white" 
              />
            </Pressable>
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
              • Keep camera {orientationMode} to the object{'\n'}
              • Place coin near the center of the object
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
              {alignmentStatus === 'good'
                ? `Perfect Angle (${tiltAngle.toFixed(0)}°)`
                : alignmentStatus === 'warning'
                ? `Adjust Angle (${tiltAngle.toFixed(0)}°)`
                : `Too Tilted! (${tiltAngle.toFixed(0)}°)`
              }
            </Text>
          </View>
        </View>

        {/* Bottom controls */}
        <View 
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <View className="items-center">
            <Pressable
              onPress={takePicture}
              disabled={isCapturing}
              className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 items-center justify-center active:scale-95"
            >
              <View className="w-16 h-16 rounded-full bg-white" />
            </Pressable>
            <Text className="text-white text-sm mt-4">
              Tap to capture reference photo
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
