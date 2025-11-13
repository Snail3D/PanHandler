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

// BLOCK ARCore from being pulled in as transitive dependency
configurations.all {
    exclude group: 'com.google.ar', module: 'core'
    exclude group: 'com.google.ar.sceneform', module: 'core'
    exclude group: 'com.google.ar.sceneform.ux', module: 'sceneform-ux'
}

// Forcefully remove permissions at build time - Works for both APK and AAB builds
afterEvaluate {
    // Hook into MULTIPLE tasks to catch all manifest generation
    def cleanupTasks = ['processReleaseManifest', 'processReleaseBundleManifest', 'packageReleaseBundle']
    
    cleanupTasks.each { theTaskName ->
        try {
            tasks.named(theTaskName).configure {
                doLast {
                    println "[PanHandler] ========================================="
                    println "[PanHandler] Running AGGRESSIVE manifest cleanup after: " + theTaskName
                    println "[PanHandler] ========================================="
                    
                    // NUCLEAR OPTION: Find ALL AndroidManifest.xml files and clean them
                    def cleanedCount = 0
                    def searchRoot = new File(buildDir, 'intermediates')
                    
                    if (searchRoot.exists()) {
                        searchRoot.eachFileRecurse { file ->
                            if (file.name == 'AndroidManifest.xml' && file.path.contains('release')) {
                                println "[PanHandler] Found manifest: " + file.path
                                cleanedCount++
                                def manifestContent = file.getText('UTF-8')
                            
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
                
                            // Remove CHECK_LICENSE permission (multiple variations)
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.android\\\\.vending\\\\.CHECK_LICENSE[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*CHECK_LICENSE[^>]*/>', '')
                            
                            // Remove BIND_GET_INSTALL_REFERRER_SERVICE permission
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.google\\\\.android\\\\.finsky[^>]*/>', '')
                            
                            // Remove faketouch feature (ALL variations - with and without required attribute)
                            manifestContent = manifestContent.replaceAll('<uses-feature[^>]*faketouch[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-feature[^>]*android:name="android\\\\.hardware\\\\.faketouch"[^>]*>', '')
                            
                            // Remove ALL ARCore references
                            manifestContent = manifestContent.replaceAll('<meta-data[^>]*com\\\\.google\\\\.ar\\\\.core[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-feature[^>]*camera\\\\.ar[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-library[^>]*com\\\\.google\\\\.ar[^>]*/>', '')
                            
                                // Remove any tools:node="remove" attributes that didn't work (clean them out)
                                manifestContent = manifestContent.replaceAll('\\s*tools:node="remove"', '')
                                manifestContent = manifestContent.replaceAll('\\s*tools:node=\\'remove\\'', '')
                                
                                // Count what we removed
                                def removedItems = []
                                if (manifestContent =~ /ACTIVITY_RECOGNITION/) removedItems.add('ACTIVITY_RECOGNITION')
                                if (manifestContent =~ /CHECK_LICENSE/) removedItems.add('CHECK_LICENSE')
                                if (manifestContent =~ /faketouch/) removedItems.add('faketouch')
                                
                                file.write(manifestContent, 'UTF-8')
                                println "[PanHandler] ✅ Cleaned manifest #" + cleanedCount + ": " + file.path
                                if (removedItems.size() > 0) {
                                    println "[PanHandler]   Removed: " + removedItems.join(', ')
                                }
                            }
                        }
                    }
                    
                    println "[PanHandler] ========================================="
                    println "[PanHandler] ✅ CLEANED " + cleanedCount + " MANIFEST FILE(S)"
                    println "[PanHandler] ========================================="
                }
            }
        } catch (Exception e) {
            println "[PanHandler] Task " + theTaskName + " not found, skipping"
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
