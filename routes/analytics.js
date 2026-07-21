const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { protect } = require('../middleware/authMiddleware');
const { mockInterviews } = require('./interview');

// @desc    Get dashboard metrics & trends
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let completedInterviews = [];

    if (Interview.db.readyState === 1) {
      completedInterviews = await Interview.find({
        userId,
        status: 'completed'
      }).sort({ completedAt: 1 });
    } else {
      completedInterviews = mockInterviews
        .filter(i => String(i.userId) === String(userId) && i.status === 'completed')
        .sort((a, b) => a.completedAt - b.completedAt);
    }

    if (completedInterviews.length === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        bestCategory: 'N/A',
        weakestCategory: 'N/A',
        categoryBreakdown: {
          communication: 0,
          technical: 0,
          general: 0
        },
        performanceTrends: [],
        weeklyProgress: []
      });
    }

    // Calculations
    const totalInterviews = completedInterviews.length;
    let sumScore = 0;
    let sumComm = 0;
    let sumTech = 0;
    let sumGen = 0;

    completedInterviews.forEach(interview => {
      sumScore += interview.overallFeedback.overallScore;
      sumComm += interview.overallFeedback.categoryScores.communication || 0;
      sumTech += interview.overallFeedback.categoryScores.technical || 0;
      sumGen += interview.overallFeedback.categoryScores.general || 0;
    });

    const averageScore = Math.round(sumScore / totalInterviews);
    const avgComm = Math.round(sumComm / totalInterviews);
    const avgTech = Math.round(sumTech / totalInterviews);
    const avgGen = Math.round(sumGen / totalInterviews);

    // Categories compare
    const categories = [
      { name: 'Communication', score: avgComm },
      { name: 'Technical Knowledge', score: avgTech },
      { name: 'Confidence/General', score: avgGen }
    ];

    categories.sort((a, b) => b.score - a.score);
    const bestCategory = categories[0].name;
    const weakestCategory = categories[categories.length - 1].name;

    // Performance trends (individual interview scores)
    const performanceTrends = completedInterviews.map((int, idx) => ({
      name: `Session ${idx + 1}`,
      score: int.overallFeedback.overallScore,
      role: int.role,
      date: int.completedAt.toLocaleDateString ? int.completedAt.toLocaleDateString() : new Date(int.completedAt).toLocaleDateString()
    }));

    // Weekly progress (aggregate scores by week day or date)
    const weeklyProgress = completedInterviews.slice(-7).map(int => ({
      date: int.completedAt.toLocaleDateString ? int.completedAt.toLocaleDateString(undefined, { weekday: 'short' }) : new Date(int.completedAt).toLocaleDateString(undefined, { weekday: 'short' }),
      score: int.overallFeedback.overallScore
    }));

    res.json({
      totalInterviews,
      averageScore,
      bestCategory,
      weakestCategory,
      categoryBreakdown: {
        communication: avgComm,
        technical: avgTech,
        general: avgGen
      },
      performanceTrends,
      weeklyProgress
    });
  } catch (error) {
    console.error('Analytics processing error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
