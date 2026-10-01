import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookMarked, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { calculateMemberStats } from '../utils/calculations';
import { formatDate } from '../utils/dateUtils';

export default function MemberProfile({ 
  member, 
  transactions = [], 
  books = [], 
  onBack, 
  onReturnBook, 
  onIssueForMember 
}) {
  if (!member) {
    return (
      <div>
        <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Members
        </button>
        <p>Member not selected.</p>
      </div>
    );
  }

  const stats = calculateMemberStats(member.id, transactions);
  const activeTransactions = transactions.filter(t => 
    String(t.memberId) === String(member.id) && (t.status === 'Active' || t.status === 'Overdue')
  );
  const overdueTransactions = activeTransactions.filter(t => t.status === 'Overdue');
  const historyTransactions = transactions.filter(t => String(t.memberId) === String(member.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Back Button */}
      <div>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Members List</span>
        </button>
      </div>

      {/* Member Profile Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), #9a761c)',
            color: '#0b0f14',
            fontSize: '1.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--accent-gold-glow)'
          }}>
            {member.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff' }}>{member.name}</h2>
              <span className="badge badge-available">Active Member</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>ID: {member.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="var(--accent-gold)" />
                <span>{member.email || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="var(--accent-gold)" />
                <span>{member.phone || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="var(--accent-gold)" />
                <span>{member.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-gold" onClick={() => onIssueForMember(member.id)}>
          <Plus size={16} />
          <span>Issue Book to {member.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* Member Statistics Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(212, 167, 44, 0.12)', color: 'var(--accent-gold)' }}>
            <BookMarked size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.totalBorrowedAllTime}</div>
            <div className="stat-lbl">Total Books Borrowed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--status-warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.activeBorrows}</div>
            <div className="stat-lbl">Currently Borrowed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--status-danger)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.overdueBorrows}</div>
            <div className="stat-lbl">Overdue Books</div>
          </div>
        </div>
      </div>

      {/* Currently Borrowed Books Section */}
      <div className="table-card">
        <div className="table-header-bar">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Currently Borrowed Books ({activeTransactions.length})
          </h3>
        </div>

        {activeTransactions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            This member has no active book loans.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTransactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.id}</td>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{tx.bookTitle}</td>
                  <td>{formatDate(tx.issueDate)}</td>
                  <td style={{ color: tx.status === 'Overdue' ? 'var(--status-danger)' : 'var(--accent-gold)', fontWeight: 600 }}>
                    {formatDate(tx.dueDate)}
                  </td>
                  <td>
                    <span className={`badge ${tx.status === 'Overdue' ? 'badge-overdue' : 'badge-borrowed'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outline"
                      onClick={() => onReturnBook(tx.id)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Full Borrowing History */}
      <div className="table-card">
        <div className="table-header-bar">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            All-Time Borrowing History ({historyTransactions.length})
          </h3>
        </div>

        {historyTransactions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transaction history recorded yet.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyTransactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.id}</td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{tx.bookTitle}</td>
                  <td>{formatDate(tx.issueDate)}</td>
                  <td>{formatDate(tx.dueDate)}</td>
                  <td>{tx.returnDate ? formatDate(tx.returnDate) : 'Not Returned'}</td>
                  <td>
                    <span className={`badge ${
                      tx.status === 'Returned' ? 'badge-returned' : 
                      tx.status === 'Overdue' ? 'badge-overdue' : 'badge-borrowed'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
