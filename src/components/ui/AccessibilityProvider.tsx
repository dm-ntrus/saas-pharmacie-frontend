"use client";

import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  fontSize: "small" | "medium" | "large";
  contrast: "normal" | "high";
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicator: boolean;
  keyboardNavigation: boolean;
  setFontSize: (size: "small" | "medium" | "large") => void;
  setContrast: (contrast: "normal" | "high") => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleScreenReader: () => void;
  setFocusIndicator: (enabled: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined,
);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const COOKIE_KEYS = {
  fontSize: "accessibility-font-size",
  contrast: "accessibility-contrast",
  reducedMotion: "accessibility-reduced-motion",
  screenReader: "accessibility-screen-reader",
  focusIndicator: "accessibility-focus-indicator",
  keyboardNav: "accessibility-keyboard-navigation",
} as const;

function loadPref(key: string): string | null {
  return getCookie(key) || (typeof window !== "undefined" ? localStorage.getItem(key) : null);
}

function savePref(key: string, value: string) {
  setCookie(key, value);
  if (typeof window !== "undefined") localStorage.setItem(key, value);
}

function removePref(key: string) {
  removeCookie(key);
  if (typeof window !== "undefined") localStorage.removeItem(key);
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [contrast, setContrast] = useState<"normal" | "high">("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(true);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedFont = loadPref(COOKIE_KEYS.fontSize) as "small" | "medium" | "large" | null;
    const storedContrast = loadPref(COOKIE_KEYS.contrast) as "normal" | "high" | null;
    const storedReducedMotion = loadPref(COOKIE_KEYS.reducedMotion) === "true";
    const storedScreenReader = loadPref(COOKIE_KEYS.screenReader) === "true";
    const storedFocusIndicator = loadPref(COOKIE_KEYS.focusIndicator) !== "false";
    const storedKeyboardNav = loadPref(COOKIE_KEYS.keyboardNav) !== "false";

    if (storedFont) setFontSize(storedFont);
    if (storedContrast) setContrast(storedContrast);
    setReducedMotion(storedReducedMotion);
    setScreenReader(storedScreenReader);
    setFocusIndicator(storedFocusIndicator);
    setKeyboardNavigation(storedKeyboardNav);

    if (window.matchMedia) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !storedReducedMotion) {
        setReducedMotion(true);
      }
      if (window.matchMedia("(prefers-contrast: high)").matches && !storedContrast) {
        setContrast("high");
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.className = root.className.replace(/font-(small|medium|large)/g, "");
    root.classList.add(`font-${fontSize}`);

    root.className = root.className.replace(/contrast-(normal|high)/g, "");
    root.classList.add(`contrast-${contrast}`);

    root.classList.toggle("reduced-motion", reducedMotion);
    root.classList.toggle("screen-reader-active", screenReader);
    root.classList.toggle("focus-indicator-active", focusIndicator);
    root.classList.toggle("keyboard-navigation-active", keyboardNavigation);
  }, [fontSize, contrast, reducedMotion, screenReader, focusIndicator, keyboardNavigation]);

  const handleSetFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    savePref(COOKIE_KEYS.fontSize, size);
  };

  const handleSetContrast = (newContrast: "normal" | "high") => {
    setContrast(newContrast);
    savePref(COOKIE_KEYS.contrast, newContrast);
  };

  const handleSetReducedMotion = (reduced: boolean) => {
    setReducedMotion(reduced);
    savePref(COOKIE_KEYS.reducedMotion, reduced.toString());
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    savePref(COOKIE_KEYS.screenReader, newValue.toString());
  };

  const handleSetFocusIndicator = (enabled: boolean) => {
    setFocusIndicator(enabled);
    savePref(COOKIE_KEYS.focusIndicator, enabled.toString());
  };

  const handleSetKeyboardNavigation = (enabled: boolean) => {
    setKeyboardNavigation(enabled);
    savePref(COOKIE_KEYS.keyboardNav, enabled.toString());
  };

  const resetToDefaults = () => {
    handleSetFontSize("medium");
    handleSetContrast("normal");
    handleSetReducedMotion(false);
    setScreenReader(false);
    handleSetFocusIndicator(true);
    handleSetKeyboardNavigation(true);

    Object.values(COOKIE_KEYS).forEach(removePref);
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
