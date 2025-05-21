import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './LessonsPage.module.css';

const LessonsPage = () => {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/lessons.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>{t('loading')}...</p>; // Add 'loading' to translations.json
  if (error) return <p>{t('error_loading_data')}: {error}</p>; // Add 'error_loading_data'

  return (
    <div>
      <h1>{t('page_title_lessons')}</h1>
      {/* Add filtering by level/theme later */}
      <div className="lesson-list"> {/* Add styling */}
        {lessons.map(lesson => (
          <div key={lesson.id} className="lesson-card"> {/* Create a LessonCard component */}
            {/* lesson.coverImage && <img src={lesson.coverImage} alt={t(lesson.titleKey)} /> */}
            <h2>{t(lesson.titleKey)}</h2>
            <p>{t(lesson.themeKey)}</p>
            <Link to={`/lessons/${lesson.id}`}>{t('view_lesson_button')}</Link> {/* Add to translations */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;