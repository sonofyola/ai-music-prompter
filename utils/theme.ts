export type Theme = 'light' | 'dark';

const lightColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
};

const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#818cf8',
  secondary: '#a78bfa',
  accent: '#22d3ee',
  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  textTertiary: '#cbd5e1',
  border: '#475569',
  borderLight: '#64748b',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
};

// For now, just use dark theme by default
export const colors = darkColors;

export function useTheme() {
  return {
    theme: 'dark' as Theme,
    toggleTheme: () => {}, // No-op for now
    colors: darkColors,
  };
}