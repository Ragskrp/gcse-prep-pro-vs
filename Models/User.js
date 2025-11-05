const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'default-avatar.png' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    dateOfBirth: { type: Date },
    school: { type: String, default: '' },
    targetGrades: {
        maths: { type: Number, default: 7 },
        english: { type: Number, default: 6 },
        science: { type: Number, default: 8 },
        computerscience: { type: Number, default: 6 },
        french: { type: Number, default: 6 }
    },
    progress: {
        maths: { progress: { type: Number, default: 75 }, confidence: { type: Number, default: 4 }, grade: { type: Number, default: 7 } },
        english: { progress: { type: Number, default: 60 }, confidence: { type: Number, default: 3 }, grade: { type: Number, default: 6 } },
        science: { progress: { type: Number, default: 85 }, confidence: { type: Number, default: 5 }, grade: { type: Number, default: 8 } },
        computerscience: { progress: { type: Number, default: 65 }, confidence: { type: Number, default: 4 }, grade: { type: Number, default: 6 } },
        french: { progress: { type: Number, default: 55 }, confidence: { type: Number, default: 3 }, grade: { type: Number, default: 6 } }
    },
    studySessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudySession' }],
    quizResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizResult' }],
    achievements: [{ type: String }],
    studyStreak: { type: Number, default: 0 },
    totalStudyHours: { type: Number, default: 0 },
    lastStudyDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);