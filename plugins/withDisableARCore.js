const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withDisableARCore(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest.application) {
      return config;
    }

    const application = manifest.application[0];
    
    // Remove any existing ARCore metadata
    if (application['meta-data']) {
      application['meta-data'] = application['meta-data'].filter(
        (meta) => meta.$['android:name'] !== 'com.google.ar.core'
      );
    } else {
      application['meta-data'] = [];
    }

    // Add ARCore as optional
    application['meta-data'].push({
      $: {
        'android:name': 'com.google.ar.core',
        'android:value': 'optional',
      },
    });

    return config;
  });
};

