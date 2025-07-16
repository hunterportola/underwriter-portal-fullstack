import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/auth/signup', { email, password });
  return response.data;
};

// Underwriter functions
export const getPendingApplications = async () => {
  const response = await api.get('/underwriter/applications');
  return response.data;
};

export const getApplication = async (id: string) => {
  const response = await api.get(`/underwriter/applications/${id}`);
  return response.data;
};

export const approveApplication = async (applicationId: string, loanDetails: any) => {
  const response = await api.post(`/underwriter/applications/${applicationId}/approve`, loanDetails);
  return response.data;
};

export const rejectApplication = async (applicationId: string, reason: string) => {
  const response = await api.post(`/underwriter/applications/${applicationId}/reject`, { reason });
  return response.data;
};

export default api;