const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// In-memory fallback database for users if MongoDB is not connected
const mockUsers = [
  {
    id: 'mock-admin-id',
    name: 'Admin User',
    email: 'admin@assistant.com',
    passwordHash: '$2a$10$eImiTXuWVxjM72f1xLw6U.t8jX8.aA0p96F.aJ3c.sW9z4m2f2X8u', // bcrypt hash for 'admin123'
    role: 'admin',
    profile: {
      bio: 'Head of Recruiting & System Administrator.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
      targetRole: 'Full Stack Developer',
      targetDifficulty: 'Advanced'
    }
  },
  {
    id: 'mock-user-id',
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: '$2a$10$w82Hn0f1K78fXb60c4z90Oz4Y93sXW9v9gB2m1H6f4P9u0b0z9.eO', // bcrypt hash for 'password123'
    role: 'user',
    profile: {
      bio: 'Aspiring software developer preparing for tech interviews.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256',
      targetRole: 'Software Engineer',
      targetDifficulty: 'Intermediate'
    }
  }
];

// Helper to sign JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    },
    process.env.JWT_SECRET || 'supersecretjwtkey12345',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // 1. Mongoose Database Route
    if (User.db.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: email.includes('admin') ? 'admin' : 'user'
      });

      if (user) {
        return res.status(201).json({
          token: generateToken(user),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile
          }
        });
      }
    } else {
      // 2. In-Memory Mock Fallback Route
      const userExists = mockUsers.find(u => u.email === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        id: `mock-user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: email.includes('admin') ? 'admin' : 'user',
        profile: {
          bio: '',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
          targetRole: 'Software Engineer',
          targetDifficulty: 'Intermediate'
        }
      };

      mockUsers.push(newUser);

      return res.status(201).json({
        token: generateToken(newUser),
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Mongoose Database Route
    if (User.db.readyState === 1) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          token: generateToken(user),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile
          }
        });
      }
    } else {
      // 2. In-Memory Mock Fallback Route
      const user = mockUsers.find(u => u.email === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return res.json({
          token: generateToken(user),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile
          }
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Please provide email' });
  }

  // Simulate password reset success response
  res.json({ message: 'A password reset link has been simulated and sent to your email.' });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  const { name, bio, targetRole, targetDifficulty } = req.body;

  try {
    if (User.db.readyState === 1) {
      const user = await User.findById(req.user.id || req.user._id);

      if (user) {
        user.name = name || user.name;
        user.profile.bio = bio !== undefined ? bio : user.profile.bio;
        user.profile.targetRole = targetRole || user.profile.targetRole;
        user.profile.targetDifficulty = targetDifficulty || user.profile.targetDifficulty;

        const updatedUser = await user.save();

        return res.json({
          token: generateToken(updatedUser),
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profile: updatedUser.profile
          }
        });
      }
    } else {
      // In-Memory Update
      const userIndex = mockUsers.findIndex(u => u.id === req.user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex].name = name || mockUsers[userIndex].name;
        mockUsers[userIndex].profile.bio = bio !== undefined ? bio : mockUsers[userIndex].profile.bio;
        mockUsers[userIndex].profile.targetRole = targetRole || mockUsers[userIndex].profile.targetRole;
        mockUsers[userIndex].profile.targetDifficulty = targetDifficulty || mockUsers[userIndex].profile.targetDifficulty;

        const updatedUser = mockUsers[userIndex];
        return res.json({
          token: generateToken(updatedUser),
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profile: updatedUser.profile
          }
        });
      }
    }

    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Export mockUsers list for use in Admin routes
module.exports = {
  router,
  mockUsers
};
