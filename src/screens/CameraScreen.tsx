import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraScreenProps {
  onPhotoTaken: (uri: string) => void;
}

export default function CameraScreen({ onPhotoTaken }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const [isCapturing, setIsCapturing] = useState(false);

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
            <View className="w-10" />
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
              • Keep camera horizontal to the object{'\n'}
              • Place coin near the center of the object
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
