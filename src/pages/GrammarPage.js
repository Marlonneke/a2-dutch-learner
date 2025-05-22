import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const GrammarPage = () => {
  const { t, isLoadingTranslations } = useTranslation();
  const [grammarTopicsByDifficulty, setGrammarTopicsByDifficulty] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

const difficultyOrder = ['ui_difficulty_easy', 'ui_difficulty_medium', 'ui_difficulty_hard'];

  useEffect(() => {
    setLoadingData(true);
    fetch('/data/grammar_content.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const grouped = data.reduce((acc, topic) => {
          const difficulty = topic.difficulty || 'difficulty_medium'; // Default if undefined
          if (!acc[difficulty]) {
            acc[difficulty] = [];
          }
          acc[difficulty].push(topic);
          return acc;
        }, {});
        setGrammarTopicsByDifficulty(grouped);
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load grammar content:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, []);

  if (isLoadingTranslations && Object.keys(grammarTopicsByDifficulty).length === 0) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading grammar topics...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading grammar topics'}: {error}</p>;

  return (
    <div>
      <h1>{t('ui_page_title_grammar') || 'Dutch Grammar A2'}</h1>
      <p>{t('ui_grammar_page_intro') || 'Explore various Dutch grammar topics, grouped by difficulty.'}</p>

      {difficultyOrder.map(difficultyKey => (
        grammarTopicsByDifficulty[difficultyKey] && grammarTopicsByDifficulty[difficultyKey].length > 0 && (
          <section key={difficultyKey} className="difficulty-group" style={{ marginBottom: '40px' }}>
            <h2>{t(difficultyKey) || difficultyKey.split('_')[1]}</h2>
            <div className="list-container">
              {grammarTopicsByDifficulty[difficultyKey].map(topic => (
                <div key={topic.id} className="card">
                  <h3>{t(topic.titleKey) || topic.id}</h3>
                  <Link to={`/grammar/${topic.id}`} className="button">
                    {t('ui_view_topic_button') || 'View Topic'}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )
      ))}

      {Object.keys(grammarTopicsByDifficulty).length === 0 && !loadingData && (
        <p>{t('ui_no_grammar_topics_found') || 'No grammar topics found.'}</p>
      )}
    </div>
  );
};

export default GrammarPage;