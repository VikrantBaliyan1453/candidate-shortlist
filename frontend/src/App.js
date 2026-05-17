import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Candidates from './pages/Candidates';
import Match from './pages/Match';
import AIPage from './pages/AIPage';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/match" element={<Match />} />
            <Route path="/ai" element={<AIPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;