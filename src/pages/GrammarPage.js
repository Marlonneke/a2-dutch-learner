import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './GrammarPage.module.css'; // Optional for specific styles

const GrammarPage = () => {
  const { t } = useTranslation();
  const [grammarTopics, setGrammarTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/grammar.json') // Make sure grammar.json is in public/data/
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setGrammarTopics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load grammar topics:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>{t('loading') || 'Loading grammar topics...'}</p>;
  if (error) return <p>{t('error_loading_data') || 'Error loading grammar topics'}: {error}</p>;

  return (
    <div>
      <h1>{t('page_title_grammar') || 'Dutch Grammar'}</h1>
      <p>{t('grammar_page_intro') || 'Explore various Dutch grammar topics. Click on a topic to learn more.'}</p>
      {grammarTopics.length > 0 ? (
        <div className="list-container"> {/* Reusing class from App.css for card layout */}
          {grammarTopics.map(topic => (
            <div key={topic.id} className="card"> {/* Reusing card style from App.css */}
              <h2>{t(topic.titleKey) || topic.id.replace('-', ' ')}</h2> {/* Fallback to id if key not found */}
              {/* You could add a short description from topic.explanationKey (truncated) here */}
              <Link to={`/grammar/${topic.id}`} className="button">
                {t('view_topic_button') || 'View Topic'}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('no_grammar_topics_found') || 'No grammar topics found.'}</p>
      )}
    </div>
  );
};

export default GrammarPage;