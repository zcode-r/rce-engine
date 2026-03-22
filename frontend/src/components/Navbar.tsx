import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, LogOut, History as HistoryIcon, User } from 'lucide-react'; // <-- Added User icon

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Grab the email from localStorage (defaults to Developer if it can't find it)
  const userEmail = localStorage.getItem('email') || 'Developer';

  const handleLogout = () => {
    logout();
    localStorage.removeItem('email'); // <-- Clear the email when logging out
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
        <Terminal color="var(--accent-color)" />
        RCE Engine
      </Link>
      
      <div>
        {isAuthenticated ? (
          /* Wrapped the buttons in a div so they sit side-by-side */
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            
            {/* --- THE NEW USER PROFILE INDICATOR --- */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              color: '#aaa', 
              fontSize: '0.9rem',
              borderRight: '1px solid var(--border-color)',
              paddingRight: '1.5rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '0.4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}>
                <User size={16} />
              </div>
              <span style={{ fontWeight: 500 }}>{userEmail}</span>
            </div>
            {/* -------------------------------------- */}

            {/* The History Link */}
            <Link 
              to="/history" 
              style={{ 
                color: 'var(--text-primary)', 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            >
              <HistoryIcon size={16} /> My History
            </Link>

            {/* Your Original Logout Button */}
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;