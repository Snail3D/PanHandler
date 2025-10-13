// Finding what formula produces the correct Canvas Scale values

console.log('=== REVERSE ENGINEERING THE FORMULA ===\n');

// Test 1 data (worked)
const t1 = {
  PPU: 1.712,
  zoom: 3.879,
  pixelRatio: 3,
  imageRatio: 4.218,
  correctScale: 3.796866
};

// Test 2 data (worked)
const t2 = {
  PPU: 0.974,
  zoom: 5.603,
  pixelRatio: 3,
  correctScale: 4.605
};

// Find the multiplier for each test
const base1 = (1/t1.PPU) * t1.zoom;
const multiplier1 = t1.correctScale / base1;

const base2 = (1/t2.PPU) * t2.zoom;
const multiplier2 = t2.correctScale / base2;

console.log('Test 1:');
console.log('  (1/PPU) × zoom =', base1.toFixed(4));
console.log('  Correct scale =', t1.correctScale);
console.log('  Multiplier needed =', multiplier1.toFixed(4));
console.log('');

console.log('Test 2:');
console.log('  (1/PPU) × zoom =', base2.toFixed(4));
console.log('  Correct scale =', t2.correctScale);
console.log('  Multiplier needed =', multiplier2.toFixed(4));
console.log('');

console.log('The multipliers are DIFFERENT!');
console.log('Test 1 needs:', multiplier1.toFixed(4));
console.log('Test 2 needs:', multiplier2.toFixed(4));
console.log('');

// What could cause this difference?
console.log('=== WHAT CHANGED BETWEEN TESTS? ===');
console.log('PPU ratio (t1/t2):', (t1.PPU / t2.PPU).toFixed(4));
console.log('Zoom ratio (t1/t2):', (t1.zoom / t2.zoom).toFixed(4));
console.log('Multiplier ratio (t1/t2):', (multiplier1 / multiplier2).toFixed(4));
console.log('');

// Test if multiplier relates to zoom
console.log('Does multiplier relate to zoom?');
console.log('  t1: zoom =', t1.zoom.toFixed(3), ', multiplier =', multiplier1.toFixed(4));
console.log('  t2: zoom =', t2.zoom.toFixed(3), ', multiplier =', multiplier2.toFixed(4));
console.log('  multiplier × zoom:');
console.log('    t1:', (multiplier1 * t1.zoom).toFixed(4));
console.log('    t2:', (multiplier2 * t2.zoom).toFixed(4));
console.log('');

// Test if it relates to PPU
console.log('Does multiplier relate to PPU?');
console.log('  multiplier × PPU:');
console.log('    t1:', (multiplier1 * t1.PPU).toFixed(4));
console.log('    t2:', (multiplier2 * t2.PPU).toFixed(4));
console.log('');

// Test if it relates to zoom/PPU
console.log('Does multiplier relate to zoom/PPU ratio?');
console.log('  zoom / PPU:');
console.log('    t1:', (t1.zoom / t1.PPU).toFixed(4));
console.log('    t2:', (t2.zoom / t2.PPU).toFixed(4));
console.log('  multiplier / (zoom/PPU):');
console.log('    t1:', (multiplier1 / (t1.zoom / t1.PPU)).toFixed(4));
console.log('    t2:', (multiplier2 / (t2.zoom / t2.PPU)).toFixed(4));
