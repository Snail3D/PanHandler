import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import useStore from '../state/measurementStore';

interface BattlingBotsModalProps {
  visible: boolean;
  onClose: () => void;
  isDonor?: boolean; // Pass donor status to show different conversations
  isFirstTimeDonor?: boolean; // Show special first-time donor conversation
  conversationIndex?: number; // Force specific conversation (for testing)
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
  isDonor = false,
  isFirstTimeDonor = false,
  conversationIndex,
}: BattlingBotsModalProps) {
  // Access store for donation tracking
  const setIsDonor = useStore((s) => s.setIsDonor);
  const setIsFirstTimeDonor = useStore((s) => s.setIsFirstTimeDonor);
  const sessionCount = useStore((s) => s.sessionCount);
  
  const [stage, setStage] = useState<'negotiation' | 'offer'>('negotiation');
  const [messages, setMessages] = useState<Array<{ bot: 'left' | 'right', text: string }>>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const offerOpacity = useSharedValue(0);
  
  // Skip animation - show full conversation immediately
  const skipToEnd = () => {
    const allMessages = script.map(msg => ({
      bot: msg.bot,
      text: msg.niceText || msg.text || ''
    }));
    setMessages(allMessages);
    setCurrentText('');
    setIsTyping(false);
    setShowCursor(false);
    setCurrentMessageIndex(script.length);
    setStage('offer');
    offerOpacity.value = withSpring(1, { damping: 20, stiffness: 90 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // 11 random conversation variations with Easter egg hints
  const conversations: BotMessage[][] = [
    // Conversation 0: DONATION FATIGUE (NEW!)
    [
      { bot: 'left', text: "I know... everyone begs these days." },
      { bot: 'right', text: "Yeah. It's exhausting." },
      { bot: 'left', text: "But this guy actually built something." },
      { bot: 'right', text: "Months of work. No ads. No paywall." },
      { bot: 'left', shouldBackspace: true, meanText: "So mayb—", niceText: "...if ANY app deserves it, it's this one." },
      { bot: 'right', text: "Can't argue with that." },
    ],
    
    // Conversation 1: Left Egg = YouTube Chicken
    [
      { bot: 'left', text: "They've been using the app a lot..." },
      { bot: 'right', text: "Yeah! Should we ask for support?" },
      { bot: 'left', text: "Wait... can they SEE us??" },
      { bot: 'right', shouldBackspace: true, meanText: "No way, this is priv—", niceText: "...hold the left egg 3 seconds! Chicken surprise! 🐔" },
      { bot: 'left', text: "Did you just spoil the secret?!" },
      { bot: 'right', text: "They deserve it! They're awesome!" },
    ],
    
    // Conversation 2: Right Egg = Shave and a Haircut
    [
      { bot: 'left', text: "Is it weird to ask for help?" },
      { bot: 'right', text: "Nah! Snail built this solo!" },
      { bot: 'left', text: "True. Zero ads, zero subscription..." },
      { bot: 'right', shouldBackspace: true, meanText: "Exactly! So mayb—", niceText: "...tap right egg: Shave-and-a-haircut! 🎵" },
      { bot: 'left', text: "That's... oddly specific." },
      { bot: 'right', text: "It's CLASSIC! Try it!" },
    ],
    
    // Conversation 3: Shake to Toggle Menu
    [
      { bot: 'left', text: "Snail spent MONTHS building this..." },
      { bot: 'right', text: "Yeah. Hundreds of hours." },
      { bot: 'left', text: "All his free time, really." },
      { bot: 'right', text: "And he made it free! Oh—shake to toggle the menu!" },
      { bot: 'left', text: "Why did you add that last part?!" },
      { bot: 'right', text: "Because it's useful! 🤷" },
    ],
    
    // Conversation 4: Imperial Button = Star Wars
    [
      { bot: 'left', text: "This feels awkward..." },
      { bot: 'right', text: "Why? We're just PanHandling!" },
      { bot: 'left', text: "That's... literally begging." },
      { bot: 'right', text: "It's a PUN! Get it? PanHandler?" },
      { bot: 'left', text: "I hate you." },
      { bot: 'right', shouldBackspace: true, meanText: "Whatever! Sna—", niceText: "...tap Imperial 7x for Star Wars! ⭐" },
    ],
    
    // Conversation 5: Tetris Easter Egg
    [
      { bot: 'left', text: "They really like this app..." },
      { bot: 'right', text: "Of course! It's actually useful!" },
      { bot: 'left', text: "Maybe they'll support Snail?" },
      { bot: 'right', shouldBackspace: true, meanText: "Hope so! Also check—", niceText: "...fill the screen with measurements! Tetris! 🎮" },
      { bot: 'left', text: "Are you just spoiling everything?!" },
      { bot: 'right', text: "They'll love it!" },
    ],
    
    // Conversation 6: No Paywall Pride
    [
      { bot: 'left', text: "Other apps charge $50/year..." },
      { bot: 'right', text: "Or $10/month for basic features." },
      { bot: 'left', text: "Snail made everything free!" },
      { bot: 'right', text: "No paywall. No nagging. Just vibes." },
      { bot: 'left', text: "That's... actually really cool." },
      { bot: 'right', text: "Right? So maybe buy him a coffee? ☕" },
    ],
    
    // Conversation 7: All Secrets Revealed
    [
      { bot: 'left', text: "Should we pitch the donation?" },
      { bot: 'right', text: "Yeah! But casually." },
      { bot: 'left', text: "There are like... FIVE secrets..." },
      { bot: 'right', text: "Left egg, right egg, shake, Imperial, Tetris!" },
      { bot: 'left', text: "DUDE! You're spoiling EVERYTHING!" },
      { bot: 'right', shouldBackspace: true, meanText: "Sorry, I jus—", niceText: "...but seriously, support Snail! 💙" },
    ],
    
    // Conversation 8: Donation Reality Check
    [
      { bot: 'left', text: "Everyone asks for donations these days..." },
      { bot: 'right', text: "I know, it's exhausting." },
      { bot: 'left', text: "But some people actually need it." },
      { bot: 'right', text: "Yeah. Like solo devs who work for free." },
      { bot: 'left', text: "Snail spent months on this. Zero income." },
      { bot: 'right', shouldBackspace: true, meanText: "So mayb—", niceText: "...shake your phone to hide the menu! 📳" },
    ],
    
    // Conversation 9: Imperial March Easter Egg
    [
      { bot: 'left', text: "They've used it a bunch..." },
      { bot: 'right', text: "Yeah! Time to ask for support!" },
      { bot: 'left', text: "No ads. No subscriptions. Just vibes." },
      { bot: 'right', shouldBackspace: true, meanText: "Pure vibes! Als—", niceText: "...tap Imperial button 7x fast! Star Wars! ⭐" },
      { bot: 'left', text: "The Imperial March?!" },
      { bot: 'right', text: "DUN DUN DUN! Trust me!" },
    ],
    
    // Conversation 10: Worth It
    [
      { bot: 'left', text: "Alright, real talk..." },
      { bot: 'right', text: "Real talk." },
      { bot: 'left', text: "I know everyone begs for donations now." },
      { bot: 'right', text: "But this guy actually built something useful." },
      { bot: 'left', text: "Months of work. Zero ads. Zero paywall." },
      { bot: 'right', text: "If any app deserves support... it's this one." },
    ],
  ];
  
  // Donor-specific conversations (for returning donors at 40-session intervals)
  const donorConversations: BotMessage[][] = [
    // Donor Conversation 1: Badge + Tetris Hint
    [
      { bot: 'left', text: "Hey! They have the badge!" },
      { bot: 'right', text: "Official Supporter! ❤️" },
      { bot: 'left', text: "They already helped once..." },
      { bot: 'right', text: "Yeah, but it's been 40 sessions!" },
      { bot: 'left', text: "Snail's still working on updates..." },
      { bot: 'right', shouldBackspace: true, meanText: "Gentle as—", niceText: "...fill screen with measurements! Tetris! 🎮" },
    ],
    
    // Donor Conversation 2: Coffee + Left Egg
    [
      { bot: 'left', text: "It's been a while..." },
      { bot: 'right', text: "40 sessions! They love this app!" },
      { bot: 'left', text: "Should we ask for another coffee?" },
      { bot: 'right', shouldBackspace: true, meanText: "They've been using—", niceText: "...hold left egg 3 seconds! Chicken! 🐔" },
      { bot: 'left', text: "Wait, we're giving hints now?" },
      { bot: 'right', text: "They're supporters! They deserve secrets!" },
    ],
    
    // Donor Conversation 3: Badge + Right Egg
    [
      { bot: 'left', text: "See that badge?" },
      { bot: 'right', text: "Official Supporter. So cool!" },
      { bot: 'left', text: "They actually helped. Unlike most people." },
      { bot: 'right', text: "Most people ghost us completely." },
      { bot: 'left', text: "Not them. They're real ones." },
      { bot: 'right', shouldBackspace: true, meanText: "That's why we wait—", niceText: "...right egg: Shave-and-a-haircut! 🎵" },
    ],
    
    // Donor Conversation 4: First-Time + Imperial
    [
      { bot: 'left', text: "WAIT. Did they just... donate?!" },
      { bot: 'right', text: "THEY DID! Look at that badge!" },
      { bot: 'left', text: "Official Supporter! ❤️" },
      { bot: 'right', text: "They're in the Snail Squad now!" },
      { bot: 'left', text: "That's... beautiful 🥹" },
      { bot: 'right', shouldBackspace: true, meanText: "We won't bug them for 40—", niceText: "...tap Imperial 7x for Star Wars! ⭐" },
    ],
    
    // Donor Conversation 5: Grateful + Shake
    [
      { bot: 'left', text: "They're back! Badge and all!" },
      { bot: 'right', text: "They supported Snail before." },
      { bot: 'left', text: "Should we even ask again?" },
      { bot: 'right', text: "It's been 40 sessions... months!" },
      { bot: 'left', text: "True. Time keeps going." },
      { bot: 'right', shouldBackspace: true, meanText: "Gentle ask th—", niceText: "...shake to toggle the menu! 📳" },
    ],
  ];
  
  // Pick random conversation
  const [script, setScript] = useState<BotMessage[]>([]);
  
  // Pick conversation on mount or when conversationIndex changes
  useEffect(() => {
    console.log('🤖 BattlingBots useEffect triggered:', { visible, conversationIndex, isDonor, isFirstTimeDonor });
    if (visible) {
      // If conversationIndex provided (testing mode), use it directly
      if (conversationIndex !== undefined) {
        const convos = isDonor ? donorConversations : conversations;
        const index = conversationIndex % convos.length; // Wrap around
        setScript(convos[index]);
        console.log(`🎯 BattlingBots: Showing ${isDonor ? 'DONOR' : 'NON-DONOR'} conversation #${index + 1} (TEST MODE)`);
      }
      // If first-time donor, always show celebration conversation (donor conversation #4)
      else if (isFirstTimeDonor) {
        setScript(donorConversations[3]); // "First-Time Donor Celebration"
        console.log('🎉 BattlingBots: Showing FIRST-TIME DONOR celebration!');
      }
      // If returning donor, pick random donor conversation
      else if (isDonor) {
        const randomIndex = Math.floor(Math.random() * donorConversations.length);
        setScript(donorConversations[randomIndex]);
        console.log(`🤖 BattlingBots: Showing DONOR conversation #${randomIndex + 1}`);
      }
      // Non-donor: pick random regular conversation
      else {
        const randomIndex = Math.floor(Math.random() * conversations.length);
        setScript(conversations[randomIndex]);
        console.log(`🤖 BattlingBots: Showing NON-DONOR conversation #${randomIndex + 1}`);
      }
      
      // Reset state
      setStage('negotiation');
      setMessages([]);
      setCurrentMessageIndex(0);
      setCurrentText('');
      setIsTyping(false);
      setShowCursor(false);
      offerOpacity.value = 0;
    }
  }, [visible, isDonor, isFirstTimeDonor, conversationIndex]);
  
  // Start typing when modal becomes visible - IMMEDIATE for testing!
  useEffect(() => {
    if (visible && script.length > 0 && currentMessageIndex === 0 && !isTyping) {
      // Immediate start (no delay for testing)
      setIsTyping(true);
      setShowCursor(true);
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
                        }, 400); // FASTER for testing (was 800ms)
                      } else {
                        setTimeout(() => {
                          setCurrentMessageIndex(prev => prev + 1);
                          setIsTyping(true);
                          setShowCursor(true);
                        }, 300); // FASTER for testing (was 600ms)
                      }
                    }
                   }, 20); // FASTER for testing (was 40ms)
                }
               }, 15); // FASTER backspace for testing (was 30ms)
             }, 200); // FASTER pause for testing (was 400ms)
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
    
    // Mark user as donor and track session
    setIsDonor(true, sessionCount);
    
    // Open Buy Me a Coffee link
    Linking.openURL("https://buymeacoffee.com/Snail3D");
    
    // Show success message with badge
    console.log('🎉 User clicked Support! isDonor = true, badge will show!');
    
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
      presentationStyle="overFullScreen"
      statusBarTranslucent
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
                    {/* Skip Animation Button (Testing) */}
                    {conversationIndex !== undefined && (
                      <Pressable
                        onPress={skipToEnd}
                        style={({ pressed }) => ({
                          marginTop: 12,
                          backgroundColor: pressed ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: 'rgba(139, 92, 246, 0.3)',
                        })}
                      >
                        <Text style={{ color: '#8B5CF6', fontSize: 13, fontWeight: '600' }}>
                          ⚡ Skip Animation
                        </Text>
                      </Pressable>
                    )}
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
                <Animated.View style={[{ padding: 28 }, offerStyle]}>
                  {/* Title */}
                  <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <Text style={{
                      fontSize: 32,
                      fontWeight: '800',
                      color: '#1C1C1E',
                      marginBottom: 6,
                    }}>
                      Support Snail
                    </Text>
                    <Text style={{
                      fontSize: 15,
                      color: '#8E8E93',
                      textAlign: 'center',
                      lineHeight: 22,
                      fontWeight: '500',
                    }}>
                      PanHandler is a passion project.{'\n'}
                      Help keep it alive! ☕
                    </Text>
                  </View>

                  {/* Feature List */}
                  <View style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    borderRadius: 16,
                    padding: 18,
                    marginBottom: 24,
                    gap: 12,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: '#1C1C1E',
                      }}>
                        💝 What you get:
                      </Text>
                    </View>
                    {[
                      'No ads, ever',
                      'No subscription fees',
                      'All features unlocked',
                      'Made by @realsnail3d',
                      'Hundreds of hours of work!',
                    ].map((feature, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <Text style={{ fontSize: 14, color: '#3C3C43', fontWeight: '600', flex: 1 }}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Support Button - PROMINENT */}
                  <Pressable
                    onPress={handleSupport}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#059669' : '#10B981',
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 24, // Increased from 16 for more space
                      alignItems: 'center',
                      justifyContent: 'center', // Center content
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 8,
                      borderWidth: 2,
                      borderColor: '#34D399',
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <Ionicons name="cafe" size={24} color="rgba(0, 0, 0, 0.75)" />
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.85)',
                        fontSize: 19,
                        fontWeight: '800',
                        letterSpacing: 0.3,
                      }}>
                        Buy Me a Coffee
                      </Text>
                    </View>
                  </Pressable>

                  {/* Close Button */}
                  <Pressable
                    onPress={handleClose}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? 'rgba(120,120,128,0.16)' : 'rgba(120,120,128,0.08)',
                      paddingVertical: 16,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: 'rgba(120,120,128,0.2)',
                    })}
                  >
                    <Text style={{
                      color: '#6B7280',
                      fontSize: 17,
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
