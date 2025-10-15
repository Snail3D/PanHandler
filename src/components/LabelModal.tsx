import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

// Small, inventive maker items for placeholder examples
// Mix of real maker projects and absurdly funny ones
const makerExamples = [
  // Real Maker Stuff
  "3D Printer Nozzle",
  "Arduino Enclosure",
  "Laser-cut Bracket",
  "PCB Spacer",
  "Servo Mount",
  "LED Diffuser",
  "Raspberry Pi Case",
  "Cable Organizer",
  "Phone Stand",
  "Desk Organizer",
  "Spool Holder",
  "Filament Guide",
  "Tool Holder",
  "Wrench Organizer",
  "Drill Bit Case",
  "Soldering Station",
  "Wire Stripper",
  "Heat Sink Mount",
  "Fan Bracket",
  "GPIO Header",
  "Breadboard Holder",
  "Multimeter Stand",
  "Oscilloscope Probe",
  "USB Hub Mount",
  "SD Card Holder",
  "Battery Tray",
  "Motor Controller",
  "Stepper Driver",
  "Limit Switch",
  "E-Stop Button",
  "Encoder Mount",
  "Belt Tensioner",
  "Linear Rail",
  "Ball Bearing",
  "Lead Screw Nut",
  "Coupler Joint",
  "Flex Cable",
  "Ribbon Connector",
  "Optical Sensor",
  "Proximity Switch",
  "Relay Module",
  "Voltage Regulator",
  "Buck Converter",
  "Boost Module",
  "Power Supply",
  "Transformer Core",
  "Inductor Coil",
  "Capacitor Bank",
  "Resistor Array",
  "Potentiometer Knob",
  
  // Funny/Absurd Maker Items
  "Left-Handed Screwdriver",
  "Bacon Stretcher",
  "Wifi Signal Booster (tinfoil hat)",
  "Anti-Gravity Boots",
  "Sarcasm Detector",
  "Procrastination Timer",
  "Invisible Ink Pen",
  "Self-Stirring Coffee Mug",
  "Diet Water Bottle",
  "Rubber Crutch",
  "Glass Hammer",
  "Chocolate Teapot",
  "Screen Door (for submarine)",
  "Ejector Seat (for helicopter)",
  "Waterproof Tea Bag",
  "Fireproof Match",
  "Solar-Powered Flashlight",
  "Inflatable Dartboard",
  "Parachute (that opens on impact)",
  "Silent Alarm Clock",
  "Mesh Umbrella",
  "Wooden Frying Pan",
  "Battery-Powered Battery",
  "Helium-Filled Anchor",
  "Braille Speedometer",
  "Glow-in-the-Dark Sunglasses",
  "Watermelon Slicer (for soup)",
  "Non-Stick Glue",
  "Dehydrated Water",
  "Pre-Sharpened Pencil Shavings",
  "Training Wheels (for unicycle)",
  "Kickstand (for shopping cart)",
  "Turn Signals (for wheelchair)",
  "Rearview Mirror (for stroller)",
  "Ejection Seat (for motorcycle)",
  "Windshield Wipers (for glasses)",
  "Anti-Theft Device (for trash can)",
  "Temperature Gauge (for ice cube)",
  "Volume Knob (for library)",
  "Mute Button (for awkward silence)",
  "Turbo Button (for snail)",
  "Cruise Control (for treadmill)",
  "Parking Brake (for office chair)",
  "Fog Lights (for shower)",
  "High Beams (for bedside lamp)",
  "Hazard Lights (for toaster)",
  
  // Hilariously Specific Maker Projects
  "Cat Video Thumbnail Generator",
  "Regex Anger Management Tool",
  "Meeting Escape Hatch",
  "Email Delay Procrastinator",
  "Code Comment Excuse Generator",
  "Bug Report Translator",
  "Infinite Loop Detector",
  "Stack Overflow Search Optimizer",
  "Coffee-to-Code Converter",
  "Keyboard Smash Preventer",
  "Tab vs Space Arbitrator",
  "Git Commit Message Creator",
  "Semicolon Location Device",
  "Null Pointer Exception Shield",
  "Memory Leak Finder",
  "Rubber Duck Holder",
  "Second Monitor Arm",
  "Standing Desk Adapter",
  "Cable Management Nightmare",
  "USB-C Dongle Collection",
  "Mechanical Keyboard Switch",
  "Keycap Puller Tool",
  "Mousepad Edge Protector",
  "Monitor Stand Riser",
  "Headphone Hanger Hook",
  "Webcam Privacy Slider",
  "Laptop Cooling Pad",
  "Phone Charging Dock",
  "Tablet Stylus Holder",
  "Smart Home Hub",
  "IoT Doorbell Mount",
  "Security Camera Bracket",
  "Light Switch Cover",
  "Outlet Extender Box",
  "Cord Concealer Channel",
  
  // More Absurd Items
  "Edible Napkin",
  "Sandwich Bag (made of bread)",
  "Liquid Scissors",
  "Transparent Eraser",
  "Square Basketball",
  "Stripey Paint",
  "Left-Handed Smoke Shifter",
  "Bucket of Steam",
  "Long Weight",
  "Tartan Paint",
  "Elbow Grease Jar",
  "Sky Hook",
  "Muffler Bearing",
  "Headlight Fluid",
  "Turn Signal Fluid",
  "Exhaust Sample",
  "Piston Return Spring",
  "Spark Plug Gap Inspector",
  "Flux Capacitor",
  "Quantum Carburetor",
  "Retroencabulator",
  "Turboencabulator",
  "Prefabulated Amulite",
  "Spurving Bearing",
  "Dingle Arm",
  "Magneto Reluctance",
  "Cardinal Grammeters",
  "Panametric Fan",
  "Drawn Reciprocation Dingle Arm",
  "Modial Interaction",
  "Hydrocoptic Marzelvanes",
  
  // Actually Useful But Funny Names
  "Widget Thingy",
  "Doohickey Adapter",
  "Thingamabob Mount",
  "Whatchamacallit Holder",
  "Gizmo Container",
  "Contraption Part",
  "Mechanism Piece",
  "Apparatus Component",
  "Device Element",
  "Gadget Segment",
  
  // Maker In-Jokes
  "Calibration Cube #47",
  "Benchy the Boat",
  "Test Print Graveyard Item",
  "Failed First Layer",
  "Spaghetti Detector",
  "Bed Adhesion Tester",
  "Z-Wobble Compensator",
  "Bridging Test Piece",
  "Overhang Challenge",
  "Support Material Nightmare",
  "Stringing Test Tower",
  "Temperature Tower Section",
  "Retraction Test Sample",
  "Flow Rate Calibrator",
  "Elephant Foot Fixer",
  "Layer Shift Preventer",
  "Warping Solution",
  "Ghosting Reducer",
  "Ringing Damper",
  "Infill Pattern Viewer",
  
  // Random Household Absurdities
  "Soup Can Lid",
  "Dirty Gym Socks",
  "Coffee Mug Chip",
  "Remote Control Battery Cover",
  "Mismatched Tupperware Lid",
  "Single Earring",
  "Incomplete Jigsaw Puzzle Piece",
  "Broken Shoelace Aglet",
  "Dried Out Marker Cap",
  "Forgotten USB Cable",
  "Mystery Key",
  "Rattling Dashboard Thing",
  "Unidentified Screw",
  "Spare Button",
  "Lint Ball",
  "Crumb Tray",
  "Dust Bunny",
  "Pet Hair Clump",
  "Lost LEGO Piece",
  "Stubborn Sticker Residue",
  "Potato Chip Bag Clip",
  "Twist Tie Collection",
  "Rubber Band Ball",
  "Paper Clip Chain",
  "Staple Remover",
  "Thumbtack Point",
  "Pushpin Head",
  "Binder Clip Spring",
  "Highlighter Cap",
  "Pen Spring",
  "Mechanical Pencil Lead",
  "Eraser Shavings",
  "Pencil Sharpener Blade",
  "Crayon Wrapper",
  "Marker Stain",
  "Glue Stick Residue",
  "Tape Dispenser Blade",
  "Scissors Rivet",
  "Ruler Edge",
  "Protractor Degree Mark",
  "Compass Point",
  "Calculator Button",
  "Stapler Spring",
  "Hole Punch Circles",
  
  // More Tech Humor
  "404 Error Page",
  "Blue Screen Snapshot",
  "Spinning Beach Ball",
  "Hourglass Cursor",
  "Loading Bar Animation",
  "Progress Indicator",
  "Buffer Overflow",
  "Segmentation Fault",
  "Core Dump File",
  "Kernel Panic Screenshot",
  "Permission Denied Message",
  "Access Violation Report",
  "Timeout Exception",
  "Connection Refused Notice",
  "Certificate Expired Warning",
  "Low Battery Icon",
  "No Signal Bars",
  "Wifi Symbol (but sad)",
  "Bluetooth (but lonely)",
  "USB Not Recognized",
  "Driver Update Nag",
  "Windows Update Delay",
  "MacOS Spinning Wheel",
  "Android Boot Loop",
  "iOS Loading Circle",
];

// Map-themed funny examples for Map Mode
const mapExamples = [
  // Fictional/Funny Places
  "Map to Nowhere",
  "Middle Earth Overview",
  "Treasure Island (X marks the spot)",
  "Atlantis Location",
  "Narnia Wardrobe Route",
  "Hogwarts Grounds",
  "Hundred Acre Wood",
  "Neverland Flight Path",
  "Bikini Bottom Layout",
  "Springfield Town Center",
  "Gotham City Streets",
  "Westeros Continent",
  "The Upside Down",
  "Silent Hill Roads",
  "Vice City Map",
  "Hyrule Kingdom",
  "Mushroom Kingdom",
  "DK Island",
  "Green Hill Zone",
  "World 1-1",
  // Absurd Map Titles
  "Where I Parked",
  "Bathroom Locations",
  "Nearest Coffee",
  "Wi-Fi Dead Zones",
  "Dog Walking Route",
  "Pizza Delivery Zone",
  "Donut Shop Radius",
  "Escape Routes",
  "Secret Shortcut",
  "The Long Way Home",
  // Adventure/Pirate Themed
  "Pirate Treasure Map",
  "Buried Gold Location",
  "Secret Hideout",
  "Abandoned Mine Shaft",
  "Lost Temple Entrance",
  "Hidden Waterfall",
  "Ancient Ruins Path",
  "Forbidden Forest",
  "Dragon Lair",
  "Quest Waypoints",
  // Real-ish But Funny
  "Dad Shortcut",
  "Scenic Route (that takes 3x longer)",
  "Traffic Jam Detour",
  "Construction Zone Map",
  "Pothole Locations",
  "Speed Trap Warnings",
  "School Drop-off Route",
  "Grocery Store Circuit",
  "Mall Parking Spots",
  "Airport Terminal Maze",
];


const getRandomExample = (isMapMode: boolean = false) => {
  const examples = isMapMode ? mapExamples : makerExamples;
  const idx = Math.floor(Math.random() * examples.length);
  return examples[idx];
};

interface LabelModalProps {
  visible: boolean;
  onComplete: (label: string | null) => void;
  onDismiss: () => void;
  initialValue?: string | null;
  isMapMode?: boolean;
}

export default function LabelModal({ visible, onComplete, onDismiss, initialValue, isMapMode = false }: LabelModalProps) {
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  // Generate a new random example whenever modal becomes visible
  useEffect(() => {
    if (visible) {
      const example1 = getRandomExample(isMapMode);
      const example2 = getRandomExample(isMapMode);
      setPlaceholder(`e.g., ${example1}, ${example2}...`);
      
      // Pre-fill with initial value if provided
      if (initialValue) {
        setLabel(initialValue);
      }
    }
  }, [visible, initialValue]);

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();
    onComplete(label.trim() || null);
    setLabel(''); // Reset for next time
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onComplete(null);
    setLabel(''); // Reset for next time
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setLabel('');
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <Pressable 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
          onPress={handleCancel}
        >
          <Pressable 
            style={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 16,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <BlurView intensity={35} tint="light">
              <View style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}>
                {/* Header */}
                <View style={{
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(88,86,214,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                        <Ionicons name="pricetag" size={20} color="#5856D6" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 18, 
                          fontWeight: '700',
                          color: '#1C1C1E',
                          letterSpacing: -0.3,
                        }}>
                          Label This Item
                        </Text>
                        <Text style={{ 
                          color: '#6E6E73', 
                          fontSize: 12, 
                          fontWeight: '500',
                          marginTop: 1,
                        }}>
                          Optional
                        </Text>
                      </View>
                    </View>
                    <Pressable 
                      onPress={handleCancel}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: 'rgba(120,120,128,0.16)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="close" size={20} color="#3C3C43" />
                    </Pressable>
                  </View>
                </View>

                {/* Content */}
                <View style={{ paddingHorizontal: 20, paddingVertical: 18 }}>
                  {/* Input Field */}
                  <View style={{ marginBottom: 6 }}>
                    <Text style={{ 
                      color: '#48484A', 
                      fontSize: 13, 
                      fontWeight: '600', 
                      marginBottom: 8,
                    }}>
                      What is this?
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderWidth: 2,
                      borderColor: 'rgba(120,120,128,0.25)',
                    }}>
                      <Ionicons name="pricetag-outline" size={18} color="#8E8E93" />
                      <TextInput
                        value={label}
                        onChangeText={setLabel}
                        placeholder={placeholder || "e.g., Arduino Case, LED Mount..."}
                        placeholderTextColor="#8E8E93"
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: '500',
                          color: '#1C1C1E',
                        }}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                        maxLength={50}
                      />
                      {label.length > 0 && (
                        <Pressable onPress={() => setLabel('')}>
                          <Ionicons name="close-circle" size={20} color="#8E8E93" />
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <Text style={{ 
                    color: '#6E6E73', 
                    fontSize: 11,
                    fontWeight: '500',
                  }}>
                    This label will appear in emails and saved photos
                  </Text>
                </View>

                {/* Footer Buttons */}
                <View style={{
                  paddingHorizontal: 20,
                  paddingBottom: 12,
                  paddingTop: 0,
                  alignItems: 'center',
                }}>
                  <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 280, alignItems: 'center', justifyContent: 'center' }}>
                    {/* Save Button - Larger, glassmorphic background */}
                    <Pressable
                      onPress={handleContinue}
                      style={({ pressed }) => ({
                        flex: 1.8,
                        backgroundColor: pressed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 14,
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                      })}
                    >
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="save" size={20} color="#1C1C1E" />
                      </View>
                      <Text style={{ 
                        color: '#1C1C1E', 
                        fontWeight: '700', 
                        fontSize: 18, 
                        marginLeft: 8,
                      }}>
                        Save
                      </Text>
                    </Pressable>

                    {/* Skip Button - Changed to "Leave Blank" */}
                    <Pressable
                      onPress={handleSkip}
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: pressed ? 'rgba(120,120,128,0.08)' : 'transparent',
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Text style={{ 
                        color: '#8E8E93', 
                        fontWeight: '600', 
                        fontSize: 14, 
                      }}>
                        Leave Blank
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
