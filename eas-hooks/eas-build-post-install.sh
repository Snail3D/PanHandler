#!/usr/bin/env bash

# EAS Build Hook - Runs after dependencies are installed but before the build
echo "[EAS Hook] Starting permission cleanup..."

# Find and patch all AndroidManifest.xml files
find . -name "AndroidManifest.xml" -type f | while read -r manifest; do
    echo "[EAS Hook] Cleaning manifest: $manifest"
    
    # Remove unwanted permissions
    sed -i.bak '/<uses-permission.*RECORD_AUDIO/d' "$manifest"
    sed -i.bak '/<uses-permission.*MODIFY_AUDIO/d' "$manifest"
    sed -i.bak '/<uses-permission.*ACTIVITY_RECOGNITION/d' "$manifest"
    sed -i.bak '/<uses-permission.*USE_BIOMETRIC/d' "$manifest"
    sed -i.bak '/<uses-permission.*USE_FINGERPRINT/d' "$manifest"
    sed -i.bak '/<uses-permission.*ACCESS_NETWORK_STATE/d' "$manifest"
    sed -i.bak '/<uses-permission.*READ_MEDIA_AUDIO/d' "$manifest"
    sed -i.bak '/<uses-permission.*READ_MEDIA_VIDEO/d' "$manifest"
    sed -i.bak '/<uses-permission.*READ_MEDIA_VISUAL_USER_SELECTED/d' "$manifest"
    sed -i.bak '/<uses-permission.*CHECK_LICENSE/d' "$manifest"
    
    # Remove microphone feature
    sed -i.bak '/<uses-feature.*microphone/d' "$manifest"
    
    # Remove ALL ARCore references - NO ARCore at all
    sed -i.bak '/<meta-data.*com\.google\.ar/d' "$manifest"
    sed -i.bak '/<uses-feature.*ar\.core/d' "$manifest"
    sed -i.bak '/<uses-feature.*camera\.ar/d' "$manifest"
    sed -i.bak '/<uses-library.*com\.google\.ar/d' "$manifest"
    
    # Clean up backup files
    rm -f "${manifest}.bak"
done

echo "[EAS Hook] Permission cleanup complete"
