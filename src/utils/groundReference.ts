/**
 * Ground Reference - Get phone's current altitude to calculate drone's relative height
 * 
 * BRILLIANT solution:
 * - Drone photo has GPS altitude (absolute, above sea level)
 * - Phone's current GPS altitude = ground reference (user's current location)
 * - Subtract: drone altitude - phone altitude = drone height above ground!
 * 
 * Works 100% offline, no internet, no XMP extraction needed!
 */

import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Get the phone's current GPS altitude with proper permission handling
 */
export async function getPhoneAltitude(): Promise<{
  altitude: number;
  accuracy: number | null;
  latitude: number;
  longitude: number;
} | null> {
  try {
    console.log('📍 Getting phone GPS altitude for ground reference...');
    
    // Check if location services are enabled
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      Alert.alert(
        '📍 Location Services Disabled',
        'Please enable Location Services in your phone settings to use automatic drone calibration.\n\nWould you like to open Settings?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return null;
    }
    
    // Check current permission status
    const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
    
    if (currentStatus === 'denied') {
      Alert.alert(
        '📍 Location Permission Required',
        'This app needs location access to automatically calibrate drone photos.\n\nPlease enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return null;
    }
    
    // Request permission if needed
    if (currentStatus !== 'granted') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '❌ Permission Denied',
          'Automatic calibration disabled. You can manually enter the drone altitude instead.'
        );
        return null;
      }
    }
    
    // Get current position
    console.log('📡 Getting GPS location...');
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    const altitude = location.coords.altitude;
    const accuracy = location.coords.altitudeAccuracy;
    
    if (altitude === null || altitude === undefined) {
      Alert.alert(
        '⚠️ No Altitude Data',
        'Your phone GPS does not provide altitude information. Please use manual altitude entry instead.'
      );
      return null;
    }
    
    console.log(`✅ Phone altitude: ${altitude.toFixed(1)}m ASL`);
    
    return {
      altitude,
      accuracy,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    
  } catch (error) {
    console.error('❌ Error getting phone altitude:', error);
    Alert.alert(
      '⚠️ Location Error',
      'Could not get phone location. Please check that Location Services are enabled.'
    );
    return null;
  }
}

/**
 * Calculate drone's relative altitude (height above ground)
 */
export function calculateDroneRelativeAltitude(
  droneGPSAltitude: number,
  phoneAltitude: number
): {
  relativeAltitude: number;
  notes: string;
} {
  const relativeAlt = droneGPSAltitude - phoneAltitude;
  
  let notes = '';
  if (relativeAlt < 5) {
    notes = 'Warning: Drone very close to ground. May be inaccurate.';
  } else if (relativeAlt > 500) {
    notes = 'Warning: Very high altitude. Verify drone was flying at this location.';
  } else {
    notes = 'Calculated from phone current location. Assumes phone is near ground level where drone was flying.';
  }
  
  console.log(`📐 Relative altitude: ${relativeAlt.toFixed(1)}m AGL`);
  
  return {
    relativeAltitude: relativeAlt,
    notes,
  };
}

/**
 * Calculate GPS distance in meters
 */
export function calculateGPSDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Validate ground reference based on GPS distance
 */
export function validateGroundReference(
  droneLatitude: number,
  droneLongitude: number,
  phoneLatitude: number,
  phoneLongitude: number
): {
  decision: 'auto' | 'prompt' | 'skip';
  distance: number;
  message: string;
} {
  const distance = calculateGPSDistance(
    droneLatitude,
    droneLongitude,
    phoneLatitude,
    phoneLongitude
  );
  
  if (distance < 100) {
    return {
      decision: 'auto',
      distance,
      message: `Phone is ${distance.toFixed(0)}m from drone photo location - auto-calibrating!`,
    };
  }
  
  if (distance < 500) {
    return {
      decision: 'prompt',
      distance,
      message: `Phone is ${distance.toFixed(0)}m from drone photo location. Are you at the property where this drone photo was taken?`,
    };
  }
  
  return {
    decision: 'skip',
    distance,
    message: `Phone is ${(distance / 1000).toFixed(1)}km from drone photo location. Using Map Scale calibration instead.`,
  };
}
