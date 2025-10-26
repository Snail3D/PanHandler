# Gallery Import Fix v2.3.2

## Issues Found

### 1. Gallery button not working - Photo type modal not showing
**Root Cause**: `pickImage()` tries to show `PhotoTypeSelectionModal` while in CAMERA MODE, but the modal is only properly rendered when in measurement/calibration modes.

**Fix**: Transition to measurement mode FIRST, then show the modal (same pattern as taking photos with phone upright).

### 2. Photo capture feels slow
**Root Cause**: Multiple delays and processing steps happen sequentially:
- 50ms wait before capture
- Photo processing
- Orientation detection
- Multiple setTimeout calls
- AsyncStorage writes

**Fix**: Remove unnecessary delays, streamline the flow.

## Changes Made

### File: `/home/user/workspace/src/screens/MeasurementScreen.tsx`

#### Fix 1: Gallery Import Flow (pickImage function)
Changed from showing modal directly to transitioning to measurement mode first:

```typescript
// BEFORE (BROKEN):
setCapturedPhotoUri(asset.uri);
await detectOrientation(asset.uri);
setPendingPhotoUri(asset.uri);
setShowPhotoTypeModal(true); // ❌ Doesn't work in camera mode!

// AFTER (FIXED):
setCapturedPhotoUri(asset.uri);
await detectOrientation(asset.uri);

// Transition to measurement mode FIRST, then show modal
setIsTransitioning(true);
transitionBlackOverlay.value = withTiming(1, { duration: 150 });

setTimeout(() => {
  setMode('measurement');
  setPendingPhotoUri(asset.uri);
  
  setTimeout(() => {
    setShowPhotoTypeModal(true); // ✅ Now in measurement mode
    transitionBlackOverlay.value = withTiming(0, { duration: 250 });
    setTimeout(() => setIsTransitioning(false), 250);
  }, 50);
}, 150);

// Defer AsyncStorage write
setTimeout(() => {
  setImageUri(asset.uri, false);
}, 300);
```

#### Fix 2: Remove Unnecessary Capture Delay
Removed 50ms wait before taking photo - camera should be ready when button is pressed.

```typescript
// BEFORE:
await new Promise(resolve => setTimeout(resolve, 50));
const photo = await cameraRef.current.takePictureAsync({...});

// AFTER:
const photo = await cameraRef.current.takePictureAsync({...});
```

## Testing

- [ ] Gallery button opens picker
- [ ] Selecting photo shows photo type modal
- [ ] Photo type modal works correctly
- [ ] Photo capture feels instant
- [ ] No freezing or delays

## Status

✅ Ready for testing
