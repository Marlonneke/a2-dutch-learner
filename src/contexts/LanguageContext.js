import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const translationFiles = ['ui', 'lessons', 'grammar', 'exercises'];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true); // Start true for initial load
  const [loadError, setLoadError] = useState(null);

  console.log('[LanguageContext] Initial Render/State Update:', { language, isLoadingTranslations, loadError, translationsKeys: Object.keys(translations[language] || {}).length });

  const loadTranslationsForLang = useCallback(async (lang) => {
    console.log(`[LanguageContext] loadTranslationsForLang START for: ${lang}.`);
    // Note: isLoadingTranslations is set to true by the caller (useEffect or retry button)
    setLoadError(null);

    let successfullyLoadedAnyFile = false;
    const newLoadedLangTranslations = {};

    try {
      for (const file of translationFiles) {
        const filePath = `/data/translations/${lang}/${file}.json`;
        console.log(`[LanguageContext] Fetching: ${filePath}`);
        const response = await fetch(filePath);
        console.log(`[LanguageContext] Response for ${filePath} - OK: ${response.ok}, Status: ${response.status}`);

        if (!response.ok) {
          const errorMsg = `Failed to load ${file}.json (Status: ${response.status})`;
          console.warn(`[LanguageContext] ${errorMsg} for lang ${lang}, URL: ${response.url}`);
          if (!loadError) setLoadError(errorMsg);
          continue;
        }

        const text = await response.text();
        try {
          const data = JSON.parse(text);
          Object.assign(newLoadedLangTranslations, data);
          console.log(`[LanguageContext] Successfully loaded and parsed: ${file}.json for ${lang}`);
          successfullyLoadedAnyFile = true;
        } catch (parseError) {
          const errorMsg = `Failed to parse ${file}.json`;
          console.error(`[LanguageContext] ${errorMsg} for ${lang}:`, parseError);
          console.error(`[LanguageContext] Raw text for ${file}.json:`, text.substring(0, 200) + "...");
          if (!loadError) setLoadError(errorMsg);
        }
      }

      if (successfullyLoadedAnyFile && Object.keys(newLoadedLangTranslations).length > 0) {
        console.log(`[LanguageContext] Successfully loaded some files for ${lang}. Attempting to merge.`);
        setTranslations(prev => {
          if (JSON.stringify(prev[lang]) !== JSON.stringify(newLoadedLangTranslations)) {
            console.log(`[LanguageContext] Storing new/updated translations for ${lang}.`);
            return { ...prev, [lang]: newLoadedLangTranslations };
          }
          console.log(`[LanguageContext] Translations for ${lang} are identical to current, no state change for translations.`);
          return prev;
        });
      } else if (!loadError && !successfullyLoadedAnyFile) {
        console.warn(`[LanguageContext] No new translations loaded for ${lang}, no overriding error. Existing error: ${loadError}`);
        if (!loadError) setLoadError(`No translation files loaded successfully for ${lang}. Check paths/content.`);
      }

    } catch (networkOrOtherError) {
      console.error("[LanguageContext] General error in loadTranslationsForLang:", networkOrOtherError);
      if (!loadError) setLoadError("A general network error occurred while loading translations.");
    } finally {
      console.log(`[LanguageContext] loadTranslationsForLang FINALLY for: ${lang}. Success: ${successfullyLoadedAnyFile}. Error state after try: ${loadError}`);
      setIsLoadingTranslations(false);
    }
  }, [loadError]);


  useEffect(() => {
    const currentLangHasTranslations = translations[language] && Object.keys(translations[language]).length > 0;
    console.log(`[LanguageContext] useEffect triggered. Lang: ${language}. currentLangHasTranslations: ${currentLangHasTranslations}. isLoading: ${isLoadingTranslations}. loadError: ${loadError}`);

    if (!currentLangHasTranslations && !loadError) {
        if (!isLoadingTranslations) { // Only proceed if not already marked as loading
            console.log(`[LanguageContext] useEffect: Conditions MET. Setting isLoadingTranslations to TRUE and calling loadTranslationsForLang for ${language}.`);
            setIsLoadingTranslations(true); // Set loading to true BEFORE calling async load
            loadTranslationsForLang(language);
        } else {
            // This case handles the very first render where isLoadingTranslations is initially true.
            // We want loadTranslationsForLang to run, but we don't want to call setIsLoadingTranslations(true) again if it's already true.
            console.log(`[LanguageContext] useEffect: Initial load or already loading. isLoading is already true. Calling loadTranslationsForLang for ${language}.`);
            loadTranslationsForLang(language);
        }
    } else if (currentLangHasTranslations && isLoadingTranslations && !loadError) {
        console.log(`[LanguageContext] useEffect: Translations for ${language} exist AND isLoading is true (and no error). Correcting isLoading to false.`);
        setIsLoadingTranslations(false);
    } else if (loadError && isLoadingTranslations) {
        console.log(`[LanguageContext] useEffect: An error exists (${loadError}). Ensuring isLoading is false.`);
        setIsLoadingTranslations(false);
    } else {
        console.log(`[LanguageContext] useEffect: No action needed. Status: Loaded=${currentLangHasTranslations}, Loading=${isLoadingTranslations}, Error=${loadError}`);
    }
  }, [language, translations, isLoadingTranslations, loadTranslationsForLang, loadError]);


  const switchLanguage = useCallback((newLang) => {
    if (language !== newLang) {
        console.log(`[LanguageContext] Switching language from ${language} to ${newLang}`);
        setIsLoadingTranslations(true); // Indicate new loading process
        setLoadError(null);             // Clear any previous errors
        setLanguage(newLang);         // This change will trigger the useEffect
    }
  }, [language]); // Dependencies are correct, setters from useState are stable


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
          <p>Please check browser console (F12 {'->'} Console) for more detailed '[LanguageContext]' messages.</p>
          <button onClick={() => { setIsLoadingTranslations(true); setLoadError(null); loadTranslationsForLang(language); }}>Retry Loading</button>
      </div>
    );
  }

  // This condition must be true to show "Loading..."
  // 1. isLoadingTranslations is true
  // 2. We DON'T have translations for the current language yet
  // 3. There is NO overriding loadError
  if (isLoadingTranslations && (!translations[language] || Object.keys(translations[language] || {}).length === 0) && !loadError) {
      console.log("[LanguageContext] RENDERING: Loading translations for", language)
      return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em' }}>
               Loading translations for {language}...
             </div>;
  }

  // If it's not loading, and not errored (or translations exist despite error), render children
  console.log("[LanguageContext] RENDERING: Children or main content")
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