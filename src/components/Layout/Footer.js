import React from 'react';
import { useTranslation } from '../../hooks/useTranslation'; // Assuming this hook exists
// import styles from './Footer.module.css'; // Optional: for Footer specific styles

const Footer = () => {
  const { t } = useTranslation(); // For translating footer text
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer"> {/* Referencing class from App.css */}
      <p>
        © {currentYear} {t('footer_text') ? t('footer_text') : 'A2 Dutch Learner. All rights reserved.'}
        {/* Add 'footer_text' to translations.json */}
      </p>
      {/* You can add more links or info here */}
    </footer>
  );
};

export default Footer;