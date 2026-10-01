/**
 * Date utility functions for NEXUS Library System
 */

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export function isOverdue(dueDateString, status) {
  if (!dueDateString || status === 'Returned') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  return today > due;
}

export function calculateDueDate(issueDateString, loanDays = 14) {
  const issue = issueDateString ? new Date(issueDateString) : new Date();
  const due = new Date(issue);
  due.setDate(due.getDate() + parseInt(loanDays, 10));
  return due.toISOString().split('T')[0];
}

export function getDaysOverdue(dueDateString) {
  if (!dueDateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  const diffTime = today - due;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
