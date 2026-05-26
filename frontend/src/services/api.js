import axios from 'axios';

const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProd ? '/api' : 'http://localhost:5000/api'),
});

// Optionally add interceptors here if needed for auth later

export default api;
