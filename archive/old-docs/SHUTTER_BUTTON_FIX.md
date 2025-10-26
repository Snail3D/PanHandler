# Shutter Button Fix - Auto-Capture Toggle Only

## Problem
The shutter button allowed users to take misaligned pictures. When auto-capture was already ON, tapping the button again would trigger `takePicture()` immediately, bypassing alignment checks.

## Solution
Changed the shutter button to be a simple toggle that only enables/disables auto-capture mode. Removed the manual capture behavior.

### Before (Buggy Code)
```javascript
onPress={() => {
  if (!autoCaptureEnabled) {
    // Enable auto-capture mode
    setAutoCaptureEnabled(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else {
    // Manual capture if already enabled ❌ BYPASSES ALIGNMENT!
    if (cameraRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      takePicture();
    }
  }
}}
```

### After (Fixed Code)
```javascript
onPress={() => {
  // Toggle auto-capture mode
  setAutoCaptureEnabled(!autoCaptureEnabled);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}}
```

## How It Works Now

### Shutter Button Behavior
- **First tap (OFF → ON)**: Enables auto-capture, shows "✓ Auto-Capture Active", button turns green
- **Second tap (ON → OFF)**: Disables auto-capture, shows "Tap to Begin", button turns white
- **No manual photo taking**: Button ONLY toggles the auto-capture state

### Auto-Capture System (Lines 687-700)
The existing auto-capture logic handles taking photos automatically when ALL conditions are met:
- ✅ `alignmentStatus === 'good'` - Device is aligned (bubble level centered)
- ✅ `isStable === true` - Device is stable (not moving)
- ✅ `autoCaptureEnabled === true` - User has enabled auto-capture via button
- ✅ `mode === 'camera'` - In camera mode
- ✅ `!isCapturing` - Not currently taking a photo
- ✅ Camera is ready

### Reset Behavior (Lines 702-707)
Auto-capture resets to OFF when entering camera mode, so users must tap the button each time they want to use auto-capture.

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx` - Lines 1529-1534 (shutter button onPress)
- `/home/user/workspace/src/state/measurementStore.ts` - Added `specialOfferTriggered`, `specialOfferSessionsLeft`, and related methods

## Result
✅ Users can NO LONGER take misaligned pictures by tapping the button
✅ Button is now a simple, intuitive toggle
✅ Auto-capture system enforces alignment requirements
✅ Cleaner, more predictable UX
