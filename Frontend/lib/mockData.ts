export const mockUser = {
  name: 'Alex Johnson',
  profileType: 'Balanced Investor',
  totalBalance: 125840.50,
  gainLoss: 8.24,
  savingsGoal: 50000,
  currentSavings: 32500
};

export const mockPortfolioGrowth = [
  { month: 'Jan', value: 85000 },
  { month: 'Feb', value: 92000 },
  { month: 'Mar', value: 98000 },
  { month: 'Apr', value: 105000 },
  { month: 'May', value: 112000 },
  { month: 'Jun', value: 125840 }
];

export const mockInvestments = [
  {
    id: 1,
    name: 'Green Energy Fund',
    sector: 'Renewable Energy',
    expectedReturn: 12.5,
    esgScore: 95,
    risk: 'Low',
    price: 2450.80,
    change: 2.3
  },
  {
    id: 2,
    name: 'Tech Growth ETF',
    sector: 'Technology',
    expectedReturn: 18.2,
    esgScore: 78,
    risk: 'High',
    price: 4890.20,
    change: -1.2
  },
  {
    id: 3,
    name: 'Healthcare Innovation',
    sector: 'Healthcare',
    expectedReturn: 15.8,
    esgScore: 88,
    risk: 'Medium',
    price: 3250.60,
    change: 4.1
  },
  {
    id: 4,
    name: 'Sustainable Infrastructure',
    sector: 'Infrastructure',
    expectedReturn: 10.5,
    esgScore: 92,
    risk: 'Low',
    price: 1890.45,
    change: 1.8
  }
];

export const mockSpendingPattern = [
  { category: 'Food & Dining', amount: 12500, color: '#3B82F6' },
  { category: 'Transportation', amount: 8500, color: '#10B981' },
  { category: 'Shopping', amount: 15200, color: '#F59E0B' },
  { category: 'Bills & Utilities', amount: 6800, color: '#EF4444' },
  { category: 'Entertainment', amount: 4200, color: '#8B5CF6' },
  { category: 'Others', amount: 3800, color: '#6B7280' }
];

export const mockBehavioralTags = [
  'Consistent Saver',
  'ESG Conscious',
  'Risk Averse',
  'Goal Oriented'
];

export const mockChallenges = [
  {
    id: 1,
    title: 'Weekly Saver',
    description: 'Invest ₹1000 this week',
    progress: 75,
    target: 1000,
    current: 750,
    reward: '50 points'
  },
  {
    id: 2,
    title: 'Green Investor',
    description: 'Invest in 3 ESG funds',
    progress: 66,
    target: 3,
    current: 2,
    reward: '100 points'
  }
];

export const mockLeaderboard = [
  { rank: 1, username: 'GreenInvestor92', points: 2850 },
  { rank: 2, username: 'SmartSaver45', points: 2720 },
  { rank: 3, username: 'EcoWarrior', points: 2650 },
  { rank: 4, username: 'YoungInvestor', points: 2480 },
  { rank: 5, username: 'WiseOwl88', points: 2350 }
];

export const mockBadges = [
  { id: 1, name: 'First Investment', icon: 'ri-medal-fill', earned: true },
  { id: 2, name: 'Green Champion', icon: 'ri-leaf-fill', earned: true },
  { id: 3, name: 'Consistent Saver', icon: 'ri-calendar-check-fill', earned: true },
  { id: 4, name: 'Risk Taker', icon: 'ri-rocket-fill', earned: false },
  { id: 5, name: 'Goal Achiever', icon: 'ri-trophy-fill', earned: false },
  { id: 6, name: 'Tech Investor', icon: 'ri-computer-fill', earned: false }
];