# Session Complete - v2.5.13: Photo Import Calibration Bug Fixed

## Bug Reported
"When I go to update a new photo, it's still remembering my old calibration. When I update a new photo, it should reset all the calibration information, so I need to input the calibration again."

## The Problem: Race Condition

The calibration clearing code was running **300ms too late**:

```javascript
// OLD CODE (Buggy)
handlePhotoTypeSelection('map'); // Mode switches NOW!

setTimeout(() => {
  setCoinCircle(null);          // Clears 300ms later...
  setCalibration(null);          // Too late!
  setImageUri(asset.uri);
}, 300);
```

### What Was Happening
1. User imports new photo
2. Photo type selected → Mode switches to 'measurement' **IMMEDIATELY**
3. MeasurementScreen renders with **OLD calibration** from Zustand
4. 300ms later → Calibration finally clears (but screen already rendered)
5. ❌ User sees old calibration on new photo

## The Fix

**Clear calibration BEFORE any mode switches:**

```javascript
// NEW CODE (Fixed)
// Clear IMMEDIATELY
setCoinCircle(null);
setCalibration(null);
setCompletedMeasurements([]);
setCurrentPoints([]);
setImageUri(asset.uri, false);

// NOW safe to switch modes
handlePhotoTypeSelection('map');
```

### Why This Works
1. User imports new photo
2. ✅ Calibration cleared FIRST (synchronously)
3. ✅ Image URI set (also clears in Zustand)
4. Photo type selected → Mode switches
5. ✅ MeasurementScreen renders with NO calibration
6. ✅ Fresh start!

## Testing Scenarios

### Before Fix
1. Take photo, calibrate with coin → "10mm scale"
2. Import new photo
3. ❌ Still shows "10mm scale" from old photo
4. User confused: "Why is my new photo already calibrated?"

### After Fix
1. Take photo, calibrate with coin → "10mm scale"  
2. Import new photo
3. ✅ NO calibration shown
4. ✅ User must recalibrate (as expected)

## Technical Details

### Why setTimeout Was There
The code was trying to "defer AsyncStorage writes" for performance:
```javascript
// Idea: Don't block UI thread with AsyncStorage write
setTimeout(() => {
  setImageUri(asset.uri); // AsyncStorage write
}, 300);
```

### Why It Failed
- Deferred write caused state update AFTER mode switch
- Race condition: UI rendered before state cleared
- Correctness > micro-optimization

### The Solution
- Remove setTimeout
- Clear state synchronously BEFORE mode changes
- Modern AsyncStorage is fast enough
- If performance becomes an issue, optimize separately

## Complete Session Summary

| Version | Fix |
|---------|-----|
| v2.5.9 | Blueprint recalibration display update ✅ |
| v2.5.10 | Freehand recalibration support ✅ |
| v2.5.11 | Verbal scale recalibration consistency ✅ |
| v2.5.12 | Map mode unit toggle works ✅ |
| v2.5.13 | **Photo import calibration clear** ✅ |

## Files Modified
1. `src/screens/MeasurementScreen.tsx`
   - Removed setTimeout wrapper around calibration clear
   - Moved clear operations before mode switch
   - Reordered: Clear → Set → Route → Render
2. `app.json` - Version 2.5.13
3. `ReadMeKen.md` - Updated to 2.5.13

## Documentation Created
- `PHOTO_IMPORT_CALIBRATION_BUG_V2.5.13.md` - Technical details
- `SESSION_COMPLETE_V2.5.13_CALIBRATION_CLEAR.md` - This summary

## Additional Bugs Discovered (Not Yet Fixed)

During investigation, you also mentioned:
1. **Map mode photo import requires double tap** - "I need to add it twice. First time nothing happens"
   - Status: Needs investigation
   - Likely related to modal visibility timing

## Status
✅ **FIXED** - New photos now properly clear old calibration

No more calibration persistence between photos! Each photo session starts fresh as expected. 🎉

---

**Great catches on these bugs!** The calibration persistence was definitely confusing UX. The timing issue was subtle - a classic race condition that only shows up in real-world usage.
