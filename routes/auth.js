const express = require('express');
const router = express.Router();
const { registerValidation, loginValidation, validate } = require('../middleware/auth');
const AuthService = require('../services/AuthService');

router.post('/register', [registerValidation, validate], async (req, res, next) => {
    try {
        const result = await AuthService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/login', [loginValidation, validate], async (req, res, next) => {
    try {
        const result = await AuthService.loginUser(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
