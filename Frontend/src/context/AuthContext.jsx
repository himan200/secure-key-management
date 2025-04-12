import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize from localStorage if available
    const storedUser = localStorage.getItem('user') || null;
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('authToken', response.data.token);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    // Check auth status on initial load
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token && !user) {
            api.get('/auth/me')
                .then(response => {
                    setUser(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                })
                .catch(() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                });
        }
    }, []);

  const updateUser = async (userData) => {
    try {
      const response = await api.updateUserInfo(userData);
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.changePassword(currentPassword, newPassword);
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
