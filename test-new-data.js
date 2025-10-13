console.log('=== TESTING ALL FORMULAS WITH NEW DATA ===\n');

const PPU = 1.863;
const zoom = 3.286;
const pixelRatio = 3;
const imageRatio = 4.218;
const appMeasurement = 55.43;
const fusionMeasurement = 19.601;
const recommendedScale = 1.410880;

console.log('App shows: 55.43 mm');
console.log('Fusion with scale 1.410880 shows: 19.601 mm');
console.log('Error factor:', (appMeasurement / fusionMeasurement).toFixed(4));
console.log('');

// Calculate what scale SHOULD work
const correctScale = recommendedScale * (appMeasurement / fusionMeasurement);
console.log('Correct Canvas Scale should be:', correctScale.toFixed(6), 'mm/px');
console.log('');

// Now test all formulas
const formulas = {
  'A: (1/PPU) × zoom × √2.8': (1/PPU) * zoom * Math.sqrt(2.8),
  'B: (1/PPU) × zoom × 0.8': (1/PPU) * zoom * 0.8,
  'C: (1/PPU) × √pxR × zoom × (imgR/4.36)': (1/PPU) * Math.sqrt(pixelRatio) * zoom * (imageRatio / 4.36),
  'D: (1/PPU) × zoom × (imgR/pxR)': (1/PPU) * zoom * (imageRatio / pixelRatio),
  'E: (1/PPU) × √pxR × zoom × (imgR/pxR/√pxR)': (1/PPU) * Math.sqrt(pixelRatio) * zoom * (imageRatio / pixelRatio / Math.sqrt(pixelRatio)),
};

console.log('Testing formulas:');
Object.entries(formulas).forEach(([name, result]) => {
  const error = Math.abs(result - correctScale) / correctScale * 100;
  const match = error < 1 ? '✅' : '  ';
  console.log(match, name);
  console.log('   Result:', result.toFixed(6), '| Error:', error.toFixed(2) + '%');
});
console.log('');
console.log('Target:', correctScale.toFixed(6));
