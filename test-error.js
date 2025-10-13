const PPU = 0.974;
const zoom = 5.603;
const pixelRatio = 3;
const appMeasurement = 54.27;
const fusionMeasurement = 113.527;

// What we calculated
const ourFormula = (1/PPU) * zoom * Math.sqrt(2.8);
console.log('Our √2.8 formula gave:', ourFormula.toFixed(6), 'mm/px');

// Error factor
const errorFactor = fusionMeasurement / appMeasurement;
console.log('Fusion / App ratio:', errorFactor.toFixed(6));

// What actually should work
const correctScale = ourFormula * errorFactor;
console.log('Correct scale should be:', correctScale.toFixed(6), 'mm/px');

console.log('\nComparing to previous test:');
console.log('Previous test:');
console.log('  PPU=1.712, zoom=3.879, formula gave 3.791, worked!');
console.log('This test:');
console.log('  PPU=0.974, zoom=5.603, formula gave', ourFormula.toFixed(3), 'but off by', errorFactor.toFixed(2) + 'x');

console.log('\nWait... let me check the previous test data more carefully');
const prevPPU = 1.712;
const prevZoom = 3.879;
const prevWorked = 3.796866; // Test A that worked
const prevFormula = (1/prevPPU) * prevZoom * Math.sqrt(2.8);

console.log('\nPrevious test verification:');
console.log('  Formula calculated:', prevFormula.toFixed(6));
console.log('  Test A (worked):', prevWorked);
console.log('  Ratio:', (prevWorked / prevFormula).toFixed(6));
