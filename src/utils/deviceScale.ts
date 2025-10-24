// Device detection and scaling utilities for tablet support
import * as Device from 'expo-device';
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Detect if device is a tablet
 * - iOS: iPad detection via Device.deviceType
 * - Android: Screen size heuristic (>= 7" diagonal, typically 600dp+ width)
 */
export const isTablet = (): boolean => {
  // iOS: Use Device.deviceType
  if (Platform.OS === 'ios') {
    return Device.deviceType === Device.DeviceType.TABLET;
  }

  // Android: Use screen dimensions heuristic
  // Tablets typically have width >= 600dp in portrait
  // Using 600 as threshold (7" tablets and above)
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  const isPortrait = aspectRatio > 1;
  const shortestSide = isPortrait ? SCREEN_WIDTH : SCREEN_HEIGHT;

  return shortestSide >= 600;
};

/**
 * Get scale factor for tablet devices
 * Phone: 1.0x
 * Tablet: 1.2x (20% larger for optimal tablet experience)
 */
export const getDeviceScale = (): number => {
  return isTablet() ? 1.2 : 1.0;
};

/**
 * Scale a font size based on device type
 */
export const scaleFontSize = (size: number): number => {
  return Math.round(size * getDeviceScale());
};

/**
 * Scale padding/margin based on device type
 */
export const scalePadding = (padding: number): number => {
  return Math.round(padding * getDeviceScale());
};

/**
 * Scale margin based on device type (alias for consistency)
 */
export const scaleMargin = (margin: number): number => {
  return Math.round(margin * getDeviceScale());
};

/**
 * Scale icon size based on device type
 */
export const scaleIconSize = (size: number): number => {
  return Math.round(size * getDeviceScale());
};

/**
 * Scale button dimensions based on device type
 */
export const scaleButtonSize = (size: number): number => {
  return Math.round(size * getDeviceScale());
};

/**
 * Scale any dimension based on device type (generic scaling)
 */
export const scaleSize = (size: number): number => {
  return Math.round(size * getDeviceScale());
};

/**
 * Scale border radius based on device type
 */
export const scaleBorderRadius = (radius: number): number => {
  return Math.round(radius * getDeviceScale());
};

/**
 * Scale gap (flex spacing) based on device type
 */
export const scaleGap = (gap: number): number => {
  return Math.round(gap * getDeviceScale());
};

/**
 * Scale hitSlop values for touch targets
 */
export const scaleHitSlop = (slop: number | { top?: number; bottom?: number; left?: number; right?: number }): any => {
  if (typeof slop === 'number') {
    const scaled = Math.round(slop * getDeviceScale());
    return { top: scaled, bottom: scaled, left: scaled, right: scaled };
  }
  return {
    top: slop.top ? Math.round(slop.top * getDeviceScale()) : 0,
    bottom: slop.bottom ? Math.round(slop.bottom * getDeviceScale()) : 0,
    left: slop.left ? Math.round(slop.left * getDeviceScale()) : 0,
    right: slop.right ? Math.round(slop.right * getDeviceScale()) : 0,
  };
};

// Export singleton values
export const IS_TABLET = isTablet();
export const DEVICE_SCALE = getDeviceScale();
