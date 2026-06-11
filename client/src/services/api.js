import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Lead APIs
export const leadAPI = {
  getAllLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  updateLeadStatus: (id, status) => api.put(`/leads/${id}/status`, { status }),
  getStatistics: () => api.get('/leads/statistics'),
  getRecentActivities: (limit = 10) => api.get('/leads/activities', { params: { limit } }),
};

// Integration APIs
export const integrationAPI = {
  getAllIntegrations: () => api.get('/integrations'),
  getIntegration: (id) => api.get(`/integrations/${id}`),
  createIntegration: (data) => api.post('/integrations', data),
  updateIntegration: (id, data) => api.put(`/integrations/${id}`, data),
  deleteIntegration: (id) => api.delete(`/integrations/${id}`),
  testIntegration: (id) => api.post(`/integrations/${id}/test`),
};

export default api;
