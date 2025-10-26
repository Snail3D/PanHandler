# Blueprint Recalibration Pan/Zoom Lock - v2.5.3

## Issue
When recalibrating in blueprint mode with existing measurements on screen, users could pan and zoom the image. This caused a visual problem: measurements are stored in **image coordinates** but displayed in **screen coordinates** (which change with pan/zoom). So when users panned/zoomed during recalibration, existing measurements would appear to move across the image, which was confusing and made it hard to place new calibration pins accurately.

## Solution
Implemented intelligent pan/zoom locking during blueprint recalibration:

### Logic
**When user hits "Recalibrate" in blueprint mode:**

✅ **If measurements exist** → Lock pan/zoom (prevents measurements from appearing to move)
✅ **If no measurements** → Allow pan/zoom (user can adjust view to place pins accurately)

**After calibration completes or is cancelled:**
- Pan/zoom is unlocked
- Measurements are recalculated with new calibration

### Why This Works
- **Measurements exist**: The visual positions of measurements must stay stable during recalibration, so the image cannot move
- **No measurements**: Nothing to worry about moving, so user gets full pan/zoom freedom to position their calibration pins

## Implementation Details

### 1. Added Pan/Zoom Lock Control to DimensionOverlay
**File:** `src/components/DimensionOverlay.tsx`

Added new prop:
```typescript
onPanZoomLockChange?: (shouldLock: boolean) => void;
```

### 2. Updated Blueprint Recalibration Logic (Line ~3336)
```typescript
if (calibration?.calibrationType === 'blueprint') {
  // CRITICAL: Lock pan/zoom if there are measurements
  const shouldLockPanZoom = measurements.length > 0;
  
  if (shouldLockPanZoom) {
    console.log('🔒 Locking pan/zoom - measurements exist');
  } else {
    console.log('🔓 Allowing pan/zoom - no measurements');
  }
  
  // Notify parent to lock/unlock pan/zoom
  if (onPanZoomLockChange) {
    onPanZoomLockChange(shouldLockPanZoom);
  }
  
  // ... rest of recalibration logic
}
```

### 3. Unlock After Calibration Complete (Line ~7391)
```typescript
// After blueprint distance entered
setTimeout(() => {
  // ... cleanup
  
  // Unlock pan/zoom now that calibration is complete
  if (onPanZoomLockChange) {
    onPanZoomLockChange(false);
    console.log('🔓 Unlocking pan/zoom - calibration complete');
  }
}, 400);
```

### 4. Unlock on Cancel (Line ~7417)
```typescript
// If user cancels blueprint distance modal
setTimeout(() => {
  // ... cleanup
  
  // Unlock pan/zoom when dismissing
  if (onPanZoomLockChange) {
    onPanZoomLockChange(false);
    console.log('🔓 Unlocking pan/zoom - calibration cancelled');
  }
}, 300);
```

### 5. Updated MeasurementScreen to Control Lock
**File:** `src/screens/MeasurementScreen.tsx`

**Changed from constant to state:**
```typescript
// Before
const isPanZoomLocked = false; // Never lock

// After
const [isPanZoomLocked, setIsPanZoomLocked] = useState(false);
```

**Added callback to DimensionOverlay:**
```typescript
<DimensionOverlay
  // ... other props
  onPanZoomLockChange={(shouldLock) => {
    setIsPanZoomLocked(shouldLock);
  }}
/>
```

**Passed to ZoomableImage:**
```typescript
<ZoomableImage
  // ... other props
  locked={isPanZoomLocked}
/>
```

## User Experience

### Scenario 1: Recalibrate with Measurements
1. User has blueprint calibrated with 5 measurements on screen
2. User taps "Recalibrate" button
3. 🔒 Pan/zoom **locks automatically**
4. Blueprint placement modal appears
5. User taps "PLACE PINS" - cursor appears
6. User taps first point, then second point (image stays locked)
7. User enters distance in modal
8. 🔓 Pan/zoom **unlocks automatically**
9. Measurements recalculated with new scale

### Scenario 2: Recalibrate with No Measurements
1. User has blueprint calibrated but cleared all measurements
2. User taps "Recalibrate" button
3. 🔓 Pan/zoom **stays unlocked**
4. Blueprint placement modal appears
5. User can pan/zoom to frame the reference points perfectly
6. User taps "PLACE PINS" - cursor appears
7. User places pins and enters distance
8. Pan/zoom remains unlocked (was never locked)

## Benefits
✅ **Prevents visual confusion** - Measurements don't appear to "slide" around
✅ **Smart behavior** - Only locks when necessary (measurements exist)
✅ **User-friendly** - Allows pan/zoom when there's nothing to worry about
✅ **Automatic** - No manual lock/unlock needed from user

## Files Modified
- ✏️ `src/components/DimensionOverlay.tsx`
  - Added `onPanZoomLockChange` prop
  - Updated blueprint recalibration logic (line ~3336)
  - Added unlock on complete (line ~7391)
  - Added unlock on cancel (line ~7417)
- ✏️ `src/screens/MeasurementScreen.tsx`
  - Changed `isPanZoomLocked` from constant to state
  - Added `onPanZoomLockChange` callback to DimensionOverlay
- 📝 `app.json` - Version bumped to **2.5.3**

## Technical Notes

### Why Measurements Move During Pan/Zoom
Measurements are stored as `{x, y}` coordinates in **image space** (0-imageWidth, 0-imageHeight). When rendered, they're converted to **screen space** using the current zoom/pan transform:

```typescript
const screenX = (imageX * zoomScale) + zoomTranslateX;
const screenY = (imageY * zoomScale) + zoomTranslateY;
```

If `zoomTranslateX/Y` changes (panning), the screen position changes even though the image position is constant. This makes measurements appear to "move" relative to the image.

### Why Lock Only When Measurements Exist
- **With measurements**: Visual stability is critical for user to understand what they're recalibrating
- **Without measurements**: Pan/zoom freedom is more valuable than locking (nothing to confuse)

---

**Version:** v2.5.3
**Date:** October 20, 2025
**Fix Type:** UX enhancement - blueprint recalibration
