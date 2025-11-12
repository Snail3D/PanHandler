const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * NUCLEAR PERMISSION REMOVAL
 * Runs absolutely last and forcefully removes ALL unwanted permissions
 * This is the final word - nothing gets past this
 */
module.exports = function withNukePermissions(config) {
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

        // List of ALL permissions we DON'T want
        const unwantedPermissions = [
          'android.permission.RECORD_AUDIO',
          'android.permission.USE_BIOMETRIC', 
          'android.permission.USE_FINGERPRINT',
          'android.permission.ACTIVITY_RECOGNITION',
          'android.permission.SYSTEM_ALERT_WINDOW',
          'android.permission.ACCESS_NETWORK_STATE',
          'android.permission.ACCESS_COARSE_LOCATION',
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.ACCESS_MEDIA_LOCATION',
          'android.permission.MODIFY_AUDIO_SETTINGS',
          'android.permission.READ_MEDIA_AUDIO',
          'android.permission.READ_MEDIA_VIDEO',
          'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
          'com.android.vending.CHECK_LICENSE',
        ];

        // List of features we DON'T want
        const unwantedFeatures = [
          'android.hardware.microphone',
          'android.hardware.faketouch',
          'android.software.leanback',
          'android.hardware.location',
          'android.hardware.location.gps',
          'android.hardware.location.network',
        ];

        // Remove unwanted permissions
        unwantedPermissions.forEach(permission => {
          const permissionPattern = new RegExp(
            `<uses-permission[^>]*android:name=["']${permission.replace(/\./g, '\\.')}["'][^>]*/>`,
            'gi'
          );
          const matches = manifestContent.match(permissionPattern);
          if (matches) {
            matches.forEach(match => {
              console.log(`[withNukePermissions] REMOVING PERMISSION: ${match.trim()}`);
              manifestContent = manifestContent.replace(match, '');
            });
          }
        });

        // Remove unwanted features
        unwantedFeatures.forEach(feature => {
          const featurePattern = new RegExp(
            `<uses-feature[^>]*android:name=["']${feature.replace(/\./g, '\\.')}["'][^>]*/>`,
            'gi'
          );
          const matches = manifestContent.match(featurePattern);
          if (matches) {
            matches.forEach(match => {
              console.log(`[withNukePermissions] REMOVING FEATURE: ${match.trim()}`);
              manifestContent = manifestContent.replace(match, '');
            });
          }
        });

        // Clean up any empty lines
        manifestContent = manifestContent.replace(/^\s*[\r\n]/gm, '');

        // FORCE add CAMERA permission if it was removed
        if (!manifestContent.includes('android.permission.CAMERA')) {
          manifestContent = manifestContent.replace(
            '<uses-permission android:name="android.permission.INTERNET"',
            '<uses-permission android:name="android.permission.CAMERA"/>\n  <uses-permission android:name="android.permission.INTERNET"'
          );
        }
        
        if (manifestContent !== originalContent) {
          fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
          console.log('[withNukePermissions] ✅ Successfully nuked all unwanted permissions and features');
          
          // List what's actually left
          const remainingPerms = manifestContent.match(/<uses-permission[^>]*>/gi) || [];
          const remainingFeatures = manifestContent.match(/<uses-feature[^>]*>/gi) || [];
          
          console.log('[withNukePermissions] Remaining permissions:', remainingPerms.length);
          remainingPerms.forEach(p => console.log('  ', p.trim()));
          
          console.log('[withNukePermissions] Remaining features:', remainingFeatures.length);
          remainingFeatures.forEach(f => console.log('  ', f.trim()));
        } else {
          console.log('[withNukePermissions] No unwanted permissions found');
        }
      }

      return config;
    },
  ]);
};
