import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('workwave_token');
    const savedUser = localStorage.getItem('workwave_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('workwave_token', token);
      localStorage.setItem('workwave_user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      showToast('Logged in successfully', 'success');
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      throw error;
    }
  };

  const register = async (fullName, email, password, role) => {
    try {
      await api.post('/api/auth/register', { fullName, email, password, role });
      showToast('OTP sent to your email', 'success');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      const { token, user: userData } = response.data;
      localStorage.setItem('workwave_token', token);
      localStorage.setItem('workwave_user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      showToast('Account verified successfully', 'success');
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed';
      showToast(msg, 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('workwave_token');
    localStorage.removeItem('workwave_user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'success');
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/api/users/profile');
      localStorage.setItem('workwave_user', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      showToast('Failed to refresh profile', 'error');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, toasts, showToast, login, register, verifyOtp, logout, refreshProfile }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
