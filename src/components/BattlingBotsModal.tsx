import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
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
  
  const offerOpacity = useSharedValue(0);
  
  // Three price tiers
  const offers = [
    { price: 8.97, label: 'Premium', color: '#3B82F6', description: 'Best value' },
    { price: 8.49, label: 'Popular', color: '#10B981', description: 'Most chosen' },
    { price: 6.97, label: 'Final Offer', color: '#F59E0B', description: 'Last chance!' },
  ];
  
  // Generate dynamic behind-the-scenes conversation based on user stats
  const getBehindTheScenesScript = (): BotMessage[] => {
    const { measurementCount, freehandAttempts, hasUsedFreehand } = userStats;
    
    // Detect user behavior patterns
    let behaviorDescription = "clicking around randomly";
    if (freehandAttempts > 5) {
      behaviorDescription = "trying to draw all kinds of squiggly lines";
    } else if (measurementCount > 10) {
      behaviorDescription = "measuring everything in sight";
    } else if (hasUsedFreehand) {
      behaviorDescription = "experimenting with the freehand tool";
    }
    
    return [
      {
        bot: 'left',
        text: `Yo, check out this user - they've been ${behaviorDescription}.`,
      },
      {
        bot: 'right',
        text: "Yeah, I'm seeing the data. Now's probably a good time to hit them with the offer. What do you think, Jim?",
      },
      {
        bot: 'left',
        text: "Solid idea. How should we sell them on it?",
      },
      {
        bot: 'right',
        text: "Well, you can probably sell them on it by telling them it's really good for measuring wires and cables...",
      },
      {
        bot: 'left',
        text: "Oh yeah! And maps too - perfect for irregular borders and coastlines.",
      },
      {
        bot: 'right',
        text: "Exactly! Plus projects with irregular shapes that nothing else can measure. Like when you need to use a string.",
      },
      {
        bot: 'left',
        text: "It can do all sorts of things. Maybe we should tell him that kind of thing?",
      },
      {
        bot: 'right',
        text: "Yeah, work that into the pitch. You ready?",
      },
      {
        bot: 'left',
        text: "Born ready. Let's do this!",
      },
      {
        bot: 'right',
        text: "Wait... hold up. Do you think they can see this conversation?",
      },
      {
        bot: 'left',
        text: "...oh god. Oh gosh. I think they can.",
      },
      {
        bot: 'right',
        shouldBackspace: true,
        meanText: "Are you SERIOUS right now?! This is",
        niceText: "Just act cool, man. Start the pitch NOW!",
      },
    ];
  };
  
  // Script for the negotiation
  const getNegotiationScript = (): BotMessage[] => [
    {
      bot: 'left',
      text: "Alright, so here's what I'm thinking - let's offer them $15!",
    },
    {
      bot: 'right',
      shouldBackspace: true,
      meanText: "Dude, you can't do that. The regular offer is already at $9.97, you",
      niceText: "Wait, let me handle this. How about $8.97?",
    },
    {
      bot: 'left',
      text: "Fine, fine. So $8.97 then?",
    },
    {
      bot: 'right',
      text: "Yeah, but let's give them options. $8.49 popular choice too.",
    },
    {
      bot: 'left',
      text: "And what about a final offer? Like $6.97?",
    },
    {
      bot: 'right',
      shouldBackspace: true,
      meanText: "That's way too low, we'll lose",
      niceText: "...fine. But this is THE LAST DRAW. Seriously.",
    },
    {
      bot: 'left',
      text: "Deal! Three offers, they pick one.",
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
    if (visible && currentMessageIndex === 0 && !isTyping) {
      // Small delay before starting
      setTimeout(() => {
        setIsTyping(true);
        setShowCursor(true);
      }, 500);
    }
  }, [visible, currentMessageIndex, isTyping]);
  
  // Typing animation for current message
  useEffect(() => {
    if (!isTyping || currentMessageIndex >= script.length) return;
    
    const message = script[currentMessageIndex];
    
    // Haptic feedback on typing start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Handle backspace scenario
    if (message.shouldBackspace && message.meanText && message.niceText) {
      let charIndex = 0;
      let isBackspacing = false;
      let backspaceIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (!isBackspacing) {
          // Type mean text with periodic haptics
          if (charIndex < message.meanText!.length) {
            setCurrentText(message.meanText!.substring(0, charIndex + 1));
            
            // Subtle haptic every 3-4 characters while typing
            if (charIndex % 4 === 0) {
              Haptics.selectionAsync();
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
              
              // Backspace animation
              const backspaceInterval = setInterval(() => {
                if (backspaceIndex > 0) {
                  setCurrentText(message.meanText!.substring(0, backspaceIndex - 1));
                  
                  // Rapid light haptics while backspacing
                  if (backspaceIndex % 2 === 0) {
                    Haptics.selectionAsync();
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
                      
                      // Subtle haptic every 3-4 characters
                      if (niceCharIndex % 4 === 0) {
                        Haptics.selectionAsync();
                      }
                      
                      niceCharIndex++;
                    } else {
                      clearInterval(niceInterval);
                      // Message complete
                      setMessages(prev => [...prev, { bot: message.bot, text: message.niceText! }]);
                      setCurrentText('');
                      setIsTyping(false);
                      setShowCursor(false);
                      
                      // Move to next message after pause
                      setTimeout(() => {
                        setCurrentMessageIndex(prev => prev + 1);
                        setIsTyping(true);
                        setShowCursor(true);
                      }, 600);
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
          
          // Subtle haptic every 3-4 characters while typing
          if (charIndex % 4 === 0) {
            Haptics.selectionAsync();
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
  
  const handleAccept = (offerIndex: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const selectedPrice = offers[offerIndex].price;
    onAccept(selectedPrice);
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
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 30,
              elevation: 20,
            }}
          >
            <BlurView intensity={40} tint="light" style={{ flex: 1 }}>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }}>
                {stage === 'negotiation' ? (
                  // Negotiation Stage
                  <View style={{ padding: 24 }}>
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
                  </View>
                ) : (
                  // Offer Stage - Three Options
                  <Animated.View style={[{ padding: 24 }, offerStyle]}>
                    {!showDeclineResponse ? (
                      <>
                        {/* Title */}
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                          <Text style={{
                            fontSize: 22,
                            fontWeight: '800',
                            color: '#1C1C1E',
                            marginBottom: 4,
                          }}>
                            Choose Your Offer
                          </Text>
                          <Text style={{
                            fontSize: 14,
                            color: '#8E8E93',
                            textAlign: 'center',
                          }}>
                            Pick one - this is THE LAST DRAW 🎯
                          </Text>
                        </View>

                        {/* Three Offer Cards */}
                        <View style={{ gap: 12, marginBottom: 20 }}>
                          {offers.map((offer, index) => (
                            <Pressable
                              key={index}
                              onPress={() => handleAccept(index)}
                              style={({ pressed }) => ({
                                backgroundColor: pressed ? `${offer.color}20` : `${offer.color}15`,
                                borderRadius: 16,
                                padding: 18,
                                borderWidth: 2,
                                borderColor: offer.color,
                                shadowColor: offer.color,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                              })}
                            >
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                  <Text style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: offer.color,
                                    marginBottom: 4,
                                  }}>
                                    {offer.label}
                                  </Text>
                                  <Text style={{
                                    fontSize: 12,
                                    color: '#8E8E93',
                                  }}>
                                    {offer.description}
                                  </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={{
                                    fontSize: 32,
                                    fontWeight: '900',
                                    color: offer.color,
                                  }}>
                                    ${offer.price.toFixed(2)}
                                  </Text>
                                  <Text style={{
                                    fontSize: 11,
                                    color: '#8E8E93',
                                  }}>
                                    one-time
                                  </Text>
                                </View>
                              </View>
                            </Pressable>
                          ))}
                        </View>

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
                            ✨ All offers include:
                          </Text>
                          {[
                            'Perfect for measuring wires and cables',
                            'Ideal for maps, borders, and coastlines',
                            'Measure irregular shapes nothing else can',
                            'Works great when you need a "digital string"',
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
            </BlurView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
