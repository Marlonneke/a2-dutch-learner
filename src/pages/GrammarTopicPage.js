import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './GrammarTopicPage.module.css'; // Optional

const GrammarTopicPage = () => {
  const { topicId } = useParams(); // Gets the :topicId from the URL
  const { t } = useTranslation();
  const [topic, setTopic] = useState(null);
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
        const foundTopic = data.find(item => item.id === topicId);
        if (foundTopic) {
          setTopic(foundTopic);
        } else {
          setError(t('grammar_topic_not_found_error') || 'Grammar topic not found.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load grammar topic details:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [topicId, t]); // Add 't' as a dependency if error messages are translated

  if (loading) return <p>{t('loading') || 'Loading topic details...'}</p>;
  if (error) return <p>{t('error_loading_data') || 'Error loading topic details'}: {error}</p>;
  if (!topic) return <p>{t('grammar_topic_not_found') || 'Grammar topic not found.'}</p>; // Should be caught by setError above

  return (
    <div className="detail-page grammar-topic-detail"> {/* Reusing .detail-page class */}
      <h1>{t(topic.titleKey) || topic.id.replace('-', ' ')}</h1>

      <div className="grammar-explanation"> {/* Referencing class from App.css */}
        {/*
          For rich text explanations from JSON:
          If explanationKey content is simple text:
        */}
        <p>{t(topic.explanationKey) || 'Explanation coming soon.'}</p>
        {/*
          If explanationKey content might contain basic HTML (e.g., <br>, <strong>):
          You'd need a safe way to render this. A simple approach:
          <div dangerouslySetInnerHTML={{ __html: t(topic.explanationKey) }} />
          Be very careful with dangerouslySetInnerHTML if the source is not 100% trusted or controlled by you.
          For complex formatting, consider parsing the string into React components.
        */}
      </div>

      {topic.examples && topic.examples.length > 0 && (
        <>
          <h3>{t('example_sentences_title') || 'Examples'}</h3>
          <ul className="example-sentences"> {/* Referencing class from App.css */}
            {topic.examples.map((ex, index) => (
              <li key={index}>
                <strong>{ex.sentence}</strong>
                {ex.rule_applied_key && (
                  <span style={{ fontSize: '0.9em', color: '#555', marginLeft: '10px' }}>
                    ({t(ex.rule_applied_key) || ex.rule_applied_key}) {/* Display translated rule */}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {topic.commonMistakesKey && (
         <>
            <h3>{t('common_mistakes_title') || 'Common Mistakes'}</h3>
            <p>{t(topic.commonMistakesKey)}</p>
         </>
      )}


      <div style={{ marginTop: '30px' }}>
        <Link to={`/exercises?grammar=${topic.id}`} className="button">
          {t('practice_this_topic_button') || 'Practice this Topic'}
        </Link>
        <Link to="/grammar" style={{ marginLeft: '15px' }}>
          {t('back_to_grammar_list_button') || 'Back to Grammar List'}
        </Link>
      </div>
    </div>
  );
};

export default GrammarTopicPage;