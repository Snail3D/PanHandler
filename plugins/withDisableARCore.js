const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

module.exports = function withDisableARCore(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Remove ARCore metadata from application
    if (androidManifest.manifest?.application?.[0]) {
      const application = androidManifest.manifest.application[0];
      
      if (application['meta-data']) {
        const originalLength = application['meta-data'].length;
        
        // Remove all ARCore-related metadata
        application['meta-data'] = application['meta-data'].filter((meta) => {
          const name = meta.$?.['android:name'];
          return name !== 'com.google.ar.core' && 
                 name !== 'com.google.ar.core.min_apk_version';
        });
        
        console.log(`Removed ${originalLength - application['meta-data'].length} ARCore meta-data entries`);
      }
    }

    // Also remove from uses-feature if present
    if (androidManifest.manifest?.['uses-feature']) {
      const originalLength = androidManifest.manifest['uses-feature'].length;
      
      androidManifest.manifest['uses-feature'] = androidManifest.manifest['uses-feature'].filter((feature) => {
        const name = feature.$?.['android:name'];
        return !name?.includes('ar.core');
      });
      
      console.log(`Removed ${originalLength - androidManifest.manifest['uses-feature'].length} ARCore uses-feature entries`);
    }

    return config;
  });
};
