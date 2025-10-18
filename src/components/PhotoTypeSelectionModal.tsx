import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CoinIcon, DroneIcon, MapIcon, BlueprintIcon, RulerIcon } from './CalibrationIcons';

export type PhotoType = 'coin' | 'aerial' | 'map' | 'blueprint' | 'knownScale';

interface PhotoTypeSelectionModalProps {
  visible: boolean;
  onSelect: (type: PhotoType) => void;
  onCancel: () => void;
}

const PhotoTypeSelectionModal: React.FC<PhotoTypeSelectionModalProps> = ({
  visible,
  onSelect,
  onCancel,
}) => {
  const handleSelect = (type: PhotoType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(type);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleCancel} />
        
        <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Choose Photo Type</Text>
              <Text style={styles.subtitle}>
                How would you like to calibrate this photo?
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Coin Reference */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('coin')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,149,0,0.2)' }]}>
                  <CoinIcon size={28} color="#FF9500" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Coin Reference</Text>
                  <Text style={styles.optionDescription}>
                    Classic calibration with a coin
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>

              {/* Aerial Photo */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('aerial')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,199,190,0.2)' }]}>
                  <DroneIcon size={28} color="#00C7BE" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Aerial Photo</Text>
                  <Text style={styles.optionDescription}>
                    Auto-calibrate from drone metadata
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>

              {/* Map Mode */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('map')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,122,255,0.2)' }]}>
                  <MapIcon size={28} color="#007AFF" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Map Mode</Text>
                  <Text style={styles.optionDescription}>
                    Use verbal scale (1 inch = 10 miles)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>

              {/* Blueprint */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('blueprint')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(88,86,214,0.2)' }]}>
                  <BlueprintIcon size={28} color="#5856D6" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Blueprint</Text>
                  <Text style={styles.optionDescription}>
                    Calibrate from scale bar
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>

              {/* Known Scale */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('knownScale')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(52,199,89,0.2)' }]}>
                  <RulerIcon size={28} color="#34C759" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Known Scale</Text>
                  <Text style={styles.optionDescription}>
                    Two-point with known distance
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>
            </View>

            {/* Cancel Button */}
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurContainer: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  modalContent: {
    padding: 28,
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle white tint for watery effect
  },
  header: {
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 14,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', // More opaque for watery glass effect
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)', // Stronger border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  optionPressed: {
    backgroundColor: 'rgba(255,255,255,0.30)', // Brighter when pressed
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.25,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 19,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ scale: 0.97 }],
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

export default PhotoTypeSelectionModal;
