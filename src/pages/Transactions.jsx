import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { Receipt, Filter, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function Transactions({ transactions = [], onReturnBook, currentUser }) {
  const isLibrarian = currentUser && currentUser.role === 'Librarian';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesStatus = selectedStatus === 'All' || tx.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        tx.id.toLowerCase().includes(q) ||
        tx.bookTitle.toLowerCase().includes(q) ||
        tx.memberName.toLowerCase().includes(q) ||
        String(tx.memberId).includes(q) ||
        String(tx.bookId).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [transactions, selectedStatus, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search and Filters */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.1rem 1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Tx ID, Book, Member name/ID..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '0.55rem 0.9rem', width: 'auto' }}
          >
            <option value="All">Filter Status: All</option>
            <option value="Active">Active Loans</option>
            <option value="Overdue">Overdue Loans</option>
            <option value="Returned">Returned Loans</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState 
          title="No Transactions Found"
          message="No loan transaction records matched your search filter."
        />
      ) : (
        <div className="table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Book Details</th>
                <th>Member Details</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                {isLibrarian && <th style={{ textAlign: 'right' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                    {tx.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{tx.bookTitle}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dark)' }}>
                      ID: {tx.bookId}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{tx.memberName}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                      ID: {tx.memberId}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{formatDate(tx.issueDate)}</td>
                  <td style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: tx.status === 'Overdue' ? 'var(--status-danger)' : 'var(--text-main)' 
                  }}>
                    {formatDate(tx.dueDate)}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: tx.returnDate ? 'var(--status-success)' : 'var(--text-dark)' }}>
                    {tx.returnDate ? formatDate(tx.returnDate) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${
                      tx.status === 'Returned' ? 'badge-returned' : 
                      tx.status === 'Overdue' ? 'badge-overdue' : 'badge-borrowed'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  {isLibrarian && (
                    <td style={{ textAlign: 'right' }}>
                      {tx.status !== 'Returned' && (
                        <button 
                          className="btn btn-outline"
                          onClick={() => onReturnBook(tx.id)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
