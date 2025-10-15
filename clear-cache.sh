#!/bin/bash
echo "🧹 Clearing Metro bundler cache..."

# Kill any running Metro processes
pkill -f "cli.js start" 2>/dev/null
pkill -f "react-native" 2>/dev/null

# Clear Metro cache
rm -rf /tmp/metro-* 2>/dev/null
rm -rf /tmp/haste-map-* 2>/dev/null
rm -rf /tmp/react-* 2>/dev/null

# Clear Expo cache  
rm -rf .expo 2>/dev/null

# Clear React Native cache
rm -rf /tmp/metro-cache 2>/dev/null

echo "✅ Cache cleared!"
echo "📱 The dev server should auto-restart."
echo ""
echo "If you still see errors, try:"
echo "  1. Force quit the Expo Go app on your phone"
echo "  2. Reopen the Expo Go app"
echo "  3. Shake device and tap 'Reload'"
