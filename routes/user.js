const express = require('express');
const router = express.Router();
const { auth, validate } = require('../middleware/auth');
const { check } = require('express-validator');
const AuthService = require('../services/AuthService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// File Upload Configuration
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/avatars';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

router.get('/profile', auth, async (req, res, next) => {
    try {
        const profile = await AuthService.getProfile(req.userId);
        res.json(profile);
    } catch (error) {
        next(error);
    }
});

router.put('/profile', auth, async (req, res, next) => {
    try {
        const updated = await AuthService.updateProfile(req.userId, req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.post('/avatar', [auth, uploadAvatar.single('avatar')], async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const updated = await AuthService.updateProfile(req.userId, { avatar: req.file.filename });
        res.json({ message: 'Avatar updated successfully', avatar: req.file.filename });
    } catch (error) {
        next(error);
    }
});

router.post('/change-password', auth, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await AuthService.changePassword(req.userId, currentPassword, newPassword);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
