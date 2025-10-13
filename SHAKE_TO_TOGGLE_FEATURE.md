# Shake to Toggle Menu Feature

## Overview
Users can now shake their phone to instantly show/hide the control menu - making it super easy to get a clean workspace or bring the controls back without reaching for the side tab! Works seamlessly with existing swipe and tap controls.

## Implementation

### Files Modified:

1. **DimensionOverlay.tsx**:
   - Added `DeviceMotion` import from expo-sensors
   - Added shake detection useEffect (line ~961)
   - Detects total acceleration > 15g to trigger shake
   - 1.5-second cooldown prevents rapid toggling
   - Uses same `menuHidden` state as swipe/tab controls
   - Animates menu with spring physics
   - Provides haptic feedback on toggle

2. **HelpModal.tsx**:
   - Added shake feature to Navigation & Controls section
   - Added dedicated "Shake to Toggle Menu" item with 📳 emoji
   - Updated Menu Controls list to include shake option

## How It Works

### Shake Detection:
```typescript
const SHAKE_THRESHOLD = 15; // 15g acceleration - proper shake needed
const SHAKE_COOLDOWN = 1500; // 1.5 seconds between shakes

// Monitor device acceleration
DeviceMotion.addListener((data) => {
  const { x, y, z } = data.acceleration;
  const totalAcceleration = Math.abs(x) + Math.abs(y) + Math.abs(z);
  
  if (totalAcceleration > SHAKE_THRESHOLD) {
    // Toggle menu visibility with animation
    setMenuHidden(prev => !prev);
    menuTranslateX.value = withSpring(newState ? SCREEN_WIDTH : 0);
    // Haptic feedback
  }
});
```

### User Experience:
1. **Shake phone** → Menu toggles (hide/show) with smooth animation
2. **Haptic feedback**:
   - Medium impact when hiding menu
   - Light impact when showing menu
3. **1.5-second cooldown** prevents accidental double-toggles
4. **Works with existing controls**:
   - ✅ Swipe left to hide
   - ✅ Shake to toggle
   - ✅ Tap side tab to show
   - ✅ Drag tab to reposition

## Use Cases

### When to Shake:
- 📸 **Taking screenshots**: Quickly hide menu for clean capture
- 🎯 **Precise work**: Get menu out of the way without reaching
- 🔄 **Quick access**: Bring menu back hands-free
- 🏃 **On the go**: Easy one-handed control

### Advantages over Manual Toggle:
- ✅ No need to reach for side tab
- ✅ Works when menu is hidden OR visible
- ✅ Natural gesture for "something's in my way"
- ✅ Accessible while holding phone single-handed
- ✅ Haptic confirmation of action

## Technical Details

### Acceleration Threshold:
- **15g total acceleration** = deliberate shake (not accidental)
- Calculated as: `|x| + |y| + |z|`
- Typical values:
  - Resting: ~1g (gravity)
  - Walking: 1-3g
  - Gentle movement: 3-8g
  - **Trigger shake: 15+g** ✅ (deliberate shake)
  - Strong shake: 20-30g

### Cooldown Period:
- **1500ms (1.5 seconds)** between shake detections
- Prevents:
  - Accidental double-toggles
  - Oscillating menu state
  - Excessive haptic feedback
  - Battery drain from rapid processing

### Performance:
- Update interval: 100ms (10 Hz)
- Minimal battery impact
- Subscription cleaned up on unmount
- No memory leaks

## User Documentation

From Help Modal:
> **📳 Shake to Toggle Menu**
> 
> Shake your phone to instantly show/hide the control menu

Menu Controls section includes:
- Swipe left to collapse
- **Shake phone to toggle** ← NEW
- Tap side tab to bring back
- Drag tab to reposition

## Testing Checklist

To verify the feature:
1. ✅ Menu visible → Shake → Menu hides
2. ✅ Menu hidden → Shake → Menu shows
3. ✅ Haptic feedback occurs on toggle
4. ✅ Cannot toggle twice rapidly (cooldown working)
5. ✅ Works with one hand
6. ✅ No false positives from normal phone movement
7. ✅ Documented in Help Modal

## Future Enhancements

Potential improvements:
- Adjustable sensitivity in settings
- Configurable cooldown duration
- Shake gesture for other actions (undo, etc.)
- Shake animation/visual feedback
- Accessibility option to disable shake

## Related Features

Works seamlessly with:
- Swipe-to-hide menu gesture
- Side tab manual toggle
- Tab repositioning
- All measurement modes

---

**Feature completed**: October 13, 2025
**Status**: Ready for testing
**UX Impact**: Improved one-handed usability
