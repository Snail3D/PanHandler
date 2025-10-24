import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS, Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Audio } from 'expo-av';
// import * as StoreReview from 'expo-store-review'; // Temporarily disabled - native module not loaded
import CameraScreen from "./src/screens/CameraScreen";
import { getRandomQuote } from "./src/utils/makerQuotes";
// import RatingPromptModal from "./src/components/RatingPromptModal"; // Temporarily disabled
import useStore from "./src/state/measurementStore";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  // Configure audio session to allow background music/YouTube to continue playing
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: false, // Don't play audio in silent mode
          staysActiveInBackground: false, // Don't keep audio active in background
          shouldDuckAndroid: false, // Don't lower other apps' audio
          playThroughEarpieceAndroid: false,
          allowsRecordingIOS: false, // We don't need recording
          interruptionModeIOS: 0, // DoNotMix = 0 (don't interrupt other audio)
          interruptionModeAndroid: 1, // DoNotMix = 1 (don't interrupt other audio)
        });
        console.log('✅ Audio session configured - background audio will continue playing');
      } catch (error) {
        console.warn('⚠️ Failed to configure audio session:', error);
      }
    };
    
    configureAudioSession();
  }, []);
  
  // ═══════════════════════════════════════════════════════════════
  // OPENING QUOTE SCREEN (shows on app launch/foreground with typing animation)
  // This is the MAIN quote screen - handles typing effect with haptics
  // ═══════════════════════════════════════════════════════════════
  const [showIntro, setShowIntro] = useState(true);
  const [introQuote, setIntroQuote] = useState<{text: string, author: string, year?: string} | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const introOpacity = useSharedValue(0);
  const appOpacity = useSharedValue(0);

  // Track typing/animation state for cleanup using refs to avoid stale closures
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to gracefully skip intro
  const skipIntro = () => {
    // CRITICAL: Clear any active intervals/timeouts
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    // Fade out intro and fade in app immediately
    introOpacity.value = withTiming(0, {
      duration: 600,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    }, () => {
      runOnJS(setShowIntro)(false);
    });

    // Graceful fade-in for the main app
    appOpacity.value = withDelay(100, withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }));
  };
  
  // Get random quote on mount
  useEffect(() => {
    const quote = getRandomQuote();
    setIntroQuote(quote);
    
    // Fade in the intro screen
    introOpacity.value = withDelay(300, withTiming(1, { 
      duration: 800,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    }));
    
    // Type out the quote text
    const fullText = `"${quote.text}"`;
    const authorText = `- ${quote.author}${quote.year ? `, ${quote.year}` : ''}`;
    const completeText = `${fullText}\n\n${authorText}`;
    
    let currentIndex = 0;
    const typingSpeed = 25; // Fast typing for intro

    const intervalId = setInterval(() => {
      if (currentIndex < completeText.length) {
        setDisplayedText(completeText.substring(0, currentIndex + 1));

        // Natural typing haptics - varied intensity like real keystrokes
        const char = completeText[currentIndex];
        const isPunctuation = /[.,!?;:]/.test(char);
        const isSpace = char === ' ';

        if (!isSpace) { // No haptic for spaces (like lifting fingers between words)
          if (isPunctuation) {
            // Punctuation gets a stronger tap (finishing a thought)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else if (currentIndex % 4 === 0) {
            // Every 4th character gets a light tap (reduced frequency to prevent locking)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }

        currentIndex++;
      } else {
        // Clear the interval when typing is done
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
        }

        // Hold for 2 seconds after typing, then cross-fade
        const timeoutId = setTimeout(() => {
          // Fade out intro and fade in app simultaneously
          introOpacity.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1)
          }, () => {
            runOnJS(setShowIntro)(false);
          });

          // Graceful fade-in for the main app
          appOpacity.value = withDelay(200, withTiming(1, {
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1) // Smoother, more gradual
          }));

          // Clear the timeout ref
          holdTimeoutRef.current = null;
        }, 2000);

        holdTimeoutRef.current = timeoutId;
      }
    }, typingSpeed);

    typeIntervalRef.current = intervalId;

    // CRITICAL: Cleanup function to prevent memory leaks
    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
    };
  }, []); // Empty deps is correct - only run once on mount
  
  const introAnimatedStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
  }));
  
  const appAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appOpacity.value,
  }));
  
  /* Review prompt system - TEMPORARILY DISABLED (native module not loaded)
  // Review prompt system - Ask at 20 opens, then at 50 opens (max 2 times)
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const sessionCount = useStore((s) => s.sessionCount);
  const reviewPromptCount = useStore((s) => s.reviewPromptCount);
  const hasReviewedApp = useStore((s) => s.hasReviewedApp);
  const incrementSessionCount = useStore((s) => s.incrementSessionCount);
  const incrementReviewPromptCount = useStore((s) => s.incrementReviewPromptCount);
  const setHasReviewedApp = useStore((s) => s.setHasReviewedApp);
  const setLastReviewPromptDate = useStore((s) => s.setLastReviewPromptDate);

  useEffect(() => {
    // Increment session count on app start
    incrementSessionCount();

    // Check if we should show rating prompt
    const shouldShowPrompt = async () => {
      // Don't show if user has already reviewed
      if (hasReviewedApp) return;

      // Don't show if we've already asked twice
      if (reviewPromptCount >= 2) return;

      // First prompt: after 20 opens
      // Second prompt: after 50 opens
      const shouldPrompt = 
        (sessionCount === 20 && reviewPromptCount === 0) ||
        (sessionCount === 50 && reviewPromptCount === 1);

      if (shouldPrompt) {
        // Check if store review is available
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          // Small delay before showing prompt (wait for intro to finish)
          setTimeout(() => {
            setShowRatingPrompt(true);
          }, 3000);
        }
      }
    };

    shouldShowPrompt();
  }, [sessionCount]); // Re-check when session count changes

  const handleRate = async () => {
    setShowRatingPrompt(false);
    setHasReviewedApp(true);
    setLastReviewPromptDate(new Date().toISOString());
    incrementReviewPromptCount();
    
    // Request in-app review (iOS 10.3+, Android 5.0+)
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      await StoreReview.requestReview();
    }
  };

  const handleDismiss = () => {
    setShowRatingPrompt(false);
    setLastReviewPromptDate(new Date().toISOString());
    incrementReviewPromptCount();
  };
  */

  // v2.2.2 - Fixed touch responder to allow pinch/pan with single-finger hold
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* ═══════════════════════════════════════════════════════════════
            OPENING QUOTE SCREEN - White background with typing animation
            This shows on app launch and when returning from background
            Tap anywhere to skip the typing and proceed to camera
            ═══════════════════════════════════════════════════════════════ */}
        {showIntro && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#FFFFFF',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 40,
                zIndex: 1000,
              },
              introAnimatedStyle
            ]}
          >
            <Pressable
              onPress={skipIntro}
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#000000',
                  fontSize: 22,
                  fontWeight: '400',
                  textAlign: 'center',
                  lineHeight: 34,
                  fontFamily: 'System',
                  letterSpacing: 0.5,
                }}
              >
                {displayedText}
              </Text>
            </Pressable>
          </Animated.View>
        )}
        
        {/* Main App - Fades in gracefully after intro */}
        <Animated.View style={[{ flex: 1 }, appAnimatedStyle]}>
          <NavigationContainer>
            <CameraScreen />
            <StatusBar style="auto" />
          </NavigationContainer>
        </Animated.View>
        
        {/* Review prompt - TEMPORARILY DISABLED (native module not loaded)
        <RatingPromptModal 
          visible={showRatingPrompt}
          onClose={handleDismiss}
          onRate={handleRate}
        />
        */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
