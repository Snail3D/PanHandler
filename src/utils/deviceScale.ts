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
 * Tablet: 1.3x (30% larger as requested)
 */
export const getDeviceScale = (): number => {
  return isTablet() ? 1.3 : 1.0;
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

// Export singleton values
export const IS_TABLET = isTablet();
export const DEVICE_SCALE = getDeviceScale();
