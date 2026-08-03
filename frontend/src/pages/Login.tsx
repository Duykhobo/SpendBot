import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import TelegramLoginWidget from '../components/TelegramLoginWidget';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  // Đã login thì đẩy luôn vào dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTelegramAuth = async (user: any) => {
    try {
      // Gửi thẳng object user mà Widget Telegram trả về lên Backend
      const response = await axios.post('/api/auth/telegram', user);

      if (response.data.success) {
        // Lưu token và user vào Zustand
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Lỗi xác thực Telegram:', error);
      alert('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        <h1 style={{ color: 'var(--color-cta)', fontSize: '2.5rem', marginBottom: '1rem' }}>SpenseBot</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: '1.5' }}>
          Hệ thống quản lý chi tiêu cá nhân thông minh. Đăng nhập để xem báo cáo tài chính của bạn.
        </p>

        {/* Cần điền tên Bot chính xác vào prop botName */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TelegramLoginWidget botName="Duykhobobot" onAuth={handleTelegramAuth} />
        </div>
      </div>
    </div>
  );
};

export default Login;
