import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface LabelModalProps {
  visible: boolean;
  onComplete: (label: string | null) => void;
  onDismiss: () => void;
}

export default function LabelModal({ visible, onComplete, onDismiss }: LabelModalProps) {
  const [label, setLabel] = useState('');

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();
    onComplete(label.trim() || null);
    setLabel(''); // Reset for next time
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onComplete(null);
    setLabel(''); // Reset for next time
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setLabel('');
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <Pressable 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
          onPress={handleCancel}
        >
          <Pressable 
            style={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.4,
              shadowRadius: 24,
              elevation: 20,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <BlurView intensity={100} tint="light">
              <View style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
                {/* Header */}
                <View style={{
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(88,86,214,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                        <Ionicons name="pricetag" size={20} color="#5856D6" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 18, 
                          fontWeight: '700',
                          color: '#1C1C1E',
                          letterSpacing: -0.3,
                        }}>
                          Label This Item
                        </Text>
                        <Text style={{ 
                          color: '#8E8E93', 
                          fontSize: 12, 
                          fontWeight: '500',
                          marginTop: 1,
                        }}>
                          Optional
                        </Text>
                      </View>
                    </View>
                    <Pressable 
                      onPress={handleCancel}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: 'rgba(120,120,128,0.16)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="close" size={20} color="#3C3C43" />
                    </Pressable>
                  </View>
                </View>

                {/* Content */}
                <View style={{ paddingHorizontal: 20, paddingVertical: 18 }}>
                  {/* Input Field */}
                  <View style={{ marginBottom: 6 }}>
                    <Text style={{ 
                      color: '#3C3C43', 
                      fontSize: 13, 
                      fontWeight: '600', 
                      marginBottom: 8,
                    }}>
                      What is this?
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderWidth: 2,
                      borderColor: 'rgba(120,120,128,0.25)',
                    }}>
                      <Ionicons name="pricetag-outline" size={18} color="#8E8E93" />
                      <TextInput
                        value={label}
                        onChangeText={setLabel}
                        placeholder="e.g., Kitchen Table, Door Frame..."
                        placeholderTextColor="#8E8E93"
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: '500',
                          color: '#1C1C1E',
                        }}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                        maxLength={50}
                      />
                      {label.length > 0 && (
                        <Pressable onPress={() => setLabel('')}>
                          <Ionicons name="close-circle" size={20} color="#8E8E93" />
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <Text style={{ 
                    color: '#8E8E93', 
                    fontSize: 11,
                    fontWeight: '500',
                  }}>
                    This label will appear in emails and saved photos
                  </Text>
                </View>

                {/* Footer Buttons */}
                <View style={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  paddingTop: 4,
                }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Skip Button - Always visible */}
                    <Pressable
                      onPress={handleSkip}
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: pressed ? 'rgba(120,120,128,0.2)' : 'rgba(120,120,128,0.12)',
                        borderRadius: 12,
                        paddingVertical: 13,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1.5,
                        borderColor: 'rgba(120,120,128,0.2)',
                      })}
                    >
                      <Text style={{ 
                        color: '#3C3C43', 
                        fontWeight: '600', 
                        fontSize: 15, 
                      }}>
                        Skip
                      </Text>
                    </Pressable>

                    {/* Continue Button */}
                    <Pressable
                      onPress={handleContinue}
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: pressed ? '#0066CC' : '#007AFF',
                        borderRadius: 12,
                        paddingVertical: 13,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#007AFF',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: pressed ? 0.6 : 0.4,
                        shadowRadius: pressed ? 12 : 8,
                        elevation: 6,
                      })}
                    >
                      <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={{ 
                        color: 'white', 
                        fontWeight: '700', 
                        fontSize: 15, 
                        marginLeft: 4,
                      }}>
                        Continue
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
