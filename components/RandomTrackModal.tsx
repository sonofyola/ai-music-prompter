import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { TrackIdea, generateMultipleTrackIdeas } from '../utils/randomTrackGenerator';
import IconFallback from './IconFallback';

interface RandomTrackModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIdea: (subject: string) => void;
}

export default function RandomTrackModal({ 
  visible, 
  onClose, 
  onSelectIdea 
}: RandomTrackModalProps) {
  const { colors } = useTheme();
  const [trackIdeas, setTrackIdeas] = React.useState<TrackIdea[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      generateNewIdeas();
    }
  }, [visible]);

  const generateNewIdeas = () => {
    setIsGenerating(true);
    // Add a small delay for better UX
    setTimeout(() => {
      const newIdeas = generateMultipleTrackIdeas(6);
      setTrackIdeas(newIdeas);
      setIsGenerating(false);
    }, 300);
  };

  const handleSelectIdea = (idea: TrackIdea) => {
    Alert.alert(
      'Use This Idea?',
      `"${idea.subject}"\n\n${idea.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use This Idea', 
          onPress: () => {
            onSelectIdea(idea.subject);
            onClose();
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconFallback name="casino" size={24} color={colors.primary} />
            <Text style={styles.title}>Random Track Ideas</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconFallback name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Tap an idea to use it, or generate new ones for inspiration!
        </Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <IconFallback name="casino" size={32} color={colors.primary} />
              <Text style={styles.loadingText}>Generating creative ideas...</Text>
            </View>
          ) : (
            <View style={styles.ideasContainer}>
              {trackIdeas.map((idea, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.ideaCard}
                  onPress={() => handleSelectIdea(idea)}
                  activeOpacity={0.7}
                >
                  <View style={styles.ideaHeader}>
                    <Text style={styles.ideaSubject}>{idea.subject}</Text>
                    <IconFallback name="arrow-forward" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.ideaDescription}>{idea.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateNewIdeas}
            disabled={isGenerating}
          >
            <IconFallback 
              name="refresh" 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generating...' : 'Generate New Ideas'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 16,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  ideasContainer: {
    padding: 16,
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
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ideaSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  ideaDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
