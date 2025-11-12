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

// Forcefully remove permissions at build time
afterEvaluate {
    android.applicationVariants.all { variant ->
        variant.outputs.each { output ->
            output.processManifest.doLast {
                def manifestOutFile = output.processManifest.manifestOutputDirectory.file("AndroidManifest.xml").get().asFile
                if (manifestOutFile.exists()) {
                    def manifestContent = manifestOutFile.getText('UTF-8')
                    
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
                    
                    manifestOutFile.write(manifestContent, 'UTF-8')
                    println "[PanHandler] Forcefully removed audio/biometric permissions from manifest"
                }
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
