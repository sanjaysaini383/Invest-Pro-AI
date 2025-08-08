// routes/user.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// GET /api/user/insights
router.get('/insights', auth, async (req, res) => {
  try {
    const insights = {
      profileType: 'Balanced Investor',
      riskTolerance: 'Moderate',
      investmentStyle: 'Long-term Growth',
      behavioralTags: ['Methodical', 'ESG-Conscious', 'Tech-Savvy'],
      spendingPattern: {
        monthly: 45000,
        categories: {
          essentials: 60,
          investments: 25,
          discretionary: 15
        }
      }
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/user/spending-pattern
router.get('/spending-pattern', auth, async (req, res) => {
  try {
    const spendingPattern = {
      totalSpending: 45000,
      categories: [
        { name: 'Food & Dining', amount: 8000, percentage: 17.8 },
        { name: 'Transportation', amount: 6000, percentage: 13.3 },
        { name: 'Shopping', amount: 5500, percentage: 12.2 },
        { name: 'Entertainment', amount: 4000, percentage: 8.9 },
        { name: 'Utilities', amount: 3500, percentage: 7.8 },
        { name: 'Others', amount: 18000, percentage: 40.0 }
      ],
      trend: 'increasing',
      monthlyChange: 5.2
    };

    res.json({
      success: true,
      data: spendingPattern
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/user/behavioral-tags
router.put('/behavioral-tags', auth, async (req, res) => {
  try {
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Tags must be an array'
      });
    }

    // Mock update logic
    res.json({
      success: true,
      message: 'Behavioral tags updated successfully',
      data: { tags }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
