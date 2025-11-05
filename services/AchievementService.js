const User = require('../Models/User');
const { achievements, achievementLevels, achievementCategories } = require('../data/achievements');

class AchievementService {
    static async getUserAchievements(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Calculate total points
            const totalPoints = this.calculateTotalPoints(user.achievements);

            // Get current level
            const currentLevel = this.getCurrentLevel(totalPoints);

            // Get achievements by category
            const categorizedAchievements = this.categorizeAchievements(user.achievements);

            // Calculate completion percentage
            const completionPercentage = (user.achievements.length / achievements.length) * 100;

            // Get next available achievements
            const nextAchievements = this.getNextAvailableAchievements(user.achievements);

            return {
                earned: user.achievements,
                totalPoints,
                currentLevel,
                categorized: categorizedAchievements,
                completion: Math.round(completionPercentage),
                next: nextAchievements
            };
        } catch (error) {
            throw error;
        }
    }

    static async awardAchievements(userId, achievementIds) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const newAchievements = [];

            for (const id of achievementIds) {
                // Check if achievement exists and isn't already awarded
                const achievementExists = achievements.find(a => a.id === id);
                const alreadyAwarded = user.achievements.includes(id);

                if (achievementExists && !alreadyAwarded) {
                    user.achievements.push(id);
                    newAchievements.push(achievementExists);
                }
            }

            if (newAchievements.length > 0) {
                await user.save();
            }

            return newAchievements;
        } catch (error) {
            throw error;
        }
    }

    static calculateTotalPoints(userAchievements) {
        return userAchievements.reduce((total, achievementId) => {
            const achievement = achievements.find(a => a.id === achievementId);
            return total + (achievement ? achievement.points : 0);
        }, 0);
    }

    static getCurrentLevel(points) {
        const level = achievementLevels.find(level => 
            points >= level.minPoints && points <= level.maxPoints
        );
        
        if (!level) return achievementLevels[0];

        const nextLevel = achievementLevels.find(l => l.minPoints > level.minPoints);
        const progress = nextLevel ? 
            ((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100 : 
            100;

        return {
            ...level,
            points,
            progress: Math.round(progress),
            nextLevel: nextLevel ? nextLevel.name : null,
            pointsToNext: nextLevel ? nextLevel.minPoints - points : 0
        };
    }

    static categorizeAchievements(userAchievements) {
        const categorized = {};

        for (const [category, categoryAchievements] of Object.entries(achievementCategories)) {
            categorized[category] = {
                earned: categoryAchievements.filter(id => userAchievements.includes(id)),
                total: categoryAchievements.length,
                achievements: categoryAchievements.map(id => {
                    const achievement = achievements.find(a => a.id === id);
                    return {
                        ...achievement,
                        earned: userAchievements.includes(id)
                    };
                })
            };
        }

        return categorized;
    }

    static getNextAvailableAchievements(userAchievements) {
        // Get unearned achievements
        const unearned = achievements.filter(a => !userAchievements.includes(a.id));

        // Sort by points (easier ones first)
        unearned.sort((a, b) => a.points - b.points);

        // Return top 3 suggested achievements
        return unearned.slice(0, 3).map(achievement => ({
            ...achievement,
            category: this.getAchievementCategory(achievement.id)
        }));
    }

    static getAchievementCategory(achievementId) {
        for (const [category, ids] of Object.entries(achievementCategories)) {
            if (ids.includes(achievementId)) {
                return category;
            }
        }
        return null;
    }

    static async checkStudyMilestones(userId, studyData) {
        const potentialAchievements = [];

        // Check study streaks
        if (studyData.streak >= 30) potentialAchievements.push('study_streak_30');
        else if (studyData.streak >= 7) potentialAchievements.push('study_streak_7');
        else if (studyData.streak >= 3) potentialAchievements.push('study_streak_3');

        // Check study hours
        const hours = studyData.totalHours || 0;
        if (hours >= 100) potentialAchievements.push('study_hours_100');
        else if (hours >= 50) potentialAchievements.push('study_hours_50');
        else if (hours >= 10) potentialAchievements.push('study_hours_10');

        if (potentialAchievements.length > 0) {
            await this.awardAchievements(userId, potentialAchievements);
        }
    }

    static async checkQuizAchievements(userId, quizData) {
        const potentialAchievements = [];

        // First quiz completion
        if (quizData.isFirst) {
            potentialAchievements.push('first_quiz_complete');
        }

        // Perfect score
        if (quizData.score === 100) {
            potentialAchievements.push('perfect_score');
        }

        // Multiple high scores
        if (quizData.highScores >= 5 && quizData.score >= 90) {
            potentialAchievements.push('test_ace');
        }

        // Speed achievement
        if (quizData.isQuickCompletion && quizData.score >= 85) {
            potentialAchievements.push('speed_demon');
        }

        if (potentialAchievements.length > 0) {
            await this.awardAchievements(userId, potentialAchievements);
        }
    }

    static async checkSubjectMasteryAchievements(userId, subjectData) {
        const potentialAchievements = [];

        // Subject-specific mastery
        if (subjectData.progress >= 90) {
            switch (subjectData.subject) {
                case 'maths': potentialAchievements.push('math_master'); break;
                case 'english': potentialAchievements.push('english_expert'); break;
                case 'science': potentialAchievements.push('science_sage'); break;
                case 'geography': potentialAchievements.push('geography_guru'); break;
                case 'french': potentialAchievements.push('french_fluent'); break;
                case 'computerscience': potentialAchievements.push('coding_champion'); break;
            }
        }

        // All subjects progress
        if (subjectData.allSubjectsProgress) {
            potentialAchievements.push('all_subjects_progress');
        }

        if (potentialAchievements.length > 0) {
            await this.awardAchievements(userId, potentialAchievements);
        }
    }
}

module.exports = AchievementService;