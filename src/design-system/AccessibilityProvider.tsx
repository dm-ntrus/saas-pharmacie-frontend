"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Helper functions for cookies
const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};

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
  undefined
);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [contrast, setContrast] = useState<"normal" | "high">("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(true);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);

  // Load preferences from cookies or localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookieFont = (getCookie("accessibility-font-size") as
      | "small"
      | "medium"
      | "large") || localStorage.getItem("accessibility-font-size");
    const cookieContrast = (getCookie("accessibility-contrast") as
      | "normal"
      | "high") || localStorage.getItem("accessibility-contrast");
    const cookieReducedMotion =
      getCookie("accessibility-reduced-motion") === "true" ||
      localStorage.getItem("accessibility-reduced-motion") === "true";
    const cookieScreenReader =
      getCookie("accessibility-screen-reader") === "true" ||
      localStorage.getItem("accessibility-screen-reader") === "true";
    const cookieFocusIndicator =
      getCookie("accessibility-focus-indicator") !== "false" &&
      localStorage.getItem("accessibility-focus-indicator") !== "false";
    const cookieKeyboardNavigation =
      getCookie("accessibility-keyboard-navigation") !== "false" &&
      localStorage.getItem("accessibility-keyboard-navigation") !== "false";

    if (cookieFont) setFontSize(cookieFont as any);
    if (cookieContrast) setContrast(cookieContrast as any);
    setReducedMotion(!!cookieReducedMotion);
    setScreenReader(!!cookieScreenReader);
    setFocusIndicator(!!cookieFocusIndicator);
    setKeyboardNavigation(!!cookieKeyboardNavigation);

    // Detect system preferences
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const prefersHighContrast = window.matchMedia(
        "(prefers-contrast: high)"
      ).matches;

      if (prefersReducedMotion && !cookieReducedMotion) setReducedMotion(true);
      if (prefersHighContrast && !cookieContrast) setContrast("high");
    }
  }, []);

  // Apply CSS classes
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.className = root.className.replace(/font-(small|medium|large)/g, "");
    root.classList.add(`font-${fontSize}`);

    // Contrast
    root.className = root.className.replace(/contrast-(normal|high)/g, "");
    root.classList.add(`contrast-${contrast}`);

    // Reduced motion
    if (reducedMotion) root.classList.add("reduced-motion");
    else root.classList.remove("reduced-motion");

    // Screen reader
    if (screenReader) root.classList.add("screen-reader-active");
    else root.classList.remove("screen-reader-active");

    // Focus indicator
    if (focusIndicator) root.classList.add("focus-indicator-active");
    else root.classList.remove("focus-indicator-active");

    // Keyboard navigation
    if (keyboardNavigation)
      root.classList.add("keyboard-navigation-active");
    else root.classList.remove("keyboard-navigation-active");
  }, [
    fontSize,
    contrast,
    reducedMotion,
    screenReader,
    focusIndicator,
    keyboardNavigation,
  ]);

  // Handlers with cookie & localStorage sync
  const handleSetFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    if (typeof window !== "undefined") {
      setCookie("accessibility-font-size", size);
      localStorage.setItem("accessibility-font-size", size);
    }
  };

  const handleSetContrast = (newContrast: "normal" | "high") => {
    setContrast(newContrast);
    if (typeof window !== "undefined") {
      setCookie("accessibility-contrast", newContrast);
      localStorage.setItem("accessibility-contrast", newContrast);
    }
  };

  const handleSetReducedMotion = (reduced: boolean) => {
    setReducedMotion(reduced);
    if (typeof window !== "undefined") {
      setCookie("accessibility-reduced-motion", reduced.toString());
      localStorage.setItem("accessibility-reduced-motion", reduced.toString());
    }
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    if (typeof window !== "undefined") {
      setCookie("accessibility-screen-reader", newValue.toString());
      localStorage.setItem("accessibility-screen-reader", newValue.toString());
    }
  };

  const handleSetFocusIndicator = (enabled: boolean) => {
    setFocusIndicator(enabled);
    if (typeof window !== "undefined") {
      setCookie("accessibility-focus-indicator", enabled.toString());
      localStorage.setItem("accessibility-focus-indicator", enabled.toString());
    }
  };

  const handleSetKeyboardNavigation = (enabled: boolean) => {
    setKeyboardNavigation(enabled);
    if (typeof window !== "undefined") {
      setCookie("accessibility-keyboard-navigation", enabled.toString());
      localStorage.setItem("accessibility-keyboard-navigation", enabled.toString());
    }
  };

  const resetToDefaults = () => {
    handleSetFontSize("medium");
    handleSetContrast("normal");
    handleSetReducedMotion(false);
    setScreenReader(false);
    handleSetFocusIndicator(true);
    handleSetKeyboardNavigation(true);

    if (typeof window !== "undefined") {
      removeCookie("accessibility-font-size");
      removeCookie("accessibility-contrast");
      removeCookie("accessibility-reduced-motion");
      removeCookie("accessibility-screen-reader");
      removeCookie("accessibility-focus-indicator");
      removeCookie("accessibility-keyboard-navigation");

      localStorage.removeItem("accessibility-font-size");
      localStorage.removeItem("accessibility-contrast");
      localStorage.removeItem("accessibility-reduced-motion");
      localStorage.removeItem("accessibility-screen-reader");
      localStorage.removeItem("accessibility-focus-indicator");
      localStorage.removeItem("accessibility-keyboard-navigation");
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
