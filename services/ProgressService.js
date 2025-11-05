const User = require('../Models/User');
const QuizResult = require('../Models/QuizResult');
const StudySession = require('../Models/StudySession');
const progressUtils = require('../utils/progressUtils');
const achievementSystem = require('./AchievementService');

class ProgressService {
    static async getUserProgress(userId) {
        try {
            const user = await User.findById(userId)
                .populate('studySessions')
                .populate('quizResults');

            if (!user) {
                throw new Error('User not found');
            }

            // Calculate overall statistics
            const overallProgress = progressUtils.calculateOverallProgress(user.progress);
            const studyTime = progressUtils.calculateTimeSpent(user.studySessions);
            const studyStreak = progressUtils.calculateStudyStreak(user.studySessions);
            const weeklyGoal = progressUtils.getWeeklyStudyGoal(user.targetGrades);

            // Calculate subject-specific progress
            const subjectProgress = {};
            for (const subject in user.progress) {
                const quizzes = user.quizResults.filter(quiz => quiz.subject === subject);
                const sessions = user.studySessions.filter(session => session.subject === subject);
                
                subjectProgress[subject] = {
                    progress: user.progress[subject].progress,
                    confidence: user.progress[subject].confidence,
                    grade: user.progress[subject].grade,
                    targetGrade: user.targetGrades[subject],
                    recentScores: quizzes.slice(0, 5).map(quiz => quiz.score),
                    timeSpent: progressUtils.calculateTimeSpent(sessions),
                    status: progressUtils.getProgressLabel(user.progress[subject].progress)
                };
            }

            // Get recent activity
            const recentActivity = await this.getRecentActivity(userId);

            // Get achievement progress
            const achievements = await achievementSystem.getUserAchievements(userId);

            return {
                overall: {
                    progress: overallProgress,
                    studyTime,
                    studyStreak,
                    weeklyGoal
                },
                subjects: subjectProgress,
                recentActivity,
                achievements
            };
        } catch (error) {
            throw error;
        }
    }

    static async updateSubjectProgress(userId, subject, data) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Update subject progress
            if (!user.progress[subject]) {
                user.progress[subject] = {
                    progress: 0,
                    confidence: 1,
                    grade: null
                };
            }

            if (data.progress !== undefined) {
                user.progress[subject].progress = data.progress;
            }
            if (data.confidence !== undefined) {
                user.progress[subject].confidence = data.confidence;
            }
            if (data.grade !== undefined) {
                user.progress[subject].grade = data.grade;
            }

            await user.save();

            // Check for achievements
            await this.checkProgressAchievements(userId, subject);

            return user.progress[subject];
        } catch (error) {
            throw error;
        }
    }

    static async recordStudySession(userId, sessionData) {
        try {
            const { subject, topic, duration, sessionType, notes } = sessionData;

            // Create study session
            const session = new StudySession({
                user: userId,
                subject,
                topic,
                duration,
                sessionType,
                notes
            });

            await session.save();

            // Update user's study statistics
            const user = await User.findById(userId);
            user.studySessions.push(session._id);
            user.totalStudyHours += duration / 60;
            user.lastStudyDate = new Date();

            // Update study streak
            const streak = progressUtils.calculateStudyStreak(
                [session, ...user.studySessions.filter(s => s._id !== session._id)]
            );
            user.studyStreak = streak;

            await user.save();

            // Check for achievements
            await this.checkStudyAchievements(userId, streak, user.totalStudyHours);

            return {
                session,
                streak,
                totalHours: user.totalStudyHours
            };
        } catch (error) {
            throw error;
        }
    }

    static async recordQuizResult(userId, quizData) {
        try {
            const { subject, topic, score, totalQuestions, timeSpent } = quizData;

            // Create quiz result
            const result = new QuizResult({
                user: userId,
                subject,
                topic,
                score,
                totalQuestions,
                timeSpent
            });

            await result.save();

            // Update user's quiz statistics
            const user = await User.findById(userId);
            user.quizResults.push(result._id);

            // Update subject progress based on quiz performance
            if (!user.progress[subject]) {
                user.progress[subject] = { progress: 0, confidence: 1, grade: null };
            }

            // Adjust progress based on quiz score
            const currentProgress = user.progress[subject].progress;
            const progressIncrease = (score / 100) * 5; // Max 5% increase per quiz
            user.progress[subject].progress = Math.min(100, currentProgress + progressIncrease);

            await user.save();

            // Check for achievements
            await this.checkQuizAchievements(userId, score);

            return {
                result,
                updatedProgress: user.progress[subject]
            };
        } catch (error) {
            throw error;
        }
    }

    static async getRecentActivity(userId, limit = 10) {
        try {
            const [quizResults, studySessions] = await Promise.all([
                QuizResult.find({ user: userId })
                    .sort({ date: -1 })
                    .limit(limit)
                    .select('subject topic score date'),
                StudySession.find({ user: userId })
                    .sort({ date: -1 })
                    .limit(limit)
                    .select('subject topic duration date')
            ]);

            // Combine and sort activities
            const activities = [
                ...quizResults.map(quiz => ({
                    type: 'quiz',
                    subject: quiz.subject,
                    topic: quiz.topic,
                    details: `Score: ${quiz.score}%`,
                    date: quiz.date
                })),
                ...studySessions.map(session => ({
                    type: 'study',
                    subject: session.subject,
                    topic: session.topic,
                    details: `Duration: ${progressUtils.formatStudyTime(session.duration)}`,
                    date: session.date
                }))
            ];

            return activities.sort((a, b) => b.date - a.date).slice(0, limit);
        } catch (error) {
            throw error;
        }
    }

    static async getWeeklyReport(userId) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            const [studySessions, quizResults] = await Promise.all([
                StudySession.find({
                    user: userId,
                    date: { $gte: startDate, $lte: endDate }
                }),
                QuizResult.find({
                    user: userId,
                    date: { $gte: startDate, $lte: endDate }
                })
            ]);

            // Calculate daily study time
            const dailyStudyTime = new Array(7).fill(0);
            studySessions.forEach(session => {
                const dayIndex = 6 - Math.floor((endDate - session.date) / (1000 * 60 * 60 * 24));
                if (dayIndex >= 0) {
                    dailyStudyTime[dayIndex] += session.duration;
                }
            });

            // Calculate subject performance
            const subjectPerformance = {};
            quizResults.forEach(quiz => {
                if (!subjectPerformance[quiz.subject]) {
                    subjectPerformance[quiz.subject] = {
                        totalScore: 0,
                        count: 0
                    };
                }
                subjectPerformance[quiz.subject].totalScore += quiz.score;
                subjectPerformance[quiz.subject].count += 1;
            });

            // Calculate averages
            for (const subject in subjectPerformance) {
                subjectPerformance[subject].averageScore =
                    subjectPerformance[subject].totalScore / subjectPerformance[subject].count;
            }

            return {
                dailyStudyTime,
                subjectPerformance,
                totalStudyTime: dailyStudyTime.reduce((a, b) => a + b, 0),
                quizzesTaken: quizResults.length
            };
        } catch (error) {
            throw error;
        }
    }

    // Private methods for achievement checking
    static async checkStudyAchievements(userId, streak, totalHours) {
        const achievements = [];

        // Study streak achievements
        if (streak >= 30) achievements.push('study_streak_30');
        else if (streak >= 7) achievements.push('study_streak_7');
        else if (streak >= 3) achievements.push('study_streak_3');

        // Study hours achievements
        if (totalHours >= 100) achievements.push('study_hours_100');
        else if (totalHours >= 50) achievements.push('study_hours_50');
        else if (totalHours >= 10) achievements.push('study_hours_10');

        if (achievements.length > 0) {
            await achievementSystem.awardAchievements(userId, achievements);
        }
    }

    static async checkQuizAchievements(userId, score) {
        const achievements = [];

        // Perfect score achievement
        if (score === 100) {
            achievements.push('perfect_score');
        }

        if (achievements.length > 0) {
            await achievementSystem.awardAchievements(userId, achievements);
        }
    }

    static async checkProgressAchievements(userId, subject) {
        const user = await User.findById(userId);
        const achievements = [];

        // Check subject mastery
        const progress = user.progress[subject]?.progress || 0;
        if (progress >= 90) {
            switch (subject) {
                case 'maths': achievements.push('math_master'); break;
                case 'english': achievements.push('english_expert'); break;
                case 'science': achievements.push('science_sage'); break;
                case 'geography': achievements.push('geography_guru'); break;
                case 'french': achievements.push('french_fluent'); break;
                case 'computerscience': achievements.push('coding_champion'); break;
            }
        }

        // Check all subjects progress
        const allSubjectsProgressing = Object.values(user.progress)
            .every(subj => subj.progress > 0);
        
        if (allSubjectsProgressing) {
            achievements.push('all_subjects_progress');
        }

        if (achievements.length > 0) {
            await achievementSystem.awardAchievements(userId, achievements);
        }
    }
}

module.exports = ProgressService;