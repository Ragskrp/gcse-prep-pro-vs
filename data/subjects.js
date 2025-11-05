const subjects = {
    maths: {
        name: "Mathematics",
        topics: {
            number: {
                name: "Number",
                subtopics: [
                    "Integers and place value",
                    "Decimals",
                    "Indices, powers and roots",
                    "Factors, multiples and primes",
                    "Fractions, decimals and percentages",
                    "Ratio and proportion",
                    "Standard form and surds"
                ]
            },
            algebra: {
                name: "Algebra",
                subtopics: [
                    "Algebraic expressions",
                    "Equations and inequalities",
                    "Sequences and series",
                    "Linear graphs",
                    "Quadratic expressions and equations",
                    "Functions and graphs",
                    "Algebraic manipulation"
                ]
            },
            geometry: {
                name: "Geometry and Measures",
                subtopics: [
                    "Angles and shapes",
                    "Pythagoras theorem",
                    "Trigonometry",
                    "Vectors",
                    "Area and volume",
                    "Circles",
                    "Transformations"
                ]
            },
            statistics: {
                name: "Statistics and Probability",
                subtopics: [
                    "Data handling",
                    "Probability",
                    "Mean, median, mode",
                    "Scatter graphs",
                    "Box plots and histograms",
                    "Frequency tables",
                    "Tree diagrams"
                ]
            }
        }
    },
    english: {
        name: "English Language & Literature",
        topics: {
            reading: {
                name: "Reading Comprehension",
                subtopics: [
                    "Inference and deduction",
                    "Language analysis",
                    "Structure analysis",
                    "Comparison skills",
                    "Critical evaluation",
                    "Context and background",
                    "Author's purpose"
                ]
            },
            writing: {
                name: "Writing Skills",
                subtopics: [
                    "Descriptive writing",
                    "Narrative writing",
                    "Persuasive writing",
                    "Letter writing",
                    "Speech writing",
                    "Article writing",
                    "Technical writing"
                ]
            },
            literature: {
                name: "Literature Analysis",
                subtopics: [
                    "Shakespeare plays",
                    "Modern texts",
                    "Poetry anthology",
                    "Unseen poetry",
                    "Character analysis",
                    "Themes and motifs",
                    "Literary devices"
                ]
            },
            language: {
                name: "Language Analysis",
                subtopics: [
                    "Grammar and punctuation",
                    "Vocabulary and word choice",
                    "Sentence structures",
                    "Rhetorical devices",
                    "Tone and style",
                    "Text types",
                    "Purpose and audience"
                ]
            }
        }
    },
    science: {
        name: "Combined Science",
        topics: {
            biology: {
                name: "Biology",
                subtopics: [
                    "Cell biology",
                    "Organisation",
                    "Infection and response",
                    "Bioenergetics",
                    "Homeostasis",
                    "Inheritance",
                    "Ecology"
                ]
            },
            chemistry: {
                name: "Chemistry",
                subtopics: [
                    "Atomic structure",
                    "Bonding and structure",
                    "Quantitative chemistry",
                    "Chemical changes",
                    "Energy changes",
                    "Organic chemistry",
                    "Chemical analysis"
                ]
            },
            physics: {
                name: "Physics",
                subtopics: [
                    "Forces",
                    "Energy",
                    "Waves",
                    "Electricity",
                    "Magnetism",
                    "Particle model",
                    "Atomic structure"
                ]
            },
            practicals: {
                name: "Required Practicals",
                subtopics: [
                    "Biology practicals",
                    "Chemistry practicals",
                    "Physics practicals",
                    "Data analysis",
                    "Experimental design",
                    "Safety procedures",
                    "Equipment use"
                ]
            }
        }
    },
    geography: {
        name: "Geography",
        topics: {
            physical: {
                name: "Physical Geography",
                subtopics: [
                    "Natural hazards",
                    "Tectonic hazards",
                    "Weather hazards",
                    "Climate change",
                    "Ecosystems",
                    "Rivers",
                    "Coasts"
                ]
            },
            human: {
                name: "Human Geography",
                subtopics: [
                    "Urban issues",
                    "Economic world",
                    "Resource management",
                    "Population",
                    "Development",
                    "Globalisation",
                    "Migration"
                ]
            },
            skills: {
                name: "Geographical Skills",
                subtopics: [
                    "Map skills",
                    "Graph skills",
                    "Statistical skills",
                    "Field work",
                    "GIS",
                    "Data analysis",
                    "Investigation methods"
                ]
            }
        }
    },
    french: {
        name: "French",
        topics: {
            speaking: {
                name: "Speaking",
                subtopics: [
                    "Role play",
                    "Photo card discussion",
                    "General conversation",
                    "Pronunciation",
                    "Fluency",
                    "Spontaneity",
                    "Question handling"
                ]
            },
            listening: {
                name: "Listening",
                subtopics: [
                    "Basic comprehension",
                    "Detailed understanding",
                    "Different accents",
                    "Speed variations",
                    "Context clues",
                    "Number recognition",
                    "Time expressions"
                ]
            },
            reading: {
                name: "Reading",
                subtopics: [
                    "Comprehension",
                    "Translation into English",
                    "Literary texts",
                    "Instructions",
                    "Advertisements",
                    "Emails and letters",
                    "Cultural texts"
                ]
            },
            writing: {
                name: "Writing",
                subtopics: [
                    "Structured writing",
                    "Open-ended writing",
                    "Translation into French",
                    "Extended response",
                    "Grammar application",
                    "Vocabulary use",
                    "Style and register"
                ]
            },
            grammar: {
                name: "Grammar",
                subtopics: [
                    "Present tense",
                    "Past tenses",
                    "Future tenses",
                    "Adjectives",
                    "Articles",
                    "Pronouns",
                    "Irregular verbs"
                ]
            }
        }
    },
    computerscience: {
        name: "Computer Science",
        topics: {
            programming: {
                name: "Programming",
                subtopics: [
                    "Python fundamentals",
                    "Data types and structures",
                    "Control flow",
                    "Functions and procedures",
                    "File handling",
                    "Error handling",
                    "Testing and debugging"
                ]
            },
            theory: {
                name: "Computer Systems",
                subtopics: [
                    "Hardware",
                    "Software",
                    "Memory and storage",
                    "Networks",
                    "System security",
                    "System software",
                    "Ethics and impacts"
                ]
            },
            algorithms: {
                name: "Algorithms",
                subtopics: [
                    "Computational thinking",
                    "Searching algorithms",
                    "Sorting algorithms",
                    "Flow diagrams",
                    "Pseudocode",
                    "Efficiency",
                    "Problem solving"
                ]
            },
            data: {
                name: "Data Representation",
                subtopics: [
                    "Binary and hex",
                    "Character encoding",
                    "Image representation",
                    "Sound representation",
                    "Data compression",
                    "Boolean logic",
                    "SQL and databases"
                ]
            }
        }
    }
};

module.exports = subjects;