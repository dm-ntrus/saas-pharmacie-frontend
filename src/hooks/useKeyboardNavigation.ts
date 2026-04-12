import { useEffect, useCallback } from 'react';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export const useKeyboardNavigation = () => {
  const { keyboardNavigation } = useAccessibility();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!keyboardNavigation) return;

    // Raccourci pour ouvrir le panneau d'accessibilité
    if (event.altKey && event.key === 'a') {
      event.preventDefault();
      // Déclencher l'ouverture du panneau d'accessibilité
      const accessibilityButton = document.querySelector('[aria-label="Ouvrir les options d\'accessibilité"]') as HTMLButtonElement;
      if (accessibilityButton) {
        accessibilityButton.click();
      }
    }

    // Navigation par tabulation améliorée
    if (event.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    // Navigation par flèches dans les listes
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const target = event.target as HTMLElement;
      const listItem = target.closest('li, [role="listitem"]');
      
      if (listItem) {
        event.preventDefault();
        const list = listItem.parentElement;
        const items = Array.from(list?.children || []);
        const currentIndex = items.indexOf(listItem);
        
        let nextIndex = currentIndex;
        
        switch (event.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            break;
        }
        
        const nextItem = items[nextIndex] as HTMLElement;
        const focusableElement = nextItem.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (focusableElement) {
          focusableElement.focus();
        }
      }
    }

    // Fermeture des modales avec Échap
    if (event.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modal) {
        const closeButton = modal.querySelector('[aria-label*="Fermer"], [aria-label*="Close"]') as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }
  }, [keyboardNavigation]);

  useEffect(() => {
    if (keyboardNavigation) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [keyboardNavigation, handleKeyDown]);

  return {
    keyboardNavigation,
  };
}; 