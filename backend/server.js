const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Imports
const { router: authRouter } = require('./routes/auth');
const { router: interviewRouter } = require('./routes/interview');
const { router: resumeRouter } = require('./routes/resume');
const analyticsRouter = require('./routes/analytics');
const adminRouter = require('./routes/admin');

// Mount Routers
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

// Base route for connectivity check
app.get('/', (req, res) => {
  res.json({ message: 'AI Powered Smart Interview Assistant API is active.' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Bind Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
