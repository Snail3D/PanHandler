// Reset to Pro User - Set Pro Status
// Copy and paste this into React Native Debugger console

const resetToProUser = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    
    console.log('🔄 Resetting to PRO user state...');
    console.log('');
    
    // Get current state
    const currentState = await AsyncStorage.getItem('measurement-settings');
    
    if (currentState) {
      const parsed = JSON.parse(currentState);
      console.log('📊 Current state:');
      console.log('  isProUser:', parsed.state?.isProUser || false);
      console.log('  freehandTrialUsed:', parsed.state?.freehandTrialUsed || 0);
      console.log('  freehandOfferDismissed:', parsed.state?.freehandOfferDismissed || false);
      console.log('');
      
      // Update to Pro
      parsed.state.isProUser = true;
      parsed.state.freehandTrialUsed = 0;
      parsed.state.freehandOfferDismissed = false;
      
      await AsyncStorage.setItem('measurement-settings', JSON.stringify(parsed));
      
      console.log('✅ Updated to PRO user!');
    } else {
      // No existing state, create new pro state
      const newState = {
        state: {
          isProUser: true,
          freehandTrialUsed: 0,
          freehandTrialLimit: 10,
          freehandOfferDismissed: false,
          unitSystem: 'metric',
          lastSelectedCoin: null,
          userEmail: null,
          sessionCount: 0,
          reviewPromptCount: 0,
          hasReviewedApp: false,
          lastReviewPromptDate: null,
          hasSeenPinchTutorial: false
        },
        version: 0
      };
      
      await AsyncStorage.setItem('measurement-settings', JSON.stringify(newState));
      console.log('✅ Created new PRO user state!');
    }
    
    console.log('');
    console.log('PRO user state:');
    console.log('  ✓ isProUser: true');
    console.log('  ✓ freehandTrialUsed: 0');
    console.log('  ✓ freehandOfferDismissed: false');
    console.log('  ✓ Unlimited Freehand access!');
    console.log('');
    console.log('🎯 Reload the app to experience PRO features!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// If running in browser/debugger
if (typeof AsyncStorage !== 'undefined') {
  resetToProUser();
} else {
  console.log('⚠️  This script needs to run in React Native Debugger console');
  console.log('');
  console.log('Copy and paste this into the console:');
  console.log('');
  console.log(`
(async () => {
  const state = await AsyncStorage.getItem('measurement-settings');
  const parsed = JSON.parse(state);
  parsed.state.isProUser = true;
  parsed.state.freehandTrialUsed = 0;
  parsed.state.freehandOfferDismissed = false;
  await AsyncStorage.setItem('measurement-settings', JSON.stringify(parsed));
  console.log('✅ Set to PRO! Reload the app.');
})();
  `.trim());
}
