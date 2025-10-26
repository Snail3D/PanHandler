import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from "react-native-reanimated";
import * as ExpoAudio from 'expo-audio';
import CameraScreen from "./src/screens/CameraScreen";
import QuoteScreen from "./src/screens/QuoteScreen";

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
  const [showIntro, setShowIntro] = useState(true);
  const appOpacity = useSharedValue(0);

  // Configure audio session to allow background music/YouTube to continue playing
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        await ExpoAudio.setAudioModeAsync({
          playsInSilentMode: false, // Don't play audio in silent mode
        });
        console.log('✅ Audio session configured - background audio will continue playing');
      } catch (error) {
        console.warn('⚠️ Failed to configure audio session:', error);
      }
    };

    configureAudioSession();
  }, []);

  // Handle quote screen completion
  const handleQuoteComplete = () => {
    setShowIntro(false);

    // Fade in main app
    appOpacity.value = withDelay(100, withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }));
  };

  const appAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Opening Quote Screen */}
        {showIntro && <QuoteScreen onComplete={handleQuoteComplete} />}

        {/* Main App */}
        <Animated.View style={[{ flex: 1 }, appAnimatedStyle]}>
          <NavigationContainer>
            <CameraScreen />
            <StatusBar style="auto" />
          </NavigationContainer>
        </Animated.View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
