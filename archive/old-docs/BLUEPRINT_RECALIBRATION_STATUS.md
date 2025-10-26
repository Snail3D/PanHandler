# Blueprint Recalibration - Code Review Status

## Summary
Completed code review of blueprint recalibration functionality based on previous session notes.

## Expected Flow

### Normal Blueprint Calibration
1. User selects "Blueprint" or "Aerial" from camera screen
2. BlueprintPlacementModal appears with instructions
3. User can pan/zoom the image (modal uses `pointerEvents="box-none"`)
4. User taps "PLACE PINS" button
   - Modal closes (`showBlueprintPlacementModal = false`)
   - `isPlacingBlueprint = true`
   - `measurementMode = true`
   - `showCursor = true`
   - Cursor positioned at screen center
5. User moves finger → cursor follows
6. User taps → First point placed, haptic feedback, cursor stays visible
7. User moves finger → cursor follows
8. User taps → Second point placed, cursor hides, distance modal appears
9. User enters distance → Calibration complete

### Blueprint Recalibration Flow
When user hits "Recalibrate" button on an already-calibrated blueprint:

1. **Recalibrate button pressed** (Line ~1047):
   ```typescript
   setCalibration(null);
   setBlueprintPoints([]);
   setMeasurementMode(false);  // Allow pan/zoom
   setIsPlacingBlueprint(false);  // Not placing yet
   setMenuHidden(true);
   setTimeout(() => setShowBlueprintPlacementModal(true), 150);
   ```

2. **BlueprintPlacementModal appears** - Same as initial calibration

3. **User taps "PLACE PINS"** (Line ~4613):
   ```typescript
   setShowBlueprintPlacementModal(false);
   setIsPlacingBlueprint(true);
   setMeasurementMode(true);
   setShowCursor(true);
   setCursorPosition({ x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT/2 });
   ```

4. **Touch overlay becomes active** - Because `measurementMode = true`
   - `onResponderGrant` handles touch start
   - `onResponderMove` handles cursor movement
   - `onResponderRelease` handles point placement

5. **Point placement logic** (Lines 4076-4098):
   ```typescript
   if (isPlacingBlueprint) {
     const imageCoords = screenToImage(cursorPosition.x, cursorPosition.y);
     const newPoint = { x: imageCoords.x, y: imageCoords.y };
     const updatedPoints = [...blueprintPoints, newPoint];
     setBlueprintPoints(updatedPoints);
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
     
     if (updatedPoints.length === 2) {
       // ONLY hide cursor after BOTH points placed
       setIsPlacingBlueprint(false);
       setMeasurementMode(false);
       setShowCursor(false);
       setTimeout(() => setShowBlueprintDistanceModal(true), 100);
     }
     // After first point, cursor stays visible (no else block)
   }
   ```

## Code Review Findings

### ✅ **Cursor Hiding Logic is CORRECT**
- Cursor is **NOT** hidden after first point
- Cursor is **ONLY** hidden after second point (line 4091)
- No problematic `else` block found

### ✅ **State Management is CORRECT**
- Recalibration properly clears `blueprintPoints` array
- `measurementMode` is correctly toggled for pan/zoom vs placement
- `isPlacingBlueprint` is correctly managed

### ✅ **Touch Handling is CORRECT**
- Touch overlay only renders when `measurementMode = true`
- `onResponderRelease` contains the blueprint placement logic
- Blueprint mode uses `if (isPlacingBlueprint)` check before placing points

## Potential Issues to Investigate

If blueprint recalibration is still not working, possible causes:

1. **State not updating properly**
   - Check if `setIsPlacingBlueprint(true)` is actually being called
   - Check if `measurementMode` is actually `true` when trying to place points
   - Add console.logs to verify state values

2. **Touch events not firing**
   - Check if `onResponderRelease` is being called (has `console.log('✅ Touch released')` at line 3830)
   - Check if another element is blocking touches

3. **Modal not actually closing**
   - Verify `showBlueprintPlacementModal` becomes `false`
   - Check if modal is somehow still rendering

4. **Cursor not visible**
   - Verify cursor rendering condition: `showCursor && isPlacingBlueprint`
   - Check cursor z-index

## Recommended Next Steps

1. **Test the app** - Try blueprint recalibration and observe behavior

2. **If cursor moves but taps don't register**:
   - Add `console.log` in `onResponderRelease` blueprint handler (line 4077)
   - Check if `isPlacingBlueprint` is actually `true`

3. **If cursor doesn't appear at all**:
   - Add `console.log` in "PLACE PINS" handler to verify it's called
   - Check `showCursor` and `isPlacingBlueprint` state values

4. **If modal doesn't close**:
   - Verify `showBlueprintPlacementModal` state

## Code Status
✅ Blueprint recalibration code appears correct based on code review
⚠️ Requires testing to confirm if issue still exists
📝 May need additional debug logging if issue persists

---

**Files Reviewed:**
- `src/components/DimensionOverlay.tsx` (lines 1047-1060, 3471-4122, ~4613)
- `src/components/BlueprintPlacementModal.tsx`

**Version:** v2.5.1 (from previous session)
