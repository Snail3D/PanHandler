const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withDisableARCore(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Ensure manifest structure exists
    if (!androidManifest.manifest) {
      return config;
    }
    
    const manifest = androidManifest.manifest;
    
    // Remove ARCore from uses-feature if present
    if (manifest['uses-feature']) {
      const originalFeatureLength = manifest['uses-feature'].length;
      
      manifest['uses-feature'] = manifest['uses-feature'].filter((feature) => {
        const name = feature.$?.['android:name'];
        return !name?.includes('ar.core') && !name?.includes('com.google.ar');
      });
      
      console.log(`[withDisableARCore] Removed ${originalFeatureLength - manifest['uses-feature'].length} ARCore uses-feature entries`);
    }

    // Handle application metadata
    if (!manifest.application) {
      manifest.application = [{}];
    }
    
    const application = manifest.application[0];
    
    // Remove existing ARCore metadata
    if (application['meta-data']) {
      const originalMetaLength = application['meta-data'].length;
      
      application['meta-data'] = application['meta-data'].filter((meta) => {
        const name = meta.$?.['android:name'];
        // Remove ALL Google AR related metadata
        return !name?.includes('com.google.ar');
      });
      
      console.log(`[withDisableARCore] Removed ${originalMetaLength - application['meta-data'].length} ARCore meta-data entries`);
    } else {
      application['meta-data'] = [];
    }
    
    // DO NOT add any ARCore metadata - the app doesn't use AR at all
    // Adding com.google.ar.core=optional requires also adding min_apk_version
    // Simpler to just remove all ARCore references completely
    
    console.log('[withDisableARCore] Removed all ARCore metadata - app does not use AR');

    return config;
  });
};