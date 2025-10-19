import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BlueprintPlacementModalProps {
  visible: boolean;
  onStartPlacement: () => void; // Called when user taps "Place Pins Now"
  onDismiss: () => void;
  mode?: 'blueprint' | 'aerial'; // Type of calibration
}

export default function BlueprintPlacementModal({ visible, onStartPlacement, onDismiss, mode = 'blueprint' }: BlueprintPlacementModalProps) {
  const insets = useSafeAreaInsets();

  const isAerial = mode === 'aerial';
  const title = isAerial ? 'Aerial Photo Scale' : 'Blueprint Scale';
  const instructionTitle = isAerial ? 'Place Two Ground Reference Points' : 'Place Two Reference Points';
  const instructionText = isAerial 
    ? "Tap two points on the ground in your aerial photo with a known distance between them. Then enter the real-world distance."
    : "You'll tap two points on a known distance in your blueprint or drawing. Then enter the real-world distance.";
  const icon = isAerial ? 'airplane-outline' : 'locate-outline';
  const iconColor = isAerial ? '#00C7BE' : '#2E7D32';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={{ 
        position: 'absolute',
        top: insets.top + 40, // Higher position so doesn't cover pan text
        left: 32,
        right: 32,
        maxWidth: 300, // Smaller max width (was 360)
        alignSelf: 'center',
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      }}>
        <BlurView
          intensity={40}
          tint="light"
          style={{
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.4)',
            padding: 12, // Smaller padding (was 16)
          }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon as any} size={20} color={iconColor} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
                  {title}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onDismiss();
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={14} color="rgba(0, 0, 0, 0.6)" />
              </Pressable>
            </View>

            {/* Instructions */}
            <View style={{
              backgroundColor: 'rgba(100, 100, 100, 0.15)',
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: 'rgba(100, 100, 100, 0.3)',
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: 'rgba(0, 0, 0, 0.8)',
                textAlign: 'center',
                marginBottom: 6,
              }}>
                {instructionTitle}
              </Text>
              <Text style={{
                fontSize: 11,
                color: 'rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                lineHeight: 16,
              }}>
                {instructionText}
              </Text>
            </View>

            {/* Pan/Zoom tip */}
            <View style={{
              backgroundColor: 'rgba(33, 150, 243, 0.12)',
              borderRadius: 8,
              padding: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: 'rgba(33, 150, 243, 0.25)',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                <Ionicons name="hand-left-outline" size={14} color="#2196F3" style={{ marginRight: 4 }} />
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: '#2196F3',
                }}>
                  Pan & Zoom First
                </Text>
              </View>
              <Text style={{
                fontSize: 10,
                color: 'rgba(0, 0, 0, 0.6)',
                lineHeight: 14,
              }}>
                Pinch to zoom, two-finger drag to pan
              </Text>
            </View>

            {/* Ready to Place Pins Button - Centered text */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onStartPlacement();
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed 
                  ? 'rgba(100, 100, 100, 0.9)' 
                  : 'rgba(100, 100, 100, 0.85)',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <Text style={{ 
                color: '#FFFFFF', 
                fontWeight: '800', 
                fontSize: 15,
                letterSpacing: 0.5,
                textAlign: 'center', // Center the text
              }}>
                PLACE PINS
              </Text>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
