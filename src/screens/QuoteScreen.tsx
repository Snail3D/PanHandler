import { useEffect, useState } from "react";
import { Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing
} from "react-native-reanimated";
import { getRandomQuote } from "../utils/makerQuotes";
import { scaleFontSize, scalePadding, scaleSize } from "../utils/deviceScale";

interface QuoteScreenProps {
  onComplete: () => void;
}

export default function QuoteScreen({ onComplete }: QuoteScreenProps) {
  const [introQuote, setIntroQuote] = useState<{
    text: string;
    author: string;
    year?: string;
  } | null>(null);

  const introOpacity = useSharedValue(0);

  // Function to skip intro (called on tap)
  const skipIntro = () => {
    // Fade out intro
    introOpacity.value = withTiming(0, {
      duration: 600,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    }, () => {
      runOnJS(onComplete)();
    });
  };

  // Simple fade in, tap to continue
  useEffect(() => {
    __DEV__ && console.log('📖 QuoteScreen mounting');
    const quote = getRandomQuote();
    setIntroQuote(quote);
    __DEV__ && console.log('📖 QuoteScreen quote loaded:', quote);

    // Fade in after short delay
    introOpacity.value = withDelay(100, withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    }));
  }, []);

  const introAnimatedStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
  }));

  return (
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
          paddingHorizontal: scalePadding(40),
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
            fontSize: scaleFontSize(22),
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: scaleSize(34),
            fontFamily: 'System',
            letterSpacing: 0.5,
          }}
        >
          {introQuote ? `"${introQuote.text}"\n\n- ${introQuote.author}${introQuote.year ? `, ${introQuote.year}` : ''}` : ''}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
