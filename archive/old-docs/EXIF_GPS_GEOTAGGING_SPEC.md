# EXIF GPS Geotagging - Advanced Features Specification

## Overview
This document explores advanced GPS/EXIF features for PanHandler, particularly for drone/aerial photography workflows. This goes beyond simple magnetic declination to enable **precise geolocation** of measurements.

---

## Your Moonshot Idea: Click-to-Geolocate 🚁

### The Vision
**User workflow:**
1. Import drone/aerial photo with GPS metadata
2. Make measurements on the photo
3. Click any point on the photo
4. App shows: "This point is at: 47.6062° N, 122.3321° W"

**Use cases:**
- Land surveying
- Construction site planning  
- Agriculture/crop monitoring
- Search & rescue operations
- Real estate/property analysis
- Archaeological site mapping

### How This Would Work

#### Step 1: Extract GPS Data from Photo EXIF
Drone photos contain rich GPS metadata:

```typescript
// Example EXIF data from DJI Mavic drone photo
{
  // Camera GPS position (where drone was)
  GPSLatitude: 47.6062,      // Degrees North
  GPSLongitude: -122.3321,   // Degrees West
  GPSAltitude: 120.5,        // Meters above sea level
  
  // Camera orientation (DJI-specific)
  GimbalRollDegree: 0.2,     // Camera tilt left/right
  GimbalYawDegree: 45.0,     // Camera pan direction
  GimbalPitchDegree: -90.0,  // Camera angle (0 = horizon, -90 = straight down)
  
  // Flight data (DJI-specific)
  FlightRollDegree: 2.1,     // Drone tilt
  FlightYawDegree: 45.0,     // Drone heading
  FlightPitchDegree: -5.0,   // Drone pitch
  
  // Camera specs
  FocalLength: 24,           // mm
  FocalLengthIn35mmFilm: 52, // 35mm equivalent
  
  // Image dimensions
  ImageWidth: 4000,
  ImageHeight: 3000,
  
  // Extras
  RelativeAltitude: 120.5,   // Height above takeoff point
  AbsoluteAltitude: 350.2,   // Height above sea level
}
```

#### Step 2: Calculate Ground Coverage (Footprint)

**For nadir shots (camera pointing straight down):**
```typescript
// Simple orthographic projection
function calculateGroundFootprint(exif: DroneEXIF) {
  const altitude = exif.RelativeAltitude; // meters
  const focalLength = exif.FocalLength; // mm
  const sensorWidth = 13.2; // mm (sensor size, varies by camera)
  const sensorHeight = 8.8; // mm
  
  // Ground Sample Distance (GSD) - meters per pixel
  const gsdWidth = (altitude * sensorWidth) / (focalLength * exif.ImageWidth);
  const gsdHeight = (altitude * sensorHeight) / (focalLength * exif.ImageHeight);
  
  // Total ground coverage
  const groundWidth = gsdWidth * exif.ImageWidth; // meters
  const groundHeight = gsdHeight * exif.ImageHeight; // meters
  
  return { groundWidth, groundHeight, gsdWidth, gsdHeight };
}
```

**Example:**
- Altitude: 100m
- Focal length: 24mm
- Sensor: 13.2mm × 8.8mm
- Image: 4000 × 3000 pixels

Result:
- Ground coverage: ~55m × 37m
- GSD: ~1.4 cm/pixel (very high resolution!)

#### Step 3: Map Pixel Coordinates to GPS Coordinates

**For straight-down (nadir) shots:**
```typescript
function pixelToGPS(
  pixelX: number, 
  pixelY: number, 
  exif: DroneEXIF,
  footprint: Footprint
): { lat: number, lon: number } {
  
  // Center pixel coordinates
  const centerX = exif.ImageWidth / 2;
  const centerY = exif.ImageHeight / 2;
  
  // Offset from center (in pixels)
  const deltaX = pixelX - centerX;
  const deltaY = pixelY - centerY;
  
  // Convert to meters using GSD
  const metersEast = deltaX * footprint.gsdWidth;
  const metersSouth = deltaY * footprint.gsdHeight; // Note: Y increases downward
  
  // Convert meters to degrees (approximate at this latitude)
  const metersPerDegreeLat = 111320; // ~constant
  const metersPerDegreeLon = 111320 * Math.cos(exif.GPSLatitude * Math.PI / 180);
  
  const deltaLat = -metersSouth / metersPerDegreeLat; // Negative because Y increases south
  const deltaLon = metersEast / metersPerDegreeLon;
  
  // Final GPS coordinates
  return {
    lat: exif.GPSLatitude + deltaLat,
    lon: exif.GPSLongitude + deltaLon
  };
}
```

**Example:**
```
User clicks at pixel (2000, 1500) - center of 4000×3000 image
Drone GPS: 47.6062° N, 122.3321° W
Result: 47.6062° N, 122.3321° W (same as drone, it's the center!)

User clicks at pixel (3000, 1500) - right edge, middle height
Offset: +1000 pixels east = +14 meters east
Result: 47.6062° N, 122.3320° W (slightly more west)
```

#### Step 4: Handle Tilted Camera (Advanced)

**Challenge:** If camera isn't straight down, we need perspective correction.

**Solution:** Use gimbal angles to calculate projection:
```typescript
function pixelToGPSWithPerspective(
  pixelX: number,
  pixelY: number,
  exif: DroneEXIF
): { lat: number, lon: number } {
  
  const pitch = exif.GimbalPitchDegree; // -90 = straight down, 0 = horizon
  const yaw = exif.GimbalYawDegree;     // 0-360, drone heading
  const roll = exif.GimbalRollDegree;   // Usually near 0
  
  // 1. Convert pixel to camera ray direction
  const ray = pixelToCameraRay(pixelX, pixelY, exif);
  
  // 2. Apply gimbal rotation (pitch, yaw, roll)
  const worldRay = rotateRay(ray, pitch, yaw, roll);
  
  // 3. Intersect ray with ground plane (altitude = 0 or terrain height)
  const groundPoint = rayGroundIntersection(worldRay, exif.GPSAltitude);
  
  // 4. Convert ground point to GPS
  return metersToGPS(groundPoint, exif.GPSLatitude, exif.GPSLongitude);
}
```

This is **photogrammetry** - the science of making measurements from photographs!

---

## What Drone Photos Contain (Extra Information)

### DJI Drones (Mavic, Phantom, Inspire series)
**Standard EXIF:**
- GPS coordinates (lat/lon/altitude)
- Timestamp
- Camera settings (ISO, shutter, aperture)

**DJI XMP Tags (Extended Metadata):**
```xml
<drone-dji:GimbalRollDegree>0.20</drone-dji:GimbalRollDegree>
<drone-dji:GimbalYawDegree>45.00</drone-dji:GimbalYawDegree>
<drone-dji:GimbalPitchDegree>-90.00</drone-dji:GimbalPitchDegree>
<drone-dji:FlightRollDegree>2.10</drone-dji:FlightRollDegree>
<drone-dji:FlightYawDegree>45.00</drone-dji:FlightYawDegree>
<drone-dji:FlightPitchDegree>-5.00</drone-dji:FlightPitchDegree>
<drone-dji:FlightXSpeed>5.20</drone-dji:FlightXSpeed>
<drone-dji:FlightYSpeed>-3.10</drone-dji:FlightYSpeed>
<drone-dji:FlightZSpeed>0.50</drone-dji:FlightZSpeed>
<drone-dji:CamReverse>0</drone-dji:CamReverse>
<drone-dji:GimbalReverse>0</drone-dji:GimbalReverse>
<drone-dji:SelfData>...</drone-dji:SelfData>
<drone-dji:RtkFlag>50</drone-dji:RtkFlag> <!-- RTK GPS accuracy flag -->
<drone-dji:RtkStdLon>0.020</drone-dji:RtkStdLon> <!-- GPS precision in meters -->
<drone-dji:RtkStdLat>0.015</drone-dji:RtkStdLat>
<drone-dji:RtkStdHgt>0.030</drone-dji:RtkStdHgt>
```

### Parrot Drones (Anafi, Bebop)
Similar data structure, different namespace:
```xml
<Camera:Roll>0.5</Camera:Roll>
<Camera:Pitch>-85.0</Camera:Pitch>
<Camera:Yaw>180.0</Camera:Yaw>
<Drone:Speed>3.5</Drone:Speed>
```

### Professional Survey Drones (DJI Phantom RTK, Matrice)
**RTK GPS (Real-Time Kinematic):**
- Centimeter-level accuracy (±2cm)
- `RtkFlag`: 50 = RTK fixed (best), 49 = RTK float (good), 16 = no RTK (standard GPS)
- Horizontal/vertical precision values

**Additional metadata:**
- Ground control points (GCPs)
- PPK (Post-Processed Kinematic) data
- IMU (Inertial Measurement Unit) data

### Smartphone Photos (iPhone, Android)
**Standard GPS:**
- Lat/lon/altitude
- Speed (if moving)
- Direction (compass heading)
- Timestamp with timezone

**iOS-specific (if available):**
- True heading vs magnetic heading
- Horizontal/vertical accuracy (meters)
- Gyroscope data (device orientation)

---

## Implementation Plan

### Phase 1: EXIF GPS Extraction ✅
**Goal:** Extract GPS from photo for automatic declination

```typescript
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

async function extractPhotoGPS(imageUri: string) {
  try {
    // Read EXIF data
    const asset = await MediaLibrary.getAssetInfoAsync(imageUri);
    const exif = asset.exif;
    
    if (!exif || !exif.GPSLatitude) {
      return null; // No GPS data
    }
    
    // Parse GPS coordinates
    const lat = parseGPSCoordinate(exif.GPSLatitude, exif.GPSLatitudeRef);
    const lon = parseGPSCoordinate(exif.GPSLongitude, exif.GPSLongitudeRef);
    const alt = exif.GPSAltitude || 0;
    
    return { lat, lon, alt };
  } catch (error) {
    console.error('Failed to extract GPS:', error);
    return null;
  }
}
```

### Phase 2: Magnetic Declination from GPS ✅
**Goal:** Calculate declination from photo's GPS

```typescript
import { calculateMagneticDeclination } from './magneticDeclinationCalculator';

async function getDeclinationFromPhoto(imageUri: string) {
  const gps = await extractPhotoGPS(imageUri);
  
  if (!gps) {
    throw new Error('Photo has no GPS data');
  }
  
  const declination = calculateMagneticDeclination(gps.lat, gps.lon);
  return { declination, location: gps };
}
```

### Phase 3: Ground Coverage Calculation 🚧
**Goal:** Calculate how much ground area the photo covers

```typescript
async function analyzeAerialPhoto(imageUri: string) {
  const exif = await extractFullEXIF(imageUri);
  
  // Check if it's a drone photo
  if (!exif.GPSAltitude || exif.GPSAltitude < 10) {
    return null; // Not aerial
  }
  
  // Calculate ground footprint
  const footprint = calculateGroundFootprint(exif);
  
  return {
    gps: { lat: exif.GPSLatitude, lon: exif.GPSLongitude },
    altitude: exif.GPSAltitude,
    groundWidth: footprint.groundWidth,
    groundHeight: footprint.groundHeight,
    gsd: footprint.gsdWidth, // Ground Sample Distance (cm/pixel)
  };
}
```

### Phase 4: Click-to-Geolocate 🌟
**Goal:** Click any point on photo, get GPS coordinates

```typescript
// In DimensionOverlay or MeasurementScreen
const handlePointGeolocate = async (pixelX: number, pixelY: number) => {
  const aerialData = await analyzeAerialPhoto(currentImageUri);
  
  if (!aerialData) {
    showAlert('Not Aerial Photo', 'This feature requires a drone/aerial photo with GPS data.');
    return;
  }
  
  const gps = pixelToGPS(pixelX, pixelY, exif, aerialData);
  
  // Show GPS coordinates
  showAlert(
    'Point Location',
    `Latitude: ${gps.lat.toFixed(6)}°\n` +
    `Longitude: ${gps.lon.toFixed(6)}°\n` +
    `(Tap to copy)`,
    'info'
  );
  
  // Optional: Copy to clipboard
  Clipboard.setString(`${gps.lat}, ${gps.lon}`);
};
```

**UI Integration:**
- Add "Show GPS" button when measuring
- Tap any measurement point → shows GPS coordinates
- Export measurements with GPS → CSV/KML format

---

## Advanced Features (Future)

### 1. KML/KMZ Export
Export measurements as Google Earth overlays:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>Distance Measurement</name>
    <description>285.4 meters</description>
    <LineString>
      <coordinates>
        -122.3321,47.6062,0
        -122.3318,47.6060,0
      </coordinates>
    </LineString>
  </Placemark>
</kml>
```

### 2. Orthomosaic Support
For professional surveying, stitch multiple drone photos into single georeferenced map:
- Support GeoTIFF files
- World file (.tfw, .jgw) parsing
- Coordinate system conversion (UTM, WGS84, etc.)

### 3. Terrain-Aware Measurements
Account for ground elevation changes:
- Import elevation data (DEM/DTM)
- Calculate true 3D distances
- Slope/grade analysis

### 4. Multi-Photo Photogrammetry
Use multiple overlapping photos to create 3D model:
- Structure from Motion (SfM)
- Point cloud generation
- Volume calculations (stockpiles, excavations)

### 5. Real-Time Drone Integration
Connect directly to drone while flying:
- Live video stream
- Mark points in real-time
- Waypoint navigation based on measurements

---

## Privacy Considerations

### EXIF GPS is Privacy-Friendly ✅
**Why it's safe:**
- Data already in photo (user chose to import it)
- No live location tracking
- No permissions needed
- User has full control

**Best practice:**
- Clearly show when GPS data is detected: "📍 Photo contains GPS data"
- Option to strip GPS before sharing: "Remove location data"
- Privacy notice: "GPS coordinates are extracted from your photo's metadata and never uploaded"

### Device GPS Still Needs Consent
When user chooses "Use Device GPS" instead of photo GPS:
- Session-only permission
- Clear consent dialog
- Never store coordinates

---

## Technical Challenges

### Challenge 1: EXIF Parsing
**Problem:** React Native doesn't have built-in EXIF parser

**Solution:**
```bash
# Option 1: Use expo-media-library (limited)
expo-media-library # Basic GPS only

# Option 2: Use native module
react-native-exif # More complete, includes XMP

# Option 3: JavaScript library
exif-js # Pure JS, works but slower
```

**Recommendation:** Start with `expo-media-library`, add native module later for drone XMP data.

### Challenge 2: Coordinate Systems
**Problem:** GPS uses WGS84, maps use various projections

**Solution:**
```typescript
// For simple cases (small areas), flat Earth approximation works
// For professional use, need proper coordinate transformation library
import proj4 from 'proj4'; // If we add it

// Convert WGS84 to UTM
const utm = proj4('EPSG:4326', 'EPSG:32610', [lon, lat]);
```

### Challenge 3: Gimbal Calibration
**Problem:** DJI gimbal angles might have offsets

**Solution:**
- Let user calibrate: "Is this point correct? Adjust if needed"
- Store calibration offset per drone model
- Community calibration database

### Challenge 4: Accuracy Limitations
**GPS accuracy varies:**
- Consumer drones: ±3-5 meters
- RTK drones: ±0.02 meters
- Smartphone: ±5-15 meters

**UI should show:**
- Estimated accuracy: "±5m"
- Disclaimer: "For approximate measurements only"
- Pro tip: "Use RTK drone for survey-grade accuracy"

---

## User Experience

### Workflow 1: Simple Declination
```
1. Import photo
2. App detects GPS: "📍 Photo location: Seattle, WA"
3. Tap "Use Photo GPS" → Declination auto-set
4. Done! ✓
```

### Workflow 2: Aerial Measurement with Geolocation
```
1. Import drone photo
2. App detects aerial: "🚁 Drone photo detected (120m altitude)"
3. Make measurements as usual
4. Tap measurement → Shows:
   "Distance: 45.2 meters
    Start: 47.6062° N, 122.3321° W
    End: 47.6060° N, 122.3318° W"
5. Export → Includes GPS coordinates in CSV/KML
```

### Workflow 3: Professional Surveying
```
1. Import RTK drone photo (±2cm accuracy)
2. App shows: "✓ RTK Fixed - Survey Grade"
3. Measure property boundaries
4. Export KML → Open in Google Earth Pro
5. Overlay shows exact property lines on map
```

---

## Implementation Priority

### Phase 1 (MVP): ✅ Easy Wins
- [x] Extract GPS from photo EXIF
- [x] Calculate declination from photo GPS
- [x] Three-option modal: Photo GPS / Device GPS / Manual

### Phase 2: 🚧 Geolocation Basics
- [ ] Detect aerial photos (altitude > 10m)
- [ ] Calculate ground footprint (nadir only)
- [ ] Pixel-to-GPS conversion (straight down shots)
- [ ] Show GPS coordinates on measurement tap

### Phase 3: 🌟 Advanced Aerial
- [ ] Parse DJI XMP metadata (gimbal angles)
- [ ] Perspective correction for tilted shots
- [ ] RTK accuracy display
- [ ] KML export with GPS coordinates

### Phase 4: 🚀 Professional Features
- [ ] Multi-photo support
- [ ] Coordinate system conversion
- [ ] Terrain-aware measurements
- [ ] GeoTIFF/orthomosaic support

---

## Summary

**Your moonshot idea is absolutely possible!** The technology exists:

**Easy (do now):**
- Extract GPS from photo → automatic declination ✓
- Calculate ground coverage for straight-down drone shots ✓
- Click any point → show approximate GPS coordinates ✓

**Moderate (later):**
- Handle tilted camera angles (photogrammetry math)
- Support DJI XMP metadata
- Export KML for Google Earth

**Advanced (future):**
- Multi-photo stitching
- 3D point clouds
- Terrain models
- Real-time drone connection

**The best part?** Even basic implementation (Phase 1-2) provides HUGE value:
- Land surveyors can geolocate property corners
- Construction managers can mark site features
- Farmers can locate irrigation issues
- Researchers can map sampling points

This transforms PanHandler from a measurement tool into a **geospatial analysis platform**! 🚁📍✨
