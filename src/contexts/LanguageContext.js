import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Load translations.json
    fetch('/data/translations.json')
      .then(response => response.json())
      .then(data => {
        setTranslations(data);
      })
      .catch(error => console.error("Could not load translations:", error));
  }, []);

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback or error handling
    console.warn(`Translation key "${key}" not found for language "${language}"`);
    return key; // Return key itself as fallback
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, allTranslations: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};