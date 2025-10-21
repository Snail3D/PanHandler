import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface MagneticDeclinationModalProps {
  visible: boolean;
  currentValue: number;
  onComplete: (declination: number) => void;
  onDismiss: () => void;
}

export default function MagneticDeclinationModal({ 
  visible, 
  currentValue,
  onComplete, 
  onDismiss 
}: MagneticDeclinationModalProps) {
  const [declinationInput, setDeclinationInput] = useState(currentValue.toString());

  const handleSave = () => {
    const parsed = parseFloat(declinationInput);
    const finalValue = isNaN(parsed) ? 0 : parsed;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();
    onComplete(finalValue);
    setDeclinationInput(finalValue.toString());
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setDeclinationInput(currentValue.toString());
    onDismiss();
  };

  const handleOpenWebsite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml');
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
              maxWidth: 420,
              borderRadius: 32,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.5,
              shadowRadius: 32,
              elevation: 24,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <BlurView intensity={100} tint="light">
              <View style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
                {/* Header */}
                <View style={{
                  paddingTop: 24,
                  paddingHorizontal: 24,
                  paddingBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: 'rgba(88,86,214,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                        shadowColor: '#5856D6',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                      }}>
                        <Ionicons name="compass" size={24} color="#5856D6" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 22, 
                          fontWeight: '700',
                          color: '#1C1C1E',
                          letterSpacing: -0.5,
                        }}>
                          Magnetic Declination
                        </Text>
                        <Text style={{ 
                          color: '#8E8E93', 
                          fontSize: 13, 
                          fontWeight: '500',
                          marginTop: -2,
                        }}>
                          Adjust for True North
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
                <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
                  {/* Info note */}
                  <View style={{
                    backgroundColor: 'rgba(88,86,214,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(88,86,214,0.25)',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Ionicons name="information-circle" size={18} color="#5856D6" style={{ marginTop: 2, marginRight: 8 }} />
                      <Text style={{ 
                        flex: 1,
                        color: '#3C3C43', 
                        fontSize: 13, 
                        fontWeight: '600',
                        lineHeight: 18,
                      }}>
                        Enter your local magnetic declination in degrees. Positive for East, negative for West.
                      </Text>
                    </View>
                  </View>

                  {/* Input Field */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ 
                      color: '#3C3C43', 
                      fontSize: 14, 
                      fontWeight: '600', 
                      marginBottom: 10,
                    }}>
                      Declination (degrees)
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
                      <Ionicons name="compass-outline" size={22} color="#8E8E93" />
                      <TextInput
                        value={declinationInput}
                        onChangeText={setDeclinationInput}
                        placeholder="0.0"
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
                        keyboardType="numeric"
                      />
                      {declinationInput.length > 0 && (
                        <Pressable onPress={() => setDeclinationInput('0')}>
                          <Ionicons name="close-circle" size={22} color="#8E8E93" />
                        </Pressable>
                      )}
                    </View>
                    <Text style={{ 
                      fontSize: 12, 
                      color: '#8E8E93',
                      marginTop: 8,
                      textAlign: 'center',
                    }}>
                      Example: 14.5 (East) or -12.3 (West)
                    </Text>
                  </View>

                  {/* Find Your Declination Button */}
                  <Pressable
                    onPress={handleOpenWebsite}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? 'rgba(0,122,255,0.15)' : 'rgba(0,122,255,0.08)',
                      borderRadius: 12,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: 'rgba(0,122,255,0.2)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    <Ionicons name="globe-outline" size={18} color="#007AFF" />
                    <Text style={{ 
                      fontSize: 14, 
                      color: '#007AFF',
                      fontWeight: '600',
                      marginLeft: 8,
                    }}>
                      Find Your Location's Declination
                    </Text>
                    <Ionicons name="open-outline" size={14} color="#007AFF" style={{ marginLeft: 6 }} />
                  </Pressable>
                </View>

                {/* Footer Buttons */}
                <View style={{
                  paddingHorizontal: 24,
                  paddingBottom: 24,
                  paddingTop: 8,
                  alignItems: 'center',
                }}>
                  <View style={{ flexDirection: 'row', gap: 20, width: '100%', maxWidth: 320, alignItems: 'center', justifyContent: 'center' }}>
                    {/* Save Button */}
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

                    {/* Cancel Button */}
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
                        Cancel
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
