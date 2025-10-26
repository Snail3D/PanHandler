# Button Lag Fix - Complete ✅

## Date
October 16, 2025

## Issue
After rotating or panning gestures, UI buttons (especially Pan/Measure toggle) became unresponsive for 10-15 seconds. User described: "cursor sticks there and waits, then it all stacks in."

## Root Cause
The `modeSwitchGesture` in `DimensionOverlay.tsx` was using complex offset-based gesture configuration:
```typescript
.activeOffsetX([-15, 15])
.failOffsetY([-30, 30])
.shouldCancelWhenOutside(false)
```

This configuration made EVERY touch get evaluated by the gesture system immediately, creating competition between gestures and Pressable buttons, resulting in 10-15 second lag.

## The Solution
Reverted to the simple, proven configuration from v1.2/v1.69:
```typescript
.minDistance(20)
.shouldCancelWhenOutside(true)
```

### Why This Works
- **minDistance(20)**: Gesture doesn't activate until 20px of movement
- **Quick taps** (<20px movement): Go straight to buttons with zero delay
- **Deliberate swipes** (>20px movement): Activate the gesture system
- **No competition**: Clear separation between taps and swipes

## What Was Changed
**File**: `src/components/DimensionOverlay.tsx` (lines 2093-2097)

**Before (Broken)**:
```typescript
const modeSwitchGesture = Gesture.Pan()
  .activeOffsetX([-15, 15]) // Evaluates every touch immediately
  .failOffsetY([-30, 30])
  .shouldCancelWhenOutside(false)
  .maxPointers(1)
```

**After (Fixed)**:
```typescript
const modeSwitchGesture = Gesture.Pan()
  .minDistance(20) // Only activates after 20px movement
  .shouldCancelWhenOutside(true)
  .maxPointers(1)
```

## Expected Behavior

### Button Taps (< 20px movement)
1. ✅ User taps button
2. ✅ Gesture sees movement is less than 20px
3. ✅ Gesture doesn't activate at all
4. ✅ Button responds **instantly**

### Mode Swipes (> 20px movement)
1. ✅ User swipes 20+ pixels horizontally
2. ✅ Gesture activates
3. ✅ Bounce animation tracks finger
4. ✅ If swipe exceeds 30px threshold → mode changes with haptic feedback

## Testing Checklist

### Button Responsiveness (Should Be Instant)
- [ ] Pan button tap
- [ ] Measure button tap  
- [ ] Box button tap
- [ ] Circle button tap
- [ ] Angle button tap
- [ ] Line button tap
- [ ] Freehand button tap
- [ ] Metric/Imperial toggle
- [ ] Map toggle
- [ ] **Test after panning/rotating** - buttons should still respond instantly

### Swipe Functionality (Should Still Work)
- [ ] Swipe left 30px+ on mode buttons → Next mode
- [ ] Swipe right 30px+ on mode buttons → Previous mode
- [ ] Bounce animation visible during swipe
- [ ] Medium haptic feedback on mode change

## Investigation Journey

We tried many approaches before finding the root cause:
1. ❌ Debounce strategy (50ms cooldown after gestures)
2. ❌ Removed progressive haptics (eliminated setTimeout spam)
3. ❌ Changed Gesture.Exclusive → Race
4. ❌ Disabled touch responders entirely
5. ❌ Added useMemo for SVG rendering optimization
6. ✅ **Reverted gesture configuration to v1.2 simple approach**

## Key Lesson
**Simple is better.** Complex gesture configurations like `activeOffsetX`/`failOffsetY` create race conditions and unpredictable behavior. The `minDistance` approach is clean, reliable, and conflict-free.

## Version Reference
- **v1.2**: Original working version with `minDistance(20)`
- **v1.65-v1.68**: Various "improvements" that broke button responsiveness
- **v1.69**: Restored v1.2 configuration (documented in BUTTON_FIX_V1.69_RESTORE_V1.2.md)
- **v1.72**: Had button lag issue
- **Current**: Fixed with v1.69 configuration

---

**Status**: ✅ Fix applied and ready for testing
