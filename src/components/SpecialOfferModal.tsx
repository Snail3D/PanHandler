import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Svg, Path } from 'react-native-svg';

interface SpecialOfferModalProps {
  visible: boolean;
  sessionsLeft: number;
  onAccept: () => void;
  onDecline: () => void;
}

// Get funny copy based on sessions left
const getCopy = (sessionsLeft: number) => {
  if (sessionsLeft === 3) {
    return {
      title: "We've Noticed Something...",
      message: "You haven't tried our fancy squiggly line tool yet! 🤨",
      subMessage: "You know... for when straight lines are just too mainstream.",
      price: "$6.97",
      buttonText: "Fine, I'll Try It",
    };
  } else if (sessionsLeft === 2) {
    return {
      title: "You're Twisting Our Arm",
      message: "Alright tough guy, we'll drop it even MORE. 💪",
      subMessage: "But seriously, this squiggly line is pretty cool...",
      price: "$5.97",
      buttonText: "Okay, You Win",
    };
  } else {
    return {
      title: "SERIOUSLY, Last Offer",
      message: "This is it. Final price. We're basically giving it away. 🫠",
      subMessage: "After this? Full price forever. No more Mr. Nice App.",
      price: "$4.97",
      buttonText: "FINE, TAKE MY MONEY",
    };
  }
};

export default function SpecialOfferModal({ 
  visible, 
  sessionsLeft,
  onAccept, 
  onDecline,
}: SpecialOfferModalProps) {
  const copy = getCopy(sessionsLeft);
  
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

                {/* Icon with Fancy Squiggly Line Illustration */}
                <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 20 }}>
                  <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: 'rgba(88, 86, 214, 0.15)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: 'rgba(88, 86, 214, 0.3)',
                  }}>
                    {/* Fancy Squiggly Line SVG */}
                    <Svg width="60" height="60" viewBox="0 0 60 60">
                      <Path
                        d="M 10 30 Q 20 15, 30 30 T 50 30"
                        stroke="#5856D6"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Start dot */}
                      <Path
                        d="M 10 30 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0"
                        fill="#5856D6"
                      />
                      {/* End dot */}
                      <Path
                        d="M 50 30 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0"
                        fill="#5856D6"
                      />
                    </Svg>
                  </View>
                </View>

                {/* Title */}
                <Text style={{ 
                  fontSize: 26, 
                  fontWeight: '900', 
                  color: '#1C1C1E', 
                  textAlign: 'center',
                  marginBottom: 16,
                  letterSpacing: -0.5,
                }}>
                  {copy.title}
                </Text>

                {/* Message */}
                <Text style={{ 
                  fontSize: 17, 
                  fontWeight: '600',
                  color: '#1C1C1E', 
                  textAlign: 'center',
                  lineHeight: 24,
                  marginBottom: 8,
                }}>
                  {copy.message}
                </Text>
                
                <Text style={{ 
                  fontSize: 15, 
                  color: '#8E8E93', 
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: 24,
                  fontStyle: 'italic',
                }}>
                  {copy.subMessage}
                </Text>

                {/* Price - BIG and BOLD */}
                <View style={{
                  backgroundColor: 'rgba(88, 86, 214, 0.15)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                  borderWidth: 2,
                  borderColor: 'rgba(88, 86, 214, 0.3)',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 48, fontWeight: '900', color: '#5856D6' }}>
                    {copy.price}
                  </Text>
                  {sessionsLeft < 3 && (
                    <View style={{
                      backgroundColor: 'rgba(255, 59, 48, 0.15)',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginTop: 8,
                    }}>
                      <Text style={{ 
                        fontSize: 13, 
                        fontWeight: '700', 
                        color: '#FF3B30',
                        letterSpacing: 0.5,
                      }}>
                        {sessionsLeft === 2 ? "Was $6.97!" : "Was $5.97!"}
                      </Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 13, color: '#3C3C43', marginTop: 6 }}>
                    One-time • Lifetime Access
                  </Text>
                </View>

                {/* Countdown Warning */}
                <View style={{
                  backgroundColor: 'rgba(255, 149, 0, 0.15)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 24,
                  borderWidth: 2,
                  borderColor: 'rgba(255, 149, 0, 0.3)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="time-outline" size={20} color="#FF9500" />
                    <Text style={{ 
                      fontSize: 14, 
                      fontWeight: '700', 
                      color: '#1C1C1E',
                      marginLeft: 8,
                      textAlign: 'center',
                    }}>
                      {sessionsLeft === 3 ? "3 sessions left to decide" : 
                       sessionsLeft === 2 ? "⚠️ Only 2 sessions left!" :
                       "🚨 LAST SESSION - NOW OR NEVER"}
                    </Text>
                  </View>
                </View>

                {/* Accept Button */}
                <Pressable
                  onPress={handleAccept}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#4A48B8' : '#5856D6',
                    borderRadius: 16,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginBottom: 12,
                    shadowColor: '#5856D6',
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
                    {copy.buttonText}
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
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                    {sessionsLeft === 1 
                      ? "Nah, I hate saving money" 
                      : `Maybe later (${sessionsLeft} session${sessionsLeft !== 1 ? "s" : ""} left)`
                    }
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
