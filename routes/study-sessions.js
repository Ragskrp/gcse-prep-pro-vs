const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { auth, validate } = require('../middleware/auth');
const { check } = require('express-validator');
const StudySession = require('../Models/StudySession');

const ProgressService = require('../services/ProgressService');
const AchievementService = require('../services/AchievementService');

router.post('/', auth, async (req, res, next) => {
    try {
        const { subject, topic, duration, sessionType, day, time, notes } = req.body;
        
        const session = new StudySession({
            user: req.userId,
            subject,
            topic,
            duration,
            sessionType,
            scheduledDay: day,
            scheduledTime: time,
            notes
        });

        await session.save();

        // Update user's study statistics
        const user = await User.findById(req.userId);
        user.studySessions.push(session._id);
        user.totalStudyHours += duration / 60;
        user.lastStudyDate = new Date();

        // Calculate and update study streak
        const streak = await ProgressService.calculateStudyStreak(req.userId);
        user.studyStreak = streak;

        await user.save();

        // Check for achievements
        await AchievementService.checkStudyAchievements(req.userId, {
            streak,
            totalHours: user.totalStudyHours
        });

        res.status(201).json({
            message: 'Study session saved successfully',
            session,
            streak,
            totalHours: user.totalStudyHours
        });
    } catch (error) {
        next(error);
    }
});

router.get('/', auth, async (req, res, next) => {
    try {
        const { startDate, endDate, subject } = req.query;
        const query = { user: req.userId };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (subject) {
            query.subject = subject;
        }

        const sessions = await StudySession.find(query)
            .sort({ date: -1 });

        res.json(sessions);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', auth, async (req, res, next) => {
    try {
        const { completed, notes } = req.body;
        const session = await StudySession.findOne({ _id: req.params.id, user: req.userId });

        if (!session) {
            return res.status(404).json({ error: 'Study session not found' });
        }

        if (completed !== undefined) session.completed = completed;
        if (notes) session.notes = notes;

        await session.save();

        if (completed) {
            // Update user statistics
const user = await mongoose.model('User').findById(req.userId);
            const streak = await ProgressService.calculateStudyStreak(req.userId);
            user.studyStreak = streak;
            await user.save();

            // Check for achievements
            await AchievementService.checkStudyAchievements(req.userId, {
                streak,
                totalHours: user.totalStudyHours
            });
        }

        res.json({ message: 'Study session updated successfully', session });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const session = await StudySession.findOne({ _id: req.params.id, user: req.userId });

        if (!session) {
            return res.status(404).json({ error: 'Study session not found' });
        }

        // Update user's study statistics
        const user = await User.findById(req.userId);
        user.studySessions = user.studySessions.filter(id => id.toString() !== req.params.id);
        user.totalStudyHours -= session.duration / 60;

        await Promise.all([
            session.deleteOne(),
            user.save()
        ]);

        res.json({ message: 'Study session deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
