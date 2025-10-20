# Map Mode Unit Conversion Support (v2.5.12)

## Issue Reported
"In regular map mode, when I switch between imperial and metric, it doesn't change. It just keeps the original scale that I put."

## Root Cause
The `formatMapScaleDistance()` and `formatMapScaleArea()` functions intentionally ignored the user's metric/imperial preference and always displayed measurements in the **map scale's original unit**.

### Previous Behavior
```javascript
// ALWAYS use map scale's real unit (don't convert based on user preference)
// If user set map scale to miles, output should be in miles
if (mapScale.realUnit === "km") {
  return `${mapDistance.toFixed(2)} km`;
}
```

**Example:**
- User sets map scale: "1cm = 10km"
- Creates measurements
- Toggles to Imperial
- ❌ Measurements still show "12.5 km" (no conversion)

This was confusing UX because:
1. The metric/imperial toggle was visible and active
2. Users expected it to work like regular calibration modes
3. No indication that map mode units were "locked"

## Solution Implemented
Modified both `formatMapScaleDistance()` and `formatMapScaleArea()` to **respect the user's unit system preference** by converting between metric and imperial as needed.

### New Behavior Logic

```typescript
// 1. Check if map is metric (km/m) or imperial (mi/ft)
// 2. Check user's preference (metric/imperial toggle)
// 3. If they match, display as-is
// 4. If they don't match, convert units
```

### Conversion Examples

**Scenario 1: Map in km, User Wants Metric**
- Map scale: "1cm = 10km"
- Measurement: 12.5 km
- Toggle: Metric ✅
- Display: **"12.5 km"** (no conversion needed)

**Scenario 2: Map in km, User Wants Imperial**
- Map scale: "1cm = 10km"
- Measurement: 12.5 km
- Toggle: Imperial ✅
- Display: **"7.77 mi"** (converted to miles)

**Scenario 3: Map in miles, User Wants Metric**
- Map scale: "1in = 5mi"
- Measurement: 7.77 mi
- Toggle: Metric ✅
- Display: **"12.5 km"** (converted to kilometers)

**Scenario 4: Map in feet, User Wants Imperial**
- Map scale: "1in = 100ft"
- Measurement: 150 feet
- Toggle: Imperial ✅
- Display: **"150' 0\""** (no conversion needed)

## Conversion Formulas

### Distance Conversions
```typescript
// Metric → Imperial
miles = km * 0.621371
feet = meters * 3.28084

// Imperial → Metric
meters = feet * 0.3048
km = miles * 1.60934
```

### Area Conversions
```typescript
// Metric → Imperial
square_feet = square_meters * 10.7639
square_miles = square_km * 0.386102

// Imperial → Metric
square_meters = square_feet * 0.092903
square_km = square_miles * 2.58999
```

### Smart Unit Selection
The functions automatically choose appropriate units based on magnitude:

**Distance (Metric):**
- < 1m → Display in cm
- < 1000m → Display in m
- ≥ 1000m → Display in km

**Distance (Imperial):**
- < 5280ft → Display in feet/inches
- ≥ 5280ft → Display in miles

**Area (Metric):**
- < 10,000m² → Display in m²
- ≥ 10,000m² → Display in km²

**Area (Imperial):**
- < 1 mi² → Display in ft²
- ≥ 1 mi² → Display in mi²

## Code Changes

### File: `src/components/DimensionOverlay.tsx`

#### 1. `formatMapScaleDistance()` (Lines ~1361-1438)

**Before:**
```typescript
// ALWAYS use map scale's real unit
if (mapScale.realUnit === "km") {
  return `${mapDistance.toFixed(2)} km`;
}
```

**After:**
```typescript
// Convert based on user's unit system preference
const isMapMetric = mapScale.realUnit === "km" || mapScale.realUnit === "m";
const isMapImperial = mapScale.realUnit === "mi" || mapScale.realUnit === "ft";

// If preferences match, use as-is
if ((unitSystem === 'metric' && isMapMetric) || (unitSystem === 'imperial' && isMapImperial)) {
  // Display in original unit
}
// Otherwise, convert units
else if (unitSystem === 'metric' && isMapImperial) {
  // Convert imperial → metric
}
else if (unitSystem === 'imperial' && isMapMetric) {
  // Convert metric → imperial
}
```

#### 2. `formatMapScaleArea()` (Lines ~1440-1496)

Same pattern as distance, with appropriate area conversion factors.

## Testing Scenarios

### Test 1: Metric Map Scale
1. Set map scale: "1cm = 10km"
2. Draw measurements
3. Verify displays in km/m
4. Toggle to Imperial
5. ✅ Verify converts to mi/ft

### Test 2: Imperial Map Scale
1. Set map scale: "1in = 5mi"
2. Draw measurements
3. Verify displays in mi/ft
4. Toggle to Metric
5. ✅ Verify converts to km/m

### Test 3: Small Distances
1. Set map scale: "1cm = 50m"
2. Draw small measurement
3. Toggle units
4. ✅ Verify smart unit selection (cm ↔ inches, not km ↔ miles)

### Test 4: Areas
1. Draw rectangle in map mode
2. Verify area displays correctly
3. Toggle units
4. ✅ Verify area converts (m² ↔ ft², km² ↔ mi²)

## Benefits

1. **Consistent UX**: Unit toggle now works in all calibration modes
2. **User Expectation**: Toggle behaves as users expect
3. **Flexibility**: Users can view map measurements in their preferred units
4. **Smart Conversions**: Automatically chooses appropriate units for the magnitude
5. **No Breaking Changes**: Map scale itself doesn't change, only display units

## Files Modified
1. `src/components/DimensionOverlay.tsx` (Lines ~1361-1496)
   - Updated `formatMapScaleDistance()`
   - Updated `formatMapScaleArea()`
2. `app.json` - Version bumped to 2.5.12

## Version History
- v2.5.9: Blueprint recalibration display fix
- v2.5.10: Freehand recalibration support
- v2.5.11: Verbal scale recalibration consistency
- v2.5.12: Map mode unit conversion support ✅ **Current**

## Status
✅ **COMPLETE** - Metric/Imperial toggle now works in map mode!

## Technical Notes
- Conversions happen at display time only
- Underlying map scale calibration remains unchanged
- All calculations still use the original map scale units internally
- No impact on measurement accuracy
