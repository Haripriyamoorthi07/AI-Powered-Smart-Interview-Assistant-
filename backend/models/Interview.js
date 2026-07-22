const mongoose = require('mongoose');

const QuestionFeedbackSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  feedback: {
    score: { type: Number, default: 0 },
    strengths: { type: String, default: '' },
    weaknesses: { type: String, default: '' },
    improvements: { type: String, default: '' },
    sampleAnswer: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    communication: { type: String, default: '' },
    technical: { type: String, default: '' },
  },
  answeredAt: { type: Date },
});

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['HR Interview', 'Technical Interview', 'Behavioral Interview', 'Coding Interview'],
    required: true,
  },
  role: {
    type: String,
    enum: [
      'Software Engineer',
      'Data Analyst',
      'AI/ML Engineer',
      'Web Developer',
      'Java Developer',
      'Python Developer',
      'Full Stack Developer'
    ],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  questions: [QuestionFeedbackSchema],
  overallFeedback: {
    overallScore: { type: Number, default: 0 },
    feedbackText: { type: String, default: '' },
    categoryScores: {
      communication: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      general: { type: Number, default: 0 },
    },
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Interview', InterviewSchema);
