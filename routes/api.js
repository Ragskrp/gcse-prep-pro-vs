const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const userRoutes = require('./user');
const materialRoutes = require('./materials');
const progressRoutes = require('./progress');
const studySessionRoutes = require('./study-sessions');
const achievementRoutes = require('./achievements');
const quizRoutes = require('./quiz');
const flashcardRoutes = require('./flashcard');
const videoRoutes = require('./video');
const analyticsRoutes = require('./analytics');

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/materials', materialRoutes);
router.use('/progress', progressRoutes);
router.use('/study-sessions', studySessionRoutes);
router.use('/achievements', achievementRoutes);
router.use('/quiz', quizRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/videos', videoRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
