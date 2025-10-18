/**
 * Ground Elevation API
 * 
 * Gets ground elevation at GPS coordinates to calculate relative altitude
 * Uses free USGS Elevation API (no API key required!)
 */

/**
 * Get ground elevation at GPS coordinates
 * Returns elevation in meters above sea level
 * 
 * Uses USGS Elevation Point Query Service
 * Free, no API key required, works globally
 */
export async function getGroundElevation(
  latitude: number,
  longitude: number
): Promise<number | null> {
  try {
    console.log(`🌍 Querying ground elevation for: ${latitude}, ${longitude}`);
    
    // USGS Elevation Point Query Service (free, no API key!)
    // Returns elevation in meters
    const url = `https://epqs.nationalmap.gov/v1/json?x=${longitude}&y=${latitude}&units=Meters&wkid=4326`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log('⚠️ USGS API request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Response format: { "value": 1234.56 } or { "value": -1000000 } for error
    const elevation = data?.value;
    
    if (elevation === undefined || elevation === null || elevation < -500) {
      console.log('⚠️ Invalid elevation data:', data);
      return null;
    }
    
    console.log(`✅ Ground elevation: ${elevation.toFixed(1)}m ASL`);
    return elevation;
    
  } catch (error) {
    console.error('❌ Ground elevation API error:', error);
    return null;
  }
}

/**
 * Calculate relative altitude (height above ground)
 * from GPS altitude and ground elevation
 */
export function calculateRelativeAltitude(
  gpsAltitude: number,
  groundElevation: number
): number {
  const relativeAlt = gpsAltitude - groundElevation;
  console.log(`📐 Relative altitude calculation:
GPS Altitude: ${gpsAltitude.toFixed(1)}m ASL
Ground Elevation: ${groundElevation.toFixed(1)}m ASL
Relative Altitude: ${relativeAlt.toFixed(1)}m AGL`);
  
  return relativeAlt;
}
