import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  type?: 'info' | 'success' | 'error' | 'warning';
}

export default function AlertModal({ 
  visible, 
  title,
  message,
  onClose, 
  confirmText = 'OK',
  cancelText,
  onConfirm,
  type = 'info',
}: AlertModalProps) {
  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: '#34C759' };
      case 'error':
        return { name: 'close-circle' as const, color: '#FF3B30' };
      case 'warning':
        return { name: 'warning' as const, color: '#FF9500' };
      default:
        return { name: 'information-circle' as const, color: '#007AFF' };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <Pressable 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
          onPress={handleCancel}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              borderRadius: 20,
              width: '100%',
              maxWidth: 340,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <BlurView intensity={35} tint="light" style={{ flex: 1 }}>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                padding: 24,
              }}>
                {/* Icon */}
                <View 
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: `${iconConfig.color}15`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name={iconConfig.name} size={32} color={iconConfig.color} />
                </View>

                {/* Title */}
                <Text 
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: '#1C1C1E',
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  {title}
                </Text>

                {/* Message */}
                <Text 
                  style={{
                    fontSize: 15,
                    color: '#3C3C43',
                    textAlign: 'center',
                    marginBottom: 24,
                    lineHeight: 22,
                  }}
                >
                  {message}
                </Text>

                {/* Buttons */}
                <View style={{ gap: 10 }}>
                  <Pressable
                    onPress={handleConfirm}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? 'rgba(0, 122, 255, 0.9)' : '#007AFF',
                      paddingVertical: 14,
                      borderRadius: 12,
                    })}
                  >
                    <Text 
                      style={{
                        color: '#FFFFFF',
                        fontSize: 17,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      {confirmText}
                    </Text>
                  </Pressable>

                  {cancelText && (
                    <Pressable
                      onPress={handleCancel}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? 'rgba(142, 142, 147, 0.1)' : 'rgba(142, 142, 147, 0.08)',
                        paddingVertical: 14,
                        borderRadius: 12,
                      })}
                    >
                      <Text 
                        style={{
                          color: '#007AFF',
                          fontSize: 17,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        {cancelText}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
