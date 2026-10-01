import React from 'react';
import { Calendar, Plus, BookMarked, ArrowRightLeft, Shield } from 'lucide-react';

export default function Header({ pageTitle, currentUser, onOpenIssueModal, onOpenAddBookModal, onOpenAddMemberModal }) {
  const isLibrarian = currentUser && currentUser.role === 'Librarian';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="top-header">
      <div className="page-title-box">
        <h1>{pageTitle}</h1>
      </div>

      <div className="header-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-dark)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Calendar size={15} color="var(--accent-gold)" />
          <span>{todayFormatted}</span>
        </div>

        {isLibrarian && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-gold" onClick={onOpenIssueModal}>
              <ArrowRightLeft size={16} />
              <span>Issue / Return</span>
            </button>
            <button className="btn btn-outline" onClick={onOpenAddBookModal}>
              <Plus size={16} />
              <span>Add Book</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
