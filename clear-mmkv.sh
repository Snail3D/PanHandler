#!/bin/bash
# Clear MMKV storage to fix performance issues

echo "🧹 Clearing MMKV storage..."

# For iOS simulator/device - MMKV stores in app's Documents directory
# This script should be run from the app itself, but we can try to find it

# Find the app's container
APP_CONTAINER=$(find ~/Library/Developer/CoreSimulator/Devices -name "default.mmkv" 2>/dev/null | head -1 | xargs dirname)

if [ -n "$APP_CONTAINER" ]; then
  echo "📁 Found MMKV at: $APP_CONTAINER"
  rm -f "$APP_CONTAINER"/*.mmkv*
  echo "✅ Cleared MMKV storage"
else
  echo "❌ Could not find MMKV storage"
  echo "💡 Try clearing app data from iOS Settings or reinstalling the app"
fi

echo ""
echo "Alternative: Delete and reinstall the app to clear all data"
