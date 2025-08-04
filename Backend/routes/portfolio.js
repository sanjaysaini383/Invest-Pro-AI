// routes/portfolio.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/portfolio
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = {
      totalBalance: 125000,
      gainLoss: 2.5,
      performanceScore: 85,
      investments: [
        {
          id: 1,
          name: 'Green Energy Fund',
          sector: 'Renewable Energy',
          value: 45000,
          change: 2.3,
          weight: 36
        },
        {
          id: 2,
          name: 'Tech Growth ETF',
          sector: 'Technology',
          value: 38000,
          change: -1.2,
          weight: 30.4
        },
        {
          id: 3,
          name: 'Healthcare Fund',
          sector: 'Healthcare',
          value: 42000,
          change: 1.8,
          weight: 33.6
        }
      ]
    };

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/portfolio/investments
router.post('/investments', auth, async (req, res) => {
  try {
    const { investmentId, amount } = req.body;

    if (!investmentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Investment ID and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Mock investment logic
    const investment = {
      id: investmentId,
      amount: amount,
      timestamp: new Date(),
      status: 'completed'
    };

    res.json({
      success: true,
      message: 'Investment added successfully',
      data: investment
    });
  } catch (error) {
    console.error('Add investment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/portfolio/performance
router.get('/performance', auth, async (req, res) => {
  try {
    const performance = {
      totalReturn: 12.5,
      monthlyReturn: 2.1,
      yearlyReturn: 15.8,
      volatility: 8.2,
      sharpeRatio: 1.45,
      maxDrawdown: -5.2
    };

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/portfolio/growth
router.get('/growth', auth, async (req, res) => {
  try {
    const growth = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [100000, 102000, 105000, 103000, 108000, 125000],
      percentage: [0, 2, 5, 3, 8, 25]
    };

    res.json({
      success: true,
      data: growth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
