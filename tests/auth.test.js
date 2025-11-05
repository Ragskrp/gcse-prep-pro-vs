const mongoose = require('mongoose');
const AuthService = require('../services/AuthService');
const User = require('../models/User');

describe('Auth Service', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gcse-prep-pro-test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            firstName: 'Test',
            lastName: 'User',
        };

        const result = await AuthService.registerUser(userData);

        expect(result.user).toHaveProperty('username', 'testuser');
        expect(result.token).toBeDefined();

        const dbUser = await User.findOne({ email: 'test@example.com' });
        expect(dbUser).toBeDefined();
    });
});
