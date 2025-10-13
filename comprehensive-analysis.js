console.log('=== COMPREHENSIVE ANALYSIS OF ALL 3 TESTS ===\n');

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
    imageRatio: 4.218,  // assumed same
    correctScale: 3.989851
  }
];

// For each test, calculate what multiplier is needed
tests.forEach(test => {
  const base = 1 / test.PPU;
  const mult = test.correctScale / base;
  
  console.log(test.name + ':');
  console.log('  PPU =', test.PPU, ', zoom =', test.zoom);
  console.log('  Correct Scale =', test.correctScale);
  console.log('  1/PPU =', base.toFixed(4));
  console.log('  Multiplier needed =', mult.toFixed(4));
  console.log('  mult / zoom =', (mult / test.zoom).toFixed(4));
  console.log('  mult × PPU =', (mult * test.PPU).toFixed(4));
  console.log('  mult × PPU / zoom =', (mult * test.PPU / test.zoom).toFixed(4));
  console.log('');
});

// Look for patterns
console.log('=== LOOKING FOR PATTERNS ===\n');

// Test if multiplier = zoom × constant
const mults = tests.map(t => t.correctScale / (1/t.PPU));
const zoomRatios = tests.map(t => mults[tests.indexOf(t)] / t.zoom);

console.log('Multipliers:', mults.map(m => m.toFixed(4)).join(', '));
console.log('mult / zoom:', zoomRatios.map(r => r.toFixed(4)).join(', '));
console.log('Average mult/zoom:', (zoomRatios.reduce((a,b) => a+b) / zoomRatios.length).toFixed(4));
console.log('');

// Test if it's related to imageRatio
const imgRatioTest = mults.map((m, i) => m / tests[i].imageRatio);
console.log('mult / imageRatio:', imgRatioTest.map(r => r.toFixed(4)).join(', '));
console.log('');

// Test combinations
tests.forEach((test, i) => {
  const m = mults[i];
  console.log(test.name + ' multiplier ' + m.toFixed(4) + ' could be:');
  console.log('  zoom × imageRatio / pixelRatio =', (test.zoom * test.imageRatio / test.pixelRatio).toFixed(4));
  console.log('  zoom × sqrt(imageRatio) =', (test.zoom * Math.sqrt(test.imageRatio)).toFixed(4));
  console.log('  zoom × 1.73 =', (test.zoom * 1.73).toFixed(4));
  console.log('  zoom × sqrt(3) =', (test.zoom * Math.sqrt(3)).toFixed(4));
  console.log('  zoom × 2.14 =', (test.zoom * 2.14).toFixed(4));
  console.log('');
});
