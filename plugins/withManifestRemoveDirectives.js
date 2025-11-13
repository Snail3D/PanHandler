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

    // Add tools:node="remove" for all unwanted permissions
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

    unwantedPermissions.forEach(permission => {
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
    ];

    unwantedFeatures.forEach(feature => {
      manifest['uses-feature'].push({
        $: {
          'android:name': feature,
          'tools:node': 'remove',
        },
      });
    });

    console.log('[withManifestRemoveDirectives] Added tools:node="remove" for', unwantedPermissions.length, 'permissions and', unwantedFeatures.length, 'features');

    return config;
  });
};

