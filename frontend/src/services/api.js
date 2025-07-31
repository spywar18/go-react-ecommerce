import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => 
    api.post('/users/login', { username, password }),
  
  register: (userData) => 
    api.post('/users', userData),
};

export const productsAPI = {
  getAll: () => api.get('/items'),
  create: (item) => api.post('/items', item),
};

export const cartAPI = {
  add: (item) => api.post('/carts', item),
  get: () => api.get('/carts'),
};

export const ordersAPI = {
  create: (order) => api.post('/orders', order),
  get: () => api.get('/orders'),
};

export default api;