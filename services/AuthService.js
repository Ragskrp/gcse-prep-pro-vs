const User = require('../Models/User');
const PasswordService = require('./PasswordService');
const { generateToken } = require('../middleware/auth');

class AuthService {
    static async registerUser(userData) {
        try {
            const { username, email, password, firstName, lastName, school } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                throw new Error('User already exists with that email or username');
            }

            // Validate password strength
            const passwordValidation = PasswordService.validatePasswordStrength(password);
            if (!passwordValidation.isValid) {
                throw new Error(passwordValidation.errors.join(', '));
            }

            // Hash password
            const hashedPassword = await PasswordService.hashPassword(password);

            // Create user
            const user = new User({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                school
            });

            await user.save();

            // Generate token
            const token = generateToken(user._id);

            return {
                token,
                user: this.sanitizeUser(user)
            };
        } catch (error) {
            throw error;
        }
    }

    static async loginUser(credentials) {
        try {
            const { email, password } = credentials;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const isMatch = await PasswordService.comparePassword(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = generateToken(user._id);

            return {
                token,
                user: this.sanitizeUser(user)
            };
        } catch (error) {
            throw error;
        }
    }

    static async getProfile(userId) {
        try {
            const user = await User.findById(userId)
                .populate('studySessions')
                .populate('quizResults')
                .select('-password');

            if (!user) {
                throw new Error('User not found');
            }

            return this.sanitizeUser(user);
        } catch (error) {
            throw error;
        }
    }

    static async updateProfile(userId, updates) {
        try {
            const allowedUpdates = ['firstName', 'lastName', 'school', 'targetGrades', 'avatar'];
            const updateKeys = Object.keys(updates);
            const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));

            if (!isValidUpdate) {
                throw new Error('Invalid update fields');
            }

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            updateKeys.forEach(key => {
                user[key] = updates[key];
            });

            await user.save();
            return this.sanitizeUser(user);
        } catch (error) {
            throw error;
        }
    }

    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password
            const isMatch = await PasswordService.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            // Validate new password strength
            const passwordValidation = PasswordService.validatePasswordStrength(newPassword);
            if (!passwordValidation.isValid) {
                throw new Error(passwordValidation.errors.join(', '));
            }

            // Update password
            user.password = await PasswordService.hashPassword(newPassword);
            await user.save();

            return true;
        } catch (error) {
            throw error;
        }
    }

    static sanitizeUser(user) {
        const sanitized = user.toObject();
        delete sanitized.password;
        return sanitized;
    }
}

module.exports = AuthService;