import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  remainingSaves: number;
  remainingEmails: number;
}

// Comparison row component (matching HelpModal style)
const ComparisonRow = ({ 
  feature, 
  free, 
  pro,
  last = false 
}: { 
  feature: string; 
  free: string; 
  pro: string;
  last?: boolean;
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
      <Text style={{ fontSize: 14, color: '#3C3C43' }}>{free}</Text>
    </View>
    <View style={{ 
      width: 70, 
      padding: 12, 
      alignItems: 'center',
      backgroundColor: 'rgba(255,149,0,0.08)',
    }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#FF9500' }}>{pro}</Text>
    </View>
  </View>
);

export default function PaywallModal({ 
  visible, 
  onClose, 
  onUpgrade,
  remainingSaves,
  remainingEmails
}: PaywallModalProps) {
  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onUpgrade();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const totalRemaining = remainingSaves + remainingEmails;

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
              {/* Close Button */}
              <Pressable
                onPress={handleClose}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>

              {/* Icon */}
              <View 
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#FEF3C7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
              >
                <Ionicons name="warning" size={40} color="#F59E0B" />
              </View>

              {/* Title */}
              <Text 
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#111827',
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                You've Used Half Your Free Saves
              </Text>

              {/* Subtitle */}
              <Text 
                style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 24,
                }}
              >
                {totalRemaining} {totalRemaining === 1 ? 'save' : 'saves'} remaining this month
              </Text>

              {/* Comparison Table */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ 
                  borderRadius: 14, 
                  borderWidth: 1, 
                  borderColor: 'rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}>
                  {/* Header Row */}
                  <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <View style={{ flex: 1, padding: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>Feature</Text>
                    </View>
                    <View style={{ width: 70, padding: 12, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>Free</Text>
                    </View>
                    <View style={{ width: 70, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,149,0,0.08)' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#FF9500' }}>Pro</Text>
                    </View>
                  </View>

                  {/* Feature Rows */}
                  <ComparisonRow feature="Monthly Saves" free="10" pro="∞" />
                  <ComparisonRow feature="Monthly Emails" free="10" pro="∞" />
                  <ComparisonRow feature="Measurements" free="∞" pro="∞" />
                  <ComparisonRow feature="All Tools" free="✓" pro="✓" />
                  <ComparisonRow feature="Coin Calibration" free="✓" pro="✓" />
                  <ComparisonRow feature="CAD Canvas" free="✓" pro="✓" last />
                </View>
              </View>

              {/* Features List */}
              <View style={{ marginBottom: 28 }}>
                <FeatureRow icon="infinite" text="Unlimited saves & emails" />
                <FeatureRow icon="time" text="For life - one-time payment" />
                <FeatureRow icon="flash" text="Support indie development" />
                <FeatureRow icon="shield-checkmark" text="No subscriptions, no ads" />
              </View>

              {/* Go Pro Button */}
              <Pressable
                onPress={handleUpgrade}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#D97706' : '#F59E0B',
                  paddingVertical: 18,
                  borderRadius: 16,
                  marginBottom: 12,
                  shadowColor: '#F59E0B',
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
                  🌟 Go Pro - $9.97
                </Text>
              </Pressable>

              {/* Upgrade Button */}
              <Pressable
                onPress={handleUpgrade}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#1E40AF' : '#2563EB',
                  paddingVertical: 18,
                  borderRadius: 16,
                  marginBottom: 12,
                  shadowColor: '#2563EB',
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
                  Unlock Unlimited for $9.97
                </Text>
              </Pressable>

              {/* Continue Free Button */}
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
                  Continue with Free ({totalRemaining} {totalRemaining === 1 ? 'save' : 'saves'} left)
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}

function FeatureRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
      }}
    >
      <View 
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#DBEAFE',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color="#2563EB" />
      </View>
      <Text 
        style={{
          fontSize: 16,
          color: '#374151',
          fontWeight: '500',
          flex: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
