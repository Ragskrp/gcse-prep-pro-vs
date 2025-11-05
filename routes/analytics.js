const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

const StudySession = require('../Models/StudySession');
const QuizResult = require('../Models/QuizResult');

router.get('/dashboard', auth, async (req, res, next) => {
    try {
        const user = await mongoose.model('User').findById(req.userId)
            .populate('studySessions')
            .populate('quizResults');

        // Calculate statistics
        const totalSessions = user.studySessions.length;
        const totalQuizzes = user.quizResults.length;
        const averageScore = user.quizResults.length > 0 
            ? user.quizResults.reduce((sum, result) => sum + result.score, 0) / user.quizResults.length 
            : 0;

        // Weekly study hours
        const weeklyHours = await StudySession.aggregate([
            { $match: { user: req.userId, date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: { $dayOfWeek: '$date' }, totalHours: { $sum: { $divide: ['$duration', 60] } } } },
            { $sort: { _id: 1 } }
        ]);

        // Subject performance
        const subjectPerformance = await QuizResult.aggregate([
            { $match: { user: req.userId } },
            { $group: { _id: '$subject', averageScore: { $avg: '$score' }, totalAttempts: { $sum: 1 } } },
            { $sort: { averageScore: -1 } }
        ]);

        res.json({
            totalSessions,
            totalQuizzes,
            averageScore: Math.round(averageScore),
            studyStreak: user.studyStreak,
            totalStudyHours: Math.round(user.totalStudyHours),
            weeklyHours,
            subjectPerformance,
            achievements: user.achievements,
            progress: user.progress
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
