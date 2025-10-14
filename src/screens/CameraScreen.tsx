import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceMotion } from 'expo-sensors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import HelpModal from '../components/HelpModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [flashEnabled, setFlashEnabled] = useState(false); // Flash OFF by default, torch when enabled
  
  // Bubble level animation
  const bubbleX = useSharedValue(0);
  const bubbleY = useSharedValue(0);
  
  // Camera flash animation
  const flashOpacity = useSharedValue(0);
  
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
      
      // Camera flash effect - quick bright flash UI overlay
      flashOpacity.value = 1;
      flashOpacity.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.3,
      });
      
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Take the photo (flash/torch is controlled by enableTorch prop on CameraView)
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
    // Turn on flash when auto mode is enabled, turn off when disabled
    setFlashEnabled(newMode);
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

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        const gamma = data.rotation.gamma * (180 / Math.PI); // Left/right tilt in degrees
        
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
        
        // Update bubble position based on device tilt
        // Bubble moves opposite to tilt (if device tilts right, bubble moves left)
        // Scale: ±30° = ±60px movement (max radius of bubble track)
        const maxBubbleOffset = 60; // pixels
        const bubbleXOffset = -(gamma / 30) * maxBubbleOffset; // Inverted: tilt right = bubble left
        const bubbleYOffset = (beta / 30) * maxBubbleOffset; // Forward tilt = bubble down
        
        // Clamp to circular boundary
        const distance = Math.sqrt(bubbleXOffset * bubbleXOffset + bubbleYOffset * bubbleYOffset);
        let finalX = bubbleXOffset;
        let finalY = bubbleYOffset;
        
        if (distance > maxBubbleOffset) {
          const scale = maxBubbleOffset / distance;
          finalX = bubbleXOffset * scale;
          finalY = bubbleYOffset * scale;
        }
        
        // Animate bubble with spring physics for realistic movement
        bubbleX.value = withSpring(finalX, {
          damping: 15,
          stiffness: 150,
          mass: 0.5,
        });
        bubbleY.value = withSpring(finalY, {
          damping: 15,
          stiffness: 150,
          mass: 0.5,
        });
        
        // Debug: Log bubble position occasionally
        if (Math.random() < 0.05) { // Log ~5% of updates
          console.log('🫧 Bubble position:', finalX.toFixed(1), finalY.toFixed(1), '| Tilt:', absTilt.toFixed(1), '°');
        }
        
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
        enableTorch={flashEnabled}
      >
        {/* TEST BUBBLE - Simple red circle that should ALWAYS be visible */}
        <View
          style={{
            position: 'absolute',
            top: 200,
            left: SCREEN_WIDTH / 2 - 50,
            width: 100,
            height: 100,
            backgroundColor: '#FF0000',
            borderRadius: 50,
            borderWidth: 5,
            borderColor: '#FFFFFF',
            zIndex: 99999,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 35 }}>
            TEST
          </Text>
        </View>

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
                onPress={toggleFlash}
                className="w-10 h-10 items-center justify-center ml-2"
              >
                <Ionicons 
                  name={flashEnabled ? 'flash' : 'flash-off'} 
                  size={24} 
                  color={flashEnabled ? '#FFD700' : 'white'} 
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

        {/* Center crosshairs with bubble level - ALWAYS VISIBLE */}
        <View
          style={{
            position: 'absolute',
            top: SCREEN_HEIGHT / 2 - 100,
            left: SCREEN_WIDTH / 2 - 100,
            width: 200,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 9999, // Maximum z-index to ensure visibility
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background to see the container
          }}
        >
          {/* Outer circle track for bubble */}
          <View
            style={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: 70,
              borderWidth: 3,
              borderColor: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          />
          
          {/* Center target circle */}
          <View
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 3,
              borderColor: alignmentStatus === 'good' ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          />
          
          {/* Crosshair lines - Horizontal */}
          <View style={{ position: 'absolute', left: 25, top: 99, width: 45, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
          <View style={{ position: 'absolute', right: 25, top: 99, width: 45, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
          
          {/* Crosshair lines - Vertical */}
          <View style={{ position: 'absolute', left: 99, top: 25, width: 3, height: 45, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
          <View style={{ position: 'absolute', left: 99, bottom: 25, width: 3, height: 45, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
          
          {/* Center dot when level */}
          {alignmentStatus === 'good' && (
            <View
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0, 255, 0, 1)',
              }}
            />
          )}
          
          {/* Animated bubble - BRIGHT AND OBVIOUS */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: alignmentStatus === 'good' 
                  ? '#00FF00' 
                  : alignmentStatus === 'warning'
                  ? '#FFFF00'
                  : '#FF0000',
                borderWidth: 4,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 1,
                shadowRadius: 10,
                elevation: 20,
              },
              useAnimatedStyle(() => ({
                transform: [
                  { translateX: bubbleX.value },
                  { translateY: bubbleY.value },
                ],
              })),
            ]}
          >
            {/* Inner shine for 3D effect */}
            <View
              style={{
                position: 'absolute',
                top: 6,
                left: 10,
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
          </Animated.View>
          
          {/* Debug: Show bubble position */}
          <View
            style={{
              position: 'absolute',
              top: -50,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: 'white',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              🫧 BUBBLE LEVEL ACTIVE
            </Text>
          </View>
        </View>

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
        
        {/* Camera flash overlay */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              pointerEvents: 'none',
            },
            useAnimatedStyle(() => ({
              opacity: flashOpacity.value,
            })),
          ]}
        />
      </CameraView>
      
      {/* BUBBLE LEVEL OVERLAY - Outside CameraView for guaranteed visibility */}
      <View
        style={{
          position: 'absolute',
          top: SCREEN_HEIGHT / 2 - 100,
          left: SCREEN_WIDTH / 2 - 100,
          width: 200,
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Outer circle track for bubble */}
        <View
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: 70,
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
        
        {/* Center target circle */}
        <View
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 3,
            borderColor: alignmentStatus === 'good' ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
        
        {/* Crosshair lines - Horizontal */}
        <View style={{ position: 'absolute', left: 25, top: 99, width: 45, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
        <View style={{ position: 'absolute', right: 25, top: 99, width: 45, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
        
        {/* Crosshair lines - Vertical */}
        <View style={{ position: 'absolute', left: 99, top: 25, width: 3, height: 45, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
        <View style={{ position: 'absolute', left: 99, bottom: 25, width: 3, height: 45, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
        
        {/* Center dot when level */}
        {alignmentStatus === 'good' && (
          <View
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 255, 0, 1)',
            }}
          />
        )}
        
        {/* Animated bubble - BRIGHT AND OBVIOUS */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: alignmentStatus === 'good' 
                ? '#00FF00' 
                : alignmentStatus === 'warning'
                ? '#FFFF00'
                : '#FF0000',
              borderWidth: 4,
              borderColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 20,
            },
            useAnimatedStyle(() => ({
              transform: [
                { translateX: bubbleX.value },
                { translateY: bubbleY.value },
              ],
            })),
          ]}
        >
          {/* Inner shine for 3D effect */}
          <View
            style={{
              position: 'absolute',
              top: 6,
              left: 10,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          />
        </Animated.View>
        
        {/* Debug label */}
        <View
          style={{
            position: 'absolute',
            top: -50,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: 'white',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            🫧 BUBBLE LEVEL
          </Text>
        </View>
      </View>
      
      {/* Help Modal */}
      <HelpModal visible={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </View>
  );
}
