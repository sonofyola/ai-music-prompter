import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface IconFallbackProps {
  name: string;
  size?: number;
  color?: string;
  fallback?: string;
}

const iconFallbacks: Record<string, string> = {
  'auto-awesome': '✨',
  'history': '📜',
  'logout': '🚪',
  'login': '🔑',
  'shuffle': '🔀',
  'dashboard': '📊',
  'casino': '🎲',
  'music-note': '🎵',
  'content-copy': '📋',
  'check': '✅',
  'warning': '⚠️',
  'hourglass-empty': '⏳',
  'close': '❌',
  'delete': '🗑️',
  'edit': '✏️',
  'save': '💾',
  'refresh': '🔄',
  'settings': '⚙️',
  'search': '🔍',
  'add': '➕',
  'remove': '➖',
  'arrow-back': '←',
  'arrow-forward': '→',
  'expand-more': '▼',
  'expand-less': '▲',
};

export default function IconFallback({ 
  name, 
  size = 24, 
  color = '#000', 
  fallback 
}: IconFallbackProps) {
  const [hasError, setHasError] = React.useState(false);

  // Use provided fallback or lookup from our fallback map
  const fallbackIcon = fallback || iconFallbacks[name] || '?';

  if (hasError) {
    return (
      <View style={[styles.fallbackContainer, { width: size, height: size }]}>
        <Text style={[styles.fallbackText, { fontSize: size * 0.8, color }]}>
          {fallbackIcon}
        </Text>
      </View>
    );
  }

  try {
    return (
      <MaterialIcons 
        name={name as any} 
        size={size} 
        color={color}
        onError={() => setHasError(true)}
      />
    );
  } catch (error) {
    return (
      <View style={[styles.fallbackContainer, { width: size, height: size }]}>
        <Text style={[styles.fallbackText, { fontSize: size * 0.8, color }]}>
          {fallbackIcon}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    textAlign: 'center',
  },
});