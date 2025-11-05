const bcrypt = require('bcryptjs');

class PasswordService {
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static validatePasswordStrength(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[!@#$%^&*]/.test(password);

        const errors = [];
        
        if (password.length < minLength) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!hasUppercase) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!hasLowercase) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!hasNumbers) {
            errors.push('Password must contain at least one number');
        }
        if (!hasSpecialChars) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            errors,
            strength: this.calculatePasswordStrength(password)
        };
    }

    static calculatePasswordStrength(password) {
        let strength = 0;

        // Length check
        if (password.length >= 12) {
            strength += 2;
        } else if (password.length >= 8) {
            strength += 1;
        }

        // Character variety
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[!@#$%^&*]/.test(password)) strength += 1;

        // Additional complexity
        if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$/.test(password)) {
            strength += 1;
        }

        return {
            score: Math.min(strength, 5),
            label: this.getStrengthLabel(strength)
        };
    }

    static getStrengthLabel(strength) {
        switch (true) {
            case strength <= 2:
                return 'Weak';
            case strength <= 4:
                return 'Moderate';
            default:
                return 'Strong';
        }
    }
}

module.exports = PasswordService;