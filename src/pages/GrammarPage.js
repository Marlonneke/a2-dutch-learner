import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate
import { useTranslation } from '../hooks/useTranslation';
import AccordionItem from '../components/common/AccordionItem';

const GrammarPage = () => {
  const { t, isLoadingTranslations } = useTranslation();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [allGrammarTopics, setAllGrammarTopics] = useState([]);
  const [grammarTopicsByDifficulty, setGrammarTopicsByDifficulty] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

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
        setAllGrammarTopics(data);
        if (data.length > 0 && difficultyOrder.length > 0) {
            const firstGroupWithTopics = difficultyOrder.find(dKey => 
                data.some(topic => (topic.difficulty || 'ui_difficulty_medium') === dKey)
            );
            if (firstGroupWithTopics) {
                setActiveAccordion(firstGroupWithTopics);
            }
        }
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load grammar content:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, []);

  useEffect(() => {
    if (loadingData || isLoadingTranslations || allGrammarTopics.length === 0) return;

    const grouped = allGrammarTopics.reduce((acc, topic) => {
      const difficulty = topic.difficulty || 'ui_difficulty_medium';
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(topic);
      return acc;
    }, {});
    setGrammarTopicsByDifficulty(grouped);
  }, [allGrammarTopics, loadingData, isLoadingTranslations]);

  const toggleAccordion = (difficultyKey) => {
    setActiveAccordion(prevKey => (prevKey === difficultyKey ? null : difficultyKey));
  };

  const handleCardClick = (topicId) => {
    navigate(`/grammar/${topicId}`);
  };

  if (isLoadingTranslations && allGrammarTopics.length === 0) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading grammar topics...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading grammar topics'}: {error}</p>;
  
  const hasAnyTopicsToShow = Object.values(grammarTopicsByDifficulty).some(group => group && group.length > 0);

  return (
    <div>
      <h1>{t('ui_page_title_grammar') || 'Dutch Grammar A2'}</h1>
      <p>{t('ui_grammar_page_intro') || 'Explore various Dutch grammar topics, grouped by difficulty.'}</p>

      <div className="difficulty-groups-accordion">
        {difficultyOrder.map(difficultyKey => {
          const topicsInGroup = grammarTopicsByDifficulty[difficultyKey] || [];
           if (topicsInGroup.length === 0 && allGrammarTopics.length > 0) {
            return null;
          }

          return (
            <AccordionItem
              key={difficultyKey}
              title={t(difficultyKey) || difficultyKey.split('_').pop()}
              isOpen={activeAccordion === difficultyKey}
              onToggle={() => toggleAccordion(difficultyKey)}
              headerElementType="h2"
            >
              {topicsInGroup.length > 0 ? (
                <div className="list-container grammar-grid">
                  {topicsInGroup.map(topic => (
                    <div 
                      key={topic.id} 
                      className="card enhanced-grammar-card clickable-card" // Added clickable-card
                      onClick={() => handleCardClick(topic.id)}
                      role="link"
                      tabIndex={0}
                      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(topic.id); }}
                    >
                      {/* No cover image for grammar topics assumed for now */}
                      <div className="card-content">
                        <h3>{t(topic.titleKey) || topic.id}</h3>
                        <p className="card-snippet">
                           {(t(topic.explanationKey) || 'Brief description...').substring(0,80) + '...'}
                        </p>
                        {/* Button removed */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-items-message">{t('ui_no_grammar_topics_in_difficulty') || 'No grammar topics currently in this difficulty level.'}</p>
              )}
            </AccordionItem>
          );
        })}
      </div>

       {!loadingData && !hasAnyTopicsToShow && (
         <p className="no-items-message">{t('ui_no_grammar_topics_found') || 'No grammar topics found.'}</p>
      )}
    </div>
  );
};

export default GrammarPage;