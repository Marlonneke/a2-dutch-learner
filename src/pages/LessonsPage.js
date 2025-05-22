import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './LessonsPage.module.css';

const LessonsPage = () => {
  const { t, isLoadingTranslations } = useTranslation(); // Add isLoadingTranslations if you use it
  const [lessons, setLessons] = useState([]);
  const [loadingData, setLoadingData] = useState(true); // For data fetching, distinct from translation loading
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingData(true);
    fetch('/data/lessons_content.json') // Assuming your content file is named this
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setLessons(data);
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load lessons content:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, []);

  if (isLoadingTranslations && !lessons.length) return <p>{t('ui_loading') || 'Loading translations...'}</p>; // Prioritize translation loading message if both are happening
  if (loadingData) return <p>{t('ui_loading') || 'Loading lessons...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading lessons'}: {error}</p>;

  return (
    <div>
      <h1>{t('ui_page_title_lessons') || 'Dutch Lessons for A2'}</h1>
      <p>{t('ui_lessons_page_intro') || 'Browse through our A2 level Dutch lessons...'}</p>
      {lessons.length > 0 ? (
        <div className="list-container">
          {lessons.map(lesson => (
            <div key={lesson.id} className="card">
              <h2>{t(lesson.titleKey) || lesson.id}</h2>
              <p className="card-theme">{t(lesson.themeKey) || 'No theme'}</p>
              {/* Optional: Truncated explanation using lesson.explanationKey */}
              {/* <p>{(t(lesson.explanationKey) || '').substring(0, 100) + '...'}</p> */}
              <Link to={`/lessons/${lesson.id}`} className="button">
                {t('ui_view_lesson_button') || 'View Lesson'}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('ui_no_lessons_found') || 'No lessons found.'}</p>
      )}
    </div>
  );
};

export default LessonsPage;