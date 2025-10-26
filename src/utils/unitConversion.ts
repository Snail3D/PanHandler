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
    // Add K/M suffixes for large values
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M km`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K km`;
    } else {
      return `${value.toFixed(2)} km`;
    }
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
    // Add K/M suffixes for large values
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M mi`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K mi`;
    } else {
      return `${value.toFixed(2)} mi`;
    }
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
    if (areaInMm2 < 1000) { // Less than 10cm² - keep in mm² for precision
      const roundedValue = Math.round(areaInMm2 * 2) / 2; // Round to nearest 0.5
      if (roundedValue % 1 === 0) {
        return `${roundedValue.toFixed(0)} mm²`;
      } else {
        return `${roundedValue.toFixed(1)} mm²`;
      }
    } else if (areaInMm2 < 1000000) { // Less than 1m² - use cm²
      const valueInCm2 = areaInMm2 / 100;
      return `${valueInCm2.toFixed(1)} cm²`;
    } else {
      const valueInM2 = areaInMm2 / 1000000;
      // Format m² with K/M suffixes
      if (valueInM2 >= 1000000) {
        return `${(valueInM2 / 1000000).toFixed(2)}M m²`;
      } else if (valueInM2 >= 1000) {
        return `${(valueInM2 / 1000).toFixed(2)}K m²`;
      } else {
        return `${valueInM2.toFixed(2)} m²`;
      }
    }
  } else {
    // Imperial: use in² for small areas, ft² for large, always show acres
    const valueInIn2 = areaInMm2 / 645.16;
    const valueInFt2 = valueInIn2 / 144;
    const acres = valueInFt2 / 43560; // 1 acre = 43,560 ft²

    // Format ft² with K/M suffixes
    let ft2Str: string;
    if (valueInFt2 >= 1000000) {
      ft2Str = `${(valueInFt2 / 1000000).toFixed(2)}M ft²`;
    } else if (valueInFt2 >= 1000) {
      ft2Str = `${(valueInFt2 / 1000).toFixed(2)}K ft²`;
    } else {
      ft2Str = `${valueInFt2.toFixed(2)} ft²`;
    }

    // Format acres with K/M suffixes
    let acreStr: string;
    if (acres >= 1000000) {
      acreStr = `${(acres / 1000000).toFixed(2)}M ac`;
    } else if (acres >= 1000) {
      acreStr = `${(acres / 1000).toFixed(2)}K ac`;
    } else if (acres >= 100) {
      acreStr = `${Math.round(acres)} ac`;
    } else {
      acreStr = `${acres.toFixed(2)} ac`;
    }

    if (valueInIn2 < 144) { // Less than 1ft²
      return `${valueInIn2.toFixed(2)} in² (${acreStr})`;
    } else {
      return `${ft2Str} (${acreStr})`;
    }
  }
}

// Get default calibration unit for unit system
export function getDefaultCalibrationUnit(unitSystem: UnitSystem): 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi' {
  return unitSystem === 'metric' ? 'mm' : 'in';
}

// Format volume measurement with appropriate unit
export function formatVolumeMeasurement(
  volumeInBaseUnit: number, // volume in cubic units of baseUnit
  baseUnit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi',
  unitSystem: UnitSystem
): string {
  // First convert to mm³ (base volume unit)
  let volumeInMm3: number;
  if (baseUnit === 'mm') {
    volumeInMm3 = volumeInBaseUnit;
  } else if (baseUnit === 'cm') {
    volumeInMm3 = volumeInBaseUnit * 1000; // 1cm³ = 1000mm³
  } else if (baseUnit === 'm') {
    volumeInMm3 = volumeInBaseUnit * 1000000000; // 1m³ = 1,000,000,000mm³
  } else if (baseUnit === 'km') {
    volumeInMm3 = volumeInBaseUnit * 1e18; // 1km³ = 1e18mm³
  } else if (baseUnit === 'in') {
    volumeInMm3 = volumeInBaseUnit * 16387.064; // 1in³ = 16387.064mm³
  } else if (baseUnit === 'mi') {
    volumeInMm3 = volumeInBaseUnit * 4.168e15; // 1mi³ = huge mm³
  } else {
    volumeInMm3 = volumeInBaseUnit * 28316846.592; // 1ft³ = 28316846.592mm³
  }

  if (unitSystem === 'metric') {
    // Convert to liters (1L = 1,000,000 mm³ = 1000 cm³)
    const liters = volumeInMm3 / 1000000;

    if (liters < 1) {
      // Show in milliliters (mL)
      const milliliters = liters * 1000;
      return `${milliliters.toFixed(0)} mL`;
    } else if (liters < 1000) {
      // Show in liters
      return `${liters.toFixed(2)} L`;
    } else {
      // Show in cubic meters with liters in parentheses (with K/M suffixes)
      const m3 = liters / 1000;

      // Format m³ with K/M suffixes
      let m3Str: string;
      if (m3 >= 1000000) {
        m3Str = `${(m3 / 1000000).toFixed(2)}M m³`;
      } else if (m3 >= 1000) {
        m3Str = `${(m3 / 1000).toFixed(2)}K m³`;
      } else {
        m3Str = `${m3.toFixed(2)} m³`;
      }

      // Format liters with K/M suffixes
      let litersStr: string;
      if (liters >= 1000000) {
        litersStr = `${(liters / 1000000).toFixed(2)}M L`;
      } else if (liters >= 1000) {
        litersStr = `${(liters / 1000).toFixed(2)}K L`;
      } else {
        litersStr = `${liters.toFixed(0)} L`;
      }

      return `${m3Str} (${litersStr})`;
    }
  } else {
    // Imperial: convert to fluid ounces first
    const fluidOunces = volumeInMm3 / 29573.529; // 1 fl oz = 29573.529 mm³

    if (fluidOunces < 32) {
      // Show in fluid ounces
      return `${fluidOunces.toFixed(1)} fl oz`;
    } else if (fluidOunces < 128) {
      // Show in quarts (32 fl oz = 1 qt)
      const quarts = fluidOunces / 32;
      return `${quarts.toFixed(2)} qt`;
    } else {
      // Show in gallons (128 fl oz = 1 gal)
      const gallons = fluidOunces / 128;

      if (gallons < 1000) {
        return `${gallons.toFixed(2)} gal`;
      } else {
        // Very large volumes - show cubic feet with gallons in parentheses (with K/M suffixes)
        const cubicFeet = volumeInMm3 / 28316846.592;

        // Format ft³ with K/M suffixes
        let ft3Str: string;
        if (cubicFeet >= 1000000) {
          ft3Str = `${(cubicFeet / 1000000).toFixed(2)}M ft³`;
        } else if (cubicFeet >= 1000) {
          ft3Str = `${(cubicFeet / 1000).toFixed(2)}K ft³`;
        } else {
          ft3Str = `${cubicFeet.toFixed(2)} ft³`;
        }

        // Format gallons with K/M suffixes
        let gallonsStr: string;
        if (gallons >= 1000000) {
          gallonsStr = `${(gallons / 1000000).toFixed(2)}M gal`;
        } else if (gallons >= 1000) {
          gallonsStr = `${(gallons / 1000).toFixed(2)}K gal`;
        } else {
          gallonsStr = `${gallons.toFixed(0)} gal`;
        }

        return `${ft3Str} (${gallonsStr})`;
      }
    }
  }
}
