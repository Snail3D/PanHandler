import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from "react-native-reanimated";
import CameraScreen from "./src/screens/CameraScreen";
import QuoteScreen from "./src/screens/QuoteScreen";
import { enableFakeTouchSupport } from "./src/utils/fakeTouchSupport";

// Enable fake touch support for macOS only (not Android/iOS)
if (Platform.OS === 'macos' || (Platform.OS === 'web' && navigator.platform.includes('Mac'))) {
  enableFakeTouchSupport();
}

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
  
  __DEV__ && console.log('🚀 App rendering, showIntro:', showIntro);

  // Audio configuration removed - expo-av was adding unwanted permissions
  useEffect(() => {
    console.log('✅ App initialized - no audio configuration needed');
  }, []);

  // Handle deep links when app opens from QR code or external link
  useEffect(() => {
    // Handle initial URL (when app opens from a link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URLs when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle deep link URLs (e.g., from QR code)
  const handleDeepLink = (url: string) => {
    console.log('🔗 Deep link received:', url);
    
    // Parse calibration data from URL fragment
    // Format: https://apps.apple.com/...#panhandler-paper-30mm
    // Or: panhandler://calibrate/paper-30mm
    const fragmentMatch = url.match(/#panhandler-(paper|disc)-(\d+)mm/);
    if (fragmentMatch) {
      const format = fragmentMatch[1] as 'paper' | 'disc';
      const size = parseInt(fragmentMatch[2], 10);
      console.log(`📐 QR Calibration detected: ${format} ${size}mm`);
      // The CameraScreen will handle this when it detects QR mode
      // For now, just log it - the QR detection in CameraScreen will handle calibration
    }
    
    // Handle custom URL scheme: panhandler://calibrate/paper-30mm
    if (url.startsWith('panhandler://')) {
      const match = url.match(/panhandler:\/\/calibrate\/(paper|disc)-(\d+)mm/);
      if (match) {
        const format = match[1] as 'paper' | 'disc';
        const size = parseInt(match[2], 10);
        console.log(`📐 Custom scheme QR Calibration: ${format} ${size}mm`);
      }
    }
  };

  // Handle quote screen completion
  const handleQuoteComplete = () => {
    __DEV__ && console.log('📖 QuoteScreen completed, showing main app');
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
