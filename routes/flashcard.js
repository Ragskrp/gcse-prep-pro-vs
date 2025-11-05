const express = require('express');
const router = express.Router();
const { auth, validate } = require('../middleware/auth');
const { check } = require('express-validator');
const Flashcard = require('../Models/Flashcard');

router.post('/', auth, async (req, res, next) => {
    try {
        const { subject, topic, front, back } = req.body;
        
        const flashcard = new Flashcard({
            user: req.userId,
            subject,
            topic,
            front,
            back,
            nextReview: new Date()
        });

        await flashcard.save();
        res.status(201).json({ message: 'Flashcard created', flashcard });
    } catch (error) {
        next(error);
    }
});

router.get('/', auth, async (req, res, next) => {
    try {
        const { subject, topic } = req.query;
        const query = { user: req.userId };
        
        if (subject) query.subject = subject;
        if (topic) query.topic = topic;

        const flashcards = await Flashcard.find(query)
            .sort({ nextReview: 1 });

        res.json(flashcards);
    } catch (error) {
        next(error);
    }
});

router.put('/:id/review', auth, async (req, res, next) => {
    try {
        const { difficulty } = req.body;
        const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.userId });
        
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        // Simple spaced repetition algorithm
        const now = new Date();
        let nextReviewDays;
        
        switch (difficulty) {
            case 1: // Hard - review in 1 day
                nextReviewDays = 1;
                break;
            case 2: // Medium - review in 3 days
                nextReviewDays = 3;
                break;
            case 3: // Easy - review in 7 days
                nextReviewDays = 7;
                break;
            default:
                nextReviewDays = 1;
        }

        flashcard.lastReviewed = now;
        flashcard.nextReview = new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000);
        flashcard.reviewCount += 1;
        flashcard.difficulty = difficulty;

        await flashcard.save();
        res.json({ message: 'Flashcard reviewed', flashcard });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
