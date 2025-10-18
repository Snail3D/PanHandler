import React from 'react';
import { Svg, Circle, Path, Line, Rect, Polygon, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Coin Icon - Clean circular coin with notches
export const CoinIcon: React.FC<IconProps> = ({ size = 24, color = '#FF9500' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer ring */}
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Inner circle */}
    <Circle cx="12" cy="12" r="7.5" stroke={color} strokeWidth="1.2" fill="none" />
    
    {/* Center dot */}
    <Circle cx="12" cy="12" r="2" fill={color} />
    
    {/* Notches around edge */}
    <Line x1="12" y1="1" x2="12" y2="3.5" stroke={color} strokeWidth="1.2" />
    <Line x1="12" y1="20.5" x2="12" y2="23" stroke={color} strokeWidth="1.2" />
    <Line x1="1" y1="12" x2="3.5" y2="12" stroke={color} strokeWidth="1.2" />
    <Line x1="20.5" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1.2" />
  </Svg>
);

// Drone Icon - Top-down view of quadcopter
export const DroneIcon: React.FC<IconProps> = ({ size = 24, color = '#00C7BE' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Center body */}
    <Circle cx="12" cy="12" r="2.5" fill={color} />
    
    {/* Arms */}
    <Line x1="12" y1="12" x2="5" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="12" y1="12" x2="19" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="12" y1="12" x2="5" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="12" y1="12" x2="19" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Propellers (circles at ends) */}
    <Circle cx="5" cy="5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="19" cy="5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="5" cy="19" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="19" cy="19" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Propeller blades (small lines) */}
    <Line x1="3.5" y1="5" x2="6.5" y2="5" stroke={color} strokeWidth="1" />
    <Line x1="17.5" y1="5" x2="20.5" y2="5" stroke={color} strokeWidth="1" />
    <Line x1="3.5" y1="19" x2="6.5" y2="19" stroke={color} strokeWidth="1" />
    <Line x1="17.5" y1="19" x2="20.5" y2="19" stroke={color} strokeWidth="1" />
  </Svg>
);

// Map Icon - Folded map with lines
export const MapIcon: React.FC<IconProps> = ({ size = 24, color = '#007AFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Map sections */}
    <Path
      d="M3 6L8 4L16 7L21 5V18L16 20L8 17L3 19V6Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Fold lines */}
    <Line x1="8" y1="4" x2="8" y2="17" stroke={color} strokeWidth="1.5" />
    <Line x1="16" y1="7" x2="16" y2="20" stroke={color} strokeWidth="1.5" />
    
    {/* Map details (small lines) */}
    <Line x1="5" y1="9" x2="6.5" y2="9" stroke={color} strokeWidth="1" opacity="0.6" />
    <Line x1="10" y1="11" x2="14" y2="11" stroke={color} strokeWidth="1" opacity="0.6" />
    <Line x1="17.5" y1="13" x2="19" y2="13" stroke={color} strokeWidth="1" opacity="0.6" />
  </Svg>
);

// Blueprint Icon - Technical drawing with ruler
export const BlueprintIcon: React.FC<IconProps> = ({ size = 24, color = '#5856D6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Paper outline */}
    <Rect x="3" y="3" width="18" height="18" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Blueprint grid */}
    <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="0.8" opacity="0.3" />
    <Line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth="0.8" opacity="0.3" />
    <Line x1="9" y1="3" x2="9" y2="21" stroke={color} strokeWidth="0.8" opacity="0.3" />
    <Line x1="15" y1="3" x2="15" y2="21" stroke={color} strokeWidth="0.8" opacity="0.3" />
    
    {/* Technical drawing (house shape) */}
    <Path
      d="M8 12L12 8L16 12V17H8V12Z"
      stroke={color}
      strokeWidth="1.2"
      fill="none"
    />
    
    {/* Measurement line */}
    <Line x1="7" y1="19.5" x2="17" y2="19.5" stroke={color} strokeWidth="1.2" />
    <Line x1="7" y1="18.5" x2="7" y2="20.5" stroke={color} strokeWidth="1.2" />
    <Line x1="17" y1="18.5" x2="17" y2="20.5" stroke={color} strokeWidth="1.2" />
  </Svg>
);

// Ruler Icon - Measurement ruler with scale marks
export const RulerIcon: React.FC<IconProps> = ({ size = 24, color = '#34C759' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Ruler body */}
    <Rect 
      x="3" 
      y="9" 
      width="18" 
      height="6" 
      rx="1" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
    />
    
    {/* Scale marks - long */}
    <Line x1="6" y1="12" x2="6" y2="15" stroke={color} strokeWidth="1.2" />
    <Line x1="12" y1="12" x2="12" y2="15" stroke={color} strokeWidth="1.2" />
    <Line x1="18" y1="12" x2="18" y2="15" stroke={color} strokeWidth="1.2" />
    
    {/* Scale marks - short */}
    <Line x1="9" y1="13" x2="9" y2="15" stroke={color} strokeWidth="1" />
    <Line x1="15" y1="13" x2="15" y2="15" stroke={color} strokeWidth="1" />
    
    {/* Distance indicators (arrows) */}
    <Circle cx="4.5" cy="12" r="1" fill={color} />
    <Circle cx="19.5" cy="12" r="1" fill={color} />
  </Svg>
);

// Scale Bar Icon - Simple scale bar for blueprints
export const ScaleBarIcon: React.FC<IconProps> = ({ size = 24, color = '#5856D6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Main bar */}
    <Rect 
      x="3" 
      y="10" 
      width="18" 
      height="4" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
    />
    
    {/* Alternating sections (like a scale bar) */}
    <Rect x="3" y="10" width="3" height="4" fill={color} opacity="0.6" />
    <Rect x="9" y="10" width="3" height="4" fill={color} opacity="0.6" />
    <Rect x="15" y="10" width="3" height="4" fill={color} opacity="0.6" />
    
    {/* End markers */}
    <Line x1="3" y1="8" x2="3" y2="16" stroke={color} strokeWidth="1.5" />
    <Line x1="21" y1="8" x2="21" y2="16" stroke={color} strokeWidth="1.5" />
    
    {/* Label lines */}
    <Path d="M3 7 L12 4 L21 7" stroke={color} strokeWidth="1" fill="none" />
  </Svg>
);

export default {
  CoinIcon,
  DroneIcon,
  MapIcon,
  BlueprintIcon,
  RulerIcon,
  ScaleBarIcon,
};
