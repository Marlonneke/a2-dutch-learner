import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page-container">
      <h1>{t('ui_home_welcome_title') || 'Welcome to A2 Dutch Learner!'}</h1>
      <p>
        {t('ui_home_welcome_message') || 'Start your journey to mastering A2 level Dutch...'}
      </p>

      <div className="home-navigation-links" style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/lessons" className="button">
          {t('ui_nav_lessons')}
        </Link>
        <Link to="/grammar" className="button">
          {t('ui_nav_grammar')}
        </Link>
        <Link to="/exercises" className="button">
          {t('ui_nav_exercises')}
        </Link>
      </div>

      <section style={{ marginTop: '40px', textAlign: 'left' }}>
        <h2>{t('ui_home_why_choose_us_title') || 'Why Choose Us?'}</h2>
        <ul>
          <li>{t('ui_home_feature_1') || 'Structured lessons...'}</li>
          <li>{t('ui_home_feature_2') || 'Detailed grammar explanations...'}</li>
          <li>{t('ui_home_feature_3') || 'A wide variety of exercises...'}</li>
          <li>{t('ui_home_feature_4') || 'Content available in English, Dutch, and Tagalog.'}</li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;