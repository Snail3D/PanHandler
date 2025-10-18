import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import piexif from 'piexifjs';

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
  
  // DJI Neo (Alternative model code - user's actual drone)
  "DJI/FC8671": {
    make: "DJI",
    model: "FC8671",
    displayName: "DJI Neo",
    sensor: { width: 6.17, height: 4.55 },
    focalLength: 1.48,
    resolution: { width: 4000, height: 3000 },
    notes: "Ultralight 135g drone, 1/2\" sensor (alternative model code)"
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
    
    // If EXIF not provided, try to read it with piexifjs (most reliable method)
    if (!exif) {
      try {
        console.log('📸 Reading EXIF with piexifjs from:', imageUri);
        
        // Read image as base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        console.log('✅ File read successfully, length:', base64.length);
        
        // Add JPEG header if needed
        const jpegData = `data:image/jpeg;base64,${base64}`;
        
        // Extract EXIF using piexifjs
        const exifObj = piexif.load(jpegData);
        console.log('✅ EXIF loaded successfully');
        console.log('EXIF keys:', Object.keys(exifObj));
        
        // Convert piexifjs format to standard EXIF object
        exif = {};
        
        // Extract from "0th" IFD (main image data)
        if (exifObj['0th']) {
          const zeroth = exifObj['0th'];
          exif['Make'] = zeroth[piexif.ImageIFD.Make];
          exif['Model'] = zeroth[piexif.ImageIFD.Model];
          exif['ImageWidth'] = zeroth[piexif.ImageIFD.ImageWidth];
          exif['ImageHeight'] = zeroth[piexif.ImageIFD.ImageLength];
          imageWidth = exif['ImageWidth'] || 0;
          imageHeight = exif['ImageHeight'] || 0;
        }
        
        // Extract from "Exif" IFD (camera settings)
        if (exifObj['Exif']) {
          const exifIFD = exifObj['Exif'];
          exif['FocalLength'] = exifIFD[piexif.ExifIFD.FocalLength];
          exif['FocalLengthIn35mmFilm'] = exifIFD[piexif.ExifIFD.FocalLengthIn35mmFilm];
        }
        
        // Extract from "GPS" IFD (location data)
        if (exifObj['GPS']) {
          const gps = exifObj['GPS'];
          
          // piexifjs returns GPS data as raw values (may be rationals [numerator, denominator])
          const rawLat = gps[piexif.GPSIFD.GPSLatitude];
          const rawLon = gps[piexif.GPSIFD.GPSLongitude];
          const rawAlt = gps[piexif.GPSIFD.GPSAltitude];
          
          // Convert rational format to decimal
          // GPS coords are in format: [[degrees_num, degrees_den], [minutes_num, minutes_den], [seconds_num, seconds_den]]
          exif['GPSLatitude'] = rawLat;
          exif['GPSLatitudeRef'] = gps[piexif.GPSIFD.GPSLatitudeRef];
          exif['GPSLongitude'] = rawLon;
          exif['GPSLongitudeRef'] = gps[piexif.GPSIFD.GPSLongitudeRef];
          
          // Altitude is rational: [numerator, denominator]
          if (rawAlt && Array.isArray(rawAlt) && rawAlt.length === 2) {
            exif['GPSAltitude'] = rawAlt[0] / rawAlt[1]; // Convert to decimal
          } else {
            exif['GPSAltitude'] = rawAlt;
          }
          
          exif['GPSAltitudeRef'] = gps[piexif.GPSIFD.GPSAltitudeRef];
        }
        
        console.log('📊 Extracted EXIF:', {
          make: exif['Make'],
          model: exif['Model'],
          hasGPS: !!(exif['GPSLatitude'] && exif['GPSLongitude']),
          altitude: exif['GPSAltitude'],
        });
        
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.log('⚠️ piexifjs failed, trying MediaLibrary fallback:', e);
        
        // Fallback to MediaLibrary
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
        } catch (e2) {
          console.log('❌ MediaLibrary also failed');
        }
      }
    }
    
    if (!exif || Object.keys(exif).length === 0) {
      // No EXIF data available - return not a drone
      console.log('❌ No EXIF data found - not a drone photo');
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
    
    // Extract DJI gimbal data (need this for drone detection)
    const gimbal = extractDJIXMP(exif);
    
    // Check if it's a drone - use multiple indicators for reliability
    // GPS altitude alone isn't enough (ground level in mountains = high altitude)
    let isDrone = false;
    
    if (gps) {
      // Factor 1: Known drone manufacturer
      const knownDroneMakes = ['DJI', 'Autel', 'Parrot', 'Skydio', 'Yuneec', 'Holy Stone'];
      const isKnownDroneMake = knownDroneMakes.some(dm => make?.includes(dm));
      
      // Factor 2: Model code looks like drone (e.g., FC8671, EVO, Anafi)
      const droneModelPatterns = /^(FC\d+|EVO|Anafi|Mavic|Phantom|Mini|Air|Inspire)/i;
      const isDroneModel = model ? droneModelPatterns.test(model) : false;
      
      // Factor 3: Has gimbal data (DJI XMP)
      const hasGimbalData = !!gimbal;
      
      // Factor 4: Altitude (less reliable, but still useful)
      const hasSignificantAltitude = gps.altitude > 50; // 50m = ~164 feet
      
      // Decision logic:
      if (isKnownDroneMake || isDroneModel) {
        // Definitely a drone if manufacturer/model matches
        isDrone = true;
      } else if (hasGimbalData && hasSignificantAltitude) {
        // Has gimbal data + altitude = probably a drone
        isDrone = true;
      }
      // Note: Phone photos from ground level (even in mountains) won't be detected as drones
      // unless they have drone-specific indicators (manufacturer, model, gimbal)
    }
    
    if (!isDrone) {
      return {
        isDrone: false,
        isOverhead: false,
        confidence: 'none',
        detectionMethod: 'manual_required',
      };
    }
    
    if (!isDrone) {
      return {
        isDrone: false,
        isOverhead: false,
        confidence: 'none',
        detectionMethod: 'manual_required',
      };
    }
    
    // Check if camera is pointing down (overhead/nadir)
    // If gimbal data exists at all, treat as overhead and auto-calibrate!
    // Rationale: Only drones have gimbals. If there's gimbal data, it's a drone photo.
    // The user can always use Map Scale if they need more precision for extreme angles.
    const isOverhead = true; // Always true if we detected it as a drone
    
    // Debug: Show overhead detection
    if (isDrone && gimbal) {
      const axes = [];
      if (gimbal.pitch !== 0) axes.push(`Pitch: ${gimbal.pitch.toFixed(1)}°`);
      if (gimbal.yaw !== 0) axes.push(`Yaw: ${gimbal.yaw.toFixed(1)}°`);
      if (gimbal.roll !== 0) axes.push(`Roll: ${gimbal.roll.toFixed(1)}°`);
      
      alert(`GIMBAL DETECTED\n\n${axes.join('\n')}\n${axes.length}-axis gimbal\n\nAuto-calibrating from drone altitude!`);
    } else if (isDrone) {
      alert(`DRONE DETECTED (no gimbal data)\n\nAssuming overhead photo.\nAuto-calibrating from altitude!`);
    }
    
    // Try to find drone in database
    const dbKey = `${make}/${model}`;
    let specs = DRONE_DATABASE[dbKey];
    let detectionMethod: DroneMetadata['detectionMethod'] = 'database';
    let confidence: DroneMetadata['confidence'] = 'high';
    
    // If exact match not found, try intelligent estimation
    if (!specs) {
      // Strategy 1: Use focal length + 35mm equivalent (most reliable)
      if (exif['FocalLength'] && exif['FocalLengthIn35mmFilm']) {
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
          notes: 'Auto-detected from focal length (accurate)',
        };
        
        detectionMethod = 'estimated';
        confidence = 'high'; // Focal length estimation is quite accurate!
      }
      // Strategy 2: Use image dimensions + conservative assumptions
      else if (exif['ImageWidth'] && exif['ImageHeight']) {
        const imgWidth = exif['ImageWidth'] || imageWidth;
        const imgHeight = exif['ImageHeight'] || imageHeight;
        
        // Estimate based on image resolution
        // Most consumer drones: 12-48MP, 1/2.3" to 1" sensors
        const megapixels = (imgWidth * imgHeight) / 1000000;
        
        // Heuristics based on common drone specs:
        let estimatedSensorWidth: number;
        let estimatedFocalLength: number;
        
        if (megapixels >= 20) {
          // High-res (20+ MP) = larger sensor (1" or APS-C)
          estimatedSensorWidth = 13.2; // 1" sensor
          estimatedFocalLength = 8.8; // Common for 1" drones
        } else if (megapixels >= 12) {
          // Mid-res (12-20 MP) = medium sensor (1/2" to 1/2.3")
          estimatedSensorWidth = 6.17; // 1/2" sensor (DJI Mini/Neo)
          estimatedFocalLength = 4.5; // Common wide angle
        } else {
          // Low-res (<12 MP) = small sensor (1/2.3" or smaller)
          estimatedSensorWidth = 6.17; // Conservative 1/2.3"
          estimatedFocalLength = 4.5;
        }
        
        const estimatedSensorHeight = estimatedSensorWidth * (imgHeight / imgWidth);
        
        specs = {
          make: make || 'Unknown',
          model: model || 'Unknown',
          displayName: `${make || 'Unknown'} ${model || 'Drone'}`,
          sensor: { width: estimatedSensorWidth, height: estimatedSensorHeight },
          focalLength: estimatedFocalLength,
          resolution: { width: imgWidth, height: imgHeight },
          notes: `Auto-detected from ${megapixels.toFixed(1)}MP image (conservative estimate)`,
        };
        
        detectionMethod = 'estimated';
        confidence = 'medium';
      }
    }
    
    // If still not found, use ultra-conservative fallback (last resort)
    if (!specs) {
      specs = {
        make: make || 'Unknown',
        model: model || 'Unknown', 
        displayName: `${make || 'Unknown'} ${model || 'Drone'}`,
        sensor: { width: 6.17, height: 4.55 }, // Conservative 1/2" sensor (most common)
        focalLength: 4.5, // Conservative wide angle
        resolution: {
          width: exif['ImageWidth'] || imageWidth || 4000,
          height: exif['ImageHeight'] || imageHeight || 3000,
        },
        notes: 'Fallback conservative estimate - may be less accurate',
      };
      
      detectionMethod = 'estimated';
      confidence = 'low';
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
