# Freeze Debug Test

## Current Test
**Completely removed GestureDetector to isolate the freeze**

### Changes
1. `ZoomableImageV2.tsx` line 239-259: Conditional GestureDetector
   - When `locked=true`: No GestureDetector, just Image
   - When `locked=false`: GestureDetector wraps Image

2. `MeasurementScreen.tsx` line 167: Force locked
   ```typescript
   const isPanZoomLocked = true; // TEMP TEST
   ```

### What This Tests
- **If placing points is NOW instant**: GestureDetector was causing the queue/freeze
- **If placing points STILL freezes**: Problem is in DimensionOverlay touch handlers

### If GestureDetector Is The Problem
Solutions:
1. Only enable GestureDetector when NOT in measurement mode
2. Use a different gesture composition (Exclusive instead of Race)
3. Add `simultaneousHandlers` to allow DimensionOverlay touches through

### If DimensionOverlay Is The Problem
Need to optimize:
- `onResponderGrant` (lines 2325-2418) - lots of processing
- `onResponderMove` (lines 2419+) - called on every pixel moved
- State updates causing re-renders

## Test Now
1. Take photo & calibrate
2. Switch to Measure mode
3. Tap to place a point
4. **Does it freeze for 10-15 seconds?**
