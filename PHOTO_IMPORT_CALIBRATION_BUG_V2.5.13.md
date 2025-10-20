# Photo Import Calibration Persistence Bug (v2.5.13)

## Issue Reported
"When I go to update a new photo, it's still remembering my old calibration. When I update a new photo, it should reset all the calibration information, so I need to input the calibration again."

## Root Cause
The calibration clearing logic was happening **AFTER** the mode switch to 'measurement', causing a race condition:

### Previous Flow (Buggy)
```javascript
1. User imports photo
2. Photo type selected → handlePhotoTypeSelection() called
3. Mode switches to 'measurement' IMMEDIATELY
4. Measurement screen renders with OLD calibration from Zustand
5. 300ms later → Calibration cleared and setImageUri() called
6. ❌ Too late! Screen already rendered with old calibration
```

### The Problematic Code
```javascript
// Photo imported
handlePhotoTypeSelection('blueprint'); // Mode switches NOW

// 300ms later... (too late!)
setTimeout(() => {
  setCoinCircle(null);
  setCalibration(null);
  setImageUri(asset.uri, false);
}, 300);
```

## Why This Happened
The code was trying to "defer AsyncStorage writes" for performance reasons by using a setTimeout. However, this caused the calibration clear to happen AFTER:
- Mode switched to 'measurement'
- MeasurementScreen component rendered
- DimensionOverlay read the OLD calibration from Zustand state

## Solution
**Clear calibration IMMEDIATELY** before any mode switches or UI updates:

### New Flow (Fixed)
```javascript
1. User imports photo
2. ✅ Clear calibration FIRST (setCoinCircle, setCalibration, etc.)
3. ✅ Set image URI IMMEDIATELY (also clears in Zustand)
4. Set local UI state (setCapturedPhotoUri)
5. Photo type selected → handlePhotoTypeSelection()
6. Mode switches to 'measurement'
7. ✅ Measurement screen renders with NO calibration (fresh start)
```

## Code Changes

### File: `src/screens/MeasurementScreen.tsx` (Lines ~1491-1540)

**Before:**
```typescript
if (!result.canceled && result.assets[0]) {
  const asset = result.assets[0];
  
  setCapturedPhotoUri(asset.uri); // Set local state
  await detectOrientation(asset.uri);
  
  // Route to appropriate mode
  if (isCameraPhoto) {
    handlePhotoTypeSelection('blueprint'); // Mode switches!
  } else {
    setShowPhotoTypeModal(true);
  }
  
  // Clear calibration 300ms later (TOO LATE!)
  setTimeout(() => {
    setCoinCircle(null);
    setCalibration(null);
    setImageUri(asset.uri, false);
  }, 300);
}
```

**After:**
```typescript
if (!result.canceled && result.assets[0]) {
  const asset = result.assets[0];
  
  // ⚠️ CRITICAL: Clear calibration IMMEDIATELY
  console.log('🧹 Clearing calibration for new imported photo');
  setCoinCircle(null);
  setCalibration(null);
  setCompletedMeasurements([]);
  setCurrentPoints([]);
  
  // Set image URI immediately (also clears in Zustand)
  setImageUri(asset.uri, false);
  
  // Set local state for immediate UI update
  setCapturedPhotoUri(asset.uri);
  await detectOrientation(asset.uri);
  
  // Route to appropriate mode (NOW safe - calibration already cleared)
  if (isCameraPhoto) {
    handlePhotoTypeSelection('blueprint');
  } else {
    setShowPhotoTypeModal(true);
  }
}
```

## Key Changes

1. **Removed setTimeout** - No more 300ms delay
2. **Cleared calibration FIRST** - Before any mode switches
3. **Called setImageUri immediately** - Zustand also clears calibration
4. **Proper order** - Clear → Set → Route → Render

## Testing

### Test Case 1: Import New Photo After Calibration
1. ✅ Take photo, calibrate with coin
2. ✅ Create measurements
3. ✅ Import new photo from library
4. ✅ Verify: NO calibration shown (fresh start)
5. ✅ User must recalibrate

### Test Case 2: Import Multiple Photos
1. ✅ Import photo A, calibrate with blueprint
2. ✅ Create measurements
3. ✅ Import photo B
4. ✅ Verify: Photo A's calibration NOT carried over
5. ✅ Photo B starts with no calibration

### Test Case 3: Switch Between Photos Quickly
1. ✅ Import photo rapidly
2. ✅ Verify: No race conditions
3. ✅ Each photo starts fresh

## Related Zustand Behavior

The `setImageUri` function in `measurementStore.ts` already clears calibration:

```typescript
setImageUri: (uri, isAutoCaptured = false) => set((state) => { 
  if (uri !== null) {
    return {
      currentImageUri: uri,
      isAutoCaptured,
      // Clear everything for new photo
      measurements: [],
      completedMeasurements: [],
      currentPoints: [],
      coinCircle: null,
      calibration: null, // ✅ Cleared here too
      savedZoomState: null,
    };
  }
  // ...
})
```

So now calibration is cleared in TWO places for safety:
1. **Component level** - Immediate clear before mode switch
2. **Zustand level** - Clear when image URI is set

## Performance Note

The original code used setTimeout for performance reasons (defer AsyncStorage write). However:
- Modern AsyncStorage is fast enough
- Correctness > micro-optimization
- Race conditions cause worse UX than tiny delay

If performance becomes an issue, we can optimize AsyncStorage batching separately without affecting the clear logic.

## Files Modified
1. `src/screens/MeasurementScreen.tsx` (Lines ~1491-1540)
   - Removed setTimeout wrapper
   - Moved calibration clear to happen immediately
   - Reordered operations for correct timing
2. `app.json` - Version 2.5.13

## Version History
- v2.5.9: Blueprint recalibration display fix
- v2.5.10: Freehand recalibration support
- v2.5.11: Verbal scale recalibration consistency
- v2.5.12: Map mode unit toggle support
- v2.5.13: Photo import calibration clear fix ✅ **Current**

## Status
✅ **FIXED** - New photos now start with fresh calibration (no persistence from previous photos)

## Technical Notes
- This was a classic race condition bug
- setTimeout was causing state updates to happen out of order
- Synchronous operations are sometimes better than async for state consistency
- Always clear state BEFORE mode transitions, not after
