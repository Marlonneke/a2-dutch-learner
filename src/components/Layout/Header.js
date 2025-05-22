import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageToggle from '../LanguageToggle/LanguageToggle'; // Adjust path if needed
import { useTranslation } from '../../hooks/useTranslation'; // Assuming this hook exists
// import styles from './Header.module.css'; // Optional: for Header specific styles

const Header = () => {
  const { t } = useTranslation(); // For translating navigation links

  return (
    <header className="site-header"> {/* Referencing class from App.css */}
      <div className="logo">
        <Link to="/">{t('app_title') ? t('app_title') : 'A2 Dutch Learner'}</Link> {/* Add 'app_title' to translations.json */}
      </div>
      <nav className="site-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              {t('nav_home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/lessons" className={({ isActive }) => isActive ? "active" : ""}>
              {t('nav_lessons')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/grammar" className={({ isActive }) => isActive ? "active" : ""}>
              {t('nav_grammar')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/exercises" className={({ isActive }) => isActive ? "active" : ""}>
              {t('nav_exercises')}
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="language-toggle-container"> {/* Optional: for styling wrapper if needed */}
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;