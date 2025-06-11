let selectedCategories = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentQuestion = null;

// DOM Elements
const setupScreen = document.querySelector('.setup-screen');
const gameScreen = document.querySelector('.game-screen');
const statsScreen = document.querySelector('.stats-screen');
const startBtn = document.getElementById('startBtn');
const dropdownContent = document.getElementById('dropdownContent');
const selectedCategoriesSpan = document.getElementById('selectedCategories');
const dropdownArrow = document.querySelector('.dropdown-arrow');

// Game Elements
const questionDisplay = document.getElementById('questionDisplay');
const categoryDisplay = document.getElementById('categoryDisplay');
const statsDisplay = document.getElementById('statsDisplay');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            closeDropdown();
        }
    });
});

function updateStartButton() {
    const hasCategories = selectedCategories.length > 0;
    
    startBtn.disabled = !hasCategories;
    
    if (!hasCategories) {
        startBtn.textContent = 'Spiel starten (Kategorie wählen)';
    } else {
        startBtn.textContent = 'Spiel starten';
    }
}

// Category Management
function toggleDropdown() {
    const content = dropdownContent;
    const arrow = dropdownArrow;
    
    if (content.classList.contains('open')) {
        closeDropdown();
    } else {
        content.classList.add('open');
        arrow.classList.add('rotated');
    }
}

function closeDropdown() {
    dropdownContent.classList.remove('open');
    dropdownArrow.classList.remove('rotated');
}

function updateSelectedCategories() {
    const checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');
    selectedCategories = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCategories.push(checkbox.value);
        }
    });
    
    updateCategoryDisplay();
    updateStartButton();
}

function updateCategoryDisplay() {
    const categoryNames = {
        'most_likely_classic': 'Klassisch',
        'most_likely_wild': 'Wild',
        'most_likely_spicy': 'Scharf',
        'most_likely_party': 'Party',
        'most_likely_friends': 'Freunde',
        'most_likely_drama': 'Drama',
        'most_likely_dirty': 'Freizügig'
    };
    
    if (selectedCategories.length === 0) {
        selectedCategoriesSpan.textContent = 'Kategorien wählen...';
        selectedCategoriesSpan.style.color = 'var(--color-placeholder)';
    } else if (selectedCategories.length === 1) {
        selectedCategoriesSpan.textContent = categoryNames[selectedCategories[0]];
        selectedCategoriesSpan.style.color = 'var(--color-text-dark)';
    } else {
        selectedCategoriesSpan.textContent = `${selectedCategories.length} Kategorien ausgewählt`;
        selectedCategoriesSpan.style.color = 'var(--color-text-dark)';
    }
}

// Game Logic
function startGame() {
    if (selectedCategories.length === 0) {
        alert('Wähle mindestens eine Kategorie aus!');
        return;
    }
    
    currentQuestions = [];
    selectedCategories.forEach(category => {
        if (window.wordLists && Array.isArray(window.wordLists[category])) {
            const formattedQuestions = window.wordLists[category].map(q => ({
                question: q,
                category: category
            }));
            currentQuestions.push(...formattedQuestions);
        }
    });

    if (currentQuestions.length === 0) {
        alert('Keine Fragen in den ausgewählten Kategorien gefunden!');
        return;
    }
    
    // Shuffle questions
    currentQuestions = shuffleArray(currentQuestions);
    currentQuestionIndex = 0;
    
    // Switch to game screen
    setupScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    
    // Show first question
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        // Shuffle questions again if we've gone through all
        currentQuestions = shuffleArray(currentQuestions);
        currentQuestionIndex = 0;
    }
    
    currentQuestion = currentQuestions[currentQuestionIndex];
    questionDisplay.textContent = currentQuestion.question || currentQuestion;
    
    // Show category if available
    if (currentQuestion.category) {
        const categoryNames = {
            'most_likely_classic': '😊 Klassisch',
            'most_likely_wild': '🤪 Wild',
            'most_likely_spicy': '🌶️ Scharf',
            'most_likely_party': '🎉 Party',
            'most_likely_friends': '👥 Freunde',
            'most_likely_drama': '🎭 Drama',
            'most_likely_dirty': '🔥 Freizügig'
        };
        categoryDisplay.textContent = categoryNames[currentQuestion.category] || '';
        categoryDisplay.style.display = 'block';
    } else {
        categoryDisplay.style.display = 'none';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function backToGame() {
    statsScreen.classList.remove('active');
    gameScreen.classList.add('active');
}

function resetGame() {
    // Reset all game state
    currentQuestions = [];
    currentQuestionIndex = 0;
    currentQuestion = null;
    updateStartButton();
    updateCategoryDisplay();
    
    // Switch to setup screen
    gameScreen.classList.remove('active');
    setupScreen.classList.add('active');
}

// Utility Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}