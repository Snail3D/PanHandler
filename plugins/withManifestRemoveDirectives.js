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

    const allowedPermissions = [
      'android.permission.CAMERA',
      'android.permission.INTERNET',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.VIBRATE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ];

    const allowedFeatures = [
      'android.hardware.camera',
    ];

    const currentPermissions = (manifest['uses-permission'] || []).map(perm => perm.$?.['android:name'] || JSON.stringify(perm));
    console.log('[withManifestRemoveDirectives] Permissions BEFORE allowlist:', currentPermissions);

    // CRITICAL: REMOVE any unwanted permissions and enforce allowlist
    manifest['uses-permission'] = (manifest['uses-permission'] || []).filter(perm => {
      const name = perm.$?.['android:name'];
      if (!name) return false;
      return allowedPermissions.includes(name);
    });

    const afterFilterPermissions = manifest['uses-permission'].map(perm => perm.$?.['android:name'] || JSON.stringify(perm));
    console.log('[withManifestRemoveDirectives] Permissions AFTER filter:', afterFilterPermissions);

    // Ensure every allowed permission is present exactly once
    const existingPermissionSet = new Set(manifest['uses-permission'].map(perm => perm.$?.['android:name']));
    allowedPermissions.forEach(permission => {
      if (!existingPermissionSet.has(permission)) {
        manifest['uses-permission'].push({
          $: {
            'android:name': permission,
          },
        });
      }
    });

    // REMOVE any existing unwanted features and enforce allowlist (camera handled separately below)
    manifest['uses-feature'] = (manifest['uses-feature'] || []).filter(feat => {
      const name = feat.$?.['android:name'];
      if (!name) return false;
      return allowedFeatures.includes(name) || name === 'android.hardware.camera.ar';
    });

    const existingFeatureSet = new Set(manifest['uses-feature'].map(feat => feat.$?.['android:name']));
    allowedFeatures.forEach(feature => {
      if (!existingFeatureSet.has(feature)) {
        manifest['uses-feature'].push({
          $: {
            'android:name': feature,
          },
        });
      }
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

    // CRITICAL: Block ARCore completely
    // Remove ALL existing ARCore metadata and features
    manifest.application[0]['meta-data'] = (manifest.application[0]['meta-data'] || []).filter(meta => {
      const name = meta.$?.['android:name'];
      return !name || !name.includes('com.google.ar');
    });
    
    // Remove any existing camera.ar features first
    manifest['uses-feature'] = (manifest['uses-feature'] || []).filter(feat => {
      return feat.$?.['android:name'] !== 'android.hardware.camera.ar';
    });
    
    // Add explicit "ARCore NOT required" feature declaration
    // This tells Google Play the app works WITHOUT AR
    manifest['uses-feature'].push({
      $: {
        'android:name': 'android.hardware.camera.ar',
        'android:required': 'false',
      },
    });

    console.log('[withManifestRemoveDirectives] Enforced allowed permissions/features and removed all ARCore metadata');

    return config;
  });
};

