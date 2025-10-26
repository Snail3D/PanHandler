# Map Mode & Magnetic Declination - Technical Specification

## Overview
Map Mode allows users to measure real-world distances on maps, blueprints, and technical drawings using verbal scale calibration (e.g., "1 inch = 10 miles"). This document covers:
1. **Magnetic Declination** - Adjusting for True North vs Magnetic North
2. **GPS Integration** - Optional automatic declination detection
3. **Privacy-First Design** - Session-only permissions with clear consent

---

## Part 1: Magnetic Declination Explained

### What is Magnetic Declination?

**Simple Definition:**
Magnetic Declination is the angle between True North (geographic North Pole) and Magnetic North (where a compass points).

**Why it matters:**
- Maps are oriented to **True North**
- Compasses point to **Magnetic North** (moves over time)
- The difference varies by location: 0° to 20°+ depending on where you are

**Example:**
- **Seattle, WA:** 15° East declination
- **New York, NY:** 13° West declination
- **Kansas City, MO:** 0° (True North = Magnetic North!)

### How Declination Affects Azimuth Mode

**Azimuth Mode** (in Map Mode) measures compass bearings between two points.

**Without Declination Correction:**
```
User measures azimuth on a USGS topo map
Map shows: "Mountain peak is 90° (due East)"
Compass bearing: 105° (includes declination error)
❌ Reading is off by 15°!
```

**With Declination Correction:**
```
User sets declination: +15° East
Map shows: "Mountain peak is 90° (due East)"
App measures: 105°
App displays: 105° - 15° = 90° ✓
✅ Accurate True North bearing!
```

### Current Implementation

**State:** `magneticDeclination` (number, default: 0)
- Stored in measurement store
- Persisted across sessions
- User can manually set in Settings

**Location:** Settings > Magnetic Declination
- Shows current value (e.g., "15° East" or "13° West")
- Tap to change (manual input)
- Defaults to 0° (no correction)

### Where Declination Gets Applied

**Current:** Not yet applied (state is ready)
**Future:** Applied in Azimuth mode calculations

**Implementation Plan:**
```typescript
// In DimensionOverlay.tsx - Azimuth calculation
const rawAzimuth = calculateAzimuthBetweenPoints(point1, point2);
const magneticDeclination = useStore((s) => s.magneticDeclination);
const correctedAzimuth = rawAzimuth - magneticDeclination;

// Display corrected azimuth to user
displayAzimuth(correctedAzimuth);
```

---

## Part 2: GPS-Based Auto-Declination

### The Goal
Automatically detect the user's magnetic declination based on their GPS location, so they don't have to look it up manually.

### Privacy-First Design

#### Core Principles:
1. **Session-only permission** - Never persist GPS permission state
2. **Explicit consent every time** - Ask permission for each session
3. **Zero tracking** - GPS coordinates NEVER leave the device
4. **Clear communication** - User knows exactly why we need location

#### Permission Flow:
```
User opens Settings > Magnetic Declination
  ↓
Sees current value: "0° (Manual)"
  ↓
Taps "Auto-Detect (GPS)"
  ↓
Alert appears:
  "Detect Magnetic Declination?"
  "PanHandler needs your location to calculate magnetic declination.
   Your location is NEVER stored or sent to our servers."
  [Allow Once] [Cancel]
  ↓
If Allow Once:
  - Request location permission (one-time)
  - Get coordinates
  - Calculate declination using NOAA formula
  - Update magneticDeclination state
  - Show success: "Set to 15.2° East for Seattle, WA"
  ↓
If Cancel:
  - User can manually enter value
  - Or use default (0°)
```

### Technical Implementation

#### 1. Location Permission (One-Time Only)
```typescript
import * as Location from 'expo-location';

const detectMagneticDeclination = async () => {
  try {
    // Request permission (one-time, not persisted)
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      showAlert('Permission Denied', 'Location access is required to auto-detect declination.');
      return;
    }
    
    // Get current position (one-time read)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Good enough for declination
    });
    
    const { latitude, longitude } = location.coords;
    
    // Calculate declination
    const declination = calculateMagneticDeclination(latitude, longitude);
    
    // Update state
    setMagneticDeclination(declination);
    
    // Show success
    showAlert('Auto-Detected', `Magnetic declination set to ${declination.toFixed(1)}°`);
    
  } catch (error) {
    showAlert('Error', 'Could not detect location. Please enter manually.');
  }
};
```

#### 2. Declination Calculation Formula

**Option A: World Magnetic Model (WMM) - Most Accurate**
The WMM is the official model used by NOAA, US military, and aviation.

```typescript
// Use WMM library (npm package: geomag-js or wmm-calculator)
import { WorldMagneticModel } from 'geomag-js';

function calculateMagneticDeclination(lat: number, lon: number): number {
  const wmm = new WorldMagneticModel();
  const result = wmm.calculate(lat, lon, 0, new Date()); // altitude = 0 (sea level)
  
  // Declination in degrees (positive = East, negative = West)
  return result.declination;
}
```

**Option B: Simplified Formula (Good Approximation)**
For quick estimates without external libraries:

```typescript
// Simplified magnetic declination estimation
// Based on IGRF (International Geomagnetic Reference Field)
function estimateMagneticDeclination(lat: number, lon: number): number {
  // North America approximation (2025 epoch)
  // This is a simplified linear model - not as accurate as WMM
  
  const baseDeclination = -10; // Base offset for North America
  const latitudeFactor = 0.15 * (lat - 40); // Adjust for latitude
  const longitudeFactor = 0.2 * (lon + 95); // Adjust for longitude
  
  const declination = baseDeclination + latitudeFactor + longitudeFactor;
  
  // Clamp to reasonable range
  return Math.max(-30, Math.min(30, declination));
}
```

**Recommendation:** Use WMM library for accuracy. Declination can vary significantly (15°+ difference in some regions).

#### 3. NOAA API Alternative (Internet Required)
If user has internet, we can query NOAA's web service:

```typescript
async function fetchDeclinationFromNOAA(lat: number, lon: number): Promise<number> {
  const url = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination`;
  const params = {
    lat1: lat,
    lon1: lon,
    key: 'zNEw7', // NOAA public key
    resultFormat: 'json',
  };
  
  const response = await fetch(url + '?' + new URLSearchParams(params));
  const data = await response.json();
  
  return data.result[0].declination; // In degrees
}
```

**Pros:** Most accurate, always up-to-date
**Cons:** Requires internet, slower (API call)

---

## Part 3: UI/UX Design

### Settings Screen (Help Modal)

#### Current Design:
```
Settings
├── Email Address
├── Default Measurement System
└── Magnetic Declination
    ├── Current: "0° (Manual)"
    └── [Tap to change]
```

#### Enhanced Design:
```
Settings
├── Email Address
├── Default Measurement System
└── Magnetic Declination
    ├── Current: "15.2° East"
    ├── [Enter Manually]
    └── [Auto-Detect (GPS)] ← NEW
```

### Modal for Manual Entry
```
┌─────────────────────────────────┐
│  Set Magnetic Declination       │
├─────────────────────────────────┤
│                                  │
│  Enter declination in degrees:   │
│                                  │
│  [  15.2  ] °                   │
│                                  │
│  Direction:                      │
│  ( ) East  (•) West             │
│                                  │
│  ℹ️  Find your declination at:  │
│  ngdc.noaa.gov                   │
│                                  │
│  [Cancel]  [Save]               │
└─────────────────────────────────┘
```

### Modal for GPS Detection
```
┌─────────────────────────────────┐
│  Detect Magnetic Declination?   │
├─────────────────────────────────┤
│                                  │
│  PanHandler needs your location  │
│  to calculate magnetic           │
│  declination for your area.      │
│                                  │
│  🔒 Your location is:            │
│  • Used ONLY for this session    │
│  • NEVER stored or saved         │
│  • NEVER sent to our servers     │
│                                  │
│  Location is used solely to      │
│  determine local magnetic field  │
│  declination for accurate        │
│  compass bearings.               │
│                                  │
│  [Cancel]  [Allow Once]         │
└─────────────────────────────────┘
```

---

## Part 4: Privacy & Security

### Updated Privacy Section in Help Modal

**Add to existing Privacy & Security section:**

```markdown
### Location Services (Optional)

**GPS for Declination Only**
- PanHandler can optionally use your location to auto-detect magnetic declination
- Location access is NEVER required - manual entry is always available
- Permission is requested fresh for each session (not saved)
- Your GPS coordinates NEVER leave your device
- No location data is stored, tracked, or transmitted

**How It Works:**
1. You tap "Auto-Detect" in Settings
2. App requests one-time location permission
3. GPS coordinates are used to calculate declination
4. Declination value is saved (NOT your location)
5. Next session: Permission is requested again

**Why Session-Only?**
We ask for permission every time so you always know when location is being used. 
This prevents any background tracking and gives you full control.
```

### Technical Privacy Implementation

#### 1. Never Persist Permission State
```typescript
// ❌ BAD: Don't store permission status
await AsyncStorage.setItem('hasLocationPermission', 'true');

// ✅ GOOD: Request fresh every time
await Location.requestForegroundPermissionsAsync();
```

#### 2. Clear User Communication
```typescript
const showGPSConsentDialog = () => {
  Alert.alert(
    'Detect Magnetic Declination?',
    'PanHandler needs your location to calculate magnetic declination.\n\n' +
    '🔒 Your location is:\n' +
    '• Used ONLY for this session\n' +
    '• NEVER stored or saved\n' +
    '• NEVER sent to our servers\n\n' +
    'Location is used solely to determine local magnetic field declination for accurate compass bearings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Allow Once', 
        onPress: detectMagneticDeclination 
      }
    ]
  );
};
```

#### 3. Only Store Declination Value
```typescript
// Store in measurementStore.ts
interface MeasurementStore {
  magneticDeclination: number; // ✓ Stored
  // GPS coordinates are NEVER stored
}
```

---

## Part 5: Implementation Roadmap

### Phase 1: Manual Entry (DONE ✓)
- [x] Add magneticDeclination state to store
- [x] Add Settings section to Help modal
- [x] Display current declination value
- [x] Persist value across sessions

### Phase 2: Manual Input Modal (TODO)
- [ ] Create DeclinationInputModal component
- [ ] Numeric input with +/- support
- [ ] East/West radio buttons
- [ ] Validation (-180° to +180°)
- [ ] Link to NOAA website for lookup

### Phase 3: GPS Auto-Detection (TODO)
- [ ] Add "Auto-Detect (GPS)" button to Settings
- [ ] Request location permission (one-time only)
- [ ] Implement WMM calculation
- [ ] Show consent dialog
- [ ] Display detected value with location name
- [ ] Update Privacy section in Help modal

### Phase 4: Apply to Azimuth Mode (TODO)
- [ ] Implement Azimuth mode in Map Mode
- [ ] Apply declination correction to calculations
- [ ] Display corrected bearings
- [ ] Show "True North" label when correction is applied

---

## Part 6: User Stories

### Story 1: Manual Entry
```
As a hiker using a USGS topo map,
I want to manually set my local magnetic declination,
So that azimuth readings match my compass.

Steps:
1. Open Help > Settings > Magnetic Declination
2. Tap "Enter Manually"
3. Enter "15.2" and select "East"
4. Save
5. Use Azimuth mode in Map Mode
6. Readings show True North bearings ✓
```

### Story 2: GPS Auto-Detection
```
As a land surveyor on-site,
I want the app to auto-detect my declination,
So I don't have to look it up online.

Steps:
1. Open Help > Settings > Magnetic Declination
2. Tap "Auto-Detect (GPS)"
3. Read consent dialog
4. Tap "Allow Once"
5. App shows: "Set to 12.8° West for Denver, CO"
6. Use Azimuth mode immediately ✓
```

### Story 3: Privacy-Conscious User
```
As a privacy-focused professional,
I want to know exactly when and why location is used,
So I can trust the app isn't tracking me.

Expectations:
1. Location is never required (manual entry always available) ✓
2. Permission dialog clearly states one-time use ✓
3. Privacy section explains GPS is never stored ✓
4. Permission is requested fresh each session ✓
5. No background location tracking ✓
```

---

## Part 7: Technical Specifications

### Dependencies
```json
{
  "dependencies": {
    "expo-location": "~17.0.1", // For GPS access
    "geomag-js": "^1.0.0"       // For WMM calculations (optional)
  }
}
```

### State Schema
```typescript
// measurementStore.ts
interface MeasurementStore {
  magneticDeclination: number; // Degrees (+ = East, - = West)
  // ... other state
}
```

### Component Structure
```
HelpModal
└── Settings Section
    └── Magnetic Declination Setting
        ├── Current Value Display
        ├── Manual Entry Button → DeclinationInputModal
        └── Auto-Detect Button → GPS Consent → Detection
```

### New Components Needed
1. **DeclinationInputModal.tsx**
   - Numeric input
   - East/West toggle
   - NOAA link
   - Save/Cancel buttons

2. **GPS Detection Logic** (in HelpModal.tsx)
   - Permission request
   - Location fetch
   - WMM calculation
   - Success/error handling

---

## Part 8: FAQ

### Why not use device compass directly?
Device compasses already include declination correction on modern phones. However:
- Users measuring from **printed maps** need to know the declination
- Maps from different years have different declination values
- Manual control allows for historical map analysis

### Why session-only permissions?
To build trust and prevent tracking concerns:
- User always knows when location is accessed
- Prevents background location tracking
- Follows iOS/Android privacy best practices
- Complies with app store guidelines

### What if GPS is unavailable?
Manual entry is always available:
- Indoor users
- Users without location services
- Users who prefer manual control
- All use cases still work ✓

### How accurate is the WMM model?
- Accuracy: ±0.5° for most locations
- Updated every 5 years by NOAA
- Used by military, aviation, and surveying
- More than sufficient for map measurements

### What about Southern Hemisphere?
- WMM works globally (all latitudes/longitudes)
- Declination can be East or West anywhere
- No special handling needed

---

## Part 9: Testing Checklist

### Manual Entry
- [ ] Open Settings > Magnetic Declination
- [ ] Enter positive value → Shows "X° East"
- [ ] Enter negative value → Shows "X° West"
- [ ] Enter zero → Shows "0° (No Correction)"
- [ ] Value persists across sessions
- [ ] Value displays in Azimuth mode

### GPS Auto-Detection
- [ ] Tap "Auto-Detect" → Consent dialog appears
- [ ] Tap "Cancel" → No permission requested
- [ ] Tap "Allow Once" → Location permission requested
- [ ] Permission granted → Declination calculated and displayed
- [ ] Permission denied → Error message shown
- [ ] Restart app → Permission NOT remembered (must ask again)
- [ ] GPS coordinates NOT stored anywhere
- [ ] Only declination value is saved

### Privacy
- [ ] Privacy section updated in Help modal
- [ ] Consent dialog clearly explains one-time use
- [ ] No background location access
- [ ] No location data in AsyncStorage
- [ ] No location data sent to servers

---

## Part 10: Future Enhancements

### 1. Declination History
Show historical declination for old maps:
```
Map is from: 1985
Declination then: 18.2° East
Declination now: 15.2° East
Difference: 3° change over 40 years
```

### 2. Grid Declination
Some maps show **Grid North** (UTM grid) vs True North:
- Add "Grid Declination" setting
- Combine magnetic + grid corrections

### 3. Declination Map Overlay
Visual representation:
- Show isogonic lines (lines of equal declination)
- Highlight user's location
- Educational tool

### 4. Smart Suggestions
```
App detects: "You're measuring a USGS topo map"
Suggestion: "This map was made in 1992. Would you like to use the historical declination value?"
```

---

## Summary

**Current Status:**
- ✅ State structure ready
- ✅ Settings UI implemented
- ✅ Manual value display working
- ⏳ Manual input modal (TODO)
- ⏳ GPS auto-detection (TODO)
- ⏳ Azimuth mode integration (TODO)

**Privacy-First Design:**
- Session-only permissions
- Clear consent dialogs
- Zero tracking
- Transparent privacy documentation

**Next Steps:**
1. Create DeclinationInputModal component
2. Add GPS auto-detect button
3. Implement WMM calculation
4. Update Privacy section
5. Test on real devices
6. Apply correction to Azimuth mode

**Key Insight:**
By making GPS optional and session-only, we build trust while still providing convenience. Users get the best of both worlds: automatic detection when they want it, full manual control when they need it, and complete transparency about what's happening with their location data.
