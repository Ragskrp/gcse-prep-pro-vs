const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gcse-prep-pro', {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
