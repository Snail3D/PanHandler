import React, { useState, useEffect } from 'react';
import { Text, TextStyle } from 'react-native';

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds per character
  style?: TextStyle;
  onComplete?: () => void;
}

export default function TypewriterText({ 
  text, 
  speed = 30, 
  style,
  onComplete 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return <Text style={style}>{displayedText}</Text>;
}
