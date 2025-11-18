# Keep VRUtilities classes used by expo-camera
-keep class expo.modules.core.utilities.VRUtilities { *; }
-keep class expo.modules.core.utilities.VRUtilities$Companion { *; }
-keepclassmembers class expo.modules.core.utilities.VRUtilities { *; }
-keepclassmembers class expo.modules.core.utilities.VRUtilities$Companion { *; }

# Keep all expo.modules.core utilities
-keep class expo.modules.core.utilities.** { *; }
-keepclassmembers class expo.modules.core.utilities.** { *; }

# Keep expo-camera classes and all their members
-keep class expo.modules.camera.** { *; }
-keepclassmembers class expo.modules.camera.** { *; }

# Keep all classes in expo.modules.core that might be referenced
-keep class expo.modules.core.** { *; }
-keepclassmembers class expo.modules.core.** { *; }

