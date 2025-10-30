import React from 'react';
import { View, Text, Modal, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { CoinIcon, MapIcon, BlueprintIcon } from './CalibrationIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type PhotoType = 'coin' | 'map' | 'blueprint';

interface PhotoTypeOption {
  type: PhotoType;
  title: string;
  subtitle: string;
  icon: typeof CoinIcon;
  color: string;
}

const OPTIONS: PhotoTypeOption[] = [
  {
    type: 'coin',
    title: 'Coin Reference',
    subtitle: 'Classic calibration with a coin',
    icon: CoinIcon,
    color: '#FF9500',
  },
  {
    type: 'blueprint',
    title: 'Known Scale Mode',
    subtitle: 'For aerial photos, blueprints, and more',
    icon: BlueprintIcon,
    color: '#5856D6',
  },
];

interface PhotoTypeSelectionModalProps {
  visible: boolean;
  onSelect: (type: PhotoType) => void;
  onCancel: () => void;
  sessionColor?: { main: string; glow: string }; // Use session color for visual continuity
}

const PhotoTypeSelectionModal: React.FC<PhotoTypeSelectionModalProps> = ({
  visible,
  onSelect,
  onCancel,
  sessionColor,
}) => {
  const handleSelect = (type: PhotoType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(type);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCancel();
  };

  // Use session color or fallback to default
  const accentColor = sessionColor?.main || '#3B82F6';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={handleCancel}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}>
        <Pressable 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onPress={handleCancel}
        />
        
        {/* Watery Glassmorphic Container */}
        <BlurView
          intensity={45}
          tint="light"
          style={{
            width: SCREEN_WIDTH * 0.88,
            maxWidth: 440,
            borderRadius: 32,
            overflow: 'hidden',
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.3,
            shadowRadius: 40,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 32,
            padding: 28,
            paddingBottom: 24,
            borderWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.4)',
          }}>
            {/* Header */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '900',
                color: 'rgba(0, 0, 0, 0.9)',
                textAlign: 'center',
                marginBottom: 8,
                letterSpacing: -0.5,
              }}>
                Choose Photo Type
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                lineHeight: 22,
              }}>
                How would you like to calibrate this photo?
              </Text>
            </View>

            {/* Options - Bigger, more spacing */}
            <View style={{ gap: 16, marginBottom: 20 }}>
              {OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Pressable
                    key={option.type}
                    onPress={() => handleSelect(option.type)}
                    style={({ pressed }) => ({
                      transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                    })}
                  >
                    <BlurView
                      intensity={30}
                      tint="light"
                      style={{
                        borderRadius: 20,
                        overflow: 'hidden',
                      }}
                    >
                      <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.65)',
                        borderRadius: 20,
                        padding: 18,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        shadowColor: option.color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                      }}>
                        {/* Icon - Use session color! */}
                        <View style={{
                          width: 64,
                          height: 64,
                          borderRadius: 18,
                          backgroundColor: `${accentColor}20`,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                          borderWidth: 1,
                          borderColor: `${accentColor}30`,
                        }}>
                          <IconComponent size={36} color={accentColor} />
                        </View>

                        {/* Text */}
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: 18,
                            fontWeight: '800',
                            color: 'rgba(0, 0, 0, 0.9)',
                            marginBottom: 4,
                          }}>
                            {option.title}
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: 'rgba(0, 0, 0, 0.55)',
                            lineHeight: 18,
                          }}>
                            {option.subtitle}
                          </Text>
                        </View>

                        {/* Chevron - session color */}
                        <View style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: `${accentColor}15`,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Text style={{ 
                            color: accentColor, 
                            fontSize: 18, 
                            fontWeight: '700' 
                          }}>›</Text>
                        </View>
                      </View>
                    </BlurView>
                  </Pressable>
                );
              })}
            </View>

            {/* Cancel Button - Watery style */}
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => ({
                marginTop: 24, // Increased spacing above Cancel
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <BlurView
                intensity={25}
                tint="light"
                style={{
                  borderRadius: 18,
                  overflow: 'hidden',
                }}
              >
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.55)',
                  borderRadius: 18,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}>
                  <Text style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: 'rgba(0, 0, 0, 0.7)',
                  }}>
                    Go Back
                  </Text>
                </View>
              </BlurView>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

export default PhotoTypeSelectionModal;
