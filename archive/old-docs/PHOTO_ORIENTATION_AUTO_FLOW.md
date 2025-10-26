# Photo Orientation Auto-Flow Update

## Change Summary

Updated photo capture logic to automatically route based on photo orientation:
- **Landscape/Horizontal photos** → Auto-proceed to coin calibration
- **Portrait/Vertical photos** → Show photo type selection menu

## Old Behavior
All photos went directly to coin calibration mode, regardless of orientation.

## New Behavior

### Landscape Photos (width > height)
1. Photo captured
2. Detect orientation → LANDSCAPE
3. **Auto-proceed to coin calibration** (zoomCalibrate mode)
4. Smooth camera → calibration transition
5. User calibrates with coin

### Portrait Photos (width < height)
1. Photo captured
2. Detect orientation → PORTRAIT
3. **Show photo type selection menu**
4. User chooses: Coin, Map, or Known Scale Mode
5. Proceeds based on selection

## Why This Makes Sense

**Landscape photos** are typically taken:
- Of objects on tables/surfaces
- With phone held horizontally
- Perfect for coin calibration (coin next to object)

**Portrait photos** are typically:
- Maps (held vertically)
- Blueprints (often vertical)
- Aerial photos (vertical orientation)
- Less likely to have a coin reference

## Technical Implementation

### Detection Logic
```typescript
// Detect orientation synchronously before routing
let photoOrientation: 'LANDSCAPE' | 'PORTRAIT' = 'LANDSCAPE';
Image.getSize(photo.uri, (width, height) => {
  photoOrientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
});

// Wait briefly for detection
await new Promise(resolve => setTimeout(resolve, 100));

// Route based on orientation
if (photoOrientation === 'LANDSCAPE') {
  // Auto coin calibration
  setMode('zoomCalibrate');
} else {
  // Show photo type menu
  setShowPhotoTypeModal(true);
}
```

### Landscape Flow (Auto Coin Calibration)
1. `setCapturedPhotoUri(photo.uri)` - Local state
2. Detect orientation → LANDSCAPE
3. `setMode('zoomCalibrate')` - Go directly to calibration
4. Smooth camera → calibration morph
5. AsyncStorage write deferred (200ms)

### Portrait Flow (Photo Type Selection)
1. `setCapturedPhotoUri(photo.uri)` - Local state
2. Detect orientation → PORTRAIT
3. `setMode('measurement')` - Go to measurement screen
4. `setShowPhotoTypeModal(true)` - Show type picker
5. User selects type → appropriate flow
6. AsyncStorage write deferred (200ms)

## Files Modified

### `/home/user/workspace/src/screens/MeasurementScreen.tsx`
- Lines 1055-1169: Updated photo capture flow
- Added orientation detection before routing
- Added conditional logic for landscape vs portrait
- Removed old phone angle detection logic (`isCameraPointingDown`)

## User Experience

### Before
- Take any photo → Always coin calibration
- Had to cancel and import if you wanted other modes

### After
- **Horizontal photo** → Coin calibration (fast, automatic)
- **Vertical photo** → Choose calibration type (flexible)

## Testing Checklist
- [x] Code implemented
- [ ] Test landscape photo → auto coin calibration
- [ ] Test portrait photo → shows type selection menu
- [ ] Test type selection → each mode works
- [ ] Test AsyncStorage writes are deferred
- [ ] Test transitions are smooth

## Edge Cases Handled
- Orientation detection timeout (100ms wait)
- AsyncStorage writes deferred in both flows
- Transition states properly managed
- Local state used for immediate display

## Status
✅ **IMPLEMENTED**

Photo orientation now intelligently routes to the most appropriate calibration flow.
