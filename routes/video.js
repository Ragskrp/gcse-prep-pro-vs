const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/auth');
const { check } = require('express-validator');
const Video = require('../Models/Video');

const createValidation = [
    check('title').trim().notEmpty().withMessage('Title is required'),
    check('subject').trim().notEmpty().withMessage('Subject is required'),
    check('topic').trim().notEmpty().withMessage('Topic is required'),
    check('url').isURL().withMessage('URL is not valid'),
];

router.get('/', async (req, res, next) => {
    try {
        const { subject, topic, difficulty, limit = 20 } = req.query;
        const query = {};
        
        if (subject) query.subject = subject;
        if (topic) query.topic = topic;
        if (difficulty) query.difficulty = difficulty;

        const videos = await Video.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(videos);
    } catch (error) {
        next(error);
    }
});

router.post('/', [createValidation, validate], async (req, res, next) => {
    try {
        const { title, description, subject, topic, difficulty, duration, url, thumbnail } = req.body;
        
        const video = new Video({
            title,
            description,
            subject,
            topic,
            difficulty,
            duration,
            url,
            thumbnail
        });

        await video.save();
        res.status(201).json({ message: 'Video added', video });
    } catch (error) {
        next(error);
    }
});

module.exports = router;