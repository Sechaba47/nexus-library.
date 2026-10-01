import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} maxWidth="450px">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          color: isDanger ? 'var(--status-danger)' : 'var(--status-warning)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <AlertTriangle size={28} />
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onClose} style={{ minWidth: '100px' }}>
            Cancel
          </button>
          <button 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-gold'}`} 
            onClick={() => { onConfirm(); onClose(); }}
            style={{ minWidth: '100px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
