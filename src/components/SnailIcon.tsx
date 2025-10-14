import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SnailIconProps {
  size?: number;
  color?: string;
}

export default function SnailIcon({ size = 18, color = '#1C1C1E' }: SnailIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Outer shell spiral */}
      <Path
        d="M 50 10 
           C 70 10, 85 25, 85 45
           C 85 65, 70 80, 50 80
           C 30 80, 15 65, 15 45
           C 15 25, 30 10, 50 10 Z"
        fill={color}
      />
      
      {/* Middle spiral ring (white) */}
      <Path
        d="M 50 25
           C 62 25, 70 33, 70 45
           C 70 57, 62 65, 50 65
           C 38 65, 30 57, 30 45
           C 30 33, 38 25, 50 25 Z"
        fill="white"
      />
      
      {/* Inner spiral core */}
      <Path
        d="M 50 35
           C 56 35, 60 39, 60 45
           C 60 51, 56 55, 50 55
           C 44 55, 40 51, 40 45
           C 40 39, 44 35, 50 35 Z"
        fill={color}
      />
      
      {/* Snail body/tail */}
      <Path
        d="M 20 55
           Q 10 60, 8 70
           Q 7 75, 12 78
           Q 20 80, 25 75
           L 30 70
           Q 25 65, 20 55 Z"
        fill={color}
      />
    </Svg>
  );
}
