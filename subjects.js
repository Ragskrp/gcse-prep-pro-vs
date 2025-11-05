// GCSE Prep Pro - Subjects JavaScript
// Handles subject navigation, content loading, and interactive features

class SubjectsManager {
    constructor() {
        this.currentSubject = 'maths';
        this.user = null;
        this.token = null;
        this.videos = [];
        this.flashcards = [];
        this.currentVideo = null;
        
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.loadSubjectContent();
        this.initializeAnimations();
    }
    
    checkAuthentication() {
        this.token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!this.token || !userData) {
            // Allow access to subjects page even without login
            console.log('User not logged in - showing demo content');
            return;
        }
        
        this.user = JSON.parse(userData);
    }
    
    async loadUserData() {
        if (!this.token) return;
        
        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.user = await response.json();
                this.updateUserInterface();
            } else if (response.status === 401) {
                // Continue with demo content
                console.log('Authentication expired - showing demo content');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    updateUserInterface() {
        if (!this.user) return;
        
        // Update user avatar
        if (this.user.avatar) {
            const avatarElements = document.querySelectorAll('#user-avatar');
            avatarElements.forEach(el => {
                el.src = `uploads/${this.user.avatar}`;
            });
        }
    }
    
    setupEventListeners() {
        // Subject selection
        window.selectSubject = (subject) => this.selectSubject(subject);
        window.openTopic = (topic) => this.openTopic(topic);
        window.openResource = (resource) => this.openResource(resource);
        window.createFlashcards = () => this.createFlashcards();
        window.loadMoreVideos = (subject) => this.loadMoreVideos(subject);
        
        // Video modal
        window.playVideo = (videoId) => this.playVideo(videoId);
        window.closeVideoModal = () => this.closeVideoModal();
        window.markVideoWatched = () => this.markVideoWatched();
        window.addToStudyList = () => this.addToStudyList();
        
        // Flashcard functions
        window.flipCard = (card) => this.flipCard(card);
        window.reviewFlashcard = (flashcardId) => this.reviewFlashcard(flashcardId);
        
        // Wizard learning path
        window.startWizardPath = () => this.startWizardPath();
    }
    
    selectSubject(subject) {
        this.currentSubject = subject;
        
        // Update navigation
        document.querySelectorAll('.subject-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-subject="${subject}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.subject-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const targetContent = document.getElementById(`${subject}-content`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
        } else {
            // Show maths content as default
            document.getElementById('maths-content').classList.remove('hidden');
        }
        
        // Load subject-specific content
        this.loadSubjectContent(subject);
        
        // Animate content appearance
        anime({
            targets: targetContent || '#maths-content',
            opacity: [0, 1],
            translateY: [30, 0],
            easing: 'easeOutQuad',
            duration: 400
        });
    }
    
    loadSubjectContent(subject = this.currentSubject) {
        this.loadVideos(subject);
        this.loadFlashcards(subject);
        this.updateSubjectProgress(subject);
    }
    
    async loadVideos(subject) {
        try {
            const response = await fetch(`/api/videos?subject=${subject}&limit=6`);
            if (response.ok) {
                this.videos = await response.json();
                this.renderVideos(subject);
            }
        } catch (error) {
            console.error('Error loading videos:', error);
            this.renderDemoVideos(subject);
        }
    }
    
    renderVideos(subject) {
        const videoContainer = document.getElementById(`${subject}-videos`);
        if (!videoContainer) return;
        
        if (this.videos.length === 0) {
            this.renderDemoVideos(subject);
            return;
        }
        
        videoContainer.innerHTML = this.videos.map(video => `
            <div class="video-card glass-card rounded-xl p-4" onclick="playVideo('${video._id}')">
                <div class="video-thumbnail aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-play-circle text-4xl text-gray-400 mb-2"></i>
                        <div class="text-xs text-gray-500">${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</div>
                    </div>
                </div>
                <h3 class="font-bold mb-2">${video.title}</h3>
                <p class="text-sm text-gray-600 mb-3">${video.description}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span class="capitalize">${video.difficulty}</span>
                    <span>${video.views} views</span>
                </div>
            </div>
        `).join('');
    }
    
    renderDemoVideos(subject) {
        const videoContainer = document.getElementById(`${subject}-videos`);
        if (!videoContainer) return;
        
        const demoVideos = this.getDemoVideos(subject);
        
        videoContainer.innerHTML = demoVideos.map(video => `
            <div class="video-card glass-card rounded-xl p-4" onclick="playVideo('${video.id}')">
                <div class="video-thumbnail aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-play-circle text-4xl text-gray-400 mb-2"></i>
                        <div class="text-xs text-gray-500">${video.duration}</div>
                    </div>
                </div>
                <h3 class="font-bold mb-2">${video.title}</h3>
                <p class="text-sm text-gray-600 mb-3">${video.description}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span class="capitalize">${video.difficulty}</span>
                    <span>${video.views} views</span>
                </div>
            </div>
        `).join('');
    }
    
    getDemoVideos(subject) {
        const videoSets = {
            maths: [
                {
                    id: 'maths-video-1',
                    title: 'Introduction to Algebra - GCSE Maths',
                    description: 'Learn the basics of algebra including variables, equations, and solving techniques',
                    duration: '20:15',
                    difficulty: 'foundation',
                    views: 1250
                },
                {
                    id: 'maths-video-2',
                    title: 'Quadratic Equations Explained',
                    description: 'Master quadratic equations with step-by-step examples and practice problems',
                    duration: '18:30',
                    difficulty: 'foundation',
                    views: 980
                },
                {
                    id: 'maths-video-3',
                    title: 'Geometry - Area and Volume',
                    description: 'Calculate areas and volumes of various shapes with practical examples',
                    duration: '25:45',
                    difficulty: 'higher',
                    views: 750
                }
            ],
            english: [
                {
                    id: 'english-video-1',
                    title: 'Creative Writing Techniques',
                    description: 'Learn effective techniques for creative and descriptive writing',
                    duration: '22:10',
                    difficulty: 'foundation',
                    views: 890
                },
                {
                    id: 'english-video-2',
                    title: 'Reading Comprehension Strategies',
                    description: 'Improve your reading skills with proven comprehension strategies',
                    duration: '19:25',
                    difficulty: 'foundation',
                    views: 650
                }
            ],
            science: [
                {
                    id: 'science-video-1',
                    title: 'Photosynthesis Process',
                    description: 'Understand the complete photosynthesis process in plants',
                    duration: '16:40',
                    difficulty: 'foundation',
                    views: 1100
                },
                {
                    id: 'science-video-2',
                    title: 'Chemical Reactions and Equations',
                    description: 'Learn to balance chemical equations and understand reaction types',
                    duration: '24:15',
                    difficulty: 'higher',
                    views: 820
                }
            ],
            computerscience: [
                {
                    id: 'cs-video-1',
                    title: 'Python Programming Basics',
                    description: 'Introduction to Python programming with hands-on examples',
                    duration: '28:30',
                    difficulty: 'foundation',
                    views: 2100
                },
                {
                    id: 'cs-video-2',
                    title: 'Algorithms and Data Structures',
                    description: 'Learn fundamental algorithms and data structures in computer science',
                    duration: '32:15',
                    difficulty: 'higher',
                    views: 1450
                }
            ],
            french: [
                {
                    id: 'french-video-1',
                    title: 'French Grammar - Past Tense',
                    description: 'Master the passé composé with clear explanations and practice',
                    duration: '18:20',
                    difficulty: 'foundation',
                    views: 670
                },
                {
                    id: 'french-video-2',
                    title: 'Essential French Vocabulary',
                    description: 'Learn 100 essential French words and phrases for daily conversation',
                    duration: '15:45',
                    difficulty: 'foundation',
                    views: 920
                }
            ]
        };
        
        return videoSets[subject] || [];
    }
    
    async loadFlashcards(subject) {
        if (!this.token) {
            this.renderDemoFlashcards(subject);
            return;
        }
        
        try {
            const response = await fetch(`/api/flashcards?subject=${subject}&limit=6`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.flashcards = await response.json();
                this.renderFlashcards(subject);
            } else {
                this.renderDemoFlashcards(subject);
            }
        } catch (error) {
            console.error('Error loading flashcards:', error);
            this.renderDemoFlashcards(subject);
        }
    }
    
    renderFlashcards(subject) {
        const flashcardContainer = document.getElementById(`${subject}-flashcards`);
        if (!flashcardContainer) return;
        
        if (this.flashcards.length === 0) {
            this.renderDemoFlashcards(subject);
            return;
        }
        
        flashcardContainer.innerHTML = this.flashcards.slice(0, 6).map(flashcard => `
            <div class="flashcard" onclick="reviewFlashcard('${flashcard._id}')">
                <div class="flashcard-inner">
                    <div class="flashcard-front glass-card" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                        <div class="text-white text-center">
                            <div class="text-lg font-bold mb-2">${flashcard.front}</div>
                            <div class="text-sm opacity-75">${flashcard.topic}</div>
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
    
    renderDemoFlashcards(subject) {
        const flashcardContainer = document.getElementById(`${subject}-flashcards`);
        if (!flashcardContainer) return;
        
        const demoFlashcards = this.getDemoFlashcards(subject);
        
        flashcardContainer.innerHTML = demoFlashcards.map(flashcard => `
            <div class="flashcard" onclick="flipCard(this)">
                <div class="flashcard-inner">
                    <div class="flashcard-front glass-card" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                        <div class="text-white text-center">
                            <div class="text-lg font-bold mb-2">${flashcard.front}</div>
                            <div class="text-sm opacity-75">${flashcard.topic}</div>
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
    
    getDemoFlashcards(subject) {
        const flashcardSets = {
            maths: [
                {
                    front: 'What is the quadratic formula?',
                    back: 'x = (-b ± √(b² - 4ac)) / 2a',
                    topic: 'Algebra'
                },
                {
                    front: 'What is Pythagoras\' theorem?',
                    back: 'a² + b² = c²',
                    topic: 'Geometry'
                },
                {
                    front: 'Area of a circle?',
                    back: 'A = πr²',
                    topic: 'Geometry'
                }
            ],
            english: [
                {
                    front: 'What is personification?',
                    back: 'Giving human qualities to non-human things',
                    topic: 'Language Techniques'
                },
                {
                    front: 'What is a simile?',
                    back: 'Comparing two things using "like" or "as"',
                    topic: 'Language Techniques'
                }
            ],
            science: [
                {
                    front: 'Chemical symbol for gold?',
                    back: 'Au',
                    topic: 'Chemistry'
                },
                {
                    front: 'What is photosynthesis?',
                    back: 'Process where plants convert light energy to chemical energy',
                    topic: 'Biology'
                }
            ],
            computerscience: [
                {
                    front: 'What does CPU stand for?',
                    back: 'Central Processing Unit',
                    topic: 'Computer Systems'
                },
                {
                    front: 'What is a loop in programming?',
                    back: 'A control structure that repeats a block of code',
                    topic: 'Programming'
                }
            ],
            french: [
                {
                    front: 'How do you say "hello" in French?',
                    back: 'Bonjour',
                    topic: 'Vocabulary'
                },
                {
                    front: 'What is "thank you" in French?',
                    back: 'Merci',
                    topic: 'Vocabulary'
                }
            ]
        };
        
        return flashcardSets[subject] || [];
    }
    
    updateSubjectProgress(subject) {
        // Update progress bars based on user data
        if (!this.user || !this.user.progress) return;
        
        const progress = this.user.progress[subject];
        if (!progress) return;
        
        // Update progress bars in the UI
        const progressBars = document.querySelectorAll(`#${subject}-content .progress-bar`);
        progressBars.forEach(bar => {
            const width = bar.style.width;
            if (width) {
                const percentage = parseInt(width);
                // Could update with actual user progress here
            }
        });
    }
    
    initializeAnimations() {
        anime({
            targets: '.subject-nav-item',
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 600,
            delay: anime.stagger(100)
        });
        
        anime({
            targets: '.topic-card',
            translateY: [30, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 800,
            delay: anime.stagger(150, {start: 300})
        });
        
        anime({
            targets: '.flashcard',
            scale: [0.8, 1],
            opacity: [0, 1],
            easing: 'easeOutBack',
            duration: 600,
            delay: anime.stagger(200, {start: 500})
        });
    }
    
    // Interactive Functions
    openTopic(topic) {
        // In a real app, this would navigate to detailed topic content
        alert(`Opening ${topic} topic. This would show detailed study materials, video tutorials, and practice questions for ${topic}.`);
    }
    
    openResource(resource) {
        const resources = {
            video: 'Video Tutorials: Access our complete library of expert-led video lessons',
            worksheet: 'Practice Worksheets: Download printable worksheets with answer keys',
            pastpapers: 'Past Papers: Practice with real exam questions from previous years',
            formula: 'Formula Sheet: Complete reference guide with all required formulas'
        };
        
        alert(resources[resource] || 'Resource coming soon!');
    }
    
    createFlashcards() {
        // In a real app, this would open a flashcard creation interface
        alert('Flashcard creation feature coming soon! You\'ll be able to create custom flashcard decks for any topic.');
    }
    
    loadMoreVideos(subject) {
        alert(`Loading all videos for ${subject}. This would show a complete video library with filtering and search options.`);
    }
    
    // Video Functions
    playVideo(videoId) {
        const video = this.videos.find(v => v._id === videoId) || this.getDemoVideo(videoId);
        if (!video) return;
        
        this.currentVideo = video;
        
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = video.description;
        
        const modal = document.getElementById('video-modal');
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
    
    getDemoVideo(videoId) {
        // Find demo video by ID
        for (const subject in this.getDemoVideos('maths')) {
            const videos = this.getDemoVideos(subject);
            const video = videos.find(v => v.id === videoId);
            if (video) return video;
        }
        return null;
    }
    
    closeVideoModal() {
        const modal = document.getElementById('video-modal');
        
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
    
    markVideoWatched() {
        if (!this.currentVideo) return;
        
        // In a real app, this would mark the video as watched in the database
        alert(`Marked "${this.currentVideo.title}" as watched. Your progress has been updated.`);
        this.closeVideoModal();
    }
    
    addToStudyList() {
        if (!this.currentVideo) return;
        
        // In a real app, this would add the video to the user's study list
        alert(`Added "${this.currentVideo.title}" to your study list.`);
        this.closeVideoModal();
    }
    
    // Flashcard Functions
    flipCard(card) {
        card.classList.toggle('flipped');
    }
    
    reviewFlashcard(flashcardId) {
        // In a real app, this would open a flashcard review interface
        alert('Flashcard review interface would open here with spaced repetition algorithm.');
    }
    
    // Wizard Learning Path
    startWizardPath() {
        // In a real app, this would start an adaptive learning sequence
        alert('Starting wizard learning path! This would guide you through personalized lessons based on your progress and weak areas.');
    }
}

// Initialize subjects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.subjectsManager = new SubjectsManager();
});