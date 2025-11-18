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
      console.log('[withProguardRules] Read ProGuard rules file:', sourceRulesPath);
      console.log('[withProguardRules] Rules file size:', proguardRulesContent.length, 'bytes');
      console.log('[withProguardRules] Rules file contains VRUtilities:', proguardRulesContent.includes('VRUtilities'));
    } else {
      console.error('[withProguardRules] ERROR: ProGuard rules file not found at:', sourceRulesPath);
    }
    
    // Find the release buildType block - try multiple patterns
    // Pattern 1: release { ... minifyEnabled true ... }
    let releaseBuildTypeRegex = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)(minifyEnabled\s+true)/;
    
    if (releaseBuildTypeRegex.test(buildGradle)) {
      // Add proguardFiles
      config.modResults.contents = buildGradle.replace(
        releaseBuildTypeRegex,
        `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            $2`
      );
    } else {
      // Pattern 2: release { ... } (without minifyEnabled)
      releaseBuildTypeRegex = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)(\})/;
      if (releaseBuildTypeRegex.test(buildGradle)) {
        config.modResults.contents = buildGradle.replace(
          releaseBuildTypeRegex,
          `$1minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            $2`
        );
      } else {
        // Pattern 3: No release block exists, add it before defaultConfig
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
    }
    
    // Also add a Gradle task to ensure ProGuard rules file exists before R8 runs
    if (!buildGradle.includes('// Ensure proguard-rules.pro exists')) {
      // Escape the ProGuard rules content for Groovy triple-quoted string
      // Need to escape backslashes, dollar signs, and triple quotes
      const escapedRules = proguardRulesContent
        .replace(/\\/g, '\\\\')
        .replace(/\$/g, '\\$')
        .replace(/'''/g, "''' + \"'''\" + '''");
      
      const ensureRulesTask = `
// Ensure proguard-rules.pro exists for R8 (added by withProguardRules config plugin)
task ensureProguardRules {
    doLast {
        println '[withProguardRules] ========================================='
        println '[withProguardRules] Ensuring ProGuard rules file exists...'
        
        def rulesFile = file('app/proguard-rules.pro')
        println '[withProguardRules] Rules file path: ' + rulesFile.absolutePath
        println '[withProguardRules] Rules file exists: ' + rulesFile.exists()
        
        if (!rulesFile.exists()) {
            println '[withProguardRules] Creating proguard-rules.pro file...'
            rulesFile.parentFile.mkdirs()
            rulesFile.text = '''${escapedRules}'''
            println '[withProguardRules] ✅ Created proguard-rules.pro file'
            println '[withProguardRules] File size: ' + rulesFile.length() + ' bytes'
        } else {
            println '[withProguardRules] ✅ proguard-rules.pro already exists'
            println '[withProguardRules] File size: ' + rulesFile.length() + ' bytes'
            def content = rulesFile.text
            println '[withProguardRules] File contains VRUtilities: ' + content.contains('VRUtilities')
            println '[withProguardRules] File contains expo.modules.core: ' + content.contains('expo.modules.core')
        }
        
        // Verify the file one more time
        if (rulesFile.exists()) {
            def verifyContent = rulesFile.text
            println '[withProguardRules] Verification - File contains VRUtilities: ' + verifyContent.contains('VRUtilities')
            println '[withProguardRules] Verification - File contains expo.modules.core: ' + verifyContent.contains('expo.modules.core')
            println '[withProguardRules] Verification - File line count: ' + verifyContent.split('\n').length
        } else {
            throw new GradleException('[withProguardRules] ❌ CRITICAL: ProGuard rules file still missing after creation attempt!')
        }
        
        println '[withProguardRules] ========================================='
    }
}

// Make sure ensureProguardRules runs before R8
afterEvaluate {
    tasks.named('minifyReleaseWithR8').configure {
        dependsOn 'ensureProguardRules'
        doFirst {
            println '[withProguardRules] R8 minification starting - ProGuard rules should be ready'
            def verifyFile = file('app/proguard-rules.pro')
            if (!verifyFile.exists()) {
                throw new GradleException('[withProguardRules] ❌ CRITICAL ERROR: ProGuard rules file missing before R8!')
            }
        }
    }
}
`;
      
      // Add before dependencies block or at end of android block
      const dependenciesMatch = buildGradle.match(/(dependencies\s*\{)/);
      if (dependenciesMatch) {
        config.modResults.contents = buildGradle.replace(/(dependencies\s*\{)/, `${ensureRulesTask}$1`);
      } else {
        // Add at end of android block
        const androidEndMatch = buildGradle.match(/(android\s*\{[\s\S]*?)(\n\s*\})/);
        if (androidEndMatch) {
          config.modResults.contents = buildGradle.replace(/(android\s*\{[\s\S]*?)(\n\s*\})/, `$1${ensureRulesTask}$2`);
        }
      }
    }
    
    return config;
  });
};

