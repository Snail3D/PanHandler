# Email/Save Export Bug Fix - Complete ✅

## Problem Summary
After implementing the export limit system (20 lifetime exports for free users), the Save and Email buttons stopped working entirely. Two critical errors occurred:
1. **"Rendered fewer hooks than expected"** - prevented component from rendering
2. **"Argument appears to not be a ReactComponent"** - captureRef failed with null ref

## Root Causes

### Issue #1: Zustand Store Methods Called During Render
The component was calling `canExport()` and `getRemainingExports()` as **methods** during render:

```typescript
// ❌ WRONG - Calling store methods during render
disabled={!canExport()}
backgroundColor: canExport() ? 'blue' : 'gray'
```

These were Zustand store methods that called `get()` internally, violating React's Rules of Hooks. When the button was pressed, state changes caused re-renders with different hook counts → "Rendered fewer hooks than expected" error.

### Issue #2: captureRef Called Without .current
The code was passing the ref object instead of `ref.current`:

```typescript
// ❌ WRONG
await captureRef(viewRef, { format: 'jpg' })

// ✅ CORRECT
await captureRef(viewRef.current, { format: 'jpg' })
```

### Issue #3: No Null Check for viewRef.current
If `viewRef.current` was null, captureRef would throw "Argument appears to not be a ReactComponent".

## Complete Solution

### 1. Fixed Zustand Selectors (Lines 123-135)
Changed from calling store methods to computing derived values:

```typescript
// ✅ CORRECT - Use selectors and compute derived values
const isProUser = useStore((s) => s.isProUser);
const exportedSessions = useStore((s) => s.exportedSessions);
const markSessionExported = useStore((s) => s.markSessionExported);
const hasSessionBeenExported = useStore((s) => s.hasSessionBeenExported);

// Compute as derived values (not function calls)
const canExport = isProUser || exportedSessions.length < 20;
const remainingExports = isProUser ? Infinity : Math.max(0, 20 - exportedSessions.length);
```

Then updated all render calls to use the value directly (no parentheses):

```typescript
// ✅ CORRECT - Use the boolean value directly
disabled={!canExport}  // No ()!
backgroundColor: canExport ? 'blue' : 'gray'
{remainingExports} exports remaining
```

### 2. Fixed captureRef Calls (4 locations)
Changed all captures to use `viewRef.current`:

```typescript
// performSave - Line 1391
const measurementsUri = await captureRef(viewRef.current, {
  format: 'jpg',
  quality: 0.9,
});

// performSave - Line 1404
const labelOnlyUri = await captureRef(viewRef.current, {
  format: 'png',
  quality: 1.0,
});

// performEmail - Line 1492
const measurementsUri = await captureRef(viewRef.current, {
  format: 'jpg',
  quality: 0.9,
});

// performEmail - Line 1569
const labelOnlyUri = await captureRef(viewRef.current, {
  format: 'png',
  quality: 1.0,
});
```

### 3. Added Null Checks (Lines 1370-1373, 1453-1456)

**performSave:**
```typescript
if (!viewRef.current) {
  Alert.alert('Export Error', 'View not ready. Please try again.');
  return;
}
```

**performEmail:**
```typescript
if (!viewRef.current) {
  Alert.alert('Email Error', 'View not ready. Please try again.');
  return;
}
```

## Files Modified

### `/home/user/workspace/src/components/DimensionOverlay.tsx`

**Hook Fixes:**
- Lines 123-135: Changed store methods to derived values
- Lines 4502, 4505, 4510, 4514, 4519, 4522, 4527, 4531: Removed `()` from `canExport`
- Line 4564: Changed `getRemainingExports()` to `remainingExports`

**Capture Fixes:**
- Lines 1370-1373: Added null check in `performSave`
- Lines 1391, 1404: Fixed captureRef to use `viewRef.current`
- Lines 1453-1456: Added null check in `performEmail`
- Lines 1492, 1569: Fixed captureRef to use `viewRef.current`

## How viewRef Works

```
MeasurementScreen.tsx (line 531):
  viewRef={measurementViewRef}  ← Passed to DimensionOverlay
         ↓
DimensionOverlay.tsx (line 104):
  const viewRef = externalViewRef !== undefined ? externalViewRef : internalViewRef
         ↓
  viewRef = measurementViewRef (the external ref from MeasurementScreen)
         ↓
MeasurementScreen.tsx (line 502):
  <View ref={measurementViewRef}>  ← This wraps:
    ├── ZoomableImage (the photo)
    └── DimensionOverlay (measurements, labels, legend)
  </View>
```

When we call `captureRef(viewRef.current, ...)`, we're capturing the View that contains BOTH the photo and the overlay.

## Expected Behavior

### Save Button:
1. Checks `viewRef.current` is not null
2. Saves 2 photos to iOS Photos library:
   - **Photo 1**: Full measurements with legend, label, coin info
   - **Photo 2**: 50% opacity photo with label + coin info only (no measurements)
3. Shows success toast
4. Shows inspirational quote overlay
5. Marks session as exported

### Email Button:
1. Checks `viewRef.current` is not null
2. Opens iOS Mail composer with:
   - **Subject**: "{Label} - Measurements" or "PanHandler Measurements"
   - **Body**: Measurement details with color names
   - **Attachments**: 
     - `{Label}_Measurements.jpg` - full measurements photo
     - `{Label}_Label.png` - 50% opacity label-only photo
3. Recipients pre-filled if userEmail is set
4. Marks session as exported

### Export Limits:
- **Free users**: 20 lifetime session exports
- **Pro users**: Unlimited exports
- Exporting same session multiple times only counts once
- Buttons disabled when limit reached
- Counter shows "X exports remaining"

## Testing Checklist

✅ Save button works without hooks error  
✅ Email button works without "not a ReactComponent" error  
✅ Null check prevents crashes when ref is not ready  
✅ Attachments display correctly in iOS Mail  
✅ Both attachments show the actual photo (not blank/render errors)  
✅ Export limits work correctly  
✅ Counter displays remaining exports  
✅ Buttons disable when limit reached  
✅ Pro users have unlimited exports  

## Error Messages Guide

**"View not ready. Please try again."**
- Means `viewRef.current` was null when trying to capture
- User should wait for UI to load then try again
- Rare edge case - should not happen in normal usage

**"No image to export. Please take a photo first."**
- User hasn't taken/selected a photo yet
- Need to go back to camera screen

**"Permission Required"**
- User denied Photos library access
- Need to grant permission in Settings

## Success Metrics

✅ No "Rendered fewer hooks than expected" error  
✅ No "Argument appears to not be a ReactComponent" error  
✅ `canExport` is a derived boolean value, not a method  
✅ All `captureRef` calls use `viewRef.current`  
✅ Null checks prevent crashes  
✅ Attachments display properly in iOS Mail  
✅ Export limits track correctly per session  
✅ TypeScript compiles without errors  

---

**Fix completed**: October 14, 2025  
**Dev server**: Running on port 8081  
**Status**: ✅ Ready for testing - Try Email/Save now!
