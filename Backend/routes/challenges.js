// routes/challenges.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// GET /api/challenges
router.get('/', auth, async (req, res) => {
  try {
    const challenges = [
      {
        id: 1,
        title: 'Weekly Saver',
        description: 'Invest ₹1000 this week',
        progress: 75,
        target: 1000,
        current: 750,
        reward: '50 points',
        category: 'weekly',
        difficulty: 'easy',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: 'ESG Champion',
        description: 'Invest in 3 ESG funds this month',
        progress: 33,
        target: 3,
        current: 1,
        reward: '100 points + Badge',
        category: 'monthly',
        difficulty: 'medium',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: 'Diversification Master',
        description: 'Spread investments across 5 different sectors',
        progress: 60,
        target: 5,
        current: 3,
        reward: '200 points + Special Badge',
        category: 'monthly',
        difficulty: 'hard',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    res.json({ 
      success: true, 
      data: {
        challenges
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/challenges/badges
router.get('/badges', auth, async (req, res) => {
  try {
    const badges = [
      { 
        id: 1, 
        name: 'First Investment', 
        icon: 'ri-medal-fill', 
        earned: true,
        earnedAt: '2024-01-10',
        description: 'Made your first investment'
      },
      { 
        id: 2, 
        name: 'Green Champion', 
        icon: 'ri-leaf-fill', 
        earned: true,
        earnedAt: '2024-01-12',
        description: 'Invested in ESG funds'
      },
      { 
        id: 3, 
        name: 'Tech Savvy', 
        icon: 'ri-computer-line', 
        earned: false,
        description: 'Use AI features 10 times'
      },
      { 
        id: 4, 
        name: 'Streak Master', 
        icon: 'ri-fire-fill', 
        earned: false,
        description: 'Maintain 30-day investment streak'
      }
    ];

    res.json({ 
      success: true, 
      data: {
        badges,
        totalEarned: badges.filter(b => b.earned).length,
        totalAvailable: badges.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/challenges/leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const leaderboard = [
      { 
        rank: 1, 
        username: 'GreenInvestor92', 
        points: 2850,
        level: 12,
        badges: 8
      },
      { 
        rank: 2, 
        username: 'TechTrader', 
        points: 2650,
        level: 11,
        badges: 7
      },
      { 
        rank: 3, 
        username: 'ESGChampion', 
        points: 2500,
        level: 10,
        badges: 6
      },
      { 
        rank: 4, 
        username: 'YoungInvestor', 
        points: 2480,
        level: 10,
        badges: 6,
        isCurrentUser: true
      },
      { 
        rank: 5, 
        username: 'DividendKing', 
        points: 2200,
        level: 9,
        badges: 5
      }
    ];

    res.json({ 
      success: true, 
      data: {
        leaderboard,
        userRank: 4,
        totalUsers: 1247
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/challenges/:id/participate
router.post('/:id/participate', auth, async (req, res) => {
  try {
    const challengeId = req.params.id;
    
    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID is required'
      });
    }

    // Mock participation logic
    res.json({ 
      success: true, 
      message: 'Successfully joined challenge',
      data: {
        challengeId,
        joinedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
