// routes/roundup.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// GET /api/roundup/settings
router.get('/settings', auth, async (req, res) => {
  try {
    const settings = {
      enabled: true,
      roundUpTo: 10,
      portfolio: 'balanced',
      savingsGoal: 50000,
      currentSavings: 32500,
      dailyLimit: 100,
      monthlyLimit: 3000
    };

    res.json({
      success: true,
      data: {
        settings
      }
    });
  } catch (error) {
    console.error('Get roundup settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// PUT /api/roundup/settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { enabled, roundUpTo, portfolio, savingsGoal, dailyLimit, monthlyLimit } = req.body;

    // Validate input
    if (roundUpTo && ![1, 5, 10, 20, 50, 100].includes(roundUpTo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid round up amount. Must be 1, 5, 10, 20, 50, or 100'
      });
    }

    // Mock save settings
    const updatedSettings = {
      enabled: enabled !== undefined ? enabled : true,
      roundUpTo: roundUpTo || 10,
      portfolio: portfolio || 'balanced',
      savingsGoal: savingsGoal || 50000,
      dailyLimit: dailyLimit || 100,
      monthlyLimit: monthlyLimit || 3000
    };

    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      data: {
        settings: updatedSettings
      }
    });
  } catch (error) {
    console.error('Update roundup settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/roundup/history
router.get('/history', auth, async (req, res) => {
  try {
    const history = [
      {
        id: 1,
        date: '2024-01-15',
        transaction: 'Coffee Shop',
        amount: 237,
        roundedAmount: 240,
        roundUpAmount: 3,
        invested: true
      },
      {
        id: 2,
        date: '2024-01-14',
        transaction: 'Grocery Store',
        amount: 1847,
        roundedAmount: 1850,
        roundUpAmount: 3,
        invested: true
      }
    ];

    res.json({
      success: true,
      data: {
        history,
        totalRoundUps: 6,
        totalInvested: 156.50
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
