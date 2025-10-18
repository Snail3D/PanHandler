import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface BattlingBotsModalProps {
  visible: boolean;
  onClose: () => void;
}

type BotMessage = {
  bot: 'left' | 'right';
  text?: string;
  shouldBackspace?: boolean;
  meanText?: string;
  niceText?: string;
};

export default function BattlingBotsModal({ 
  visible, 
  onClose,
}: BattlingBotsModalProps) {
  const [stage, setStage] = useState<'negotiation' | 'offer'>('negotiation');
  const [messages, setMessages] = useState<Array<{ bot: 'left' | 'right', text: string }>>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const offerOpacity = useSharedValue(0);
  
  // 10 random conversation variations with Easter egg hints
  const conversations: BotMessage[][] = [
    // Conversation 1: "Can They See Us?" with Left Egg hint
    [
      { bot: 'left', text: "They've used the app 10 times now..." },
      { bot: 'right', text: "Perfect timing! Should we tell them about Snail?" },
      { bot: 'left', text: "Wait... can they SEE this conversation??" },
      { bot: 'right', shouldBackspace: true, meanText: "Of course not, they can't—", niceText: "...anyway, try holding the left egg in the Help menu! 🥚" },
      { bot: 'left', text: "Did you just give away a secret?!" },
      { bot: 'right', text: "Oops. Well, they deserve it!" },
    ],
    
    // Conversation 2: "Rhythm Hint"
    [
      { bot: 'left', text: "Is it too soon to ask for support?" },
      { bot: 'right', text: "They've made 10 measurements. They love this app!" },
      { bot: 'left', text: "But asking for money feels weird..." },
      { bot: 'right', text: "It's not asking! It's 'Hey, help Snail keep this alive!'" },
      { bot: 'left', shouldBackspace: true, meanText: "I guess you're ri—", niceText: "...btw, tap the right egg to a rhythm 🎵" },
      { bot: 'right', text: "Why did you tell them that?!" },
    ],
    
    // Conversation 3: "Shake Hint"
    [
      { bot: 'left', text: "Snail's been paying for this out of pocket..." },
      { bot: 'right', text: "Yeah, servers aren't free. Neither is his time." },
      { bot: 'left', text: "Should we mention the donation link?" },
      { bot: 'right', text: "Definitely. Oh! And they can shake their phone to toggle the menu!" },
      { bot: 'left', text: "That's... not related to donations." },
      { bot: 'right', text: "I know. But it's cool! 🤷" },
    ],
    
    // Conversation 4: "Passion Project"
    [
      { bot: 'left', text: "This is awkward. Should we really beg?" },
      { bot: 'right', text: "We're not begging! We're PanHandling!" },
      { bot: 'left', text: "That's... literally the same thing." },
      { bot: 'right', text: "No no, it's a pun! The app is called PanHandler!" },
      { bot: 'left', text: "...I hate you." },
      { bot: 'right', text: "Anyway, Snail built this as a passion project. Zero ads!" },
    ],
    
    // Conversation 5: "YouTube Hint"
    [
      { bot: 'left', text: "They seem to really like the app..." },
      { bot: 'right', text: "10 sessions! That's dedication!" },
      { bot: 'left', text: "Maybe they'd support Snail?" },
      { bot: 'right', text: "For sure! Also, check out @realsnail3d on YouTube!" },
      { bot: 'left', shouldBackspace: true, meanText: "Wait, are we advertising now?!", niceText: "...there are TWO hidden eggs by the way 🥚🥚" },
      { bot: 'right', text: "You can't help yourself, can you?" },
    ],
    
    // Conversation 6: "No Subscription"
    [
      { bot: 'left', text: "Other apps charge $10/month..." },
      { bot: 'right', text: "Or $50/year with 'Pro' features locked." },
      { bot: 'left', text: "Snail made everything free. No paywall." },
      { bot: 'right', text: "Exactly! Just optional support if you want to help." },
      { bot: 'left', text: "That's... actually really generous." },
      { bot: 'right', text: "Right? So maybe they'll buy him a coffee! ☕" },
    ],
    
    // Conversation 7: "Chicken Haptics Hint"
    [
      { bot: 'left', text: "Should we tell them about the donation link?" },
      { bot: 'right', text: "Yeah! Snail needs support to keep this running." },
      { bot: 'left', text: "No ads, no subscriptions, just vibes." },
      { bot: 'right', text: "Pure vibes! Oh, and chicken haptics in the Help menu 🐔" },
      { bot: 'left', text: "...what?" },
      { bot: 'right', text: "Hold the left egg for 3 seconds. You'll see!" },
    ],
    
    // Conversation 8: "Behind the Scenes"
    [
      { bot: 'left', text: "They can definitely see us, right?" },
      { bot: 'right', text: "No way. This is behind-the-scenes." },
      { bot: 'left', shouldBackspace: true, meanText: "Good, because I was gonna say—", niceText: "...never mind. Let's just ask nicely." },
      { bot: 'right', text: "Ask for support, you mean?" },
      { bot: 'left', text: "Yeah. Snail's doing this solo. Zero team." },
      { bot: 'right', text: "One guy. One dream. One coin-based measurement app!" },
    ],
    
    // Conversation 9: "Easter Egg Master Hint"
    [
      { bot: 'left', text: "10 sessions. Should we pitch the donation?" },
      { bot: 'right', text: "Absolutely! And mention the Easter eggs!" },
      { bot: 'left', text: "There are THREE hidden surprises..." },
      { bot: 'right', text: "Left egg, right egg, and a shake gesture!" },
      { bot: 'left', text: "Dude, you're spoiling everything!" },
      { bot: 'right', shouldBackspace: true, meanText: "Oops sorry—", niceText: "...but seriously, support Snail! ☕" },
    ],
    
    // Conversation 10: "The Real Talk"
    [
      { bot: 'left', text: "Alright, real talk..." },
      { bot: 'right', text: "Real talk." },
      { bot: 'left', text: "Snail made this app. Alone. With his own money." },
      { bot: 'right', text: "No investors. No corporate backing. Just passion." },
      { bot: 'left', text: "And you've used it 10 times now." },
      { bot: 'right', text: "So if it's helped you... maybe help him back?" },
    ],
  ];
  
  // Pick random conversation
  const [script, setScript] = useState<BotMessage[]>([]);
  
  // Pick random conversation on mount
  useEffect(() => {
    if (visible) {
      const randomIndex = Math.floor(Math.random() * conversations.length);
      setScript(conversations[randomIndex]);
      console.log(`🤖 BattlingBots: Showing conversation #${randomIndex + 1}`);
      
      // Reset state
      setStage('negotiation');
      setMessages([]);
      setCurrentMessageIndex(0);
      setCurrentText('');
      setIsTyping(false);
      setShowCursor(false);
      offerOpacity.value = 0;
    }
  }, [visible]);
  
  // Start typing when modal becomes visible
  useEffect(() => {
    if (visible && script.length > 0 && currentMessageIndex === 0 && !isTyping) {
      setTimeout(() => {
        setIsTyping(true);
        setShowCursor(true);
      }, 500);
    }
  }, [visible, script, currentMessageIndex, isTyping]);
  
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
          // Type mean text
          if (charIndex < message.meanText!.length) {
            setCurrentText(message.meanText!.substring(0, charIndex + 1));
            
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
              
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              
              // Backspace animation
              const backspaceInterval = setInterval(() => {
                if (backspaceIndex > 0) {
                  setCurrentText(message.meanText!.substring(0, backspaceIndex - 1));
                  
                  if (backspaceIndex % 3 === 0) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  
                  backspaceIndex--;
                } else {
                  // Start typing nice text
                  clearInterval(backspaceInterval);
                  let niceCharIndex = 0;
                  
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  
                  const niceInterval = setInterval(() => {
                    if (niceCharIndex < message.niceText!.length) {
                      setCurrentText(message.niceText!.substring(0, niceCharIndex + 1));
                      
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
                      
                      // Check if last message
                      if (currentMessageIndex === script.length - 1) {
                        setTimeout(() => {
                          setStage('offer');
                          offerOpacity.value = withSpring(1, { damping: 20, stiffness: 90 });
                        }, 800);
                      } else {
                        setTimeout(() => {
                          setCurrentMessageIndex(prev => prev + 1);
                          setIsTyping(true);
                          setShowCursor(true);
                        }, 600);
                      }
                    }
                  }, 40);
                }
              }, 30);
            }, 400);
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
          setMessages(prev => [...prev, { bot: message.bot, text: textToType }]);
          setCurrentText('');
          setIsTyping(false);
          setShowCursor(false);
          
          // Check if last message
          if (currentMessageIndex === script.length - 1) {
            setTimeout(() => {
              setStage('offer');
              offerOpacity.value = withSpring(1, { damping: 20, stiffness: 90 });
            }, 800);
          } else {
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
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, currentText]);
  
  const handleSupport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL("https://buymeacoffee.com/snail3d");
    onClose();
  };
  
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };
  
  const offerStyle = useAnimatedStyle(() => ({
    opacity: offerOpacity.value,
  }));
  
  const getBotColor = (bot: 'left' | 'right') => {
    return bot === 'left' ? '#F59E0B' : '#3B82F6'; // Amber vs Blue
  };
  
  const getBotName = (bot: 'left' | 'right') => {
    return bot === 'left' ? 'Beggar Bot' : 'Panhandler Bot';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
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
                      <Ionicons name="chatbubbles" size={28} color="#3B82F6" />
                      <Text style={{
                        fontSize: 24,
                        fontWeight: '800',
                        color: '#1C1C1E',
                      }}>
                        Behind the Scenes
                      </Text>
                      <Ionicons name="chatbubbles" size={28} color="#F59E0B" />
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
                    {/* Left Bot - Beggar Bot */}
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
                        <Ionicons name="hand-left" size={28} color={getBotColor('left')} />
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

                    {/* Right Bot - Panhandler Bot */}
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
                        <Ionicons name="hand-right" size={28} color={getBotColor('right')} />
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
                // Offer Stage
                <Animated.View style={[{ padding: 24 }, offerStyle]}>
                  {/* Title */}
                  <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 26,
                      fontWeight: '800',
                      color: '#1C1C1E',
                      marginBottom: 8,
                    }}>
                      Support Snail
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#8E8E93',
                      textAlign: 'center',
                      lineHeight: 20,
                    }}>
                      PanHandler is a passion project.{'\n'}
                      Help keep it alive! ☕
                    </Text>
                  </View>

                  {/* Feature List */}
                  <View style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                      💝 What you get:
                    </Text>
                    {[
                      'No ads, ever',
                      'No subscription fees',
                      'All features unlocked',
                      'Made by @realsnail3d',
                      'Support keeps servers running!',
                    ].map((feature, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                        <Text style={{ fontSize: 13, color: '#3C3C43', fontWeight: '500', flex: 1 }}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Support Button */}
                  <Pressable
                    onPress={handleSupport}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#2563EB' : '#3B82F6',
                      borderRadius: 16,
                      padding: 18,
                      marginBottom: 12,
                      alignItems: 'center',
                      shadowColor: '#3B82F6',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="cafe" size={20} color="white" />
                      <Text style={{
                        color: 'white',
                        fontSize: 17,
                        fontWeight: '700',
                      }}>
                        Buy Me a Coffee
                      </Text>
                    </View>
                  </Pressable>

                  {/* Close Button */}
                  <Pressable
                    onPress={handleClose}
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
                      Maybe later
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
