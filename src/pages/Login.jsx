import React, { useState } from 'react';
import { BookOpen, Shield, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { INITIAL_LIBRARIAN } from '../utils/storage';

export default function Login({ members = [], onLoginSuccess }) {
  const [loginMode, setLoginMode] = useState('librarian'); // 'librarian' | 'member'
  
  // Librarian credentials
  const [librarianId, setLibrarianId] = useState('901020525');
  const [password, setPassword] = useState('admin123');

  // Member login credentials
  const [selectedMemberId, setSelectedMemberId] = useState(members.length > 0 ? members[0].id : '901020500');

  const [error, setError] = useState('');

  const handleLibrarianSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (librarianId.trim() === '901020525' && password === 'admin123') {
      onLoginSuccess(INITIAL_LIBRARIAN);
    } else {
      setError('Invalid Librarian ID or Password. Demo Password is "admin123"');
    }
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    setError('');

    const foundMember = members.find(m => String(m.id) === String(selectedMemberId));
    if (foundMember) {
      onLoginSuccess({
        id: foundMember.id,
        name: foundMember.name,
        email: foundMember.email,
        role: 'Member',
        status: foundMember.status
      });
    } else {
      setError('Selected Member record not found.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #141c26 0%, #0b0f14 100%)',
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem auto', width: '52px', height: '52px' }}>
            <BookOpen size={28} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
            NEXUS
          </h1>
          <p style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
            Community Library Management System
          </p>
        </div>

        {/* Login Mode Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-dark)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => { setLoginMode('librarian'); setError(''); }}
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: loginMode === 'librarian' ? 'var(--accent-gold)' : 'transparent',
              color: loginMode === 'librarian' ? '#0b0f14' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={15} />
            <span>Librarian</span>
          </button>

          <button
            type="button"
            onClick={() => { setLoginMode('member'); setError(''); }}
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: loginMode === 'member' ? 'var(--accent-gold)' : 'transparent',
              color: loginMode === 'member' ? '#0b0f14' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={15} />
            <span>Library Member</span>
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: 'var(--status-danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Librarian Login Form */}
        {loginMode === 'librarian' && (
          <form onSubmit={handleLibrarianSubmit}>
            <div className="form-group">
              <label className="form-label">Librarian ID</label>
              <input 
                type="text" 
                className="form-input" 
                value={librarianId}
                onChange={(e) => setLibrarianId(e.target.value)}
                placeholder="901020525"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <strong>Admin Account:</strong> Sechaba Thoabala<br/>
              <strong>ID:</strong> 901020525 &nbsp;|&nbsp; <strong>Pass:</strong> admin123
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.75rem' }}>
              <span>Login as Librarian</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Member Login Form */}
        {loginMode === 'member' && (
          <form onSubmit={handleMemberSubmit}>
            <div className="form-group">
              <label className="form-label">Select Library Member Account</label>
              <select
                className="form-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (ID: {m.id})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              Members have read-only access to browse books, check their loans, due dates, and borrowing history.
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.75rem' }}>
              <span>Login as Member</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
