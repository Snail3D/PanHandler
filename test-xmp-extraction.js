/**
 * Test XMP extraction from DJI Neo photo
 * 
 * Usage: node test-xmp-extraction.js <path-to-drone-photo>
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node test-xmp-extraction.js <path-to-drone-photo>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

console.log('Reading file:', filePath);
console.log('File size:', fs.statSync(filePath).size, 'bytes\n');

// Read as UTF-8 text
const textData = fs.readFileSync(filePath, 'utf8');

// Find XMP packet
const xmpStart = textData.indexOf('<x:xmpmeta');
const xmpEnd = textData.indexOf('</x:xmpmeta>') + 12;

if (xmpStart === -1 || xmpEnd <= xmpStart) {
  console.log('❌ NO XMP DATA FOUND');
  
  // Try alternative XMP markers
  const alt1 = textData.indexOf('<?xpacket');
  const alt2 = textData.indexOf('<rdf:RDF');
  const alt3 = textData.indexOf('drone-dji:');
  
  console.log('\nAlternative markers:');
  console.log('<?xpacket:', alt1 !== -1 ? `FOUND at position ${alt1}` : 'NOT FOUND');
  console.log('<rdf:RDF:', alt2 !== -1 ? `FOUND at position ${alt2}` : 'NOT FOUND');
  console.log('drone-dji:', alt3 !== -1 ? `FOUND at position ${alt3}` : 'NOT FOUND');
  
  process.exit(1);
}

const xmpText = textData.substring(xmpStart, xmpEnd);
console.log('✅ XMP DATA FOUND');
console.log('Length:', xmpText.length, 'characters');
console.log('Start position:', xmpStart);
console.log('End position:', xmpEnd);
console.log('\n' + '='.repeat(80) + '\n');

// Parse DJI tags
const tags = {
  'RelativeAltitude': /<drone-dji:RelativeAltitude>([^<]+)<\/drone-dji:RelativeAltitude>/,
  'AbsoluteAltitude': /<drone-dji:AbsoluteAltitude>([^<]+)<\/drone-dji:AbsoluteAltitude>/,
  'GimbalPitchDegree': /<drone-dji:GimbalPitchDegree>([^<]+)<\/drone-dji:GimbalPitchDegree>/,
  'GimbalYawDegree': /<drone-dji:GimbalYawDegree>([^<]+)<\/drone-dji:GimbalYawDegree>/,
  'GimbalRollDegree': /<drone-dji:GimbalRollDegree>([^<]+)<\/drone-dji:GimbalRollDegree>/,
  'FlightYawDegree': /<drone-dji:FlightYawDegree>([^<]+)<\/drone-dji:FlightYawDegree>/,
  'FlightPitchDegree': /<drone-dji:FlightPitchDegree>([^<]+)<\/drone-dji:FlightPitchDegree>/,
  'FlightRollDegree': /<drone-dji:FlightRollDegree>([^<]+)<\/drone-dji:FlightRollDegree>/,
};

console.log('DJI XMP TAGS:\n');
let foundAny = false;

for (const [tagName, regex] of Object.entries(tags)) {
  const match = xmpText.match(regex);
  if (match) {
    console.log(`✅ ${tagName}: ${match[1]}`);
    foundAny = true;
  } else {
    console.log(`❌ ${tagName}: NOT FOUND`);
  }
}

if (!foundAny) {
  console.log('\n⚠️  NO DJI TAGS FOUND IN XMP DATA');
  console.log('\nShowing first 1000 characters of XMP:\n');
  console.log(xmpText.substring(0, 1000));
}

console.log('\n' + '='.repeat(80) + '\n');
console.log('DONE');
