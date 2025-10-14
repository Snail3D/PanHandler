import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const ComparisonRow = ({ 
  feature, 
  free, 
  pro,
}: { 
  feature: string; 
  free: string | React.ReactNode; 
  pro: string | React.ReactNode;
}) => (
  <View 
    style={{ 
      flexDirection: 'row', 
      borderTopWidth: 1, 
      borderTopColor: 'rgba(0,0,0,0.06)',
    }}
  >
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 14, color: '#1C1C1E' }}>{feature}</Text>
    </View>
    <View style={{ width: 70, padding: 12, alignItems: 'center' }}>
      {typeof free === 'string' ? (
        <Text style={{ fontSize: 14, color: '#3C3C43' }}>{free}</Text>
      ) : free}
    </View>
    <View style={{ 
      width: 70, 
      padding: 12, 
      alignItems: 'center',
      backgroundColor: 'rgba(0,122,255,0.08)',
    }}>
      {typeof pro === 'string' ? (
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#007AFF' }}>{pro}</Text>
      ) : pro}
    </View>
  </View>
);

export default function PaywallModal({ 
  visible, 
  onClose, 
  onUpgrade,
}: PaywallModalProps) {
  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onUpgrade();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <Pressable 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
          onPress={handleClose}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              width: '100%',
              maxWidth: 400,
              maxHeight: '85%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 16,
            }}
          >
            <ScrollView 
              contentContainerStyle={{ padding: 32 }}
              showsVerticalScrollIndicator={false}
            >
              <View 
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#007AFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
              >
                <Ionicons name="star" size={40} color="#FFFFFF" />
              </View>

              <Text 
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#111827',
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                Upgrade to Pro
              </Text>

              <Text 
                style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 24,
                }}
              >
                Unlock unlimited precision
              </Text>

              <View style={{ marginBottom: 24 }}>
                <View style={{ 
                  borderRadius: 14, 
                  borderWidth: 1, 
                  borderColor: 'rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}>
                  <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <View style={{ flex: 1, padding: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>FEATURE</Text>
                    </View>
                    <View style={{ width: 70, padding: 12, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>FREE</Text>
                    </View>
                    <View style={{ width: 70, padding: 12, alignItems: 'center', backgroundColor: 'rgba(0,122,255,0.08)' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#007AFF' }}>PRO</Text>
                    </View>
                  </View>

                  <ComparisonRow 
                    feature="Total exports (save/email)" 
                    free="∞" 
                    pro="∞" 
                  />
                  <ComparisonRow 
                    feature="Measurements per photo" 
                    free="∞" 
                    pro="∞" 
                  />
                  <ComparisonRow 
                    feature="Remove watermarks" 
                    free={<Ionicons name="close" size={20} color="#EF4444" />}
                    pro={<Ionicons name="checkmark" size={20} color="#007AFF" />}
                  />
                </View>
              </View>

              <Text 
                style={{
                  fontSize: 48,
                  fontWeight: '700',
                  color: '#007AFF',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                $9.97
              </Text>
              
              <Text 
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                One-time purchase • Lifetime access
              </Text>

              <Pressable
                onPress={handleUpgrade}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#0051D5' : '#007AFF',
                  paddingVertical: 18,
                  borderRadius: 16,
                  marginBottom: 12,
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                })}
              >
                <Text 
                  style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  Purchase Pro
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={({ pressed }) => ({
                  paddingVertical: 14,
                  opacity: pressed ? 0.6 : 1,
                  marginBottom: 8,
                })}
              >
                <Text 
                  style={{
                    color: '#007AFF',
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  Restore Purchase
                </Text>
              </Pressable>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => ({
                  paddingVertical: 14,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text 
                  style={{
                    color: '#6B7280',
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  Maybe Later
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
