import { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface RatingPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onRate: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RatingPromptModal({ visible, onClose, onRate }: RatingPromptModalProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(0.8, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleYes = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onRate();
  };

  const handleNotNow = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.3)', 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 30
        }}>
          <Animated.View style={[{
            width: '100%',
            maxWidth: 400,
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 16,
          }, animatedStyle]}>
            <BlurView intensity={35} tint="light" style={{ width: '100%' }}>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.35)',
                padding: 28,
              }}>
            {/* Star Icon */}
            <View style={{ 
              alignItems: 'center', 
              marginBottom: 20 
            }}>
              <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#FFD700',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 8,
              }}>
                <Ionicons name="star" size={40} color="white" />
              </View>
            </View>

            {/* Title */}
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: '#1C1C1E', 
              textAlign: 'center',
              marginBottom: 12
            }}>
              Enjoying PanHandler?
            </Text>

            {/* Description */}
            <Text style={{ 
              fontSize: 16, 
              color: '#3C3C43', 
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 28
            }}>
              Your feedback helps us improve and reach more users who need precise measurements!
            </Text>

            {/* Buttons */}
            <View style={{ gap: 12 }}>
              {/* Rate Us Button */}
              <AnimatedPressable
                onPress={handleYes}
                style={{
                  backgroundColor: '#007AFF',
                  paddingVertical: 16,
                  borderRadius: 14,
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="star" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 17, 
                    fontWeight: '600',
                  }}>
                    Rate on App Store ⭐️
                  </Text>
                </View>
              </AnimatedPressable>

              {/* Not Now Button */}
              <Pressable
                onPress={handleNotNow}
                style={{
                  backgroundColor: '#F2F2F7',
                  paddingVertical: 16,
                  borderRadius: 14,
                }}
              >
                <Text style={{ 
                  color: '#3C3C43', 
                  fontSize: 17, 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Maybe Later
                </Text>
              </Pressable>
            </View>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}
