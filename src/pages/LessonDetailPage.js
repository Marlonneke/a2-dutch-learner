import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// import styles from './LessonDetailPage.module.css';

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const { t } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/lessons.json')
      .then(res => res.json())
      .then(data => {
        const foundLesson = data.find(l => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          setError('Lesson not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) return <p>{t('loading')}...</p>;
  if (error) return <p>{t('error_loading_data')}: {error}</p>;
  if (!lesson) return <p>{t('lesson_not_found')}</p>; // Add to translations

  return (
    <div>
      <h1>{t(lesson.titleKey)}</h1>
      <p className="lesson-theme">{t(lesson.themeKey)}</p>
      
      <div className="lesson-explanation">
         {/* Use dangerouslySetInnerHTML if your explanation keys contain HTML, otherwise parse simple formatting */}
        <p>{t(lesson.explanationKey)}</p>
      </div>

      <h3>{t('example_sentences_title')}</h3> {/* Add to translations */}
      <ul>
        {lesson.exampleSentences.map((ex, index) => (
          <li key={index}>
            <strong>{ex.dutch}</strong>
            {ex.englishHint && <span> ({ex.englishHint})</span>} {/* This hint is always English for learning */}
          </li>
        ))}
      </ul>
      
      {lesson.dialogues && lesson.dialogues.map((dialogue, dIndex) => (
        <div key={dIndex} className="dialogue-section">
          <h4>{t(dialogue.titleKey)}</h4>
          {dialogue.lines.map((line, lIndex) => (
            <p key={lIndex}><strong>{t(line.speaker)}:</strong> {line.line}</p> // Assuming speaker names can be translated keys
          ))}
        </div>
      ))}

      {lesson.vocabulary && (
        <>
          <h3>{t('vocabulary_title')}</h3> {/* Add to translations */}
          <ul>
            {lesson.vocabulary.map((item, vIndex) => (
              <li key={vIndex}>
                <strong>{item.dutch}</strong>: {t(item.definitionKey)}
              </li>
            ))}
          </ul>
        </>
      )}
      
      <Link to={`/exercises?lesson=${lesson.id}`}>{t('practice_this_lesson')}</Link>
    </div>
  );
};

export default LessonDetailPage;