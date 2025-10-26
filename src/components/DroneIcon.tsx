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
        x="8"
        y="8"
        width="8"
        height="8"
        rx="2"
        fill={color}
      />

      {/* Arms connecting center to propellers */}
      {/* Top-left arm */}
      <Line x1="7" y1="4.5" x2="8.5" y2="8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Top-right arm */}
      <Line x1="17" y1="4.5" x2="15.5" y2="8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Bottom-left arm */}
      <Line x1="7" y1="19.5" x2="8.5" y2="15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Bottom-right arm */}
      <Line x1="17" y1="19.5" x2="15.5" y2="15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}
