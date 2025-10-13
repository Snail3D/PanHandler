console.log('=== ALL 4 TEST CASES ANALYSIS ===\n');

const tests = [
  { 
    name: 'Test 1',
    PPU: 1.712,
    zoom: 3.879,
    pixelRatio: 3,
    imageRatio: 4.218,
    correctScale: 3.796866
  },
  {
    name: 'Test 2',
    PPU: 0.974,
    zoom: 5.603,
    pixelRatio: 3,
    imageRatio: 4.218,
    correctScale: 4.605
  },
  {
    name: 'Test 3',
    PPU: 1.863,
    zoom: 3.286,
    pixelRatio: 3,
    imageRatio: 4.218,
    correctScale: 3.989851
  },
  {
    name: 'Test 4',
    PPU: 1.258,
    zoom: 4.032,
    pixelRatio: 3,
    imageRatio: 4.218,
    correctScale: 4.95
  }
];

console.log('Raw data:');
tests.forEach(t => {
  console.log(`${t.name}: PPU=${t.PPU}, zoom=${t.zoom}, correctScale=${t.correctScale}`);
});
console.log('');

// Calculate what multiplier each needs
console.log('Analyzing multipliers needed:\n');
tests.forEach(test => {
  const base = (1/test.PPU) * test.zoom;
  const mult = test.correctScale / base;
  
  console.log(test.name + ':');
  console.log('  (1/PPU) × zoom =', base.toFixed(4));
  console.log('  Correct scale =', test.correctScale);
  console.log('  Multiplier =', mult.toFixed(4));
  
  // Test various relationships
  console.log('  Could multiplier be:');
  console.log('    √pixelRatio =', Math.sqrt(test.pixelRatio).toFixed(4), '(diff:', Math.abs(mult - Math.sqrt(test.pixelRatio)).toFixed(4) + ')');
  console.log('    pixelRatio/2 =', (test.pixelRatio/2).toFixed(4), '(diff:', Math.abs(mult - test.pixelRatio/2).toFixed(4) + ')');
  console.log('    imageRatio/pixelRatio =', (test.imageRatio/test.pixelRatio).toFixed(4), '(diff:', Math.abs(mult - test.imageRatio/test.pixelRatio).toFixed(4) + ')');
  
  // Store for correlation analysis
  test.multiplier = mult;
  test.base = base;
  console.log('');
});

// Check for correlation with zoom
console.log('=== CORRELATION WITH ZOOM ===');
const sortedByZoom = [...tests].sort((a, b) => a.zoom - b.zoom);
console.log('Sorted by zoom:');
sortedByZoom.forEach(t => {
  console.log(`  zoom=${t.zoom.toFixed(3)}, multiplier=${t.multiplier.toFixed(4)}`);
});
console.log('');

// Check mult × PPU
console.log('=== CHECKING mult × PPU ===');
tests.forEach(t => {
  const product = t.multiplier * t.PPU;
  console.log(`${t.name}: mult × PPU = ${product.toFixed(4)}`);
});
console.log('');

// Check if correct scale relates directly to any combination
console.log('=== TESTING DIRECT FORMULAS ===');
tests.forEach(test => {
  console.log(test.name + ' (correct=' + test.correctScale + '):');
  const formulas = {
    '(1/PPU) × zoom × √3': (1/test.PPU) * test.zoom * Math.sqrt(3),
    '(1/PPU) × zoom × 1.55': (1/test.PPU) * test.zoom * 1.55,
    '(1/PPU) × zoom × (imgRatio/pixelRatio)': (1/test.PPU) * test.zoom * (test.imageRatio/test.pixelRatio),
    '(1/PPU) × zoom × pixelRatio / 2': (1/test.PPU) * test.zoom * test.pixelRatio / 2,
  };
  
  Object.entries(formulas).forEach(([name, result]) => {
    const error = Math.abs(result - test.correctScale) / test.correctScale * 100;
    console.log(`  ${name} = ${result.toFixed(4)} (error: ${error.toFixed(1)}%)`);
  });
  console.log('');
});
