import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hirehub_access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('hirehub_refresh');

      if (refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = res.data.access;
          localStorage.setItem('hirehub_access', newAccess);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (refreshErr) {
          // Token refresh expired or invalid
          localStorage.removeItem('hirehub_access');
          localStorage.removeItem('hirehub_refresh');
          localStorage.removeItem('hirehub_user');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
