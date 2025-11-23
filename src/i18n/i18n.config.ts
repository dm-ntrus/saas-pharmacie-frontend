export const I18N_CONFIG = {
  defaultLanguage: 'fr',
  supportedLanguages: ['fr', 'en', 'es', 'ar'],
  
  languageSettings: {
    fr: {
      name: 'Français',
      currency: 'XOF',
      timezone: 'Africa/Abidjan',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      direction: 'ltr',
      numberFormat: 'fr-FR'
    },
    en: {
      name: 'English',
      currency: 'USD',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      direction: 'ltr',
      numberFormat: 'en-US'
    },
    es: {
      name: 'Español',
      currency: 'EUR',
      timezone: 'Europe/Madrid',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      direction: 'ltr',
      numberFormat: 'es-ES'
    },
    ar: {
      name: 'العربية',
      currency: 'MAD',
      timezone: 'Africa/Casablanca',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      direction: 'rtl',
      numberFormat: 'ar-MA'
    }
  }
};