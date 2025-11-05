const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ProgressService = require('../services/ProgressService');

router.get('/', auth, async (req, res, next) => {
    try {
        const progress = await ProgressService.getUserProgress(req.userId);
        res.json(progress);
    } catch (error) {
        next(error);
    }
});

router.put('/:subject', auth, async (req, res, next) => {
    try {
        const updated = await ProgressService.updateSubjectProgress(req.userId, req.params.subject, req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.post('/study-session', auth, async (req, res, next) => {
    try {
        const result = await ProgressService.recordStudySession(req.userId, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/quiz-result', auth, async (req, res, next) => {
    try {
        const result = await ProgressService.recordQuizResult(req.userId, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/activity', auth, async (req, res, next) => {
    try {
        const { limit } = req.query;
        const activity = await ProgressService.getRecentActivity(req.userId, parseInt(limit));
        res.json(activity);
    } catch (error) {
        next(error);
    }
});

router.get('/weekly-report', auth, async (req, res, next) => {
    try {
        const report = await ProgressService.getWeeklyReport(req.userId);
        res.json(report);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
