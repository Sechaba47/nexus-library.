import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import IssueReturnModal from './components/IssueReturnModal';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import Transactions from './pages/Transactions';
import UsersPage from './pages/Users';
import SettingsPage from './pages/Settings';

import { 
  getBooks, 
  saveBooks, 
  getMembers, 
  saveMembers, 
  getTransactions, 
  saveTransactions,
  getCurrentUser, 
  setCurrentUser, 
  logout,
  incrementNextMemberId,
  getNextMemberId
} from './utils/storage';

function MemberProfileWrapper({ members, transactions, books, onReturnBook, onIssueForMember }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const foundMember = members.find(m => String(m.id) === String(id));

  return (
    <MemberProfile 
      member={foundMember}
      transactions={transactions}
      books={books}
      onBack={() => navigate('/members')}
      onReturnBook={onReturnBook}
      onIssueForMember={onIssueForMember}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUserData] = useState(() => getCurrentUser());
  const [books, setBooksData] = useState(() => getBooks());
  const [members, setMembersData] = useState(() => getMembers());
  const [transactions, setTransactionsData] = useState(() => getTransactions());

  // Global Issue / Return modal state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [preselectedMemberId, setPreselectedMemberId] = useState('');
  const [preselectedBookId, setPreselectedBookId] = useState('');

  // Persist state updates to localStorage
  const updateBooks = (newBooks) => {
    setBooksData(newBooks);
    saveBooks(newBooks);
  };

  const updateMembers = (newMembers) => {
    setMembersData(newMembers);
    saveMembers(newMembers);
  };

  const updateTransactions = (newTransactions) => {
    setTransactionsData(newTransactions);
    saveTransactions(newTransactions);
  };

  // Login & Logout Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUserData(user);
    setCurrentUser(user);
    if (user.role === 'Librarian') {
      navigate('/dashboard');
    } else {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUserData(null);
    navigate('/login');
  };

  // Book Handlers
  const handleAddBook = (bookData) => {
    const updated = [bookData, ...books];
    updateBooks(updated);
  };

  const handleEditBook = (updatedBook) => {
    const updated = books.map(b => b.id === updatedBook.id ? updatedBook : b);
    updateBooks(updated);
  };

  const handleDeleteBook = (bookId) => {
    const updated = books.filter(b => b.id !== bookId);
    updateBooks(updated);
  };

  // Member Handlers (Sequential ID enforcement)
  const handleAddMember = (memberData) => {
    const nextId = String(getNextMemberId());
    const newMember = {
      id: nextId,
      ...memberData
    };
    incrementNextMemberId();
    const updated = [...members, newMember];
    updateMembers(updated);
  };

  const handleEditMember = (updatedMember) => {
    const updated = members.map(m => String(m.id) === String(updatedMember.id) ? updatedMember : m);
    updateMembers(updated);
  };

  const handleDeleteMember = (memberId) => {
    const updated = members.filter(m => String(m.id) !== String(memberId));
    updateMembers(updated);
  };

  // Issue Book Handler
  const handleIssueBookSubmit = (issueData) => {
    const newTx = {
      id: `TX-${1000 + transactions.length + 1}`,
      ...issueData,
      returnDate: null
    };

    const updatedTxs = [newTx, ...transactions];
    updateTransactions(updatedTxs);
  };

  // Return Book Handler
  const handleReturnBookSubmit = (transactionId) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedTxs = transactions.map(tx => {
      if (tx.id === transactionId) {
        return {
          ...tx,
          status: 'Returned',
          returnDate: today
        };
      }
      return tx;
    });

    updateTransactions(updatedTxs);
  };

  // Trigger Issue/Return modal
  const handleOpenIssueModal = (bookId = '', memberId = '') => {
    setPreselectedBookId(bookId);
    setPreselectedMemberId(memberId);
    setIsIssueModalOpen(true);
  };

  // Reset System Handler
  const handleResetSystem = () => {
    setBooksData(getBooks());
    setMembersData(getMembers());
    setTransactionsData(getTransactions());
    setCurrentUserData(getCurrentUser());
    navigate('/dashboard');
  };

  // Page Title Resolver
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Librarian Dashboard';
    if (path === '/books') return 'Books Catalog Management';
    if (path === '/members') return 'Library Members Management';
    if (path.startsWith('/members/')) return 'Member Profile Details';
    if (path === '/transactions') return 'Loan Transactions Log';
    if (path === '/users') return 'User Roles & System Accounts';
    if (path === '/settings') return 'System Settings';
    if (path === '/profile') return `Member Portal — ${currentUser ? currentUser.name : ''}`;
    return 'NEXUS Library System';
  };

  // If user is not logged in, force Login page
  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login members={members} onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    );
  }

  const loggedInMemberRecord = currentUser.role === 'Member' 
    ? members.find(m => String(m.id) === String(currentUser.id)) || { id: currentUser.id, name: currentUser.name, registrationDate: '2026-01-01' }
    : null;

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header 
          pageTitle={getPageTitle()}
          currentUser={currentUser}
          onOpenIssueModal={() => handleOpenIssueModal()}
          onOpenAddBookModal={() => navigate('/books')}
          onOpenAddMemberModal={() => navigate('/members')}
        />

        <main className="page-container">
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                currentUser.role === 'Librarian' ? (
                  <Dashboard 
                    books={books}
                    members={members}
                    transactions={transactions}
                    onOpenIssueModal={() => handleOpenIssueModal()}
                    onOpenAddBookModal={() => navigate('/books')}
                    onOpenAddMemberModal={() => navigate('/members')}
                    onNavigate={(p) => navigate(p)}
                  />
                ) : (
                  <Navigate to="/profile" replace />
                )
              } 
            />

            <Route 
              path="/books" 
              element={
                <Books 
                  books={books}
                  transactions={transactions}
                  currentUser={currentUser}
                  onAddBook={handleAddBook}
                  onEditBook={handleEditBook}
                  onDeleteBook={handleDeleteBook}
                  onIssueBook={(bookId) => handleOpenIssueModal(bookId)}
                />
              } 
            />

            <Route 
              path="/members" 
              element={
                <Members 
                  members={members}
                  transactions={transactions}
                  currentUser={currentUser}
                  onAddMember={handleAddMember}
                  onEditMember={handleEditMember}
                  onDeleteMember={handleDeleteMember}
                  onSelectMember={(m) => navigate(`/members/${m.id}`)}
                />
              } 
            />

            <Route 
              path="/members/:id" 
              element={
                <MemberProfileWrapper 
                  members={members}
                  transactions={transactions}
                  books={books}
                  onReturnBook={handleReturnBookSubmit}
                  onIssueForMember={(memberId) => handleOpenIssueModal('', memberId)}
                />
              } 
            />

            <Route 
              path="/profile" 
              element={
                <MemberProfile 
                  member={loggedInMemberRecord}
                  transactions={transactions}
                  books={books}
                  onBack={() => navigate('/books')}
                  onReturnBook={handleReturnBookSubmit}
                  onIssueForMember={(memberId) => handleOpenIssueModal('', memberId)}
                />
              } 
            />

            <Route 
              path="/transactions" 
              element={
                <Transactions 
                  transactions={transactions}
                  onReturnBook={handleReturnBookSubmit}
                  currentUser={currentUser}
                />
              } 
            />

            <Route 
              path="/users" 
              element={
                <UsersPage 
                  members={members}
                  currentUser={currentUser}
                  onOpenAddMemberModal={() => navigate('/members')}
                />
              } 
            />

            <Route 
              path="/settings" 
              element={
                <SettingsPage 
                  onResetSystem={handleResetSystem}
                />
              } 
            />

            {/* Default Catch-All Redirect */}
            <Route 
              path="*" 
              element={<Navigate to={currentUser.role === 'Librarian' ? '/dashboard' : '/profile'} replace />} 
            />
          </Routes>
        </main>
      </div>

      {/* Global Issue / Return Modal */}
      <IssueReturnModal 
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        books={books}
        members={members}
        transactions={transactions}
        preselectedBookId={preselectedBookId}
        preselectedMemberId={preselectedMemberId}
        onIssueBookSubmit={handleIssueBookSubmit}
        onReturnBookSubmit={handleReturnBookSubmit}
      />
    </div>
  );
}
