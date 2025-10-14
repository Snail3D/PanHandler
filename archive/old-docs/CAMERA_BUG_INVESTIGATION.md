# 🚨 CAMERA PHOTO CAPTURE BUG - INVESTIGATION

**Date**: Mon Oct 13 2025  
**Reported Issue**: "When I take a picture, it just goes blurry, but doesn't progress to the next screen"  
**Started After**: Reset confirmation popup removal

## Changes Made That Could Have Caused This

### ✅ Reset Function Change (Lines 1466-1482)
**Before**:
```typescript
const handleReset = () => {
  Alert.alert(
    'Reset Measurements',
    'This will clear all measurements and return to the camera. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        setImageUri(null);
        setCoinCircle(null);
        setCalibration(null);
      }}
    ]
  );
};
```

**After**:
```typescript
const handleReset = () => {
  try {
    console.log('🔄 handleReset called - resetting to camera');
    const setImageUri = useStore.getState().setImageUri;
    const setCoinCircle = useStore.getState().setCoinCircle;
    const setCalibration = useStore.getState().setCalibration;
    
    setImageUri(null);
    setCoinCircle(null);
    setCalibration(null);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('✅ handleReset completed successfully');
  } catch (error) {
    console.error('❌ Error in handleReset:', error);
  }
};
```

**Analysis**: This change should NOT affect photo capture at all. handleReset is only called when Tetris button is pressed.

## Expected Photo Capture Flow

1. **Camera Screen** → User taps shutter button
2. **takePicture()** function runs (MeasurementScreen.tsx:189)
   - Sets `isCapturing = true`
   - Takes photo with `cameraRef.current.takePictureAsync()`
   - Saves to camera roll
   - Calls `setImageUri(photo.uri)`
   - Calls `setMode('selectCoin')` (LINE 226)
   - Sets `isCapturing = false`
3. **Mode changes to 'selectCoin'**
4. **CalibrationModal renders** (visible when mode === 'selectCoin')
5. **User sees coin selector**

## What "Blur" Could Be

1. **BlurView from CalibrationModal** (line 55: `<BlurView intensity={90} tint="dark">`)
   - Modal background should show dark blur
   - Content should render on top

2. **Image opacity change** (imageOpacity state)
   - Used for measurement overlay effects
   - Shouldn't affect camera → coin selector transition

## Potential Causes

### Theory 1: Mode Not Set Properly ❓
- `setMode('selectCoin')` might be failing silently
- **Check**: Console logs should show mode change
- **Fix**: Already added logging

### Theory 2: CalibrationModal Not Rendering ❓
- Modal might have render error
- Blur shows but content doesn't
- **Check**: Look for React errors in console
- **Fix**: Need to verify modal code

### Theory 3: AsyncStorage/Store Issue ❓
- `setImageUri` might be failing
- Store update might be blocked
- **Check**: Console logs for store methods
- **Fix**: Already added try/catch

### Theory 4: React State Update Timing ❓
- State updates might be batched incorrectly
- Mode change might not trigger re-render
- **Check**: Add logs to useEffect (line 158)
- **Fix**: May need to force render

## Debug Steps Added

### 1. Console Logging in handleReset
```typescript
console.log('🔄 handleReset called - resetting to camera');
console.log('✅ handleReset completed successfully');
console.error('❌ Error in handleReset:', error);
```

### 2. Check These Console Logs
When taking a photo, you should see:
- ✅ Photo saved to camera roll
- 📐 Image dimensions
- 📱 Image orientation

When pressing Tetris, you should see:
- 🔄 handleReset called
- ✅ handleReset completed successfully

## Quick Fix to Test

If the issue persists, try this TEMPORARY fix to rule out the reset change:

```typescript
// Revert to old version temporarily
const handleReset = () => {
  const setImageUri = useStore.getState().setImageUri;
  const setCoinCircle = useStore.getState().setCoinCircle;
  const setCalibration = useStore.getState().setCalibration;
  
  setImageUri(null);
  setCoinCircle(null);
  setCalibration(null);
};
```

If photo capture STILL fails, then the reset change is NOT the cause.

## Navigation Flow Verification

The useEffect at line 158-162 should handle reset navigation:
```typescript
useEffect(() => {
  if (!currentImageUri && mode !== 'camera') {
    setMode('camera');
  }
}, [currentImageUri, mode]);
```

This watches for imageUri changes and automatically returns to camera mode.

## Next Steps

1. **Check Console**: Look for error messages or missing logs
2. **Test Reset Button**: Does Tetris button work? Do you see console logs?
3. **Test Photo Capture**: Do you see "Photo saved" and "Image dimensions" logs?
4. **Check Modal**: Does the blur appear? Does coin selector content show?

## Hypothesis

**Most Likely**: The photo IS being taken successfully, but CalibrationModal has a render issue. The BlurView background shows (causing the "blur" you see), but the modal content fails to render.

**Less Likely**: The mode state isn't updating, causing the app to stay in camera mode with a visual glitch.

**Unlikely**: The handleReset change somehow broke photo capture (these are completely separate code paths).

---

**Status**: 🔍 INVESTIGATING - Added console logging for debugging
**File Modified**: `src/components/DimensionOverlay.tsx` (added try/catch and logging)
