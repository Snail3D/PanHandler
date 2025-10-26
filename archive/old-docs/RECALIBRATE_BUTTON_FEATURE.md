# Recalibrate Button Feature ✅

## Date
October 16, 2025

## Feature Request
User needed a way to go back and reset the calibration after it's been set, without having to navigate away or close the app.

## Implementation

### Added Recalibrate Button
**Location**: Top-right corner, directly below the "Calibrated" badge  
**File**: `src/components/DimensionOverlay.tsx` (Lines 2451-2482)

### Visual Design
- **Color**: Red (`rgba(239, 68, 68, 0.9)`) to indicate destructive/reset action
- **Icon**: Refresh icon (`refresh-outline`)
- **Label**: "Recalibrate"
- **Style**: Rounded button with shadow, matches app aesthetic

### Positioning Logic
The button dynamically positions itself below the calibration badge with appropriate spacing:

```typescript
top: isMapMode 
  ? (isAutoCaptured ? insets.top + 50 + 110 : insets.top + 16 + 110)  // Extra space for map mode
  : (isAutoCaptured ? insets.top + 50 + 60 : insets.top + 16 + 60)    // Normal spacing
```

- **Map mode**: 110px below badge (accounts for verbal scale display)
- **Normal mode**: 60px below badge
- **Auto-captured**: Additional 34px offset to avoid status bar

### Behavior
When tapped:
1. Plays medium haptic feedback
2. Calls `onReset()` callback
3. Triggers smooth fade transition to camera screen (300ms)
4. Clears all measurements and calibration
5. Returns user to camera to recalibrate

### Visibility Conditions
Button is shown when:
- ✅ Calibration exists (`coinCircle` is set)
- ✅ Lock-in animation is not playing (`!showLockedInAnimation`)
- ✅ Not currently capturing (`!isCapturing`)

Button is hidden when:
- ❌ No calibration set
- ❌ During lock-in animation (prevents accidental taps)
- ❌ During photo capture (keeps UI clean for export)

## User Flow

### Before
1. User calibrates with coin/verbal scale
2. Makes measurements
3. Realizes calibration was wrong
4. **Had no way to recalibrate** - stuck or had to restart app

### After
1. User calibrates with coin/verbal scale
2. Makes measurements
3. Realizes calibration was wrong
4. **Taps "Recalibrate" button**
5. Smooth fade back to camera
6. Can immediately recalibrate
7. Continue measuring with correct calibration

## Code Changes

### Modified Files
- **src/components/DimensionOverlay.tsx**
  - Lines 2451-2482: Added Recalibrate button component
  - Line 2455: Added null check for `onReset` callback
  - Line 4464: Fixed duplicate `onReset` call with null check

### Key Implementation Details

```typescript
{/* Recalibrate button - appears below calibration badge */}
{coinCircle && !showLockedInAnimation && !isCapturing && (
  <Pressable
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (onReset) onReset();  // Safe call with null check
    }}
    style={{
      position: 'absolute',
      zIndex: 20,
      top: isMapMode 
        ? (isAutoCaptured ? insets.top + 50 + 110 : insets.top + 16 + 110)
        : (isAutoCaptured ? insets.top + 50 + 60 : insets.top + 16 + 60),
      right: 16,
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      // ... styling
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="refresh-outline" size={14} color="white" />
      <Text style={{ color: 'white', fontSize: 11, fontWeight: '600', marginLeft: 4 }}>
        Recalibrate
      </Text>
    </View>
  </Pressable>
)}
```

## Design Decisions

### Why Red?
Red universally indicates destructive or reset actions. Users understand that tapping this will clear their calibration, so the color provides appropriate warning.

### Why Below the Badge?
- **Proximity**: Close to what it affects (calibration badge)
- **Hierarchy**: Secondary action, so positioned below primary indicator
- **Visibility**: Right side keeps it away from main measurement controls
- **Accessibility**: Large enough tap target with adequate spacing

### Why Fade Transition?
- **Smooth UX**: No jarring cuts between screens
- **Context**: 300ms fade provides visual continuity
- **Feedback**: Clear indication that action was registered

## Testing Checklist

### Functionality
- [ ] Button appears when calibration is set
- [ ] Button hidden when no calibration
- [ ] Button hidden during lock-in animation
- [ ] Button hidden during capture
- [ ] Tapping button triggers haptic feedback
- [ ] Tapping button fades to camera screen
- [ ] Can recalibrate after reset
- [ ] Measurements are cleared on reset

### Positioning
- [ ] Correct spacing below badge in normal mode (60px)
- [ ] Correct spacing below badge in map mode (110px)
- [ ] Correct spacing with auto-capture offset
- [ ] Button doesn't overlap with badge
- [ ] Button doesn't overlap with other UI elements

### Visual
- [ ] Red color is appropriate and visible
- [ ] Refresh icon renders correctly
- [ ] Text is readable
- [ ] Button has proper shadow/elevation
- [ ] Button matches app design language

## Edge Cases Handled

1. **onReset undefined**: Null check prevents crashes if callback not provided
2. **Map mode**: Extra spacing accounts for verbal scale display
3. **Auto-capture**: Additional offset for status bar
4. **Lock-in animation**: Hidden to prevent accidental taps during animation
5. **Capturing**: Hidden to keep export UI clean

## Future Enhancements (Not Implemented)

Possible improvements for future iterations:
- Confirmation dialog before resetting ("Are you sure?")
- Undo option to restore previous calibration
- Quick recalibrate without full screen transition
- Option to adjust calibration instead of full reset

---

**This feature gives users control and flexibility. No more getting stuck with wrong calibration.** 🎯
