const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const AchievementService = require('../services/AchievementService');

router.get('/', auth, async (req, res, next) => {
    try {
        const achievements = await AchievementService.getUserAchievements(req.userId);
        res.json(achievements);
    } catch (error) {
        next(error);
    }
});

router.post('/:id', auth, async (req, res, next) => {
    try {
        const newAchievements = await AchievementService.awardAchievements(req.userId, [req.params.id]);
        res.status(201).json(newAchievements);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
