const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { protect } = require('../middleware/authMiddleware');
const { generateQuestions, evaluateAnswer } = require('../utils/gemini');

// In-memory interviews fallback database
const mockInterviews = [];

// @desc    Start a new interview session
// @route   POST /api/interview
// @access  Private
router.post('/', protect, async (req, res) => {
  const { type, role, difficulty } = req.body;

  if (!type || !role || !difficulty) {
    return res.status(400).json({ message: 'Please provide type, role, and difficulty' });
  }

  try {
    // Generate questions
    const questionTexts = await generateQuestions(role, difficulty, type, 5);
    const questions = questionTexts.map(q => ({
      questionText: q,
      userAnswer: '',
      feedback: {
        score: 0,
        strengths: '',
        weaknesses: '',
        improvements: '',
        sampleAnswer: '',
        confidence: 0,
        communication: '',
        technical: ''
      }
    }));

    const sessionData = {
      userId: req.user.id || req.user._id,
      type,
      role,
      difficulty,
      status: 'in-progress',
      questions,
      overallFeedback: {
        overallScore: 0,
        feedbackText: 'Interview is in progress.',
        categoryScores: {
          communication: 0,
          technical: 0,
          general: 0
        }
      },
      startedAt: new Date()
    };

    if (Interview.db.readyState === 1) {
      const interview = await Interview.create(sessionData);
      return res.status(201).json(interview);
    } else {
      // In-Memory
      const mockSession = {
        _id: `mock-int-${Date.now()}`,
        ...sessionData
      };
      mockInterviews.push(mockSession);
      return res.status(201).json(mockSession);
    }
  } catch (error) {
    console.error('Error starting interview session:', error);
    res.status(500).json({ message: 'Failed to start interview session' });
  }
});

// @desc    Submit answer to a question and get AI evaluation
// @route   POST /api/interview/:id/answer
// @access  Private
router.post('/:id/answer', protect, async (req, res) => {
  const { questionIndex, answer } = req.body;
  const interviewId = req.params.id;

  if (questionIndex === undefined || answer === undefined) {
    return res.status(400).json({ message: 'Please provide question index and answer' });
  }

  try {
    let session;
    let isMongo = Interview.db.readyState === 1;

    if (isMongo) {
      session = await Interview.findById(interviewId);
    } else {
      session = mockInterviews.find(i => i._id === interviewId);
    }

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    if (questionIndex >= session.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    const question = session.questions[questionIndex];
    question.userAnswer = answer;
    question.answeredAt = new Date();

    // Call AI Evaluation
    const evaluation = await evaluateAnswer(
      question.questionText,
      answer,
      session.role,
      session.difficulty,
      session.type
    );

    question.feedback = evaluation;

    // Check if this was the final question
    const allAnswered = questionIndex === session.questions.length - 1;
    if (allAnswered) {
      session.status = 'completed';
      session.completedAt = new Date();

      // Aggregate overall score
      let totalScore = 0;
      let totalConfidence = 0;
      session.questions.forEach(q => {
        totalScore += q.feedback.score;
        totalConfidence += q.feedback.confidence;
      });

      const avgScore = Math.round(totalScore / session.questions.length);
      const avgConfidence = Math.round(totalConfidence / session.questions.length);

      // Simple category mappings
      const techScore = Math.min(Math.round(avgScore * 1.02), 100);
      const commScore = Math.min(Math.round(avgScore * 0.98), 100);

      session.overallFeedback = {
        overallScore: avgScore,
        feedbackText: `You completed the ${session.type} mock interview for the ${session.role} role at ${session.difficulty} level. Your average rating is ${avgScore}%. ${
          avgScore >= 80 
            ? 'Excellent performance! You demonstrate a high level of competency and clear structured articulation.' 
            : avgScore >= 60 
              ? 'Good effort. Your conceptual knowledge is sound, but you should refine your articulation and elaborate on real-world metrics.' 
              : 'You need significant practice. Focus on expanding technical details, using formal tech terms, and utilizing the STAR framework.'
        }`,
        categoryScores: {
          communication: commScore,
          technical: techScore,
          general: avgConfidence
        }
      };
    }

    // Save changes
    if (isMongo) {
      await session.save();
    }

    res.json({
      feedback: question.feedback,
      isCompleted: session.status === 'completed',
      session
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Failed to process answer evaluation' });
  }
});

// @desc    Get complete report of an interview
// @route   GET /api/interview/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const interviewId = req.params.id;

  try {
    let session;
    if (Interview.db.readyState === 1) {
      session = await Interview.findById(interviewId);
    } else {
      session = mockInterviews.find(i => i._id === interviewId);
    }

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user interview history
// @route   GET /api/interview/history
// @access  Private
router.get('/history/all', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (Interview.db.readyState === 1) {
      const history = await Interview.find({ userId }).sort({ startedAt: -1 });
      return res.json(history);
    } else {
      // In-Memory
      const history = mockInterviews
        .filter(i => String(i.userId) === String(userId))
        .sort((a, b) => b.startedAt - a.startedAt);
      return res.json(history);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = {
  router,
  mockInterviews
};
