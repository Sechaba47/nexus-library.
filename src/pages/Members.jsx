import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { getNextMemberId } from '../utils/storage';
import { formatDate } from '../utils/dateUtils';
import { validateMember } from '../utils/validation';

export default function Members({ 
  members = [], 
  transactions = [],
  currentUser, 
  onAddMember, 
  onEditMember, 
  onDeleteMember,
  onSelectMember 
}) {
  const isLibrarian = currentUser && currentUser.role === 'Librarian';

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [activeLoanWarning, setActiveLoanWarning] = useState('');

  // Auto-assigned next ID display
  const nextAssignedId = useMemo(() => getNextMemberId(), [members]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const q = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        String(member.id).includes(q) ||
        (member.email && member.email.toLowerCase().includes(q)) ||
        (member.phone && member.phone.toLowerCase().includes(q))
      );
    });
  }, [members, searchQuery]);

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active'
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      status: member.status || 'Active'
    });
    setFormErrors({});
  };

  // Open delete dialog with Business Rule 5 check
  const handleOpenDelete = (member) => {
    const activeLoans = transactions.filter(t => 
      String(t.memberId) === String(member.id) && (t.status === 'Active' || t.status === 'Overdue')
    );

    if (activeLoans.length > 0) {
      setActiveLoanWarning(`Warning: ${member.name} currently has ${activeLoans.length} active borrowed book(s). Please confirm if you wish to remove this member record.`);
    } else {
      setActiveLoanWarning('');
    }
    setDeletingMember(member);
  };

  // Submit Add / Edit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const validation = validateMember(formData, members);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingMember) {
      onEditMember({
        ...editingMember,
        ...formData
      });
      setEditingMember(null);
    } else {
      onAddMember({
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0]
      });
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingMember) {
      onDeleteMember(deletingMember.id);
      setDeletingMember(null);
    }
  };

  // Get active borrows count for a member
  const getMemberActiveBorrows = (memberId) => {
    return transactions.filter(t => 
      String(t.memberId) === String(memberId) && (t.status === 'Active' || t.status === 'Overdue')
    ).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Next Available ID Indicator */}
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
            placeholder="Search member name, ID (e.g. 901020500), email..."
          />

          <div style={{
            background: 'var(--bg-surface)',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            Next Available Member ID: <strong style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{nextAssignedId}</strong>
          </div>
        </div>

        {isLibrarian && (
          <button className="btn btn-gold" onClick={handleOpenAdd}>
            <UserPlus size={16} />
            <span>Add New Member ({nextAssignedId})</span>
          </button>
        )}
      </div>

      {/* Members Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState 
          title="No Members Found"
          message="No library members matched your search filter."
          actionButton={isLibrarian ? (
            <button className="btn btn-gold" onClick={handleOpenAdd}>
              <UserPlus size={16} />
              <span>Add Member {nextAssignedId}</span>
            </button>
          ) : null}
        />
      ) : (
        <div className="table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Full Name</th>
                <th>Contact Info</th>
                <th>Address</th>
                <th>Registration</th>
                <th>Active Loans</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => {
                const activeLoansCount = getMemberActiveBorrows(member.id);
                return (
                  <tr key={member.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      {member.id}
                    </td>
                    <td>
                      <div 
                        style={{ fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        onClick={() => onSelectMember(member)}
                      >
                        <span>{member.name}</span>
                        <ExternalLink size={13} color="var(--accent-gold)" />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{member.email || 'N/A'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{member.phone || 'N/A'}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {member.address || 'N/A'}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {formatDate(member.registrationDate)}
                    </td>
                    <td>
                      <span className={`badge ${activeLoansCount > 0 ? 'badge-borrowed' : 'badge-available'}`}>
                        {activeLoansCount} Borrowed
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => onSelectMember(member)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          Profile
                        </button>
                        {isLibrarian && (
                          <>
                            <button 
                              className="btn btn-outline" 
                              onClick={() => handleOpenEdit(member)}
                              title="Edit Member"
                              style={{ padding: '0.35rem' }}
                            >
                              <Edit size={15} />
                            </button>
                            <button 
                              className="btn btn-danger" 
                              onClick={() => handleOpenDelete(member)}
                              title="Remove Member"
                              style={{ padding: '0.35rem' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {(isAddModalOpen || editingMember) && (
        <Modal 
          isOpen={isAddModalOpen || Boolean(editingMember)} 
          onClose={() => { setIsAddModalOpen(false); setEditingMember(null); }}
          title={editingMember ? `Edit Member Details (${editingMember.id})` : `Add New Library Member (Assigned ID: ${nextAssignedId})`}
        >
          <form onSubmit={handleSubmitForm}>
            <div className="form-group">
              <label className="form-label">Assigned Member ID</label>
              <input 
                type="text" 
                className="form-input"
                disabled
                value={editingMember ? editingMember.id : nextAssignedId}
                style={{ opacity: 0.7, fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                IDs are strictly sequential and non-duplicating.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-input"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mohapi Thoabala"
              />
              {formErrors.name && <span style={{ color: 'var(--status-danger)', fontSize: '0.75rem' }}>{formErrors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mohapi@nexuslibrary.org"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+266 5801 0500"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="P.O. Box 104, Maseru"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => { setIsAddModalOpen(false); setEditingMember(null); }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                {editingMember ? 'Save Member' : `Register Member (${nextAssignedId})`}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Member Confirmation Dialog (With Business Rule 5 active loan warning) */}
      {deletingMember && (
        <Modal 
          isOpen={Boolean(deletingMember)} 
          onClose={() => setDeletingMember(null)}
          title="Remove Member Confirmation"
          maxWidth="460px"
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: activeLoanWarning ? 'var(--status-warning)' : 'var(--status-danger)', marginBottom: '1rem' }}>
              <AlertCircle size={40} style={{ margin: '0 auto' }} />
            </div>

            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Remove {deletingMember.name} (ID: {deletingMember.id})
            </h4>

            {activeLoanWarning && (
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '0.85rem', borderRadius: 'var(--radius-md)', color: 'var(--status-warning)', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                {activeLoanWarning}
              </div>
            )}

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this member record? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeletingMember(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Confirm Removal
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
