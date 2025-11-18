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
        // Ensure directory exists
        const rulesDir = path.dirname(proguardRulesPath);
        if (!fs.existsSync(rulesDir)) {
          fs.mkdirSync(rulesDir, { recursive: true });
        }
        fs.copyFileSync(sourceRulesPath, proguardRulesPath);
        console.log('[withProguardRules] Copied ProGuard rules to:', proguardRulesPath);
      } else {
        console.warn('[withProguardRules] Source ProGuard rules file not found:', sourceRulesPath);
      }
      
      return config;
    },
  ]);

  // Add proguardFiles to build.gradle and embed rules inline as fallback
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;
    
    // Check if proguardFiles is already configured (multiple possible formats)
    if (buildGradle.includes("proguard-rules.pro") || buildGradle.includes("proguardFiles")) {
      console.log('[withProguardRules] ProGuard rules already configured in build.gradle');
      return config;
    }
    
    console.log('[withProguardRules] Adding ProGuard rules to build.gradle');
    
    // Read ProGuard rules content to embed inline
    const sourceRulesPath = path.join(config.modRequest.projectRoot, 'proguard-rules.pro');
    let proguardRulesContent = '';
    if (fs.existsSync(sourceRulesPath)) {
      proguardRulesContent = fs.readFileSync(sourceRulesPath, 'utf-8');
    }
    
    // Find the release buildType block - try multiple patterns
    // Pattern 1: release { ... minifyEnabled true ... }
    let releaseBuildTypeRegex = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)(minifyEnabled\s+true)/;
    
    if (releaseBuildTypeRegex.test(buildGradle)) {
      // Add proguardFiles and embed rules inline
      const replacement = proguardRulesContent 
        ? `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            // Embedded ProGuard rules for expo-camera VRUtilities
            proguardFile('proguard-rules.pro')
            $2`
        : `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            $2`;
      
      config.modResults.contents = buildGradle.replace(releaseBuildTypeRegex, replacement);
    } else {
      // Pattern 2: release { ... } (without minifyEnabled)
      releaseBuildTypeRegex = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)(\})/;
      if (releaseBuildTypeRegex.test(buildGradle)) {
        const replacement = proguardRulesContent
          ? `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            // Embedded ProGuard rules for expo-camera VRUtilities
            proguardFile('proguard-rules.pro')
            $2`
          : `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            $2`;
        
        config.modResults.contents = buildGradle.replace(releaseBuildTypeRegex, replacement);
      } else {
        // Pattern 3: No release block exists, add it before defaultConfig
        const androidBlockRegex = /(android\s*\{[\s\S]*?)(defaultConfig)/;
        if (androidBlockRegex.test(buildGradle)) {
          const replacement = proguardRulesContent
            ? `$1buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            // Embedded ProGuard rules for expo-camera VRUtilities
            proguardFile('proguard-rules.pro')
        }
    }
    $2`
            : `$1buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    $2`;
          
          config.modResults.contents = buildGradle.replace(androidBlockRegex, replacement);
        }
      }
    }
    
    // Also add a Gradle task to ensure ProGuard rules file exists
    if (!buildGradle.includes('// Ensure proguard-rules.pro exists')) {
      const beforeDependencies = buildGradle.match(/(dependencies\s*\{)/);
      if (beforeDependencies) {
        const ensureRulesTask = `
// Ensure proguard-rules.pro exists for R8
afterEvaluate {
    tasks.named('minifyReleaseWithR8').configure {
        doFirst {
            def rulesFile = file('app/proguard-rules.pro')
            if (!rulesFile.exists()) {
                rulesFile.parentFile.mkdirs()
                rulesFile.text = '''${proguardRulesContent.replace(/'/g, "\\'")}'''
                println '[withProguardRules] Created proguard-rules.pro file'
            }
        }
    }
}
`;
        config.modResults.contents = buildGradle.replace(/(dependencies\s*\{)/, `${ensureRulesTask}$1`);
      }
    }
    
    return config;
  });
};

