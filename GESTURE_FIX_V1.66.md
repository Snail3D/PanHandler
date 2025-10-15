# Gesture Fix - v1.66

## Date
October 15, 2025

## Issues Fixed

### 1. ✅ Mode Selection Swipe Gesture (CRITICAL FIX)
**Problem**: Swipe left/right on mode buttons (Box, Circle, Angle, Distance, Freehand) was completely broken - no bounce animation, no mode switching.

**Root Cause**: 
- Conflicting gesture activation requirements in `modeSwitchGesture`
- `activeOffsetX([-20, 20])` - Activates when movement goes OUTSIDE ±20px
- `failOffsetX([-10, 10])` - Fails when movement goes OUTSIDE ±10px
- **This is contradictory!** When swiping 15px, it triggered `failOffsetX` (15 > 10) which cancelled the gesture before it could activate at 20px

**Solution**:
```typescript
const modeSwitchGesture = Gesture.Pan()
  .activeOffsetX([-15, 15]) // Activate on 15px horizontal movement
  .failOffsetY([-30, 30]) // Fail if too much vertical movement
  .shouldCancelWhenOutside(false) // Be forgiving if finger drifts
  .maxPointers(1)
```

**Changes Made**:
- ✅ Removed `failOffsetX` entirely (was blocking gesture activation)
- ✅ Reduced `activeOffsetX` from ±20px to ±15px for faster response
- ✅ Added `failOffsetY` to prevent accidental vertical swipes
- ✅ Changed `shouldCancelWhenOutside` to `false` for more forgiving gesture detection
- ✅ Removed `minDistance(40)` which was delaying gesture start

**Expected Behavior**:
- Swipe left on mode buttons → Switch to next mode with bounce animation
- Swipe right on mode buttons → Switch to previous mode with bounce animation
- Visual feedback: `modeSwipeAnimatedStyle` applies `translateX` with 30% dampening
- Haptic feedback on successful mode change

---

### 2. ✅ Menu Collapse Gesture (FLUIDITY FIX)
**Problem**: Menu collapse via swipe gesture worked but felt sluggish and unresponsive.

**Root Cause**:
- `minDistance(40)` prevented gesture from starting until 40px movement
- `minVelocity = 800` required very fast swipes
- Both conditions together made gesture feel delayed and difficult

**Solution**:
```typescript
const menuPanGesture = Gesture.Pan()
  .activeOffsetX([-20, 20]) // Activate on 20px horizontal movement
  .failOffsetY([-40, 40]) // Fail if too much vertical movement
  .enableTrackpadTwoFingerGesture(false)
  .onEnd((event) => {
    const threshold = SCREEN_WIDTH * 0.25; // Reduced from 0.3
    const minVelocity = 600; // Reduced from 800
    const isFastSwipe = Math.abs(event.velocityX) > minVelocity;
    
    // Allow EITHER fast swipe OR long drag
    if ((Math.abs(event.translationX) > threshold && isFastSwipe) || 
        Math.abs(event.translationX) > SCREEN_WIDTH * 0.5) {
      // Hide menu
    }
  })
```

**Changes Made**:
- ✅ Removed `minDistance(40)` - gesture now starts immediately
- ✅ Replaced with `activeOffsetX([-20, 20])` for 20px activation
- ✅ Added `failOffsetY([-40, 40])` to prevent accidental vertical swipes
- ✅ Reduced `minVelocity` from 800 → 600 pixels/second
- ✅ Reduced threshold from 30% → 25% of screen width
- ✅ Added fallback: OR condition allows 50% screen drag without velocity requirement

**Expected Behavior**:
- Swipe left/right on menu → Menu follows finger in real-time
- Fast swipe (>600 px/s) at 25% screen width → Menu collapses
- Slow drag to 50% screen width → Menu collapses even without velocity
- More responsive and forgiving gesture detection

---

## Technical Details

### Gesture Activation Logic
**activeOffsetX**: Gesture activates when movement goes OUTSIDE the range
- `[-15, 15]` means activate when X movement < -15 OR > 15

**failOffsetY**: Gesture fails when movement goes OUTSIDE the range
- `[-30, 30]` means fail when Y movement < -30 OR > 30

### Files Modified
- `src/components/DimensionOverlay.tsx` (lines 2089-2194)
  - `menuPanGesture` (lines 2089-2127)
  - `modeSwitchGesture` (lines 2129-2194)

---

## Testing Checklist

### Mode Selection Swipe
- [ ] Swipe left on mode buttons → Next mode
- [ ] Swipe right on mode buttons → Previous mode
- [ ] Bounce animation visible during swipe
- [ ] Haptic feedback on mode change
- [ ] Buttons still tappable (gesture doesn't block taps)
- [ ] Skips Freehand mode if not Pro user

### Menu Collapse
- [ ] Swipe left on menu → Menu slides right (collapses)
- [ ] Swipe right on menu → Menu slides left (collapses)
- [ ] Fast swipe at 25% screen → Collapses
- [ ] Slow drag to 50% screen → Collapses
- [ ] Menu follows finger during gesture
- [ ] Haptic feedback on collapse
- [ ] Tab appears on right side after collapse

---

## Version History
- **v1.65** - Gesture problems introduced when adding `failOffset` to fix button lock-up
- **v1.66** - Fixed gesture conflicts, improved fluidity (this version)
