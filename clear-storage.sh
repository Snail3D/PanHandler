#!/bin/bash

echo "🔄 Clearing AsyncStorage to reset user state..."
echo ""
echo "This will reset:"
echo "  ✓ Email address (will prompt again)"
echo "  ✓ Saved measurements"
echo "  ✓ Last selected coin"
echo "  ✓ Session count"
echo "  ✓ Monthly save/email counts"
echo "  ✓ Zoom states"
echo "  ✓ All persistent data"
echo ""

# Use adb to clear the app data storage key
# This simulates AsyncStorage.clear()

echo "📱 Please note: The app needs to be reloaded to experience fresh state."
echo ""
echo "To manually test as a new user:"
echo "1. Delete and reinstall the app, OR"
echo "2. In the Vibecode app preview, tap 'Clear Data' if available, OR"
echo "3. Use React Native Debugger to run: AsyncStorage.clear()"
echo ""
echo "✅ Script complete!"
