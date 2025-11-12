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
    
    // IMPORTANT: Explicitly add ARCore as "optional" 
    // This tells Google Play that AR is NOT required
    application['meta-data'].push({
      $: {
        'android:name': 'com.google.ar.core',
        'android:value': 'optional'
      }
    });
    
    console.log('[withDisableARCore] Added com.google.ar.core=optional metadata');

    return config;
  });
};