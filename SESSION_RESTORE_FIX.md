# Session Restore Fix for Blueprint/Known Scale Mode

## Issue
**User Report**: "When you reload it, I'm not coming back into my current working map."

### The Problem:
When reloading the app with a blueprint/known scale photo in progress, the app was returning to camera mode instead of restoring the measurement screen with the photo and measurements.

### Root Cause:
The session restore logic required **ALL THREE** conditions to be true:
```typescript
if (currentImageUri && calibration && coinCircle) {
  setMode('measurement'); // Restore session
}
```

This worked fine for **coin calibration** (which has a `coinCircle`), but failed for:
- ❌ Blueprint/Known Scale mode (no `coinCircle`)
- ❌ Map/Verbal Scale mode (no `coinCircle`)

Result: App reloaded to camera screen, losing your work-in-progress.

---

## The Solution

### Changed Condition to Support All Calibration Types

**File**: `src/screens/MeasurementScreen.tsx` (Line ~916)

**Before**:
```typescript
if (currentImageUri && calibration && coinCircle) {
  __DEV__ && console.log('📦 Restoring previous session');
  setMode('measurement');
  // ...restore zoom
}
```

**After**:
```typescript
// Restore if we have an image AND calibration (any type: coin, blueprint, or verbal/map)
if (currentImageUri && calibration) {
  __DEV__ && console.log('📦 Restoring previous session');
  setMode('measurement');
  // ...restore zoom
}
```

### Why This Works:

The `calibration` object exists for ALL calibration types:
- **Coin calibration**: `calibration.calibrationType === 'coin'` + `coinCircle` exists
- **Blueprint calibration**: `calibration.calibrationType === 'blueprint'` + `calibration.blueprintScale` exists
- **Verbal/Map calibration**: `calibration.calibrationType === 'verbal'` + `calibration.verbalScale` exists

By removing the `coinCircle` requirement, we now restore sessions for all three calibration types.

---

## What Gets Restored

When you reload the app, if you had work in progress, it restores:

✅ **Photo** - `currentImageUri`
✅ **Calibration** - Coin, blueprint, or verbal/map scale
✅ **Measurements** - All distance, angle, area, freehand measurements
✅ **Zoom/Pan state** - Returns to your last view position
✅ **Mode** - Switches from camera to measurement screen
✅ **Unit system** - Your preferred units
✅ **Completed measurements** - All your work

---

## How It Works

### On App Start:
1. **Zustand persist middleware** loads state from AsyncStorage
2. **`currentImageUri`** and **`calibration`** are loaded
3. **useEffect on mount** (line 915) checks if both exist
4. **If yes**: Switch to measurement mode + restore zoom
5. **If no**: Stay in camera mode (new session)

### Persisted State (from measurementStore.ts):
```typescript
partialize: (state) => ({ 
  // ... other settings ...
  currentImageUri: state.currentImageUri,
  calibration: state.calibration,
  coinCircle: state.coinCircle,
  measurements: state.measurements,
  completedMeasurements: state.completedMeasurements,
  savedZoomState: state.savedZoomState,
  // ... etc ...
}),
```

---

## Testing

### Test Case 1: Coin Calibration ✅
1. Take photo, calibrate with coin, make measurements
2. Close/reload app
3. **Expected**: Returns to measurement screen with photo
4. **Actual**: ✅ Works (was already working)

### Test Case 2: Blueprint/Known Scale ✅
1. Take photo, select "Known Scale", place pins, enter distance
2. Make measurements
3. Close/reload app
4. **Expected**: Returns to measurement screen with photo
5. **Actual**: ✅ NOW WORKS (was broken!)

### Test Case 3: Map/Verbal Scale ✅
1. Take photo, select map mode, enter verbal scale
2. Make measurements
3. Close/reload app
4. **Expected**: Returns to measurement screen with photo
5. **Actual**: ✅ NOW WORKS (was broken!)

### Test Case 4: No Photo (Camera Mode) ✅
1. Open app fresh, no previous session
2. **Expected**: Shows camera screen
3. **Actual**: ✅ Works (condition fails, stays in camera)

---

## User Experience Impact

### Before (Broken):
- ✅ Coin calibration: Restored on reload
- ❌ Blueprint calibration: Lost on reload → returned to camera
- ❌ Map calibration: Lost on reload → returned to camera
- User frustration: "Where's my work?"

### After (Fixed):
- ✅ Coin calibration: Restored on reload
- ✅ Blueprint calibration: Restored on reload
- ✅ Map calibration: Restored on reload
- Happy user: Work is always there when you return!

---

## Why Was This Broken?

The original logic assumed **only coin calibration** existed. When blueprint and verbal/map scale features were added later, the session restore condition wasn't updated to handle them.

The `coinCircle` only exists for coin calibration, so the condition `currentImageUri && calibration && coinCircle` would always fail for the other two calibration types.

---

## Files Modified
- `src/screens/MeasurementScreen.tsx`
  - Line ~916: Removed `&& coinCircle` from restore condition
  - Now checks only `currentImageUri && calibration`

---

## Status
✅ Session restore now works for ALL calibration types
✅ Blueprint/Known Scale workflow fully functional
✅ Map/Verbal Scale workflow fully functional
✅ Ready for v2.5.1
