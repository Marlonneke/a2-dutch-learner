// src/contexts/LanguageContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const translationFiles = ['ui', 'lessons', 'grammar', 'exercises'];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadTranslationsForLang = useCallback(async (lang) => {
    console.log(`[LanguageContext] Attempting to load translations for: ${lang}`);
    setIsLoadingTranslations(true);
    setLoadError(null);
    let successfullyLoadedSomething = false;
    const loadedLangTranslations = {};

    try {
      for (const file of translationFiles) {
        const filePath = `/data/translations/${lang}/${file}.json`;
        console.log(`[LanguageContext] Fetching: ${filePath}`);
        const response = await fetch(filePath);

        if (!response.ok) {
          console.warn(`[LanguageContext] Could not load ${file}.json for lang ${lang}. Status: ${response.status}, URL: ${response.url}`);
          if (!loadError) setLoadError(`Failed to load ${file}.json (Status: ${response.status})`);
          continue;
        }

        const text = await response.text();
        try {
          const data = JSON.parse(text);
          Object.assign(loadedLangTranslations, data);
          console.log(`[LanguageContext] Successfully loaded and parsed: ${file}.json for ${lang}`);
          successfullyLoadedSomething = true;
        } catch (parseError) {
          console.error(`[LanguageContext] Error parsing ${file}.json for ${lang}:`, parseError);
          console.error(`[LanguageContext] Raw text received for ${file}.json:`, text.substring(0, 500) + "...");
          if (!loadError) setLoadError(`Failed to parse ${file}.json`);
        }
      }

      if (successfullyLoadedSomething && Object.keys(loadedLangTranslations).length > 0) {
        setTranslations(prev => ({ ...prev, [lang]: loadedLangTranslations }));
        console.log(`[LanguageContext] All translations stored for ${lang}.`);
      } else if (!loadError && !successfullyLoadedSomething) {
        console.warn(`[LanguageContext] No new translations were loaded for ${lang}, and no specific fetch/parse error was set for this attempt.`);
        // Avoid setting a generic error if individual file load errors were already set.
      }

    } catch (error) {
      console.error("[LanguageContext] General error in loadTranslationsForLang:", error);
      setLoadError("A general network error occurred while loading translations.");
    } finally {
      setIsLoadingTranslations(false);
      console.log(`[LanguageContext] Finished loading attempt for ${lang}. isLoading: false. Error state: ${loadError}`);
    }
  }, [loadError]); // Only re-create this function if loadError changes (for retries)

  useEffect(() => {
    // Only load if translations for the current language are not present or empty
    if (!translations[language] || Object.keys(translations[language]).length === 0) {
      loadTranslationsForLang(language);
    } else {
        // Translations already exist, ensure loading state is false if it was true.
        if (isLoadingTranslations) setIsLoadingTranslations(false);
    }
  }, [language, loadTranslationsForLang, translations, isLoadingTranslations]);


  const switchLanguage = useCallback((newLang) => {
    if (language !== newLang) {
        console.log(`[LanguageContext] Switching language from ${language} to ${newLang}`);
        setTranslations(prev => ({...prev, [newLang]: prev[newLang] || {}})); // Ensure new lang obj exists
        setLanguage(newLang);
        // useEffect above will handle loading if newLang's translations aren't populated
    }
  }, [language]);

  const t = useCallback((key) => {
    const currentLangTranslations = translations[language] || {};

    if (isLoadingTranslations && Object.keys(currentLangTranslations).length === 0) {
        return `loading_${key}...`;
    }
    if (loadError && Object.keys(currentLangTranslations).length === 0 ) {
        return `err_loading_${key}`;
    }

    if (currentLangTranslations[key] !== undefined) {
      return currentLangTranslations[key];
    }
    console.warn(`[LanguageContext] Translation key "${key}" not found for language "${language}"`);
    return key;
  }, [language, translations, isLoadingTranslations, loadError]);


  if (loadError && (!translations[language] || Object.keys(translations[language] || {}).length === 0)) {
      return (
        <div style={{ padding: '20px', backgroundColor: 'lightcoral', color: 'black', border: '2px solid red', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }}>
            <h2>Translation Loading Error</h2>
            <p>Could not load translation files for language: '{language}'. Console has details.</p>
            <p>Error: {loadError}</p>
            <button onClick={() => { setLoadError(null); setIsLoadingTranslations(true); loadTranslationsForLang(language);}}>Retry Loading Translations</button>
        </div>
      );
  }

  if (isLoadingTranslations && (!translations[language] || Object.keys(translations[language] || {}).length === 0) && !loadError) {
      return <div style={{ padding: '20px', textAlign: 'center'}}>Loading application translations for '{language}'...</div>;
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: switchLanguage,
      t,
      isLoadingTranslations,
      loadError
    }}>
      {children}
    </LanguageContext.Provider>
  );
};