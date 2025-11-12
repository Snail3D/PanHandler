const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Plugin to explicitly exclude TV, Chromebook, and Wearable devices
 * App should only be available on phones and tablets
 */
module.exports = function withExcludeFormFactors(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    if (!androidManifest.manifest) {
      return config;
    }

    const manifest = androidManifest.manifest;

    // Ensure uses-feature array exists
    if (!manifest['uses-feature']) {
      manifest['uses-feature'] = [];
    }

    // Add features to exclude TV, Chromebook, and Wearable
    const excludeFeatures = [
      {
        $: {
          'android:name': 'android.software.leanback',
          'android:required': 'false'
        }
      },
      {
        $: {
          'android:name': 'android.hardware.touchscreen',
          'android:required': 'true'
        }
      }
    ];

    // Remove any existing entries for these features
    manifest['uses-feature'] = manifest['uses-feature'].filter((feature) => {
      const name = feature.$?.['android:name'];
      return name !== 'android.software.leanback' && 
             name !== 'android.hardware.touchscreen';
    });

    // Add exclusion features
    manifest['uses-feature'].push(...excludeFeatures);

    console.log('[withExcludeFormFactors] Excluded TV, Chromebook, and Wearable devices');

    return config;
  });
};
