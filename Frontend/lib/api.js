import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if it's a token expiration
      if (error.response.data?.code === 'TOKEN_EXPIRED') {
        try {
          const refreshResponse = await api.post('/api/auth/refresh-token');
          const { token } = refreshResponse.data.data;
          
          if (token) {
            localStorage.setItem('authToken', token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      // If refresh failed or other auth error, clear storage and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login/register page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
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
  refreshToken: () => api.post('/api/auth/refresh-token'),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolio: () => api.get('/api/portfolio'),
  getPortfolios: () => api.get('/api/portfolio/all'),
  createPortfolio: (data) => api.post('/api/portfolio/create', data),
  updatePortfolio: (id, data) => api.put(`/api/portfolio/${id}`, data),
  deletePortfolio: (id) => api.delete(`/api/portfolio/${id}`),
  addInvestment: (data) => api.post('/api/portfolio/invest', data),
  updateHolding: (id, data) => api.put(`/api/portfolio/holdings/${id}`, data),
  deleteHolding: (id) => api.delete(`/api/portfolio/holdings/${id}`),
  getPerformance: (period) => api.get(`/api/portfolio/performance?period=${period}`),
  getAnalytics: () => api.get('/api/portfolio/analytics'),
};

// Investment API
export const investmentAPI = {
  getSuggestions: (filters) => api.get('/api/investments/suggestions', { params: filters }),
  getInvestmentDetails: (id) => api.get(`/api/investments/${id}`),
  searchInvestments: (query) => api.get(`/api/investments/search?q=${query}`),
  getMarketData: () => api.get('/api/investments/market-data'),
  getTrendingInvestments: () => api.get('/api/investments/trending'),
};

// User Behavior API
export const behaviorAPI = {
  getBehaviorInsights: () => api.get('/api/user/behavior-insights'),
  getPersonalityProfile: () => api.get('/api/user/personality-profile'),
  getSpendingPatterns: () => api.get('/api/user/spending-patterns'),
  getRiskAssessment: () => api.get('/api/user/risk-assessment'),
};

// Round-up API
export const roundupAPI = {
  getSettings: () => api.get('/api/roundup/settings'),
  updateSettings: (settings) => api.put('/api/roundup/settings', settings),
  getTransactions: () => api.get('/api/roundup/transactions'),
  getSavingsGoals: () => api.get('/api/roundup/goals'),
  createSavingsGoal: (goal) => api.post('/api/roundup/goals', goal),
  updateSavingsGoal: (id, goal) => api.put(`/api/roundup/goals/${id}`, goal),
  deleteSavingsGoal: (id) => api.delete(`/api/roundup/goals/${id}`),
};

// Gamification API
export const gamificationAPI = {
  getChallenges: () => api.get('/api/challenges'),
  getActiveChallenges: () => api.get('/api/challenges/active'),
  getCompletedChallenges: () => api.get('/api/challenges/completed'),
  joinChallenge: (challengeId) => api.post(`/api/challenges/${challengeId}/join`),
  updateChallengeProgress: (challengeId, progress) => api.put(`/api/challenges/${challengeId}/progress`, progress),
  
  getBadges: () => api.get('/api/user/badges'),
  getEarnedBadges: () => api.get('/api/user/badges/earned'),
  
  getUserStats: () => api.get('/api/user/stats'),
  getLeaderboard: () => api.get('/api/gamification/leaderboard'),
  getUserRank: () => api.get('/api/user/rank'),
  
  getAchievements: () => api.get('/api/user/achievements'),
  getStreaks: () => api.get('/api/user/streaks'),
  getPoints: () => api.get('/api/user/points'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/api/health')
};

export default api;
