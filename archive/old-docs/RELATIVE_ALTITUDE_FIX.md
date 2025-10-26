# DJI Relative Altitude Fix - Debugging Session

## Problem Identified

**GPS altitude is absolute (above sea level), not relative (above ground level)**

### Current Issue:
- User's DJI Neo photo shows measurements 28x too large
- GPS altitude: 1410.939m (El Paso's elevation!)
- Actual drone height: ~50m above ground
- GSD calculated: 145.82 cm/px (WRONG)
- Should be: ~5 cm/px

### Root Cause:
Using GPS altitude (ASL - above sea level) instead of relative altitude (AGL - above ground level) for GSD calculation.

---

## Attempted Solutions (In Progress)

### ✅ Solution 1: Extract XMP Metadata from JPEG
**Goal:** DJI drones store `RelativeAltitude` (height above ground) in XMP metadata tags with prefix `drone-dji:`.

**Implementation:**
1. **Updated `DroneMetadata` interface** (`droneEXIF.ts`)
   - Added `relativeAltitude?: number` (AGL - Above Ground Level)
   - Added `absoluteAltitude?: number` (ASL - Above Sea Level)

2. **Enhanced `extractDJIXMP()` function**
   - Now extracts `drone-dji:RelativeAltitude` 
   - Now extracts `drone-dji:AbsoluteAltitude`
   - Extracts gimbal angles (pitch, yaw, roll)

3. **XMP Extraction Attempts:**

   **Attempt 1 (FAILED):** UTF-8 text reading
   ```typescript
   // Read file as UTF-8 and search for XMP
   const textData = await FileSystem.readAsStringAsync(imageUri, { encoding: UTF8 });
   const xmpStart = textData.indexOf('<x:xmpmeta');
   ```
   - **Issue:** UTF-8 encoding corrupts binary JPEG data on iOS
   - **Result:** XMP not found

   **Attempt 2 (FAILED):** Base64 + atob decoding
   ```typescript
   // Read as base64, decode to binary string
   const base64Data = await FileSystem.readAsStringAsync(imageUri, { encoding: Base64 });
   const binaryString = atob(base64Data);
   ```
   - **Issue:** Still not finding XMP data in iOS sandbox files
   - **Result:** RelativeAltitude NOT found in XMP

   **Attempt 3 (IN PROGRESS):** MediaLibrary localUri
   ```typescript
   // Get original file URI from iOS photo library
   if (imageUri.startsWith('ph://')) {
     const assetInfo = await MediaLibrary.getAssetInfoAsync(imageUri);
     fileUriToRead = assetInfo.localUri; // Use original file, not copy
   }
   ```
   - **Theory:** ImagePicker creates a copy that strips XMP metadata
   - **Solution:** Access original file directly via MediaLibrary
   - **Status:** ⏳ TESTING NOW

4. **Enhanced Tag Detection:**
   - Searches for multiple altitude tag variations:
     - `drone-dji:RelativeAltitude`
     - `drone-dji:FlightAltitude`
     - `drone-dji:Height`
   - Logs ALL found drone-dji tags for debugging
   - Shows alternative XMP markers if XMP packet not found

5. **Updated GSD calculation logic** (lines 659-680)
   ```typescript
   if (relativeAltitude !== undefined && relativeAltitude > 0) {
     altitudeToUse = relativeAltitude; // ✅ Use relative altitude (accurate!)
   } else {
     altitudeToUse = gps.altitude; // ⚠️ Fallback to GPS (inaccurate)
   }
   ```


---

## Debug Output

Enhanced debug alerts show comprehensive detection info:

**Alert 1: DRONE DETECTION DEBUG**
```
📏 ALTITUDE DATA (KEY INFO):
RelativeAltitude: NOT FOUND ❌  ← Currently failing
AbsoluteAltitude: NOT FOUND     ← Also not found
GPS Altitude: 1410.9m ASL       ← Fallback (inaccurate)

📐 Gimbal:
HasGimbal: false                ← XMP extraction failing
```

**Alert 2: CALIBRATION MATH**
```
GSD: 145.8209 cm/px
Altitude used: 1410.9m (GPS ASL) ⚠️
❌ RelativeAltitude NOT found in XMP!
Using GPS altitude (inaccurate!)
```

---

## DJI Neo Metadata Research

According to ExifTool documentation:
- **DJI Neo HAS:** `AbsoluteAltitude` in XMP
- **DJI Neo MISSING:** `RelativeAltitude` tag (not listed in Neo's protocol!)
- **Other drones with RelativeAltitude:** Mavic 3, Mini 4 Pro, Air 3, Avata 2, Matrice 30/4E

**Important Discovery:** DJI Neo (`dvtm_dji_neo.proto`) only has:
- `dvtm_dji_neo_3-4-4-2: AbsoluteAltitude` ✅
- NO `RelativeAltitude` tag listed ❌

This suggests the DJI Neo might not store RelativeAltitude at all, only AbsoluteAltitude!

---

## Possible Root Causes

1. **iOS strips XMP metadata** when importing from photo library
   - ImagePicker creates a sanitized copy
   - XMP data removed for privacy/file size
   
2. **DJI Neo doesn't store RelativeAltitude**
   - Newer/budget model may have limited metadata
   - Only stores AbsoluteAltitude, not relative
   
3. **File reading method incorrect**
   - UTF-8 encoding corrupts binary JPEG data
   - Base64 → binary conversion issues
   - Need to access original file, not copy

---

## Alternative Solutions (If XMP Extraction Fails)

### Option A: Manual Altitude Entry (REJECTED by user)
- Prompt user to enter altitude when importing drone photo
- Fast, accurate, works for all drones
- User wants fully automatic solution

### Option B: Calculate Relative Altitude from GPS + Barometric Pressure
- Some EXIF data includes barometric altitude
- Could subtract GPS altitude from barometric reading
- Requires pressure sensor data (may not be available)

### Option C: Ground Elevation Database Lookup
- Use GPS coordinates to query ground elevation API
- Subtract from GPS altitude to get relative altitude
- Requires external API (USGS, Google Elevation API, etc.)
- Adds network dependency

### Option D: Use AbsoluteAltitude + GPS to calculate relative
- If we can extract AbsoluteAltitude from XMP
- Compare with GPS altitude to derive relative altitude
- Math: RelativeAlt ≈ AbsoluteAlt - GPSAlt (if both reference same datum)

---

## Next Steps

1. **Test MediaLibrary approach** (current attempt)
   - Import DJI Neo photo
   - Check if XMP extraction works with original file URI
   - Look for any altitude data in XMP

2. **If XMP still fails:**
   - Implement Option D (AbsoluteAltitude math)
   - Or Option C (ground elevation API)
   - Or reconsider manual entry with smart defaults

3. **Check actual DJI Neo EXIF data:**
   - Export raw EXIF from user's photo using desktop tool
   - Confirm what tags are actually present
   - May reveal alternative altitude tags

---

## Files Modified

- `/src/utils/droneEXIF.ts` - XMP extraction logic (lines 298-380)
- `/src/screens/MeasurementScreen.tsx` - Debug alerts (lines 1290-1356)
- Updated interfaces and calculation logic
- Enhanced debug output with altitude source tracking

---

## Expected Result (When Working)

For the user's DJI Neo photo at ~50m altitude:
```
Before: GSD = 145.82 cm/px (using 1410m GPS altitude) ❌
After:  GSD = 5.17 cm/px (using 50m relative altitude) ✅
```

This would give **accurate measurements** for overhead drone photos!

---

**Status:** 🔧 DEBUGGING IN PROGRESS
**Version:** 2.0.6+
**Date:** October 18, 2025
**Last Updated:** Current session

**Current Blocker:** XMP metadata extraction failing - RelativeAltitude not found
**Testing Now:** MediaLibrary original file URI approach
