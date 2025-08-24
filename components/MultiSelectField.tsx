import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import IconFallback from './IconFallback';

interface MultiSelectFieldProps {
  label: string;
  values: string[];
  onValuesChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
  maxSelections?: number;
}

export default function MultiSelectField({ 
  label, 
  values, 
  onValuesChange, 
  options, 
  placeholder = "Select options...",
  maxSelections
}: MultiSelectFieldProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOption = (option: string) => {
    if (values.includes(option)) {
      // Remove option
      onValuesChange(values.filter(v => v !== option));
    } else {
      // Add option, but check max selections
      if (maxSelections && values.length >= maxSelections) {
        Alert.alert(
          'Selection Limit',
          `You can only select up to ${maxSelections} ${label.toLowerCase()}.`,
          [{ text: 'OK' }]
        );
        return;
      }
      onValuesChange([...values, option]);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={[styles.selectorText, values.length === 0 && styles.placeholder]}>
          {values.length === 0 
            ? placeholder 
            : values.length === 1 
              ? values[0]
              : `${values.length} selected`
          }
        </Text>
        <IconFallback 
          name={isExpanded ? "expand-less" : "expand-more"} 
          size={24} 
          color={colors.textSecondary}
          fallback={isExpanded ? "▲" : "▼"}
        />
      </TouchableOpacity>

      {values.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.selectedContainer}
        >
          {values.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={styles.selectedItem}
              onPress={() => toggleOption(value)}
            >
              <Text style={styles.selectedText}>{value}</Text>
              <IconFallback name="close" size={16} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {isExpanded && (
        <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                values.includes(option) && styles.selectedOption
              ]}
              onPress={() => toggleOption(option)}
            >
              <Text style={[
                styles.optionText,
                values.includes(option) && styles.selectedOptionText
              ]}>
                {option}
              </Text>
              {values.includes(option) && (
                <IconFallback name="check" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textTertiary,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: colors.background,
  },
  selectedOptionText: {
    color: colors.text,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
});
