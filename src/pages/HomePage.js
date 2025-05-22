import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// You might want to create a CSS module for specific HomePage styles
// import styles from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page-container"> {/* You can add specific styles later */}
      <h1>{t('home_welcome_title') || 'Welcome to A2 Dutch Learner!'}</h1>
      <p>
        {t('home_welcome_message') || 'Start your journey to mastering A2 level Dutch with our comprehensive lessons, grammar explanations, and practice exercises.'}
      </p>

      <div className="home-navigation-links" style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/lessons" className="button">
          {t('nav_lessons')}
        </Link>
        <Link to="/grammar" className="button">
          {t('nav_grammar')}
        </Link>
        <Link to="/exercises" className="button">
          {t('nav_exercises')}
        </Link>
      </div>

      <section style={{ marginTop: '40px', textAlign: 'left' }}>
        <h2>{t('home_why_choose_us_title') || 'Why Choose Us?'}</h2>
        <ul>
          <li>{t('home_feature_1') || 'Structured lessons for A2 level.'}</li>
          <li>{t('home_feature_2') || 'Detailed grammar explanations with examples.'}</li>
          <li>{t('home_feature_3') || 'A wide variety of random exercises and quizzes.'}</li>
          <li>{t('home_feature_4') || 'Content available in English, Dutch, and Tagalog.'}</li>
        </ul>
      </section>

      {/* You can add more sections: how it works, testimonials, call to action etc. */}
    </div>
  );
};

export default HomePage;