// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Initialize models
require('./models/User');
require('./models/StudySession');
require('./models/QuizResult');
require('./models/Flashcard');
require('./models/Video');
require('./models/Question');
require('./models/StudyMaterial');

// Routes
app.use('/api', require('./routes/api'));

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'GCSE Prep Pro API Server Running' });
});

const handleErrors = require('./middleware/error');
// Error handling middleware
app.use(handleErrors);

// Connect to database and start server
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`GCSE Prep Pro server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    });
}

module.exports = { app };
