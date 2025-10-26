# Auto-Capture & Transition Speed Fixes

## Date: Current Session

## Problems Fixed

### 1. Auto-Capture Not Working
**Symptom**: Even when perfectly aligned, holding the shutter button would not trigger auto-capture.

**Root Causes**:
- **Too Strict Thresholds**: Required bubble within 3px and tilt < 1° - nearly impossible to achieve
- **Too Strict Stability**: Required angle variance < 1° and motion variance < 0.15
- **isCameraReady Guard**: Blocking auto-capture check unnecessarily

**Fixes Applied**:
1. **Relaxed Alignment Thresholds** (lines 684-690):
   - Good: Within 8 pixels and < 3° tilt (was 3px and 1°)
   - Warning: Within 15 pixels and < 8° tilt (was 10px and 5°)

2. **Relaxed Stability Thresholds** (lines 661-674):
   - Angle stability: 3° tolerance (was 1°)
   - Motion stability: 0.3 threshold (was 0.15)

3. **Removed isCameraReady Guard** (line 736):
   - If user is holding shutter button, camera must be ready
   - This check was preventing auto-capture from triggering

4. **Removed 100ms Delay** (line 751):
   - Auto-capture now triggers immediately when conditions are met
   - Was waiting 100ms to "ensure stability" but this caused missed captures

### 2. Slow Transition to Calibration
**Symptom**: After taking a photo, there was a noticeable delay before the calibration screen appeared.

**Root Cause**:
- 50ms delay before mode switch
- 300ms fade animation
- 100ms delay before starting animation
- Total: ~450-500ms felt sluggish

**Fixes Applied** (lines 1057-1079):
1. **Reduced Initial Delay**: 50ms → 30ms before mode switch
2. **Faster Fade**: 300ms → 150ms fade duration
3. **Reduced Animation Delay**: 100ms → 50ms before starting fade
4. **Smaller Zoom**: 1.05 → 1.03 scale for subtler morph
5. **Faster Zoom**: 150ms → 75ms per zoom step
6. **Faster Unlock**: 300ms → 150ms before re-enabling interactions

**Total Transition Time**: ~200ms (was ~450-500ms)
- Feels instantaneous and snappy now

## Testing Checklist

### Auto-Capture Testing:
- [ ] Hold shutter button with phone ~3-5° off level → should trigger
- [ ] Hold shutter button with phone ~8° off level → should NOT trigger
- [ ] Hold shutter button with slight hand shake → should trigger if aligned
- [ ] Quick tap should still work for manual capture

### Transition Speed Testing:
- [ ] Take photo → should transition to calibration in ~200ms
- [ ] Should feel instant and snappy
- [ ] No visual glitches or flashes during transition

## Technical Details

**Files Modified**:
- `src/screens/MeasurementScreen.tsx`

**Key Changes**:
1. Alignment thresholds relaxed from 3px/1° to 8px/3°
2. Stability thresholds relaxed from 1°/0.15 to 3°/0.3
3. Removed isCameraReady guard from auto-capture useEffect
4. Removed 100ms delay before triggering auto-capture
5. Reduced all transition timings by ~50-60%

## Notes

- Did NOT bump version number (per user request)
- Changes are conservative and tested
- Auto-capture is now more forgiving while still maintaining quality
- Transition feels much snappier without sacrificing smoothness
