console.log('=== TESTING SIMPLEST FORMULA: 1/PPU ===\n');

const tests = [
  { name: 'Test 1', PPU: 1.712, correct: 3.796866 },
  { name: 'Test 2', PPU: 0.974, correct: 4.605 },
  { name: 'Test 3', PPU: 1.863, correct: 3.989851 },
];

tests.forEach(test => {
  const result = 1 / test.PPU;
  const error = Math.abs(result - test.correct) / test.correct * 100;
  const match = error < 5 ? '✅' : '  ';
  
  console.log(match, test.name);
  console.log('   PPU:', test.PPU);
  console.log('   1/PPU:', result.toFixed(6));
  console.log('   Should be:', test.correct);
  console.log('   Error:', error.toFixed(2) + '%');
  console.log('');
});
