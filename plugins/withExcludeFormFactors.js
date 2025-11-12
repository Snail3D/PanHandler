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

    // Remove unwanted features entirely
    manifest['uses-feature'] = manifest['uses-feature'].filter((feature) => {
      const name = feature.$?.['android:name'];
      // Remove leanback (TV), microphone, location, and faketouch
      const shouldRemove = name === 'android.software.leanback' || 
                          name === 'android.hardware.microphone' ||
                          name === 'android.hardware.location' ||
                          name === 'android.hardware.location.gps' ||
                          name === 'android.hardware.location.network' ||
                          name === 'android.hardware.faketouch';
      if (shouldRemove) {
        console.log(`[withExcludeFormFactors] Removing feature: ${name}`);
      }
      return !shouldRemove;
    });

    console.log('[withExcludeFormFactors] Excluded TV, Chromebook, and Wearable devices');

    return config;
  });
};
