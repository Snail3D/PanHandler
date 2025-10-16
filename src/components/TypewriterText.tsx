import React, { useState, useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds per character
  style?: TextStyle;
  onComplete?: () => void;
  enableHaptics?: boolean; // Enable haptic feedback while typing
}

export default function TypewriterText({ 
  text, 
  speed = 30, 
  style,
  onComplete,
  enableHaptics = false,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Subtle haptic every 3-4 characters (like ChatGPT typing)
        if (enableHaptics && currentIndex % 4 === 0) {
          Haptics.selectionAsync();
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, enableHaptics]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return <Text style={style}>{displayedText}</Text>;
}
