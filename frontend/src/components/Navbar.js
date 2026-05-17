import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        TALENT<span>AI</span>
      </NavLink>
      <ul className="navbar-links">
        <li><NavLink to="/" end>🏠 Home</NavLink></li>
        <li><NavLink to="/candidates">👤 Candidates</NavLink></li>
        <li><NavLink to="/match">🎯 Match</NavLink></li>
        <li>
          <NavLink to="/ai">
            🤖 AI Shortlist <span className="nav-badge">AI</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}