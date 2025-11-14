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

    // REMOVE any existing unwanted features and enforce strict allowlist
    // CRITICAL: Remove faketouch and all unwanted features completely
    // DO NOT remove camera.ar - we need it but libraries will add it
    manifest['uses-feature'] = (manifest['uses-feature'] || []).filter(feat => {
      const name = feat.$?.['android:name'];
      if (!name) return false;
      // Block faketouch COMPLETELY
      if (name === 'android.hardware.faketouch') {
        return false;
      }
      // Keep camera.ar if it exists (we'll ensure required=false below)
      if (name === 'android.hardware.camera.ar') {
        return true;
      }
      return allowedFeatures.includes(name);
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

    // CRITICAL: Block ARCore AND MLKit completely - remove ALL metadata
    manifest.application[0]['meta-data'] = (manifest.application[0]['meta-data'] || []).filter(meta => {
      const name = meta.$?.['android:name'];
      if (!name) return true;
      // Remove ARCore metadata
      if (name.includes('com.google.ar')) return false;
      // Remove MLKit metadata that triggers AR checks
      if (name.includes('com.google.mlkit')) return false;
      if (name.includes('com.google.android.gms')) return false;
      return true;
    });
    
    // Ensure camera.ar has required="false" if it exists
    const cameraArFeature = manifest['uses-feature'].find(feat => 
      feat.$?.['android:name'] === 'android.hardware.camera.ar'
    );
    if (cameraArFeature && cameraArFeature.$) {
      cameraArFeature.$['android:required'] = 'false';
      console.log('[withManifestRemoveDirectives] Set camera.ar required=false');
    }

    console.log('[withManifestRemoveDirectives] Enforced allowed permissions/features and removed all ARCore metadata');

    return config;
  });
};

