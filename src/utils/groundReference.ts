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

/**
 * Get the phone's current GPS altitude
 * This represents the ground reference altitude (where user is standing)
 * 
 * Note: This will be slightly higher than true ground if user is standing (5-6 feet)
 * but it's accurate enough for drone measurements (within 2m typically)
 */
export async function getPhoneAltitude(): Promise<{
  altitude: number;
  accuracy: number | null;
  latitude: number;
  longitude: number;
} | null> {
  try {
    console.log('📍 Getting phone GPS altitude for ground reference...');
    
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Location permission denied');
      return null;
    }
    
    // Get current position with high accuracy
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    const altitude = location.coords.altitude;
    const accuracy = location.coords.altitudeAccuracy;
    
    if (altitude === null || altitude === undefined) {
      console.log('❌ No altitude data available from phone GPS');
      return null;
    }
    
    console.log(`✅ Phone altitude: ${altitude.toFixed(1)}m ASL (accuracy: ±${accuracy?.toFixed(1)}m)`);
    console.log(`📍 Phone location: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
    
    return {
      altitude,
      accuracy,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    
  } catch (error) {
    console.error('❌ Error getting phone altitude:', error);
    return null;
  }
}

/**
 * Calculate drone's relative altitude (height above ground)
 * using phone's current altitude as ground reference
 */
export function calculateDroneRelativeAltitude(
  droneGPSAltitude: number,
  phoneAltitude: number
): {
  relativeAltitude: number;
  notes: string;
} {
  // Drone altitude - phone altitude = height above phone
  // Phone is typically 5-6 feet (1.5-2m) above ground when user is standing
  const relativeAlt = droneGPSAltitude - phoneAltitude;
  
  // Add note about accuracy
  let notes = '';
  if (relativeAlt < 5) {
    notes = 'Warning: Drone very close to ground. May be inaccurate.';
  } else if (relativeAlt > 500) {
    notes = 'Warning: Very high altitude. Verify drone was flying at this location.';
  } else {
    notes = 'Calculated from phone current location. Assumes phone is near ground level where drone was flying.';
  }
  
  console.log(`📐 Relative altitude calculation:
Drone GPS Altitude: ${droneGPSAltitude.toFixed(1)}m ASL
Phone Altitude: ${phoneAltitude.toFixed(1)}m ASL (ground reference)
Drone Height Above Ground: ${relativeAlt.toFixed(1)}m AGL

${notes}`);
  
  return {
    relativeAltitude: relativeAlt,
    notes,
  };
}

/**
 * Calculate distance between two GPS coordinates (in meters)
 * Used to verify phone is reasonably close to where drone photo was taken
 */
export function calculateGPSDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
}

/**
 * Validate if ground reference is reliable based on GPS DISTANCE
 * (Ignores time - user might still be at property hours later!)
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
  // Calculate distance between drone photo and phone
  const distance = calculateGPSDistance(
    droneLatitude,
    droneLongitude,
    phoneLatitude,
    phoneLongitude
  );
  
  // SMART DECISION TREE:
  
  // 1. Very close (< 100m) → AUTO-CALIBRATE silently ✅
  if (distance < 100) {
    return {
      decision: 'auto',
      distance,
      message: `Phone is ${distance.toFixed(0)}m from drone photo location - auto-calibrating!`,
    };
  }
  
  // 2. Medium distance (100m - 500m) → ASK USER to confirm
  if (distance < 500) {
    return {
      decision: 'prompt',
      distance,
      message: `Phone is ${distance.toFixed(0)}m from drone photo location. Are you at the property where this drone photo was taken?`,
    };
  }
  
  // 3. Far away (> 500m) → SKIP to Map Scale calibration
  return {
    decision: 'skip',
    distance,
    message: `Phone is ${(distance / 1000).toFixed(1)}km from drone photo location. Using Map Scale calibration instead.`,
  };
}
