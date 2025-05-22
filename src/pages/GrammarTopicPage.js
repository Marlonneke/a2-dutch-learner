import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './GrammarTopicPage.module.css';

const GrammarTopicPage = () => {
  const { topicId } = useParams();
  const { t, isLoadingTranslations } = useTranslation();
  const [topic, setTopic] = useState(null);
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
        const foundTopic = data.find(item => item.id === topicId);
        if (foundTopic) {
          setTopic(foundTopic);
        } else {
          setError(t('ui_grammar_topic_not_found_error') || 'Grammar topic not found.');
        }
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load grammar topic details:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, [topicId, t]); // t added as dependency

  if (isLoadingTranslations && !topic) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading topic details...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading topic details'}: {error}</p>;
  if (!topic) return <p>{t('ui_grammar_topic_not_found') || 'Grammar topic not found.'}</p>;

  return (
    <div className="detail-page grammar-topic-detail">
      <h1>{t(topic.titleKey) || topic.id}</h1>

      <div className="grammar-explanation">
        <h3>{t('ui_explanation_title') || 'Explanation'}</h3>
        <p>{t(topic.explanationKey) || 'Explanation coming soon.'}</p>
      </div>

      {topic.rules && topic.rules.length > 0 && (
        <>
          <h3>{t('ui_rules_summary_title') || 'Rules'}</h3>
          <ul>
            {topic.rules.map((rule, index) => (
              <li key={index}>
                <strong>{t(rule.ruleKey)}:</strong> {rule.exampleDutch}
                {rule.exampleHintKey && <span> ({t(rule.exampleHintKey)})</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Logic for rendering tables if present in topic.tables */}
      {topic.tables && topic.tables.length > 0 && topic.tables.map((tableData, tIndex) => (
          <div key={tIndex} className="grammar-table-container">
              <h4>{t(tableData.titleKey) || 'Table'}</h4>
              <table>
                  <thead>
                      <tr>
                          {tableData.headers.map((header, hIndex) => (
                              <th key={hIndex}>{header}</th> /* Assuming headers are direct text or already translated if they were keys */
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {tableData.rows.map((row, rIndex) => (
                          <tr key={rIndex}>
                              {row.map((cell, cIndex) => (
                                  <td key={cIndex}>{cell}</td> /* Assuming cell data is direct text */
                              ))}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      ))}


      {topic.exampleSentences && topic.exampleSentences.length > 0 && (
        <>
          <h3>{t('ui_example_sentences_title') || 'Example Sentences'}</h3>
          <ul className="example-sentences">
            {topic.exampleSentences.map((ex, index) => (
              <li key={index}>
                <strong>{ex.dutch}</strong>
                {ex.englishHint && <span> ({ex.englishHint})</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {topic.commonMistakes && Array.isArray(topic.commonMistakes) && topic.commonMistakes.length > 0 && (
        <>
            <h3>{t('ui_common_mistakes_title') || 'Common Mistakes'}</h3>
            <ul>
                {topic.commonMistakes.map((mistake, index) => (
                    <li key={index}>
                        <p><strong>{t('ui_mistake_label') || 'Mistake'}:</strong> {t(mistake.mistakeKey)}</p>
                        <p><strong>{t('ui_correction_label') || 'Correction/Note'}:</strong> {t(mistake.correctionKey)}</p>
                    </li>
                ))}
            </ul>
        </>
      )}
      {/* Legacy commonMistakesKey handling for simplicity if needed */}
      {!Array.isArray(topic.commonMistakes) && topic.commonMistakesKey && (
         <>
            <h3>{t('ui_common_mistakes_title') || 'Common Mistakes'}</h3>
            <p>{t(topic.commonMistakesKey)}</p>
         </>
      )}


      {topic.notesKey && (
          <>
            <h3>{t('ui_notes_title') || 'Additional Notes'}</h3>
            <p>{t(topic.notesKey)}</p>
          </>
      )}


      <div style={{ marginTop: '30px' }}>
        <Link to={`/exercises?grammar=${topic.id}`} className="button">
          {t('ui_practice_this_topic_button') || 'Practice this Topic'}
        </Link>
        <Link to="/grammar" style={{ marginLeft: '15px' }}>
          {t('ui_back_to_grammar_list_button') || 'Back to Grammar List'}
        </Link>
      </div>
    </div>
  );
};

export default GrammarTopicPage;