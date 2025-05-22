import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
// import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        © {currentYear} {t('ui_footer_text') || 'A2 Dutch Learner. All rights reserved.'}
      </p>
    </footer>
  );
};

export default Footer;