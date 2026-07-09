import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Outgoing Request Interceptor: Automatically bundles bearer tokens on demand
api.interceptors.request.use(
  (config) => {
    const profileSession = localStorage.getItem('crm_user_session');
    if (profileSession) {
      const { token } = JSON.parse(profileSession);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catches runtime operational auth authorization breakdowns
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session trace validation failed. Clearing state contexts.');
      Storage.removeItem('crm_user_session');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;