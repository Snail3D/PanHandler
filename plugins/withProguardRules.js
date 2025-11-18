const { withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withProguardRules(config) {
  // Copy proguard-rules.pro to android/app directory
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const proguardRulesPath = path.join(config.modRequest.platformProjectRoot, 'app', 'proguard-rules.pro');
      const sourceRulesPath = path.join(config.modRequest.projectRoot, 'proguard-rules.pro');
      
      if (fs.existsSync(sourceRulesPath)) {
        fs.copyFileSync(sourceRulesPath, proguardRulesPath);
      }
      
      return config;
    },
  ]);

  // Add proguardFiles to build.gradle
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;
    
    // Check if proguardFiles is already configured
    if (buildGradle.includes("proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'")) {
      return config;
    }
    
    // Find the release buildType block and add proguardFiles
    const releaseBuildTypeRegex = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)(minifyEnabled\s+true)/;
    
    if (releaseBuildTypeRegex.test(buildGradle)) {
      config.modResults.contents = buildGradle.replace(
        releaseBuildTypeRegex,
        `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            $2`
      );
    } else {
      // If release block doesn't exist, add it
      const androidBlockRegex = /(android\s*\{[\s\S]*?)(defaultConfig)/;
      if (androidBlockRegex.test(buildGradle)) {
        config.modResults.contents = buildGradle.replace(
          androidBlockRegex,
          `$1buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    $2`
        );
      }
    }
    
    return config;
  });
};

