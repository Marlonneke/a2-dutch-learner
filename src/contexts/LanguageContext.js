import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const translationFiles = ['ui', 'lessons', 'grammar', 'exercises'];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadTranslationsForLang = useCallback(async (lang) => {
    setIsLoadingTranslations(true);
    setLoadError(null);
    let successfullyLoadedSomething = false;
    const loadedLangTranslations = {};

    try {
      for (const file of translationFiles) {
        const filePath = `/data/translations/${lang}/${file}.json`;
        const response = await fetch(filePath);

        if (!response.ok) {
          if (!loadError) setLoadError(`Failed to load ${file}.json (Status: ${response.status})`);
          continue;
        }

        const text = await response.text();
        try {
          const data = JSON.parse(text);
          Object.assign(loadedLangTranslations, data);
          successfullyLoadedSomething = true;
        } catch (parseError) {
          if (!loadError) setLoadError(`Failed to parse ${file}.json`);
        }
      }

      if (successfullyLoadedSomething && Object.keys(loadedLangTranslations).length > 0) {
        setTranslations(prev => {
          if (JSON.stringify(prev[lang]) !== JSON.stringify(loadedLangTranslations)) {
            return { ...prev, [lang]: loadedLangTranslations };
          }
          return prev;
        });
      } else if (!loadError && !successfullyLoadedSomething) {
         // Do not set an error here if individual file load errors might have been set
      }

    } catch (error) {
      setLoadError("A general network error occurred.");
    } finally {
      setIsLoadingTranslations(false);
    }
  }, [loadError]);

  useEffect(() => {
    if ((!translations[language] || Object.keys(translations[language] || {}).length === 0) && !isLoadingTranslations) {
      loadTranslationsForLang(language);
    } else if (translations[language] && Object.keys(translations[language] || {}).length > 0 && isLoadingTranslations) {
      setIsLoadingTranslations(false);
    }
  }, [language, translations, isLoadingTranslations, loadTranslationsForLang]);

  const switchLanguage = useCallback((newLang) => {
    if (language !== newLang) {
        setLanguage(newLang);
    }
  }, [language]);

  const t = useCallback((key) => {
    const currentLangTranslations = translations[language] || {};

    if (loadError && Object.keys(currentLangTranslations).length === 0) {
      return `err_loading_${key}`;
    }
    if (isLoadingTranslations && Object.keys(currentLangTranslations).length === 0) {
        return `loading_${key}...`;
    }

    if (currentLangTranslations[key] !== undefined) {
      return currentLangTranslations[key];
    }
    console.warn(`[LanguageContext] Key_Not_Found: "${key}" for lang "${language}"`);
    return key;
  }, [language, translations, isLoadingTranslations, loadError]);

  if (loadError && (!translations[language] || Object.keys(translations[language] || {}).length === 0)) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'lightcoral', color: 'black', border: '2px solid red', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999, textAlign: 'center' }}>
          <h2>Translation Loading Error!</h2>
          <p>Details: {loadError}</p>
          <p>Please check browser console (F12 -> Console) for '[LanguageContext]' messages about which file failed.</p>
          <button onClick={() => { setIsLoadingTranslations(true); setLoadError(null); loadTranslationsForLang(language);}}>Retry Loading</button>
      </div>
    );
  }

  if (isLoadingTranslations && (!translations[language] || Object.keys(translations[language] || {}).length === 0) && !loadError) {
      // Corrected line below:
      return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em' }}>{`Loading translations for '${language}'...`}</div>;
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