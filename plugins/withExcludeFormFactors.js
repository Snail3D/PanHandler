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

    // Remove TV and microphone features entirely
    manifest['uses-feature'] = manifest['uses-feature'].filter((feature) => {
      const name = feature.$?.['android:name'];
      // Remove leanback (TV) and microphone completely
      const shouldRemove = name === 'android.software.leanback' || 
                          name === 'android.hardware.microphone';
      if (shouldRemove) {
        console.log(`[withExcludeFormFactors] Removing feature: ${name}`);
      }
      return !shouldRemove;
    });

    // Only require touchscreen (excludes TVs)
    const touchscreenFeature = manifest['uses-feature'].find(f => 
      f.$?.['android:name'] === 'android.hardware.touchscreen'
    );
    
    if (!touchscreenFeature) {
      manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.touchscreen',
          'android:required': 'true'
        }
      });
    } else {
      // Make sure touchscreen is required
      touchscreenFeature.$['android:required'] = 'true';
    }

    console.log('[withExcludeFormFactors] Excluded TV, Chromebook, and Wearable devices');

    return config;
  });
};
