import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const translationFiles = ['ui', 'lessons', 'grammar', 'exercises']; // Define your namespaces

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({}); // This will hold all loaded translations by language
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  const loadTranslationsForLang = useCallback(async (lang) => {
    setIsLoadingTranslations(true);
    try {
      const loadedLangTranslations = {};
      for (const file of translationFiles) {
        const response = await fetch(`/data/translations/${lang}/${file}.json`);
        if (!response.ok) {
          console.warn(`Could not load ${file}.json for language ${lang}`);
          continue; // Skip this file or handle error more gracefully
        }
        const data = await response.json();
        Object.assign(loadedLangTranslations, data); // Merge translations from this file
      }
      setTranslations(prev => ({ ...prev, [lang]: loadedLangTranslations }));
    } catch (error) {
      console.error("Error loading translations:", error);
    } finally {
      setIsLoadingTranslations(false);
    }
  }, []);

  useEffect(() => {
    // Load initial language
    if (!translations[language]) { // Only load if not already loaded
        loadTranslationsForLang(language);
    }
  }, [language, loadTranslationsForLang, translations]);

  // Function to switch language and load if necessary
  const switchLanguage = useCallback((newLang) => {
    setLanguage(newLang);
    if (!translations[newLang]) {
        loadTranslationsForLang(newLang);
    }
  }, [loadTranslationsForLang, translations]);

  const t = useCallback((key) => {
    if (isLoadingTranslations) {
        // Optionally return a loading string or the key itself
        return `loading_key_${key}...`;
    }
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    console.warn(`Translation key "${key}" not found for language "${language}"`);
    return key; // Fallback
  }, [language, translations, isLoadingTranslations]);

  if (isLoadingTranslations && !translations[language]) {
      return <div>Loading application translations...</div>; // Or a global spinner
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: switchLanguage, // Use the new switchLanguage function
      t,
      isLoadingTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};