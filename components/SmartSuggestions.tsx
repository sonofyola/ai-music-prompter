import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';

interface SmartSuggestionsProps {
  title: string;
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  maxVisible?: number;
}

export default function SmartSuggestions({ 
  title, 
  suggestions, 
  onSuggestionPress, 
  maxVisible = 3 
}: SmartSuggestionsProps) {
  const { colors } = useTheme();
  
  if (suggestions.length === 0) return null;
  
  const visibleSuggestions = suggestions.slice(0, maxVisible);
  
  const styles = createStyles(colors);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="lightbulb-outline" size={16} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.suggestionsContainer}>
        {visibleSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => onSuggestionPress(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
            <MaterialIcons name="add" size={14} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  suggestionText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
});
