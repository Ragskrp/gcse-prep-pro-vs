const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    difficulty: { type: Number, default: 1 },
    lastReviewed: { type: Date },
    nextReview: { type: Date },
    reviewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);