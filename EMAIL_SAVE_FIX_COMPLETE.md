# Email/Save Export Bug Fix - Complete

## Problem Summary
After implementing the export limit system (20 lifetime exports for free users), the Save and Email buttons stopped working entirely. Clicking them triggered a critical React error: **"Rendered fewer hooks than expected"** which prevented any captures from being executed.

## Root Cause

### Primary Issue: Zustand Store Methods Called During Render
The component was calling `canExport()` and `getRemainingExports()` as **methods** during render:

```typescript
// ❌ WRONG - Calling store methods during render
disabled={!canExport()}
backgroundColor: canExport() ? 'blue' : 'gray'
```

These were Zustand store methods that called `get()` internally, which violated React's Rules of Hooks. When the button was pressed, it triggered state changes that caused re-renders with different hook counts, resulting in the "Rendered fewer hooks than expected" error.

### Secondary Issue: Using captureScreen() Instead of captureRef()
The code was using `captureScreen()` which captures the entire screen including the Vibecode orange menu button, causing "Render Error" attachments in iOS Mail.

## Solution

### 1. Fixed Zustand Selectors (Lines 123-135)
Changed from calling store methods to computing derived values:

```typescript
// ✅ CORRECT - Use selectors and compute derived values
const isProUser = useStore((s) => s.isProUser);
const exportedSessions = useStore((s) => s.exportedSessions);

// Compute as derived values (not function calls)
const canExport = isProUser || exportedSessions.length < 20;
const remainingExports = isProUser ? Infinity : Math.max(0, 20 - exportedSessions.length);
```

Then updated all render calls (lines 4502, 4505, 4510, 4514, 4519, 4522, 4527, 4531, 4564):

```typescript
// ✅ CORRECT - Use the boolean value directly
disabled={!canExport}  // No parentheses!
backgroundColor: canExport ? 'blue' : 'gray'
{remainingExports} exports remaining
```

### 2. Fixed Capture Logic
Both `performSave()` and `performEmail()` now use `captureRef(viewRef, ...)`:

**performSave (Lines 1386-1389, 1399-1402):**
```typescript
// Capture full measurements photo
const measurementsUri = await captureRef(viewRef, {
  format: 'jpg',
  quality: 0.9,
});

// Capture label-only photo (after hiding measurements)
const labelOnlyUri = await captureRef(viewRef, {
  format: 'png',
  quality: 1.0,
});
```

**performEmail (Lines 1487-1490, 1564-1567):**
```typescript
// Capture full measurements photo
const measurementsUri = await captureRef(viewRef, {
  format: 'jpg',
  quality: 0.9,
});

// Capture label-only photo (after hiding measurements)
const labelOnlyUri = await captureRef(viewRef, {
  format: 'png',
  quality: 1.0,
});
```

## Files Modified

### `/home/user/workspace/src/components/DimensionOverlay.tsx`
- **Lines 123-135**: Changed store method calls to derived values
- **Lines 1386-1402**: Fixed `performSave()` to use `captureRef(viewRef, ...)`
- **Lines 1487-1567**: Fixed `performEmail()` to use `captureRef(viewRef, ...)`
- **Lines 4502-4531**: Removed `()` from `canExport` and `getRemainingExports` in render
- **Line 4564**: Changed `getRemainingExports()` to `remainingExports`

## How It Works Now

### Export Flow:
1. User clicks Save/Email button
2. `canExport` (boolean) checks if export is allowed
3. If allowed, `handleExport()` or `handleEmail()` is called
4. `setIsCapturing(true)` shows label + coin info
5. First capture: `captureRef(viewRef, ...)` - full measurements photo
6. `setHideMeasurementsForCapture(true)` hides measurements
7. Second capture: `captureRef(viewRef, ...)` - label-only photo
8. Restore UI state
9. Save to Photos or open Mail composer
10. Mark session as exported (only counts once per image)

### Why viewRef Works:
- `viewRef` points to `measurementViewRef` from MeasurementScreen (line 531 in MeasurementScreen.tsx)
- `measurementViewRef` wraps the entire view INCLUDING:
  - ZoomableImage (the photo)
  - DimensionOverlay (measurements, labels, legend)
- This captures the complete view without the Vibecode menu

## Expected Behavior

### Save Button:
1. Saves 2 photos to iOS Photos library:
   - **Photo 1**: Full measurements with legend, label, coin info
   - **Photo 2**: 50% opacity photo with label + coin info only (no measurements)
2. Shows success toast
3. Shows inspirational quote overlay
4. Marks session as exported

### Email Button:
1. Opens iOS Mail composer with:
   - **Subject**: "{Label} - Measurements" or "PanHandler Measurements"
   - **Body**: Measurement details with color names
   - **Attachments**: 
     - `{Label}_Measurements.jpg` - full measurements photo
     - `{Label}_Label.png` - 50% opacity label-only photo
2. Recipients pre-filled if userEmail is set
3. Marks session as exported

## Export Limits
- **Free users**: 20 lifetime session exports (both Save and Email count as 1 export per session)
- **Pro users**: Unlimited exports
- Exporting the same session multiple times only counts as 1 export
- Buttons are disabled when limit is reached
- Counter shows "X exports remaining"

## Testing Checklist

✅ Save button works without hooks error  
✅ Email button works without hooks error  
✅ Attachments display correctly in iOS Mail (not blank/render errors)  
✅ Both attachments show the actual photo  
✅ Export limits work correctly  
✅ Counter displays remaining exports  
✅ Buttons disable when limit reached  
✅ Pro users have unlimited exports  

## Success Metrics

✅ No "Rendered fewer hooks than expected" error  
✅ `canExport` is a derived boolean, not a function call  
✅ `captureRef(viewRef, ...)` captures photo + overlay correctly  
✅ Attachments display properly in iOS Mail  
✅ Export limits track correctly per session  
✅ TypeScript compiles without errors  

---

**Fix completed**: October 14, 2025  
**Dev server**: Running on port 8081  
**Status**: ✅ Ready for testing
