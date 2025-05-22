import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const LessonDetailPage = () => {
  const { lessonId } = useParams(); 
  const { t, isLoadingTranslations } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingData(true);
    setError(null);
    let lessonFileIdToFetch = null;

    fetch('/data/lessons_manifest.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load lessons manifest');
        return res.json();
      })
      .then(manifestData => {
        const lessonManifestEntry = manifestData.find(item => item.id === lessonId);
        if (!lessonManifestEntry || !lessonManifestEntry.fileId) {
          throw new Error(`Lesson ID "${lessonId}" not found in manifest or is missing fileId.`);
        }
        lessonFileIdToFetch = lessonManifestEntry.fileId;
        return fetch(`/data/lesson_files/${lessonFileIdToFetch}.json`);
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} for lesson file ${lessonFileIdToFetch}.json`);
        }
        return res.json();
      })
      .then(data => {
        setLesson(data); // Data is the full lesson object from its individual file
        setLoadingData(false);
      })
      .catch(err => {
        console.error(`Failed to load lesson content for ID "${lessonId}" (File: ${lessonFileIdToFetch || 'unknown'}):`, err);
        setError(t('ui_lesson_not_found_error') || `Could not load lesson: ${err.message}`);
        setLoadingData(false);
      });
  }, [lessonId, t]);


  if (isLoadingTranslations && !lesson && !error) return <p>{t('ui_loading') || 'Loading translations...'}</p>;
  if (loadingData) return <p>{t('ui_loading') || 'Loading lesson details...'}</p>;
  if (error) return <p>{t('ui_error_loading_data') || 'Error loading lesson'}: {error}</p>;
  if (!lesson) return <p>{t('ui_lesson_not_found') || 'Lesson not found.'}</p>;

  return (
    <div className="detail-page lesson-detail">
      <h1>{t(lesson.titleKey) || lesson.id}</h1>
      {/* Theme could be displayed here if you pass it from manifest or add it back to individual lesson files */}
      {/* For now, we don't have themeKey in the individual lesson file structure, only in manifest */}
      {/* <p className="lesson-theme"><em>{t('lesson_theme_label') || 'Theme'}: {t(lesson.themeKeyFromManifestIfNeeded)}</em></p> */}


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
                {item.audio && <button className="button-unstyled" onClick={() => new Audio(item.audio).play()} aria-label={`Play audio for ${item.dutch}`}>🔊</button>}
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

      {lesson.tips && lesson.tips.length > 0 && (
        <div className="lesson-tips-section">
          <h3>{t('ui_cultural_tips_title') || 'Cultural & Learning Tips'}</h3>
          <ul>
            {lesson.tips.map((tip, index) => (
              <li key={index} className="lesson-tip-item">{t(tip.tipKey) || 'Tip text unavailable.'}</li>
            ))}
          </ul>
        </div>
      )}

     <div className="page-actions"> 
        <Link to={`/exercises?lesson=${lesson.id}`} className="button">
          {t('ui_practice_this_lesson_button') || 'Practice this Lesson'}
        </Link>
        <Link to="/lessons" className="button secondary back-button"> 
          {t('ui_back_to_lessons_list_button') || 'Back to Lessons'}
        </Link>
      </div>
    </div>
  );
};

export default LessonDetailPage;