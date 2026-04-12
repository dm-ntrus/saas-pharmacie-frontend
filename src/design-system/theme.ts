// Thème centralisé pour le design system
// À étendre selon les besoins de la plateforme

export const colors = {
  primary: '#6366f1', // indigo-500
  secondary: '#a5b4fc', // indigo-200
  accent: '#a21caf', // purple-700
  danger: '#ef4444', // red-500
  warning: '#f59e42', // orange-400
  success: '#22c55e', // green-500
  info: '#0ea5e9', // sky-500
  background: '#ffffff',
  foreground: '#171717',
  muted: '#f3f4f6', // gray-100
  border: '#e5e7eb', // gray-200
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
};

export const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
};

export const theme = {
  colors,
  fontSizes,
  radii,
  shadows,
}; 