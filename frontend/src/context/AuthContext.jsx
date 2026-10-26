import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hirehub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hirehub_access') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('hirehub_access');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me/');
          setUser(res.data);
          localStorage.setItem('hirehub_user', JSON.stringify(res.data));
        } catch (err) {
          // Handled by axios interceptor
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login/', { email, password });
    const { user: userData, access, refresh } = res.data;

    localStorage.setItem('hirehub_access', access);
    localStorage.setItem('hirehub_refresh', refresh);
    localStorage.setItem('hirehub_user', JSON.stringify(userData));

    setUser(userData);
    setToken(access);
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register/', formData);
    const { user: userData, access, refresh } = res.data;

    localStorage.setItem('hirehub_access', access);
    localStorage.setItem('hirehub_refresh', refresh);
    localStorage.setItem('hirehub_user', JSON.stringify(userData));

    setUser(userData);
    setToken(access);
    return userData;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('hirehub_refresh');
      if (refresh) {
        await api.post('/auth/logout/', { refresh });
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('hirehub_access');
      localStorage.removeItem('hirehub_refresh');
      localStorage.removeItem('hirehub_user');
      setUser(null);
      setToken(null);
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me/');
      setUser(res.data);
      localStorage.setItem('hirehub_user', JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshCurrentUser,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
