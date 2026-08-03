import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Tạo instance axios với baseURL linh hoạt thông qua Vite Proxy
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Tự động đính kèm Token
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Zustand thay vì đọc localStorage trực tiếp (tuỳ chọn)
    // Cách an toàn nhất là getState() của Zustand
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Đăng xuất
      console.warn('Unauthorized! Logging out...');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
