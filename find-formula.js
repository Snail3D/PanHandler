// Comparing the two working test cases

console.log('=== TEST 1 (Previous - WORKED) ===');
const test1_PPU = 1.712;
const test1_zoom = 3.879;
const test1_pixelRatio = 3;
const test1_imageRatio = 4.218;
const test1_correctScale = 3.796866; // This worked in Fusion

console.log('PPU:', test1_PPU);
console.log('Zoom:', test1_zoom);
console.log('PixelRatio:', test1_pixelRatio);
console.log('ImageRatio:', test1_imageRatio);
console.log('Correct Canvas Scale:', test1_correctScale, 'mm/px');
console.log('');

console.log('=== TEST 2 (Current - CORRECT VALUE) ===');
const test2_PPU = 0.974;
const test2_zoom = 5.603;
const test2_pixelRatio = 3;
const test2_correctScale = 4.605; // You said this is correct

console.log('PPU:', test2_PPU);
console.log('Zoom:', test2_zoom);
console.log('PixelRatio:', test2_pixelRatio);
console.log('Correct Canvas Scale:', test2_correctScale, 'mm/px');
console.log('');

console.log('=== FORMULA TESTING ===');

// Test various formulas
const formulas = {
  '(1/PPU) × zoom': {
    test1: (1/test1_PPU) * test1_zoom,
    test2: (1/test2_PPU) * test2_zoom
  },
  '(1/PPU) × zoom × √pixelRatio': {
    test1: (1/test1_PPU) * test1_zoom * Math.sqrt(test1_pixelRatio),
    test2: (1/test2_PPU) * test2_zoom * Math.sqrt(test2_pixelRatio)
  },
  '(1/PPU) × zoom × pixelRatio / 2': {
    test1: (1/test1_PPU) * test1_zoom * test1_pixelRatio / 2,
    test2: (1/test2_PPU) * test2_zoom * test2_pixelRatio / 2
  },
  '(1/PPU) × zoom × √2.8': {
    test1: (1/test1_PPU) * test1_zoom * Math.sqrt(2.8),
    test2: (1/test2_PPU) * test2_zoom * Math.sqrt(2.8)
  },
  '(1/PPU) × zoom × 0.8': {
    test1: (1/test1_PPU) * test1_zoom * 0.8,
    test2: (1/test2_PPU) * test2_zoom * 0.8
  }
};

console.log('Testing formulas:\n');
Object.entries(formulas).forEach(([name, results]) => {
  const error1 = Math.abs(results.test1 - test1_correctScale) / test1_correctScale * 100;
  const error2 = Math.abs(results.test2 - test2_correctScale) / test2_correctScale * 100;
  
  console.log(name);
  console.log('  Test 1:', results.test1.toFixed(4), '(error:', error1.toFixed(1) + '%)');
  console.log('  Test 2:', results.test2.toFixed(4), '(error:', error2.toFixed(1) + '%)');
  
  if (error1 < 1 && error2 < 1) {
    console.log('  ✅ WINNER!');
  }
  console.log('');
});
