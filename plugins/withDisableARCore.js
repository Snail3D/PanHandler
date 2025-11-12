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
        (meta) => meta.$['android:name'] !== 'com.google.ar.core' && 
                  meta.$['android:name'] !== 'com.google.ar.core.min_apk_version'
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

    // Add minimum ARCore version
    application['meta-data'].push({
      $: {
        'android:name': 'com.google.ar.core.min_apk_version',
        'android:value': '1',
      },
    });

    return config;
  });
};

