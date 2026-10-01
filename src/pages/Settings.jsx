import React, { useState } from 'react';
import { Settings, Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { getSettings, saveSettings, resetToDefaults } from '../utils/storage';

export default function SettingsPage({ onResetSystem }) {
  const [settings, setSettingsData] = useState(getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all library data to initial demo state? Custom added books and members will be reset.')) {
      resetToDefaults();
      onResetSystem();
    }
  };

  return (
    <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {savedSuccess && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: 'var(--status-success)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>System settings updated successfully!</span>
        </div>
      )}

      {/* Settings Form Card */}
      <div className="table-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={20} color="var(--accent-gold)" />
          <span>Library Management Configuration</span>
        </h3>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Library Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={settings.libraryName || 'NEXUS — Community Library'}
              onChange={e => setSettingsData({ ...settings, libraryName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Default Loan Period (Days)</label>
              <input 
                type="number" 
                min="1"
                max="90"
                className="form-input" 
                value={settings.defaultLoanPeriodDays || 14}
                onChange={e => setSettingsData({ ...settings, defaultLoanPeriodDays: parseInt(e.target.value, 10) || 14 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Loans Per Member</label>
              <input 
                type="number" 
                min="1"
                max="10"
                className="form-input" 
                value={settings.maxLoansPerMember || 3}
                onChange={e => setSettingsData({ ...settings, maxLoansPerMember: parseInt(e.target.value, 10) || 3 })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-gold">
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="table-card" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--status-danger)', marginBottom: '0.5rem' }}>
          Reset Demo System Data
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Reset local storage to initial demo state (20 books, 6 named members, librarian Sechaba Thoabala, initial loan transactions).
        </p>
        <button className="btn btn-danger" onClick={handleReset}>
          <RotateCcw size={16} />
          <span>Reset All Library Data to Defaults</span>
        </button>
      </div>
    </div>
  );
}
