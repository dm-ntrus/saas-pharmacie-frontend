"use client"
import React, { useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Card } from './Card';
import { useAccessibility } from './AccessibilityProvider';

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

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
        aria-label="Ouvrir les options d'accessibilité"
        title="Options d'accessibilité"
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
      </button>

      {/* Panneau d'accessibilité */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* En-tête */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Accessibilité</h2>
                <button
                  onClick={togglePanel}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                  aria-label="Fermer le panneau d'accessibilité"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Taille de police */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Taille de police</h3>
                <div className="flex space-x-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFontSize(size)}
                      className="flex-1"
                    >
                      {size === 'small' && 'Petit'}
                      {size === 'medium' && 'Moyen'}
                      {size === 'large' && 'Grand'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contraste */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contraste</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={contrast === 'normal' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setContrast('normal')}
                    className="flex-1"
                  >
                    Normal
                  </Button>
                  <Button
                    variant={contrast === 'high' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setContrast('high')}
                    className="flex-1"
                  >
                    Élevé
                  </Button>
                </div>
              </div>

              {/* Options avancées */}
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900">Options avancées</h3>
                
                {/* Mouvement réduit */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Mouvement réduit</span>
                </label>

                {/* Mode lecteur d'écran */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screenReader}
                    onChange={toggleScreenReader}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Mode lecteur d&apos;écran</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Optimise l&apos;interface pour les technologies d&apos;assistance
                </p>

                {/* Indicateur de focus */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={focusIndicator}
                    onChange={(e) => setFocusIndicator(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Indicateur de focus</span>
                </label>

                {/* Navigation clavier */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keyboardNavigation}
                    onChange={(e) => setKeyboardNavigation(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Navigation clavier</span>
                </label>
              </div>

              {/* Raccourcis clavier */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Raccourcis clavier</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + A</kbd> : Ouvrir l&apos;accessibilité</div>
                  <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Tab</kbd> : Navigation</div>
                  <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Espace</kbd> : Activer</div>
                  <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Entrée</kbd> : Valider</div>
                  <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Échap</kbd> : Fermer</div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="flex-1"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={togglePanel}
                  className="flex-1"
                >
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