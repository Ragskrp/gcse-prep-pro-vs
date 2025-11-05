const express = require('express');
const router = express.Router();
const { auth, validate } = require('../middleware/auth');
const { check } = require('express-validator');
const Question = require('../Models/Question');
const QuizResult = require('../Models/QuizResult');


router.get('/questions', async (req, res, next) => {
    try {
        const { subject, topic, difficulty, limit = 10 } = req.query;
        const query = {};
        
        if (subject) query.subject = subject;
        if (topic) query.topic = topic;
        if (difficulty) query.difficulty = difficulty;

        const questions = await Question.find(query)
            .limit(parseInt(limit))
            .select('-correct -explanation'); // Don't send correct answers initially

        res.json(questions);
    } catch (error) {
        next(error);
    }
});

router.post('/results', auth, async (req, res, next) => {
    try {
        const { subject, topic, difficulty, score, correctAnswers, totalQuestions, timeSpent } = req.body;
        
        const quizResult = new QuizResult({
            user: req.userId,
            subject,
            topic,
            difficulty,
            score,
            correctAnswers,
            totalQuestions,
            timeSpent
        });

        await quizResult.save();

        // Add to user's quiz results
        const user = await mongoose.model('User').findById(req.userId);
        user.quizResults.push(quizResult._id);
        await user.save();

        res.status(201).json({ message: 'Quiz result saved', quizResult });
    } catch (error) {
        next(error);
    }
});

router.get('/results', auth, async (req, res, next) => {
    try {
        const { subject, limit = 50 } = req.query;
        const query = { user: req.userId };
        if (subject) query.subject = subject;

        const results = await QuizResult.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.json(results);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
