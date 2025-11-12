module.exports = {
  dependencies: {
    'react-native-vision-camera': {
      platforms: {
        android: {
          // Override the AndroidManifest.xml merging for vision-camera
          manifestPath: null,
          // Disable auto-linking of permissions
          packageImportPath: 'import com.mrousavy.camera.CameraPackage;',
        },
      },
    },
  },
};
