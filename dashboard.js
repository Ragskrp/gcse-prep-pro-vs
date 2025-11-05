// GCSE Prep Pro - Dashboard JavaScript
// Handles user authentication, data loading, and interactive features

class DashboardManager {
    constructor() {
        this.user = null;
        this.token = null;
        this.currentSection = 'dashboard';
        this.studySessions = [];
        this.quizResults = [];
        this.videos = [];
        this.flashcards = [];
        
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.updateCurrentDate();
        this.initializeAnimations();
    }
    
    checkAuthentication() {
        this.token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!this.token || !userData) {
            window.location.href = 'login.html';
            return;
        }
        
        this.user = JSON.parse(userData);
    }
    
    async loadUserData() {
        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                this.user = userData;
                this.updateUserInterface();
                this.loadDashboardData();
            } else if (response.status === 401) {
                this.logout();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    updateUserInterface() {
        // Update user name and school
        const displayName = this.user.firstName || this.user.username || 'Student';
        document.getElementById('welcome-name').textContent = displayName;
        document.getElementById('user-name').textContent = displayName;
        document.getElementById('modal-user-name').textContent = displayName;
        document.getElementById('modal-user-email').textContent = this.user.email;
        
        if (this.user.school) {
            document.getElementById('user-school').textContent = this.user.school;
        }
        
        // Update avatar
        if (this.user.avatar) {
            const avatarElements = document.querySelectorAll('#user-avatar, #sidebar-avatar, #modal-avatar');
            avatarElements.forEach(el => {
                el.src = `uploads/${this.user.avatar}`;
            });
        }
        
        // Update stats
        document.getElementById('current-streak-display').textContent = this.user.studyStreak || 0;
        document.getElementById('total-hours-display').textContent = Math.round(this.user.totalStudyHours || 0);
        document.getElementById('sidebar-streak').textContent = this.user.studyStreak || 0;
        document.getElementById('sidebar-hours').textContent = Math.round(this.user.totalStudyHours || 0);
        document.getElementById('sidebar-quizzes').textContent = this.user.quizResults?.length || 0;
        
        // Update overall grade
        const overallGrade = this.calculateOverallGrade();
        document.getElementById('overall-grade-display').textContent = overallGrade.toFixed(1);
        document.getElementById('overall-grade').textContent = overallGrade.toFixed(1);
        
        // Update settings form
        document.getElementById('settings-firstname').value = this.user.firstName || '';
        document.getElementById('settings-lastname').value = this.user.lastName || '';
        document.getElementById('settings-school').value = this.user.school || '';
        
        // Update target grades
        if (this.user.targetGrades) {
            document.getElementById('target-maths').value = this.user.targetGrades.maths || 7;
            document.getElementById('target-english').value = this.user.targetGrades.english || 6;
            document.getElementById('target-science').value = this.user.targetGrades.science || 8;
        }
    }
    
    calculateOverallGrade() {
        if (!this.user.progress) return 6.0;
        
        const subjects = Object.values(this.user.progress);
        const total = subjects.reduce((sum, subject) => sum + subject.grade, 0);
        return total / subjects.length;
    }
    
    async loadDashboardData() {
        await Promise.all([
            this.loadStudySessions(),
            this.loadQuizResults(),
            this.loadVideos(),
            this.loadFlashcards()
        ]);
        
        this.updateQuizAccuracy();
        this.loadRecentActivity();
    }
    
    async loadStudySessions() {
        try {
            const response = await fetch('/api/study-sessions?limit=10', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.studySessions = await response.json();
            }
        } catch (error) {
            console.error('Error loading study sessions:', error);
        }
    }
    
    async loadQuizResults() {
        try {
            const response = await fetch('/api/quiz-results?limit=10', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.quizResults = await response.json();
            }
        } catch (error) {
            console.error('Error loading quiz results:', error);
        }
    }
    
    async loadVideos() {
        try {
            const response = await fetch('/api/videos?limit=6');
            if (response.ok) {
                this.videos = await response.json();
                this.renderVideos();
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }
    
    async loadFlashcards() {
        try {
            const response = await fetch('/api/flashcards?limit=12', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.flashcards = await response.json();
                this.renderFlashcards();
            }
        } catch (error) {
            console.error('Error loading flashcards:', error);
        }
    }
    
    renderVideos() {
        const videoGrid = document.getElementById('video-grid');
        if (!videoGrid) return;
        
        videoGrid.innerHTML = this.videos.map(video => `
            <div class="video-card glass-card rounded-xl p-4" onclick="playVideo('${video._id}')">
                <div class="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <i class="fas fa-play text-4xl text-gray-400"></i>
                </div>
                <h3 class="font-bold mb-2">${video.title}</h3>
                <p class="text-sm text-gray-600 mb-3">${video.description}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>${video.subject.charAt(0).toUpperCase() + video.subject.slice(1)}</span>
                    <span>${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>
        `).join('');
    }
    
    renderFlashcards() {
        const flashcardGrid = document.getElementById('flashcard-grid');
        if (!flashcardGrid) return;
        
        flashcardGrid.innerHTML = this.flashcards.slice(0, 12).map(flashcard => `
            <div class="flashcard" onclick="reviewFlashcard('${flashcard._id}')">
                <div class="flashcard-inner">
                    <div class="flashcard-front glass-card" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                        <div class="text-white text-center">
                            <div class="text-lg font-bold mb-2">${flashcard.front}</div>
                            <div class="text-sm opacity-75">Click to reveal</div>
                        </div>
                    </div>
                    <div class="flashcard-back glass-card" style="background: linear-gradient(135deg, #764ba2, #667eea);">
                        <div class="text-white text-center">
                            <div class="text-lg font-bold mb-2">${flashcard.back}</div>
                            <div class="text-sm opacity-75">${flashcard.subject} - ${flashcard.topic}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateQuizAccuracy() {
        if (this.quizResults.length === 0) {
            document.getElementById('quiz-accuracy-display').textContent = '0%';
            return;
        }
        
        const recentResults = this.quizResults.slice(0, 10); // Last 10 quizzes
        const averageScore = recentResults.reduce((sum, result) => sum + result.score, 0) / recentResults.length;
        document.getElementById('quiz-accuracy-display').textContent = Math.round(averageScore) + '%';
    }
    
    loadRecentActivity() {
        const activities = [];
        
        // Add quiz results
        this.quizResults.slice(0, 3).forEach(result => {
            activities.push({
                type: 'quiz',
                subject: result.subject,
                topic: result.topic,
                score: result.score,
                date: new Date(result.date),
                icon: '🎯'
            });
        });
        
        // Add study sessions
        this.studySessions.slice(0, 3).forEach(session => {
            activities.push({
                type: 'study',
                subject: session.subject,
                topic: session.topic,
                duration: session.duration,
                date: new Date(session.date),
                icon: '📚'
            });
        });
        
        // Sort by date and take top 5
        activities.sort((a, b) => b.date - a.date);
        
        // This would update the recent activity UI
        // Implementation depends on the specific UI structure
    }
    
    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    }
    
    setupEventListeners() {
        // Navigation
        window.showSection = (section) => this.showSection(section);
        window.showUserMenu = () => this.showUserMenu();
        window.closeUserMenu = () => this.closeUserMenu();
        window.logout = () => this.logout();
        
        // Quick actions
        window.startQuickQuiz = () => this.startQuickQuiz();
        window.openFlashcards = () => this.openFlashcards();
        window.watchRecommendedVideo = () => this.watchRecommendedVideo();
        window.startStudySession = (subject, topic) => this.startStudySession(subject, topic);
        window.generateNewFocus = () => this.generateNewFocus();
        
        // Settings
        window.saveProfileSettings = () => this.saveProfileSettings();
        window.saveTargetGrades = () => this.saveTargetGrades();
        window.changeAvatar = () => this.changeAvatar();
        
        // Other functions
        window.playVideo = (videoId) => this.playVideo(videoId);
        window.reviewFlashcard = (flashcardId) => this.reviewFlashcard(flashcardId);
        window.exportProgress = () => this.exportProgress();
    }
    
    initializeAnimations() {
        anime({
            targets: '.glass-card',
            translateY: [30, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 600,
            delay: anime.stagger(100)
        });
        
        anime({
            targets: '.subject-card',
            scale: [0.9, 1],
            opacity: [0, 1],
            easing: 'easeOutBack',
            duration: 800,
            delay: anime.stagger(150, {start: 300})
        });
    }
    
    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show selected section
        const sectionEl = document.getElementById(`${section}-section`);
        if (sectionEl) {
            sectionEl.classList.remove('hidden');
            this.currentSection = section;
            
            // Update navigation
            const navItems = document.querySelectorAll('.nav-item');
            const sectionIndex = ['dashboard', 'study-plan', 'videos', 'flashcards', 'achievements', 'settings'].indexOf(section);
            if (sectionIndex !== -1 && navItems[sectionIndex]) {
                navItems[sectionIndex].classList.add('active');
            }
            
            // Load section-specific data
            this.loadSectionData(section);
            
            // Animate section appearance
            anime({
                targets: `#${section}-section`,
                opacity: [0, 1],
                translateY: [20, 0],
                easing: 'easeOutQuad',
                duration: 400
            });
        }
    }
    
    loadSectionData(section) {
        switch (section) {
            case 'videos':
                this.loadVideos();
                break;
            case 'flashcards':
                this.loadFlashcards();
                break;
            case 'achievements':
                this.loadAchievements();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    showUserMenu() {
        const modal = document.getElementById('user-menu-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        anime({
            targets: modal.querySelector('.glass-card'),
            scale: [0.8, 1],
            opacity: [0, 1],
            easing: 'easeOutBack',
            duration: 400
        });
    }
    
    closeUserMenu() {
        const modal = document.getElementById('user-menu-modal');
        
        anime({
            targets: modal.querySelector('.glass-card'),
            scale: [1, 0.8],
            opacity: [1, 0],
            easing: 'easeInBack',
            duration: 300,
            complete: () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
    
    // Quick Actions
    startQuickQuiz() {
        window.location.href = 'practice.html?mode=quick';
    }
    
    openFlashcards() {
        this.showSection('flashcards');
    }
    
    watchRecommendedVideo() {
        if (this.videos.length > 0) {
            this.playVideo(this.videos[0]._id);
        }
    }
    
    startStudySession(subject, topic) {
        // Create a study session
        const sessionData = {
            subject,
            topic,
            sessionType: 'revision',
            duration: 60,
            notes: `Focus session on ${topic}`
        };
        
        fetch('/api/study-sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(sessionData)
        })
        .then(response => {
            if (response.ok) {
                alert(`Study session started for ${subject} - ${topic}`);
                this.loadUserData(); // Refresh stats
            }
        })
        .catch(error => console.error('Error creating study session:', error));
    }
    
    generateNewFocus() {
        // Generate new focus areas based on user progress
        const subjects = ['maths', 'english', 'science', 'computerscience', 'french'];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        
        // This would generate actual focus areas based on weak topics
        alert(`New focus area generated: ${randomSubject}`);
    }
    
    // Video and Flashcard Functions
    playVideo(videoId) {
        const video = this.videos.find(v => v._id === videoId);
        if (video) {
            // In a real app, this would open a video player
            alert(`Playing video: ${video.title}\n\n${video.description}\n\nDuration: ${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`);
        }
    }
    
    reviewFlashcard(flashcardId) {
        // In a real app, this would open a flashcard review interface
        alert('Flashcard review interface would open here');
    }
    
    // Settings Functions
    async saveProfileSettings() {
        const firstName = document.getElementById('settings-firstname').value;
        const lastName = document.getElementById('settings-lastname').value;
        const school = document.getElementById('settings-school').value;
        
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ firstName, lastName, school })
            });
            
            if (response.ok) {
                alert('Profile settings saved successfully');
                this.loadUserData(); // Refresh user data
            }
        } catch (error) {
            console.error('Error saving profile settings:', error);
        }
    }
    
    async saveTargetGrades() {
        const targetGrades = {
            maths: parseInt(document.getElementById('target-maths').value),
            english: parseInt(document.getElementById('target-english').value),
            science: parseInt(document.getElementById('target-science').value)
        };
        
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ targetGrades })
            });
            
            if (response.ok) {
                alert('Target grades saved successfully');
                this.loadUserData(); // Refresh user data
            }
        } catch (error) {
            console.error('Error saving target grades:', error);
        }
    }
    
    changeAvatar() {
        // In a real app, this would open an avatar selection/upload interface
        alert('Avatar change interface would open here');
    }
    
    exportProgress() {
        // Generate a progress report
        const progressData = {
            user: this.user,
            studySessions: this.studySessions,
            quizResults: this.quizResults,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(progressData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `gcse-progress-${this.user.username}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
});