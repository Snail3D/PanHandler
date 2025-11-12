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

        // ALWAYS forcefully add ARCore as optional to prevent the "AR Required" error
        // Remove any existing ARCore optional tags first to avoid duplicates
        manifestContent = manifestContent.replace(
          /<meta-data[^>]*android:name="com\.google\.ar\.core"[^>]*\/>/gi,
          ''
        );
        manifestContent = manifestContent.replace(
          /<meta-data[^>]*android:name="com\.google\.ar\.core\.min_apk_version"[^>]*\/>/gi, 
          ''
        );
        
        // Now add the ARCore optional metadata RIGHT BEFORE closing </application>
        // This MUST be the last thing we do to ensure nothing overwrites it
        const arCoreMetadata = `    <!-- FORCE ARCore Optional - DO NOT REMOVE -->
    <meta-data android:name="com.google.ar.core" android:value="optional" />
    <meta-data android:name="com.google.ar.core.min_apk_version" android:value="241010000" />
    <!-- END ARCore Optional -->`;
        
        manifestContent = manifestContent.replace(
          '</application>',
          arCoreMetadata + '\n    </application>'
        );
        console.log('[withNoARCore] FORCEFULLY added ARCore as optional with minimum version');

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
