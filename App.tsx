import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UnitSelector from "./src/components/UnitSelector";
import useStore from "./src/state/measurementStore";
import { formatMeasurement } from "./src/utils/unitConversion";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

function DemoContent() {
  const insets = useSafeAreaInsets();
  const unitSystem = useStore((s) => s.unitSystem);

  // Demo measurements
  const demoMeasurements = [
    { value: 5, unit: 'cm' as const, label: 'Small object' },
    { value: 25, unit: 'cm' as const, label: 'Medium object' },
    { value: 150, unit: 'cm' as const, label: 'Large object' },
    { value: 2.5, unit: 'mm' as const, label: 'Tiny measurement' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{ 
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
        paddingHorizontal: 20 
      }}
    >
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Unit System Demo
      </Text>
      <Text className="text-gray-600 mb-8">
        Choose between metric and imperial units
      </Text>

      <View className="mb-8">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          UNIT SYSTEM
        </Text>
        <UnitSelector />
      </View>

      <View className="bg-blue-50 rounded-xl p-4 mb-6">
        <Text className="text-sm font-semibold text-blue-900 mb-2">
          Current System
        </Text>
        <Text className="text-2xl font-bold text-blue-600 capitalize">
          {unitSystem}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          EXAMPLE MEASUREMENTS
        </Text>
      </View>

      {demoMeasurements.map((measurement, index) => (
        <View 
          key={index}
          className="bg-gray-50 rounded-lg p-4 mb-3 flex-row justify-between items-center"
        >
          <Text className="text-gray-700 font-medium">
            {measurement.label}
          </Text>
          <Text className="text-lg font-semibold text-gray-900">
            {formatMeasurement(measurement.value, measurement.unit, unitSystem)}
          </Text>
        </View>
      ))}

      <View className="mt-6 p-4 bg-gray-100 rounded-lg">
        <Text className="text-xs text-gray-600 leading-5">
          The unit selector will automatically convert and display measurements in your preferred unit system. 
          Metric uses millimeters and centimeters, while Imperial uses inches and feet.
        </Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <DemoContent />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
