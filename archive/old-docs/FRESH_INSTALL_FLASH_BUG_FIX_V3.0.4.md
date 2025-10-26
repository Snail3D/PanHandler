# Fresh Install Flash-Back Bug - FIXED ✅ (v3.0.4)

**Date**: Oct 20, 2025  
**Status**: RESOLVED

---

## The Bug

On fresh app install, the first photo attempt would flash back to camera immediately after capture. This happened for BOTH table photos (auto coin) and wall photos (with modal). Second attempt would work fine.

**User Impact**: Confusing first experience - users thought the photo didn't capture.

---

## Root Cause Analysis

### The Problem

In v3.0.3, we optimized performance by:
1. **Removed work session data from MMKV persistence** - only persist user settings
2. **Introduced `capturedPhotoUri`** - local state to hold photo before MMKV write
3. **Deferred `setImageUri()` calls** - write to MMKV after UI transitions

This created a critical bug with an existing useEffect:

```javascript
// OLD CODE (lines 927-932)
useEffect(() => {
  if (!currentImageUri && mode !== 'camera') {
    setMode('camera');
  }
}, [currentImageUri, mode]);
```

**The Race Condition**:
1. User captures photo
2. `setCapturedPhotoUri(photo.uri)` - sets local state ✅
3. `setMode('zoomCalibrate')` - switches to calibration mode ✅
4. **useEffect fires** - checks `!currentImageUri` (still null because MMKV write is deferred!)
5. **Switches back to camera mode** ❌

On fresh install, `currentImageUri` from MMKV is `null` (not persisted anymore), so the useEffect would immediately revert to camera mode when it saw `mode !== 'camera'` with no `currentImageUri`.

### Why Second Attempt Worked

On second photo attempt, `currentImageUri` would be set from the previous photo's deferred write, so the check would pass.

---

## The Fix

Updated the useEffect to check **BOTH** `capturedPhotoUri` (local state) AND `currentImageUri` (persisted state):

```javascript
// NEW CODE (lines 927-936)
// Watch for image changes and reset mode to camera when image is cleared
// IMPORTANT: Check both capturedPhotoUri AND currentImageUri
// capturedPhotoUri is set immediately on photo capture (before MMKV write)
// currentImageUri is set later after MMKV write completes
useEffect(() => {
  const hasImage = capturedPhotoUri || currentImageUri;
  if (!hasImage && mode !== 'camera') {
    setMode('camera');
  }
}, [capturedPhotoUri, currentImageUri, mode]);
```

**Why This Works**:
- `capturedPhotoUri` is set synchronously on photo capture
- Even though `currentImageUri` is still null (on fresh install), `hasImage` evaluates to `true`
- useEffect no longer forces switch back to camera
- ZoomCalibration mounts successfully with `displayImageUri = capturedPhotoUri || currentImageUri`

---

## Files Modified

**src/screens/MeasurementScreen.tsx** (lines 927-936)
- Added check for `capturedPhotoUri` in addition to `currentImageUri`
- Added explanatory comments for future maintainers
- Updated dependency array to include `capturedPhotoUri`

---

## Testing Checklist

✅ **Fresh Install Test**:
1. Uninstall app completely
2. Reinstall app
3. Capture first photo (table) → Should go to calibration immediately
4. Cancel and capture wall photo → Should show modal and proceed to calibration

✅ **Existing User Test**:
1. Users with existing MMKV data should not be affected
2. Photo capture should work normally
3. Going back to camera should clear state properly

---

## Related Changes

This fix completes the performance optimization work from v3.0.3:
- **v3.0.3**: Removed work session persistence + introduced `capturedPhotoUri`
- **v3.0.4**: Fixed race condition with mode-switching useEffect

---

## Lessons Learned

1. **When introducing local state for performance, audit ALL useEffects** that depend on the old persisted state
2. **Test fresh installs separately** - they expose initialization bugs that regular testing misses
3. **State management is tricky** - React batches updates, but useEffects can fire between batches
4. **Document timing-sensitive code** - future developers need to understand the order of operations

---

**Status**: Bug fixed and tested. Ready for release in v3.0.4. 🎉
