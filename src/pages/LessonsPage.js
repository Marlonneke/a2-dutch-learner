import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './LessonsPage.module.css';

const LessonsPage = () => {
  const { t, isLoadingTranslations } = useTranslation();
  const [lessonsByDifficulty, setLessonsByDifficulty] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Define the order of difficulty levels for rendering
 const difficultyOrder = ['ui_difficulty_easy', 'ui_difficulty_medium', 'ui_difficulty_hard'];

  useEffect(() => {
    setLoadingData(true);
    fetch('/data/lessons_content.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Group lessons by difficulty
        const grouped = data.reduce((acc, lesson) => {
          const difficulty = lesson.difficulty || 'difficulty_medium'; // Default if undefined
          if (!acc[difficulty]) {
            acc[difficulty] = [];
          }
          acc[difficulty].push(lesson);
          return acc;
        }, {});
        setLessonsByDifficulty(grouped);
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load lessons content:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, []);

  if (isLoadingTranslations && Object.keys(lessonsByDifficulty).length === 0) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading lessons...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading lessons'}: {error}</p>;

  return (
    <div>
      <h1>{t('ui_page_title_lessons') || 'Dutch Lessons for A2'}</h1>
      <p>{t('ui_lessons_page_intro') || 'Browse through our A2 level Dutch lessons, grouped by difficulty.'}</p>

      {difficultyOrder.map(difficultyKey => (
        lessonsByDifficulty[difficultyKey] && lessonsByDifficulty[difficultyKey].length > 0 && (
          <section key={difficultyKey} className="difficulty-group" style={{ marginBottom: '40px' }}>
            <h2>{t(difficultyKey) || difficultyKey.split('_')[1]}</h2> {/* Translates "Easy", "Medium", "Hard" */}
            <div className="list-container">
              {lessonsByDifficulty[difficultyKey].map(lesson => (
                <div key={lesson.id} className="card">
                  <h3>{t(lesson.titleKey) || lesson.id}</h3>
                  <p className="card-theme">{t(lesson.themeKey) || 'No theme'}</p>
                  <Link to={`/lessons/${lesson.id}`} className="button">
                    {t('ui_view_lesson_button') || 'View Lesson'}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )
      ))}

      {Object.keys(lessonsByDifficulty).length === 0 && !loadingData && (
        <p>{t('ui_no_lessons_found') || 'No lessons found.'}</p>
      )}
    </div>
  );
};

export default LessonsPage;