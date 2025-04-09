// Frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/auth', // Your backend base URL
  withCredentials: true // Important if you're using cookies or sessions
});

export default api;
