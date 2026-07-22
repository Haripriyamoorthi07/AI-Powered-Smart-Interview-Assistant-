const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');
const { analyzeResume } = require('../utils/gemini');

// Set up multer memory storage for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are supported'), false);
    }
  }
});

// In-memory fallback resumes database
const mockResumes = [];

// @desc    Upload & analyze PDF resume
// @route   POST /api/resume/analyze
// @access  Private
router.post('/analyze', protect, (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    try {
      let resumeText = '';
      try {
        const parsedPdf = await pdfParse(req.file.buffer);
        resumeText = parsedPdf.text;
      } catch (pdfErr) {
        console.warn('PDF parsing failed, falling back to mock text extraction:', pdfErr.message);
        resumeText = 'Failed to extract text from PDF. Mock text activated.';
      }

      // Analyze resume using Gemini or Mock fallback
      const analysisResults = await analyzeResume(resumeText);

      const resumeData = {
        userId: req.user.id || req.user._id,
        fileName: req.file.originalname,
        skills: analysisResults.skills,
        missingKeywords: analysisResults.missingKeywords,
        score: analysisResults.score,
        suggestions: analysisResults.suggestions,
        analyzedAt: new Date()
      };

      if (Resume.db.readyState === 1) {
        const savedResume = await Resume.create(resumeData);
        return res.json(savedResume);
      } else {
        // In-Memory Fallback
        const mockResume = {
          _id: `mock-res-${Date.now()}`,
          ...resumeData
        };
        mockResumes.push(mockResume);
        return res.json(mockResume);
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      res.status(500).json({ message: 'Failed to analyze resume. Please try again.' });
    }
  });
});

// @desc    Get user's previous resume analyses
// @route   GET /api/resume/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (Resume.db.readyState === 1) {
      const history = await Resume.find({ userId }).sort({ analyzedAt: -1 });
      return res.json(history);
    } else {
      const history = mockResumes
        .filter(r => String(r.userId) === String(userId))
        .sort((a, b) => b.analyzedAt - a.analyzedAt);
      return res.json(history);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = {
  router,
  mockResumes
};
