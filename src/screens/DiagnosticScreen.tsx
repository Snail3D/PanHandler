import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';

type DiagnosticStep = {
  id: string;
  title: string;
  instruction: string;
  icon: keyof typeof Ionicons.glyphMap;
  duration: number; // seconds to hold position
};

const steps: DiagnosticStep[] = [
  { 
    id: 'vertical-level', 
    title: 'Normal Portrait',
    instruction: 'Hold phone upright like you\'re taking a selfie.\nKeep it level (not tilted forward or back).', 
    icon: 'phone-portrait-outline',
    duration: 3 
  },
  { 
    id: 'look-down', 
    title: 'Tilt Down',
    instruction: 'Keep phone upright, but tilt the TOP forward.\nLike you\'re looking down at a coin on a table.', 
    icon: 'arrow-down-circle-outline',
    duration: 3 
  },
  { 
    id: 'look-up', 
    title: 'Tilt Up',
    instruction: 'Keep phone upright, but tilt the TOP backward.\nLike you\'re looking up at the ceiling.', 
    icon: 'arrow-up-circle-outline',
    duration: 3 
  },
  { 
    id: 'twist-right', 
    title: 'Twist Right',
    instruction: 'Hold phone upright and level.\nThen twist/spin it like turning a steering wheel clockwise.', 
    icon: 'reload-outline',
    duration: 3 
  },
];

type SensorReading = {
  stepId: string;
  title: string;
  instruction: string;
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: number;
};

export default function DiagnosticScreen({ onComplete }: { onComplete: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const recordedReadings = useRef<SensorReading[]>([]);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(50); // 20fps for accurate readings
    
    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation && isRecording) {
        const alpha = data.rotation.alpha * (180 / Math.PI);
        const beta = data.rotation.beta * (180 / Math.PI);
        const gamma = data.rotation.gamma * (180 / Math.PI);
        
        const reading: SensorReading = {
          stepId: steps[currentStepIndex].id,
          title: steps[currentStepIndex].title,
          instruction: steps[currentStepIndex].instruction,
          alpha,
          beta,
          gamma,
          timestamp: Date.now(),
        };
        
        recordedReadings.current.push(reading);
      }
    });

    return () => subscription.remove();
  }, [isRecording, currentStepIndex]);

  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next step
          setIsRecording(false);
          
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setCountdown(3);
          } else {
            // Done with all steps
            setReadings(recordedReadings.current);
            setShowResults(true);
          }
          
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, currentStepIndex]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const calculateAverage = (stepId: string) => {
    const stepReadings = readings.filter(r => r.stepId === stepId);
    if (stepReadings.length === 0) return null;

    const sum = stepReadings.reduce((acc, r) => ({
      alpha: acc.alpha + r.alpha,
      beta: acc.beta + r.beta,
      gamma: acc.gamma + r.gamma,
    }), { alpha: 0, beta: 0, gamma: 0 });

    return {
      alpha: sum.alpha / stepReadings.length,
      beta: sum.beta / stepReadings.length,
      gamma: sum.gamma / stepReadings.length,
      count: stepReadings.length,
    };
  };

  const copyResults = () => {
    const results = steps.map(step => {
      const avg = calculateAverage(step.id);
      if (!avg) return `${step.id}: No data`;
      return `${step.title}:\n  Alpha: ${avg.alpha.toFixed(1)}°\n  Beta: ${avg.beta.toFixed(1)}°\n  Gamma: ${avg.gamma.toFixed(1)}°`;
    }).join('\n\n');
    
    // Show alert with results
    alert('SENSOR READINGS:\n\n' + results + '\n\nPlease tell me these numbers!');
  };

  if (showResults) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            Diagnostic Results
          </Text>
          
          <ScrollView style={{ flex: 1 }}>
            {steps.map(step => {
              const avg = calculateAverage(step.id);
              if (!avg) return null;
              
              return (
                <View key={step.id} style={{ marginBottom: 20, padding: 15, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name={step.icon} size={24} color="#60A5FA" style={{ marginRight: 10 }} />
                    <Text style={{ color: '#60A5FA', fontSize: 16, fontWeight: 'bold' }}>
                      {step.title}
                    </Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: 12, fontFamily: 'monospace' }}>
                    Alpha (rotation): {avg.alpha.toFixed(1)}°
                  </Text>
                  <Text style={{ color: 'white', fontSize: 12, fontFamily: 'monospace' }}>
                    Beta (forward/back): {avg.beta.toFixed(1)}°
                  </Text>
                  <Text style={{ color: 'white', fontSize: 12, fontFamily: 'monospace' }}>
                    Gamma (left/right): {avg.gamma.toFixed(1)}°
                  </Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 10, marginTop: 4 }}>
                    {avg.count} samples
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={{ marginTop: 20, gap: 10 }}>
            <Pressable
              onPress={copyResults}
              style={{ backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Show Results Summary
              </Text>
            </Pressable>
            
            <Pressable
              onPress={onComplete}
              style={{ backgroundColor: '#6B7280', padding: 16, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Back to Camera
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 30, borderRadius: 16, width: '100%', maxWidth: 400 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            Step {currentStepIndex + 1} of {steps.length}
          </Text>
          
          {/* Big Icon */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name={currentStep.icon} size={80} color="#3B82F6" />
          </View>
          
          {/* Title */}
          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
            {currentStep.title}
          </Text>
          
          {/* Instructions */}
          <Text style={{ color: '#D1D5DB', fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 }}>
            {currentStep.instruction}
          </Text>

          {isRecording ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#10B981', fontSize: 72, fontWeight: 'bold' }}>
                {countdown}
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 16, marginTop: 10 }}>
                Hold steady...
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={startRecording}
              style={{ backgroundColor: '#10B981', padding: 20, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                Ready - Start Recording
              </Text>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={onComplete}
          style={{ position: 'absolute', top: 60, right: 20 }}
        >
          <Text style={{ color: '#9CA3AF', fontSize: 16 }}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
