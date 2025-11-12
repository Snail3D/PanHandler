const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * ABSOLUTE FINAL NUCLEAR OPTION
 * This runs AFTER EVERYTHING - even after react-native-vision-camera
 * Forcefully removes ALL unwanted permissions and adds ARCore optional
 */
module.exports = function withFinalNuke(config) {
  // Run this absolutely last - after everything else
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const manifestPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/AndroidManifest.xml'
      );

      if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, 'utf-8');
        
        console.log('[withFinalNuke] === FINAL NUCLEAR CLEANUP ===');
        console.log('[withFinalNuke] Permissions before cleanup:');
        const beforePerms = manifestContent.match(/<uses-permission[^>]*>/gi) || [];
        beforePerms.forEach(p => console.log('[withFinalNuke]   ', p.trim()));
        
        // NUKE ALL UNWANTED PERMISSIONS
        const toRemove = [
          'RECORD_AUDIO',
          'MODIFY_AUDIO_SETTINGS',
          'USE_BIOMETRIC',
          'USE_FINGERPRINT',
          'ACTIVITY_RECOGNITION',
          'SYSTEM_ALERT_WINDOW',
          'ACCESS_NETWORK_STATE',
          'ACCESS_COARSE_LOCATION',
          'ACCESS_FINE_LOCATION',
          'ACCESS_MEDIA_LOCATION',
          'READ_MEDIA_AUDIO',
          'READ_MEDIA_VIDEO',
          'READ_MEDIA_VISUAL_USER_SELECTED',
          'CHECK_LICENSE',
        ];
        
        toRemove.forEach(perm => {
          const regex = new RegExp(`<uses-permission[^>]*android:name="[^"]*${perm}[^"]*"[^>]*/?>`, 'gi');
          manifestContent = manifestContent.replace(regex, '');
        });
        
        // NUKE microphone feature
        manifestContent = manifestContent.replace(
          /<uses-feature[^>]*android:name="android\.hardware\.microphone"[^>]*\/>/gi,
          ''
        );
        
        // Ensure ARCore is optional
        if (!manifestContent.includes('com.google.ar.core')) {
          manifestContent = manifestContent.replace(
            '</application>',
            '    <meta-data android:name="com.google.ar.core" android:value="optional" />\n' +
            '    <meta-data android:name="com.google.ar.core.min_apk_version" android:value="241010000" />\n' +
            '    </application>'
          );
        }
        
        // Clean up empty lines
        manifestContent = manifestContent.replace(/^\s*[\r\n]/gm, '');
        
        fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
        
        console.log('[withFinalNuke] Permissions after cleanup:');
        const afterPerms = manifestContent.match(/<uses-permission[^>]*>/gi) || [];
        afterPerms.forEach(p => console.log('[withFinalNuke]   ', p.trim()));
        console.log('[withFinalNuke] === CLEANUP COMPLETE ===');
      }

      return config;
    },
  ]);
};
