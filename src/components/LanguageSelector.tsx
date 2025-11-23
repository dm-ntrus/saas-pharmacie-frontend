import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { I18N_CONFIG } from '@/i18n/i18n.config';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();
  
  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value)}
      className="language-selector"
    >
      {I18N_CONFIG.supportedLanguages.map(lang => (
        <option key={lang} value={lang}>
          {I18N_CONFIG.languageSettings[lang].name}
        </option>
      ))}
    </select>
  );
};