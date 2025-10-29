import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface EmailPromptModalProps {
  visible: boolean;
  onComplete: (email: string | null) => void;
  onDismiss: () => void;
}

export default function EmailPromptModal({ visible, onComplete, onDismiss }: EmailPromptModalProps) {
  const [email, setEmail] = useState('');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();
    onComplete(email.trim() || null);
    setEmail(''); // Reset for next time
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setEmail('');
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
        onPress={handleCancel}
      >
        <Pressable
          style={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 32,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.95)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.5,
            shadowRadius: 32,
            elevation: 24,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                {/* Header */}
                <View style={{
                  paddingTop: 18,
                  paddingHorizontal: 20,
                  paddingBottom: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: 'rgba(52,199,89,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                        shadowColor: '#34C759',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                      }}>
                        <Ionicons name="mail" size={24} color="#34C759" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 22,
                          fontWeight: '700',
                          color: '#1C1C1E',
                          letterSpacing: -0.5,
                        }}>
                          Email Address
                        </Text>
                        <Text style={{
                          color: '#8E8E93',
                          fontSize: 13,
                          fontWeight: '500',
                          marginTop: -2,
                        }}>
                          Auto-populate for future use
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={handleCancel}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(120,120,128,0.16)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="close" size={24} color="#3C3C43" />
                    </Pressable>
                  </View>
                </View>

                {/* Content */}
                <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14 }}>
                  {/* Security note */}
                  <View style={{
                    backgroundColor: 'rgba(52,199,89,0.12)',
                    borderRadius: 14,
                    padding: 12,
                    marginBottom: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(52,199,89,0.25)',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Ionicons name="lock-closed" size={18} color="#34C759" style={{ marginTop: 1, marginRight: 8 }} />
                      <Text style={{
                        flex: 1,
                        color: '#2E7D32',
                        fontSize: 13,
                        fontWeight: '600',
                        lineHeight: 18,
                      }}>
                        This is secure and not shared with us or anyone. It simply makes sending emails faster for you in the future.
                      </Text>
                    </View>
                  </View>

                  {/* Input Field */}
                  <View style={{ marginBottom: 0 }}>
                    <Text style={{
                      color: '#3C3C43',
                      fontSize: 14,
                      fontWeight: '600',
                      marginBottom: 8,
                    }}>
                      Your email address
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderWidth: 2,
                      borderColor: 'rgba(120,120,128,0.25)',
                    }}>
                      <Ionicons name="at" size={22} color="#8E8E93" />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="your@email.com"
                        placeholderTextColor="#8E8E93"
                        style={{
                          flex: 1,
                          marginLeft: 12,
                          fontSize: 16,
                          fontWeight: '500',
                          color: '#1C1C1E',
                        }}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleSave}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {email.length > 0 && (
                        <Pressable onPress={() => setEmail('')}>
                          <Ionicons name="close-circle" size={22} color="#8E8E93" />
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                {/* Footer Buttons */}
                <View style={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  paddingTop: 14,
                  alignItems: 'center',
                }}>
                  <View style={{ flexDirection: 'row', gap: 20, width: '100%', maxWidth: 320, alignItems: 'center', justifyContent: 'center' }}>
                    {/* Save Button - DARK text & icon, glassmorphic background */}
                    <Pressable
                      onPress={handleSave}
                      style={({ pressed }) => ({
                        flex: 1.4,
                        backgroundColor: pressed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 14,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                      })}
                    >
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="save" size={18} color="#1C1C1E" />
                      </View>
                      <Text style={{ 
                        color: '#1C1C1E', 
                        fontWeight: '700', 
                        fontSize: 16, 
                        marginLeft: 8,
                      }}>
                        Save
                      </Text>
                    </Pressable>

                    {/* Skip Button - LIGHT text, minimal background */}
                    <Pressable
                      onPress={handleCancel}
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: pressed ? 'rgba(120,120,128,0.08)' : 'transparent',
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Text style={{ 
                        color: '#8E8E93', 
                        fontWeight: '600', 
                        fontSize: 14, 
                      }}>
                        Skip
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
          </Pressable>
        </Pressable>
    </Modal>
  );
}
