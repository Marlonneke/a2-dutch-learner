// src/hooks/useTranslation.js
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  // Expose isLoadingTranslations if you need it in components
  return {
    t: context.t,
    setLanguage: context.setLanguage,
    currentLanguage: context.language,
    isLoadingTranslations: context.isLoadingTranslations
  };
};