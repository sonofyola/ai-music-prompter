import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { generateRandomTrack, RandomTrackData } from '../utils/randomTrackGenerator';

interface RandomTrackModalProps {
  visible: boolean;
  onClose: () => void;
  onUseTrack: (trackData: RandomTrackData) => void;
}

export default function RandomTrackModal({ visible, onClose, onUseTrack }: RandomTrackModalProps) {
  const [randomTrack, setRandomTrack] = useState<RandomTrackData | null>(null);

  const handleGenerateRandom = () => {
    const track = generateRandomTrack();
    setRandomTrack(track);
  };

  const handleUseTrack = () => {
    if (randomTrack) {
      onUseTrack(randomTrack);
      onClose();
    }
  };

  const handleModalOpen = () => {
    if (visible && !randomTrack) {
      handleGenerateRandom();
    }
  };

  React.useEffect(() => {
    handleModalOpen();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🎲 Random Track Generator</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {randomTrack && (
            <View style={styles.trackDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Genre:</Text>
                <Text style={styles.value}>{randomTrack.genre}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Mood:</Text>
                <Text style={styles.value}>{randomTrack.mood}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Tempo:</Text>
                <Text style={styles.value}>{randomTrack.tempo}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Instruments:</Text>
                <Text style={styles.value}>{randomTrack.instruments.join(', ')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Vocals:</Text>
                <Text style={styles.value}>{randomTrack.vocals}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Theme:</Text>
                <Text style={styles.value}>{randomTrack.theme}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Energy:</Text>
                <Text style={styles.value}>{randomTrack.energy}</Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRandom}>
              <Text style={styles.buttonText}>🎲 Generate New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.useButton} onPress={handleUseTrack}>
              <Text style={styles.buttonText}>Use This Track</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  trackDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    width: 80,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  generateButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});