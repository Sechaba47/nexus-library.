import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      background: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '0.55rem 0.9rem',
      maxWidth: '360px',
      width: '100%'
    }}>
      <Search size={17} color="var(--text-muted)" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-main)',
          fontSize: '0.875rem',
          width: '100%',
          outline: 'none'
        }}
      />
      {value && (
        <button 
          onClick={() => onChange('')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
