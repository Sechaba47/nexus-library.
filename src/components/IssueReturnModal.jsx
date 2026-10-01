import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { ArrowRightLeft, BookOpen, User, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateDueDate } from '../utils/dateUtils';
import { getSettings } from '../utils/storage';

export default function IssueReturnModal({ 
  isOpen, 
  onClose, 
  books = [], 
  members = [], 
  transactions = [],
  onIssueBookSubmit,
  onReturnBookSubmit,
  preselectedMemberId = '',
  preselectedBookId = ''
}) {
  const [activeTab, setActiveTab] = useState('issue'); // 'issue' | 'return'
  const settings = getSettings();
  const loanDays = settings.defaultLoanPeriodDays || 14;

  // Form Issue State
  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || (members[0]?.id || ''));
  const [selectedBookId, setSelectedBookId] = useState(preselectedBookId || (books[0]?.id || ''));
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(calculateDueDate(new Date().toISOString().split('T')[0], loanDays));
  const [errorMsg, setErrorMsg] = useState('');

  // Form Return State
  const [selectedTxId, setSelectedTxId] = useState('');

  useEffect(() => {
    if (preselectedMemberId) setSelectedMemberId(preselectedMemberId);
    if (preselectedBookId) setSelectedBookId(preselectedBookId);
  }, [preselectedMemberId, preselectedBookId]);

  useEffect(() => {
    setDueDate(calculateDueDate(issueDate, loanDays));
  }, [issueDate, loanDays]);

  // Filter available books (Business Rule 1: A borrowed book with 0 copies cannot be issued)
  const availableBooks = books.filter(b => {
    const activeLoans = transactions.filter(t => 
      t.bookId === b.id && (t.status === 'Active' || t.status === 'Overdue')
    ).length;
    const qty = parseInt(b.quantity, 10) || 1;
    return qty - activeLoans > 0;
  });

  // Active transactions that can be returned
  const returnableTransactions = transactions.filter(t => t.status === 'Active' || t.status === 'Overdue');

  useEffect(() => {
    if (returnableTransactions.length > 0 && !selectedTxId) {
      setSelectedTxId(returnableTransactions[0].id);
    }
  }, [returnableTransactions, selectedTxId]);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedMemberId || !selectedBookId) {
      setErrorMsg('Please select both a Member and a Book.');
      return;
    }

    const book = books.find(b => String(b.id) === String(selectedBookId));
    const member = members.find(m => String(m.id) === String(selectedMemberId));

    if (!book || !member) {
      setErrorMsg('Selected book or member invalid.');
      return;
    }

    // Business Rule 1 Check
    const activeLoans = transactions.filter(t => 
      t.bookId === book.id && (t.status === 'Active' || t.status === 'Overdue')
    ).length;
    const qty = parseInt(book.quantity, 10) || 1;

    if (qty - activeLoans <= 0) {
      setErrorMsg(`Cannot issue "${book.title}". All copies are currently borrowed (Rule 1).`);
      return;
    }

    onIssueBookSubmit({
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.name,
      issueDate,
      dueDate,
      status: 'Active'
    });

    onClose();
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!selectedTxId) return;

    onReturnBookSubmit(selectedTxId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Issue & Return Management" maxWidth="540px">
      {/* Mode Selector Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--bg-dark)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)'
      }}>
        <button
          type="button"
          onClick={() => { setActiveTab('issue'); setErrorMsg(''); }}
          style={{
            padding: '0.55rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'issue' ? 'var(--accent-gold)' : 'transparent',
            color: activeTab === 'issue' ? '#0b0f14' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Issue Book to Member
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('return'); setErrorMsg(''); }}
          style={{
            padding: '0.55rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'return' ? 'var(--accent-gold)' : 'transparent',
            color: activeTab === 'return' ? '#0b0f14' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Return Book ({returnableTransactions.length} Active)
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--status-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: Issue Book */}
      {activeTab === 'issue' && (
        <form onSubmit={handleIssueSubmit}>
          <div className="form-group">
            <label className="form-label">Select Member *</label>
            <select
              className="form-select"
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              required
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} (ID: {m.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Book to Issue *</label>
            <select
              className="form-select"
              value={selectedBookId}
              onChange={e => setSelectedBookId(e.target.value)}
              required
            >
              {availableBooks.length === 0 ? (
                <option value="">No books available for issuing</option>
              ) : (
                availableBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} (ID: {b.id})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input 
                type="date"
                className="form-input"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date ({loanDays} Days)</label>
              <input 
                type="date"
                className="form-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" disabled={availableBooks.length === 0}>
              Confirm Issue Loan
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Return Book */}
      {activeTab === 'return' && (
        <form onSubmit={handleReturnSubmit}>
          {returnableTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              No active loans in the system to return.
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Select Loan Transaction to Return</label>
                <select
                  className="form-select"
                  value={selectedTxId}
                  onChange={e => setSelectedTxId(e.target.value)}
                  required
                >
                  {returnableTransactions.map(tx => (
                    <option key={tx.id} value={tx.id}>
                      {tx.bookTitle} — Issued to {tx.memberName} (Due: {tx.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                Returning this book will update the book's status to <strong>Available</strong>, mark the transaction as <strong>Returned</strong>, and record today's return date.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold">
                  Confirm Book Return
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </Modal>
  );
}
