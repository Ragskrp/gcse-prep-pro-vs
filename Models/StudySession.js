const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: Number, required: true, min: 0, max: 6 },
    time: { type: String, required: true },
    subject: { type: String, required: true, enum: ['maths', 'english', 'science', 'computerscience', 'french'] },
    type: { type: String, enum: ['revision', 'homework', 'practice', 'quiz'], required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);