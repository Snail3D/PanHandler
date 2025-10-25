import { UnitSystem } from '../state/measurementStore';

export type MeasurementUnit = 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi';

// Conversion factors to mm (base unit)
const TO_MM = {
  mm: 1,
  cm: 10,
  in: 25.4,
  m: 1000,
  ft: 304.8,
  km: 1000000,
  mi: 1609344,
};

// Convert any unit to any other unit
export function convertUnit(
  value: number,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit
): number {
  const valueInMm = value * TO_MM[fromUnit];
  return valueInMm / TO_MM[toUnit];
}

// Get the appropriate display unit based on unit system and value
export function getDisplayUnit(
  valueInBaseUnit: number,
  baseUnit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi',
  unitSystem: UnitSystem
): { value: number; unit: MeasurementUnit } {
  // First convert to the base unit system
  let valueInMm: number;
  if (baseUnit === 'mm') {
    valueInMm = valueInBaseUnit;
  } else if (baseUnit === 'cm') {
    valueInMm = valueInBaseUnit * 10;
  } else if (baseUnit === 'm') {
    valueInMm = valueInBaseUnit * 1000;
  } else if (baseUnit === 'km') {
    valueInMm = valueInBaseUnit * 1000000;
  } else if (baseUnit === 'in') {
    valueInMm = valueInBaseUnit * 25.4;
  } else if (baseUnit === 'mi') {
    valueInMm = valueInBaseUnit * 1609344;
  } else {
    valueInMm = valueInBaseUnit * 304.8;
  }

  // Determine the scale level of the baseUnit to maintain equivalent conversions
  // Large scale: km <-> mi
  // Medium scale: m <-> ft
  // Small scale: mm/cm <-> in
  const isLargeScale = baseUnit === 'km' || baseUnit === 'mi';
  const isMediumScale = baseUnit === 'm' || baseUnit === 'ft';

  if (unitSystem === 'metric') {
    // When switching to metric, maintain the scale level
    if (isLargeScale) {
      // Always use km for large scale (maps, long distances)
      return { value: valueInMm / 1000000, unit: 'km' };
    } else if (isMediumScale) {
      // Always use meters for medium scale
      return { value: valueInMm / 1000, unit: 'm' };
    } else {
      // Small scale: intelligently choose mm/cm based on magnitude
      if (valueInMm < 250) {
        return { value: valueInMm, unit: 'mm' };
      } else if (valueInMm < 1000) {
        return { value: valueInMm / 10, unit: 'cm' };
      } else if (valueInMm < 1000000) {
        return { value: valueInMm / 1000, unit: 'm' };
      } else {
        return { value: valueInMm / 1000000, unit: 'km' };
      }
    }
  } else {
    // When switching to imperial, maintain the scale level
    if (isLargeScale) {
      // Always use miles for large scale
      return { value: valueInMm / 1609344, unit: 'mi' };
    } else if (isMediumScale) {
      // Always use feet for medium scale
      return { value: valueInMm / 304.8, unit: 'ft' };
    } else {
      // Small scale: intelligently choose in/ft based on magnitude
      const valueInInches = valueInMm / 25.4;

      if (valueInInches < 12) {
        return { value: valueInInches, unit: 'in' };
      } else if (valueInInches < 63360) {
        return { value: valueInInches / 12, unit: 'ft' };
      } else {
        const valueInMiles = valueInMm / 1609344;
        return { value: valueInMiles, unit: 'mi' };
      }
    }
  }
}

// Format measurement value with appropriate unit
export function formatMeasurement(
  valueInBaseUnit: number,
  baseUnit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi',
  unitSystem: UnitSystem,
  decimals: number = 1
): string {
  const { value, unit } = getDisplayUnit(valueInBaseUnit, baseUnit, unitSystem);
  
  // Metric units
  if (unit === 'mm') {
    // Round to nearest 0.5mm (true nearest, not round up at 0.25)
    // 98.2 → 98.0, 98.3 → 98.5, 98.6 → 98.5, 98.8 → 99.0
    const roundedValue = Math.round(value * 2) / 2;
    // Only show decimal if it's .5, hide .0
    if (roundedValue % 1 === 0) {
      return `${roundedValue.toFixed(0)} ${unit}`; // 49mm, 50mm
    } else {
      return `${roundedValue.toFixed(1)} ${unit}`; // 49.5mm
    }
  }
  
  if (unit === 'cm') {
    return `${value.toFixed(1)} ${unit}`; // 49.5cm, 150.2cm
  }
  
  if (unit === 'm') {
    return `${value.toFixed(2)} ${unit}`; // 1.52m, 10.25m
  }
  
  if (unit === 'km') {
    return `${value.toFixed(3)} ${unit}`; // 1.523km
  }
  
  // Imperial units
  if (unit === 'in') {
    return `${value.toFixed(2)} ${unit}`;
  }
  
  if (unit === 'ft') {
    const totalInches = Math.round(value * 12); // Convert to total inches, round to whole
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    
    // If no inches, just show feet
    if (inches === 0) {
      return `${feet}'`;
    }
    
    // Show feet and inches (whole numbers only)
    return `${feet}'${inches}"`;
  }
  
  if (unit === 'mi') {
    return `${value.toFixed(2)} ${unit}`; // 1.52 mi, 10.25 mi
  }
  
  // Fallback for other units
  return `${value.toFixed(decimals)} ${unit}`;
}

// Get available units for calibration based on unit system
export function getCalibrationUnits(unitSystem: UnitSystem): MeasurementUnit[] {
  if (unitSystem === 'metric') {
    return ['mm', 'cm'];
  } else {
    return ['in', 'ft'];
  }
}

// Format area measurement with appropriate unit
export function formatAreaMeasurement(
  areaInBaseUnit: number, // area in square units of baseUnit
  baseUnit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi',
  unitSystem: UnitSystem,
  decimals: number = 1
): string {
  // First convert to mm² (base area unit)
  let areaInMm2: number;
  if (baseUnit === 'mm') {
    areaInMm2 = areaInBaseUnit;
  } else if (baseUnit === 'cm') {
    areaInMm2 = areaInBaseUnit * 100; // 1cm² = 100mm²
  } else if (baseUnit === 'm') {
    areaInMm2 = areaInBaseUnit * 1000000; // 1m² = 1,000,000mm²
  } else if (baseUnit === 'km') {
    areaInMm2 = areaInBaseUnit * 1000000000000; // 1km² = 1e12mm²
  } else if (baseUnit === 'in') {
    areaInMm2 = areaInBaseUnit * 645.16; // 1in² = 645.16mm²
  } else if (baseUnit === 'mi') {
    areaInMm2 = areaInBaseUnit * 2589988110336; // 1mi² = huge mm²
  } else {
    areaInMm2 = areaInBaseUnit * 92903.04; // 1ft² = 92903.04mm²
  }

  if (unitSystem === 'metric') {
    // Use mm² for small areas, cm² for medium, m² for large
    if (areaInMm2 < 10000) { // Less than 100cm²
      const roundedValue = Math.round(areaInMm2 * 2) / 2; // Round to nearest 0.5
      if (roundedValue % 1 === 0) {
        return `${roundedValue.toFixed(0)} mm²`;
      } else {
        return `${roundedValue.toFixed(1)} mm²`;
      }
    } else if (areaInMm2 < 1000000) { // Less than 1m²
      const valueInCm2 = areaInMm2 / 100;
      return `${valueInCm2.toFixed(1)} cm²`;
    } else {
      const valueInM2 = areaInMm2 / 1000000;
      const hectares = valueInM2 / 10000; // 1 hectare = 10,000 m²

      // If < 100 hectares, show 2 decimals; otherwise round to whole number
      const hectareStr = hectares >= 100
        ? `${Math.round(hectares)} ha`
        : `${hectares.toFixed(2)} ha`;

      return `${valueInM2.toFixed(2)} m² (${hectareStr})`;
    }
  } else {
    // Imperial: use in² for small areas, ft² for large
    const valueInIn2 = areaInMm2 / 645.16;
    if (valueInIn2 < 144) { // Less than 1ft²
      return `${valueInIn2.toFixed(2)} in²`;
    } else {
      const valueInFt2 = valueInIn2 / 144;
      const acres = valueInFt2 / 43560; // 1 acre = 43,560 ft²

      // If < 100 acres, show 2 decimals; otherwise round to whole number
      const acreStr = acres >= 100
        ? `${Math.round(acres)} ac`
        : `${acres.toFixed(2)} ac`;

      return `${valueInFt2.toFixed(2)} ft² (${acreStr})`;
    }
  }
}

// Get default calibration unit for unit system
export function getDefaultCalibrationUnit(unitSystem: UnitSystem): 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi' {
  return unitSystem === 'metric' ? 'mm' : 'in';
}
