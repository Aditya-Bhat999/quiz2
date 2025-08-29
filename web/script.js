// Quiz configuration
const QUIZ_CONFIG = {
    timerDuration: 8, // Global timer duration in seconds - change this value to modify all timers
    totalQuestions: 10,
    marksPerQuestion: 10
};

// Quiz data structure - loaded from JSON file
let quizData = [];
let currentSlide = 0;
let timerIntervals = {};
let userAnswers = [];
let shuffledAnswers = [];
let score = 0;
let correctAttempts = 0;
let wrongAttempts = 0;
let currentTopicFile = 'quiz-data.json';
let answerSelectionTimeout = null; // Track the timeout for answer selection
let isAnswerSelected = false; // Flag to prevent multiple answer selections

// Load quiz data from JSON file
async function loadQuizData(topicFile = 'quiz-data.json') {
    try {
        currentTopicFile = topicFile;
        const response = await fetch(`../quiz-data/${topicFile}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quizData = await response.json();
        console.log('Quiz data loaded successfully:', quizData);
        initQuiz();
    } catch (error) {
        console.error('Error loading quiz data:', error);
        alert('Failed to load quiz data. Please ensure the selected quiz JSON file exists.');
    }
}

// Shuffle array function using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize the quiz
function initQuiz() {
    // Reset all variables
    currentSlide = 0;
    userAnswers = [];
    shuffledAnswers = [];
    score = 0;
    correctAttempts = 0;
    wrongAttempts = 0;
    
    // Clear any existing answer selection timeout
    if (answerSelectionTimeout) {
        clearTimeout(answerSelectionTimeout);
        answerSelectionTimeout = null;
    }
    isAnswerSelected = false;
    
    // Shuffle answers for each question
    shuffledAnswers = quizData.map(question => {
        const answersWithIndex = question.answers.map((answer, index) => ({ answer, originalIndex: index }));
        return shuffleArray(answersWithIndex);
    });
    
    // Hide all slides initially
    for (let i = 0; i <= 10; i++) {
        const slide = document.getElementById(`slide-${i}`);
        if (slide) {
            slide.style.display = 'none';
        }
    }
    
    // Show welcome slide
    document.getElementById('slide-0').style.display = 'flex';
    document.getElementById('slide-0').classList.add('active');
}

// Start the quiz
async function startQuiz() {
    const select = document.getElementById('topic-select');
    const selectedFile = select && select.value ? select.value : 'quiz-data.json';
    await loadQuizData(selectedFile);
    currentSlide = 1;
    showSlide(currentSlide);
    startTimer(currentSlide);
}

// Show a specific slide
function showSlide(slideNumber) {
    // Hide all slides
    for (let i = 0; i <= 10; i++) {
        const slide = document.getElementById(`slide-${i}`);
        if (slide) {
            slide.style.display = 'none';
            slide.classList.remove('active', 'fade-out');
        }
    }
    
    // Hide welcome slide
    document.getElementById('slide-0').style.display = 'none';
    
    // Show current slide
    const currentSlideElement = document.getElementById(`slide-${slideNumber}`);
    if (currentSlideElement) {
        currentSlideElement.style.display = 'flex';
        setTimeout(() => {
            currentSlideElement.classList.add('active');
        }, 100);
        
        // Load question and answers
        loadQuestion(slideNumber);
    }
}

// Load question and answers for a slide
function loadQuestion(slideNumber) {
    if (slideNumber > quizData.length) {
        showCompleteSlide();
        return;
    }
    
    const questionData = quizData[slideNumber - 1];
    const questionElement = document.getElementById(`question-${slideNumber}`);
    const answersElement = document.getElementById(`answers-${slideNumber}`);
    
    if (questionElement && answersElement && questionData) {
        // Set question
        questionElement.textContent = questionData.question;
        
        // Clear previous answers
        answersElement.innerHTML = '';
        
        // Add shuffled answer options
        const currentShuffledAnswers = shuffledAnswers[slideNumber - 1];
        currentShuffledAnswers.forEach((answerObj, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answerObj.answer;
            answerDiv.onclick = () => selectAnswer(slideNumber, index, answerObj.originalIndex);
            answersElement.appendChild(answerDiv);
        });
    }
}

// Handle answer selection
function selectAnswer(slideNumber, shuffledIndex, originalIndex) {
    // Prevent multiple answer selections for the same question
    if (isAnswerSelected) {
        return;
    }
    
    const answersElement = document.getElementById(`answers-${slideNumber}`);
    const answerOptions = answersElement.querySelectorAll('.answer-option');
    const questionData = quizData[slideNumber - 1];
    
    // Set flag to prevent multiple selections
    isAnswerSelected = true;
    
    // Remove previous selections
    answerOptions.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark selected answer
    answerOptions[shuffledIndex].classList.add('selected');
    
    // Store user's answer
    userAnswers[slideNumber - 1] = originalIndex;
    
    // Check if answer is correct
    const isCorrect = originalIndex === questionData.correctAnswer;
    
    if (isCorrect) {
        correctAttempts++;
        score += QUIZ_CONFIG.marksPerQuestion; // Each question carries marksPerQuestion marks
        answerOptions[shuffledIndex].classList.add('correct');
    } else {
        wrongAttempts++;
        answerOptions[shuffledIndex].classList.add('incorrect');
        
        // Show correct answer
        const correctShuffledIndex = shuffledAnswers[slideNumber - 1].findIndex(
            answer => answer.originalIndex === questionData.correctAnswer
        );
        if (correctShuffledIndex !== -1) {
            answerOptions[correctShuffledIndex].classList.add('correct');
        }
    }
    
    // Clear any existing timeout
    if (answerSelectionTimeout) {
        clearTimeout(answerSelectionTimeout);
    }
    
    // Wait a moment to show the result, then auto-advance
    answerSelectionTimeout = setTimeout(() => {
        nextSlide();
    }, 2000);
}

// Start timer for a slide
function startTimer(slideNumber) {
    if (slideNumber > quizData.length) {
        return;
    }
    
    let timeLeft = QUIZ_CONFIG.timerDuration;
    const timerElement = document.getElementById(`timer-${slideNumber}`);
    
    // Clear any existing timer
    if (timerIntervals[slideNumber]) {
        clearInterval(timerIntervals[slideNumber]);
    }
    
    // Update timer display
    if (timerElement) {
        timerElement.textContent = timeLeft;
    }
    
    // Start countdown
    timerIntervals[slideNumber] = setInterval(() => {
        timeLeft--;
        
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }
        
        // Change timer color when time is running low
        if (timeLeft <= 5) {
            const timerCircle = timerElement?.parentElement;
            if (timerCircle) {
                timerCircle.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                timerCircle.style.animation = 'pulse 0.5s infinite';
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerIntervals[slideNumber]);
            
            // If no answer was selected, mark as wrong
            if (userAnswers[slideNumber - 1] === undefined) {
                wrongAttempts++;
                userAnswers[slideNumber - 1] = -1; // -1 indicates no answer
            }
            
            nextSlide();
        }
    }, 1000);
}

// Move to next slide
function nextSlide() {
    // Clear current timer
    if (timerIntervals[currentSlide]) {
        clearInterval(timerIntervals[currentSlide]);
    }
    
    // Clear answer selection timeout
    if (answerSelectionTimeout) {
        clearTimeout(answerSelectionTimeout);
        answerSelectionTimeout = null;
    }
    
    // Reset answer selection flag
    isAnswerSelected = false;
    
    // Add fade-out effect
    const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('fade-out');
    }
    
    // Wait for fade-out animation, then show next slide
    setTimeout(() => {
        currentSlide++;
        
        if (currentSlide <= quizData.length) {
            showSlide(currentSlide);
            startTimer(currentSlide);
        } else {
            showCompleteSlide();
        }
    }, 500);
}

// Show completion slide with score card
function showCompleteSlide() {
    // Hide all slides
    for (let i = 0; i <= 10; i++) {
        const slide = document.getElementById(`slide-${i}`);
        if (slide) {
            slide.style.display = 'none';
            slide.classList.remove('active', 'fade-out');
        }
    }
    
    // Show completion slide
    const completeSlide = document.getElementById('slide-complete');
    if (completeSlide) {
        completeSlide.style.display = 'flex';
        
        // Update score card content
        const titleElement = completeSlide.querySelector('.title');
        const subtitleElement = completeSlide.querySelector('.subtitle');
        
        if (titleElement) {
            titleElement.textContent = 'Quiz Complete!';
        }
        
        if (subtitleElement) {
            const totalQuestions = quizData.length;
            const percentage = Math.round((score / (totalQuestions * QUIZ_CONFIG.marksPerQuestion)) * 100);
            
            subtitleElement.innerHTML = `
                <div class="score-card">
                    <div class="score-item">
                        <span class="score-label">Total Score:</span>
                        <span class="score-value">${score}/${totalQuestions * QUIZ_CONFIG.marksPerQuestion}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Percentage:</span>
                        <span class="score-value">${percentage}%</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Correct Answers:</span>
                        <span class="score-value correct-score">${correctAttempts}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Wrong Answers:</span>
                        <span class="score-value wrong-score">${wrongAttempts}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Total Questions:</span>
                        <span class="score-value">${totalQuestions}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Marks per Question:</span>
                        <span class="score-value">${QUIZ_CONFIG.marksPerQuestion}</span>
                    </div>
                </div>
            `;
        }
        
        setTimeout(() => {
            completeSlide.classList.add('active');
        }, 100);
    }
}



// Initialize quiz when page loads (show landing slide without loading data yet)
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

// Export quiz data for external use (if needed)
window.quizData = quizData; 

// Prevent copy/cut/paste, text selection shortcuts, and right-click
(function () {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    ['copy', 'cut', 'paste'].forEach(function (evt) {
        document.addEventListener(evt, function (e) {
            e.preventDefault();
        });
    });

    document.addEventListener('keydown', function (e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
        if (ctrlOrCmd) {
            // Block common shortcuts: A, C, X, V, S, P, U, Shift+I/J/C (devtools), plus F12
            const key = e.key.toLowerCase();
            const blocked = ['a', 'c', 'x', 'v', 's', 'p', 'u'];
            if (blocked.includes(key)) {
                e.preventDefault();
                return;
            }
            if (e.shiftKey && ['i', 'j', 'c'].includes(key)) {
                e.preventDefault();
                return;
            }
        }
        if (e.key === 'F12') {
            e.preventDefault();
        }
    });
})(); 