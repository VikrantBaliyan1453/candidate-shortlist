import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API = 'http://localhost:5000/api';

function ScoreRing({ score }) {
  const r = 28, c = 2 * Math.PI * r;
  const color = score >= 80 ? '#00ff88' : score >= 50 ? '#ffaa00' : '#ff006e';
  return (
    <div className="match-score-ring">
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth="6" />
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="match-score-text">
        <div className="score" style={{ color }}>{score}</div>
        <div className="pct">MATCH</div>
      </div>
    </div>
  );
}

export default function Match() {
  const [form, setForm] = useState({ requiredSkills: '', preferredSkills: '', minExperience: 0 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/match`, {
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: form.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
        minExperience: Number(form.minExperience)
      });
      setResults(res.data.results);
      setSearched(true);
    } catch { alert('Match failed. Is backend running?'); }
    setLoading(false);
  };

  const chartData = results.slice(0, 8).map(c => ({ name: c.name.split(' ')[0], score: c.matchScore }));
  const barColors = ['#00ff88', '#00f5ff', '#0080ff', '#ffaa00', '#ff6b00', '#ff006e', '#7700ff', '#00ff88'];

  return (
    <div>
      <div className="page-header">
        <h1>🎯 <span className="accent">Smart</span> Matching</h1>
        <p>Match candidates to job requirements using skill analysis</p>
      </div>

      <div className="two-col">
        <div className="glass-card">
          <div className="card-title">📋 Job Requirements</div>
          <form onSubmit={handleMatch}>
            <div className="form-grid single">
              <div className="form-group">
                <label>Required Skills *</label>
                <input placeholder="React, Node.js, MongoDB" value={form.requiredSkills}
                  onChange={e => setForm({ ...form, requiredSkills: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Preferred Skills (optional)</label>
                <input placeholder="AWS, Docker, TypeScript" value={form.preferredSkills}
                  onChange={e => setForm({ ...form, preferredSkills: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Minimum Experience (Years)</label>
                <input type="number" min="0" max="20" value={form.minExperience}
                  onChange={e => setForm({ ...form, minExperience: e.target.value })} />
              </div>
            </div>
            <br />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? '⏳ MATCHING...' : '🎯 FIND MATCHES'}
            </button>
          </form>

          {results.length > 0 && (
            <>
              <div className="section-divider" />
              <div className="card-title">📊 Score Chart</div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: '#7aa8cc', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#7aa8cc', fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(0,245,255,0.2)', borderRadius: '8px', color: '#e8f4fd' }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        <div>
          {loading && <div className="loading-wrap"><div className="spinner" /><p>ANALYZING...</p></div>}

          {!loading && searched && results.length === 0 && (
            <div className="empty-state"><div className="empty-icon">😔</div><h3>No Matches Found</h3><p>Try relaxing requirements</p></div>
          )}

          {!loading && results.map((c, i) => (
            <div key={c._id} className="candidate-card" style={{ marginBottom: 16, animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <ScoreRing score={c.matchScore} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>{c.name}</h3>
                    <span className={`match-badge ${c.matchLevel}`}>{c.matchLevel}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {c.email} · {c.experience} yrs exp
                  </p>
                  <div className="skills-wrap">
                    {c.skills.map(s => (
                      <span key={s} className={`skill-tag ${c.matchedSkills.includes(s) ? 'matched' : ''}`}>{s}</span>
                    ))}
                  </div>
                  {c.matchedSkills.length > 0 && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--neon-green)', marginTop: 8 }}>
                      ✅ Matched: {c.matchedSkills.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}