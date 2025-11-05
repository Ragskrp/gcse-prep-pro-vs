// GCSE Prep Pro - Database Seeding Script
// Populates the database with sample users, questions, videos, and content

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Question = require('./models/Question');
const Video = require('./models/Video');
const StudySession = require('./models/StudySession');
const QuizResult = require('./models/QuizResult');
const Flashcard = require('./models/Flashcard');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gcse-prep-pro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Sample Questions Database
const sampleQuestions = {
    maths: {
        algebra: [
            {
                question: "Solve for x: 2x + 5 = 13",
                options: ["x = 4", "x = 3", "x = 6", "x = 8"],
                correct: 0,
                explanation: "Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4",
                marks: 2,
                timeLimit: 60
            },
            {
                question: "Factorize: x² - 9",
                options: ["(x-3)(x+3)", "(x-3)²", "(x+3)²", "x² - 3"],
                correct: 0,
                explanation: "This is a difference of squares: x² - 9 = (x-3)(x+3)",
                marks: 3,
                timeLimit: 90
            },
            {
                question: "What is the gradient of the line y = 3x + 2?",
                options: ["3", "2", "1", "5"],
                correct: 0,
                explanation: "In the equation y = mx + c, m represents the gradient. Here m = 3",
                marks: 1,
                timeLimit: 30
            },
            {
                question: "Solve: x² + 5x + 6 = 0",
                options: ["x = -2 or x = -3", "x = 2 or x = 3", "x = -1 or x = -6", "x = 1 or x = 6"],
                correct: 0,
                explanation: "Factorizing: (x+2)(x+3) = 0, so x = -2 or x = -3",
                marks: 4,
                timeLimit: 120
            }
        ],
        geometry: [
            {
                question: "What is the area of a circle with radius 5cm?",
                options: ["25π cm²", "10π cm²", "20π cm²", "15π cm²"],
                correct: 0,
                explanation: "Area = πr² = π × 5² = 25π cm²",
                marks: 2,
                timeLimit: 45
            },
            {
                question: "In a right-angled triangle with sides 3cm and 4cm, what is the hypotenuse?",
                options: ["5cm", "6cm", "7cm", "8cm"],
                correct: 0,
                explanation: "Using Pythagoras: √(3² + 4²) = √(9 + 16) = √25 = 5cm",
                marks: 3,
                timeLimit: 60
            }
        ],
        statistics: [
            {
                question: "What is the mean of these numbers: 4, 7, 9, 12, 8?",
                options: ["8", "7", "9", "10"],
                correct: 0,
                explanation: "Sum = 4+7+9+12+8 = 40, Mean = 40÷5 = 8",
                marks: 2,
                timeLimit: 45
            }
        ]
    },
    english: {
        'creative-writing': [
            {
                question: "Which technique is used in 'The wind whispered through the trees'?",
                options: ["Personification", "Simile", "Metaphor", "Alliteration"],
                correct: 0,
                explanation: "Personification gives human qualities to non-human things",
                marks: 1,
                timeLimit: 30
            },
            {
                question: "What is the purpose of using sensory language in descriptive writing?",
                options: ["To create vivid imagery", "To confuse readers", "To make text longer", "To show intelligence"],
                correct: 0,
                explanation: "Sensory language helps readers visualize and experience the scene",
                marks: 2,
                timeLimit: 45
            }
        ],
        reading: [
            {
                question: "What is inference in reading comprehension?",
                options: ["Reading between the lines", "Reading quickly", "Reading aloud", "Reading backwards"],
                correct: 0,
                explanation: "Inference means understanding implied meaning that isn't directly stated",
                marks: 2,
                timeLimit: 30
            }
        ]
    },
    science: {
        biology: [
            {
                question: "What is the basic unit of life?",
                options: ["Cell", "Organ", "Tissue", "Organism"],
                correct: 0,
                explanation: "The cell is the basic unit of life in all living organisms",
                marks: 1,
                timeLimit: 20
            },
            {
                question: "Which process do plants use to make food?",
                options: ["Photosynthesis", "Respiration", "Digestion", "Excretion"],
                correct: 0,
                explanation: "Plants use photosynthesis to convert light energy into chemical energy",
                marks: 2,
                timeLimit: 30
            }
        ],
        chemistry: [
            {
                question: "What is the chemical symbol for gold?",
                options: ["Au", "Ag", "Go", "Gd"],
                correct: 0,
                explanation: "Au comes from the Latin word 'aurum' meaning gold",
                marks: 1,
                timeLimit: 20
            },
            {
                question: "In a chemical reaction, what happens to the total mass?",
                options: ["It stays the same", "It increases", "It decreases", "It disappears"],
                correct: 0,
                explanation: "According to the law of conservation of mass, mass is conserved in chemical reactions",
                marks: 2,
                timeLimit: 30
            }
        ],
        physics: [
            {
                question: "What is the unit of force?",
                options: ["Newton", "Joule", "Watt", "Pascal"],
                correct: 0,
                explanation: "The Newton (N) is the SI unit of force",
                marks: 1,
                timeLimit: 20
            }
        ]
    },
    computerscience: {
        programming: [
            {
                question: "What does 'print()' do in Python?",
                options: ["Displays output to the screen", "Saves data to a file", "Reads input from user", "Deletes a variable"],
                correct: 0,
                explanation: "The print() function displays output to the console/screen",
                marks: 1,
                timeLimit: 20
            },
            {
                question: "Which data type would you use to store a whole number in Python?",
                options: ["Integer (int)", "String (str)", "Float (float)", "Boolean (bool)"],
                correct: 0,
                explanation: "Integers (int) are used to store whole numbers without decimal points",
                marks: 1,
                timeLimit: 20
            }
        ],
        computersystems: [
            {
                question: "What does CPU stand for?",
                options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
                correct: 0,
                explanation: "CPU stands for Central Processing Unit, the brain of the computer",
                marks: 1,
                timeLimit: 20
            }
        ]
    },
    french: {
        grammar: [
            {
                question: "How do you say 'I am' in French?",
                options: ["Je suis", "Tu es", "Il est", "Nous sommes"],
                correct: 0,
                explanation: "'Je suis' means 'I am' in French",
                marks: 1,
                timeLimit: 20
            },
            {
                question: "What is the past participle of 'avoir'?",
                options: ["eu", "été", "fait", "allé"],
                correct: 0,
                explanation: "The past participle of 'avoir' is 'eu'",
                marks: 2,
                timeLimit: 30
            }
        ],
        vocabulary: [
            {
                question: "What does 'bonjour' mean?",
                options: ["Hello/Good day", "Goodbye", "Thank you", "Please"],
                correct: 0,
                explanation: "'Bonjour' means 'hello' or 'good day' in French",
                marks: 1,
                timeLimit: 15
            }
        ]
    }
};

// Sample Videos Database
const sampleVideos = [
    {
        title: "Introduction to Algebra - GCSE Maths",
        description: "Learn the basics of algebra including variables, equations, and solving techniques",
        subject: "maths",
        topic: "algebra",
        difficulty: "foundation",
        duration: 1200, // 20 minutes
        url: "https://example.com/videos/algebra-intro.mp4",
        thumbnail: "algebra-thumb.jpg"
    },
    {
        title: "Photosynthesis Explained - GCSE Biology",
        description: "Complete guide to photosynthesis process in plants with diagrams and examples",
        subject: "science",
        topic: "biology",
        difficulty: "foundation",
        duration: 900, // 15 minutes
        url: "https://example.com/videos/photosynthesis.mp4",
        thumbnail: "photosynthesis-thumb.jpg"
    },
    {
        title: "Python Basics - GCSE Computer Science",
        description: "Introduction to Python programming with hands-on examples",
        subject: "computerscience",
        topic: "programming",
        difficulty: "foundation",
        duration: 1500, // 25 minutes
        url: "https://example.com/videos/python-basics.mp4",
        thumbnail: "python-thumb.jpg"
    },
    {
        title: "French Grammar - Past Tense",
        description: "Master the passé composé with clear explanations and practice exercises",
        subject: "french",
        topic: "grammar",
        difficulty: "foundation",
        duration: 1080, // 18 minutes
        url: "https://example.com/videos/french-past-tense.mp4",
        thumbnail: "french-grammar-thumb.jpg"
    }
];

// Sample Flashcards
const sampleFlashcards = [
    {
        subject: "maths",
        topic: "algebra",
        front: "What is the quadratic formula?",
        back: "x = (-b ± √(b² - 4ac)) / 2a"
    },
    {
        subject: "science",
        topic: "chemistry",
        front: "What is the chemical formula for water?",
        back: "H₂O"
    },
    {
        subject: "computerscience",
        topic: "programming",
        front: "What is a loop in programming?",
        back: "A control structure that repeats a block of code"
    },
    {
        subject: "french",
        topic: "vocabulary",
        front: "How do you say 'thank you' in French?",
        back: "Merci"
    }
];

// Seed Database Function
async function seedDatabase() {
    try {
        console.log('🌱 Seeding database...');

        // Clear existing data
        await User.deleteMany({});
        await Question.deleteMany({});
        await Video.deleteMany({});
        await StudySession.deleteMany({});
        await QuizResult.deleteMany({});
        await Flashcard.deleteMany({});

        console.log('✅ Cleared existing data');

        // Create sample users
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const sampleUsers = [
            {
                username: 'student1',
                email: 'student1@example.com',
                password: hashedPassword,
                firstName: 'Alice',
                lastName: 'Johnson',
                school: 'St. Mary\'s High School'
            },
            {
                username: 'student2',
                email: 'student2@example.com',
                password: hashedPassword,
                firstName: 'Bob',
                lastName: 'Smith',
                school: 'Kingston Academy'
            }
        ];

        const createdUsers = await User.insertMany(sampleUsers);
        console.log('✅ Created sample users');

        // Insert questions
        let questionCount = 0;
        for (const [subject, topics] of Object.entries(sampleQuestions)) {
            for (const [topic, questions] of Object.entries(topics)) {
                for (const question of questions) {
                    await Question.create({
                        ...question,
                        subject,
                        topic
                    });
                    questionCount++;
                }
            }
        }
        console.log(`✅ Created ${questionCount} questions`);

        // Insert videos
        await Video.insertMany(sampleVideos);
        console.log(`✅ Created ${sampleVideos.length} videos`);

        // Insert flashcards for each user
        let flashcardCount = 0;
        for (const user of createdUsers) {
            for (const flashcard of sampleFlashcards) {
                await Flashcard.create({
                    ...flashcard,
                    user: user._id
                });
                flashcardCount++;
            }
        }
        console.log(`✅ Created ${flashcardCount} flashcards`);

        // Create sample study sessions
        const sampleSessions = [
            {
                user: createdUsers[0]._id,
                subject: 'maths',
                topic: 'algebra',
                sessionType: 'revision',
                duration: 60,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                user: createdUsers[0]._id,
                subject: 'science',
                topic: 'biology',
                sessionType: 'practice',
                duration: 45,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ];

        await StudySession.insertMany(sampleSessions);
        console.log(`✅ Created ${sampleSessions.length} study sessions`);

        // Create sample quiz results
        const sampleResults = [
            {
                user: createdUsers[0]._id,
                subject: 'maths',
                topic: 'algebra',
                difficulty: 'foundation',
                score: 85,
                correctAnswers: 17,
                totalQuestions: 20,
                timeSpent: 900
            },
            {
                user: createdUsers[0]._id,
                subject: 'science',
                topic: 'chemistry',
                difficulty: 'foundation',
                score: 92,
                correctAnswers: 23,
                totalQuestions: 25,
                timeSpent: 1200
            }
        ];

        await QuizResult.insertMany(sampleResults);
        console.log(`✅ Created ${sampleResults.length} quiz results`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('📋 Sample login credentials:');
        console.log('   Email: student1@example.com, Password: password123');
        console.log('   Email: student2@example.com, Password: password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run seeding
seedDatabase();