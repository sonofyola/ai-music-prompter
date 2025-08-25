import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import FormField from '../components/FormField';
import PickerField from '../components/PickerField';
import MultiSelectField from '../components/MultiSelectField';
import GeneratedPrompt from '../components/GeneratedPrompt';
import TemplatesModal from '../components/TemplatesModal';
import RandomTrackModal from '../components/RandomTrackModal';
import { formatPrompt } from '../utils/promptFormatter';
import { musicData } from '../utils/musicData';
import { PromptTemplate } from '../utils/promptTemplates';
import { RandomTrackData } from '../utils/randomTrackGenerator';

export default function PromptFormScreen() {
  const { user, db } = useBasic();
  const [formData, setFormData] = useState({
    genre: '',
    mood: '',
    tempo: '',
    instruments: [],
    vocals: '',
    structure: '',
    theme: '',
    style: '',
    energy: '',
    production: '',
    customPrompt: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [randomTrackVisible, setRandomTrackVisible] = useState(false);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const prompt = formatPrompt(formData);
      setGeneratedPrompt(prompt);
      
      // Save to history if user is signed in
      if (user && db) {
        try {
          await db.from('prompt_history').add({
            name: `Prompt ${new Date().toLocaleDateString()}`,
            user_id: user.email || user.id,
            form_data: JSON.stringify(formData),
            generated_prompt: prompt,
            created_at: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error saving to history:', error);
        }
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearForm = () => {
    setFormData({
      genre: '',
      mood: '',
      tempo: '',
      instruments: [],
      vocals: '',
      structure: '',
      theme: '',
      style: '',
      energy: '',
      production: '',
      customPrompt: ''
    });
    setGeneratedPrompt('');
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setFormData(template.formData);
    setGeneratedPrompt('');
  };

  const handleUseRandomTrack = (trackData: RandomTrackData) => {
    setFormData(prev => ({
      ...prev,
      ...trackData
    }));
    setGeneratedPrompt('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🎵 AI Music Prompter</Text>
          <Text style={styles.subtitle}>Create professional music prompts for AI tools</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setTemplatesVisible(true)}
          >
            <Text style={styles.actionButtonText}>📋 Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setRandomTrackVisible(true)}
          >
            <Text style={styles.actionButtonText}>🎲 Random</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <PickerField
            label="Genre"
            value={formData.genre}
            onValueChange={(value) => updateField('genre', value)}
            items={musicData.genres}
            placeholder="Select a genre..."
          />

          <PickerField
            label="Mood"
            value={formData.mood}
            onValueChange={(value) => updateField('mood', value)}
            items={musicData.moods}
            placeholder="Select a mood..."
          />

          <PickerField
            label="Tempo"
            value={formData.tempo}
            onValueChange={(value) => updateField('tempo', value)}
            items={musicData.tempos}
            placeholder="Select tempo..."
          />

          <MultiSelectField
            label="Instruments"
            selectedValues={formData.instruments}
            onSelectionChange={(values) => updateField('instruments', values)}
            options={musicData.instruments}
            placeholder="Select instruments..."
          />

          <PickerField
            label="Vocals"
            value={formData.vocals}
            onValueChange={(value) => updateField('vocals', value)}
            items={musicData.vocals}
            placeholder="Select vocal style..."
          />

          <PickerField
            label="Song Structure"
            value={formData.structure}
            onValueChange={(value) => updateField('structure', value)}
            items={musicData.structures}
            placeholder="Select structure..."
          />

          <FormField
            label="Theme/Subject"
            value={formData.theme}
            onChangeText={(value) => updateField('theme', value)}
            placeholder="e.g., love, adventure, nostalgia..."
            multiline
          />

          <PickerField
            label="Style"
            value={formData.style}
            onValueChange={(value) => updateField('style', value)}
            items={musicData.styles}
            placeholder="Select style..."
          />

          <PickerField
            label="Energy Level"
            value={formData.energy}
            onValueChange={(value) => updateField('energy', value)}
            items={musicData.energyLevels}
            placeholder="Select energy level..."
          />

          <PickerField
            label="Production Style"
            value={formData.production}
            onValueChange={(value) => updateField('production', value)}
            items={musicData.productionStyles}
            placeholder="Select production style..."
          />

          <FormField
            label="Custom Instructions"
            value={formData.customPrompt}
            onChangeText={(value) => updateField('customPrompt', value)}
            placeholder="Add any specific instructions or details..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.generateButton]} 
            onPress={generatePrompt}
            disabled={isGenerating}
          >
            <Text style={styles.buttonText}>
              {isGenerating ? 'Generating...' : 'Generate Prompt'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={clearForm}
          >
            <Text style={styles.buttonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>

        {generatedPrompt && (
          <GeneratedPrompt 
            prompt={generatedPrompt}
            onCopy={() => Alert.alert('Copied!', 'Prompt copied to clipboard')}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Perfect for Riffusion, Suno, Udio, MusicGen, and other AI music tools
          </Text>
        </View>
      </ScrollView>

      <TemplatesModal
        visible={templatesVisible}
        onClose={() => setTemplatesVisible(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <RandomTrackModal
        visible={randomTrackVisible}
        onClose={() => setRandomTrackVisible(false)}
        onUseTrack={handleUseRandomTrack}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555555',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
