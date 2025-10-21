# Critical Lockup Bug - FIXED ✅ (v3.0.7)

**Date**: Oct 20, 2025  
**Status**: RESOLVED  
**Severity**: CRITICAL - App-breaking bug

---

## The Bug

**User Report**: "Took a picture, went into coin calibration, clicked the coin selector, went back to take another picture and it locked up. Shutter button disappeared and stuck on camera screen. When I refreshed the app, white screen with no text, then black screen."

**Symptoms**:
1. After cancelling calibration and trying to take a second photo → **Complete lockup**
2. Shutter button disappears (hidden forever)
3. Can't interact with camera
4. Force refresh → White screen or black screen (stuck overlays)
5. **This would cause users to delete the app immediately**

---

## Root Cause Analysis

### Problem 1: Animation State Not Reset on Cancel

When user clicks back/cancel from calibration, `handleCancelCalibration()` would:
1. Reset state variables (`isCapturing`, `mode`, etc.)
2. ✅ Switch back to camera mode
3. ❌ **BUT NEVER reset animation values**

If `transitionBlackOverlay` was stuck at `1` (fully black), it would stay black forever.
If `cameraOpacity` was stuck at `0` (invisible), you'd see white screen forever.

```javascript
// OLD CODE - BUG!
const handleCancelCalibration = () => {
  setIsCapturing(false);
  setMode('camera');
  setCapturedPhotoUri(null);
  
  // ❌ Animation values NOT reset!
  // transitionBlackOverlay.value could be 1 (black screen)
  // cameraOpacity.value could be 0 (white screen)
};
```

### Problem 2: No Safety Timeout for Hung Captures

If photo capture started but something went wrong (async operation hung, error not caught, etc.), `isCapturing` would stay `true` forever:
- Shutter button hidden: `{!isCapturing && <Pressable>...`
- Can never take another photo
- No way to recover without restarting app

### Problem 3: Safety Timeout Not Cleared Properly

Even after adding a safety timeout, it wasn't being cleared in all code paths:
- Early returns (permission denied, camera ref null)
- Error catch block
- Success paths (table/wall photo)

This could cause the timeout to fire **after** a successful capture, incorrectly resetting `isCapturing`.

---

## The Fixes

### Fix 1: Reset Animation Values on Cancel

```javascript
// NEW CODE - FIXED! ✅
const handleCancelCalibration = () => {
  setIsCapturing(false);
  setIsTransitioning(false);
  setIsHoldingShutter(false);
  
  // ✅ CRITICAL: Reset all animation values to prevent stuck overlays
  transitionBlackOverlay.value = 0; // Clear any transition overlay
  cameraOpacity.value = 0; // Will be animated in by camera mode useEffect
  blackOverlayOpacity.value = 1; // Camera mode useEffect will fade this out
  cameraFlashOpacity.value = 0; // Clear any lingering flash
  
  setMode('camera');
  setCapturedPhotoUri(null);
};
```

Now when user cancels, **all animation values are reset** to their expected initial states, and the camera mode useEffect will properly animate them in.

### Fix 2: Add 10-Second Safety Timeout

```javascript
const takePicture = async () => {
  if (!cameraRef.current || isCapturing || mode !== 'camera') {
    return; // Already has guard
  }
  
  // Declare in function scope so catch/finally can access
  let safetyTimeout: NodeJS.Timeout | null = null;
  
  try {
    setIsCapturing(true);
    
    // ✅ SAFETY: Force reset after 10 seconds if something hangs
    safetyTimeout = setTimeout(() => {
      console.error('⚠️ SAFETY: Force resetting isCapturing after 10s timeout');
      setIsCapturing(false);
      setIsTransitioning(false);
    }, 10000);
    
    // ... photo capture logic ...
    
  } catch (error) {
    if (safetyTimeout) clearTimeout(safetyTimeout);
    setIsCapturing(false);
    setIsTransitioning(false);
  }
};
```

If **anything** goes wrong during capture and `isCapturing` doesn't get reset, the safety timeout will forcefully reset it after 10 seconds, allowing the user to try again.

### Fix 3: Clear Safety Timeout in All Code Paths

```javascript
// Early return - Permission denied
if (!permission?.granted) {
  if (safetyTimeout) clearTimeout(safetyTimeout); // ✅
  setIsCapturing(false);
  return;
}

// Early return - Camera ref null
if (!cameraRef.current) {
  if (safetyTimeout) clearTimeout(safetyTimeout); // ✅
  setIsCapturing(false);
  return;
}

// Success - Table photo
if (isLookingAtTable) {
  if (safetyTimeout) clearTimeout(safetyTimeout); // ✅
  setIsCapturing(false);
  // ...
}

// Success - Wall photo
else {
  if (safetyTimeout) clearTimeout(safetyTimeout); // ✅
  // Keep isCapturing = true for modal
  // ...
}

// Error catch
catch (error) {
  if (safetyTimeout) clearTimeout(safetyTimeout); // ✅
  setIsCapturing(false);
}
```

Now the timeout is **always** cleared when it should be, preventing spurious resets after successful captures.

---

## Files Modified

**src/screens/MeasurementScreen.tsx**:

1. **Lines 1302-1327** - `handleCancelCalibration()`:
   - Added animation value resets: `transitionBlackOverlay`, `cameraOpacity`, `blackOverlayOpacity`, `cameraFlashOpacity`
   - Prevents white/black screen bugs after cancelling

2. **Lines 1060-1064** - `takePicture()` function scope:
   - Declared `safetyTimeout` variable in function scope (not just try block)
   - Allows catch block to access and clear it

3. **Lines 1065-1071** - Safety timeout:
   - Added 10-second safety timeout that force-resets `isCapturing` if hung
   - Prevents permanent lockup

4. **Lines 1074-1089** - Early return paths:
   - Added `if (safetyTimeout) clearTimeout(safetyTimeout)` to permission check
   - Added `if (safetyTimeout) clearTimeout(safetyTimeout)` to camera ref check

5. **Lines 1138, 1184** - Success paths:
   - Added `if (safetyTimeout) clearTimeout(safetyTimeout)` in table photo path
   - Added `if (safetyTimeout) clearTimeout(safetyTimeout)` in wall photo path

6. **Lines 1246-1251** - Error catch:
   - Added `if (safetyTimeout) clearTimeout(safetyTimeout)` in catch block

---

## Testing Checklist

✅ **Scenario 1: Cancel from calibration**:
1. Take photo → Goes to calibration
2. Press back/cancel → Returns to camera
3. Screen fades in properly (no white/black screen) ✅
4. Shutter button visible and functional ✅
5. Can take second photo immediately ✅

✅ **Scenario 2: Open coin selector then cancel**:
1. Take photo → Goes to calibration
2. Tap coin name → Coin selector opens
3. Press back → Returns to calibration
4. Press back again → Returns to camera
5. Everything works, no lockup ✅

✅ **Scenario 3: Camera ref goes null (edge case)**:
1. Simulate camera ref becoming null during capture
2. Safety timeout clears properly ✅
3. Error is caught ✅
4. `isCapturing` reset ✅
5. Can try again ✅

✅ **Scenario 4: Long capture (simulated hang)**:
1. Simulate 12-second photo capture delay
2. Safety timeout fires at 10 seconds ✅
3. `isCapturing` force-reset ✅
4. Shutter button reappears ✅
5. User can try again ✅

---

## Why This Was Critical

This bug would cause **immediate app deletion** because:
1. **Complete loss of control** - User can't take photos anymore
2. **No recovery path** - Only fix is to force-close and restart app
3. **Confusing symptoms** - White/black screens with no error message
4. **Happens on common flow** - Cancel calibration is a normal user action

The bug manifested after our v3.0.3-3.0.6 performance optimizations where we introduced `capturedPhotoUri` and deferred MMKV writes. The new state management introduced edge cases that weren't properly handled.

---

## Prevention Strategy

### For Future Development:

1. **Always reset animation values** when returning to a screen
2. **Add safety timeouts** for any async operation that controls UI state
3. **Clear timeouts** in ALL code paths (early returns, success, error)
4. **Test cancel flows** as thoroughly as happy paths
5. **Monitor for stuck state** - add guards that detect and auto-recover

### Code Pattern:
```javascript
// ✅ GOOD: Declare timeout in function scope
let timeout: NodeJS.Timeout | null = null;

try {
  timeout = setTimeout(() => { /* safety reset */ }, 10000);
  
  // ... async work ...
  
  if (safetyTimeout) clearTimeout(safetyTimeout); // Clear on success
} catch (error) {
  if (safetyTimeout) clearTimeout(safetyTimeout); // Clear on error
}
```

---

## Lessons Learned

1. **State management in async flows is hard** - React's batching + async operations + animations create complex timing issues
2. **Defensive programming saves users** - Safety timeouts and force-resets prevent catastrophic lockups
3. **Test edge cases religiously** - Cancel flows, back buttons, and error paths are where bugs hide
4. **Animation state is still state** - Forgetting to reset `transitionBlackOverlay.value` is just as bad as forgetting to reset `isCapturing`

---

**Status**: Critical bug FIXED. App is now stable and resilient against lockups! 🎉

**For the user experiencing lockup right now**: 
- Force close the app completely
- Reopen it
- The fix is now deployed, so it won't happen again
