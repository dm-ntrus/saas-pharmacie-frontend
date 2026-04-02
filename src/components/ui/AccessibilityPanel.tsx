"use client";

import React, { useState, useEffect } from "react";
import { Settings2, X, RotateCcw } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { useAccessibility } from "./AccessibilityProvider";

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    contrast,
    reducedMotion,
    screenReader,
    focusIndicator,
    keyboardNavigation,
    setFontSize,
    setContrast,
    setReducedMotion,
    toggleScreenReader,
    setFocusIndicator,
    setKeyboardNavigation,
    resetToDefaults,
  } = useAccessibility();

  const togglePanel = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        togglePanel();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-50 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
        aria-label="Ouvrir les options d'accessibilité"
        title="Options d'accessibilité (Alt+A)"
      >
        <Settings2 className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Accessibilité
                </h2>
                <button
                  onClick={togglePanel}
                  className="p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg cursor-pointer"
                  aria-label="Fermer le panneau d'accessibilité"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                  Taille de police
                </h3>
                <div className="flex space-x-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setFontSize(size)}
                      className="flex-1"
                    >
                      {size === "small" && "Petit"}
                      {size === "medium" && "Moyen"}
                      {size === "large" && "Grand"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                  Contraste
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant={contrast === "normal" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setContrast("normal")}
                    className="flex-1"
                  >
                    Normal
                  </Button>
                  <Button
                    variant={contrast === "high" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setContrast("high")}
                    className="flex-1"
                  >
                    Élevé
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Options avancées
                </h3>

                {[
                  { label: "Mouvement réduit", checked: reducedMotion, onChange: (v: boolean) => setReducedMotion(v) },
                  { label: "Mode lecteur d'écran", checked: screenReader, onChange: () => toggleScreenReader() },
                  { label: "Indicateur de focus", checked: focusIndicator, onChange: (v: boolean) => setFocusIndicator(v) },
                  { label: "Navigation clavier", checked: keyboardNavigation, onChange: (v: boolean) => setKeyboardNavigation(v) },
                ].map(({ label, checked, onChange }) => (
                  <label key={label} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onChange(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Alt + A</kbd> : Ouvrir l&apos;accessibilité</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Tab</kbd> : Navigation</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Espace</kbd> : Activer</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Entrée</kbd> : Valider</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Échap</kbd> : Fermer</div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" size="sm" onClick={resetToDefaults} className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
                <Button variant="primary" size="sm" onClick={togglePanel} className="flex-1">
                  Fermer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
