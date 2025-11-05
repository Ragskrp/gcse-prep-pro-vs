// GCSE Prep Pro - Main JavaScript File
// Handles all interactive functionality across the platform

class GCSEPrepPro {
    constructor() {
        this.studySessions = JSON.parse(localStorage.getItem('studySessions')) || [];
        this.userProgress = JSON.parse(localStorage.getItem('userProgress')) || this.getDefaultProgress();
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        this.currentModal = null;
        
        this.init();
    }
    
    init() {
        this.initializeAnimations();
        this.setupEventListeners();
        this.loadStudyPlanner();
        this.updateProgressChart();
        this.updateStats();
        this.checkAchievements();
    }
    
    getDefaultProgress() {
        return {
            maths: { progress: 75, confidence: 4, grade: 7, lastStudied: new Date().toISOString() },
            english: { progress: 60, confidence: 3, grade: 6, lastStudied: new Date().toISOString() },
            science: { progress: 85, confidence: 5, grade: 8, lastStudied: new Date().toISOString() },
            computerscience: { progress: 65, confidence: 4, grade: 6, lastStudied: new Date().toISOString() },
            french: { progress: 55, confidence: 3, grade: 6, lastStudied: new Date().toISOString() }
        };
    }
    
    initializeAnimations() {
        // Initialize text splitting for hero title
        if (typeof Splitting !== 'undefined') {
            Splitting();
            
            // Animate hero title
            anime({
                targets: '[data-splitting] .char',
                translateY: [100, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1400,
                delay: anime.stagger(30)
            });
        }
        
        // Initialize typewriter effect
        if (document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'Track your progress across all subjects',
                    'Plan your study sessions effectively',
                    'Practice with interactive quizzes',
                    'Achieve your target grades',
                    'Stay motivated and organized'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
        
        // Animate subject cards on scroll
        this.animateOnScroll();
    }
    
    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        easing: 'easeOutQuad',
                        duration: 800,
                        delay: anime.stagger(100)
                    });
                }
            });
        }, observerOptions);
        
        // Observe subject cards
        document.querySelectorAll('.subject-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe achievement badges
        document.querySelectorAll('.achievement-badge').forEach(badge => {
            observer.observe(badge);
        });
    }
    
    setupEventListeners() {
        // Study planner interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot') && !e.target.classList.contains('booked')) {
                this.openStudyModal(e.target);
            }
        });
        
        // Modal form submission
        const studyForm = document.getElementById('study-form');
        if (studyForm) {
            studyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudySession();
            });
        }

        // Reload planner data every minute
        setInterval(() => this.loadStudyPlanner(), 60000);
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'study-modal') {
                this.closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }
    
    async loadStudyPlanner() {
        const planner = document.querySelector('.study-planner');
        if (!planner) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/study-sessions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load study sessions');
            }

            this.studySessions = await response.json();
        } catch (error) {
            console.error('Error loading study sessions:', error);
            this.showNotification('Failed to load study sessions', 'error');
        }
        
        // Clear existing time slots (except day headers)
        const dayHeaders = planner.querySelectorAll('.day-header');
        planner.innerHTML = '';
        dayHeaders.forEach(header => planner.appendChild(header));
        
        // Generate time slots for each day
        const timeSlots = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '19:00', '20:00'];
        
        timeSlots.forEach((time, index) => {
            for (let day = 0; day < 7; day++) {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.dataset.day = day;
                slot.dataset.time = time;
                slot.dataset.index = index;
                
                // Check if this slot has a booked session
                const session = this.getSessionForSlot(day, time);
                if (session) {
                    slot.classList.add('booked', session.subject);
                    slot.innerHTML = `
                        <div class="text-xs text-center">
                            <div class="font-semibold">${this.getSubjectEmoji(session.subject)}</div>
                            <div>${session.type}</div>
                        </div>
                    `;
                    slot.title = `${this.getSubjectName(session.subject)} - ${session.type} (${session.duration}min)`;
                } else {
                    slot.innerHTML = '<div class="text-2xl text-gray-400">+</div>';
                }
                
                planner.appendChild(slot);
            }
        });
    }
    
    getSessionForSlot(day, time) {
        return this.studySessions.find(session => 
            session.day === day && session.time === time && 
            this.isSessionThisWeek(session)
        );
    }
    
    isSessionThisWeek(session) {
        const sessionDate = new Date(session.date);
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return sessionDate >= weekStart && sessionDate <= weekEnd;
    }
    
    getSubjectEmoji(subject) {
        const emojis = {
            maths: '📊',
            english: '📝',
            science: '🔬',
            computerscience: '💻',
            french: '🗣️'
        };
        return emojis[subject] || '📖';
    }
    
    getSubjectName(subject) {
        const names = {
            maths: 'Mathematics',
            english: 'English Language',
            science: 'Combined Science',
            computerscience: 'Computer Science',
            french: 'French'
        };
        return names[subject] || 'Study';
    }
    
    openStudyModal(slot) {
        this.currentModal = 'study-modal';
        const modal = document.getElementById('study-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Store slot information
            modal.dataset.day = slot.dataset.day;
            modal.dataset.time = slot.dataset.time;
            
            // Animate modal appearance
            anime({
                targets: modal.querySelector('.glass-card'),
                scale: [0.8, 1],
                opacity: [0, 1],
                easing: 'easeOutBack',
                duration: 400
            });
        }
    }
    
    closeModal() {
        if (this.currentModal) {
            const modal = document.getElementById(this.currentModal);
            if (modal) {
                anime({
                    targets: modal.querySelector('.glass-card'),
                    scale: [1, 0.8],
                    opacity: [1, 0],
                    easing: 'easeInBack',
                    duration: 300,
                    complete: () => {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        this.currentModal = null;
                    }
                });
            }
        }
    }
    
    addStudySession() {
        const modal = document.getElementById('study-modal');
        if (!modal) return;
        
        const subject = document.getElementById('subject-select').value;
        const sessionType = document.getElementById('session-type').value;
        const duration = parseInt(document.getElementById('duration').value);
        
        const session = {
            day: parseInt(modal.dataset.day),
            time: modal.dataset.time,
            subject: subject,
            type: sessionType,
            duration: duration,
            date: new Date().toISOString(),
            completed: false
        };

        try {
            this.saveStudySession(session)
                .then(() => {
                    this.closeModal();
                    this.showNotification('Study session added successfully!', 'success');
                    this.loadStudyPlanner();
                    this.updateStats();
                })
                .catch(error => {
                    this.showNotification('Failed to add study session', 'error');
                    console.error('Error adding study session:', error);
                });
        } catch (error) {
            this.showNotification('Failed to add study session', 'error');
            console.error('Error adding study session:', error);
        }
    }
    
    async saveStudySession(sessionData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/study-sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sessionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save study session');
            }

            const data = await response.json();
            this.studySessions.push(data.session);
            this.updateStats();
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }
    
    updateProgressChart() {
        const chartElement = document.getElementById('progress-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLine: {
                    lineStyle: {
                        color: '#2D5A3D'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#2D5A3D'
                    }
                }
            },
            series: [{
                name: 'Study Hours',
                type: 'bar',
                data: [2.5, 3, 1.5, 4, 2, 3.5, 2],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#2D5A3D' },
                        { offset: 1, color: '#7B9BB0' }
                    ])
                },
                barWidth: '60%'
            }]
        };
        
        chart.setOption(option);
        
        // Make chart responsive
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }
    
    updateStats() {
        // Update study streak
        const streakElement = document.getElementById('study-streak');
        if (streakElement) {
            const streak = this.calculateStudyStreak();
            streakElement.textContent = streak;
        }
        
        // Update total hours
        const hoursElement = document.getElementById('total-hours');
        if (hoursElement) {
            const totalHours = this.calculateTotalHours();
            hoursElement.textContent = totalHours;
        }
        
        // Update achievements count
        const achievementsElement = document.getElementById('achievements-count');
        if (achievementsElement) {
            achievementsElement.textContent = this.achievements.length;
        }
    }
    
    calculateStudyStreak() {
        // Simple streak calculation - days with study sessions
        const today = new Date();
        let streak = 0;
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            
            const hasSession = this.studySessions.some(session => {
                const sessionDate = new Date(session.date);
                return sessionDate.toDateString() === checkDate.toDateString() && session.completed;
            });
            
            if (hasSession) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        
        return Math.max(streak, 7); // Default to 7 for demo
    }
    
    calculateTotalHours() {
        const totalMinutes = this.studySessions
            .filter(session => session.completed)
            .reduce((total, session) => total + session.duration, 0);
        
        return Math.round(totalMinutes / 60) || 42; // Default to 42 for demo
    }
    
    checkAchievements() {
        // Check for new achievements based on progress
        const newAchievements = [];
        
        // First week achievement
        if (this.calculateStudyStreak() >= 7 && !this.achievements.includes('first_week')) {
            newAchievements.push('first_week');
        }
        
        // Math master achievement
        if (this.userProgress.maths.progress >= 75 && !this.achievements.includes('math_master')) {
            newAchievements.push('math_master');
        }
        
        // Study streak achievement
        if (this.calculateStudyStreak() >= 7 && !this.achievements.includes('study_streak_7')) {
            newAchievements.push('study_streak_7');
        }
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            if (!this.achievements.includes(achievement)) {
                this.achievements.push(achievement);
                this.showAchievementNotification(achievement);
            }
        });
        
        if (newAchievements.length > 0) {
            localStorage.setItem('achievements', JSON.stringify(this.achievements));
        }
    }
    
    showAchievementNotification(achievement) {
        const achievementNames = {
            'first_week': 'First Week Complete! 🏆',
            'math_master': 'Math Master! 📊',
            'study_streak_7': '7-Day Streak! 🔥'
        };
        
        this.showNotification(
            `Achievement Unlocked: ${achievementNames[achievement] || achievement}`,
            'achievement'
        );
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'achievement' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 400
        });
        
        // Remove after 4 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                easing: 'easeInQuad',
                duration: 400,
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 4000);
    }
}

// Utility functions for global access
function scrollToPlanner() {
    const planner = document.getElementById('study-planner');
    if (planner) {
        planner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function addStudySession() {
    // Open modal for adding study session
    const modal = document.getElementById('study-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Reset form
        document.getElementById('study-form').reset();
    }
}

function viewTimetable() {
    window.location.href = 'progress.html#timetable';
}

function setStudyGoals() {
    window.location.href = 'progress.html#goals';
}

function closeModal() {
    if (window.gcseApp) {
        window.gcseApp.closeModal();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gcseApp = new GCSEPrepPro();
});

// Quiz Engine Class for practice.html
class QuizEngine {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.timeSpent = 0;
        this.timer = null;
        this.isActive = false;
    }
    
    loadQuestions(subject, topic, difficulty) {
        // Sample questions database - in a real app, this would come from a server
        const questionBank = {
            maths: {
                algebra: [
                    {
                        question: "Solve for x: 2x + 5 = 13",
                        options: ["x = 4", "x = 3", "x = 6", "x = 8"],
                        correct: 0,
                        explanation: "Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4"
                    },
                    {
                        question: "Factorize: x² - 9",
                        options: ["(x-3)(x+3)", "(x-3)²", "(x+3)²", "x² - 3"],
                        correct: 0,
                        explanation: "This is a difference of squares: x² - 9 = (x-3)(x+3)"
                    }
                ],
                geometry: [
                    {
                        question: "What is the area of a circle with radius 5?",
                        options: ["25π", "10π", "20π", "15π"],
                        correct: 0,
                        explanation: "Area = πr² = π × 5² = 25π"
                    }
                ]
            },
            science: {
                chemistry: [
                    {
                        question: "What is the chemical symbol for gold?",
                        options: ["Go", "Gd", "Au", "Ag"],
                        correct: 2,
                        explanation: "Au comes from the Latin word 'aurum' meaning gold"
                    }
                ]
            },
            english: {
                language: [
                    {
                        question: "Which literary device is used in 'The wind whispered through the trees'?",
                        options: ["Simile", "Metaphor", "Personification", "Alliteration"],
                        correct: 2,
                        explanation: "Personification gives human qualities to non-human things"
                    }
                ]
            }
        };
        
        this.questions = questionBank[subject]?.[topic] || questionBank.maths.algebra;
        return this.questions;
    }
    
    startQuiz(subject, topic, difficulty = 'foundation') {
        this.loadQuestions(subject, topic, difficulty);
        this.currentQuestion = 0;
        this.score = 0;
        this.timeSpent = 0;
        this.isActive = true;
        
        this.displayQuestion();
        this.startTimer();
    }
    
    displayQuestion() {
        const container = document.getElementById('quiz-container');
        if (!container || this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        container.innerHTML = `
            <div class="glass-card rounded-2xl p-8">
                <div class="flex justify-between items-center mb-6">
                    <div class="text-sm text-gray-600">
                        Question ${this.currentQuestion + 1} of ${this.questions.length}
                    </div>
                    <div class="text-sm font-semibold" style="color: var(--sage-green);">
                        Score: ${this.score}/${this.currentQuestion}
                    </div>
                </div>
                
                <h3 class="text-xl font-bold mb-6">${question.question}</h3>
                
                <div class="space-y-3 mb-6">
                    ${question.options.map((option, index) => `
                        <button onclick="quizEngine.selectAnswer(${index})" 
                                class="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-sage-green transition-all">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    `).join('')}
                </div>
                
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        Time: <span id="quiz-timer">0:00</span>
                    </div>
                    <button onclick="quizEngine.nextQuestion()" 
                            class="px-6 py-2 rounded-lg font-semibold text-white" style="background: var(--sage-green);">
                        Next Question
                    </button>
                </div>
            </div>
        `;
    }
    
    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        if (isCorrect) {
            this.score++;
        }
        
        // Show feedback
        this.showAnswerFeedback(selectedIndex, question.correct, question.explanation);
    }
    
    showAnswerFeedback(selected, correct, explanation) {
        const buttons = document.querySelectorAll('#quiz-container button');
        
        buttons.forEach((button, index) => {
            if (index === correct) {
                button.classList.add('bg-green-500', 'text-white', 'border-green-500');
            } else if (index === selected && index !== correct) {
                button.classList.add('bg-red-500', 'text-white', 'border-red-500');
            }
            button.disabled = true;
        });
        
        // Show explanation
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200';
        explanationDiv.innerHTML = `
            <div class="font-semibold text-blue-800 mb-2">Explanation:</div>
            <div class="text-blue-700">${explanation}</div>
        `;
        
        document.querySelector('#quiz-container .glass-card').appendChild(explanationDiv);
    }
    
    nextQuestion() {
        this.currentQuestion++;
        this.displayQuestion();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeSpent++;
            const timerElement = document.getElementById('quiz-timer');
            if (timerElement) {
                const minutes = Math.floor(this.timeSpent / 60);
                const seconds = this.timeSpent % 60;
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    finishQuiz() {
        this.isActive = false;
        clearInterval(this.timer);
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const container = document.getElementById('quiz-container');
        
        container.innerHTML = `
            <div class="glass-card rounded-2xl p-8 text-center">
                <div class="text-6xl mb-4">${percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}</div>
                <h3 class="text-2xl font-bold mb-4">Quiz Complete!</h3>
                <div class="text-xl mb-6">
                    You scored <span class="font-bold" style="color: var(--sage-green);">${this.score}/${this.questions.length}</span> 
                    (${percentage}%)
                </div>
                <div class="mb-6">
                    <div class="text-sm text-gray-600 mb-2">Time taken: ${Math.floor(this.timeSpent / 60)}:${(this.timeSpent % 60).toString().padStart(2, '0')}</div>
                    <div class="text-sm text-gray-600">Average time per question: ${Math.round(this.timeSpent / this.questions.length)} seconds</div>
                </div>
                <div class="flex gap-4 justify-center">
                    <button onclick="quizEngine.restartQuiz()" 
                            class="px-6 py-3 rounded-lg font-semibold text-white" style="background: var(--sage-green);">
                        Try Again
                    </button>
                    <button onclick="window.location.href='progress.html'" 
                            class="px-6 py-3 rounded-lg border-2 font-semibold" style="border-color: var(--sage-green); color: var(--sage-green);">
                        View Progress
                    </button>
                </div>
            </div>
        `;
        
        // Save quiz result
        this.saveQuizResult({
            date: new Date().toISOString(),
            subject: 'maths', // This would be dynamic
            score: percentage,
            timeSpent: this.timeSpent,
            correctAnswers: this.score,
            totalQuestions: this.questions.length
        });
    }
    
    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeSpent = 0;
        this.displayQuestion();
        this.startTimer();
    }
    
    saveQuizResult(result) {
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        results.push(result);
        localStorage.setItem('quizResults', JSON.stringify(results));
    }
}

// Progress Tracker Class for progress.html
class ProgressTracker {
    constructor() {
        this.userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
        this.quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        this.studySessions = JSON.parse(localStorage.getItem('studySessions')) || [];
    }
    
    updateSubjectProgress(subject, newProgress) {
        if (!this.userProgress[subject]) {
            this.userProgress[subject] = { progress: 0, confidence: 1, grade: 1 };
        }
        
        this.userProgress[subject].progress = newProgress;
        this.userProgress[subject].lastStudied = new Date().toISOString();
        
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
    }
    
    updateConfidence(subject, confidence) {
        if (!this.userProgress[subject]) {
            this.userProgress[subject] = { progress: 0, confidence: 1, grade: 1 };
        }
        
        this.userProgress[subject].confidence = confidence;
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
    }
    
    getGradePrediction(subject) {
        const progress = this.userProgress[subject];
        if (!progress) return 4; // Default grade
        
        // Simple grade prediction based on progress and confidence
        const baseGrade = Math.min(9, Math.floor(progress.progress / 10) + 4);
        const confidenceBonus = Math.min(2, Math.floor(progress.confidence / 2));
        
        return Math.min(9, baseGrade + confidenceBonus);
    }
    
    generateProgressReport() {
        const subjects = Object.keys(this.userProgress);
        const report = {
            overallProgress: 0,
            subjects: {},
            recommendations: []
        };
        
        let totalProgress = 0;
        
        subjects.forEach(subject => {
            const progress = this.userProgress[subject];
            const predictedGrade = this.getGradePrediction(subject);
            
            report.subjects[subject] = {
                progress: progress.progress,
                confidence: progress.confidence,
                predictedGrade: predictedGrade,
                lastStudied: progress.lastStudied
            };
            
            totalProgress += progress.progress;
            
            // Generate recommendations
            if (progress.progress < 50) {
                report.recommendations.push(`Focus more on ${subject} - you're at ${progress.progress}%`);
            }
            
            if (progress.confidence < 3) {
                report.recommendations.push(`Build confidence in ${subject} with more practice`);
            }
        });
        
        report.overallProgress = Math.round(totalProgress / subjects.length);
        
        return report;
    }
}

// Initialize quiz engine if on practice page
if (window.location.pathname.includes('practice.html')) {
    window.quizEngine = new QuizEngine();
}

// Initialize progress tracker if on progress page
if (window.location.pathname.includes('progress.html')) {
    window.progressTracker = new ProgressTracker();
}