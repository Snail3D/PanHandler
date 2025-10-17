import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BlueprintPlacementModalProps {
  visible: boolean;
  pointsPlaced: number; // 0, 1, or 2
  onDismiss: () => void;
}

export default function BlueprintPlacementModal({ visible, pointsPlaced, onDismiss }: BlueprintPlacementModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ 
        position: 'absolute',
        top: insets.top + 20,
        left: 20,
        right: 20,
        borderRadius: 16,
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
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.4)',
            padding: 20,
          }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="locate-outline" size={24} color="#2E7D32" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
                  Blueprint Scale
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onDismiss();
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={16} color="rgba(0, 0, 0, 0.6)" />
              </Pressable>
            </View>

            {/* Instructions */}
            <View style={{
              backgroundColor: 'rgba(52, 199, 89, 0.15)',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(52, 199, 89, 0.3)',
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2E7D32',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                {pointsPlaced === 0 && "Tap to place first point"}
                {pointsPlaced === 1 && "Tap to place second point"}
                {pointsPlaced === 2 && "Points placed!"}
              </Text>
              <Text style={{
                fontSize: 13,
                color: 'rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                lineHeight: 18,
              }}>
                {pointsPlaced < 2 
                  ? "Place two points on a known distance in your blueprint or drawing"
                  : "Next, enter the real-world distance between these points"}
              </Text>
            </View>

            {/* Points Progress */}
            <View style={{ 
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
              gap: 12,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: pointsPlaced >= 1 ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 2,
                borderColor: pointsPlaced >= 1 ? '#34C759' : 'rgba(0, 0, 0, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {pointsPlaced >= 1 ? (
                  <Ionicons name="checkmark" size={24} color="#34C759" />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: '700', color: 'rgba(0, 0, 0, 0.3)' }}>1</Text>
                )}
              </View>

              <View style={{
                width: 24,
                height: 2,
                backgroundColor: pointsPlaced === 2 ? '#34C759' : 'rgba(0, 0, 0, 0.2)',
              }} />

              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: pointsPlaced === 2 ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 2,
                borderColor: pointsPlaced === 2 ? '#34C759' : 'rgba(0, 0, 0, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {pointsPlaced === 2 ? (
                  <Ionicons name="checkmark" size={24} color="#34C759" />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: '700', color: 'rgba(0, 0, 0, 0.3)' }}>2</Text>
                )}
              </View>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
