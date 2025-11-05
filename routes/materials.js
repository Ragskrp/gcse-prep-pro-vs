const express = require('express');
const router = express.Router();
const { auth, validate } = require('../middleware/auth');
const { check } = require('express-validator');
const StudyMaterial = require('../Models/StudyMaterial');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// File Upload Configuration
const studyMaterialStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/materials';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadStudyMaterial = multer({
    storage: studyMaterialStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|jpg|png|mp4|mp3/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type!'));
    }
});

router.post('/upload', [auth, uploadStudyMaterial.single('file')], async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const { subject, topic, title, description } = req.body;
        
        const material = new StudyMaterial({
            user: req.userId,
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            subject,
            topic,
            title,
            description,
            path: req.file.path
        });

        await material.save();
        res.status(201).json({ message: 'Study material uploaded successfully', material });
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

        const materials = await StudyMaterial.find(query)
            .sort({ createdAt: -1 });
        
        res.json(materials);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const material = await StudyMaterial.findOne({ _id: req.params.id, user: req.userId });
        
        if (!material) {
            return res.status(404).json({ error: 'Study material not found' });
        }

        // Delete file from filesystem
        fs.unlink(material.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
        
        // Delete from database
        await material.deleteOne();
        
        res.json({ message: 'Study material deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
