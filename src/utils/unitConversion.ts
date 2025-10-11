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
    // Use mm for values less than 10mm, cm otherwise
    if (valueInMm < 10) {
      return { value: valueInMm, unit: 'mm' };
    } else {
      return { value: valueInMm / 10, unit: 'cm' };
    }
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
  return unitSystem === 'metric' ? 'cm' : 'in';
}
