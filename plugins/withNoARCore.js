const { withAndroidManifest, withPlugins, withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * FINAL ARCore removal - runs after ALL other plugins
 * Removes ARCore from the final AndroidManifest.xml
 */
function withNoARCore(config) {
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

        // Remove ALL ARCore related lines completely
        const arCorePatterns = [
          /<meta-data[^>]*android:name="com\.google\.ar[^"]*"[^>]*\/>/gi,
          /<meta-data[^>]*android:name="com\.google\.ar[^"]*"[^>]*>[^<]*<\/meta-data>/gi,
          /<uses-feature[^>]*android:name="[^"]*ar\.core[^"]*"[^>]*\/>/gi,
          /<uses-feature[^>]*android:name="android\.hardware\.camera\.ar"[^>]*\/>/gi,
          /<uses-library[^>]*android:name="com\.google\.ar[^"]*"[^>]*\/>/gi,
        ];

        arCorePatterns.forEach(pattern => {
          const matches = manifestContent.match(pattern);
          if (matches) {
            matches.forEach(match => {
              console.log(`[withNoARCore] Removing: ${match}`);
              manifestContent = manifestContent.replace(match, '');
            });
          }
        });

        // Also check for ARCore in different formats
        if (manifestContent.includes('com.google.ar')) {
          console.log('[withNoARCore] WARNING: ARCore references still found after removal!');
          // More aggressive removal
          manifestContent = manifestContent.split('\n').filter(line => {
            if (line.includes('com.google.ar') || line.includes('ar.core') || line.includes('camera.ar')) {
              console.log(`[withNoARCore] Removing line: ${line.trim()}`);
              return false;
            }
            return true;
          }).join('\n');
        }

        // Remove ALL ARCore metadata completely - NO ARCore at all
        manifestContent = manifestContent.replace(
          /<meta-data[^>]*android:name="com\.google\.ar[^"]*"[^>]*\/>/gi,
          ''
        );
        
        // Remove any ARCore uses-feature
        manifestContent = manifestContent.replace(
          /<uses-feature[^>]*android:name="[^"]*ar\.core[^"]*"[^>]*\/>/gi,
          ''
        );
        manifestContent = manifestContent.replace(
          /<uses-feature[^>]*android:name="android\.hardware\.camera\.ar"[^>]*\/>/gi,
          ''
        );
        
        // Remove any ARCore uses-library
        manifestContent = manifestContent.replace(
          /<uses-library[^>]*android:name="com\.google\.ar[^"]*"[^>]*\/>/gi,
          ''
        );
        
        console.log('[withNoARCore] REMOVED all ARCore references - NO ARCore at all');

        if (manifestContent !== originalContent) {
          fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
          console.log('[withNoARCore] Successfully updated AndroidManifest.xml');
        } else {
          console.log('[withNoARCore] No changes needed in AndroidManifest.xml');
        }
      }

      return config;
    },
  ]);
}

module.exports = withNoARCore;
