const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['foundation', 'higher'], default: 'foundation' },
    duration: { type: Number, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);