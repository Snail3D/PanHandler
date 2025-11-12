const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveActivityRecognition(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Remove ACTIVITY_RECOGNITION from uses-permission
    if (androidManifest.manifest?.['uses-permission']) {
      const originalLength = androidManifest.manifest['uses-permission'].length;
      
      androidManifest.manifest['uses-permission'] = androidManifest.manifest['uses-permission'].filter((perm) => {
        const name = perm.$?.['android:name'];
        return name !== 'android.permission.ACTIVITY_RECOGNITION';
      });
      
      console.log(`Removed ${originalLength - androidManifest.manifest['uses-permission'].length} ACTIVITY_RECOGNITION permissions`);
    }

    return config;
  });
};
