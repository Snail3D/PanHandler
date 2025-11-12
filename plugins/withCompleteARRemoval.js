const { withAndroidManifest, withGradleProperties } = require('@expo/config-plugins');
const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Complete removal of all ARCore/AR references
 * Removes from manifest, gradle, and build files
 */
module.exports = function withCompleteARRemoval(config) {
  // Remove from AndroidManifest
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    
    if (!androidManifest.manifest) {
      return config;
    }
    
    const manifest = androidManifest.manifest;
    
    // Remove ARCore from uses-feature
    if (manifest['uses-feature']) {
      const originalLength = manifest['uses-feature'].length;
      manifest['uses-feature'] = manifest['uses-feature'].filter((feature) => {
        const name = feature.$?.['android:name'];
        const isARCore = name?.includes('ar.core') || 
                         name?.includes('com.google.ar') ||
                         name?.includes('android.hardware.camera.ar');
        if (isARCore) {
          console.log(`[withCompleteARRemoval] Removing uses-feature: ${name}`);
        }
        return !isARCore;
      });
      console.log(`[withCompleteARRemoval] Removed ${originalLength - manifest['uses-feature'].length} ARCore uses-feature entries`);
    }
    
    // Remove ARCore from application metadata
    if (manifest.application?.[0]) {
      const application = manifest.application[0];
      
      if (application['meta-data']) {
        const originalLength = application['meta-data'].length;
        application['meta-data'] = application['meta-data'].filter((meta) => {
          const name = meta.$?.['android:name'];
          const isARCore = name?.includes('com.google.ar') || 
                           name?.includes('ar.core') ||
                           name?.includes('arcore');
          if (isARCore) {
            console.log(`[withCompleteARRemoval] Removing meta-data: ${name}`);
          }
          return !isARCore;
        });
        console.log(`[withCompleteARRemoval] Removed ${originalLength - application['meta-data'].length} ARCore meta-data entries`);
      }
    }
    
    // Remove ARCore from uses-library if present
    if (manifest.application?.[0]?.['uses-library']) {
      const application = manifest.application[0];
      const originalLength = application['uses-library'].length;
      application['uses-library'] = application['uses-library'].filter((lib) => {
        const name = lib.$?.['android:name'];
        const isARCore = name?.includes('com.google.ar') || name?.includes('arcore');
        if (isARCore) {
          console.log(`[withCompleteARRemoval] Removing uses-library: ${name}`);
        }
        return !isARCore;
      });
      console.log(`[withCompleteARRemoval] Removed ${originalLength - application['uses-library'].length} ARCore uses-library entries`);
    }
    
    return config;
  });
  
  // Remove ARCore from gradle dependencies
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      const originalContents = config.modResults.contents;
      
      // Remove any ARCore dependencies
      config.modResults.contents = config.modResults.contents
        .split('\n')
        .filter(line => {
          const isARCore = line.includes('com.google.ar:core') || 
                           line.includes('com.google.ar.sceneform');
          if (isARCore) {
            console.log(`[withCompleteARRemoval] Removing gradle dependency: ${line.trim()}`);
            return false;
          }
          return true;
        })
        .join('\n');
      
      if (originalContents !== config.modResults.contents) {
        console.log('[withCompleteARRemoval] Modified app/build.gradle to remove ARCore dependencies');
      }
    }
    
    return config;
  });
  
  return config;
};
