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

// Forcefully remove permissions at build time - Updated for newer Android Gradle Plugin
tasks.whenTaskAdded { task ->
    if (task.name == 'processReleaseManifest' || task.name == 'processDebugManifest') {
        task.doLast {
            def manifestFile = new File(buildDir, 'intermediates/merged_manifests/release/AndroidManifest.xml')
            if (!manifestFile.exists()) {
                manifestFile = new File(buildDir, 'intermediates/merged_manifests/debug/AndroidManifest.xml')
            }
            if (!manifestFile.exists()) {
                // Try another common location
                manifestFile = new File(buildDir, 'intermediates/manifests/full/release/AndroidManifest.xml')
            }
            
            if (manifestFile.exists()) {
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
                
                manifestFile.write(manifestContent, 'UTF-8')
                println "[PanHandler] Forcefully removed unwanted permissions from manifest at: " + manifestFile.path
            } else {
                println "[PanHandler] Warning: Could not find manifest file to clean"
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
