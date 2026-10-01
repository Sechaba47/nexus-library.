import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Info
} from 'lucide-react';
import { validateBook } from '../utils/validation';

export default function Books({ 
  books = [], 
  transactions = [],
  currentUser, 
  onAddBook, 
  onEditBook, 
  onDeleteBook,
  onIssueBook 
}) {
  const isLibrarian = currentUser && currentUser.role === 'Librarian';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    quantity: 1,
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(books.map(b => b.category));
    return ['All', ...Array.from(set)];
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.isbn && book.isbn.toLowerCase().includes(q)) ||
        (book.id && book.id.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: 'Computer Science',
      publisher: '',
      publicationYear: new Date().getFullYear(),
      quantity: 1,
      description: ''
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || 'Computer Science',
      publisher: book.publisher || '',
      publicationYear: book.publicationYear || new Date().getFullYear(),
      quantity: book.quantity || 1,
      description: book.description || ''
    });
    setFormErrors({});
  };

  // Open delete dialog with Business Rule 7 check
  const handleOpenDelete = (book) => {
    // Check if book has active loans
    const activeLoans = transactions.filter(t => 
      t.bookId === book.id && (t.status === 'Active' || t.status === 'Overdue')
    );

    if (activeLoans.length > 0) {
      setDeleteError(`Cannot remove "${book.title}" because it currently has ${activeLoans.length} active loan(s). Please resolve and return active loans before deleting.`);
      setDeletingBook(book);
    } else {
      setDeleteError('');
      setDeletingBook(book);
    }
  };

  // Submit Add/Edit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const validation = validateBook(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingBook) {
      onEditBook({
        ...editingBook,
        ...formData,
        quantity: parseInt(formData.quantity, 10) || 1
      });
      setEditingBook(null);
    } else {
      const newBookId = `BK-${100 + books.length + 1}`;
      onAddBook({
        id: newBookId,
        ...formData,
        quantity: parseInt(formData.quantity, 10) || 1
      });
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingBook && !deleteError) {
      onDeleteBook(deletingBook.id);
      setDeletingBook(null);
    }
  };

  // Helper to calculate available copies for a book
  const getBookAvailability = (book) => {
    const activeLoansCount = transactions.filter(t => 
      t.bookId === book.id && (t.status === 'Active' || t.status === 'Overdue')
    ).length;
    const totalQty = parseInt(book.quantity, 10) || 1;
    const available = Math.max(0, totalQty - activeLoansCount);
    return { available, totalQty, activeLoansCount };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls Bar */}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, author, ISBN, or Book ID..."
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.55rem 0.9rem', width: 'auto' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>

        {isLibrarian && (
          <button className="btn btn-gold" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {/* Books Table */}
      {filteredBooks.length === 0 ? (
        <EmptyState 
          title="No Books Found"
          message="No catalog items matched your search query or filter."
          actionButton={isLibrarian ? (
            <button className="btn btn-gold" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add First Book</span>
            </button>
          ) : null}
        />
      ) : (
        <div className="table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title & Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Status / Copies</th>
                {isLibrarian && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => {
                const { available, totalQty } = getBookAvailability(book);
                const isAvailable = available > 0;

                return (
                  <tr key={book.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                      {book.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{book.title}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>by {book.author}</div>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.78rem', 
                        background: 'var(--bg-dark)', 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)'
                      }}>
                        {book.category}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: 'var(--text-dark)' }}>
                      {book.isbn || 'N/A'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${isAvailable ? 'badge-available' : 'badge-borrowed'}`}>
                          {isAvailable ? 'Available' : 'Borrowed'}
                        </span>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          ({available} of {totalQty} copies)
                        </span>
                      </div>
                    </td>
                    {isLibrarian && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn btn-outline" 
                            onClick={() => onIssueBook(book.id)}
                            disabled={!isAvailable}
                            title="Issue Book to Member"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', opacity: isAvailable ? 1 : 0.4 }}
                          >
                            Issue
                          </button>
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleOpenEdit(book)}
                            title="Edit Book Details"
                            style={{ padding: '0.35rem' }}
                          >
                            <Edit size={15} />
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleOpenDelete(book)}
                            title="Remove Book"
                            style={{ padding: '0.35rem' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingBook) && (
        <Modal 
          isOpen={isAddModalOpen || Boolean(editingBook)} 
          onClose={() => { setIsAddModalOpen(false); setEditingBook(null); }}
          title={editingBook ? `Edit Book (${editingBook.id})` : 'Add New Book to Library Catalog'}
        >
          <form onSubmit={handleSubmitForm}>
            <div className="form-group">
              <label className="form-label">Book Title *</label>
              <input 
                type="text" 
                className="form-input"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Designing Data-Intensive Applications"
              />
              {formErrors.title && <span style={{ color: 'var(--status-danger)', fontSize: '0.75rem' }}>{formErrors.title}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Author Name *</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Martin Kleppmann"
                />
                {formErrors.author && <span style={{ color: 'var(--status-danger)', fontSize: '0.75rem' }}>{formErrors.author}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ISBN Number</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.isbn}
                  onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="978-1449373320"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copies Quantity *</label>
                <input 
                  type="number" 
                  min="1"
                  className="form-input"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Publisher</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.publisher}
                  onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                  placeholder="O'Reilly Media"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publication Year</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={formData.publicationYear}
                  onChange={e => setFormData({ ...formData, publicationYear: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Overview</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief synopsis of the book content..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => { setIsAddModalOpen(false); setEditingBook(null); }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                {editingBook ? 'Save Changes' : 'Add Book'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Book Confirmation Dialog (With Business Rule 7 check) */}
      {deletingBook && (
        <Modal 
          isOpen={Boolean(deletingBook)} 
          onClose={() => setDeletingBook(null)}
          title="Delete Book Confirmation"
          maxWidth="450px"
        >
          {deleteError ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--status-warning)', marginBottom: '1rem' }}>
                <AlertCircle size={40} style={{ margin: '0 auto' }} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Active Loan Prevention</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {deleteError}
              </p>
              <button className="btn btn-gold" onClick={() => setDeletingBook(null)} style={{ width: '100%' }}>
                Understand & Close
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--status-danger)', marginBottom: '1rem' }}>
                <AlertCircle size={40} style={{ margin: '0 auto' }} />
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '1.5rem' }}>
                Are you sure you want to remove <strong>"{deletingBook.title}"</strong> from the library catalog?
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setDeletingBook(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>
                  Yes, Remove Book
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
