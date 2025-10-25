import React from 'react';
import Svg, { Circle, Rect, Line } from 'react-native-svg';

interface DroneIconProps {
  size?: number;
  color?: string;
}

export default function DroneIcon({ size = 24, color = 'white' }: DroneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top-left propeller */}
      <Circle cx="4.5" cy="4.5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Top-right propeller */}
      <Circle cx="19.5" cy="4.5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Bottom-left propeller */}
      <Circle cx="4.5" cy="19.5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Bottom-right propeller */}
      <Circle cx="19.5" cy="19.5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Center body (rounded rectangle) */}
      <Rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        fill={color}
      />

      {/* Arms connecting center to propellers */}
      {/* Top-left arm */}
      <Line x1="7" y1="4.5" x2="9.5" y2="9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Top-right arm */}
      <Line x1="17" y1="4.5" x2="14.5" y2="9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Bottom-left arm */}
      <Line x1="7" y1="19.5" x2="9.5" y2="14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Bottom-right arm */}
      <Line x1="17" y1="19.5" x2="14.5" y2="14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}
