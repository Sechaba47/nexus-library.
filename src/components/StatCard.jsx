import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'var(--accent-gold)', bg = 'rgba(212, 167, 44, 0.12)' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ background: bg, color: color }}>
        <Icon size={24} />
      </div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-lbl">{title}</div>
      </div>
    </div>
  );
}
