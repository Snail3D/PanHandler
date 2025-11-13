const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Add tools:node="remove" directives to FORCE removal of unwanted permissions
 * This is the Android-official way to prevent dependencies from adding permissions
 */
module.exports = function withManifestRemoveDirectives(config) {
  return withAndroidManifest(config, async (config) => {
    const { manifest } = config.modResults;

    // Ensure xmlns:tools is present
    if (!manifest.$) {
      manifest.$ = {};
    }
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Initialize uses-permission array if it doesn't exist
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }
    if (!manifest['uses-feature']) {
      manifest['uses-feature'] = [];
    }

    const unwantedPermissions = [
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.ACTIVITY_RECOGNITION',
      'android.permission.USE_BIOMETRIC',
      'android.permission.USE_FINGERPRINT',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
      'com.android.vending.CHECK_LICENSE',
      'com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE',
    ];

    // CRITICAL: First REMOVE any existing instances (added by native modules)
    // Then add the tools:node="remove" version
    unwantedPermissions.forEach(permission => {
      // Remove existing permission declarations (without tools:node)
      manifest['uses-permission'] = (manifest['uses-permission'] || []).filter(perm => {
        return perm.$?.['android:name'] !== permission || perm.$?.['tools:node'] === 'remove';
      });
      
      // Now add the tools:node="remove" directive
      manifest['uses-permission'].push({
        $: {
          'android:name': permission,
          'tools:node': 'remove',
        },
      });
    });

    // Add tools:node="remove" for unwanted features
    const unwantedFeatures = [
      'android.hardware.microphone',
      'android.hardware.faketouch',
      'android.hardware.camera.ar', // ARCore camera feature
    ];

    // CRITICAL: First REMOVE any existing feature declarations
    unwantedFeatures.forEach(feature => {
      // Remove existing feature declarations (without tools:node)
      manifest['uses-feature'] = (manifest['uses-feature'] || []).filter(feat => {
        return feat.$?.['android:name'] !== feature || feat.$?.['tools:node'] === 'remove';
      });
      
      // Now add the tools:node="remove" directive
      manifest['uses-feature'].push({
        $: {
          'android:name': feature,
          'tools:node': 'remove',
        },
      });
    });

    // Block ARCore metadata from being added
    if (!manifest.application) {
      manifest.application = [{}];
    }
    if (!manifest.application[0]) {
      manifest.application[0] = {};
    }
    if (!manifest.application[0]['meta-data']) {
      manifest.application[0]['meta-data'] = [];
    }

    // Add tools:node="remove" for ARCore metadata
    manifest.application[0]['meta-data'].push({
      $: {
        'android:name': 'com.google.ar.core',
        'tools:node': 'remove',
      },
    });

    console.log('[withManifestRemoveDirectives] Added tools:node="remove" for', unwantedPermissions.length, 'permissions,', unwantedFeatures.length, 'features, and ARCore metadata');

    return config;
  });
};

