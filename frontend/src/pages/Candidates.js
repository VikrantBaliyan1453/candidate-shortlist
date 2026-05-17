import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://candidate-shortlist-backend-977w.onrender.com/api';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', skills: '', experience: '', bio: '' });

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/candidates`);
      setCandidates(res.data.candidates);
    } catch { setMsg({ type: 'error', text: 'Failed to fetch candidates' }); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await axios.post(`${API}/candidates`, { ...form, skills: skillsArr, experience: Number(form.experience) });
      setMsg({ type: 'success', text: `✅ ${form.name} added successfully!` });
      setForm({ name: '', email: '', skills: '', experience: '', bio: '' });
      fetchCandidates();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Error adding candidate' });
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    await axios.delete(`${API}/candidates/${id}`);
    setMsg({ type: 'success', text: `🗑️ ${name} removed` });
    fetchCandidates();
    setTimeout(() => setMsg(null), 2000);
  };

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <h1>👤 <span className="accent">Candidate</span> Management</h1>
        <p>Add and manage your talent pool</p>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="two-col">
        {/* ADD FORM */}
        <div className="glass-card">
          <div className="card-title">➕ Add Candidate</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input placeholder="Rahul Sharma" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="rahul@gmail.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input placeholder="React, Node.js, MongoDB" value={form.skills}
                  onChange={e => setForm({ ...form, skills: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" min="0" max="30" placeholder="2" value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })} required />
              </div>
              <div className="form-group full-width">
                <label>Bio / Projects</label>
                <textarea placeholder="Brief about candidate..." value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
            <br />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              ➕ ADD CANDIDATE
            </button>
          </form>
        </div>

        {/* CANDIDATE LIST */}
        <div>
          <div className="search-bar-wrap">
            <input placeholder="🔍 Search by name or skill..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary btn-sm" onClick={fetchCandidates}>↺</button>
          </div>

          {loading ? (
            <div className="loading-wrap"><div className="spinner" /><p>LOADING...</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Candidates Found</h3>
              <p>Add candidates using the form</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map((c, i) => (
                <div key={c._id} className="candidate-card" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="candidate-header">
                    <div className="candidate-avatar">{c.name[0]}</div>
                    <div className="candidate-info">
                      <h3>{c.name}</h3>
                      <p>{c.email}</p>
                    </div>
                  </div>
                  <div className="candidate-meta">
                    <div className="meta-item">💼 <span>{c.experience}</span> yrs exp</div>
                    <div className="meta-item">🛠️ <span>{c.skills.length}</span> skills</div>
                  </div>
                  {c.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{c.bio}</p>}
                  <div className="skills-wrap">
                    {c.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                  <div className="candidate-actions">
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.name)}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}