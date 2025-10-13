import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS, Easing } from "react-native-reanimated";
// import * as StoreReview from 'expo-store-review';
import MeasurementScreen from "./src/screens/MeasurementScreen";
import { getRandomQuote } from "./src/utils/makerQuotes";
// import RatingPromptModal from "./src/components/RatingPromptModal";
// import useStore from "./src/state/measurementStore";

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
  // Intro screen state
  const [showIntro, setShowIntro] = useState(true);
  const [introQuote, setIntroQuote] = useState<{text: string, author: string, year?: string} | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const introOpacity = useSharedValue(0);
  
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
    
    const typeInterval = setInterval(() => {
      if (currentIndex < completeText.length) {
        setDisplayedText(completeText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Hold for 2 seconds after typing, then fade out
        setTimeout(() => {
          introOpacity.value = withTiming(0, { 
            duration: 600,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1)
          }, () => {
            runOnJS(setShowIntro)(false);
          });
        }, 2000);
      }
    }, typingSpeed);
    
    return () => clearInterval(typeInterval);
  }, []);
  
  const introAnimatedStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
  }));
  
  // RATING PROMPT TEMPORARILY DISABLED - Will work in production build
  // const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  // const sessionCount = useStore((s) => s.sessionCount);
  // const hasRatedApp = useStore((s) => s.hasRatedApp);
  // const lastRatingPromptDate = useStore((s) => s.lastRatingPromptDate);
  // const incrementSessionCount = useStore((s) => s.incrementSessionCount);
  // const setHasRatedApp = useStore((s) => s.setHasRatedApp);
  // const setLastRatingPromptDate = useStore((s) => s.setLastRatingPromptDate);

  // useEffect(() => {
  //   // Increment session count on app start
  //   incrementSessionCount();

  //   // Check if we should show rating prompt
  //   const shouldShowPrompt = async () => {
  //     // Don't show if user has already rated
  //     if (hasRatedApp) return;

  //     // Show after 3-4 sessions
  //     if (sessionCount >= 3 && sessionCount <= 4) {
  //       // Check if we've shown prompt recently (wait 7 days between prompts)
  //       if (lastRatingPromptDate) {
  //         const lastPromptTime = new Date(lastRatingPromptDate).getTime();
  //         const daysSinceLastPrompt = (Date.now() - lastPromptTime) / (1000 * 60 * 60 * 24);
  //         if (daysSinceLastPrompt < 7) return;
  //       }

  //       // Check if store review is available
  //       const isAvailable = await StoreReview.isAvailableAsync();
  //       if (isAvailable) {
  //         // Small delay before showing prompt
  //         setTimeout(() => {
  //           setShowRatingPrompt(true);
  //         }, 2000);
  //       }
  //     }
  //   };

  //   shouldShowPrompt();
  // }, []);

  // const handleRate = async () => {
  //   setShowRatingPrompt(false);
  //   setHasRatedApp(true);
  //   setLastRatingPromptDate(new Date().toISOString());
  //   
  //   // Request in-app review (iOS 10.3+, Android 5.0+)
  //   const isAvailable = await StoreReview.isAvailableAsync();
  //   if (isAvailable) {
  //     await StoreReview.requestReview();
  //   }
  // };

  // const handleDismiss = () => {
  //   setShowRatingPrompt(false);
  //   setLastRatingPromptDate(new Date().toISOString());
  // };

  // v2.2.2 - Fixed touch responder to allow pinch/pan with single-finger hold
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {showIntro ? (
          // Intro Screen - White background with black text
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: '#FFFFFF',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 40,
              },
              introAnimatedStyle
            ]}
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
          </Animated.View>
        ) : (
          // Main App
          <NavigationContainer>
            <MeasurementScreen />
            <StatusBar style="auto" />
          </NavigationContainer>
        )}
        {/* Rating prompt will be enabled in production build */}
        {/* <RatingPromptModal 
          visible={showRatingPrompt}
          onClose={handleDismiss}
          onRate={handleRate}
        /> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
