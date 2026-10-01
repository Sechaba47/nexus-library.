import React from 'react';
import StatCard from '../components/StatCard';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  AlertCircle, 
  Plus, 
  ArrowRightLeft, 
  Receipt,
  BookMarked,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { calculateLibraryStats } from '../utils/calculations';
import { formatDate } from '../utils/dateUtils';

export default function Dashboard({ 
  books = [], 
  members = [], 
  transactions = [],
  onOpenIssueModal,
  onOpenAddBookModal,
  onOpenAddMemberModal,
  onNavigate
}) {
  // Calculate real-time dynamic statistics
  const stats = calculateLibraryStats(books, members, transactions);

  // Recent transactions (last 5)
  const recentTransactions = [...transactions].reverse().slice(0, 5);

  // Overdue transactions
  const overdueTransactions = transactions.filter(t => t.status === 'Overdue');

  // Low stock books (fewer than 2 copies in stock/available)
  const lowStockBooks = books.filter(b => {
    const activeLoansCount = transactions.filter(t => 
      t.bookId === b.id && (t.status === 'Active' || t.status === 'Overdue')
    ).length;
    const qty = parseInt(b.quantity, 10) || 1;
    const available = Math.max(0, qty - activeLoansCount);
    return available < 2;
  });

  // Recently added books (last 4)
  const recentBooks = [...books].reverse().slice(0, 4);

  // Recent members (last 4)
  const recentMembers = [...members].reverse().slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Quick Action Banner & Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #18222d 0%, #111820 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
            System Overview & Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Welcome back, <strong>Sechaba Thoabala</strong>. Here is the current status of the NEXUS library.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button className="btn btn-gold" onClick={onOpenAddBookModal}>
            <Plus size={16} />
            <span>+ Add Book</span>
          </button>
          <button className="btn btn-outline" onClick={onOpenAddMemberModal}>
            <Plus size={16} />
            <span>+ Add Member</span>
          </button>
          <button className="btn btn-outline" onClick={onOpenIssueModal}>
            <ArrowRightLeft size={16} />
            <span>Issue / Return Book</span>
          </button>
        </div>
      </div>

      {/* Calculated Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          title="Total Unique Titles" 
          value={stats.totalTitles} 
          icon={BookOpen}
          color="var(--accent-gold)"
          bg="rgba(212, 167, 44, 0.12)"
        />

        <StatCard 
          title="Available Copies" 
          value={stats.availableCopies} 
          icon={CheckCircle2}
          color="var(--status-success)"
          bg="rgba(34, 197, 94, 0.12)"
        />

        <StatCard 
          title="Currently Borrowed" 
          value={stats.borrowedCopies} 
          icon={Clock}
          color="var(--status-warning)"
          bg="rgba(245, 158, 11, 0.12)"
        />

        <StatCard 
          title="Total Library Members" 
          value={stats.totalMembers} 
          icon={Users}
          color="var(--accent-blue)"
          bg="rgba(56, 189, 248, 0.12)"
        />

        <StatCard 
          title="Overdue Loans" 
          value={stats.overdueCount} 
          icon={AlertCircle}
          color="var(--status-danger)"
          bg="rgba(239, 68, 68, 0.12)"
        />
      </div>

      {/* Grid of Tables & Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>
        
        {/* Low Stock Highlight Alert Widget (Assignment Requirement) */}
        <div className="table-card" style={{ border: lowStockBooks.length > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)' }}>
          <div className="table-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--status-warning)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Low Stock Alert (Fewer than 2 Copies Available)
              </h3>
            </div>
            <span className="badge badge-borrowed">{lowStockBooks.length} Alert Items</span>
          </div>

          {lowStockBooks.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              All books have sufficient stock in inventory.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Category</th>
                  <th>Total Qty</th>
                  <th>Available</th>
                  <th>Stock Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockBooks.map(b => {
                  const activeLoansCount = transactions.filter(t => 
                    t.bookId === b.id && (t.status === 'Active' || t.status === 'Overdue')
                  ).length;
                  const available = Math.max(0, b.quantity - activeLoansCount);

                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{b.title}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.category}</td>
                      <td>{b.quantity}</td>
                      <td style={{ fontWeight: 800, color: available === 0 ? 'var(--status-danger)' : 'var(--status-warning)' }}>
                        {available} left
                      </td>
                      <td>
                        <span className={`badge ${available === 0 ? 'badge-overdue' : 'badge-borrowed'}`}>
                          {available === 0 ? 'Out of Stock' : 'Low Stock (< 2)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Overdue Loans Widget */}
        <div className="table-card">
          <div className="table-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="var(--status-danger)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Overdue Loans</h3>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate('/transactions')}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              View All
            </button>
          </div>

          {overdueTransactions.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No overdue loans at present. Excellent!
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {overdueTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{tx.bookTitle}</td>
                    <td>{tx.memberName}</td>
                    <td style={{ color: 'var(--status-danger)', fontWeight: 600 }}>{formatDate(tx.dueDate)}</td>
                    <td>
                      <span className="badge badge-overdue">Overdue</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Transactions Widget */}
        <div className="table-card">
          <div className="table-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Receipt size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Recent Activity Log</h3>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate('/transactions')}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              View All
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Book</th>
                <th>Member</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.id}</td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{tx.bookTitle}</td>
                  <td>{tx.memberName}</td>
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
        </div>

        {/* Registered Members Widget */}
        <div className="table-card">
          <div className="table-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--status-success)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Active Members</h3>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate('/members')}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              View Members
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{m.id}</td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{m.name}</td>
                  <td>{formatDate(m.registrationDate)}</td>
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
