const { withXcodeProject, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withWatchConnectivity = (config) => {
  return withXcodeProject(config, async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const iosDir = path.join(projectRoot, 'ios');
    
    // We need to find the project name to know where to put files
    // Usually it's the name of the .xcodeproj file without extension
    const projectFiles = fs.readdirSync(iosDir);
    const xcodeproj = projectFiles.find(file => file.endsWith('.xcodeproj'));
    const projectName = xcodeproj ? xcodeproj.replace('.xcodeproj', '') : 'PanHandler';
    
    const sourceDir = path.join(iosDir, projectName);
    
    // Ensure source directory exists (it should)
    if (!fs.existsSync(sourceDir)) {
      // If we can't find it, we might be in a weird state, but let's try to proceed or fail gracefully
      console.warn(`[WatchConnectivity] Could not find source dir: ${sourceDir}`);
      return config;
    }

    // Define source files
    const sourceFiles = [
      {
        name: 'WatchConnectivityModule.swift',
        content: fs.readFileSync(path.join(__dirname, 'watch-connectivity/apple/WatchConnectivityModule.swift'), 'utf8')
      },
      {
        name: 'WatchConnectivityModule.m',
        content: fs.readFileSync(path.join(__dirname, 'watch-connectivity/apple/WatchConnectivityModule.m'), 'utf8')
      }
    ];

    // Copy files to source directory
    sourceFiles.forEach(file => {
      const destPath = path.join(sourceDir, file.name);
      fs.writeFileSync(destPath, file.content);
    });

    // Add files to Xcode project
    const project = config.modResults;
    const groupName = projectName; // Usually the main group has the project name
    
    // Find the main group
    const group = project.findPBXGroupKey({ name: groupName });
    
    if (group) {
      sourceFiles.forEach(file => {
        // Check if file already exists in project to avoid duplicates
        if (!project.hasFile(file.name)) {
          project.addFile(file.name, group, { target: project.getFirstTarget().uuid });
        }
      });
    } else {
      console.warn(`[WatchConnectivity] Could not find PBXGroup with name ${groupName}`);
    }

    return config;
  });
};

module.exports = withWatchConnectivity;



