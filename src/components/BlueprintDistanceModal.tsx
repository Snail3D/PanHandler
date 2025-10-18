import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BlueprintDistanceModalProps {
  visible: boolean;
  onComplete: (distance: number, unit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi') => void;
  onDismiss: () => void;
  mode?: 'blueprint' | 'aerial'; // Type of calibration
}

export default function BlueprintDistanceModal({ visible, onComplete, onDismiss, mode = 'blueprint' }: BlueprintDistanceModalProps) {
  const insets = useSafeAreaInsets();
  
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState<'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi'>('cm');

  const isAerial = mode === 'aerial';
  const title = isAerial ? 'Ground Distance' : 'Enter Distance';
  const promptText = isAerial
    ? 'What is the real-world ground distance between the two points?'
    : 'What is the real-world distance between the two points you placed?';
  const icon = isAerial ? 'airplane-outline' : 'resize-outline';
  const iconColor = isAerial ? '#00C7BE' : '#2E7D32';

  const distanceNum = parseFloat(distance);
  const isValid = !isNaN(distanceNum) && distanceNum > 0;

  const handleContinue = () => {
    if (!isValid) return;
    onComplete(distanceNum, unit);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <View style={{
          position: 'absolute',
          top: insets.top + 80,
          left: 20,
          right: 20,
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
        }}>
          <BlurView
            intensity={40}
            tint="light"
            style={{
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.4)',
              padding: 20,
            }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={icon as any} size={24} color={iconColor} style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
                    {title}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onDismiss();
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={18} color="rgba(0, 0, 0, 0.6)" />
                </Pressable>
              </View>

              <Text style={{ 
                marginBottom: 20, 
                fontSize: 14, 
                color: 'rgba(0, 0, 0, 0.6)',
                lineHeight: 20,
              }}>
                {promptText}
              </Text>

              {/* Distance Input */}
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                marginBottom: 16,
              }}>
                <TextInput
                  value={distance}
                  onChangeText={setDistance}
                  placeholder="Enter distance"
                  keyboardType="numeric"
                  autoFocus
                  style={{
                    padding: 16,
                    fontSize: 24,
                    fontWeight: '600',
                    color: 'rgba(0, 0, 0, 0.85)',
                    textAlign: 'center',
                  }}
                />
              </View>

              {/* Unit Toggle - Two Rows */}
              <View style={{ marginBottom: 20, gap: 8 }}>
                {/* Row 1: Small units */}
                <View style={{ 
                  flexDirection: 'row', 
                  padding: 4,
                  backgroundColor: 'rgba(120, 120, 128, 0.12)',
                  borderRadius: 10,
                }}>
                  {(['mm', 'cm', 'in', 'm', 'ft'] as const).map((u) => (
                    <Pressable
                      key={u}
                      onPress={() => {
                        setUnit(u);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: unit === u ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                      }}
                    >
                      <Text style={{
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: '600',
                        color: unit === u ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)',
                      }}>
                        {u}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Row 2: Large units (km, mi) */}
                <View style={{ 
                  flexDirection: 'row', 
                  padding: 4,
                  backgroundColor: 'rgba(120, 120, 128, 0.12)',
                  borderRadius: 10,
                  gap: 4,
                }}>
                  {(['km', 'mi'] as const).map((u) => (
                    <Pressable
                      key={u}
                      onPress={() => {
                        setUnit(u);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: unit === u ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                      }}
                    >
                      <Text style={{
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: '600',
                        color: unit === u ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)',
                      }}>
                        {u}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Live Preview */}
              {isValid && (
                <View style={{
                  backgroundColor: 'rgba(52, 199, 89, 0.15)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(52, 199, 89, 0.3)',
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#2E7D32',
                    textAlign: 'center',
                  }}>
                    {distance} {unit}
                  </Text>
                </View>
              )}

              {/* LOCK IN Button */}
              {isValid && (
                <Pressable
                  onPress={() => {
                    // GoldenEye haptics
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 120);
                    setTimeout(() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }, 240);
                    Keyboard.dismiss();
                    handleContinue();
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: pressed 
                      ? 'rgba(52, 199, 89, 0.9)' 
                      : 'rgba(52, 199, 89, 0.85)',
                    borderRadius: 20,
                    paddingVertical: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#34C759',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                  })}
                >
                  <Text style={{ 
                    color: '#FFFFFF', 
                    fontWeight: '900', 
                    fontSize: 28,
                    letterSpacing: 2,
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    LOCK IN
                  </Text>
                </Pressable>
              )}
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}
