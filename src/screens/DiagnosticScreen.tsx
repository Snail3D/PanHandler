import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

type DiagnosticStep = {
  id: string;
  instruction: string;
  duration: number; // seconds to hold position
};

const steps: DiagnosticStep[] = [
  { id: 'vertical-level', instruction: 'Hold phone VERTICAL and LEVEL (upright, not tilted)', duration: 3 },
  { id: 'look-down', instruction: 'Tilt phone FORWARD (look down at table)', duration: 3 },
  { id: 'look-up', instruction: 'Tilt phone BACKWARD (look up at ceiling)', duration: 3 },
  { id: 'rotate-90', instruction: 'Hold VERTICAL and LEVEL, then ROTATE 90° clockwise', duration: 3 },
  { id: 'rotate-180', instruction: 'Hold VERTICAL and LEVEL, then ROTATE 180° (upside down)', duration: 3 },
  { id: 'rotate-270', instruction: 'Hold VERTICAL and LEVEL, then ROTATE 270° counter-clockwise', duration: 3 },
];

type SensorReading = {
  stepId: string;
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
      return `${step.id}:\n  alpha: ${avg.alpha.toFixed(1)}°\n  beta: ${avg.beta.toFixed(1)}°\n  gamma: ${avg.gamma.toFixed(1)}°\n  samples: ${avg.count}`;
    }).join('\n\n');
    
    console.log('DIAGNOSTIC RESULTS:\n' + results);
    alert('Results logged to console! Check your terminal.');
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
                  <Text style={{ color: '#60A5FA', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                    {step.instruction}
                  </Text>
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
              style={{ backgroundColor: '#3B82F6', padding: 16, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Log Results to Console
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
          <Text style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
            Step {currentStepIndex + 1} of {steps.length}
          </Text>
          
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
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
              style={{ backgroundColor: '#3B82F6', padding: 20, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                Start Recording
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
