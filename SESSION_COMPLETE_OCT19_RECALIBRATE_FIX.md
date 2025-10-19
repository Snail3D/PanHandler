# Session Complete: Oct 19 - Recalibrate Button Fix

## Issues Fixed

### 1. Blueprint Pin Placement Touch Blocking ✅
**Problem:** Users couldn't pan/zoom when blueprint modal was visible, and couldn't place pins after clicking "READY - PLACE PINS"

**Root Cause:** Touch overlay at line 4146 was blocking all touches when `!measurementMode && measurements.length > 0`

**Solution:** Added conditions to exclude overlay when blueprint modal is showing:
```tsx
{!measurementMode && measurements.length > 0 && !showBlueprintPlacementModal && !isPlacingBlueprint && (
```

### 2. Map Mode Recalibrate Going to Wrong Screen ✅
**Problem:** When in map mode (after using verbal/coin calibration), clicking "Recalibrate" incorrectly went back to coin calibration screen instead of reopening the map scale modal.

**Root Cause:** Recalibrate logic had oversimplified scenarios that treated "map + any calibration" the same way.

**Solution:** Refined recalibrate logic to handle 6 distinct scenarios:

#### Old Logic (Broken)
```tsx
// Scenario 1: Map scale ONLY → Reopen map modal ✅
// Scenario 2: Map + ANY calibration → Go to coin screen ❌ 
// Scenario 3: Calibration ONLY → Go to coin screen
```

#### New Logic (Fixed)
```tsx
// Scenario 1: Map scale ONLY → Reopen map modal ✅
// Scenario 2: Map + Verbal → Reopen map modal ✅ (NEW!)
// Scenario 3: Map + Coin → Go to coin screen ✅
// Scenario 4: Coin ONLY → Go to coin screen ✅
// Scenario 5: Verbal ONLY → Go to camera ✅
// Scenario 6: Unknown → Go to coin screen (fallback)
```

**Key Insight:** When you have map scale + verbal calibration, the verbal calibration is the BASE calibration. The user wants to recalibrate the MAP SCALE (the overlay), not the underlying photo calibration. So we reopen the map modal and preserve the verbal calibration.

### 3. Removed Evolution Quotes ✅
Removed 6 quotes mentioning evolution from `src/utils/makerQuotes.ts`:
- Edison (line 253)
- Hermann Muller (line 1854)
- Stephen Jay Gould (line 1864)
- Ernst Mayr (line 1869)
- Dobzhansky x2 (lines 1872-1873)

## Testing Scenarios

### Blueprint Recalibration
1. Take photo → Blueprint calibration → Place pins → Measure
2. Click "Recalibrate"
3. ✅ Should reopen blueprint placement modal
4. ✅ Measurements should persist and recalculate

### Map Mode Recalibration
**Test A: Map Mode Only**
1. Take photo → Skip calibration → "Map Scale" button → Set scale → Measure
2. Click "Recalibrate"
3. ✅ Should reopen map scale modal (FIXED!)

**Test B: Coin + Map Mode**
1. Take photo → Coin calibration → "Map" button → Set map scale → Measure
2. Click "Recalibrate"
3. ✅ Should go back to coin calibration screen (user recalibrating base)

**Test C: Verbal + Map Mode**
1. Take photo → Skip calibration → Verbal scale → "Map" button → Set map scale → Measure
2. Click "Recalibrate"
3. ✅ Should reopen map scale modal (FIXED! - was going to coin screen)

## Files Modified
- `src/components/DimensionOverlay.tsx` (lines 3343-3380, 4146)
- `src/utils/makerQuotes.ts` (removed 6 evolution quotes)

## Console Logs Added
Added debug logs to track recalibration scenarios:
- "📍 Recalibrating: Map scale only"
- "📍 Recalibrating: Map scale with verbal base"
- "📍 Recalibrating: Map scale with coin base - returning to coin screen"
- "📍 Recalibrating: Coin only - returning to coin screen"
- "📍 Recalibrating: Verbal only - returning to camera"
- "📍 Recalibrating: Unknown state - returning to coin screen"
