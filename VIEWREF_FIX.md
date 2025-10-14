# ViewRef Timing Fix - Email/Save Capture

## Date
October 14, 2025

## Problem
Email and Save functions were failing with "View reference is null" errors, even though the viewRef was being passed correctly from MeasurementScreen to DimensionOverlay.

## Root Cause
The initial check for `externalViewRef.current` was happening **too early** - before React had time to attach the ref after modal interactions.

### Original Flow (Broken):
1. User clicks Email/Save
2. **Immediately check if `externalViewRef.current` exists** ❌ Too early!
3. If null, return error
4. (Never gets here) Show modal, wait for user input, then capture

### The Issue:
- The ref check on line 1502 happened BEFORE any modal interactions
- Even though we passed `viewRef={measurementViewRef}` correctly
- React refs may not be immediately available, especially after modal state changes

## Solution
Moved the ref existence check to **after** modal interactions and added a 100ms delay.

### New Flow (Fixed):
1. User clicks Email/Save
2. Check only `currentImageUri` (not refs yet)
3. Show email prompt modal (if needed)
4. Wait for modal to close
5. **Wait 100ms for React to reattach refs**
6. NOW check if `externalViewRef.current` OR `internalViewRef.current` exists
7. If still null, wait another 200ms and retry
8. Proceed with capture

## Changes Made

### `performEmail` function:
```typescript
// OLD - checked ref.current immediately
if (!externalViewRef || !externalViewRef.current || !currentImageUri) {
  return; // Failed before modal even opened
}

// NEW - check imageUri only, defer ref check
if (!currentImageUri) {
  return; // Only fail if no image
}

// ... show modal, get user input ...

// Wait for ref to be ready
await new Promise(resolve => setTimeout(resolve, 100));

// NOW check refs
if (!externalViewRef?.current && !internalViewRef.current) {
  Alert.alert('Unable to capture view');
  return;
}
```

### `performSave` function:
Applied same fix - defer ref checking until after we're ready to capture.

## Why This Works

1. **Refs take time**: React needs time to attach refs, especially after modals open/close
2. **Modal state changes**: When modals open/close, React may temporarily detach/reattach refs
3. **100ms buffer**: Gives React 1-2 render cycles to stabilize refs
4. **Fallback to internal ref**: If external ref fails, tries internal ref as backup
5. **Retry logic**: Additional 200ms wait if ref is still null

## Testing
- Email function: Opens email modal → waits → captures → attaches photos
- Save function: Checks permissions → waits → captures → saves to Photos

Both functions now have proper ref timing and fallback logic.

## Related Files
- `/src/components/DimensionOverlay.tsx` - Fixed ref timing in performEmail and performSave
- `/src/screens/MeasurementScreen.tsx` - Correctly passes viewRef prop (line 515)

## Key Insight
Never check `ref.current` existence at the start of an async function that involves modals or state changes. Always check refs **right before** you need to use them, after giving React time to stabilize.
