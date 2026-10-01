import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Receipt, 
  UserCheck, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLibrarian = currentUser && currentUser.role === 'Librarian';

  const librarianNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/users', label: 'Users', icon: UserCheck },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const memberNavItems = [
    { path: '/profile', label: 'My Profile & Loans', icon: User },
    { path: '/books', label: 'Browse Catalog', icon: BookOpen },
  ];

  const navItems = isLibrarian ? librarianNavItems : memberNavItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate(isLibrarian ? '/dashboard' : '/books')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <BookOpen size={24} />
        </div>
        <div>
          <div className="brand-title">NEXUS</div>
          <div className="brand-sub">Community Library</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/members' && location.pathname.startsWith('/members/'));
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {currentUser && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{currentUser.name}</div>
            <div className="user-role">
              {isLibrarian ? 'Librarian' : 'Member'} (ID: {currentUser.id})
            </div>
          </div>
          <button 
            className="btn btn-outline" 
            onClick={onLogout} 
            title="Logout"
            style={{ padding: '0.45rem', minWidth: 'auto' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
