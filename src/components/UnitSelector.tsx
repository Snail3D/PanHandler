// UnitSelector v1.2 - Imperial=Red, Metric=Blue + Haptics!
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import useStore from '../state/measurementStore';
import { UnitSystem } from '../state/measurementStore';

export default function UnitSelector() {
  const unitSystem = useStore((s) => s.unitSystem);
  const setUnitSystem = useStore((s) => s.setUnitSystem);

  const options: { value: UnitSystem; label: string }[] = [
    { value: 'metric', label: 'Metric' },
    { value: 'imperial', label: 'Imperial' },
  ];

  // 🎵 Haptic sequences for unit system selection
  const playUnitHaptic = (unit: UnitSystem) => {
    if (unit === 'imperial') {
      // Imperial March (Star Wars) - DUN DUN DUN, dun-da-DUN, dun-da-DUN
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 150);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 500);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 600);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 700);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 900);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 1000);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1100);
    } else {
      // Metric = "This one goes to 11!" (Spinal Tap) - Progressive ascending to 11!
      // Quick ascending scale that keeps going beyond 10
      const delays = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]; // 11 beats!
      delays.forEach((delay, index) => {
        setTimeout(() => {
          const intensity = index < 5 
            ? Haptics.ImpactFeedbackStyle.Light 
            : index < 9 
              ? Haptics.ImpactFeedbackStyle.Medium 
              : Haptics.ImpactFeedbackStyle.Heavy; // Last 2 are ELEVEN!
          Haptics.impactAsync(intensity);
        }, delay);
      });
    }
  };

  return (
    <View className="flex-row bg-gray-100 rounded-lg p-1">
      {options.map((option) => {
        const isSelected = unitSystem === option.value;
        
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              playUnitHaptic(option.value);
              setUnitSystem(option.value);
            }}
            className={`flex-1 py-2 px-4 rounded-md ${
              isSelected ? 'bg-white' : 'bg-transparent'
            }`}
            style={{
              shadowColor: isSelected ? '#000' : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isSelected ? 0.1 : 0,
              shadowRadius: 2,
              elevation: isSelected ? 2 : 0,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
                color: !isSelected 
                  ? '#6B7280' // Gray when not selected
                  : option.value === 'metric' 
                    ? '#3B82F6' // Blue for Metric when selected
                    : '#EF4444', // Red for Imperial when selected
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
