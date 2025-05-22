import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import GlobeIcon from '../icons/GlobeIcon'; // Assuming you created GlobeIcon.js
// import styles from './LanguageToggle.module.css'; // If you prefer CSS Modules

const LanguageToggle = () => {
  const { setLanguage, currentLanguage } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null); // Ref for the dropdown container

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'tl', name: 'Tagalog' },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const selectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="language-toggle-wrapper" ref={wrapperRef}>
      <button
        className="language-toggle-button"
        onClick={toggleDropdown}
        aria-label="Change language"
        aria-expanded={isDropdownOpen}
      >
        <GlobeIcon color="var(--white-color)" size={22} /> {/* Use color from your CSS variables */}
      </button>
      {isDropdownOpen && (
        <div className="language-dropdown">
          <ul>
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => selectLanguage(lang.code)}
                  className={currentLanguage === lang.code ? 'active' : ''}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;