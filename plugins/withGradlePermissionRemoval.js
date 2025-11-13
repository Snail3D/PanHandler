const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withGradlePermissionRemoval(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      // Add gradle code to forcefully remove permissions at build time
      const removePermissionsCode = `
android {
    packagingOptions {
        // Remove unwanted permissions that get added by dependencies
        exclude 'META-INF/DEPENDENCIES'
    }
}

// Forcefully remove permissions at build time - Multiple fallback paths
afterEvaluate {
    tasks.named('processReleaseManifest').configure {
        doLast {
            // Try ALL possible manifest locations
            def manifestLocations = [
                new File(buildDir, 'intermediates/merged_manifests/release/AndroidManifest.xml'),
                new File(buildDir, 'intermediates/merged_manifests/release/merge/AndroidManifest.xml'),
                new File(buildDir, 'intermediates/packaged_manifests/release/AndroidManifest.xml'),
                new File(buildDir, 'intermediates/bundle_manifest/release/AndroidManifest.xml'),
                new File(projectDir, 'build/intermediates/merged_manifests/release/AndroidManifest.xml'),
                new File(projectDir, 'build/intermediates/merged_manifests/release/merge/AndroidManifest.xml')
            ]
            
            def manifestFile = manifestLocations.find { it.exists() }
            
            if (manifestFile?.exists()) {
                def manifestContent = manifestFile.getText('UTF-8')
                
                // Remove RECORD_AUDIO permission
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.RECORD_AUDIO"[^>]*/>', '')
                
                // Remove MODIFY_AUDIO_SETTINGS permission
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.MODIFY_AUDIO_SETTINGS"[^>]*/>', '')
                
                // Remove ACTIVITY_RECOGNITION permission
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.ACTIVITY_RECOGNITION"[^>]*/>', '')
                
                // Remove biometric permissions
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.USE_BIOMETRIC"[^>]*/>', '')
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.USE_FINGERPRINT"[^>]*/>', '')
                
                // Remove microphone feature
                manifestContent = manifestContent.replaceAll('<uses-feature[^>]*android:name="android\\\\.hardware\\\\.microphone"[^>]*/>', '')
                
                // Remove ACCESS_NETWORK_STATE permission
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.ACCESS_NETWORK_STATE"[^>]*/>', '')
                
                // Remove all media permissions
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.READ_MEDIA_AUDIO"[^>]*/>', '')
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.READ_MEDIA_VIDEO"[^>]*/>', '')
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*android:name="android\\\\.permission\\\\.READ_MEDIA_VISUAL_USER_SELECTED"[^>]*/>', '')
                
                // Remove CHECK_LICENSE permission
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.android\\\\.vending\\\\.CHECK_LICENSE"[^>]*/>', '')
                
                // Remove BIND_GET_INSTALL_REFERRER_SERVICE permission
                manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.google\\\\.android\\\\.finsky\\\\.permission\\\\.BIND_GET_INSTALL_REFERRER_SERVICE"[^>]*/>', '')
                
                // Remove faketouch feature (more variations)
                manifestContent = manifestContent.replaceAll('<uses-feature[^>]*android:name="android\\\\.hardware\\\\.faketouch"[^>]*/>', '')
                manifestContent = manifestContent.replaceAll('<uses-feature[^>]*faketouch[^>]*/>', '')
                
                manifestFile.write(manifestContent, 'UTF-8')
                println "[PanHandler] ✅ FORCEFULLY REMOVED unwanted permissions from: " + manifestFile.path
            } else {
                println "[PanHandler] ❌ ERROR: Could not find manifest file in any location!"
                manifestLocations.each { println "  Tried: " + it.path }
            }
        }
    }
}`;

      // Add the code at the end of the file
      if (!config.modResults.contents.includes('Forcefully remove permissions at build time')) {
        config.modResults.contents += removePermissionsCode;
      }
    }
    
    return config;
  });
};
