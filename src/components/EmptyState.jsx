import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No Data Found', message = 'There are no records to display.', icon: Icon = Inbox, actionButton }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      color: 'var(--text-muted)',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)'
    }}>
      <Icon size={44} color="var(--accent-gold)" style={{ opacity: 0.7, marginBottom: '0.85rem' }} />
      <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>{message}</p>
      {actionButton}
    </div>
  );
}
