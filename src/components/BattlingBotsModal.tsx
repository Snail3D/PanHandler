import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface BattlingBotsModalProps {
  visible: boolean;
  onAccept: (price: number) => void;
  onDecline: () => void;
  userStats?: {
    measurementCount: number;
    freehandAttempts: number;
    hasUsedFreehand: boolean;
  };
}

type BotMessage = {
  bot: 'left' | 'right';
  text?: string; // Optional since backspace messages use meanText/niceText instead
  shouldBackspace?: boolean; // Type mean text then backspace and retype nice text
  meanText?: string; // The mean text to type first
  niceText?: string; // The nice text to replace it with
};

export default function BattlingBotsModal({ 
  visible, 
  onAccept,
  onDecline,
  userStats = { measurementCount: 0, freehandAttempts: 0, hasUsedFreehand: false },
}: BattlingBotsModalProps) {
  const [stage, setStage] = useState<'negotiation' | 'offer'>('negotiation');
  const [messages, setMessages] = useState<Array<{ bot: 'left' | 'right', text: string }>>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [showDeclineResponse, setShowDeclineResponse] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 second timer
  const scrollViewRef = useRef<ScrollView>(null);
  
  const offerOpacity = useSharedValue(0);
  
  // Single final offer
  const finalOffer = { price: 6.97, label: 'Final Offer', color: '#F59E0B' };
  
  // Generate dynamic behind-the-scenes conversation based on user stats
  const getBehindTheScenesScript = (): BotMessage[] => {
    const { measurementCount, freehandAttempts, hasUsedFreehand } = userStats;
    
    // Detect user behavior patterns
    let behaviorDescription = "playing around with the app";
    if (freehandAttempts > 5) {
      behaviorDescription = "drawing loops and squiggles nonstop";
    } else if (measurementCount > 10) {
      behaviorDescription = "measuring literally everything";
    } else if (hasUsedFreehand) {
      behaviorDescription = "trying out the freehand feature";
    }
    
    return [
      {
        bot: 'left',
        text: `Alright, they've been ${behaviorDescription}. Should we pitch them?`,
      },
      {
        bot: 'right',
        text: "Yeah, let's go. What's the angle?",
      },
      {
        bot: 'left',
        text: "Tell them it's great for cables, wires, measuring anything curvy...",
      },
      {
        bot: 'right',
        text: "Oh! And maps. Coastlines, property lines, all that stuff.",
      },
      {
        bot: 'left',
        text: "Perfect. Basically a digital measuring tape but for squiggly things.",
      },
      {
        bot: 'right',
        shouldBackspace: true,
        meanText: "Wait. Can they SEE this conversat—",
        niceText: "...let's talk pricing. NOW.",
      },
    ];
  };
  
  // Script for the negotiation
  const getNegotiationScript = (): BotMessage[] => [
    {
      bot: 'left',
      text: "Right. So... $8.97?",
    },
    {
      bot: 'right',
      shouldBackspace: true,
      meanText: "Way too expensive. This user isn't gonna pay th—",
      niceText: "Let's do $6.97. Nice and reasonable.",
    },
    {
      bot: 'left',
      shouldBackspace: true,
      meanText: "Are you CRAZY? We'll barely make anyth—",
      niceText: "Deal! Actually, $6.97. Final offer.",
    },
  ];
  
  // Combine scripts: behind-the-scenes + negotiation
  const script: BotMessage[] = [
    ...getBehindTheScenesScript(),
    ...getNegotiationScript(),
  ];
  
  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      console.log('🤖 BattlingBotsModal opened!', { userStats });
      setStage('negotiation');
      setMessages([]);
      setCurrentMessageIndex(0);
      setCurrentText('');
      setIsTyping(false);
      setShowCursor(false);
      setSelectedOffer(null);
      setShowDeclineResponse(false);
      offerOpacity.value = 0;
    }
  }, [visible]);
  
  // Start typing when modal becomes visible
  useEffect(() => {
    console.log('🤖 Start typing check:', { visible, currentMessageIndex, isTyping });
    if (visible && currentMessageIndex === 0 && !isTyping) {
      console.log('🤖 Starting typing in 500ms...');
      setTimeout(() => {
        console.log('🤖 Setting isTyping=true and showCursor=true');
        setIsTyping(true);
        setShowCursor(true);
      }, 500);
    }
  }, [visible, currentMessageIndex, isTyping]);
  
  // Typing animation for current message
  useEffect(() => {
    console.log('🤖 Typing animation check:', { isTyping, currentMessageIndex, scriptLength: script.length });
    if (!isTyping || currentMessageIndex >= script.length) return;
    
    const message = script[currentMessageIndex];
    console.log('🤖 Current message:', { bot: message.bot, text: message.text, shouldBackspace: message.shouldBackspace });
    
    // Haptic feedback on typing start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Handle backspace scenario
    if (message.shouldBackspace && message.meanText && message.niceText) {
      let charIndex = 0;
      let isBackspacing = false;
      let backspaceIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (!isBackspacing) {
          // Type mean text with natural typing haptics
          if (charIndex < message.meanText!.length) {
            setCurrentText(message.meanText!.substring(0, charIndex + 1));
            
            // Natural typing haptics - varied intensity
            const char = message.meanText![charIndex];
            const isPunctuation = /[.,!?;:]/.test(char);
            const isSpace = char === ' ';
            
            if (!isSpace) {
              if (isPunctuation) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } else if (charIndex % 3 === 0) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }
            
            charIndex++;
          } else {
            // Pause before backspacing
            clearInterval(typeInterval);
            setTimeout(() => {
              isBackspacing = true;
              backspaceIndex = message.meanText!.length;
              
              // Stronger haptic when starting to backspace (panic!)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              
                // Backspace animation with natural haptics
                const backspaceInterval = setInterval(() => {
                  if (backspaceIndex > 0) {
                    setCurrentText(message.meanText!.substring(0, backspaceIndex - 1));
                    
                    // Haptics while backspacing (every 3rd for balance)
                    if (backspaceIndex % 3 === 0) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    
                    backspaceIndex--;
                } else {
                  // Start typing nice text
                  clearInterval(backspaceInterval);
                  let niceCharIndex = 0;
                  
                  // Light haptic when starting nice text
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  
                  const niceInterval = setInterval(() => {
                    if (niceCharIndex < message.niceText!.length) {
                      setCurrentText(message.niceText!.substring(0, niceCharIndex + 1));
                      
                      // Natural typing haptics for nice text
                      const char = message.niceText![niceCharIndex];
                      const isPunctuation = /[.,!?;:]/.test(char);
                      const isSpace = char === ' ';
                      
                      if (!isSpace) {
                        if (isPunctuation) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        } else if (niceCharIndex % 3 === 0) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }
                      
                      niceCharIndex++;
                    } else {
                      clearInterval(niceInterval);
                      // Message complete
                      setMessages(prev => [...prev, { bot: message.bot, text: message.niceText! }]);
                      setCurrentText('');
                      setIsTyping(false);
                      setShowCursor(false);
                      
                      // Check if this was the last message
                      if (currentMessageIndex === script.length - 1) {
                        // Transition to offer screen
                        setTimeout(() => {
                          setStage('offer');
                          setTimeRemaining(60);
                          offerOpacity.value = withSpring(1, {
                            damping: 20,
                            stiffness: 90,
                          });
                        }, 800);
                      } else {
                        // Move to next message after pause
                        setTimeout(() => {
                          setCurrentMessageIndex(prev => prev + 1);
                          setIsTyping(true);
                          setShowCursor(true);
                        }, 600);
                      }
                    }
                  }, 40);
                }
              }, 30); // Faster backspace
            }, 400); // Pause before backspacing
          }
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    } else {
      // Normal typing
      let charIndex = 0;
      const textToType = message.text || '';
      
      if (!textToType) {
        console.error('BattlingBotsModal: message.text is undefined');
        return;
      }
      
      const typeInterval = setInterval(() => {
        if (charIndex < textToType.length) {
          setCurrentText(textToType.substring(0, charIndex + 1));
          
          // Natural typing haptics - varied intensity
          const char = textToType[charIndex];
          const isPunctuation = /[.,!?;:]/.test(char);
          const isSpace = char === ' ';
          
          if (!isSpace) {
            if (isPunctuation) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else if (charIndex % 3 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }
          
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Message complete - safely use textToType which we know is not empty
          setMessages(prev => [...prev, { bot: message.bot, text: textToType }]);
          setCurrentText('');
          setIsTyping(false);
          setShowCursor(false);
          
          // Check if this was the last message
          if (currentMessageIndex === script.length - 1) {
            // Transition to offer screen
            setTimeout(() => {
              setStage('offer');
              setTimeRemaining(60); // Reset timer to 60 seconds
              offerOpacity.value = withSpring(1, {
                damping: 20,
                stiffness: 90,
              });
            }, 800);
          } else {
            // Move to next message after pause
            setTimeout(() => {
              setCurrentMessageIndex(prev => prev + 1);
              setIsTyping(true);
              setShowCursor(true);
            }, 600);
          }
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    }
  }, [isTyping, currentMessageIndex, script.length]);
  
  // Blinking cursor animation
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, [showCursor, isTyping]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, currentText]);
  
  // Countdown timer for offer stage
  useEffect(() => {
    if (stage !== 'offer' || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto decline
          clearInterval(timer);
          handleDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [stage, timeRemaining]);
  
  const handleAccept = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAccept(finalOffer.price);
  };
  
  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Show snarky response from bots
    setShowDeclineResponse(true);
    
    // Close modal after showing response
    setTimeout(() => {
      onDecline();
    }, 4000);
  };
  
  const offerStyle = useAnimatedStyle(() => ({
    opacity: offerOpacity.value,
  }));
  
  const getBotColor = (bot: 'left' | 'right') => {
    return bot === 'left' ? '#3B82F6' : '#EC4899'; // Blue vs Pink
  };
  
  const getBotName = (bot: 'left' | 'right') => {
    return bot === 'left' ? 'Dealbot' : 'Discountron';
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
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.4)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 30,
              elevation: 20,
            }}
          >
            <View>
              {stage === 'negotiation' ? (
                  // Negotiation Stage
                  <ScrollView 
                    ref={scrollViewRef}
                    style={{ maxHeight: 500 }}
                    contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Title */}
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <Ionicons name="flash" size={28} color="#F59E0B" />
                        <Text style={{
                          fontSize: 24,
                          fontWeight: '800',
                          color: '#1C1C1E',
                        }}>
                          Special Offer
                        </Text>
                        <Ionicons name="flash" size={28} color="#F59E0B" />
                      </View>
                    </View>

                    {/* Split screen with bots */}
                    <View style={{ 
                      flexDirection: 'row', 
                      minHeight: 320,
                      borderRadius: 16,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    }}>
                      {/* Left Bot */}
                      <View style={{ 
                        flex: 1, 
                        padding: 16,
                        borderRightWidth: 1,
                        borderRightColor: 'rgba(0, 0, 0, 0.1)',
                      }}>
                        {/* Bot Avatar */}
                        <View style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: `${getBotColor('left')}20`,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}>
                          <Ionicons name="hardware-chip" size={28} color={getBotColor('left')} />
                        </View>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: getBotColor('left'),
                          marginBottom: 12,
                        }}>
                          {getBotName('left')}
                        </Text>

                        {/* Messages */}
                        <View style={{ gap: 10 }}>
                          {messages
                            .filter(m => m.bot === 'left')
                            .map((msg, i) => (
                              <View key={i} style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                padding: 10,
                                borderRadius: 12,
                                borderLeftWidth: 3,
                                borderLeftColor: getBotColor('left'),
                              }}>
                                <Text style={{
                                  fontSize: 13,
                                  color: '#1C1C1E',
                                  fontWeight: '500',
                                }}>
                                  {msg.text}
                                </Text>
                              </View>
                            ))}
                          
                          {/* Current typing message */}
                          {isTyping && script[currentMessageIndex]?.bot === 'left' && (
                            <View style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              padding: 10,
                              borderRadius: 12,
                              borderLeftWidth: 3,
                              borderLeftColor: getBotColor('left'),
                            }}>
                              <Text style={{
                                fontSize: 13,
                                color: '#1C1C1E',
                                fontWeight: '500',
                              }}>
                                {currentText}
                                {showCursor && <Text style={{ color: getBotColor('left') }}>|</Text>}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Right Bot */}
                      <View style={{ 
                        flex: 1, 
                        padding: 16,
                      }}>
                        {/* Bot Avatar */}
                        <View style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: `${getBotColor('right')}20`,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}>
                          <Ionicons name="hardware-chip" size={28} color={getBotColor('right')} />
                        </View>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: getBotColor('right'),
                          marginBottom: 12,
                        }}>
                          {getBotName('right')}
                        </Text>

                        {/* Messages */}
                        <View style={{ gap: 10 }}>
                          {messages
                            .filter(m => m.bot === 'right')
                            .map((msg, i) => (
                              <View key={i} style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                padding: 10,
                                borderRadius: 12,
                                borderLeftWidth: 3,
                                borderLeftColor: getBotColor('right'),
                              }}>
                                <Text style={{
                                  fontSize: 13,
                                  color: '#1C1C1E',
                                  fontWeight: '500',
                                }}>
                                  {msg.text}
                                </Text>
                              </View>
                            ))}
                          
                          {/* Current typing message */}
                          {isTyping && script[currentMessageIndex]?.bot === 'right' && (
                            <View style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              padding: 10,
                              borderRadius: 12,
                              borderLeftWidth: 3,
                              borderLeftColor: getBotColor('right'),
                            }}>
                              <Text style={{
                                fontSize: 13,
                                color: '#1C1C1E',
                                fontWeight: '500',
                              }}>
                                {currentText}
                                {showCursor && <Text style={{ color: getBotColor('right') }}>|</Text>}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                ) : (
                  // Offer Stage - Single $4.97 Offer with Timer
                  <Animated.View style={[{ padding: 24 }, offerStyle]}>
                    {!showDeclineResponse ? (
                      <>
                        {/* Timer */}
                        <View style={{ alignItems: 'center', marginBottom: 16 }}>
                          <View style={{
                            backgroundColor: timeRemaining <= 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: timeRemaining <= 10 ? '#EF4444' : '#F97316',
                          }}>
                            <Text style={{
                              fontSize: 28,
                              fontWeight: '900',
                              color: timeRemaining <= 10 ? '#EF4444' : '#F97316',
                            }}>
                              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                            </Text>
                          </View>
                          <Text style={{
                            fontSize: 12,
                            color: '#8E8E93',
                            marginTop: 8,
                            fontWeight: '600',
                          }}>
                            Offer expires soon!
                          </Text>
                        </View>

                        {/* Title */}
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                          <Text style={{
                            fontSize: 26,
                            fontWeight: '800',
                            color: '#1C1C1E',
                            marginBottom: 4,
                          }}>
                            Final Offer
                          </Text>
                          <Text style={{
                            fontSize: 14,
                            color: '#8E8E93',
                            textAlign: 'center',
                          }}>
                            This is THE LAST DRAW 🎯
                          </Text>
                        </View>

                        {/* Single Big Offer Card */}
                        <Pressable
                          onPress={handleAccept}
                          style={({ pressed }) => ({
                            backgroundColor: pressed ? `${finalOffer.color}30` : `${finalOffer.color}20`,
                            borderRadius: 20,
                            padding: 32,
                            borderWidth: 3,
                            borderColor: finalOffer.color,
                            shadowColor: finalOffer.color,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 16,
                            elevation: 10,
                            marginBottom: 20,
                            alignItems: 'center',
                          })}
                        >
                          <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: finalOffer.color,
                            marginBottom: 12,
                          }}>
                            {finalOffer.label}
                          </Text>
                          <Text style={{
                            fontSize: 64,
                            fontWeight: '900',
                            color: finalOffer.color,
                            marginBottom: 8,
                          }}>
                            ${finalOffer.price}
                          </Text>
                          <Text style={{
                            fontSize: 14,
                            color: '#8E8E93',
                            fontWeight: '600',
                          }}>
                            one-time payment
                          </Text>
                        </Pressable>

                        {/* Feature List */}
                        <View style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: 16,
                          padding: 16,
                          marginBottom: 20,
                          gap: 10,
                        }}>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#3C3C43',
                            marginBottom: 4,
                          }}>
                            ✨ What you get:
                          </Text>
                          {[
                            'Perfect for measuring wires and cables',
                            'Ideal for maps, borders, and coastlines',
                            'Measure irregular shapes nothing else can',
                            'Works great as a "digital measuring string"',
                          ].map((feature, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                              <Text style={{ fontSize: 13, color: '#3C3C43', fontWeight: '500', flex: 1 }}>
                                {feature}
                              </Text>
                            </View>
                          ))}
                        </View>

                        {/* Decline Button */}
                        <Pressable
                          onPress={handleDecline}
                          style={({ pressed }) => ({
                            backgroundColor: pressed ? 'rgba(120,120,128,0.08)' : 'transparent',
                            paddingVertical: 14,
                            borderRadius: 12,
                          })}
                        >
                          <Text style={{
                            color: '#8E8E93',
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'center',
                          }}>
                            No thanks
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      // Decline Response
                      <View style={{ alignItems: 'center', padding: 24 }}>
                        <Ionicons name="chatbubbles" size={48} color="#8E8E93" style={{ marginBottom: 16 }} />
                        <Text style={{
                          fontSize: 16,
                          color: '#3C3C43',
                          textAlign: 'center',
                          lineHeight: 24,
                          fontStyle: 'italic',
                        }}>
                          "It's okay, they can always buy it at full price later. No worries."
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: '#8E8E93',
                          marginTop: 12,
                          fontWeight: '600',
                        }}>
                          - {getBotName('right')}
                        </Text>
                      </View>
                     )}
                  </Animated.View>
                )}
              </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
  
