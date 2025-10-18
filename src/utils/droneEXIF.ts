import * as MediaLibrary from 'expo-media-library';

/**
 * Drone specifications for auto-calibration
 */
export interface DroneSpec {
  make: string;
  model: string;
  displayName: string;
  sensor: {
    width: number;  // mm
    height: number; // mm
  };
  focalLength: number; // mm
  resolution: {
    width: number;  // pixels
    height: number; // pixels
  };
  notes?: string;
}

/**
 * Extracted drone metadata from photo
 */
export interface DroneMetadata {
  isDrone: boolean;
  isOverhead: boolean; // Camera pointing down
  make?: string;
  model?: string;
  displayName?: string;
  
  // GPS data
  gps?: {
    latitude: number;
    longitude: number;
    altitude: number; // meters above sea level
    altitudeRef?: number; // 0 = above sea level, 1 = below
  };
  
  // Camera orientation (from DJI XMP)
  gimbal?: {
    pitch: number; // -90 = straight down, 0 = horizon
    yaw: number;   // 0-360 compass heading
    roll: number;  // camera tilt
  };
  
  // Drone specs
  specs?: DroneSpec;
  
  // Calculated values
  groundSampleDistance?: number; // cm per pixel
  groundCoverage?: {
    width: number;  // meters
    height: number; // meters
  };
  
  // Detection confidence
  confidence: 'high' | 'medium' | 'low' | 'none';
  detectionMethod: 'database' | 'estimated' | 'manual_required';
}

/**
 * Database of popular drones with sensor specs
 */
export const DRONE_DATABASE: Record<string, DroneSpec> = {
  // DJI Neo (User's drone!)
  "DJI/FC3582": {
    make: "DJI",
    model: "FC3582",
    displayName: "DJI Neo",
    sensor: { width: 6.17, height: 4.55 },
    focalLength: 1.48,
    resolution: { width: 4000, height: 3000 },
    notes: "Ultralight 135g drone, 1/2\" sensor"
  },
  
  // DJI Mini Series
  "DJI/Mini 4 Pro": {
    make: "DJI",
    model: "Mini 4 Pro",
    displayName: "DJI Mini 4 Pro",
    sensor: { width: 9.7, height: 7.3 },
    focalLength: 6.7,
    resolution: { width: 4000, height: 3000 },
  },
  "DJI/Mini 3 Pro": {
    make: "DJI",
    model: "Mini 3 Pro",
    displayName: "DJI Mini 3 Pro",
    sensor: { width: 9.7, height: 7.3 },
    focalLength: 6.7,
    resolution: { width: 4000, height: 3000 },
  },
  "DJI/Mini 2": {
    make: "DJI",
    model: "Mini 2",
    displayName: "DJI Mini 2",
    sensor: { width: 6.3, height: 4.7 },
    focalLength: 4.49,
    resolution: { width: 4000, height: 3000 },
  },
  
  // DJI Mavic Series
  "DJI/L2D-20c": {
    make: "DJI",
    model: "L2D-20c",
    displayName: "DJI Mavic 3 Pro",
    sensor: { width: 17.3, height: 13 },
    focalLength: 12.29,
    resolution: { width: 5280, height: 3956 },
    notes: "4/3\" CMOS, Hasselblad camera"
  },
  "DJI/Mavic 3": {
    make: "DJI",
    model: "Mavic 3",
    displayName: "DJI Mavic 3",
    sensor: { width: 17.3, height: 13 },
    focalLength: 12.29,
    resolution: { width: 5280, height: 3956 },
  },
  "DJI/Mavic Air 2S": {
    make: "DJI",
    model: "Mavic Air 2S",
    displayName: "DJI Mavic Air 2S",
    sensor: { width: 13.2, height: 8.8 },
    focalLength: 8.38,
    resolution: { width: 5472, height: 3648 },
    notes: "1\" CMOS sensor"
  },
  "DJI/Mavic Air 2": {
    make: "DJI",
    model: "Mavic Air 2",
    displayName: "DJI Mavic Air 2",
    sensor: { width: 6.3, height: 4.7 },
    focalLength: 4.49,
    resolution: { width: 4000, height: 3000 },
  },
  "DJI/Mavic 2 Pro": {
    make: "DJI",
    model: "Mavic 2 Pro",
    displayName: "DJI Mavic 2 Pro",
    sensor: { width: 13.2, height: 8.8 },
    focalLength: 10.26,
    resolution: { width: 5472, height: 3648 },
    notes: "First consumer 1\" sensor drone"
  },
  
  // DJI Phantom Series
  "DJI/Phantom 4 Pro": {
    make: "DJI",
    model: "Phantom 4 Pro",
    displayName: "DJI Phantom 4 Pro",
    sensor: { width: 13.2, height: 8.8 },
    focalLength: 8.8,
    resolution: { width: 5472, height: 3648 },
  },
  "DJI/FC6310": {
    make: "DJI",
    model: "FC6310",
    displayName: "DJI Phantom 4 Pro V2.0",
    sensor: { width: 13.2, height: 8.8 },
    focalLength: 8.8,
    resolution: { width: 5472, height: 3648 },
  },
  "DJI/Phantom 4 RTK": {
    make: "DJI",
    model: "Phantom 4 RTK",
    displayName: "DJI Phantom 4 RTK",
    sensor: { width: 13.2, height: 8.8 },
    focalLength: 8.8,
    resolution: { width: 5472, height: 3648 },
    notes: "RTK GPS - centimeter accuracy"
  },
};

/**
 * Parse GPS coordinates from EXIF
 */
function parseGPSCoordinate(
  coord: string | number,
  ref: string
): number | null {
  if (typeof coord === 'number') return coord;
  if (!coord) return null;
  
  // Handle DMS format: "37,30,0"
  if (typeof coord === 'string' && coord.includes(',')) {
    const [degrees, minutes, seconds] = coord.split(',').map(parseFloat);
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (ref === 'S' || ref === 'W') decimal *= -1;
    return decimal;
  }
  
  return null;
}

/**
 * Extract DJI XMP metadata (gimbal angles, etc.)
 */
function extractDJIXMP(exif: any): DroneMetadata['gimbal'] | undefined {
  try {
    // DJI stores XMP data with "drone-dji:" prefix
    const pitch = exif['drone-dji:GimbalPitchDegree'] || exif['GimbalPitchDegree'];
    const yaw = exif['drone-dji:GimbalYawDegree'] || exif['GimbalYawDegree'];
    const roll = exif['drone-dji:GimbalRollDegree'] || exif['GimbalRollDegree'];
    
    if (pitch !== undefined) {
      return {
        pitch: parseFloat(pitch),
        yaw: parseFloat(yaw || 0),
        roll: parseFloat(roll || 0),
      };
    }
  } catch (error) {
    console.log('Could not extract DJI XMP data:', error);
  }
  
  return undefined;
}

/**
 * Calculate ground sample distance and coverage
 */
function calculateGroundMetrics(
  altitude: number,
  specs: DroneSpec
): { gsd: number; coverage: { width: number; height: number } } {
  // Ground Sample Distance (cm per pixel)
  const gsdWidth = (altitude * specs.sensor.width) / (specs.focalLength * specs.resolution.width);
  const gsdHeight = (altitude * specs.sensor.height) / (specs.focalLength * specs.resolution.height);
  
  // Use average GSD
  const gsd = ((gsdWidth + gsdHeight) / 2) * 100; // Convert to cm
  
  // Total ground coverage (meters)
  const coverageWidth = (gsdWidth * specs.resolution.width);
  const coverageHeight = (gsdHeight * specs.resolution.height);
  
  return {
    gsd,
    coverage: {
      width: coverageWidth,
      height: coverageHeight,
    },
  };
}

/**
 * Main extraction function - analyzes photo and returns drone metadata
 */
export async function extractDroneMetadata(imageUri: string, providedExif?: any): Promise<DroneMetadata> {
  try {
    let exif: any = providedExif || null;
    let imageWidth = 0;
    let imageHeight = 0;
    
    // If EXIF not provided, try to get it from MediaLibrary
    if (!exif) {
      try {
        // Check if this is an asset library URI (photo already in camera roll)
        if (imageUri.startsWith('ph://') || imageUri.startsWith('assets-library://')) {
          const asset = await MediaLibrary.getAssetInfoAsync(imageUri);
          if (asset && asset.exif) {
            exif = asset.exif;
            imageWidth = asset.width;
            imageHeight = asset.height;
          }
        }
        // Note: For file:// URIs from camera, EXIF may not be available
        // User should import photos from camera roll for drone detection
      } catch (e) {
        console.log('Could not read EXIF from MediaLibrary');
      }
    }
    
    if (!exif || Object.keys(exif).length === 0) {
      // No EXIF data available - return not a drone
      console.log('No EXIF data found - not a drone photo');
      return {
        isDrone: false,
        isOverhead: false,
        confidence: 'none',
        detectionMethod: 'manual_required',
      };
    }
    
    // Extract basic info
    const make = exif['Make']?.trim();
    const model = exif['Model']?.trim();
    
    // Extract GPS
    let gps: DroneMetadata['gps'] | undefined;
    if (exif['GPSLatitude'] && exif['GPSLongitude']) {
      const lat = parseGPSCoordinate(exif['GPSLatitude'], exif['GPSLatitudeRef'] || 'N');
      const lon = parseGPSCoordinate(exif['GPSLongitude'], exif['GPSLongitudeRef'] || 'E');
      const alt = parseFloat(exif['GPSAltitude'] || 0);
      
      if (lat !== null && lon !== null) {
        gps = {
          latitude: lat,
          longitude: lon,
          altitude: alt,
          altitudeRef: exif['GPSAltitudeRef'] || 0,
        };
      }
    }
    
    // Check if it's a drone (has GPS and altitude > 10m)
    const isDrone = !!gps && gps.altitude > 10;
    
    if (!isDrone) {
      return {
        isDrone: false,
        isOverhead: false,
        confidence: 'none',
        detectionMethod: 'manual_required',
      };
    }
    
    // Extract DJI gimbal data
    const gimbal = extractDJIXMP(exif);
    
    // Check if camera is pointing down (overhead/nadir)
    const isOverhead = gimbal ? gimbal.pitch < -70 : true; // Assume overhead if no gimbal data
    
    // Try to find drone in database
    const dbKey = `${make}/${model}`;
    let specs = DRONE_DATABASE[dbKey];
    let detectionMethod: DroneMetadata['detectionMethod'] = 'database';
    let confidence: DroneMetadata['confidence'] = 'high';
    
    // If not in database, try to estimate from focal length
    if (!specs && exif['FocalLength'] && exif['FocalLengthIn35mmFilm']) {
      const focalLength = parseFloat(exif['FocalLength']);
      const focalLength35mm = parseFloat(exif['FocalLengthIn35mmFilm']);
      const cropFactor = focalLength35mm / focalLength;
      
      // Estimate sensor size from crop factor
      const sensorWidth = 36 / cropFactor; // Full frame = 36mm
      const sensorHeight = 24 / cropFactor;
      
      specs = {
        make: make || 'Unknown',
        model: model || 'Unknown',
        displayName: `${make} ${model}`,
        sensor: { width: sensorWidth, height: sensorHeight },
        focalLength,
        resolution: {
          width: exif['ImageWidth'] || imageWidth || 4000,
          height: exif['ImageHeight'] || imageHeight || 3000,
        },
        notes: 'Estimated from crop factor',
      };
      
      detectionMethod = 'estimated';
      confidence = 'medium';
    }
    
    // Calculate ground metrics if we have specs
    let groundSampleDistance: number | undefined;
    let groundCoverage: DroneMetadata['groundCoverage'] | undefined;
    
    if (specs && gps && isOverhead) {
      const metrics = calculateGroundMetrics(gps.altitude, specs);
      groundSampleDistance = metrics.gsd;
      groundCoverage = metrics.coverage;
    }
    
    return {
      isDrone: true,
      isOverhead,
      make,
      model,
      displayName: specs?.displayName || `${make} ${model}`,
      gps,
      gimbal,
      specs,
      groundSampleDistance,
      groundCoverage,
      confidence: specs ? confidence : 'low',
      detectionMethod: specs ? detectionMethod : 'manual_required',
    };
    
  } catch (error) {
    console.error('Error extracting drone metadata:', error);
    return {
      isDrone: false,
      isOverhead: false,
      confidence: 'none',
      detectionMethod: 'manual_required',
    };
  }
}

/**
 * Convert pixel coordinates to GPS coordinates (for overhead photos only)
 */
export function pixelToGPS(
  pixelX: number,
  pixelY: number,
  droneData: DroneMetadata
): { latitude: number; longitude: number } | null {
  if (!droneData.isOverhead || !droneData.gps || !droneData.specs || !droneData.groundSampleDistance) {
    return null;
  }
  
  const { gps, specs, groundSampleDistance } = droneData;
  
  // Image center
  const centerX = specs.resolution.width / 2;
  const centerY = specs.resolution.height / 2;
  
  // Offset from center (in pixels)
  const deltaX = pixelX - centerX;
  const deltaY = pixelY - centerY;
  
  // Convert to meters using GSD
  const metersEast = deltaX * (groundSampleDistance / 100); // GSD is in cm
  const metersSouth = deltaY * (groundSampleDistance / 100);
  
  // Convert meters to degrees
  // At equator: 1 degree latitude ≈ 111,320 meters
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = 111320 * Math.cos((gps.latitude * Math.PI) / 180);
  
  const deltaLat = -metersSouth / metersPerDegreeLat; // Negative because Y increases downward
  const deltaLon = metersEast / metersPerDegreeLon;
  
  return {
    latitude: gps.latitude + deltaLat,
    longitude: gps.longitude + deltaLon,
  };
}

/**
 * Format GPS coordinates for display
 */
export function formatGPSCoordinate(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lon).toFixed(6)}° ${lonDir}`;
}
