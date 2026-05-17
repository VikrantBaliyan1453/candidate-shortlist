import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="hero-section">
        <h1>
          <div className="line1">CANDIDATE</div>
          <div className="line2 glitch-text">SHORTLISTING SYSTEM</div>
        </h1>
        <p>
          AI-powered recruitment intelligence. Match candidates to job requirements
          with precision skill analysis and Claude AI recommendations.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/candidates')}>
            ➕ Add Candidates
          </button>
          <button className="btn btn-ai" onClick={() => navigate('/ai')}>
            🤖 AI Shortlist
          </button>
        </div>
      </div>

      <div className="feature-grid">
        {[
          { icon: '👤', title: 'CANDIDATE MGMT', desc: 'Add and manage candidate profiles with skills and experience.' },
          { icon: '🎯', title: 'SMART MATCHING', desc: 'Skill overlap analysis with weighted scoring algorithm.' },
          { icon: '🤖', title: 'CLAUDE AI', desc: 'Intelligent AI analysis and ranking beyond keyword matching.' },
          { icon: '❓', title: 'INTERVIEW AI', desc: 'Auto-generate custom interview questions per candidate.' },
        ].map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}