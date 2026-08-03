import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1rem 2rem'
    }}>
      <div>
        <h2 style={{ margin: 0, color: 'var(--color-cta)' }}>SpenseBot</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{ fontWeight: 500 }}>
              Hi, {user.firstName} {user.lastName || ''}
            </span>
            <button onClick={handleLogout} className="glass-button" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Đăng xuất
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
