// routes/investments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/investments - Get all investments
router.get('/', auth, async (req, res) => {
  try {
    // Mock data for now
    const investments = [
      {
        id: 1,
        name: 'Green Energy Fund',
        sector: 'Renewable Energy',
        price: 2450.80,
        change: 2.3,
        return: '+12.5%'
      },
      {
        id: 2,
        name: 'Tech Growth ETF',
        sector: 'Technology',
        price: 4890.20,
        change: -1.2,
        return: '+8.2%'
      },
      {
        id: 3,
        name: 'Healthcare Fund',
        sector: 'Healthcare',
        price: 3200.50,
        change: 1.8,
        return: '+15.1%'
      }
    ];

    res.json({
      success: true,
      data: investments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/investments/suggestions
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { risk, industry, esg } = req.body;
    
    // Mock data for now - implement actual filtering logic
    let suggestions = [
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
        name: 'Healthcare Innovation Fund',
        sector: 'Healthcare',
        expectedReturn: 15.8,
        esgScore: 82,
        risk: 'Medium',
        price: 3200.50,
        change: 1.8
      },
      {
        id: 4,
        name: 'Sustainable Infrastructure ETF',
        sector: 'Infrastructure',
        expectedReturn: 11.2,
        esgScore: 90,
        risk: 'Low',
        price: 1800.30,
        change: 0.9
      }
    ];

    // Apply filters
    if (risk && risk !== 'All') {
      suggestions = suggestions.filter(s => s.risk === risk);
    }
    if (industry && industry !== 'All') {
      suggestions = suggestions.filter(s => s.sector.includes(industry));
    }
    if (esg && esg !== 'All') {
      if (esg === 'High (80+)') {
        suggestions = suggestions.filter(s => s.esgScore >= 80);
      } else if (esg === 'Medium (60-79)') {
        suggestions = suggestions.filter(s => s.esgScore >= 60 && s.esgScore < 80);
      } else if (esg === 'Low (<60)') {
        suggestions = suggestions.filter(s => s.esgScore < 60);
      }
    }

    res.json({ 
      success: true, 
      data: {
        suggestions: suggestions
      }
    });
  } catch (error) {
    console.error('Investment suggestions error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get investment suggestions'
    });
  }
});

// GET /api/investments/analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const analytics = {
      totalInvestments: 15,
      totalValue: 125000,
      todayChange: 2.5,
      topPerformer: 'Green Energy Fund',
      worstPerformer: 'Oil & Gas ETF'
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
