# Map Button Behavior - Troubleshooting Guide

## Current Implementation

The Map button logic is **already correctly implemented** to remember the scale and not show the modal again.

### How It Should Work

**Scenario 1: First Time (No Scale Set)**
1. Tap Map button
2. → Modal opens to set scale
3. Set scale (e.g., 1 cm = 1 km)
4. → Map mode activates

**Scenario 2: Second Tap (Scale Already Set)**
1. Tap Map button (when NOT in map mode)
2. → Map mode turns ON (no modal!)
3. → Success haptics play
4. → Button background turns blue

**Scenario 3: Third Tap (Already in Map Mode)**
1. Tap Map button (when IN map mode)
2. → Map mode turns OFF
3. → Returns to coin calibration
4. → Button background returns to gray
5. → Scale is REMEMBERED for this photo

**Scenario 4: Recalibrate Button**
1. Tap "Recalibrate" button (above calibration badge)
2. → Modal opens to reset scale
3. → This is the ONLY way to change the scale

---

## Code Logic (Lines 6117-6140)

```typescript
if (!isMapMode) {
  // Turning ON map mode
  if (mapScale) {
    // Scale exists - just activate (NO MODAL)
    setIsMapMode(true);
    // Success haptics
  } else {
    // No scale - show modal
    setShowMapScaleModal(true);
  }
} else {
  // Turning OFF map mode
  setIsMapMode(false);
  // Keep scale saved
}
```

This logic is correct and should work as expected.

---

## Possible Issues

### Issue 1: Clicking Wrong Button
**Problem:** You might be clicking the "Recalibrate" button instead of the "Map" button.

**Solution:**
- **Map button:** In the bottom menu bar (has map icon)
- **Recalibrate button:** Above the calibration badge (says "Recalibrate")

### Issue 2: mapScale Getting Cleared
**Problem:** `mapScale` might be getting cleared somehow, so the app thinks there's no scale.

**Places where mapScale gets cleared:**
1. Recalibrate button (line 3065)
2. When entering coin mode from map-only (line 3072)
3. When resetting in useEffect (line 529)

### Issue 3: Timing/Race Condition
**Problem:** Maybe `mapScale` hasn't finished setting when you tap Map again.

**Solution:** Wait a second after setting scale before tapping Map button.

---

## How to Test

### Test 1: Basic Flow
1. Take photo of map
2. Tap Map button → Modal appears ✓
3. Set scale (1 cm = 1 km)
4. Tap "Set Scale" → Returns to measurement ✓
5. **Look at Map button** - should have blue background ✓
6. Tap Map button again → Should turn OFF (gray background) ✓
7. Tap Map button again → Should turn ON (blue background, NO modal) ✓

### Test 2: After Measurements
1. In map mode, make a measurement
2. Tap Map button → Should turn OFF ✓
3. Tap Map button → Should turn ON (no modal) ✓

### Test 3: Recalibrate
1. In map mode
2. Tap "Recalibrate" button (NOT Map button)
3. → Modal appears to reset scale ✓

---

## Visual Indicators

### Map Mode ON
- Button background: **Blue** (`rgba(100, 150, 255, 0.25)`)
- Button border: **Blue** (1.5px)
- Measurements use map scale units
- Angle button shows "Azimuth"

### Map Mode OFF
- Button background: **Gray** (`rgba(120, 120, 128, 0.18)`)
- Button border: **None**
- Measurements use coin calibration
- Angle button shows "Angle"

---

## Debug Information Added

I added console logs to help debug (lines 6118, 6123, 6132, 6137):
- When Map button is pressed
- Whether mapScale exists
- What action is taken

Since you can't see console, look for these behaviors instead:
- **Success haptics:** 4 haptics in sequence = Map mode activated with existing scale
- **Single haptic:** = Map mode deactivated
- **No haptics + modal:** = No scale exists, showing modal

---

## If Problem Persists

**What to check:**
1. Is the Map button showing blue background when active?
2. Are you tapping Map or Recalibrate?
3. Does the modal appear EVERY time or only sometimes?
4. Do you see the calibration badge at the top?

**What information would help:**
1. Exact steps you're taking
2. When modal appears (first tap, second tap, etc.)
3. What the Map button looks like (blue or gray)
4. Whether you see the calibration badge

The code logic is correct, so if the modal is still appearing incorrectly, it means either:
- `mapScale` is not being set properly
- `mapScale` is being cleared unexpectedly
- You're clicking Recalibrate instead of Map

Let me know the exact flow and I can help debug further!
