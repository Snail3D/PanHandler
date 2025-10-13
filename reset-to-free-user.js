// Reset to Free User - Clear Pro Status
// Run this in React Native Debugger console or with node

const resetToFreeUser = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    
    console.log('🔄 Resetting to FREE user state...');
    console.log('');
    
    // Get current state
    const currentState = await AsyncStorage.getItem('measurement-settings');
    
    if (currentState) {
      const parsed = JSON.parse(currentState);
      console.log('📊 Current state:');
      console.log('  isProUser:', parsed.state?.isProUser || false);
      console.log('  userEmail:', parsed.state?.userEmail || 'none');
      console.log('  monthlySaveCount:', parsed.state?.monthlySaveCount || 0);
      console.log('  monthlyEmailCount:', parsed.state?.monthlyEmailCount || 0);
      console.log('');
    }
    
    // COMPLETELY CLEAR ALL DATA
    await AsyncStorage.clear();
    
    console.log('✅ All data cleared!');
    console.log('');
    console.log('Fresh FREE user state:');
    console.log('  ✓ isProUser: false');
    console.log('  ✓ userEmail: null');
    console.log('  ✓ monthlySaveCount: 0/10');
    console.log('  ✓ monthlyEmailCount: 0/10');
    console.log('  ✓ sessionCount: 0');
    console.log('  ✓ All measurements cleared');
    console.log('  ✓ All labels cleared');
    console.log('');
    console.log('🎯 Reload the app to experience it as a NEW FREE USER!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// If running in browser/debugger
if (typeof AsyncStorage !== 'undefined') {
  resetToFreeUser();
} else {
  console.log('⚠️  This script needs to run in React Native Debugger console');
  console.log('');
  console.log('Copy and paste this into the console:');
  console.log('');
  console.log('await AsyncStorage.clear(); console.log("✅ Cleared! Reload the app.");');
}
