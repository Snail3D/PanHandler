# Intelligent Metric Unit Selection - v2.5.2

## Issue
When switching from imperial to metric units, measurements were always displayed in millimeters regardless of magnitude. For example, a 2-foot measurement would convert to "609.6 mm" instead of the more sensible "61.0 cm" or "0.61 m".

This made metric measurements difficult to read and inconsistent with how imperial measurements intelligently chose between inches and feet.

## Solution
Updated the unit conversion logic to intelligently select the appropriate metric unit based on measurement magnitude:

### Metric Unit Selection Logic
- **< 10mm (1cm)**: Display in millimeters (e.g., "9.5 mm")
- **10mm - 1000mm**: Display in centimeters (e.g., "61.0 cm")
- **1000mm - 1,000,000mm (1km)**: Display in meters (e.g., "2.45 m")
- **≥ 1km**: Display in kilometers (e.g., "1.523 km")

### Formatting Rules
- **Millimeters**: Round to nearest 0.5mm, hide decimal if .0 (e.g., "9 mm", "9.5 mm")
- **Centimeters**: 1 decimal place (e.g., "61.0 cm", "150.2 cm")
- **Meters**: 2 decimal places (e.g., "1.52 m", "10.25 m")
- **Kilometers**: 3 decimal places (e.g., "1.523 km")

## Example Conversions

| Imperial | Old Metric | New Metric |
|----------|-----------|------------|
| 0.5" | 12.7 mm | 12.5 mm ✓ |
| 6" | 152.4 mm | 15.2 cm ✓ |
| 1' | 304.8 mm | 30.5 cm ✓ |
| 2' | 609.6 mm | 61.0 cm ✓ |
| 10' | 3048 mm | 3.05 m ✓ |
| 100' | 30480 mm | 30.48 m ✓ |

## Files Modified
- `src/utils/unitConversion.ts`
  - Updated `getDisplayUnit()` to choose appropriate metric unit
  - Updated `formatMeasurement()` to format cm, m, and km

## Benefits
✅ Metric measurements are now easy to read and understand
✅ Consistent with imperial's intelligent unit selection
✅ Applies to all measurement types (distance, freehand, rectangle, circle, angle)
✅ Proper formatting for each unit type

## Testing
Test by:
1. Calibrating with a coin or blueprint
2. Creating measurements in imperial mode
3. Switching to metric mode
4. Verify measurements display in sensible units (cm for medium, m for large, mm for tiny)

---

**Version:** 2.5.2
**Date:** October 20, 2025
