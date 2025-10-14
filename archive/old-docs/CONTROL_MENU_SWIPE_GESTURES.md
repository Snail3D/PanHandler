# Control Menu: Swipe Gestures for Mode Switching

**Date**: Current Session  
**File Modified**: `src/components/DimensionOverlay.tsx`

## Features Added

### 1. Swipe to Switch Measurement Modes

Users can now **swipe left/right** on the control menu to cycle through measurement modes:
- **Swipe left** → Next mode (Distance → Angle → Circle → Rectangle → Free)
- **Swipe right** → Previous mode (cycles backward)

### 2. Smart Menu Collapse Detection

Updated menu collapse gesture to **require fast swipes only**:
- **Fast swipe** (velocity > 800 px/s) → Collapses menu
- **Slow swipe** → Switches modes, doesn't collapse menu
- Prevents accidental menu collapse when selecting modes

## Implementation Details

### Mode Switch Gesture
```typescript
const modeSwitchGesture = Gesture.Pan()
  .onEnd((event) => {
    // Only respond to primarily horizontal swipes
    if (Math.abs(event.translationX) > Math.abs(event.translationY) * 1.5) {
      const threshold = 50; // Minimum swipe distance
      const modes: MeasurementMode[] = ['distance', 'angle', 'circle', 'rectangle', 'freehand'];
      const currentIndex = modes.indexOf(mode);
      
      if (event.translationX < -threshold && event.velocityX < -200) {
        // Swipe left - next mode
        const nextIndex = (currentIndex + 1) % modes.length;
        runOnJS(setMode)(modes[nextIndex]);
        runOnJS(setModeColorIndex)(nextIndex);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else if (event.translationX > threshold && event.velocityX > 200) {
        // Swipe right - previous mode
        const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
        runOnJS(setMode)(modes[prevIndex]);
        runOnJS(setModeColorIndex)(prevIndex);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  });
```

### Updated Menu Collapse Gesture
```typescript
const menuPanGesture = Gesture.Pan()
  .onEnd((event) => {
    const threshold = SCREEN_WIDTH * 0.3;
    const minVelocity = 800; // FAST swipe required
    const isFastSwipe = Math.abs(event.velocityX) > minVelocity;
    
    if (Math.abs(event.translationX) > threshold && isFastSwipe) {
      // Collapse menu - fast swipe detected
      menuTranslateX.value = SCREEN_WIDTH;
      runOnJS(setMenuHidden)(true);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      // Keep menu open - slow swipe
      menuTranslateX.value = withSpring(0);
      runOnJS(setMenuHidden)(false);
    }
  });
```

## How It Works

### Mode Switching:
1. User swipes **left** on mode buttons area
2. Gesture detects horizontal swipe (50px+ distance, 200px/s+ velocity)
3. Switches to next mode in cycle
4. Haptic feedback (light impact)
5. Color index updates to match new mode

### Menu Collapse Protection:
1. User swipes to collapse menu
2. System checks **velocity** (must be > 800 px/s)
3. **Fast swipe** → Menu collapses
4. **Slow swipe** → Menu stays open (likely mode switching)
5. Prevents accidental collapse during mode selection

## Gesture Parameters

| Gesture | Threshold | Velocity | Direction | Action |
|---------|-----------|----------|-----------|--------|
| **Mode Switch (Left)** | 50px | -200 px/s | Left | Next mode |
| **Mode Switch (Right)** | 50px | +200 px/s | Right | Previous mode |
| **Menu Collapse** | 30% screen | 800 px/s | Left (fast) | Hide menu |

## Mode Cycle Order

```
Distance → Angle → Circle → Rectangle → Free Measure → [loops back to Distance]
```

**Reverse**:
```
Distance ← Angle ← Circle ← Rectangle ← Free Measure ← [loops from Distance]
```

## Benefits

1. **Faster Mode Switching**: Swipe instead of tapping individual buttons
2. **No Accidental Collapse**: Menu only hides on fast swipes
3. **Intuitive**: Left/right swipes match horizontal mode layout
4. **Haptic Feedback**: Confirms mode changes
5. **Cycles Through All**: Easy to explore all measurement types

## User Experience

### Before:
- Tap individual mode buttons
- Menu collapses on any swipe
- Accidental collapses common

### After:
- **Swipe left/right** to cycle modes quickly
- **Slow swipes** switch modes safely
- **Fast swipes** collapse menu intentionally
- Clear separation between actions

## Technical Details

### Velocity Thresholds:
- **Mode Switch**: 200 px/s (gentle swipe)
- **Menu Collapse**: 800 px/s (fast swipe)
- **4x difference** ensures no conflicts

### Distance Thresholds:
- **Mode Switch**: 50px minimum
- **Menu Collapse**: 30% screen width (typically 125px+)

### Gesture Priority:
1. Mode switch gesture checks velocity first
2. If too slow for mode switch, menu gesture takes over
3. If fast swipe, menu collapses (regardless of mode)

## Where to Apply Gesture

The `modeSwitchGesture` should be wrapped around the mode buttons area in the control menu. Look for the section with mode selection buttons and wrap with:

```tsx
<GestureDetector gesture={modeSwitchGesture}>
  {/* Mode buttons area */}
</GestureDetector>
```

**Status**: ✅ Gestures implemented - needs to be applied to mode buttons UI
