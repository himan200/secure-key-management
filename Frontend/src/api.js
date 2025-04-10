// Frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Your backend base URL
  withCredentials: true // Important if you're using cookies or sessions
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
    console.log('Full API response:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
      config: response.config
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
    console.log('Processed user data:', userData); // Log processed data
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export default api;
