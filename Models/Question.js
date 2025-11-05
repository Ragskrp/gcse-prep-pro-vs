const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['foundation', 'higher'], default: 'foundation' },
    question: { type: String, required: true },
    options: [{ type: String }],
    correct: { type: Number, required: true },
    explanation: { type: String, required: true },
    marks: { type: Number, default: 1 },
    timeLimit: { type: Number, default: 60 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);