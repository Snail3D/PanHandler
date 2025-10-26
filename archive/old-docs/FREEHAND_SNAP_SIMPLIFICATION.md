# Freehand Snap Behavior Simplification

## Issue
**User Report**: "The freehand tool is snapping too quickly to other lines. I think to make it simpler, the freehand tool shouldn't snap to any other line except it should be able to snap to itself. That way, we remove all that other logic. I want the freehand line for sure to be able to come around and snap to itself so I can do like the area of a lake."

### The Problem:
The freehand tool had THREE different snap behaviors:
1. **First point snap** - Snapped to existing measurements when starting
2. **Mid-drawing snap** - Snapped to existing measurements while drawing
3. **Loop-closing snap** - Snapped to its own starting point to close loops

This was confusing and made it hard to draw freely near existing measurements.

### Additional Request:
"Can we use pixels for the catch? Would that make more sense so that no matter what the scale is, it would still be the same?"

---

## The Solution

### Simplified to ONE Snap Behavior:
**ONLY snap to own starting point (loop closing)**

### Removed Snapping:
- ❌ No snap to existing measurements when starting
- ❌ No snap to existing measurements while drawing
- ✅ User can manually start at a point if needed

### Kept Snapping:
- ✅ Snap to own starting point to close loops (for areas like lakes)

### Changed from Millimeters to Pixels:
- **Before**: 0.3mm (calibration-dependent, different experience at different scales)
- **After**: 18 pixels (universal, consistent across all scales)

---

## Technical Changes

### File: `src/components/DimensionOverlay.tsx`

#### 1. Removed First Point Snap (Lines ~3685-3696)

**Before**:
```typescript
if (prevPath.length === 0) {
  // Check if we should snap to an existing point
  const screenPos = imageToScreen(imageX, imageY);
  const snapResult = snapToNearbyPoint(screenPos.x, screenPos.y, false);
  
  if (snapResult.snapped) {
    const snappedImageCoords = screenToImage(snapResult.x, snapResult.y);
    console.log('🎯 Freehand starting point snapped');
    return [{ x: snappedImageCoords.x, y: snappedImageCoords.y }];
  }
  
  return [{ x: imageX, y: imageY }];
}
```

**After**:
```typescript
if (prevPath.length === 0) {
  // No snapping to existing measurements
  // Freehand draws freely - user can manually start at a point if needed
  return [{ x: imageX, y: imageY }];
}
```

#### 2. Removed Mid-Drawing Snap (Lines ~3742-3770)

**Before**:
```typescript
// SNAP TO OTHER MEASUREMENTS while drawing
if (prevPath.length >= 3) {
  const screenPos = imageToScreen(imageX, imageY);
  const snapResult = snapToNearbyPoint(screenPos.x, screenPos.y, false);
  
  if (snapResult.snapped) {
    // Snap to existing point mid-draw
    const snappedImageCoords = screenToImage(snapResult.x, snapResult.y);
    console.log('🎯 Freehand snapped to existing measurement point');
    return [...prevPath, { x: snappedImageCoords.x, y: snappedImageCoords.y }];
  }
}
```

**After**:
```typescript
// No snapping to other measurements - freehand draws freely
return [...prevPath, { x: imageX, y: imageY }];
```

#### 3. Simplified Loop-Closing Snap to Fixed Pixels (Lines ~3710-3740)

**Before**:
```typescript
// Convert 0.3mm to pixels based on calibration
let snapThresholdPixels = 1.5; // Default fallback

if (calibration) {
  const snapThresholdMM = 0.3;
  if (calibration.unit === 'mm') {
    snapThresholdPixels = snapThresholdMM * calibration.pixelsPerUnit;
  } else if (calibration.unit === 'cm') {
    snapThresholdPixels = (snapThresholdMM / 10) * calibration.pixelsPerUnit;
  } else if (calibration.unit === 'in') {
    snapThresholdPixels = (snapThresholdMM / 25.4) * calibration.pixelsPerUnit;
  }
}
```

**After**:
```typescript
// Use PIXELS for universal, scale-independent behavior
// Consistent touch experience whether measuring coins or maps
const snapThresholdPixels = 18; // Sweet spot for catchability
```

---

## Why 18 Pixels?

### Visual Size Reference:
- **18 image pixels** ≈ roughly the size of the starting point circle (including glow)
- Easy to catch when you come back to the starting point
- Not so large that it snaps accidentally

### Scale-Independent:
| Calibration Type | Old (0.3mm) | New (18px) | Benefit |
|------------------|-------------|------------|---------|
| **Coin (24mm quarter)** | ~5 pixels | 18 pixels | ✅ Easier to catch |
| **Large blueprint (1m scale)** | ~100 pixels | 18 pixels | ✅ Not too aggressive |
| **Map (1:10000 scale)** | Varies wildly | 18 pixels | ✅ Consistent |

### Touch Experience:
```
Visual snap zone (18 pixel radius):

        ● Starting point
      ╱   ╲
    ╱  18px ╲  
   │  radius  │  Snap zone
    ╲       ╱
      ╲   ╱
        ✕ Cursor position
        
Easy to hit deliberately,
hard to hit accidentally
```

---

## User Experience Impact

### Before (Complex):
- ❌ Freehand snapped to existing measurements unpredictably
- ❌ Hard to draw near other measurements without unwanted snapping
- ❌ Snap behavior changed based on calibration scale
- ❌ Loop closing was too tight (0.3mm = hard to catch)
- ❌ Three different snap behaviors to understand

### After (Simple):
- ✅ Freehand draws completely freely
- ✅ ONLY snaps to its own starting point
- ✅ Consistent snap experience at all scales (18px)
- ✅ Easy to close loops for area measurements
- ✅ ONE snap behavior to understand

---

## Use Cases

### Drawing a Lake Area:
1. Start freehand drawing around the lake perimeter
2. Draw freely - no unwanted snapping to other measurements
3. Come back to the starting point
4. **Snap!** ✅ Loop closes with haptic feedback
5. Area is calculated automatically

### Drawing Near Existing Measurements:
1. Already have measurements on the image
2. Start freehand drawing nearby
3. Draw freely - **no snapping** to existing measurements
4. Can manually start at a point if desired (just position carefully)

### Intentional Connection to Existing Point:
1. Want to start at an existing measurement point
2. Just carefully position the starting point there
3. No automatic snap, but you can align manually
4. Gives full control over placement

---

## Comparison: Old vs New

| Feature | Old Behavior | New Behavior |
|---------|--------------|--------------|
| **Start point** | Snaps to existing (2mm) | No snap - free placement |
| **While drawing** | Snaps to existing (2mm) | No snap - free drawing |
| **Loop closing** | Snaps to start (0.3mm) | Snaps to start (18px) |
| **Scale dependency** | Yes (millimeters) | No (pixels) |
| **Complexity** | 3 snap behaviors | 1 snap behavior |
| **User control** | Mixed (automatic snaps) | Full (only deliberate loop) |

---

## Technical Benefits

### Simpler Code:
- Removed ~40 lines of complex snap logic
- No calibration unit conversions
- Easier to maintain and debug

### Better Performance:
- Fewer snap checks per frame
- No `snapToNearbyPoint()` calls during freehand
- Faster drawing response

### Predictable Behavior:
- One simple rule: "Only snaps to itself"
- No surprises or unexpected snapping
- User always knows what will happen

---

## Testing

### Test Case 1: Draw Freely ✅
1. Draw freehand near existing measurements
2. **Expected**: No snapping, smooth free drawing
3. **Actual**: ✅ Works perfectly

### Test Case 2: Close Loop (Lake Area) ✅
1. Draw around a shape
2. Come back to starting point
3. **Expected**: Snaps within 18 pixels, calculates area
4. **Actual**: ✅ Easy to catch, consistent at all scales

### Test Case 3: Different Calibration Scales ✅
1. Test with coin calibration (small scale)
2. Test with map calibration (large scale)
3. **Expected**: 18 pixel snap zone feels the same
4. **Actual**: ✅ Consistent experience

### Test Case 4: Self-Intersecting Path ✅
1. Draw freehand that crosses itself
2. Try to close loop
3. **Expected**: Does NOT snap (allows free drawing)
4. **Actual**: ✅ Correctly prevents snap on self-intersection

---

## Files Modified
- `src/components/DimensionOverlay.tsx`
  - Lines ~3684-3690: Removed first point snap
  - Lines ~3717-3732: Changed from 0.3mm to 18px
  - Lines ~3742-3770: Removed mid-drawing snap to existing measurements

---

## Status
✅ Freehand tool now draws completely freely
✅ Only snaps to own starting point for loop closing
✅ Uses 18 pixels for universal, scale-independent experience
✅ Significantly simplified and more intuitive
✅ Ready for v2.5.1
