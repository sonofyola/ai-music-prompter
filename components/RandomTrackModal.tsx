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
      accessibilityViewIsModal={true}
      onRequestClose={onClose}
    >
      <View 
        style={styles.container}
        accessible={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text 
            style={styles.title}
            accessibilityRole="header"
            accessibilityLevel={1}
          >
            🎲 Random Track Generator
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            accessible={true}
            accessibilityLabel="Close random track modal"
            accessibilityHint="Returns to the main prompt form"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          accessible={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <Text 
            style={styles.description}
            accessibilityRole="text"
          >
            Get inspired with a randomly generated music concept! Perfect for breaking creative blocks.
          </Text>

          {/* Generated track display */}
          {randomTrack && (
            <View 
              style={styles.trackContainer}
              accessible={true}
              accessibilityLabel="Generated random track concept"
              accessibilityRole="region"
            >
              <Text 
                style={styles.trackTitle}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                🎵 Your Random Track
              </Text>

              <View style={styles.trackDetails}>
                <View 
                  style={styles.trackField}
                  accessible={true}
                  accessibilityLabel={`Genre: ${randomTrack.genre}`}
                  accessibilityRole="text"
                >
                  <Text style={styles.fieldLabel} accessible={false}>Genre:</Text>
                  <Text style={styles.fieldValue} accessible={false}>{randomTrack.genre}</Text>
                </View>

                <View 
                  style={styles.trackField}
                  accessible={true}
                  accessibilityLabel={`Mood: ${randomTrack.mood}`}
                  accessibilityRole="text"
                >
                  <Text style={styles.fieldLabel} accessible={false}>Mood:</Text>
                  <Text style={styles.fieldValue} accessible={false}>{randomTrack.mood}</Text>
                </View>

                <View 
                  style={styles.trackField}
                  accessible={true}
                  accessibilityLabel={`Instruments: ${randomTrack.instruments}`}
                  accessibilityRole="text"
                >
                  <Text style={styles.fieldLabel} accessible={false}>Instruments:</Text>
                  <Text style={styles.fieldValue} accessible={false}>{randomTrack.instruments}</Text>
                </View>

                <View 
                  style={styles.trackField}
                  accessible={true}
                  accessibilityLabel={`Tempo: ${randomTrack.tempo}`}
                  accessibilityRole="text"
                >
                  <Text style={styles.fieldLabel} accessible={false}>Tempo:</Text>
                  <Text style={styles.fieldValue} accessible={false}>{randomTrack.tempo}</Text>
                </View>

                {randomTrack.specialElement && (
                  <View 
                    style={styles.trackField}
                    accessible={true}
                    accessibilityLabel={`Special element: ${randomTrack.specialElement}`}
                    accessibilityRole="text"
                  >
                    <Text style={styles.fieldLabel} accessible={false}>Special Element:</Text>
                    <Text style={styles.fieldValue} accessible={false}>{randomTrack.specialElement}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleGenerateRandom}
              disabled={isGenerating}
              accessible={true}
              accessibilityLabel={isGenerating ? "Generating random track" : "Generate random track"}
              accessibilityHint="Creates a new random music concept with genre, mood, and instruments"
              accessibilityRole="button"
              accessibilityState={{
                disabled: isGenerating,
                busy: isGenerating
              }}
            >
              <Text style={styles.generateButtonText}>
                {isGenerating ? '🎲 Generating...' : '🎲 Generate Random Track'}
              </Text>
            </TouchableOpacity>

            {randomTrack && (
              <TouchableOpacity 
                style={styles.useTrackButton}
                onPress={handleUseTrack}
                accessible={true}
                accessibilityLabel="Use this random track"
                accessibilityHint="Fills the main form with this random track's details"
                accessibilityRole="button"
              >
                <Text style={styles.useTrackButtonText}>
                  ✨ Use This Track
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tips section */}
          <View 
            style={styles.tipsContainer}
            accessible={true}
            accessibilityLabel="Tips for using random tracks"
            accessibilityRole="region"
          >
            <Text 
              style={styles.tipsTitle}
              accessibilityRole="header"
              accessibilityLevel={3}
            >
              💡 Tips:
            </Text>
            <Text 
              style={styles.tipsText}
              accessibilityRole="text"
            >
              • Use random tracks as starting points for your creativity{'\n'}
              • Mix and match elements from different generations{'\n'}
              • Add your own twist to make it unique{'\n'}
              • Perfect for overcoming writer's block
            </Text>
          </View>
        </ScrollView>
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
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 16,
    backgroundColor: colors.surface,
  },
  trackContainer: {
    padding: 16,
    gap: 12,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  trackDetails: {
    flexDirection: 'column',
    gap: 8,
  },
  trackField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  fieldValue: {
    fontSize: 14,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
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
  useTrackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  useTrackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    padding: 16,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
