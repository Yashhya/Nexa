import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexaToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexaToken');
      localStorage.removeItem('nexaUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
