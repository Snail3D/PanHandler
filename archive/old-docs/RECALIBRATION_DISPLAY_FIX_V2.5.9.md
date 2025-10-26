# Blueprint Recalibration Display Fix (v2.5.9)

## Issue
After recalibrating measurements (changing from one blueprint scale to another), the measurement display values did not update automatically. Users had to toggle between metric/imperial units to see the recalibrated values displayed correctly.

## Root Cause
When recalibration occurred:
1. New calibration was set in Zustand store
2. Measurements were recalculated with new calibration
3. `setMeasurements()` was called with updated values

However, there's a `useEffect` that watches `measurements` and `unitSystem` changes to recalculate display values. This useEffect has an early exit condition:

```typescript
if (prevUnitSystemRef.current === unitSystem) {
  return;
}
```

After recalibration, when `setMeasurements()` was called, the useEffect would fire (because `measurements` dependency changed), but it would immediately exit because the unit system hadn't changed. This meant the display wasn't being refreshed with the new calibration values.

When users toggled metric/imperial, the unit system changed, bypassing the early exit, and the measurements would recalculate and display correctly.

## Solution
Force the display update by resetting `prevUnitSystemRef.current = null` immediately after recalibration. This ensures:

1. New calibration is stored
2. Measurements are recalculated with new calibration
3. Measurements are updated in store via `setMeasurements()`
4. `prevUnitSystemRef.current` is reset to `null`
5. Next render cycle, the useEffect fires and passes the early exit check (`null !== unitSystem`)
6. Display values are recalculated and rendered with new calibration

## Code Changes

### File: `src/components/DimensionOverlay.tsx` (Line ~7385-7404)

**Before:**
```typescript
// Store calibration
useStore.getState().setCalibration(newCalibration);

// Recalculate ALL existing measurements with new calibration
if (measurements.length > 0) {
  const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m, newCalibration));
  setMeasurements(recalibratedMeasurements);
}
```

**After:**
```typescript
// Store calibration FIRST
useStore.getState().setCalibration(newCalibration);

// Recalculate ALL existing measurements with new calibration
// Force immediate update by triggering unit system ref reset
if (measurements.length > 0) {
  console.log('🔄 Recalculating', measurements.length, 'measurements with new blueprint calibration');
  console.log('📐 New calibration unit:', newCalibration.unit, 'Old unit was:', calibration?.unit);
  // Pass the NEW calibration directly to ensure it uses the new unit
  const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m, newCalibration));
  
  // Update measurements immediately
  setMeasurements(recalibratedMeasurements);
  
  // Force unit system ref to null so the useEffect will recalculate display values
  // This ensures the UI updates with the new calibration
  prevUnitSystemRef.current = null;
  
  console.log('✅ Measurements recalculated and unit system ref reset to force display update');
}
```

## Testing
1. **Before fix**: Take photo → calibrate → measure → recalibrate with different scale/unit → measurements still show old values → toggle metric/imperial → measurements update
2. **After fix**: Take photo → calibrate → measure → recalibrate with different scale/unit → measurements immediately update with new calibration

## Technical Notes
- The fix leverages React's effect dependency system by manipulating the ref that controls the early exit condition
- This is safer than forcing a re-render with a dummy state variable
- The approach ensures the display update happens in the next render cycle, maintaining React's data flow
- No additional state needed, uses existing `prevUnitSystemRef` mechanism

## Related Files
- `src/components/DimensionOverlay.tsx` - Main fix location
- `src/state/measurementStore.ts` - Zustand store (no changes needed)

## Version
- Previous: v2.5.8
- Current: v2.5.9

## Status
✅ **FIXED** - Recalibration now immediately updates display values without requiring unit system toggle.
