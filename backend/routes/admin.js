const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { mockUsers } = require('./auth');
const { mockInterviews } = require('./interview');
const { mockResumes } = require('./resume');

// @desc    Get admin statistics overview
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    let usersCount = 0;
    let interviewsCount = 0;
    let resumesCount = 0;
    let globalAvgScore = 0;

    if (User.db.readyState === 1) {
      usersCount = await User.countDocuments();
      interviewsCount = await Interview.countDocuments({ status: 'completed' });
      resumesCount = await Resume.countDocuments();

      const completed = await Interview.find({ status: 'completed' });
      if (completed.length > 0) {
        const sum = completed.reduce((acc, curr) => acc + curr.overallFeedback.overallScore, 0);
        globalAvgScore = Math.round(sum / completed.length);
      }
    } else {
      // In-Memory
      usersCount = mockUsers.length;
      const completed = mockInterviews.filter(i => i.status === 'completed');
      interviewsCount = completed.length;
      resumesCount = mockResumes.length;
      if (completed.length > 0) {
        const sum = completed.reduce((acc, curr) => acc + curr.overallFeedback.overallScore, 0);
        globalAvgScore = Math.round(sum / completed.length);
      }
    }

    res.json({
      usersCount,
      interviewsCount,
      resumesCount,
      globalAvgScore,
      categories: [
        { name: 'HR Interview', count: 12 },
        { name: 'Technical Interview', count: 28 },
        { name: 'Behavioral Interview', count: 8 },
        { name: 'Coding Interview', count: 19 }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private (Admin Only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    if (User.db.readyState === 1) {
      const users = await User.find({}).select('-password');
      return res.json(users);
    } else {
      // Return details from mockUsers (omitting password hash)
      const users = mockUsers.map(u => ({
        _id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        profile: u.profile
      }));
      return res.json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  const userId = req.params.id;

  try {
    if (User.db.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.deleteOne();
      return res.json({ message: 'User deleted successfully' });
    } else {
      // In memory delete
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      mockUsers.splice(userIndex, 1);
      return res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
