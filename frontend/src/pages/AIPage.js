import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://candidate-shortlist-backend-977w.onrender.com/api';

export default function AIPage() {
  const [form, setForm] = useState({ requiredSkills: '', preferredSkills: '', minExperience: 0 });
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selCand, setSelCand] = useState('');
  const [jobReq, setJobReq] = useState('');
  const [questions, setQuestions] = useState('');
  const [qLoading, setQLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/candidates`).then(r => setCandidates(r.data.candidates)).catch(() => {});
  }, []);

  const handleAIShortlist = async (e) => {
    e.preventDefault();
    setLoading(true); setAiResult('');
    try {
      const res = await axios.post(`${API}/ai/shortlist`, {
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: form.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
        minExperience: Number(form.minExperience)
      });
      setAiResult(res.data.aiResponse);
    } catch { setAiResult('❌ AI Error. Check API key in .env'); }
    setLoading(false);
  };

  const handleGenQuestions = async () => {
    if (!selCand) return alert('Select a candidate first');
    setQLoading(true); setQuestions('');
    try {
      const res = await axios.post(`${API}/ai/interview-questions`, {
        candidateId: selCand, jobRequirements: jobReq
      });
      setQuestions(res.data.questions);
    } catch { setQuestions('❌ Failed to generate questions'); }
    setQLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🤖 <span className="accent">AI</span> Shortlisting</h1>
        <p>Claude AI-powered candidate analysis and ranking</p>
      </div>

      <div className="two-col" style={{ marginBottom: 30 }}>
        {/* AI SHORTLIST */}
        <div className="glass-card">
          <div className="card-title">🤖 AI Job Matching</div>
          <form onSubmit={handleAIShortlist}>
            <div className="form-grid single">
              <div className="form-group">
                <label>Required Skills</label>
                <input placeholder="React, Node.js, MongoDB" value={form.requiredSkills}
                  onChange={e => setForm({ ...form, requiredSkills: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Preferred Skills</label>
                <input placeholder="AWS, Docker" value={form.preferredSkills}
                  onChange={e => setForm({ ...form, preferredSkills: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Min Experience (Years)</label>
                <input type="number" min="0" value={form.minExperience}
                  onChange={e => setForm({ ...form, minExperience: e.target.value })} />
              </div>
            </div>
            <br />
            <button type="submit" className="btn btn-ai" style={{ width: '100%' }} disabled={loading}>
              {loading ? '⏳ ANALYZING...' : '🤖 RUN AI ANALYSIS'}
            </button>
          </form>
        </div>

        {/* INTERVIEW QUESTIONS */}
        <div className="glass-card">
          <div className="card-title">❓ Interview Questions</div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Select Candidate</label>
            <select value={selCand} onChange={e => setSelCand(e.target.value)}>
              <option value="">-- Choose Candidate --</option>
              {candidates.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Job Requirements (optional)</label>
            <textarea placeholder="Full-stack developer for e-commerce platform..." value={jobReq}
              onChange={e => setJobReq(e.target.value)} style={{ minHeight: 80 }} />
          </div>
          <button className="btn btn-ai" style={{ width: '100%' }} onClick={handleGenQuestions} disabled={qLoading}>
            {qLoading ? '⏳ GENERATING...' : '❓ GENERATE QUESTIONS'}
          </button>

          {questions && (
            <div className="ai-response-box" style={{ marginTop: 20 }}>
              <div className="ai-response-header">
                <span className="ai-badge">CLAUDE AI</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interview Questions</span>
              </div>
              <div className="ai-response-text">{questions}</div>
            </div>
          )}
        </div>
      </div>

      {/* AI RESULT */}
      {loading && <div className="loading-wrap"><div className="spinner" /><p>CLAUDE IS ANALYZING...</p></div>}
      {aiResult && (
        <div className="glass-card">
          <div className="ai-response-box" style={{ margin: 0 }}>
            <div className="ai-response-header">
              <span className="ai-badge">CLAUDE AI</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Candidate Ranking & Analysis</span>
            </div>
            <div className="ai-response-text">{aiResult}</div>
          </div>
        </div>
      )}
    </div>
  );
}