export interface PDFTranslation {
  title: string;
  subtitle: string;
  androidHeader: string;
  iosHeader: string;
  githubLabel: string;
  appStoreLabel: string;
  
  // Section: Video Courses
  videoCourses: {
    title: string;
    description: string;
    courseIncludes: string;
    items: string[];
    link: string;
  };
  
  // Section: Step 1 - Take Photo
  step1: {
    title: string;
    perpendicular: {
      title: string;
      items: string[];
    };
    levelAlignment: {
      title: string;
      items: string[];
    };
    proTip: string;
    distance: {
      title: string;
      items: string[];
    };
    lighting: {
      title: string;
      items: string[];
    };
  };
  
  // Section: Step 2 - Calibrate
  step2: {
    title: string;
    whyCalibrate: string;
    howTo: {
      title: string;
      steps: string[];
    };
    bestPractices: {
      title: string;
      items: string[];
      coinExamples: string; // Region-specific coins
    };
    accuracyNotes: {
      title: string;
      items: string[];
    };
  };
  
  // Section: Step 3 - Measurements
  step3: {
    title: string;
    modesTitle: string;
    distance: { title: string; description: string; proTip?: string };
    angle: { title: string; description: string };
    circle: { title: string; description: string };
    rectangle: { title: string; description: string };
    freehand: { title: string; description: string };
    controls: {
      title: string;
      items: string[];
    };
  };
  
  // Section: Volume
  volume: {
    title: string;
    description: string;
    howTo: {
      title: string;
      steps: string[];
    };
    example: string;
  };
  
  // Section: Navigation
  navigation: {
    title: string;
    cameraScreen: {
      title: string;
      items: string[];
    };
    measurementScreen: {
      title: string;
      items: string[];
    };
    pinchZoom: {
      title: string;
      description: string;
    };
  };
  
  // Section: Move & Edit
  moveEdit: {
    title: string;
    moving: {
      title: string;
      steps: string[];
    };
    labels: {
      title: string;
      items: string[];
    };
    deleting: {
      title: string;
      items: string[];
    };
  };
  
  // Section: Save & Share
  saveShare: {
    title: string;
    email: {
      title: string;
      description: string;
      items: string[];
    };
    photos: {
      title: string;
      description: string;
      permissions: {
        title: string;
        items: string[];
      };
    };
  };
  
  // Section: Email Workflow
  emailWorkflow: {
    title: string;
    description: string;
    exampleTitle: string;
  };
  
  // Section: Advanced Features
  advanced: {
    title: string;
    calibrationMethods: {
      title: string;
      items: string[];
    };
    switchingCalibration: {
      title: string;
      description: string;
    };
  };
  
  // Section: Map Mode
  mapMode: {
    title: string;
    description: string;
    howTo: {
      title: string;
      steps: string[];
    };
    supportedUnits: {
      title: string;
      description: string;
    };
  };
  
  // Section: Pro Tips
  proTips: {
    title: string;
    items: string[];
  };
  
  // Section: Troubleshooting
  troubleshooting: {
    title: string;
    items: Array<{
      question: string;
      answer: string | string[];
    }>;
  };
  
  // Section: CAD Integration
  cadIntegration: {
    title: string;
    description: string;
    emailContains: {
      title: string;
      items: string[];
    };
    cadWorkflow: {
      title: string;
      items: string[];
    };
  };
  
  // Footer
  footer: {
    appName: string;
    tagline: string;
    generated: string;
    copyright: string;
  };
}

export const translations: Record<string, PDFTranslation> = {
  en: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  zh: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  hi: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  fr: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ar: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  bn: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ru: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  pt: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ur: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  id: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  de: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ja: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  pl: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  el: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  sw: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  mr: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  te: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  tr: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ko: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ta: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  vi: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  ha: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  pa: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  fil: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  am: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  my: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  th: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  he: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
},
  fa: {
    "title": "PanHandler Guide",
    "subtitle": "Complete Reference for Precise Measurements",
    "androidHeader": "Android Phones/Tablets",
    "iosHeader": "iPhones and iPads",
    "githubLabel": "GitHub Latest Release",
    "appStoreLabel": "Apple App Store",
    "videoCourses": {
        "title": "🎬 Video Courses",
        "description": "Watch our complete video tutorial series. Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.",
        "courseIncludes": "✨ Course includes:",
        "items": [
            "Getting started tutorials",
            "Advanced measurement techniques",
            "Real-world workflow examples",
            "Tips & tricks for best results"
        ],
        "link": "YouTube Course Playlist"
    },
    "step1": {
        "title": "📸 Step 1: Take a Perfect Photo",
        "perpendicular": {
            "title": "📐 Hold camera perpendicular (90°)",
            "items": [
                "Flat surfaces: Look straight down",
                "Vertical surfaces: Face directly at walls/objects"
            ]
        },
        "levelAlignment": {
            "title": "🎯 Level Alignment",
            "items": [
                "Watch the crosshairs - align with gray reference lines",
                "Horizontal crosshair: Shows if camera is tilted (pitch)",
                "Vertical crosshair: Shows if camera is rotated (roll)"
            ]
        },
        "proTip": "Horizontal mode (phone looking down) allows Hold to Auto-Capture - the app takes the photo automatically when aligned!",
        "distance": {
            "title": "📏 Distance Matters",
            "items": [
                "Avoid extreme angles or very distant shots"
            ]
        },
        "lighting": {
            "title": "💡 Lighting",
            "items": [
                "Use good lighting - avoid harsh shadows",
                "Tap flash icon to toggle torch if needed"
            ]
        }
    },
    "step2": {
        "title": "🪙 Step 2: Calibrate with Coin",
        "whyCalibrate": "The app needs a reference object of known size to calculate real-world measurements.",
        "howTo": {
            "title": "📐 How to Calibrate:",
            "steps": [
                "Place a coin somewhere in your photo",
                "Select the coin type from the list",
                "Match the outside edge of the coin with the outside edge of the colored circle",
                "Tap Lock in when aligned"
            ]
        },
        "bestPractices": {
            "title": "✨ Best Practices:",
            "items": [
                "Place coin on same plane as objects you want to measure",
                "Use a flat coin (no bent edges)"
            ],
            "coinExamples": "Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)"
        },
        "accuracyNotes": {
            "title": "⚠️ Accuracy Notes:",
            "items": [
                "Objects not on same plane as coin may have slight inaccuracy",
                "Accuracy depends on photo perpendicularity and coin alignment"
            ]
        }
    },
    "step3": {
        "title": "📏 Step 3: Place Measurements",
        "modesTitle": "Measurement Modes:",
        "distance": {
            "title": "📏 Distance",
            "description": "Tap two points to measure straight-line distance",
            "proTip": "🔺 Pro Tip: Triangles & Polygons - Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!"
        },
        "angle": {
            "title": "📐 Angle",
            "description": "Tap three points: vertex (middle) first, then two arms"
        },
        "circle": {
            "title": "⭕ Circle",
            "description": "Tap center, then edge. Shows diameter and area."
        },
        "rectangle": {
            "title": "▭ Rectangle",
            "description": "Tap two opposite corners. Shows width × height and area."
        },
        "freehand": {
            "title": "✏️ Freehand",
            "description": "Draw custom paths. Shows length. Close the loop for area calculation."
        },
        "controls": {
            "title": "📱 Controls:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between pan mode (move/zoom image) and edit mode",
                "Double-tap measurement: Add measurement name/description",
                "\"Undo\" button: Delete last placed point or tap 4x on object to delete it"
            ]
        }
    },
    "volume": {
        "title": "📦 Volume Calculation",
        "description": "For any area measurement (rectangles, circles, closed paths), you can add depth to calculate volume:",
        "howTo": {
            "title": "How to add volume:",
            "steps": [
                "Double-tap the measurement to open label modal",
                "Enter depth value and select unit",
                "Volume will display as V: next to area"
            ]
        },
        "example": "Example: Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)"
    },
    "navigation": {
        "title": "🎮 Navigation and Controls",
        "cameraScreen": {
            "title": "Camera Screen:",
            "items": [
                "\"Photo Library\" (bottom-left): Import existing photo",
                "\"Scale Mode\" button (bottom-left, three icons): Choose Map/Blueprint (pick 2 known points)",
                "Shutter button: Tap to capture, or hold for auto-capture when aligned",
                "\"Flash\" (top-right): Toggle torch light",
                "\"Help\" (top-right): Open this guide"
            ]
        },
        "measurementScreen": {
            "title": "Measurement Screen:",
            "items": [
                "\"Pan/Edit Toggle\": Switch between move image and edit measurements",
                "\"Measure\" button: Place new measurements",
                "\"Legend\" (left side): Shows all measurements, tap to collapse/expand",
                "\"Unit Toggle\": Switch between Metric/Imperial"
            ]
        },
        "pinchZoom": {
            "title": "Pinch and Zoom:",
            "description": "Use two fingers to zoom and pan the image for precise point placement"
        }
    },
    "moveEdit": {
        "title": "✏️ Move and Edit Measurements",
        "moving": {
            "title": "Moving Measurement Points:",
            "steps": [
                "Tap \"Pan/Edit\" button (shows \"Edit\" when points exist)",
                "Drag any point to reposition",
                "Values update in real-time"
            ]
        },
        "labels": {
            "title": "Adding Labels:",
            "items": [
                "Double-tap any measurement",
                "Enter measurement name/description",
                "For areas: optionally add depth for volume"
            ]
        },
        "deleting": {
            "title": "Deleting:",
            "items": [
                "Tap \"Undo\" button to delete last placed point",
                "Or tap 4x on a line/object in edit mode to delete it"
            ]
        }
    },
    "saveShare": {
        "title": "💾 Save and Share",
        "email": {
            "title": "📧 Export via Email:",
            "description": "Tap \"Email\" button to generate a professional report with:",
            "items": [
                "Full measurement photo with legend",
                "Transparent CAD overlay (50% opacity)",
                "Text list of all measurements with colors",
                "Calibration reference details"
            ]
        },
        "photos": {
            "title": "📱 Save to Photos:",
            "description": "Tap \"Save\" to export images to your photo library",
            "permissions": {
                "title": "Required Permissions:",
                "items": [
                    "\"Camera\" — to capture photos",
                    "\"Motion & Orientation\" — for auto-leveling (tilt detection)",
                    "\"Photo Library\" — to save measurements"
                ]
            }
        }
    },
    "emailWorkflow": {
        "title": "📧 Email Workflow Guide",
        "description": "Tap \"Email\" to generate a report with 2 photos and detailed measurement table.",
        "exampleTitle": "Example Email Format:"
    },
    "advanced": {
        "title": "🔧 Advanced Features",
        "calibrationMethods": {
            "title": "Alternative Calibration Methods:",
            "items": [
                "\"Map Mode\": Use map scale (e.g., \"1 inch = 10 miles\")",
                "\"Blueprint Mode\": Enter known distance between two points"
            ]
        },
        "switchingCalibration": {
            "title": "Switching Calibration:",
            "description": "Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo"
        }
    },
    "mapMode": {
        "title": "🗺️ Map Mode",
        "description": "Perfect for measuring from maps, floor plans, or any image with scale.",
        "howTo": {
            "title": "How to use:",
            "steps": [
                "Take photo of map (or import existing image)",
                "Enter the map scale (e.g., \"1 cm = 5 km\")",
                "Place measurements - they'll show in real-world units"
            ]
        },
        "supportedUnits": {
            "title": "Supported Units:",
            "description": "mm, cm, m, km, in, ft, mi - mix and match as needed!"
        }
    },
    "proTips": {
        "title": "💡 Pro Tips",
        "items": [
            "✅ Level is critical - take time to align crosshairs for better accuracy",
            "✅ Coin placement - put it on same surface/plane as measurement objects",
            "✅ Good lighting - avoid harsh shadows and glare",
            "✅ Perpendicular shots - face the subject directly for minimal distortion",
            "✅ Use labels - double-tap measurements to add custom names",
            "✅ Export early - save or email your work before starting new measurements"
        ]
    },
    "troubleshooting": {
        "title": "🔧 Troubleshooting",
        "items": [
            {
                "question": "❓ Camera won't align / Auto-capture not working?",
                "answer": "Check phone orientation - auto-capture only works in horizontal mode (looking down). For vertical surfaces, use manual shutter tap."
            },
            {
                "question": "❓ Measurements seem inaccurate?",
                "answer": [
                    "Check coin alignment during calibration",
                    "Make sure photo was taken perpendicular to surface",
                    "Verify coin is on same plane as measured objects"
                ]
            },
            {
                "question": "❓ Can't place measurements?",
                "answer": "Make sure you're in \"Measure\" mode (blue button should be highlighted). Try toggling \"Pan/Edit\" to reset gesture handlers."
            },
            {
                "question": "❓ Image rotated incorrectly?",
                "answer": "Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app"
            }
        ]
    },
    "cadIntegration": {
        "title": "📐 CAD Export and Integration",
        "description": "PanHandler exports include complete measurements and perfect transparent overlays for CAD workflows:",
        "emailContains": {
            "title": "Email Export Contains:",
            "items": [
                "Full Photo: Complete image with measurements and legend",
                "Transparent Overlay: 50% opacity - perfect for importing into CAD software"
            ]
        },
        "cadWorkflow": {
            "title": "CAD Workflow:",
            "items": [
                "Import transparent overlay as reference layer",
                "Use measurement values to create precise CAD drawings",
                "Values include area and volume where applicable"
            ]
        }
    },
    "footer": {
        "appName": "PanHandler",
        "tagline": "Precise measurements from photos",
        "generated": "Generated from latest app version • Visit our YouTube channel for video tutorials",
        "copyright": "Open Source Project"
    }
}
};
