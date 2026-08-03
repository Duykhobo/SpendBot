import { create } from 'zustand';

interface User {
  id: string;
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  budget: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Khởi tạo state từ localStorage nếu có
  const storedToken = localStorage.getItem('jwt_token');
  const storedUser = localStorage.getItem('user_info');
  
  return {
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    
    login: (token, user) => {
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },
    
    logout: () => {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});
