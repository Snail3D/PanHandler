# PanHandler v1.72 - Current State Reference

## Quick Stats
- **Version**: 1.72
- **Date**: October 15, 2025
- **Status**: Stable - All major gestures working
- **Last Session**: Evening bug fix marathon

---

## What's Working ✅

### Gestures
- ✅ Mode selection swipe (left/right on mode buttons)
- ✅ All button taps (instant, no stickiness)
- ✅ Pan/zoom/rotate while measuring (2 fingers)
- ✅ Pinch zoom (always available)
- ✅ 2-finger pan (always available)
- ✅ Rotation (always available)

### Measurements
- ✅ Distance/Line measurements
- ✅ Angle measurements (including azimuth in map mode)
- ✅ Circle measurements (with diameter and area)
- ✅ Rectangle measurements (with dimensions and area)
- ✅ Freehand drawing (smooth lines, lasso snap at 0.3mm)

### Calibration
- ✅ Coin calibration (supports all common coins)
- ✅ Verbal scale calibration (for maps)
- ✅ Auto-leveling (with badge)
- ✅ Badge persistence (shows until new photo)

### Unit System
- ✅ Metric ↔ Imperial switching
- ✅ Labels update instantly (both legend and on-screen)
- ✅ All measurement types convert correctly

### UI/UX
- ✅ Menu collapse (button only - clean and reliable)
- ✅ Side tab for showing menu
- ✅ Legend with color-coded measurements
- ✅ Haptic feedback (appropriate for each action)
- ✅ Pro mode toggle (Freehand tool gated)

---

## Key Behaviors

### Finger Gestures
- **1 finger**: Place/edit measurement points, tap buttons
- **2 fingers**: Pan, zoom, rotate image
- **Pinch**: Zoom in/out
- **Rotate**: Two-finger rotation

### Menu Control
- **"Hide menu" button**: Collapse menu to side
- **Side tab**: Bring menu back
- **No swipe gestures**: Removed for stability

### Measurement Modes
- **Pan mode**: Navigate and edit measurements
- **Measure mode**: Place new measurements
- Toggle between modes with buttons

### Calibration Persistence
- **Coin calibration**: Persists until new photo
- **Verbal scale**: Persists until new photo (badge shows it)
- **Clear measurements**: Does NOT clear calibration

---

## Recent Fixes (v1.66-v1.72)

### v1.66 - Mode Selection Gesture
Fixed swipe to switch between measurement modes.

### v1.67-v1.68 - Menu Simplification  
Removed complex swipe gestures, button-only control.

### v1.69 - Button Stickiness
Restored v1.2 gesture config for instant button response.

### v1.70 - Label Switching
Fixed on-screen labels to update when changing unit systems.

### v1.71 - Badge Visibility
Map scale badge now shows when using verbal calibration.

### v1.72 - Pan While Measuring
Re-enabled 2-finger navigation even when measuring.

---

## File Structure

### Core Components
```
src/components/
├── DimensionOverlay.tsx      # Main measurement UI (6118 lines)
├── ZoomableImageV2.tsx        # Gesture handling for image
├── CoinTracer.tsx             # Coin calibration overlay
├── ZoomCalibration.tsx        # Initial calibration screen
├── HelpModal.tsx              # Help/documentation modal
├── LabelModal.tsx             # Measurement labeling
└── EmailPromptModal.tsx       # Email export
```

### Screens
```
src/screens/
├── CameraScreen.tsx           # Photo capture
└── MeasurementScreen.tsx      # Main measurement screen
```

### State Management
```
src/state/
└── measurementStore.ts        # Zustand store with AsyncStorage
```

---

## Known Patterns

### Gesture Configuration (Current Best Practice)
```typescript
// Mode switch - use minDistance for clear threshold
const modeSwitchGesture = Gesture.Pan()
  .minDistance(20) // Don't activate until 20px movement
  .shouldCancelWhenOutside(true)
  .maxPointers(1)

// Image pan - use minPointers for finger count requirement
const panGesture = Gesture.Pan()
  .enabled(true) // Always enabled
  .minPointers(2) // Require 2 fingers (prevents conflict with measurements)
```

### Label Display (Current Best Practice)
```typescript
// Recalculate on render for accurate unit display
{measurement.mode === 'distance'
  ? calculateDistance(measurement.points[0], measurement.points[1])
  : measurement.value
}
```

### State Persistence (Current Pattern)
```typescript
// Clear on new photo
useEffect(() => {
  setMapScale(null);
  setIsMapMode(false);
}, [currentImageUri]);

// Persist through measurement clears
const handleClear = () => {
  setMeasurements(measurements.slice(0, -1));
  // Does NOT clear mapScale, coinCircle, etc.
};
```

---

## Common Issues & Solutions

### Buttons Feel Sticky/Unresponsive
**Solution**: Check gesture `minDistance` - should be 20px minimum. Don't use activeOffset/failOffset.

### Labels Don't Update When Changing Units
**Solution**: Recalculate on render, don't just display stored value.

### Badge Disappears Unexpectedly
**Solution**: Check ALL conditions that should show badge (coin OR map scale).

### Can't Navigate While Measuring
**Solution**: Use `minPointers(2)` instead of `.enabled(!locked)`.

---

## Development Guidelines

### When Adding Gestures
1. Use `minDistance` for thresholds (not activeOffset/failOffset)
2. Use `minPointers` for finger requirements
3. Keep gestures simple - trust the system
4. Test with rapid finger changes

### When Displaying Data
1. Check if data needs recalculation on render
2. If multiple display locations, ensure consistency
3. Add debug logging for troubleshooting
4. Consider performance for expensive calculations

### When Managing State
1. Clear on new photo (currentImageUri change)
2. Persist through measurement operations
3. Use refs for tracking previous values
4. Document what persists vs. what clears

---

## Testing Checklist

### Gestures
- [ ] Tap each button - instant response?
- [ ] Swipe mode buttons - switches smoothly?
- [ ] 2-finger pan while measuring - works?
- [ ] Pinch zoom while measuring - works?
- [ ] Rapid finger changes - no confusion?

### Measurements
- [ ] Place distance measurement
- [ ] Place angle measurement  
- [ ] Place circle measurement
- [ ] Place rectangle measurement
- [ ] Draw freehand path

### Unit Switching
- [ ] Create measurements in Metric
- [ ] Switch to Imperial - all labels update?
- [ ] Switch back - original values?

### Calibration
- [ ] Set coin calibration - badge shows?
- [ ] Set verbal scale - badge shows?
- [ ] Clear measurements - badge persists?
- [ ] New photo - badge clears?

---

## Next Priorities

### High
- User testing on all fixes
- Monitor for gesture regressions
- Performance testing with many measurements

### Medium  
- Code cleanup (unused variables)
- Additional edge case testing
- Consider memo-izing calculations

### Low
- Unified display value function
- Additional unit tests
- Performance profiling

---

## Documentation Files

All in root directory:
- `SESSION_SUMMARY_OCT15_EVENING.md` - This session
- `GESTURE_FIX_V1.66.md` - Mode selection fix
- `SIMPLIFIED_MENU_V1.68.md` - Menu simplification
- `BUTTON_FIX_V1.69_RESTORE_V1.2.md` - Button stickiness fix
- `LABEL_UPDATE_FIX_V1.70.md` - Label switching fix
- `MAP_SCALE_BADGE_FIX_V1.71.md` - Badge visibility fix
- `PAN_ZOOM_WHILE_MEASURING_V1.72.md` - Navigation fix

---

## Git Status

**Last Commit**: docs: Evening session summary (v1.66-v1.72)  
**Branch**: main  
**Status**: Clean working directory  
**Ready For**: Continued development

---

## Quick Command Reference

```bash
# Start dev server (already running in docker)
# Port 8081 is auto-managed

# Clear cache
bun run clear-cache

# Check git status  
git status

# View recent commits
git log --oneline -10

# Check TypeScript (may run out of memory)
npx tsc --noEmit
```

---

**Last Updated**: October 15, 2025, Evening Session  
**Version**: 1.72  
**Status**: ✅ Stable & Ready
