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
    // Hook into the EXACT task that creates the final AAB manifest
    def cleanupTasks = [
        'processApplicationManifestReleaseForBundle',  // Creates bundle manifest - THIS IS THE ONE!
        'processReleaseManifest',
        'processReleaseMainManifest',
        'packageReleaseBundle'
    ]
    
    cleanupTasks.each { theTaskName ->
        try {
            tasks.named(theTaskName).configure {
                doLast { // Changed from doFirst - runs AFTER task completes
                    println "[PanHandler] ========================================="
                    println "[PanHandler] Running AGGRESSIVE manifest cleanup after: " + theTaskName
                    println "[PanHandler] ========================================="
                    
                    // NUCLEAR OPTION: Find ALL AndroidManifest.xml files and clean them
                    def cleanedCount = 0
                    def searchRoot = new File(buildDir, 'intermediates')
                    
                    if (searchRoot.exists()) {
                        searchRoot.eachFileRecurse { file ->
                            if (file.name == 'AndroidManifest.xml' && (file.path.contains('release') || file.path.contains('merged') || file.path.contains('bundle'))) {
                                println "[PanHandler] Found manifest: " + file.path
                                cleanedCount++
                                def manifestContent = file.getText('UTF-8')
                                
                                // DEBUG: Show what's in the manifest BEFORE cleaning
                                def foundIssues = []
                                if (manifestContent =~ /CHECK_LICENSE/) foundIssues.add('CHECK_LICENSE')
                                if (manifestContent =~ /faketouch/) foundIssues.add('faketouch')
                                if (manifestContent =~ /camera\.ar/) foundIssues.add('camera.ar')
                                
                                if (foundIssues.size() > 0) {
                                    println "[PanHandler] BEFORE cleanup - Found: " + foundIssues.join(', ')
                                } else {
                                    println "[PanHandler] BEFORE cleanup - Clean!"
                                }
                            
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
                
                            // Remove CHECK_LICENSE permission (MULTIPLE variations - MOST AGGRESSIVE)
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*CHECK_LICENSE[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.android\\\\.vending\\\\.CHECK_LICENSE[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.android\\\\.vending[^>]*/>', '')
                            
                            // Remove BIND_GET_INSTALL_REFERRER_SERVICE permission
                            manifestContent = manifestContent.replaceAll('<uses-permission[^>]*com\\\\.google\\\\.android\\\\.finsky[^>]*/>', '')
                            
                            // Remove faketouch feature (ALL VARIATIONS - MOST AGGRESSIVE)
                            manifestContent = manifestContent.replaceAll('<uses-feature[^>]*faketouch[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-feature[^>]*android\\\\.hardware\\\\.faketouch[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('\\s*<uses-feature\\s+android:name="android\\\\.hardware\\\\.faketouch"[^>]*/?>', '')
                            
                            // Remove only ARCore metadata and libraries, but KEEP camera.ar feature with required="false"
                            manifestContent = manifestContent.replaceAll('<meta-data[^>]*com\\\\.google\\\\.ar\\\\.core[^>]*/>', '')
                            manifestContent = manifestContent.replaceAll('<uses-library[^>]*com\\\\.google\\\\.ar[^>]*/>', '')
                            // IMPORTANT: DO NOT remove camera.ar feature - we need it with required="false"
                            
                                // Remove any tools:node="remove" attributes that didn't work (clean them out)
                                manifestContent = manifestContent.replaceAll('\\s*tools:node="remove"', '')
                                manifestContent = manifestContent.replaceAll('\\s*tools:node=\\'remove\\'', '')
                                
                                // DEBUG: Show what's in the manifest AFTER cleaning
                                def stillPresent = []
                                if (manifestContent =~ /CHECK_LICENSE/) stillPresent.add('CHECK_LICENSE')
                                if (manifestContent =~ /faketouch/) stillPresent.add('faketouch')
                                if (manifestContent =~ /camera\.ar/) stillPresent.add('camera.ar')
                                
                                if (stillPresent.size() > 0) {
                                    println "[PanHandler] AFTER cleanup - Still present: " + stillPresent.join(', ')
                                } else {
                                    println "[PanHandler] AFTER cleanup - All clean!"
                                }
                                
                                // ADD camera.ar required="false" if it's not there
                                if (!(manifestContent =~ /camera\.ar/)) {
                                    println "[PanHandler] ✅ Adding camera.ar required=false"
                                    def cameraFeaturePos = manifestContent.indexOf('<uses-feature android:name="android.hardware.camera"')
                                    if (cameraFeaturePos > 0) {
                                        def insertPos = manifestContent.indexOf('/>', cameraFeaturePos) + 2
                                        manifestContent = manifestContent.substring(0, insertPos) + 
                                            '\\n  <uses-feature android:name="android.hardware.camera.ar" android:required="false"/>' +
                                            manifestContent.substring(insertPos)
                                        println "[PanHandler] ✅ Successfully added camera.ar required=false"
                                    }
                                }
                                
                                file.write(manifestContent, 'UTF-8')
                                println "[PanHandler] ✅ Cleaned manifest #" + cleanedCount + ": " + file.path
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
