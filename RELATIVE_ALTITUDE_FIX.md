# DJI Relative Altitude Fix - v2.0.6

## Problem Solved

**GPS altitude is absolute (above sea level), not relative (above ground level)**

### Previous Issue:
- User's DJI Neo photo showed measurements 28x too large
- GPS altitude: 1410.939m (El Paso's elevation!)
- Actual drone height: ~50m above ground
- GSD calculated: 145.82 cm/px (WRONG)
- Should be: ~5 cm/px

## Solution Implemented

### Added XMP Metadata Extraction
DJI drones store **RelativeAltitude** (height above ground) in XMP metadata tags with the prefix `drone-dji:`.

### Key Changes:

1. **Updated `DroneMetadata` interface** (`droneEXIF.ts`)
   - Added `relativeAltitude?: number` (AGL - Above Ground Level)
   - Added `absoluteAltitude?: number` (ASL - Above Sea Level)

2. **Enhanced `extractDJIXMP()` function**
   - Now extracts `drone-dji:RelativeAltitude` 
   - Now extracts `drone-dji:AbsoluteAltitude`
   - Still extracts gimbal angles (pitch, yaw, roll)

3. **Added XMP parsing to `extractDroneMetadata()`**
   - Reads JPEG file as UTF-8 text
   - Searches for `<x:xmpmeta>` XML packet
   - Regex extracts DJI-specific tags:
     - `<drone-dji:RelativeAltitude>XX.X</drone-dji:RelativeAltitude>`
     - `<drone-dji:AbsoluteAltitude>XX.X</drone-dji:AbsoluteAltitude>`
     - Gimbal angles

4. **Updated GSD calculation logic**
   - **PRIORITY 1:** Use `relativeAltitude` (AGL) if available ✅
   - **FALLBACK:** Use GPS altitude (ASL) if no relative altitude
   - Logs which altitude source is used

### Debug Output
The detection alert now shows:
```
GIMBAL DETECTED

Pitch: -90.0°
Yaw: 123.4°
Roll: 0.0°
3-axis gimbal

ALTITUDE DATA:
✅ Relative: 54.3m AGL
Absolute: 1465.2m ASL
GPS: 1410.9m ASL

Auto-calibrating from drone altitude!
```

## Expected Result

For the user's DJI Neo photo (if RelativeAltitude is ~50m):
```
Before: GSD = 145.82 cm/px (using 1410m GPS altitude)
After:  GSD = 5.17 cm/px (using 50m relative altitude)
```

This gives **accurate measurements** for overhead drone photos!

## Supported Drones

According to ExifTool documentation, `RelativeAltitude` is available on:
- ✅ DJI Neo (user's drone!)
- ✅ DJI Mavic 3 / 3 Pro / Pro 3
- ✅ DJI Mini 4 Pro
- ✅ DJI Air 3 / Air 3S
- ✅ DJI Avata 2
- ✅ DJI Matrice 30
- ✅ DJI Matrice 4E

Older drones may only have AbsoluteAltitude or GPS altitude.

## Fallback Strategy

If `RelativeAltitude` is not available:
1. Use GPS altitude (less accurate in mountains/valleys)
2. Consider adding manual altitude entry in future update
3. User can always use Map Scale calibration (two-point method)

## Testing

To test with the user's DJI Neo photo:
1. Import the drone photo
2. Check the debug alert for altitude data
3. Verify GSD is ~5 cm/px (not 145 cm/px)
4. Measure a known object to confirm accuracy

## Files Modified

- `/src/utils/droneEXIF.ts` - Added XMP extraction and relative altitude support
- Updated interfaces and calculation logic
- Enhanced debug output

---

**Status:** ✅ READY FOR TESTING
**Version:** 2.0.6
**Date:** October 18, 2025
