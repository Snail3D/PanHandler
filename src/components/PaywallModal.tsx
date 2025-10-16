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
      backgroundColor: 'rgba(88, 86, 214, 0.15)',
    }}>
      {typeof pro === 'string' ? (
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#5856D6' }}>{pro}</Text>
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
              borderRadius: 20,
              width: '100%',
              maxWidth: 400,
              maxHeight: '85%',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <BlurView intensity={35} tint="light" style={{ flex: 1 }}>
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}>
                <ScrollView 
                  contentContainerStyle={{ padding: 32 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View 
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: 'rgba(88, 86, 214, 0.85)',
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
                      color: '#1C1C1E',
                      textAlign: 'center',
                      marginBottom: 12,
                    }}
                  >
                    Upgrade to Pro
                  </Text>

                  <Text 
                    style={{
                      fontSize: 16,
                      color: '#3C3C43',
                      textAlign: 'center',
                      marginBottom: 8,
                      lineHeight: 24,
                    }}
                  >
                    Unlock the Freehand tool
                  </Text>

                  {/* Freehand tool description */}
                  <View style={{
                    backgroundColor: 'rgba(88, 86, 214, 0.08)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(88, 86, 214, 0.15)',
                  }}>
                    <Text style={{
                      fontSize: 15,
                      color: '#1C1C1E',
                      textAlign: 'center',
                      lineHeight: 22,
                      marginBottom: 10,
                      fontWeight: '600',
                    }}>
                      ✨ Draw & measure anything
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#3C3C43',
                      textAlign: 'center',
                      lineHeight: 20,
                    }}>
                      Trace rivers on maps, measure winding cables, calculate areas of irregular shapes, or outline any curved path
                    </Text>
                  </View>

                  <View style={{ marginBottom: 24 }}>
                    <View style={{ 
                      borderRadius: 14, 
                      borderWidth: 1, 
                      borderColor: 'rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    }}>
                      <View style={{ flexDirection: 'row', backgroundColor: 'rgba(120, 120, 128, 0.12)' }}>
                        <View style={{ flex: 1, padding: 12 }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: '#3C3C43' }}>FEATURE</Text>
                        </View>
                        <View style={{ width: 70, padding: 12, alignItems: 'center' }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>FREE</Text>
                        </View>
                        <View style={{ width: 70, padding: 12, alignItems: 'center', backgroundColor: 'rgba(88, 86, 214, 0.15)' }}>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: '#5856D6' }}>PRO</Text>
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
                    </View>
                  </View>

                  <Text 
                    style={{
                      fontSize: 48,
                      fontWeight: '700',
                      color: '#5856D6',
                      textAlign: 'center',
                      marginBottom: 8,
                    }}
                  >
                    $9.97
                  </Text>
                  
                  <Text 
                    style={{
                      fontSize: 14,
                      color: '#3C3C43',
                      textAlign: 'center',
                      marginBottom: 24,
                    }}
                  >
                    One-time purchase • Lifetime access
                  </Text>

                  <Pressable
                    onPress={handleUpgrade}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? 'rgba(88, 86, 214, 0.95)' : 'rgba(88, 86, 214, 0.85)',
                      paddingVertical: 18,
                      borderRadius: 16,
                      marginBottom: 12,
                      shadowColor: '#5856D6',
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
                        color: '#5856D6',
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
                        color: '#8E8E93',
                        fontSize: 16,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      Maybe Later
                    </Text>
                  </Pressable>
                </ScrollView>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
