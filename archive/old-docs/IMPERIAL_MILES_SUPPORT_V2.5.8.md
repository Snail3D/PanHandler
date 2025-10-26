# Imperial Miles Support - v2.5.8

## Issue
When switching from metric to imperial with large distance measurements (kilometers), the app would display in **feet** instead of **miles**. For example, a 5 km measurement would show as "16,404 ft" instead of "3.11 mi".

## Root Cause

The imperial unit selection logic only considered two units:
```typescript
// Before
if (valueInInches < 12) {
  return { value: valueInInches, unit: 'in' }; // < 1 foot → inches
} else {
  return { value: valueInInches / 12, unit: 'ft' }; // ≥ 1 foot → feet (ALWAYS!)
}
```

This meant:
- Small measurements → inches ✓
- Medium measurements → feet ✓
- **Large measurements → feet** ❌ (should be miles!)

### Example Problem
```
Metric: 5 km
Convert to mm: 5,000,000 mm
Convert to inches: 196,850 inches
Convert to feet: 16,404 feet ❌ Hard to read!
Should be: 3.11 miles ✓
```

## Solution

Added **miles** as a third tier in imperial unit selection, matching how metric has mm → cm → m → km:

### Updated Logic
```typescript
// After
const valueInInches = valueInMm / 25.4;

if (valueInInches < 12) {
  // Less than 1 foot → inches
  return { value: valueInInches, unit: 'in' };
} else if (valueInInches < 63360) {
  // Less than 1 mile (63,360 inches) → feet
  return { value: valueInInches / 12, unit: 'ft' };
} else {
  // 1 mile or more → miles
  const valueInMiles = valueInMm / 1609344;
  return { value: valueInMiles, unit: 'mi' };
}
```

### Why 63,360?
- 1 mile = 5,280 feet
- 1 foot = 12 inches
- 1 mile = 5,280 × 12 = **63,360 inches**

### Added Miles Formatting
```typescript
if (unit === 'mi') {
  return `${value.toFixed(2)} ${unit}`; // e.g., "3.11 mi", "10.52 mi"
}
```

## Unit Selection Thresholds

### Metric (unchanged)
| Range | Unit | Example |
|-------|------|---------|
| < 10 mm | mm | 9.5 mm |
| 10 mm - 1 m | cm | 61.0 cm |
| 1 m - 1 km | m | 3.05 m |
| ≥ 1 km | km | 5.23 km |

### Imperial (now with miles!)
| Range | Unit | Example |
|-------|------|---------|
| < 12 in | in | 5.25 in |
| 12 in - 1 mi | ft | 5'3", 150' |
| ≥ 1 mi | mi | 3.11 mi |

## Examples

### Conversion Table
| Metric | Old Imperial | New Imperial |
|--------|--------------|--------------|
| 5 mm | 0.20 in | 0.20 in ✓ |
| 50 cm | 1'8" | 1'8" ✓ |
| 5 m | 16'5" | 16'5" ✓ |
| 500 m | 1,640' | 1,640' ✓ |
| 5 km | 16,404' ❌ | 3.11 mi ✓ |
| 50 km | 164,042' ❌ | 31.07 mi ✓ |

### Real-World Scenarios

**Scenario 1: Blueprint with Kilometers**
```
1. Calibrate blueprint: "5 km" between reference points
2. Create measurement: 2.5 km shows as "2.500 km" in metric
3. Switch to imperial: Now shows "1.55 mi" ✓ (not "8,202 ft")
```

**Scenario 2: Map with Large Scale**
```
1. Set verbal scale: "1 inch = 10 miles"
2. Measure distance: 50 miles
3. Toggle to metric: "80.47 km"
4. Toggle back to imperial: "50.00 mi" ✓ (not "264,000 ft")
```

## Benefits

✅ **Readable imperial units** - Miles for large distances instead of huge foot values  
✅ **Symmetric with metric** - Both systems now have 3-4 unit tiers  
✅ **Map-friendly** - Perfect for map mode where distances are often in miles  
✅ **Consistent** - Same intelligent scaling logic as metric  

## Technical Details

### Conversion Constants
```typescript
const TO_MM = {
  mm: 1,
  cm: 10,
  in: 25.4,
  m: 1000,
  ft: 304.8,
  km: 1000000,
  mi: 1609344, // 1 mile = 1,609,344 mm
};
```

### Mile Threshold Calculation
```
1 mile = 1,609,344 mm
1 mile = 63,360 inches
63,360 inches = threshold for switching from feet to miles
```

### Formatting Precision
- **Inches**: 2 decimals (5.25 in)
- **Feet**: Whole numbers with inches (5'3")
- **Miles**: 2 decimals (3.11 mi)

## Files Modified
- ✏️ `src/utils/unitConversion.ts`
  - Line 62-76: Updated `getDisplayUnit()` to include miles
  - Line 129-131: Added miles formatting
- 📝 `app.json` - Version bumped to **2.5.8**

## Testing

### Test Large Metric → Imperial
1. Calibrate with blueprint: "10 km"
2. Create measurements
3. Switch to imperial
4. **VERIFY**: Shows in miles (e.g., "6.21 mi") not feet

### Test Boundaries
Test the transition points:
- **11.99 inches** → Should show "11.99 in"
- **12 inches** → Should show "1'"
- **5279 feet** → Should show "5279'" or "0.99 mi" (right at boundary)
- **5280 feet** → Should show "1.00 mi"

### Test Map Mode
1. Set verbal scale: "1 inch = 5 miles"
2. Measure 100 miles
3. **VERIFY**: Shows "100.00 mi" not "528,000 ft"

## Related Systems

This complements:
- **v2.5.2** - Intelligent metric unit selection (mm/cm/m/km)
- **v2.5.6** - Unit updates during recalibration
- **Map Mode** - Verbal scales often use miles

## Status
✅ **Complete and ready to test**

---

**Version:** v2.5.8  
**Date:** October 20, 2025  
**Fix Type:** Imperial unit selection enhancement (added miles support)
