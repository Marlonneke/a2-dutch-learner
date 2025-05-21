import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './LanguageToggle.module.css'; // Example using CSS Modules

const LanguageToggle = () => {
  const { setLanguage, currentLanguage } = useTranslation();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <select className={styles.toggle} value={currentLanguage} onChange={handleLanguageChange}>
      <option value="en">English</option>
      <option value="nl">Nederlands</option>
      <option value="tl">Tagalog</option>
    </select>
  );
};

export default LanguageToggle;