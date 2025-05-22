import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import AccordionItem from '../components/common/AccordionItem';

const LessonsPage = () => {
  const { t, isLoadingTranslations } = useTranslation();
  const navigate = useNavigate();
  const [lessonManifest, setLessonManifest] = useState([]); // Stores the fetched manifest
  // lessonsByDifficulty will be derived using useMemo, no longer a separate state
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const difficultyOrder = ['ui_difficulty_easy', 'ui_difficulty_medium', 'ui_difficulty_hard'];

  // Effect for fetching the lesson manifest
  useEffect(() => {
    setLoadingData(true);
    fetch('/data/lessons_manifest.json') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - Could not load lessons manifest.`);
        }
        return response.json();
      })
      .then(data => {
        setLessonManifest(data); 
        if (data.length > 0 && difficultyOrder.length > 0) {
             const firstGroupWithLessons = difficultyOrder.find(dKey => 
                data.some(lesson => (lesson.difficulty || 'ui_difficulty_medium') === dKey)
             );
             if (firstGroupWithLessons) {
                setActiveAccordion(firstGroupWithLessons);
             }
        }
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load lessons_manifest.json:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, []); // Empty dependency array: runs once on mount


  // Derive lessonsByDifficulty using useMemo
  const lessonsByDifficulty = useMemo(() => {
    if (loadingData || isLoadingTranslations || lessonManifest.length === 0) {
      return {}; // Return empty if still loading or no manifest data
    }
    // console.log("[LessonsPage] Recalculating grouped lessons via useMemo."); // For debugging

    return lessonManifest.reduce((acc, lessonSummary) => {
      const difficulty = lessonSummary.difficulty || 'ui_difficulty_medium';
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(lessonSummary);
      return acc;
    }, {});
  }, [lessonManifest, loadingData, isLoadingTranslations]); // Dependencies for useMemo


  const toggleAccordion = (difficultyKey) => {
    setActiveAccordion(prevKey => (prevKey === difficultyKey ? null : difficultyKey));
  };

  const handleCardClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  // Conditional rendering for loading/error states
  if (isLoadingTranslations && lessonManifest.length === 0 && !error) return <p className="loading-message">{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData && !error) return <p className="loading-message">{t('ui_loading') || 'Loading lessons list...'}</p>;
  if (error) return <p className="error-message">{t('ui_error_loading_data') || 'Error loading lessons list'}: {error}</p>;

  const hasAnyLessonsToShow = Object.values(lessonsByDifficulty).some(group => group && group.length > 0);

  return (
    <div>
      <h1 className="page-main-title">{t('ui_page_title_lessons') || 'Dutch Lessons for A2'}</h1>
      <p>{t('ui_lessons_page_intro') || 'Browse through our A2 level Dutch lessons, grouped by difficulty.'}</p>

      <div className="difficulty-groups-accordion">
        {difficultyOrder.map(difficultyKey => {
          const lessonsInGroup = lessonsByDifficulty[difficultyKey] || [];
          if (lessonsInGroup.length === 0 && lessonManifest.length > 0) {
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
              {lessonsInGroup.length > 0 ? (
                <div className="list-container lessons-grid">
                  {lessonsInGroup.map(lesson => ( 
                    <div 
                      key={lesson.id} 
                      className="card enhanced-lesson-card clickable-card"
                      onClick={() => handleCardClick(lesson.id)}
                      role="link"
                      tabIndex={0}
                      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(lesson.id); }}
                    >
                      {lesson.coverImage && (
                        <div className="card-image-container">
                          <img src={lesson.coverImage} alt={t(lesson.titleKey) || lesson.id} />
                        </div>
                      )}
                      <div className="card-content">
                        <h3>{t(lesson.titleKey) || lesson.id}</h3>
                        <p className="card-snippet">
                          {t(lesson.shortDescriptionKey) || 'Click to learn more...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-items-message">{t('ui_no_lessons_found_in_difficulty') || 'No lessons currently in this difficulty level.'}</p>
              )}
            </AccordionItem>
          );
        })}
      </div>

      {/* Message if no lessons found AT ALL after loading and no error */}
      {(!loadingData && !isLoadingTranslations && !hasAnyLessonsToShow && !error) && (
         <p className="no-items-message">{t('ui_no_lessons_found') || 'No lessons found.'}</p>
      )}
    </div>
  );
};

export default LessonsPage;