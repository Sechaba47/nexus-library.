import React, { useMemo } from 'react';
import { ShieldCheck, UserCheck, UserPlus, ShieldAlert, BookOpen } from 'lucide-react';
import { INITIAL_LIBRARIAN, getNextMemberId } from '../utils/storage';

export default function UsersPage({ members = [], currentUser, onOpenAddMemberModal }) {
  const isLibrarian = currentUser && currentUser.role === 'Librarian';
  const nextAssignedId = useMemo(() => getNextMemberId(), [members]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Administrator / Librarian Card */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--accent-gold)" />
          <span>System Administrator (Librarian)</span>
        </h3>

        <div className="table-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #18222d 0%, #111820 100%)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                color: '#0b0f14',
                fontSize: '1.4rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px var(--accent-gold-glow)'
              }}>
                ST
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{INITIAL_LIBRARIAN.name}</h4>
                  <span className="badge badge-available">Administrator</span>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>ID: <strong style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{INITIAL_LIBRARIAN.id}</strong></span>
                  <span>Role: <strong>{INITIAL_LIBRARIAN.role}</strong></span>
                  <span>Email: {INITIAL_LIBRARIAN.email}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Full CRUD administrative access over catalog, members & loans.
            </div>
          </div>
        </div>
      </div>

      {/* Library Members Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} color="var(--accent-blue)" />
            <span>Library Members ({members.length})</span>
          </h3>

          {isLibrarian && (
            <button className="btn btn-gold" onClick={onOpenAddMemberModal}>
              <UserPlus size={16} />
              <span>Register Member ({nextAssignedId})</span>
            </button>
          )}
        </div>

        <div className="table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Role / Privileges</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    {m.id}
                  </td>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{m.name}</td>
                  <td>{m.email || 'N/A'}</td>
                  <td>{m.phone || 'N/A'}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      Member (Borrower)
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-available">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
