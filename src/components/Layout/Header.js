import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import { useTranslation } from '../../hooks/useTranslation';
// import styles from './Header.module.css';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="site-header">
      <div className="logo">
        <Link to="/">{t('ui_app_title') || 'A2 Dutch Learner'}</Link>
      </div>
      <nav className="site-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              {t('ui_nav_home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/lessons" className={({ isActive }) => isActive ? "active" : ""}>
              {t('ui_nav_lessons')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/grammar" className={({ isActive }) => isActive ? "active" : ""}>
              {t('ui_nav_grammar')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/exercises" className={({ isActive }) => isActive ? "active" : ""}>
              {t('ui_nav_exercises')}
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="language-toggle-container">
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;