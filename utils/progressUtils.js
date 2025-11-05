const getSubjectIcon = (subject) => {
    const icons = {
        maths: "➗",
        english: "📚",
        science: "🔬",
        geography: "🌍",
        french: "🇫🇷",
        computerscience: "💻"
    };
    return icons[subject] || "📖";
};

const getDifficultyLabel = (score) => {
    if (score >= 90) return { label: "Easy", color: "green", emoji: "✨" };
    if (score >= 70) return { label: "Medium", color: "yellow", emoji: "⭐" };
    return { label: "Hard", color: "red", emoji: "💪" };
};

const calculateConfidenceLevel = (scores) => {
    if (!scores.length) return 0;
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.ceil(avgScore / 20); // Convert to 1-5 scale
};

const getGradeLabel = (grade) => {
    const grades = {
        9: { label: "Grade 9", description: "Outstanding performance, equivalent to A**" },
        8: { label: "Grade 8", description: "Excellent achievement, equivalent to A*" },
        7: { label: "Grade 7", description: "Very good performance, equivalent to A" },
        6: { label: "Grade 6", description: "Good performance, equivalent to high B" },
        5: { label: "Grade 5", description: "Strong pass, equivalent to low B/high C" },
        4: { label: "Grade 4", description: "Standard pass, equivalent to C" },
        3: { label: "Grade 3", description: "Basic achievement, equivalent to D" },
        2: { label: "Grade 2", description: "Limited achievement, equivalent to E" },
        1: { label: "Grade 1", description: "Minimal achievement, equivalent to F/G" }
    };
    return grades[grade] || { label: "Ungraded", description: "Not yet assessed" };
};

const calculateTimeSpent = (sessions) => {
    const totalMinutes = sessions.reduce((total, session) => total + session.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
};

const calculateStudyStreak = (sessions) => {
    if (!sessions.length) return 0;

    const today = new Date();
    const lastSession = new Date(sessions[0].date);
    const daysSinceLastSession = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));

    if (daysSinceLastSession > 1) return 0;

    let streak = 1;
    let currentDate = lastSession;

    for (let i = 1; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].date);
        const daysBetween = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));

        if (daysBetween === 1) {
            streak++;
            currentDate = sessionDate;
        } else {
            break;
        }
    }

    return streak;
};

const getProgressLabel = (progress) => {
    if (progress >= 90) return { label: "Expert", color: "green", icon: "🎓" };
    if (progress >= 75) return { label: "Advanced", color: "blue", icon: "📚" };
    if (progress >= 50) return { label: "Intermediate", color: "yellow", icon: "📝" };
    return { label: "Beginner", color: "gray", icon: "🌱" };
};

const calculateOverallProgress = (subjects) => {
    let totalProgress = 0;
    let subjectCount = 0;

    for (const subject in subjects) {
        if (subjects[subject].progress) {
            totalProgress += subjects[subject].progress;
            subjectCount++;
        }
    }

    return subjectCount ? Math.round(totalProgress / subjectCount) : 0;
};

const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getWeeklyStudyGoal = (targetGrades) => {
    // Base hours per week depending on target grades
    const baseHours = {
        9: 15,
        8: 12,
        7: 10,
        6: 8,
        5: 6,
        4: 5
    };

    let totalHours = 0;
    let subjectCount = 0;

    for (const subject in targetGrades) {
        const grade = targetGrades[subject];
        if (grade && baseHours[grade]) {
            totalHours += baseHours[grade];
            subjectCount++;
        }
    }

    // Average hours per subject, minimum 5 hours
    return Math.max(Math.round(totalHours / (subjectCount || 1)), 5);
};

module.exports = {
    getSubjectIcon,
    getDifficultyLabel,
    calculateConfidenceLevel,
    getGradeLabel,
    calculateTimeSpent,
    calculateStudyStreak,
    getProgressLabel,
    calculateOverallProgress,
    formatStudyTime,
    getWeeklyStudyGoal
};