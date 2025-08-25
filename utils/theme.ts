export type Theme = 'dark';

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

// Always use dark theme
export const colors = darkColors;

export function useTheme() {
  return {
    theme: 'dark' as Theme,
    colors: darkColors,
  };
}
