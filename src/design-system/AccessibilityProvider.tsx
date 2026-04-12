"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicator: boolean;
  keyboardNavigation: boolean;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setContrast: (contrast: 'normal' | 'high') => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleScreenReader: () => void;
  setFocusIndicator: (enabled: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [contrast, setContrast] = useState<'normal' | 'high'>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(true);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem('accessibility-font-size') as 'small' | 'medium' | 'large';
      const savedContrast = localStorage.getItem('accessibility-contrast') as 'normal' | 'high';
      const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true';
      const savedScreenReader = localStorage.getItem('accessibility-screen-reader') === 'true';
      const savedFocusIndicator = localStorage.getItem('accessibility-focus-indicator') !== 'false';
      const savedKeyboardNavigation = localStorage.getItem('accessibility-keyboard-navigation') !== 'false';
      
      if (savedFontSize) setFontSize(savedFontSize);
      if (savedContrast) setContrast(savedContrast);
      setReducedMotion(savedReducedMotion);
      setScreenReader(savedScreenReader);
      setFocusIndicator(savedFocusIndicator);
      setKeyboardNavigation(savedKeyboardNavigation);

      // Détecter les préférences système
      if (window.matchMedia) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        if (prefersReducedMotion && !savedReducedMotion) {
          setReducedMotion(true);
        }
        if (prefersHighContrast && !savedContrast) {
          setContrast('high');
        }
      }
    }
  }, []);

  // Appliquer les classes CSS au document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Taille de police
      root.className = root.className.replace(/font-(small|medium|large)/g, '');
      root.classList.add(`font-${fontSize}`);
      
      // Contraste
      root.className = root.className.replace(/contrast-(normal|high)/g, '');
      root.classList.add(`contrast-${contrast}`);
      
      // Mouvement réduit
      if (reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }

      // Screen reader
      if (screenReader) {
        root.classList.add('screen-reader-active');
      } else {
        root.classList.remove('screen-reader-active');
      }

      // Focus indicator
      if (focusIndicator) {
        root.classList.add('focus-indicator-active');
      } else {
        root.classList.remove('focus-indicator-active');
      }

      // Keyboard navigation
      if (keyboardNavigation) {
        root.classList.add('keyboard-navigation-active');
      } else {
        root.classList.remove('keyboard-navigation-active');
      }
    }
  }, [fontSize, contrast, reducedMotion, screenReader, focusIndicator, keyboardNavigation]);

  // Sauvegarder les préférences
  const handleSetFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-font-size', size);
    }
  };

  const handleSetContrast = (newContrast: 'normal' | 'high') => {
    setContrast(newContrast);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-contrast', newContrast);
    }
  };

  const handleSetReducedMotion = (reduced: boolean) => {
    setReducedMotion(reduced);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-reduced-motion', reduced.toString());
    }
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-screen-reader', newValue.toString());
    }
  };

  const handleSetFocusIndicator = (enabled: boolean) => {
    setFocusIndicator(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-focus-indicator', enabled.toString());
    }
  };

  const handleSetKeyboardNavigation = (enabled: boolean) => {
    setKeyboardNavigation(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-keyboard-navigation', enabled.toString());
    }
  };

  const resetToDefaults = () => {
    setFontSize('medium');
    setContrast('normal');
    setReducedMotion(false);
    setScreenReader(false);
    setFocusIndicator(true);
    setKeyboardNavigation(true);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessibility-font-size');
      localStorage.removeItem('accessibility-contrast');
      localStorage.removeItem('accessibility-reduced-motion');
      localStorage.removeItem('accessibility-screen-reader');
      localStorage.removeItem('accessibility-focus-indicator');
      localStorage.removeItem('accessibility-keyboard-navigation');
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        contrast,
        reducedMotion,
        screenReader,
        focusIndicator,
        keyboardNavigation,
        setFontSize: handleSetFontSize,
        setContrast: handleSetContrast,
        setReducedMotion: handleSetReducedMotion,
        toggleScreenReader,
        setFocusIndicator: handleSetFocusIndicator,
        setKeyboardNavigation: handleSetKeyboardNavigation,
        resetToDefaults,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};