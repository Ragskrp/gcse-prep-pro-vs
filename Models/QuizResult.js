const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String, default: '' },
    difficulty: { type: String, enum: ['foundation', 'higher'], default: 'foundation' },
    score: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeSpent: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);