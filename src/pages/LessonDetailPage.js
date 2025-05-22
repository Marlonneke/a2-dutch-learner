import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './LessonDetailPage.module.css';

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const { t, isLoadingTranslations } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingData(true);
    fetch('/data/lessons_content.json') // Assuming your content file is named this
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
        })
      .then(data => {
        const foundLesson = data.find(l => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          setError(t('ui_lesson_not_found') || 'Lesson not found');
        }
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load lesson details:", err);
        setError(err.message);
        setLoadingData(false);
      });
  }, [lessonId, t]); // t added as it's used in setError for a translated message

  if (isLoadingTranslations && !lesson) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading lesson details...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading lesson'}: {error}</p>;
  if (!lesson) return <p>{t('ui_lesson_not_found') || 'Lesson not found.'}</p>; // Should be caught by error state mostly

  return (
    <div className="detail-page lesson-detail">
      <h1>{t(lesson.titleKey) || lesson.id}</h1>
      <p className="lesson-theme"><em>{t('lesson_theme_label') || 'Theme'}: {t(lesson.themeKey)}</em></p>

      <div className="lesson-explanation">
        <h3>{t('ui_explanation_title') || 'Explanation'}</h3>
        <p>{t(lesson.explanationKey) || 'Explanation coming soon.'}</p>
      </div>

      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <>
          <h3>{t('ui_vocabulary_title') || 'Vocabulary'}</h3>
          <ul className="vocabulary-list">
            {lesson.vocabulary.map((item, index) => (
              <li key={index}>
                <strong>{item.dutch}</strong>: {t(item.definitionKey) || 'Definition unavailable'}
                {item.audio && <button onClick={() => new Audio(item.audio).play()}>🔊 Play</button>}
              </li>
            ))}
          </ul>
        </>
      )}

      {lesson.exampleSentences && lesson.exampleSentences.length > 0 && (
        <>
          <h3>{t('ui_example_sentences_title') || 'Example Sentences'}</h3>
          <ul className="example-sentences">
            {lesson.exampleSentences.map((ex, index) => (
              <li key={index}>
                <strong>{ex.dutch}</strong>
                {ex.englishHint && <span> ({ex.englishHint})</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {lesson.dialogues && lesson.dialogues.length > 0 && (
        <>
          <h3>{t('ui_dialogues_title') || 'Dialogues'}</h3>
          {lesson.dialogues.map((dialogue, dIndex) => (
            <div key={dIndex} className="dialogue-section">
              <h4>{t(dialogue.titleKey) || 'Dialogue'}</h4>
              {dialogue.lines.map((line, lIndex) => (
                <p key={lIndex}><strong>{t('ui_' + line.speaker.replace(/\s+/g, '')) || line.speaker}:</strong> {line.line}</p>
              ))}
            </div>
          ))}
        </>
      )}

      {lesson.notesKey && (
          <>
            <h3>{t('ui_notes_title') || 'Additional Notes'}</h3>
            <p>{t(lesson.notesKey)}</p>
          </>
      )}

      <div style={{ marginTop: '30px' }}>
        <Link to={`/exercises?lesson=${lesson.id}`} className="button">
          {t('ui_practice_this_lesson_button') || 'Practice this Lesson'}
        </Link>
        <Link to="/lessons" style={{ marginLeft: '15px' }}>
          {t('ui_back_to_lessons_list_button') || 'Back to Lessons'}
        </Link>
      </div>
    </div>
  );
};

export default LessonDetailPage;