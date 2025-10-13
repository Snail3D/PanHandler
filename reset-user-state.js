// Reset User State Script
// This clears AsyncStorage to simulate a fresh user experience

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function resetUserState() {
  try {
    console.log('🔄 Resetting user state...');
    
    // Clear all AsyncStorage data
    await AsyncStorage.clear();
    
    console.log('✅ User state reset complete!');
    console.log('');
    console.log('Fresh user state:');
    console.log('  • No saved email');
    console.log('  • No saved measurements');
    console.log('  • No saved coin selection');
    console.log('  • Session count: 0');
    console.log('  • Monthly limits reset');
    console.log('  • Unit system: metric (default)');
    console.log('  • Pro status: false');
    console.log('');
    console.log('🎯 Reload the app to experience it as a new user!');
    
  } catch (error) {
    console.error('❌ Error resetting user state:', error);
  }
}

// Run the reset
resetUserState();
