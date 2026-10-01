import { isOverdue } from './dateUtils';

/**
 * Calculates real-time statistics from live data arrays
 */
export function calculateLibraryStats(books = [], members = [], transactions = []) {
  // Total unique titles
  const totalTitles = books.length;

  // Total book copies across library
  const totalCopies = books.reduce((acc, b) => acc + (parseInt(b.quantity, 10) || 1), 0);

  // Active loans (transactions with status 'Active' or 'Overdue')
  const activeLoans = transactions.filter(t => t.status === 'Active' || t.status === 'Overdue');
  const totalBorrowedCopies = activeLoans.length;

  // Available copies = total copies - currently borrowed copies
  const availableCopies = Math.max(0, totalCopies - totalBorrowedCopies);

  // Overdue count calculated dynamically from due dates
  const overdueLoans = transactions.filter(t => t.status !== 'Returned' && isOverdue(t.dueDate, t.status));

  return {
    totalTitles,
    totalCopies,
    availableCopies,
    borrowedCopies: totalBorrowedCopies,
    totalMembers: members.length,
    overdueCount: overdueLoans.length,
    activeLoansCount: activeLoans.length
  };
}

/**
 * Calculates member-specific statistics
 */
export function calculateMemberStats(memberId, transactions = []) {
  const memberTx = transactions.filter(t => String(t.memberId) === String(memberId));
  const activeBorrows = memberTx.filter(t => t.status === 'Active' || t.status === 'Overdue');
  const overdueBorrows = memberTx.filter(t => t.status !== 'Returned' && isOverdue(t.dueDate, t.status));

  return {
    totalBorrowedAllTime: memberTx.length,
    activeBorrows: activeBorrows.length,
    overdueBorrows: overdueBorrows.length,
    history: memberTx
  };
}
