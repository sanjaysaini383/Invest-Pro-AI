// lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});
// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

// Investment API
export const investmentAPI = {
  getAll: () => api.get('/api/investments'),
  getById: (id) => api.get(`/api/investments/${id}`),
  create: (data) => api.post('/api/investments', data),
  update: (id, data) => api.put(`/api/investments/${id}`, data),
  delete: (id) => api.delete(`/api/investments/${id}`),
  getAnalytics: () => api.get('/api/investments/analytics'),
  getSuggestions: (filters) => api.post('/api/investments/suggestions', filters),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolio: () => api.get('/api/portfolio'),
  addInvestment: (data) => api.post('/api/portfolio/investments', data),
  removeInvestment: (id) => api.delete(`/api/portfolio/investments/${id}`),
  getPerformance: () => api.get('/api/portfolio/performance'),
  getGrowth: () => api.get('/api/portfolio/growth'),
};

// User Behavior API
export const behaviorAPI = {
  getInsights: () => api.get('/api/user/insights'),
  getSpendingPattern: () => api.get('/api/user/spending-pattern'),
  updateBehavioralTags: (tags) => api.put('/api/user/behavioral-tags', { tags }),
};

// Challenges API
export const challengesAPI = {
  getAll: () => api.get('/api/challenges'),
  participate: (challengeId) => api.post(`/api/challenges/${challengeId}/participate`),
  getLeaderboard: () => api.get('/api/challenges/leaderboard'),
  getBadges: () => api.get('/api/challenges/badges'),
};

// Round-up API
export const roundupAPI = {
  getSettings: () => api.get('/api/roundup/settings'),
  updateSettings: (settings) => api.put('/api/roundup/settings', settings),
  getHistory: () => api.get('/api/roundup/history'),
};

// Voice Commands API
export const voiceAPI = {
  processCommand: (command) => api.post('/api/voice/process', { command }),
  getCommandHistory: () => api.get('/api/voice/history'),
};

// System API
export const systemAPI = {
  healthCheck: () => api.get('/api/health'),
  getInfo: () => api.get('/'),
};

export default api;
