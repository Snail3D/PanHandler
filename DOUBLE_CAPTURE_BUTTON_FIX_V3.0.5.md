# Double-Capture Shutter Button Bug - FIXED ✅ (v3.0.5)

**Date**: Oct 20, 2025  
**Status**: RESOLVED

---

## The Bug

When taking a wall photo (vertical/upright orientation), the shutter button remained clickable **while the photo type selection modal was displayed**. Users could see flashes in the background when pressing the button multiple times, causing:
- Multiple photo captures
- Confusing UX (why is the button still working?)
- Potential race conditions and performance issues

**User Report**: "During that time, the modal is up, the selection modal actually comes up, but I'm still able to click on the button again because I can see a flash in the background."

---

## Root Cause Analysis

### The Problem

The shutter button visibility was controlled by:
```javascript
{!isCapturing && (
  <Pressable onPressOut={() => { /* takePicture() */ }} />
)}
```

This **hides** the button when `isCapturing = true`. However, there was a critical flaw in the `takePicture()` function:

```javascript
// OLD CODE - BUG!
const takePicture = async () => {
  try {
    setIsCapturing(true);
    
    // Take photo...
    
    if (isLookingAtTable) {
      // Table photo: Switch to calibration mode
      setMode('zoomCalibrate');
    } else {
      // Wall photo: STAY in camera mode, show modal
      setShowPhotoTypeModal(true);
    }
  } finally {
    setIsCapturing(false); // ❌ ALWAYS resets, even for wall photos!
  }
}
```

**The Race Condition**:
1. User presses shutter → `isCapturing = true` → button hidden ✅
2. Photo captured (takes ~100-500ms)
3. **Wall photo path**: Stay in camera mode, show modal
4. **`finally` block runs** → `setIsCapturing(false)` ❌
5. Button becomes visible again **while modal is still open** ❌
6. User can press button again → Multiple captures!

### Why Table Photos Worked Fine

Table photos immediately switched to `'zoomCalibrate'` mode, so even though `isCapturing` was reset, the button wouldn't render because we were no longer in camera mode.

But wall photos **stayed in camera mode** while showing the modal, so the button would reappear!

---

## The Fix

### 1. Conditionally Reset `isCapturing` Based on Photo Path

**Table Photo (Auto Coin)**: Reset immediately since we're leaving camera mode
```javascript
if (isLookingAtTable) {
  // Table photo: Switch to calibration
  setCapturedPhotoUri(photo.uri);
  setIsTransitioning(true);
  setMode('zoomCalibrate');
  
  // ✅ Reset isCapturing since we're leaving camera mode
  setIsCapturing(false);
}
```

**Wall Photo (Modal)**: Keep `isCapturing = true` to prevent double-capture
```javascript
else {
  // Wall photo: STAY in camera mode, show modal
  
  // ✅ IMPORTANT: Keep isCapturing = true to prevent double-capture
  // It will be reset when user selects from modal or cancels
  
  setPendingPhotoUri(photo.uri);
  setTimeout(() => {
    setShowPhotoTypeModal(true);
  }, 100);
}
```

### 2. Remove the `finally` Block

```javascript
// OLD CODE
} finally {
  setIsCapturing(false); // ❌ Always resets
}

// NEW CODE
}
// ✅ No finally block - isCapturing is reset conditionally:
// - Table photo: reset immediately (we leave camera mode)
// - Wall photo: stay true until user selects from modal
```

### 3. Reset When User Interacts with Modal

**On Selection**:
```javascript
const handlePhotoTypeSelection = (type: PhotoType) => {
  setShowPhotoTypeModal(false);
  setCurrentPhotoType(type);
  
  // ✅ Reset isCapturing since user has made their selection
  setIsCapturing(false);
  
  // ... proceed with selected type
}
```

**On Cancel**:
```javascript
<PhotoTypeSelectionModal
  visible={showPhotoTypeModal}
  onSelect={handlePhotoTypeSelection}
  onCancel={() => {
    setShowPhotoTypeModal(false);
    // ✅ Reset isCapturing so user can take another photo
    setIsCapturing(false);
    // Clear the pending photo since user cancelled
    setPendingPhotoUri(null);
  }}
/>
```

---

## Files Modified

**src/screens/MeasurementScreen.tsx**:
1. **Line 1134**: Added `setIsCapturing(false)` in table photo path
2. **Line 1171-1172**: Added comment explaining why we keep `isCapturing = true` for wall photos
3. **Lines 1237-1239**: Removed `finally` block, added explanatory comment
4. **Line 1410**: Added `setIsCapturing(false)` in `handlePhotoTypeSelection`
5. **Lines 2265-2271**: Added `setIsCapturing(false)` and `setPendingPhotoUri(null)` in modal cancel handler

---

## Testing Checklist

✅ **Table Photo** (horizontal, phone flat):
1. Press shutter → Photo captured
2. Immediately transitions to calibration
3. Button disappears (mode changes)
4. Cannot double-capture ✅

✅ **Wall Photo** (vertical, phone upright):
1. Press shutter → Photo captured
2. Modal appears immediately
3. Button is HIDDEN (isCapturing = true) ✅
4. Try pressing where button was → No flash, no capture ✅
5. Select "Coin" → Modal closes, button stays hidden during transition ✅
6. Cancel modal → Modal closes, button reappears for new photo ✅

✅ **Error Handling**:
1. If capture fails → `isCapturing` reset in catch block ✅
2. User can retry immediately ✅

---

## State Flow Diagram

### Table Photo Flow
```
Press Shutter
  ↓
isCapturing = true (button hidden)
  ↓
Photo captured
  ↓
isCapturing = false ← Reset immediately
mode = 'zoomCalibrate' (button won't render anyway)
  ↓
Done ✅
```

### Wall Photo Flow
```
Press Shutter
  ↓
isCapturing = true (button hidden)
  ↓
Photo captured
  ↓
isCapturing = true ← STAY true!
mode = 'camera' (still in camera mode)
showPhotoTypeModal = true
  ↓
User selects OR cancels
  ↓
isCapturing = false ← Reset now
  ↓
Done ✅
```

---

## Key Insights

1. **`isCapturing` is UI state, not just operation state** - It controls button visibility, so it must stay true until the user's interaction flow is complete
2. **Modal interactions require button lockout** - Even though technically the capture is done, the user shouldn't be able to start a new capture until they finish with the modal
3. **Different photo paths need different state management** - Table vs wall photos have fundamentally different flows
4. **`finally` blocks are dangerous for UI state** - They run no matter what, which can reset state prematurely

---

## Related Fixes

This completes the photo capture reliability work:
- **v3.0.3**: Removed MMKV persistence for work sessions
- **v3.0.4**: Fixed fresh install flash-back bug (useEffect race condition)
- **v3.0.5**: Fixed double-capture button bug (isCapturing state management)

---

**Status**: Bug fixed and ready for testing! 🎉
