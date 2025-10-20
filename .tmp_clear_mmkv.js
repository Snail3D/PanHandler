// Run this in the app to clear old MMKV data
// Paste this into a useEffect in MeasurementScreen.tsx temporarily

import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Clear the old persisted work session data
storage.delete('measurement-settings');

console.log('✅ Cleared old MMKV data');
