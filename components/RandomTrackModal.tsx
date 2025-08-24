import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { generateMultipleTrackIdeas, TrackIdea } from '../utils/randomTrackGenerator';
import IconFallback from './IconFallback';

interface RandomTrackModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIdea: (subject: string) => void;
}

export default function RandomTrackModal({ visible, onClose, onSelectIdea }: RandomTrackModalProps) {
  const { colors } = useTheme();
  const [trackIdeas, setTrackIdeas] = useState<TrackIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const styles = createStyles(colors);

  const generateNewIdeas = async () => {
    setIsGenerating(true);
    // Add a small delay for better UX
    setTimeout(() => {
      const newIdeas = generateMultipleTrackIdeas(6);
      setTrackIdeas(newIdeas);
      setIsGenerating(false);
    }, 300);
  };

  useEffect(() => {
    if (visible && trackIdeas.length === 0) {
      generateNewIdeas();
    }
  }, [visible]);

  const handleSelectIdea = (idea: TrackIdea) => {
    onSelectIdea(idea.subject);
  };

  const renderIdea = (idea: TrackIdea, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.ideaCard}
      onPress={() => handleSelectIdea(idea)}
    >
      <View style={styles.ideaHeader}>
        <View style={styles.ideaIcon}>
          <IconFallback name="lightbulb" size={20} color={colors.primary} />
        </View>
        <Text style={styles.ideaSubject}>{idea.subject}</Text>
      </View>
      <Text style={styles.ideaDescription}>{idea.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Random Track Ideas</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconFallback name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Get inspired with AI-generated creative concepts for your next track
          </Text>
        </View>

        {/* Generate New Ideas Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={generateNewIdeas}
            disabled={isGenerating}
          >
            <IconFallback 
              name={isGenerating ? "refresh" : "casino"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generating...' : 'Generate New Ideas'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ideas List */}
        <ScrollView 
          style={styles.ideasList}
          contentContainerStyle={styles.ideasContent}
          showsVerticalScrollIndicator={false}
        >
          {trackIdeas.map((idea, index) => renderIdea(idea, index))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  generateButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  ideasList: {
    flex: 1,
  },
  ideasContent: {
    padding: 20,
    gap: 12,
  },
  ideaCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ideaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ideaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ideaSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  ideaDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});