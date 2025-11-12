const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * ABSOLUTE FINAL CLEANUP - Runs after EVERYTHING
 * This is the nuclear option that runs at the very end
 * and forcefully removes all unwanted permissions
 * 
 * IMPORTANT: This runs in the 'android' phase which is AFTER
 * all React Native auto-linking has happened
 */
module.exports = function withAbsoluteFinalCleanup(config) {
  // Run this AFTER everything else by using withDangerousMod
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
        
        console.log('[withAbsoluteFinalCleanup] === ABSOLUTE FINAL CLEANUP ===');
        
        // Log what we found before
        const beforePerms = manifestContent.match(/<uses-permission[^>]*>/gi) || [];
        console.log('[withAbsoluteFinalCleanup] Permissions BEFORE final cleanup:');
        beforePerms.forEach(p => {
          if (p.includes('RECORD_AUDIO') || p.includes('MODIFY_AUDIO')) {
            console.log('[withAbsoluteFinalCleanup]   ❌', p.trim());
          } else {
            console.log('[withAbsoluteFinalCleanup]   ✅', p.trim());
          }
        });
        
        // FORCEFULLY REMOVE ALL UNWANTED PERMISSIONS
        // Use multiple patterns to catch all variations
        const patterns = [
          /<uses-permission[^>]*android:name="android\.permission\.RECORD_AUDIO"[^>]*\/>/gi,
          /<uses-permission[^>]*android:name="android\.permission\.MODIFY_AUDIO_SETTINGS"[^>]*\/>/gi,
          /<uses-permission[^>]*android:name="android\.permission\.SYSTEM_ALERT_WINDOW"[^>]*\/>/gi,
          /<uses-permission[^>]*RECORD_AUDIO[^>]*\/>/gi,
          /<uses-permission[^>]*MODIFY_AUDIO[^>]*\/>/gi,
        ];
        
        patterns.forEach(pattern => {
          const matches = manifestContent.match(pattern);
          if (matches) {
            matches.forEach(match => {
              console.log(`[withAbsoluteFinalCleanup] REMOVING: ${match}`);
              manifestContent = manifestContent.replace(match, '');
            });
          }
        });
        
        // Also remove microphone feature
        manifestContent = manifestContent.replace(
          /<uses-feature[^>]*android:name="android\.hardware\.microphone"[^>]*\/>/gi,
          ''
        );
        
        // Clean up empty lines
        manifestContent = manifestContent.replace(/^\s*[\r\n]/gm, '');
        
        // Write the cleaned manifest
        fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
        
        // Log what's left
        const afterPerms = manifestContent.match(/<uses-permission[^>]*>/gi) || [];
        console.log('[withAbsoluteFinalCleanup] Permissions AFTER final cleanup:');
        afterPerms.forEach(p => console.log('[withAbsoluteFinalCleanup]   ✅', p.trim()));
        
        console.log('[withAbsoluteFinalCleanup] === CLEANUP COMPLETE - NO AUDIO PERMISSIONS ===');
      }

      return config;
    },
  ]);
};
