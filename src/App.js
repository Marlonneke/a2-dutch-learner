import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import MainLayout from './components/Layout/MainLayout'; // You'll create this
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import GrammarPage from './pages/GrammarPage';
import GrammarTopicPage from './pages/GrammarTopicPage';
import ExercisesPage from './pages/ExercisesPage';
import './App.css'; // Or your chosen styling

function App() {
  return (
    <LanguageProvider>
      <Router>
        <MainLayout> {/* Contains Header (with LanguageToggle) and Footer */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lessons/:lessonId" element={<LessonDetailPage />} />
            <Route path="/grammar" element={<GrammarPage />} />
            <Route path="/grammar/:topicId" element={<GrammarTopicPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            {/* Add 404 page later */}
          </Routes>
        </MainLayout>
      </Router>
    </LanguageProvider>
  );
}

export default App;