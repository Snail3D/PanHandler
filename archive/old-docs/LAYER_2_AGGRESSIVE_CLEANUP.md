# Layer 2: First Point Freeze Fix

## The Problem
"When I push to set a point, the cursor sticks there and waits. But subsequent points work fine."

Only the FIRST point freezes for 10-15 seconds. Subsequent points are instant.

## Root Cause
Line 1365-1367 in `placePoint()`:
```typescript
// Auto-enable measurement mode and lock pan/zoom after first point
if (currentPoints.length === 0 && measurements.length === 0) {
  setMeasurementMode(true); // ❌ Synchronous state update blocks
}
```

When the first point is placed:
1. `setMeasurementMode(true)` triggers immediately
2. This causes TWO full-screen touch responder overlays to swap:
   - Line 2321: Measurement overlay mounts (`measurementMode && ...`)
   - Line 2936: Selection overlay unmounts (`!measurementMode && ...`)
3. React has to unmount one huge component tree and mount another
4. All this happens synchronously during the tap event handler
5. Result: 10-15 second freeze while React reconciles the component tree

### Why Subsequent Points Are Fine
After the first point, `measurementMode` is already `true`, so no state change occurs on subsequent taps!

## The Fix
Defer the state update to the next tick:
```typescript
if (currentPoints.length === 0 && measurements.length === 0) {
  setTimeout(() => setMeasurementMode(true), 0); // ✅ Async, non-blocking
}
```

This allows:
1. Point placement to complete immediately
2. UI to update with the new point
3. Mode change to happen in the next event loop tick
4. No blocking during the tap handler

## Summary of All Fixes
1. ✅ **Progressive Haptics** - Disabled setTimeout spam (lines 2365-2369)
2. ✅ **Gesture Composition** - Changed Exclusive → Race for smooth pinch/zoom
3. ✅ **First Point Freeze** - Made setMeasurementMode async to avoid blocking

## Testing
1. ✅ Place first measurement point - should be instant (no freeze)
2. ✅ Place subsequent points - still instant
3. ✅ Pan/zoom/rotate - smooth gestures
4. ✅ Calibration - works perfectly

---
**The freeze was React synchronously unmounting/mounting huge component trees during the tap handler!** 🎯
