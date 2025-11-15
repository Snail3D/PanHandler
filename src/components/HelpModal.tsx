import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Modal, ScrollView, Pressable, Linking, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as MailComposer from 'expo-mail-composer';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { captureRef } from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Line, Circle, Path, Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import SnailIcon from './SnailIcon';
import AlertModal from './AlertModal';
import { useTranslation } from 'react-i18next';
import { getCurrentRTL } from '../utils/i18n';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';
import useStore from '../state/measurementStore';
import {
  scaleFontSize,
  scalePadding,
  scaleMargin,
  scaleSize,
  scaleBorderRadius,
  scaleIconSize,
  scaleGap
} from '../utils/deviceScale';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Expandable section component with GLOWING VIBRANT AESTHETIC
const ExpandableSection = ({
  title,
  icon,
  color,
  children,
  delay = 200
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const heightValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const opacity = useSharedValue(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Simple fade in only - no scale animation to prevent jerky scrolling
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [delay]);

  useEffect(() => {
    // Reset animating flag at start of new animation
    isAnimatingRef.current = true;
    
    if (expanded) {
      // Use timing instead of spring to prevent continuous updates that block touches
      heightValue.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) isAnimatingRef.current = false;
      });
      rotateValue.value = withTiming(180, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      heightValue.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) isAnimatingRef.current = false;
      });
      rotateValue.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
    
    // Safety timeout to ensure flag is always reset
    const timeout = setTimeout(() => {
      isAnimatingRef.current = false;
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [expanded]);

  // Simple fade animation only (no scale to prevent jerky scrolling)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      // REMOVED zIndex - was causing overlay issues on Android
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Use a fixed maxHeight when expanded to prevent layout thrashing
    const maxHeight = heightValue.value * 2000;
    return {
      maxHeight: maxHeight,
      opacity: heightValue.value,
      overflow: 'hidden',
    };
  });
  
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, { marginBottom: scaleMargin(14) }]} pointerEvents="box-none">
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: scaleBorderRadius(20),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: scaleSize(8),
          elevation: expanded ? 4 : 2,
          borderWidth: scaleSize(1),
          borderColor: 'rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header - Separate Pressable for better touch handling */}
        <Pressable
          onPress={() => {
            // Toggle immediately - don't block on animation state
            const newExpanded = !expanded;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setExpanded(newExpanded);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: scalePadding(18),
            zIndex: 10,
          }}
        >
          <Text style={{
            fontSize: scaleFontSize(14.5),
            fontWeight: '700',
            color: '#1C1C1E',
            textAlign: 'center',
            letterSpacing: -0.3,
            flex: 1,
          }}>
            {title}
          </Text>
          <AnimatedView style={[chevronAnimatedStyle, { position: 'absolute', right: scalePadding(18) }]} pointerEvents="none">
            <Ionicons name="chevron-down" size={scaleIconSize(24)} color="#666" />
          </AnimatedView>
        </Pressable>

        {/* Content - Separate animated container that doesn't interfere with header touches */}
        <AnimatedView style={contentAnimatedStyle} pointerEvents={expanded ? 'auto' : 'none'}>
          <View style={{ 
            paddingHorizontal: scalePadding(18), 
            paddingBottom: scalePadding(18),
          }}>
            {children}
          </View>
        </AnimatedView>
      </View>
    </Animated.View>
  );
};

// Comparison row component for Free vs Pro table
// Removed: ComparisonRow component - Free vs Pro system no longer exists

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  // Initialize i18n translation hook
  const { t } = useTranslation();
  
  // Check if current language is RTL
  const isRTL = getCurrentRTL();
  
  const insets = useSafeAreaInsets();
  const headerScale = useSharedValue(0.9);
  // REMOVED: Pro/Free system no longer exists - freehand is free for all!

  // Track if close button was long-pressed to prevent modal closing
  const closeLongPressedRef = useRef(false);

  // Ref for capturing modal content as screenshot
  const modalContentRef = useRef<ScrollView>(null);
  
  // Easter egg: 7 taps on right egg to open YouTube link
  const [eggTaps, setEggTaps] = useState<number[]>([]); // Array of tap timestamps
  const eggTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSuccessResponse = () => {
    // Success haptic sequence
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200);
  };
  
  // Left egg: Long-press to open YouTube link
  const leftEggPressTimer = useRef<NodeJS.Timeout | null>(null);
  const leftEggNestedTimers = useRef<NodeJS.Timeout[]>([]); // Track all nested timers
  const [leftEggPressing, setLeftEggPressing] = useState(false);
  
  // Alert modal state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };
  
  // Ref for capturing the modal container as screenshot (wrap ScrollView)
  const modalContainerRef = useRef<View>(null);
  
  // Handle support email with pre-populated template and screenshot
  const handleSupportEmail = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Get device info
      const deviceInfo = {
        brand: Device.brand || 'Unknown',
        model: Device.modelName || 'Unknown',
        osName: Device.osName || 'Unknown',
        osVersion: Device.osVersion || 'Unknown',
      };
      
      // Get app info
      const appVersion = Constants.expoConfig?.version || 'Unknown';
      const appName = Constants.expoConfig?.name || 'PanHandler';
      
      // Get session info from store
      const currentImageUri = useStore.getState().currentImageUri;
      const calibration = useStore.getState().calibration;
      const measurements = useStore.getState().completedMeasurements;
      const isDonor = useStore.getState().isDonor;
      
      // Build session activity log
      const sessionLog = [
        currentImageUri ? '✓ Photo captured' : '✗ No photo',
        calibration ? `✓ Calibrated (${calibration.calibrationType || 'unknown'} method)` : '✗ Not calibrated',
        measurements?.length > 0 ? `✓ ${measurements.length} measurement(s) made` : '✗ No measurements',
        `Donor status: ${isDonor ? 'Supporter ❤️' : 'Non-donor'}`,
      ].join(' → ');
      
      // Pre-populated email body with template
      const emailBody = `
Please describe your issue below:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE DESCRIPTION:
[Example: App freezes when I try to measure after calibrating]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEVICE & APP INFORMATION:
App: ${appName} v${appVersion}
Phone: ${deviceInfo.brand} ${deviceInfo.model}
OS: ${deviceInfo.osName} ${deviceInfo.osVersion}
Platform: ${Platform.OS} ${Platform.Version}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION ACTIVITY:
Last Screen: Help Modal
Session Flow: ${sessionLog}

Thank you for helping us improve PanHandler!
      `.trim();
      
      // Check if mail composer is available
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        showAlert(
          'Email Not Available',
          'Please email us directly at snailmail3d@gmail.com',
          'info'
        );
        return;
      }
      
      // Compose email with pre-populated fields
      const options: MailComposer.MailComposerOptions = {
        recipients: ['snailmail3d@gmail.com'],
        subject: `[PanHandler ${appVersion}] Support Request`,
        body: emailBody,
        isHtml: false,
      };
      
      await MailComposer.composeAsync(options);
      
    } catch (error) {
      console.error('Error composing support email:', error);
      showAlert(
        'Error',
        'Could not open email. Please email us at snailmail3d@gmail.com',
        'error'
      );
    }
  };

  // Removed: Pulsing animation for "Upgrade to Pro" (Free vs Pro section removed)

  useEffect(() => {
    if (visible) {
      headerScale.value = withSequence(
        withTiming(1.05, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    }
  }, [visible]);

  // CRITICAL: Cleanup all timers when component unmounts
  useEffect(() => {
    return () => {
      // Clear easter egg timers
      if (eggTapTimeoutRef.current) {
        clearTimeout(eggTapTimeoutRef.current);
        eggTapTimeoutRef.current = null;
      }
      if (leftEggPressTimer.current) {
        clearTimeout(leftEggPressTimer.current);
        leftEggPressTimer.current = null;
      }
      // Clear all nested timers
      leftEggNestedTimers.current.forEach(timer => clearTimeout(timer));
      leftEggNestedTimers.current = [];
    };
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  // REMOVED: Swipe gesture was interfering with scroll on Android
  // Users can use the X button to close instead

  return (
    <>
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View
            style={{
              flex: 1,
              marginTop: insets.top + scaleSize(20),
              marginHorizontal: scaleMargin(16),
              marginBottom: insets.bottom + scaleSize(20),
              borderRadius: scaleBorderRadius(20),
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: scaleSize(6) },
              shadowOpacity: 0.3,
              shadowRadius: scaleSize(20),
              elevation: 16,
              backgroundColor: '#E8E8ED',
            }}
          >
            {/* Header */}
            <View
              style={{
                borderTopLeftRadius: scaleBorderRadius(20),
                borderTopRightRadius: scaleBorderRadius(20),
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.92)',
              }}
            >
              <View
                style={{
                  paddingTop: scalePadding(24),
                  paddingBottom: scalePadding(20),
                  paddingHorizontal: scalePadding(24),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderBottomWidth: scaleSize(1),
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, headerAnimatedStyle]}>
                  <View style={{
                    width: scaleSize(48),
                    height: scaleSize(48),
                    borderRadius: scaleBorderRadius(24),
                    backgroundColor: 'rgba(0,122,255,0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: scaleMargin(14),
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: scaleSize(10),
                  }}>
                    <Ionicons name="help-circle" size={scaleIconSize(28)} color="#666" />
                  </View>
                  <View>
                    <Text style={{
                      color: '#1C1C1E',
                      fontSize: scaleFontSize(24),
                      fontWeight: '700',
                      letterSpacing: -0.5,
                    }}>
                      {t('helpModal.title')}
                    </Text>
                  </View>
                </Animated.View>
                <Pressable
                  onPress={() => {
                    // Only close modal if it wasn't a long press
                    if (!closeLongPressedRef.current) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onClose();
                    }
                    // Reset flag after short delay
                    setTimeout(() => {
                      closeLongPressedRef.current = false;
                    }, 100);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    width: scaleSize(44),
                    height: scaleSize(44),
                    borderRadius: scaleBorderRadius(22),
                    backgroundColor: 'rgba(120,120,128,0.16)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={scaleIconSize(24)} color="#3C3C43" />
                </Pressable>
              </View>
            </View>

            {/* Content with background */}
            <View
              ref={modalContainerRef}
              collapsable={false}
              style={{ flex: 1, backgroundColor: 'rgba(232,232,237,0.98)', borderWidth: scaleSize(1), borderColor: 'rgba(200,200,210,0.4)' }}
            >
                  <ScrollView
                    ref={modalContentRef}
                    style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}
                    contentContainerStyle={{ padding: scalePadding(20), paddingBottom: scalePadding(40), direction: isRTL ? 'rtl' : 'ltr' }}
                    showsVerticalScrollIndicator={true}
                    scrollEventThrottle={16}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    removeClippedSubviews={false}
                    bounces={true}
                    overScrollMode="always"
                    decelerationRate="normal"
                    persistentScrollbar={false}
                    directionalLockEnabled={false}
                    alwaysBounceVertical={false}
                    scrollToOverflowEnabled={true}
                  >
              {/* Language Selector for PDF Guide */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '700', 
                  color: '#1C1C1E', 
                  textAlign: 'center',
                  marginBottom: 12 
                }}>
                  {`📄 ${t('helpModal.pdfGuideLanguages')}`}
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  gap: 8,
                  paddingHorizontal: 4
                }}>
                  {[
                    { code: 'en', flag: '🇺🇸', name: 'English' },
                    { code: 'es', flag: '🇪🇸', name: 'Español' }
                  ].map((lang) => (
                    <Pressable
                      key={lang.code}
                      onPress={async () => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          const { generatePdfGuide } = await import('../utils/generatePdfGuide');
                          await generatePdfGuide(lang.code);
                        } catch (error) {
                          console.error('Error generating PDF:', error);
                          showAlert('Error', \`Failed to generate PDF guide in \${lang.name}. Please try again.\`, 'error');
                        }
                      }}
                      style={({ pressed }) => ({
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: pressed ? 'rgba(0, 122, 255, 0.15)' : 'rgba(0, 122, 255, 0.08)',
                        borderWidth: 1,
                        borderColor: 'rgba(0, 122, 255, 0.2)',
                      })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600' }}>
                        {lang.flag} {lang.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={{ 
                  fontSize: 11, 
                  color: '#8E8E93', 
                  textAlign: 'center',
                  marginTop: 8,
                  fontStyle: 'italic'
                }}>
                  {t('helpModal.moreLanguagesSoon')}
                </Text>
              </View>
              
              {/* Video Course Section - NEW! */}
              <ExpandableSection
                icon="play-circle"
                title={`🎬 ${t('helpModal.videoCoursesTitle')}`}
                color="#666"
              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12, fontWeight: '600' }}>
                    {t('helpModal.videoCoursesDescription')}
                  </Text>
                  
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 21, marginBottom: 16 }}>
                    {t('helpModal.videoCoursesLearn')}
                  </Text>
                  
                  {/* Red Banner Button - Matches Play Icon Color */}
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      Linking.openURL('https://www.youtube.com/playlist?list=PLJB4l6OZ0E3HRdPaJn8dJPZrEu4dPBDJi');
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#E02847' : '#FF2D55',
                      paddingVertical: 18,
                      paddingHorizontal: 28,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#FF2D55',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.35,
                      shadowRadius: 16,
                      elevation: 10,
                      marginBottom: 20,
                      marginHorizontal: -4,
                      transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                    })}
                  >
                    <Text style={{ 
                      fontSize: 19, 
                      fontWeight: '800', 
                      color: '#FF2D55',
                      letterSpacing: 0.3,
                      textAlign: 'center',
                      textShadowColor: 'rgba(255, 255, 255, 0.9)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 4,
                      textDecorationLine: 'underline',
                      textDecorationColor: '#FF2D55',
                      textDecorationStyle: 'solid',
                    }}>
                      📹 PanHandler YouTube Course Here!
                    </Text>
                  </Pressable>
                  
                  <View style={{ 
                    marginTop: 16, 
                    padding: 12, 
                    backgroundColor: 'rgba(0,0,0, 0.08)',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0, 0.2)',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: 16, marginRight: 8 }}>✨</Text>
                      <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19, flex: 1 }}>
                        <Text style={{ fontWeight: '700' }}>Course includes:</Text>{'\n'}
                        • Getting started tutorials{'\n'}
                        • Advanced measurement techniques{'\n'}
                        • Real-world workflow examples{'\n'}
                        • Tips & tricks for best results
                      </Text>
                    </View>
                  </View>
                  
                  {/* PDF Guide Link */}
                  <Pressable
                    onPress={async () => {
                      try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        const { generatePdfGuide } = await import('../utils/generatePdfGuide');
                        await generatePdfGuide();
                      } catch (error) {
                        console.error('Error generating PDF:', error);
                        showAlert('Error', 'Failed to generate PDF guide. Please try again.', 'error');
                      }
                    }}
                    style={{ marginTop: 16, alignItems: 'center' }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: '#007AFF',
                      textDecorationLine: 'underline',
                      fontWeight: '600',
                    }}>
                      📄 PDF Guide
                    </Text>
                  </Pressable>
                </View>
              </ExpandableSection>

              {/* Camera & Auto Level */}
              <ExpandableSection
                icon="camera"
                title={`📸 ${t('helpModal.step1Title')}`}
                color="#666"
                delay={50}


              >
                <View style={{ marginLeft: 4 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📐</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Hold camera perpendicular (90°)</Text>{'\n'}
                      • Flat surfaces: Look straight down{'\n'}
                      • Vertical surfaces: Face directly at walls/objects
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📏</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Distance matters:</Text>{'\n'}
                      • Small objects: 18 inches (1.5 feet / 0.5m){'\n'}
                      • Large objects: 6 feet (2 meters) or further
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🪙</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Coin in center of object</Text>
                    </Text>
                  </View>
                </View>

                {/* Auto Level Feature */}
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: 'rgba(52,199,89,0.12)',
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(52,199,89,0.3)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Ionicons name="flash" size={22} color="#666" />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#2E7D32', marginLeft: 6 }}>
                      AUTO LEVEL - Hands-Free Capture
                    </Text>
                  </View>
                  
                  {/* Visual: Bubble Level */}
                  <View style={{ alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ fontSize: 36 }}>🎯</Text>
                      <View style={{
                        backgroundColor: 'rgba(52,199,89,0.2)',
                        paddingHorizontal: 18,
                        paddingVertical: 12,
                        borderRadius: 26,
                        borderWidth: 3,
                        borderColor: '#34C759',
                        shadowColor: '#34C759',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                      }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#2E7D32' }}>BUBBLE LEVEL</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 10, textAlign: 'center' }}>
                    Position your object + coin in frame, then level phone to auto-capture
                  </Text>
                  
                  {/* How it works */}
                  <View style={{ marginBottom: 12, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 8 }}>
                      <Text style={{ fontWeight: '700' }}>How it works:</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                      1. Frame your object with the coin{'\n'}
                      2. Watch the bubble level crosshairs{'\n'}
                      3. Level your phone to center the bubble{'\n'}
                      4. Hold down the shutter button until photo captures
                    </Text>
                  </View>
                  
                  <View style={{ marginTop: 8, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', fontStyle: 'italic', textAlign: 'center' }}>
                      💡 Holding the shutter button helps ensure your photo is sharp and perfectly level!
                    </Text>
                  </View>

                  {/* Auto-Leveled Album Feature */}
                  <View style={{
                    marginTop: 12,
                    backgroundColor: 'rgba(0,0,0,0.08)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1.5,
                    borderColor: 'rgba(88,86,214,0.2)',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Ionicons name="albums" size={18} color="#5856D6" />
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#5856D6', marginLeft: 6 }}>
                        Smart Photo Organization
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                      Auto-captured photos are automatically saved to both your Camera Roll AND a special "Auto-Leveled" album in Photos for easy access!
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* Calibration */}
              <ExpandableSection
                icon="analytics"
                title={`🪙 ${t('helpModal.step2Title')}`}
                color="#666"
                delay={100}


              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  {t('helpModal.afterCapturing')}
                </Text>
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • <Text style={{ fontWeight: '600' }}>{t('helpModal.searchCoinType')}</Text> - {t('helpModal.650CoinsWorldwide')}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • {t('helpModal.zoomPosition')}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • <Text style={{ fontWeight: '600' }}>{t('helpModal.matchEdges')}</Text>
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                    • {t('helpModal.tapLockIn')}
                  </Text>
                </View>
                
                {/* Recalibrate Button */}
                <View style={{
                  marginTop: 14,
                  backgroundColor: 'rgba(0,0,0,0.12)',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1.5,
                  borderColor: 'rgba(0,0,0,0.25)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="refresh-outline" size={18} color="#EF4444" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#EF4444', marginLeft: 6 }}>
                      Oops! Need a Do-Over?
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    Made a mistake with your calibration? No worries! Just tap the red <Text style={{ fontWeight: '600' }}>Recalibrate</Text> button (below the calibration badge) to start fresh. You will go back to the camera without losing your place!
                  </Text>
                </View>
              </ExpandableSection>

              {/* Map Mode */}

              {/* Measurement Modes */}
              <ExpandableSection
                icon="resize"
                title={`📏 ${t('helpModal.step3Title')}`}
                color="#666"
                delay={200}


              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  {t('helpModal.chooseMeasurement')}
                </Text>
                
                {/* Distance */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Custom distance icon matching menu */}
                    <Svg width={20} height={20} viewBox="0 0 16 16">
                      <Line x1="3" y1="8" x2="13" y2="8" stroke="#AF52DE" strokeWidth="1.5" />
                      <Circle cx="3" cy="8" r="2" fill="#AF52DE" />
                      <Circle cx="13" cy="8" r="2" fill="#AF52DE" />
                    </Svg>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      {t('helpModal.distanceMode')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                    {t('helpModal.distanceDescription')}{'\n\n'}
                    {t('helpModal.distanceProTip')} 📐
                  </Text>
                </View>

                {/* Angle */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Custom angle icon matching menu - 45 degree acute angle */}
                    <Svg width={20} height={20} viewBox="0 0 16 16">
                      <Line x1="3" y1="13" x2="13" y2="3" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" />
                      <Line x1="3" y1="13" x2="13" y2="13" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" />
                      <Path d="M 7 13 A 5.66 5.66 0 0 1 6 8" stroke="#FF9500" strokeWidth="1.3" fill="none" />
                      <Line x1="6" y1="12" x2="6.8" y2="12.8" stroke="#FF9500" strokeWidth="1" strokeLinecap="round" />
                      <Line x1="5.2" y1="10" x2="4.4" y2="10.2" stroke="#FF9500" strokeWidth="1" strokeLinecap="round" />
                    </Svg>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      {t('helpModal.angleMode')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                    {t('helpModal.angleDescription')}
                  </Text>
                </View>

                {/* Circle */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="radio-button-off" size={20} color="#E91E63" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      {t('helpModal.circleMode')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                    {t('helpModal.circleDescription')}
                  </Text>
                </View>

                {/* Rectangle */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="square-outline" size={20} color="#1976D2" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      {t('helpModal.rectangleMode')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                    {t('helpModal.rectangleDescription')}
                  </Text>
                </View>

                {/* Freehand/Free Measure */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Freehand squiggle icon */}
                    <Svg width={20} height={20} viewBox="0 0 16 16">
                      <Path 
                        d="M 2 8 Q 4 6, 6 8 T 10 8 Q 12 9, 14 7" 
                        stroke="#10B981" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      {t('helpModal.freehandMode')}
                    </Text>
                  </View>
                  
                  
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 8 }}>
                    {t('helpModal.freehandDescription')}
                  </Text>
                  
                  {/* Lasso Mode Feature */}
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: 12, marginTop: 8, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.35)' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 16, marginRight: 6 }}>🎯</Text>
                      <Text style={{ fontSize: 14, color: '#2E7D32', fontWeight: '700' }}>
                        {t('helpModal.lassoModeTitle')}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19, marginBottom: 6 }}>
                      {t('helpModal.lassoModeSnap')}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#2E7D32', fontWeight: '600', lineHeight: 19 }}>
                      ✨ {t('helpModal.lassoModeArea')}
                    </Text>
                  </View>
                  
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: 10, marginTop: 8 }}>
                    <Text style={{ fontSize: 13, color: '#2E7D32', fontWeight: '600', marginBottom: 4 }}>
                      {t('helpModal.freehandHowToUse')}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                      1. {t('helpModal.freehandStep1')}{'\n'}
                      2. {t('helpModal.freehandStep2')}{'\n'}
                      3. {t('helpModal.freehandStep3')}{'\n'}
                      4. {t('helpModal.freehandStep4')}
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(16,185,129,0.15)' }}>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', fontStyle: 'italic', lineHeight: 18 }}>
                      💡 {t('helpModal.freehandGreatFor')}
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* Volume Calculation */}
              <ExpandableSection
                icon="cube"
                title={`📦 ${t('helpModal.volumeTitle')}`}
                color="#666"
                delay={250}
              >
                <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 21, marginBottom: 14 }}>
                  {t('helpModal.calculate3DVolumes')}
                </Text>

                <View style={{
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.15)',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    {t('helpModal.howToCalculateVolume')}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    1. {t('helpModal.volumeStep1')}{'\n'}
                    2. {t('helpModal.volumeStep2')}{'\n'}
                    3. {t('helpModal.volumeStep3')}{'\n'}
                    4. {t('helpModal.volumeStep4')}{'\n'}
                    5. {t('helpModal.volumeStep5')}
                  </Text>
                </View>

                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                  {t('helpModal.worksWith')}
                </Text>
                <View style={{ marginLeft: 8, marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    • {t('helpModal.rectanglesBoxVolumes')}{'\n'}
                    • {t('helpModal.circlesCylinderVolumes')}{'\n'}
                    • {t('helpModal.connectedLinePolygons')}{'\n'}
                    • {t('helpModal.closedFreeDrawLassos')}
                  </Text>
                </View>

                <View style={{
                  backgroundColor: 'rgba(255,149,0,0.1)',
                  borderRadius: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.15)',
                }}>
                  <Text style={{ fontSize: 12, color: '#1C1C1E', lineHeight: 17 }}>
                    ⚠️ {t('helpModal.importantFreeDraw')}
                  </Text>
                </View>
              </ExpandableSection>

              {/* Controls & Navigation */}
              <ExpandableSection
                icon="navigate-circle"
                title={`🎮 ${t('helpModal.navigationTitle')}`}
                color="#666"
                delay={300}


              >
                <View style={{ gap: 12 }}>
                  {/* Pan/Zoom */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🗺️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.panZoomMode')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.pinchZoomDrag')}
                      </Text>
                    </View>
                  </View>

                  {/* Measure */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>📏</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.measureMode')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.tapPlacePrecision')}
                      </Text>
                    </View>
                  </View>

                  {/* Cursor */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ marginRight: 10, marginTop: 2 }}>
                      <Ionicons name="add" size={18} color="#666" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.precisionCursor')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.precisionCursorDesc')}
                      </Text>
                    </View>
                  </View>

                  {/* Colors */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🎨</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.colorCoded')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.eachMeasurementColor')}
                      </Text>
                    </View>
                  </View>

                  {/* Hide Labels Toggle */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ marginRight: 10, marginTop: 2 }}>
                      <Ionicons name="eye-outline" size={18} color="#666" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.hideLabels')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.hideLabelsDesc')}
                      </Text>
                    </View>
                  </View>

                  {/* Menu Controls */}
                  <View
                    style={{
                      backgroundColor: 'rgba(255,59,48,0.12)',
                      borderRadius: 14,
                      padding: 14,
                      marginTop: 8,
                      borderWidth: 2,
                      borderColor: 'rgba(255,59,48,0.25)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Ionicons name="menu" size={20} color="#FF3B30" />
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FF3B30', marginLeft: 6 }}>
                        {t('helpModal.menuControls')}
                      </Text>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        • {t('helpModal.swipeRightCollapse')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        • {t('helpModal.tapSideTab')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        • {t('helpModal.dragSideTab')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        • {t('helpModal.menuCollapsesInstantly')}
                      </Text>
                    </View>
                  </View>
                </View>
              </ExpandableSection>

              {/* Move & Edit Mode */}
              <ExpandableSection
                icon="move"
                title={`✏️ ${t('helpModal.moveEditTitle')}`}
                color="#666"
                delay={350}


              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  {t('helpModal.afterPlacingMeasurements')}
                </Text>
                
                <View style={{ gap: 12 }}>
                  {/* Move Whole Measurements */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>👆</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.moveMeasurements')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.moveDesc')}
                      </Text>
                    </View>
                  </View>

                  {/* Edit Individual Points */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🎯</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        {t('helpModal.editPoints')}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        {t('helpModal.editPointsDesc')}
                      </Text>
                    </View>
                  </View>

                  {/* Add Labels - One-Click Editing */}
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.12)',
                      borderRadius: 14,
                      padding: 14,
                      marginTop: 4,
                      borderWidth: 2,
                      borderColor: 'rgba(88,86,214,0.25)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, marginRight: 8 }}>🏷️</Text>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#5856D6' }}>
                        {t('helpModal.addCustomLabels')}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 8 }}>
                      {t('helpModal.enableEditLabels')}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6E6E73', lineHeight: 19, fontStyle: 'italic' }}>
                      {t('helpModal.labelsAppearOnSaves')}
                    </Text>
                  </View>

                  {/* 4-Tap Delete */}
                  <View
                    style={{
                      backgroundColor: 'rgba(255,45,85,0.12)',
                      borderRadius: 14,
                      padding: 14,
                      marginTop: 4,
                      borderWidth: 2,
                      borderColor: 'rgba(0,0,0,0.25)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, marginRight: 8 }}>🗑️</Text>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FF2D55' }}>
                        {t('helpModal.quickDelete')}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                      {t('helpModal.tap4TimesDelete')}
                    </Text>
                  </View>

                  {/* Snap to Points */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🧲</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Magnetic Snapping
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        Points snap to nearby existing points (7mm range) when moving, making precise alignment easy
                      </Text>
                    </View>
                  </View>
                </View>
              </ExpandableSection>

              {/* Export Features */}
              <ExpandableSection
                icon="download"
                title={`💾 ${t('helpModal.saveShareTitle')}`}
                color="#5856D6"
                delay={400}


              >
                {/* FREE badge */}

                <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 12 }}>
                  {t('helpModal.exportPhotosReports')}
                </Text>

                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>📸</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      {t('helpModal.labeledPhoto')}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>🔧</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      {t('helpModal.cadExport')}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>📄</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      {t('helpModal.referencePhoto')}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>✉️</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      {t('helpModal.emailReports')}
                    </Text>
                  </View>
                </View>

                {/* PanHandler Measurements Album Feature */}
                <View style={{
                  marginTop: 16,
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1.5,
                  borderColor: 'rgba(88,86,214,0.2)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="folder" size={18} color="#5856D6" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#5856D6', marginLeft: 6 }}>
                      {t('helpModal.organizedMeasurements')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    {t('helpModal.savedToAlbum')}
                  </Text>
                </View>

                {/* CAD Integration */}
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(88,86,214,0.25)',
                    marginTop: 14,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="cube" size={20} color="#5856D6" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#5856D6', marginLeft: 6 }}>
                      Works with Any CAD Software
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                    Import photos as canvases in any CAD software. Scale values are included on every export for perfect alignment.
                  </Text>
                </View>
              </ExpandableSection>

              {/* Email Workflow - Expandable */}
              <ExpandableSection
                title={`📧 ${t('helpModal.emailWorkflowTitle')}`}
                icon="mail"
                color="#666"
                delay={450}


              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  Tap <Text style={{ fontWeight: '600', color: '#34C759' }}>Email</Text> to generate a report with 2 photos and a detailed measurement table.
                </Text>
                
                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 8, fontWeight: '600' }}>
                  Example Email Format
                </Text>
                
                <View style={{ backgroundColor: 'rgba(52,199,89,0.08)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(52,199,89,0.2)' }}>
                  <Text style={{ fontSize: 13, color: '#8E8E93', marginBottom: 8 }}>
                    Subject: <Text style={{ color: '#1C1C1E', fontWeight: '600' }}>Arduino Case - Measurements</Text>
                  </Text>
                  <View style={{ height: 1, backgroundColor: '#E5E5EA', marginBottom: 10 }} />
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    Arduino Case - Measurements by PanHandler{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Calibration Reference:</Text> 24.26mm (the coin you selected){'\n'}
                    <Text style={{ fontWeight: '600' }}>Unit System:</Text> Metric{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Measurements:</Text>{'\n'}
                    Distance: 145.2mm (Blue){'\n'}
                    Angle: 87.5° (Green){'\n'}
                    Circle: Ø 52.3mm (Red){'\n\n'}
                    Attached: 2 photos{'\n'}
                    {'\u2022'} Full measurements photo{'\n'}
                    {'\u2022'} Transparent CAD canvas (50% opacity)
                  </Text>
                </View>
                
                {/* Email Settings Reminder */}
                <View style={{ 
                  marginTop: 16, 
                  backgroundColor: 'rgba(0,0,0,0.08)', 
                  borderRadius: 12, 
                  padding: 14, 
                  borderWidth: 2, 
                  borderColor: 'rgba(88,86,214,0.25)' 
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, marginRight: 6 }}>⚡</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#5856D6' }}>
                      Pro Tip: Lightning Fast Workflow
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    Use the Share button to quickly send measurements via AirDrop, Messages, or any app. Use the Email button to send detailed reports with attachments.
                  </Text>
                </View>
              </ExpandableSection>

              {/* CAD Import Tutorial - Expandable */}
              <ExpandableSection
                title={`🔧 ${t('helpModal.cadIntegrationTitle')}`}
                icon="construct"
                color="#666"
                delay={500}


              >
                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12, fontWeight: '600' }}>
                  Import to Any CAD Software
                </Text>
                <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 21, marginBottom: 16 }}>
                  Use the CAD Canvas Photo to trace your measurements in any CAD software that supports canvas images.
                </Text>
                
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>1</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Open Your CAD Software
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        Create a new project or open an existing design
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>2</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Insert Canvas Image
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        Import the CAD Canvas Photo from PanHandler as a canvas or reference image
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>3</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Scale Using Coin Reference
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 8 }}>
                        Use the coin information in the photo label to quickly scale your canvas in CAD
                      </Text>
                      <View style={{ backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.25)' }}>
                        <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 18 }}>
                          <Text style={{ fontWeight: '700' }}>Quick Scaling:</Text> The photo label shows the coin you selected and its size (e.g., "US Quarter - Ø 24.26mm" or "Euro 1 - Ø 23.25mm"). Use this to set your canvas scale by measuring the coin in the photo!
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>4</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Trace & Model
                      </Text>
                      <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20 }}>
                        Trace over the 50% opacity image using your CAD tools for easy reference!
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ backgroundColor: 'rgba(52,199,89,0.12)', borderRadius: 14, padding: 12, marginTop: 8, borderWidth: 2, borderColor: 'rgba(52,199,89,0.25)' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="checkmark-circle" size={20} color="#666" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#34C759', marginLeft: 6 }}>
                      Pro Tip
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    The 50% opacity makes it easy to see your CAD lines while still having the reference visible
                  </Text>
                </View>
              </ExpandableSection>

              <ExpandableSection
                icon="map"
                title={`🗺️ ${t('helpModal.mapModeTitle')}`}
                color="#666"
                delay={550}


              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 14 }}>
                    Measure real-world distances on maps, blueprints, and scaled drawings using coin calibration + map scale.
                  </Text>

                  {/* Calibration Methods */}
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 10 }}>
                    🎯 Two Ways to Calibrate
                  </Text>

                  {/* Coin Reference + Map Scale */}
                  <View style={{
                    backgroundColor: 'rgba(0,102,255,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,102,255,0.2)',
                  }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#0066FF', marginBottom: 6 }}>
                      🪙 Coin Reference + Map Scale
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19, marginBottom: 4 }}>
                      Best for: Road maps, topo maps, property maps with verbal scale
                    </Text>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                      → Calibrate with coin first{'\n'}
                      → Tap 🗺️ Map button{'\n'}
                      → Enter scale (e.g., "1 inch = 10 miles" or "1cm = 5km"){'\n'}
                      → Start measuring!
                    </Text>
                  </View>

                  {/* Known Scale */}
                  <View style={{
                    backgroundColor: 'rgba(0,102,255,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 14,
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,102,255,0.2)',
                  }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#0066FF', marginBottom: 6 }}>
                      📐 Known Scale (Blueprints)
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19, marginBottom: 4 }}>
                      Best for: Drone photos, blueprints, floor plans, engineering drawings
                    </Text>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                      → Find the scale bar on your drawing{'\n'}
                      → Measure the bar with Distance mode{'\n'}
                      → Tap 🗺️ Map and enter real-world length{'\n'}
                      → Example: 50mm bar = 10 meters
                    </Text>
                  </View>

                  {/* Tools in Map Mode */}
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    🛠️ Tools in Map Mode
                  </Text>
                  <View style={{ marginLeft: 12, marginBottom: 14 }}>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      📏 <Text style={{ fontWeight: '600' }}>Distance</Text> - Measure straight-line distances (as the crow flies)
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      🧭 <Text style={{ fontWeight: '600' }}>Azimuth</Text> - Get compass bearings from point to point
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6A6A6A', lineHeight: 21, marginLeft: 12, marginBottom: 6 }}>
                      Place: Start → North reference → Destination
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      ⬜ <Text style={{ fontWeight: '600' }}>Rectangle</Text> - Calculate area of regions or zones
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      ⭕ <Text style={{ fontWeight: '600' }}>Circle</Text> - Measure radial distances and circular areas
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                      ✏️ <Text style={{ fontWeight: '600' }}>Freehand</Text> - Trace irregular boundaries for perimeter and area
                    </Text>
                  </View>
                  {/* Common Use Cases */}
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    🎯 Common Use Cases
                  </Text>
                  <View style={{ marginLeft: 12, marginBottom: 14 }}>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      📐 <Text style={{ fontWeight: '600' }}>Blueprints & Floor Plans (Known Scale)</Text> - Measure room dimensions and layout distances
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      🏗️ <Text style={{ fontWeight: '600' }}>Engineering Drawings</Text> - Calculate component spacing and assembly dimensions
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      🗺️ <Text style={{ fontWeight: '600' }}>Topographic Maps</Text> - Measure trail distances and terrain features
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      🚁 <Text style={{ fontWeight: '600' }}>Drone & Aerial Photos</Text> - Measure property boundaries and outdoor features from above
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 6 }}>
                      🏠 <Text style={{ fontWeight: '600' }}>Property & Real Estate</Text> - Calculate lot sizes and boundaries
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                      🏛️ <Text style={{ fontWeight: '600' }}>Historical Analysis</Text> - Study archived plans and territorial maps
                    </Text>
                  </View>
                  {/* Pro Tip */}
                  <View style={{
                    backgroundColor: 'rgba(0,102,255,0.1)',
                    borderRadius: 12,
                    padding: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: '#0066FF',
                  }}>
                    <Text style={{ fontSize: 13, color: '#0066FF', fontWeight: '600', marginBottom: 4 }}>
                      💡 Pro Tip
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      Toggle between Metric and Imperial anytime! If your map shows "1 cm = 5 km" but you prefer miles, just switch units and measurements convert automatically.
                    </Text>
                  </View>
                </View>
              </ExpandableSection>


              {/* Pro Tips */}
              <ExpandableSection
                icon="bulb"
                title={`💡 ${t('helpModal.proTipsTitle')}`}
                color="#00C7BE"
                delay={600}


              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    💾 <Text style={{ fontWeight: '600' }}>Auto-save enabled</Text> - Minimize the app anytime, resume your session later
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    🔄 <Text style={{ fontWeight: '600' }}>Switch units anytime</Text> - Toggle between metric ⇄ imperial instantly
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    🎯 <Text style={{ fontWeight: '600' }}>Use cursor guide</Text> - Measurement cursor appears above your finger for precise placement
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    ✏️ <Text style={{ fontWeight: '600' }}>Edit after placing</Text> - Move measurements or adjust individual points while in Edit mode
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                    🗑️ <Text style={{ fontWeight: '600' }}>Quick delete</Text> - Tap any measurement (in edit mode) 4 times rapidly to delete it
                  </Text>
                </View>
                
                {/* Epic Stress Test Showcase */}
                <View style={{
                  marginTop: 16,
                  backgroundColor: 'rgba(0,122,255,0.12)',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: 'rgba(0,122,255,0.25)',
                }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '700', 
                    color: '#1C1C1E', 
                    textAlign: 'center',
                    marginBottom: 10,
                    letterSpacing: -0.3,
                  }}>
                    🚀 Add as many points as you want - you can't break it!
                  </Text>
                  <Image 
                    source={{ uri: 'https://images.composerapi.com/93039A99-47C5-414B-80B6-3CF31EECDF86.jpg' }}
                    style={{ 
                      width: '100%', 
                      height: 180,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                  <Text style={{
                    fontSize: 12,
                    color: '#1C1C1E',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    lineHeight: 18,
                  }}>
                    Real stress test: 53 measurements! The app handles complex projects with ease. 📏✨
                  </Text>
                </View>
              </ExpandableSection>

              {/* Troubleshooting Section */}
              <ExpandableSection
                icon="warning"
                title={`🔧 ${t('helpModal.troubleshootingTitle')}`}
                color="#666"
                delay={650}


              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    📸 Camera Issues
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                    <Text style={{ fontWeight: '600' }}>Photos not saving or app freezing?</Text> Your device storage may be full. Delete old photos and videos from your Photos app to free up space. iOS needs available storage to process new images.
                  </Text>
                  
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    ⚡ Performance Issues
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                    <Text style={{ fontWeight: '600' }}>App running slowly?</Text> Check your device storage. A full device can cause lag and freezing. Aim to keep at least 1-2 GB of free space.
                  </Text>
                  
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    🔄 App Restart
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                    <Text style={{ fontWeight: '600' }}>Still having issues?</Text> Force-quit the app (swipe up from app switcher) and reopen. If problems persist, delete and reinstall the app for a fresh start.
                  </Text>
                  
                  {/* Send Bug Report Section */}
                  <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 12 }}>
                      🐛 Send Bug Report
                    </Text>
                    
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 21, marginBottom: 12 }}>
                      Having trouble? Our support team is here to help!
                    </Text>
                    
                    <Pressable
                      onPress={handleSupportEmail}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? 'rgba(255,149,0,0.15)' : 'rgba(255,149,0,0.08)',
                        borderRadius: 12,
                        padding: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.1)',
                      })}
                    >
                      <Ionicons name="mail" size={18} color="#1C1C1E" style={{ marginRight: 8 }} />
                      <Text style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#1C1C1E',
                      }}>
                        🐛 Send Bug Report
                      </Text>
                    </Pressable>
                    
                    <View style={{
                      marginTop: 12,
                      padding: 10,
                      backgroundColor: 'rgba(0,0,0, 0.08)',
                      borderRadius: 10,
                      borderLeftWidth: 3,
                      borderLeftColor: '#FF3B30',
                    }}>
                      <Text style={{ fontSize: 12, color: '#1C1C1E', lineHeight: 18, marginBottom: 6 }}>
                        <Text style={{ fontWeight: '700' }}>What to include:</Text>
                      </Text>
                      <View style={{ gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                          <Text style={{ fontSize: 12, color: '#1C1C1E', marginRight: 6 }}>•</Text>
                          <Text style={{ fontSize: 12, color: '#1C1C1E', flex: 1 }}>
                            Description of the issue (e.g., "App freezes after calibration")
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                          <Text style={{ fontSize: 12, color: '#1C1C1E', marginRight: 6 }}>•</Text>
                          <Text style={{ fontSize: 12, color: '#1C1C1E', flex: 1 }}>
                            Your device info (automatically included)
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <Text style={{ 
                      fontSize: 11, 
                      color: 'rgba(0, 0, 0, 0.4)', 
                      textAlign: 'center',
                      marginTop: 8,
                      fontStyle: 'italic',
                    }}>
                      We typically respond within 24 hours
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* 3D Printed Aids Section */}
              <ExpandableSection
                title="🖨️ 3D Printed Aids"
                icon="image"
                color="#666"
                delay={700}
              >
                <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 21, marginBottom: 14 }}>
                  Want even better reference photos for your design work? Check out our FREE Makerworld listing named <Text style={{ fontWeight: '600' }}>'Most Useful Fidget'</Text>
                </Text>

                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Linking.openURL('https://makerworld.com/en/models/1991923-most-useful-fidget-reference-photo-super-toy#profileId-2143761').catch(() => {
                      showAlert('Error', 'Could not open link', 'error');
                    });
                  }}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(255,87,34,0.3)',
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="open-outline" size={18} color="#666" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#FF5722', marginLeft: 6 }}>
                      View on MakerWorld
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 18 }}>
                    Download and 3D print for perfect reference photos
                  </Text>
                </Pressable>

                {/* Reference Photo Image - Placeholder until image is added */}
              </ExpandableSection>

              {/* Accuracy Fun Fact Section */}
              <View style={{ marginBottom: 16, marginTop: 12 }}>
                <View 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20,
                    padding: 18,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ position: 'relative' }}>
                      {/* Black outline star (behind) */}
                      <Ionicons name="star" size={24} color="#000000" style={{ 
                        position: 'absolute',
                        textShadowColor: '#000000',
                        textShadowOffset: { width: 1, height: 0 },
                        textShadowRadius: 1,
                      }} />
                      <Ionicons name="star" size={24} color="#000000" style={{ 
                        position: 'absolute',
                        textShadowColor: '#000000',
                        textShadowOffset: { width: -1, height: 0 },
                        textShadowRadius: 1,
                      }} />
                      <Ionicons name="star" size={24} color="#000000" style={{ 
                        position: 'absolute',
                        textShadowColor: '#000000',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 1,
                      }} />
                      <Ionicons name="star" size={24} color="#000000" style={{ 
                        position: 'absolute',
                        textShadowColor: '#000000',
                        textShadowOffset: { width: 0, height: -1 },
                        textShadowRadius: 1,
                      }} />
                      {/* Gray star on top */}
                      <Ionicons name="star" size={24} color="#666" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginLeft: 8, letterSpacing: -0.3 }}>
                      🎯 Amazing Accuracy
                    </Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 14, textAlign: 'center' }}>
                    PanHandler achieves{' '}
                    <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>
                      ~0.5 mm accuracy
                    </Text>
                    {'\n'}with small objects
                  </Text>
                  
                  <View style={{ 
                    backgroundColor: 'rgba(0,0,0,0.05)', 
                    borderRadius: 14, 
                    padding: 14, 
                    borderWidth: 1, 
                    borderColor: 'rgba(0,0,0,0.1)',
                    gap: 6,
                  }}>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', marginBottom: 4, fontWeight: '600', textAlign: 'center' }}>
                      📐 That's approximately:
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, textAlign: 'center' }}>
                      • 1/50th of an inch
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, textAlign: 'center' }}>
                      • Thickness of a credit card
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, textAlign: 'center' }}>
                      • 5-6 sheets of paper
                    </Text>
                  </View>

                  <Text style={{ fontSize: 13, color: '#1C1C1E', fontStyle: 'italic', marginTop: 12, lineHeight: 18, textAlign: 'center' }}>
                    💡 Tip: Higher resolution photos = better accuracy
                  </Text>
                </View>
              </View>

              {/* Privacy & Security Section */}
              <View style={{ marginBottom: 20, marginTop: 12 }}>
                <View 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                      <Ionicons name="shield-checkmark" size={24} color="#333" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
                      Privacy & Security
                    </Text>
                  </View>
                  
                  <View style={{ gap: 12 }}>
                    {/* Photos stay on device */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Ionicons name="phone-portrait-outline" size={18} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>Photos stay on your device</Text> — never uploaded or transferred to us
                      </Text>
                    </View>
                    
                    {/* Email privacy */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Ionicons name="mail-outline" size={18} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>Email uses default Mail.app</Text> — no data stored or collected
                      </Text>
                    </View>

                    {/* No tracking */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Ionicons name="eye-off-outline" size={18} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>Zero tracking</Text> — no analytics about you, your photos, files, or measurements
                      </Text>
                    </View>
                    
                    {/* Lightweight & offline */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Ionicons name="cloud-offline-outline" size={18} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>Works offline</Text> — lightweight and secure, everything runs locally
                      </Text>
                    </View>
                    
                  </View>
                </View>
              </View>

              {/* Permissions Section - Quick Guide */}
              <View style={{ marginBottom: 20, marginTop: 12 }}>
                <View 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                      <Ionicons name="settings-outline" size={24} color="#666" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
                      App Permissions
                    </Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12 }}>
                    PanHandler needs access to:
                  </Text>
                  
                  <View style={{ gap: 10, marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="camera" size={16} color="#666" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Camera</Text> — to take photos
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="images" size={16} color="#666" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Photo Library</Text> — to save measurements
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{
                    backgroundColor: 'rgba(0,0,0,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: '#666',
                  }}>
                    <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19, marginBottom: 10 }}>
                      <Text style={{ fontWeight: '700' }}>Need to enable permissions?</Text>{'\n'}
                      Tap the button below to open PanHandler settings
                    </Text>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        Linking.openSettings().catch(() => {
                          // Fallback: Try to open general settings
                          const url = Platform.OS === 'ios' 
                            ? 'app-settings:' 
                            : 'package:com.snail.panhandler';
                          Linking.openURL(url).catch(() => {
                            showAlert('Error', 'Could not open settings', 'error');
                          });
                        });
                      }}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)',
                        borderRadius: 8,
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        alignItems: 'center',
                      })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1C1C1E' }}>
                        Open App Settings
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* About Section */}
              <View style={{ marginBottom: 20, marginTop: 12 }}>
                <View 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(0,122,255,0.15)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                      <Ionicons name="information-circle" size={24} color="#666" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
                      About PanHandler
                    </Text>
                  </View>

                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 16 }}>
                    Created by <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>Snail</Text>, a slug on a mission to make measuring faster, easier, and accurate for everyone!
                  </Text>

                  {/* Buy Me a Coffee Button */}
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 40, marginBottom: 8 }}>☕</Text>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        Linking.openURL('https://buymeacoffee.com/Snail3D');
                      }}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? '#FFDD00' : '#FFDD00',
                        borderRadius: 14,
                        paddingVertical: 14,
                        paddingHorizontal: 24,
                        shadowColor: '#FFDD00',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                        transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                      })}
                    >
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '700', 
                        color: '#000000',
                        letterSpacing: 0.3,
                        textAlign: 'center',
                      }}>
                        Buy Me a Coffee
                      </Text>
                    </Pressable>
                  </View>
                  
                  <Text style={{ 
                    fontSize: 13, 
                    color: '#8E8E93', 
                    textAlign: 'center',
                    lineHeight: 19,
                    marginBottom: 20,
                  }}>
                    Enjoying PanHandler? Support development and help keep this app free for everyone! ☕
                  </Text>

                  {/* Simple YouTube text link */}
                  <Pressable
                    onPress={() => Linking.openURL("https://youtube.com/@realsnail3d?si=K4XTUYdou1ZefOlB")}
                    style={{ marginBottom: 20, alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 14, color: '#007AFF', textDecorationLine: 'underline' }}>
                      Follow on YouTube
                    </Text>
                  </Pressable>

                  {/* Beautiful dedication to grandfather */}
                  <View style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(0,0,0,0.08)',
                  }}>
                    <Text style={{ 
                      fontSize: 12, 
                      color: '#8E8E93', 
                      textAlign: 'center', 
                      lineHeight: 18,
                      fontStyle: 'italic',
                      letterSpacing: 0.3,
                    }}>
                      Dedicated to my grandfather{'\n'}
                      <Text style={{ fontSize: 11, color: '#A8A8A8' }}>
                        (who is actually good at math)
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              {/* Easter Egg Hints Section - Compact */}
              <View style={{ marginBottom: 12, marginTop: 8 }}>
                <View 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 16,
                    padding: 14,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,0,0,0.15)',
                    borderStyle: 'dashed',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' }}>
                    {/* Left egg - Long press to open YouTube (with chicken haptics!) */}
                    <Pressable
                      onPressIn={() => {
                        setLeftEggPressing(true);
                        // Start haptic pattern: Bawk bawk bagawk!
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Bawk

                        leftEggPressTimer.current = setTimeout(() => {
                          // Track all nested timers to prevent leaks
                          // Bawk (200ms)
                          leftEggNestedTimers.current.push(setTimeout(() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          }, 200));

                          // Bawk (400ms)
                          leftEggNestedTimers.current.push(setTimeout(() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          }, 400));

                          // Bagawk! (stronger final one at 600ms)
                          leftEggNestedTimers.current.push(setTimeout(() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                          }, 600));

                          // Open YouTube link after 3 seconds
                          leftEggNestedTimers.current.push(setTimeout(() => {
                            Linking.openURL('https://youtube.com/shorts/pEDsH9YD84s?feature=share').catch((err) => {
                              console.log('Failed to open YouTube link:', err);
                              showAlert('Error', 'Could not open YouTube link', 'error');
                            });
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setLeftEggPressing(false);
                            leftEggNestedTimers.current = []; // Clear tracked timers after completion
                          }, 3000));
                        }, 0);
                      }}
                      onPressOut={() => {
                        // Cancel if released early - clear ALL timers
                        if (leftEggPressTimer.current) {
                          clearTimeout(leftEggPressTimer.current);
                          leftEggPressTimer.current = null;
                        }
                        // CRITICAL: Clear all nested timers to prevent memory leaks
                        leftEggNestedTimers.current.forEach(timer => clearTimeout(timer));
                        leftEggNestedTimers.current = [];
                        setLeftEggPressing(false);
                      }}
                      style={{
                        opacity: leftEggPressing ? 0.5 : 1,
                        transform: [{ scale: leftEggPressing ? 0.9 : 1 }],
                      }}
                    >
                      <Text style={{ fontSize: 32 }}>🥚</Text>
                    </Pressable>
                    
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginHorizontal: 8, letterSpacing: -0.3 }}>
                      Hidden Surprises
                    </Text>
                    
                    {/* Right egg - 7 taps to open YouTube */}
                    <Pressable
                      onPress={() => {
                        const now = Date.now();

                        // Clear timeout if exists
                        if (eggTapTimeoutRef.current) {
                          clearTimeout(eggTapTimeoutRef.current);
                        }

                        // Add new tap to array
                        const newTaps = [...eggTaps, now];

                        // Keep only last 7 taps
                        const recentTaps = newTaps.slice(-7);
                        setEggTaps(recentTaps);

                        // Light haptic for each tap
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                        // Check if we have 7 taps
                        if (recentTaps.length === 7) {
                          // SUCCESS! Play success response
                          playSuccessResponse();

                          // Clear taps
                          setEggTaps([]);

                          // Open YouTube link after haptic response
                          setTimeout(() => {
                            Linking.openURL('https://youtu.be/rog8ou-ZepE?si=aVfNZf_i24xay02P');
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          }, 400);
                        }

                        // Reset after 2 seconds of no taps
                        eggTapTimeoutRef.current = setTimeout(() => {
                          setEggTaps([]);
                        }, 2000);
                      }}
                    >
                      <Text style={{ fontSize: 32 }}>🥚</Text>
                    </Pressable>
                  </View>
                  
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 18, textAlign: 'center', fontStyle: 'italic' }}>
                    Hold the left egg for a surprise. Tap the right egg (how many times?) for another surprise. Oh, and by the way, look out for bot battles that might come up while you're using the app — they may reveal more Easter eggs ;)
                  </Text>
                </View>

                {/* Rating - Compact */}
                <View style={{ marginTop: 16 }}>
                  {/* Rating Section - Compact */}
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      backgroundColor: 'rgba(0,0,0,0.12)',
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,215,0,0.25)',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 15, 
                      color: '#1C1C1E', 
                      textAlign: 'center',
                      lineHeight: 22,
                      fontWeight: '700',
                      marginBottom: 8,
                    }}>
                      Do you like this app?
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                      <Text style={{ fontSize: 28, letterSpacing: 3 }}>⭐⭐⭐⭐⭐</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        const appStoreId = '6754727828'; // PanHandler App Store ID
                        const androidPackage = 'com.snail.panhandler';

                        const storeUrl = Platform.OS === 'ios'
                          ? `itms-apps://itunes.apple.com/app/id${appStoreId}?action=write-review`
                          : `market://details?id=${androidPackage}`;

                        Linking.openURL(storeUrl).catch(() => {
                          // Fallback to web URLs if native store apps aren't available
                          const webUrl = Platform.OS === 'ios'
                            ? `https://apps.apple.com/app/id${appStoreId}?action=write-review`
                            : `https://play.google.com/store/apps/details?id=${androidPackage}`;
                          Linking.openURL(webUrl);
                        });
                      }}
                      style={({ pressed }) => ({
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        backgroundColor: pressed ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)',
                        borderRadius: 12,
                        marginTop: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 4,
                      })}
                    >
                      <Text style={{
                        color: '#1C1C1E',
                        fontSize: 16,
                        fontWeight: '700',
                        textAlign: 'center',
                      }}>
                        Tap here to leave a review 🙏
                      </Text>
                    </Pressable>
                   </View>
                </View>
              </View>

              {/* For the Nerds - GitHub Section */}
              <View style={{ marginTop: 32, marginBottom: 24 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#1C1C1E',
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  For the Nerds 🤓
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Linking.openURL('https://github.com/Snail3D/PanHandler');
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    backgroundColor: '#24292e',
                    borderRadius: 12,
                    marginHorizontal: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="logo-github" size={24} color="white" />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                  }}>
                    See the Code
                  </Text>
                </Pressable>
              </View>

              {/* Language Selector - Bottom of Modal */}
              <View style={{ marginTop: 48, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#1C1C1E',
                  textAlign: 'center',
                  marginBottom: 12,
                }}>
                  {`🌍 ${t('helpModal.languagesTitle') || 'Languages'}`}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#3C3C43',
                  textAlign: 'center',
                  lineHeight: 20,
                  paddingHorizontal: 16,
                }}>
                  {[
                    { code: 'en', label: 'EN English' },
                    { code: 'es', label: 'ES Español' },
                    { code: 'zh', label: 'ZH 中文' },
                    { code: 'hi', label: 'HI हिन्दी' },
                    { code: 'fr', label: 'FR Français' },
                    { code: 'ar', label: 'AR العربية' },
                    { code: 'bn', label: 'BN বাংলা' },
                    { code: 'ru', label: 'RU Русский' },
                    { code: 'pt', label: 'PT Português' },
                    { code: 'ur', label: 'UR اردو' },
                    { code: 'id', label: 'ID Bahasa Indonesia' },
                    { code: 'de', label: 'DE Deutsch' },
                    { code: 'ja', label: 'JA 日本語' },
                    { code: 'pl', label: 'PL Polski' },
                    { code: 'el', label: 'EL Ελληνικά' },
                    { code: 'sw', label: 'SW Kiswahili' },
                    { code: 'mr', label: 'MR मराठी' },
                    { code: 'te', label: 'TE తెలుగు' },
                    { code: 'tr', label: 'TR Türkçe' },
                    { code: 'ko', label: 'KO 한국어' },
                    { code: 'ta', label: 'TA தமிழ்' },
                    { code: 'vi', label: 'VI Tiếng Việt' },
                    { code: 'ha', label: 'HA Hausa' },
                    { code: 'pa', label: 'PA ਪੰਜਾਬੀ' },
                    { code: 'fil', label: 'FIL Filipino' },
                    { code: 'am', label: 'AM አማርኛ' },
                    { code: 'my', label: 'MY မြန်မာ' },
                    { code: 'th', label: 'TH ไทย' },
                    { code: 'he', label: 'HE עברית' },
                    { code: 'fa', label: 'FA فارسی' }
                  ].map((lang, index, array) => (
                    <Text
                      key={lang.code}
                      onPress={async () => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          const { changeLanguage } = await import('../utils/i18n');
                          await changeLanguage(lang.code);
                          // Close and reopen modal to refresh with new language
                          onClose();
                          setTimeout(() => {
                            showAlert('🌍 Language Changed', `App language set to ${lang.label.split(' ')[1]}`, 'success');
                          }, 300);
                        } catch (error) {
                          console.error('Error changing language:', error);
                          showAlert('Error', 'Failed to change language. Please try again.', 'error');
                        }
                      }}
                      style={{ color: '#007AFF', textDecorationLine: 'underline' }}
                    >
                      {lang.label}{index < array.length - 1 ? ', ' : ''}
                    </Text>
                  ))}
                </Text>
              </View>

            </ScrollView>
            </View>

            {/* Footer */}
            <View
              style={{
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.85)',
              }}
            >
              <View
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(0,0,0,0.08)',
                }}
              >
                {/* PDF Guide Button */}
                <Pressable
                  onPress={async () => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      const { generatePdfGuide } = await import('../utils/generatePdfGuide');
                      await generatePdfGuide();
                    } catch (error) {
                      console.error('Error generating PDF:', error);
                      showAlert('Error', 'Failed to generate PDF guide. Please try again.', 'error');
                    }
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    backgroundColor: pressed ? '#0056b3' : '#007AFF',
                    borderRadius: 12,
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                    transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                  })}
                >
                  <Text style={{ fontSize: 20 }}>📄</Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                  }}>
                    PDF Guide
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>

    {/* Custom Alert Modal - Outside main modal for proper z-index */}
    <AlertModal
      visible={alertConfig.visible}
      title={alertConfig.title}
      message={alertConfig.message}
      type={alertConfig.type}
      onClose={closeAlert}
    />

    </>
  );
}
