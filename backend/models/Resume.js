const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  skills: [{ type: String }],
  missingKeywords: [{ type: String }],
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  suggestions: [{ type: String }],
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
