import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SpecialOfferModalProps {
  visible: boolean;
  sessionsLeft: number;
  onAccept: () => void;
  onDecline: () => void;
}

export default function SpecialOfferModal({ 
  visible, 
  sessionsLeft,
  onAccept, 
  onDecline,
}: SpecialOfferModalProps) {
  const handleAccept = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAccept();
  };

  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecline();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDecline}
    >
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View
            style={{
              borderRadius: 24,
              width: '100%',
              maxWidth: 380,
              overflow: 'hidden',
              shadowColor: '#FF3B30',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 24,
              elevation: 20,
            }}
          >
            <BlurView intensity={35} tint="light" style={{ flex: 1 }}>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderWidth: 2,
                borderColor: 'rgba(255, 59, 48, 0.4)',
                padding: 32,
              }}>
                {/* Urgent Badge */}
                <View style={{
                  position: 'absolute',
                  top: -10,
                  right: 20,
                  backgroundColor: '#FF3B30',
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 20,
                  shadowColor: '#FF3B30',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                }}>
                  <Text style={{ color: 'white', fontWeight: '900', fontSize: 12, letterSpacing: 1 }}>
                    LIMITED TIME
                  </Text>
                </View>

                {/* Icon */}
                <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 20 }}>
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(255, 59, 48, 0.15)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: 'rgba(255, 59, 48, 0.3)',
                  }}>
                    <Ionicons name="star" size={40} color="#FF3B30" />
                  </View>
                </View>

                {/* Title */}
                <Text style={{ 
                  fontSize: 28, 
                  fontWeight: '900', 
                  color: '#1C1C1E', 
                  textAlign: 'center',
                  marginBottom: 12,
                  letterSpacing: -0.5,
                }}>
                  Special Offer!
                </Text>

                {/* Message */}
                <Text style={{ 
                  fontSize: 16, 
                  color: '#3C3C43', 
                  textAlign: 'center',
                  lineHeight: 24,
                  marginBottom: 24,
                }}>
                  {"You've been crushing it with 50 sessions! 🎉"}
                  {"\n\n"}
                  As a thank you, unlock Pro for just <Text style={{ fontWeight: '800', color: '#FF3B30' }}>$6.97</Text>
                  {"\n"}
                  <Text style={{ fontSize: 14, color: '#8E8E93', fontStyle: 'italic' }}>
                    (Regular price: $9.97)
                  </Text>
                </Text>

                {/* Countdown */}
                <View style={{
                  backgroundColor: 'rgba(255, 149, 0, 0.15)',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 24,
                  borderWidth: 2,
                  borderColor: 'rgba(255, 149, 0, 0.3)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="time-outline" size={20} color="#FF9500" />
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '700', 
                      color: '#1C1C1E',
                      marginLeft: 8,
                    }}>
                      {sessionsLeft === 3 ? "Offer expires in 3 sessions" : 
                       sessionsLeft === 2 ? "Only 2 sessions left!" :
                       "Last session - Final chance!"}
                    </Text>
                  </View>
                </View>

                {/* Benefits */}
                <View style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={{ fontSize: 15, color: '#1C1C1E', marginLeft: 12, flex: 1 }}>
                      Unlock Freehand Tool
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={{ fontSize: 15, color: '#1C1C1E', marginLeft: 12, flex: 1 }}>
                      Lifetime Access
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={{ fontSize: 15, color: '#1C1C1E', marginLeft: 12, flex: 1 }}>
                      Save $3.00 Forever
                    </Text>
                  </View>
                </View>

                {/* Accept Button */}
                <Pressable
                  onPress={handleAccept}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#E63428' : '#FF3B30',
                    borderRadius: 16,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginBottom: 12,
                    shadowColor: '#FF3B30',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  })}
                >
                  <Text style={{ 
                    color: 'white', 
                    fontWeight: '900', 
                    fontSize: 18,
                    letterSpacing: 0.5,
                  }}>
                    Get Pro for $6.97
                  </Text>
                </Pressable>

                {/* Decline Button */}
                <Pressable
                  onPress={handleDecline}
                  style={({ pressed }) => ({
                    paddingVertical: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <Text style={{ 
                    color: '#8E8E93', 
                    fontSize: 15,
                    fontWeight: '600',
                  }}>
                    {"Maybe later ("}
                    {sessionsLeft}
                    {" session"}
                    {sessionsLeft !== 1 ? "s" : ""}
                    {" left)"}
                  </Text>
                </Pressable>
              </View>
            </BlurView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
