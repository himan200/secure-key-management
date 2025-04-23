import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
  return Promise.reject(error);
});

export const getUserData = async () => {
  try {
    // First try to get from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Please login to access this page');
    }

    // If not in localStorage, try to fetch from server with auth header
    const response = await api.get('/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const userData = {
      firstName: response.data?.firstName || '',
      lastName: response.data?.lastName || '',
      email: response.data?.email || '',
      _debug: {
        responseData: response.data
      }
    };
    
    if (!userData.firstName && !userData.lastName) {
      console.warn('Received user data without names. Full response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  return api.post('/auth/reset-password', { token, password });
};

export const register = async (registrationData) => {
  return api.post('/auth/register', registrationData);
};

export const login = async (formData) => {
  return api.post('/auth/login', formData);
};

export const verifyLoginOtp = async (userId, otp) => {
  return api.post('/auth/verify-login-otp', { userId, otp });
};

export const verifyEmail = async (token) => {
  return api.get(`/api/auth/verify-email?token=${token}`);
};

export const forgotPassword = async (email) => {
  return api.post('/auth/forgot-password', { email });
};

// Password API functions
export const getPasswords = async () => {
  return api.get('/passwords');
};

export const createPassword = async (passwordData) => {
  return api.post('/passwords', passwordData);
};

export const updatePassword = async (id, passwordData) => {
  return api.put(`/passwords/${id}`, passwordData);
};

export const deletePassword = async (id) => {
  return api.delete(`/passwords/${id}`);
};

// CryptoKey API functions
export const getKeys = async () => {
  return api.get('/keys');
};

export const createKey = async (keyData) => {
  return api.post('/keys', keyData);
};

export const deleteKey = async (id) => {
  return api.delete(`/keys/${id}`);
};

export default api;
