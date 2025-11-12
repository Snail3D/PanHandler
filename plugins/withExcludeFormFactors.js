const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * Plugin to explicitly exclude TV, Chromebook, and Wearable devices
 * Uses withDangerousMod to modify final AndroidManifest.xml directly
 * Runs absolutely last to catch features added by all dependencies
 */
module.exports = function withExcludeFormFactors(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const manifestPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/AndroidManifest.xml'
      );

      if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, 'utf-8');
        const originalContent = manifestContent;

        // Features to remove
        const unwantedFeatures = [
          'android.software.leanback',
          'android.hardware.microphone',
          'android.hardware.location',
          'android.hardware.location.gps',
          'android.hardware.location.network',
          'android.hardware.faketouch',
        ];

        // Remove uses-feature tags for unwanted features
        unwantedFeatures.forEach(feature => {
          // Match various formats: <uses-feature android:name="..." />
          const pattern = new RegExp(
            `<uses-feature[^>]*android:name=["']${feature.replace(/\./g, '\\.')}["'][^>]*/?>`,
            'gi'
          );
          const matches = manifestContent.match(pattern);
          if (matches) {
            matches.forEach(match => {
              console.log(`[withExcludeFormFactors] Removing: ${match.trim()}`);
              manifestContent = manifestContent.replace(match, '');
            });
          }
        });

        // Also remove from multi-line format
        unwantedFeatures.forEach(feature => {
          const escapedFeature = feature.replace(/\./g, '\\.');
          const multilinePattern = new RegExp(
            `<uses-feature[^>]*android:name=["']${escapedFeature}["'][^>]*>\\s*</uses-feature>`,
            'gi'
          );
          manifestContent = manifestContent.replace(multilinePattern, '');
        });

        if (manifestContent !== originalContent) {
          fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
          console.log('[withExcludeFormFactors] Successfully removed unwanted features from AndroidManifest.xml');
        } else {
          console.log('[withExcludeFormFactors] No unwanted features found in AndroidManifest.xml');
        }
      }

      return config;
    },
  ]);
};
