import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './GrammarPage.module.css';

const GrammarPage = () => {
  const { t, isLoadingTranslations } = useTranslation();
  const [grammarTopics, setGrammarTopics] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingData(true);
    fetch('/data/grammar_content.json') // Assuming your content file is named this
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setGrammarTopics(data);
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load grammar topics:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, []);

  if (isLoadingTranslations && !grammarTopics.length) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading grammar topics...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading grammar topics'}: {error}</p>;

  return (
    <div>
      <h1>{t('ui_page_title_grammar') || 'Dutch Grammar'}</h1>
      <p>{t('ui_grammar_page_intro') || 'Explore various Dutch grammar topics.'}</p>
      {grammarTopics.length > 0 ? (
        <div className="list-container">
          {grammarTopics.map(topic => (
            <div key={topic.id} className="card">
              <h2>{t(topic.titleKey) || topic.id}</h2>
              <Link to={`/grammar/${topic.id}`} className="button">
                {t('ui_view_topic_button') || 'View Topic'}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('ui_no_grammar_topics_found') || 'No grammar topics found.'}</p>
      )}
    </div>
  );
};

export default GrammarPage;