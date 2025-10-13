import { UnitSystem } from '../state/measurementStore';

export type MeasurementUnit = 'mm' | 'cm' | 'in' | 'ft';

// Conversion factors to mm (base unit)
const TO_MM = {
  mm: 1,
  cm: 10,
  in: 25.4,
  ft: 304.8,
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
  baseUnit: 'mm' | 'cm' | 'in',
  unitSystem: UnitSystem
): { value: number; unit: MeasurementUnit } {
  // First convert to the base unit system
  let valueInMm: number;
  if (baseUnit === 'mm') {
    valueInMm = valueInBaseUnit;
  } else if (baseUnit === 'cm') {
    valueInMm = valueInBaseUnit * 10;
  } else {
    valueInMm = valueInBaseUnit * 25.4;
  }

  if (unitSystem === 'metric') {
    // Always use mm for metric
    return { value: valueInMm, unit: 'mm' };
  } else {
    // Imperial: use inches for values less than 12 inches, feet otherwise
    const valueInInches = valueInMm / 25.4;
    if (valueInInches < 12) {
      return { value: valueInInches, unit: 'in' };
    } else {
      return { value: valueInInches / 12, unit: 'ft' };
    }
  }
}

// Format measurement value with appropriate unit
export function formatMeasurement(
  valueInBaseUnit: number,
  baseUnit: 'mm' | 'cm' | 'in',
  unitSystem: UnitSystem,
  decimals: number = 1
): string {
  const { value, unit } = getDisplayUnit(valueInBaseUnit, baseUnit, unitSystem);
  
  // Round to nearest 0.5mm for millimeters (metric)
  if (unit === 'mm') {
    const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5
    // Only show decimal if it's .5, hide .0
    if (roundedValue % 1 === 0) {
      return `${roundedValue.toFixed(0)} ${unit}`; // 49mm, 50mm
    } else {
      return `${roundedValue.toFixed(1)} ${unit}`; // 49.5mm
    }
  }
  
  // For imperial (inches and feet), use 2 decimal places
  if (unit === 'in' || unit === 'ft') {
    return `${value.toFixed(2)} ${unit}`;
  }
  
  // For cm (if used), keep original decimals
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

// Get default calibration unit for unit system
export function getDefaultCalibrationUnit(unitSystem: UnitSystem): 'mm' | 'cm' | 'in' {
  return unitSystem === 'metric' ? 'mm' : 'in';
}
