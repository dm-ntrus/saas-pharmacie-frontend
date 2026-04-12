/**
 * Centralized theme tokens — aligned with globals.css emerald palette.
 * Prefer Tailwind classes in components; use these tokens for JS-driven styling.
 */

export const colors = {
  primary: '#059669',
  secondary: '#a7f3d0',
  accent: '#047857',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6',
  background: '#ffffff',
  foreground: '#171717',
  muted: '#f3f4f6',
  border: '#e5e7eb',
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
