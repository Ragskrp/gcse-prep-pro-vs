const achievements = [
    {
        id: "first_login",
        name: "First Steps",
        description: "Welcome to GCSE Prep Pro! Complete your first login.",
        icon: "🎓",
        points: 10
    },
    {
        id: "profile_complete",
        name: "Identity Established",
        description: "Complete your student profile with all details.",
        icon: "📝",
        points: 20
    },
    {
        id: "study_streak_3",
        name: "Consistent Learner",
        description: "Maintain a study streak for 3 days.",
        icon: "🔥",
        points: 30
    },
    {
        id: "study_streak_7",
        name: "Weekly Wonder",
        description: "Maintain a study streak for 7 days.",
        icon: "✨",
        points: 50
    },
    {
        id: "study_streak_30",
        name: "Monthly Master",
        description: "Maintain a study streak for 30 days.",
        icon: "👑",
        points: 200
    },
    {
        id: "first_quiz_complete",
        name: "Quiz Pioneer",
        description: "Complete your first quiz.",
        icon: "📚",
        points: 15
    },
    {
        id: "perfect_score",
        name: "Perfect Performance",
        description: "Achieve 100% in any quiz.",
        icon: "⭐",
        points: 50
    },
    {
        id: "math_master",
        name: "Mathematics Maven",
        description: "Complete all topics in Mathematics with high scores.",
        icon: "➗",
        points: 100
    },
    {
        id: "english_expert",
        name: "English Expert",
        description: "Master all English Language topics.",
        icon: "📖",
        points: 100
    },
    {
        id: "science_sage",
        name: "Science Sage",
        description: "Excel in all Science subjects.",
        icon: "🔬",
        points: 100
    },
    {
        id: "geography_guru",
        name: "Geography Guru",
        description: "Complete all Geography topics successfully.",
        icon: "🌍",
        points: 100
    },
    {
        id: "french_fluent",
        name: "French Fluency",
        description: "Achieve mastery in French speaking and writing.",
        icon: "🇫🇷",
        points: 100
    },
    {
        id: "coding_champion",
        name: "Coding Champion",
        description: "Master Computer Science programming concepts.",
        icon: "💻",
        points: 100
    },
    {
        id: "flash_master",
        name: "Flashcard Master",
        description: "Review 100 flashcards successfully.",
        icon: "🎴",
        points: 75
    },
    {
        id: "study_hours_10",
        name: "Dedicated Student",
        description: "Complete 10 hours of study time.",
        icon: "⏱️",
        points: 50
    },
    {
        id: "study_hours_50",
        name: "Study Sensation",
        description: "Complete 50 hours of study time.",
        icon: "⭐",
        points: 150
    },
    {
        id: "study_hours_100",
        name: "Learning Legend",
        description: "Complete 100 hours of study time.",
        icon: "🌟",
        points: 300
    },
    {
        id: "all_subjects_progress",
        name: "All-Rounder",
        description: "Make progress in every subject area.",
        icon: "🎯",
        points: 150
    },
    {
        id: "practice_makes_perfect",
        name: "Practice Makes Perfect",
        description: "Complete 50 practice questions.",
        icon: "✅",
        points: 75
    },
    {
        id: "video_viewer",
        name: "Video Scholar",
        description: "Watch 20 educational videos.",
        icon: "🎥",
        points: 50
    },
    {
        id: "note_taker",
        name: "Note Master",
        description: "Create study notes for all subjects.",
        icon: "📔",
        points: 60
    },
    {
        id: "test_ace",
        name: "Test Ace",
        description: "Score above 90% in 5 different tests.",
        icon: "🏆",
        points: 100
    },
    {
        id: "speed_demon",
        name: "Speed Demon",
        description: "Complete a quiz in record time while maintaining accuracy.",
        icon: "⚡",
        points: 75
    },
    {
        id: "helping_hand",
        name: "Helping Hand",
        description: "Share study resources with classmates.",
        icon: "🤝",
        points: 40
    },
    {
        id: "early_bird",
        name: "Early Bird",
        description: "Complete study sessions before 9 AM.",
        icon: "🌅",
        points: 45
    }
];

// Achievement Levels
const achievementLevels = [
    {
        name: "Beginner",
        minPoints: 0,
        maxPoints: 199,
        icon: "🌱"
    },
    {
        name: "Intermediate",
        minPoints: 200,
        maxPoints: 499,
        icon: "🌿"
    },
    {
        name: "Advanced",
        minPoints: 500,
        maxPoints: 999,
        icon: "🌳"
    },
    {
        name: "Expert",
        minPoints: 1000,
        maxPoints: 1999,
        icon: "🎓"
    },
    {
        name: "Master",
        minPoints: 2000,
        maxPoints: Infinity,
        icon: "👑"
    }
];

// Achievement Categories
const achievementCategories = {
    study_habits: ["study_streak_3", "study_streak_7", "study_streak_30", "study_hours_10", "study_hours_50", "study_hours_100", "early_bird"],
    subject_mastery: ["math_master", "english_expert", "science_sage", "geography_guru", "french_fluent", "coding_champion"],
    test_performance: ["first_quiz_complete", "perfect_score", "test_ace", "speed_demon"],
    learning_tools: ["flash_master", "video_viewer", "note_taker", "helping_hand"],
    milestones: ["first_login", "profile_complete", "all_subjects_progress", "practice_makes_perfect"]
};

module.exports = {
    achievements,
    achievementLevels,
    achievementCategories
};