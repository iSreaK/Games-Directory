import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import GamesPage from './pages/GamesPage';
import GamesDetail from './pages/GamesDetail';
import ProfilePage from './pages/ProfilePage';
import RedirectProfile from './components/RedirectProfile';
import QuizzDetailsPage from './pages/QuizzDetailsPage';
import QuizzPage from './pages/QuizzPage';

function App() {
  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-100">
      <Router>
        <Navbar />
        <div style={{ paddingTop: '60px' }}>
          <Routes>
            <Route path="/" element={<GamesPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/games/:id" element={<GamesDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/quizz" element={<QuizzPage />} />
            <Route path="/quizz/:id" element={<QuizzDetailsPage />} />  
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
