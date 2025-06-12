// Game state
let players = [];
let selectedCategories = [];
let currentPlayerIndex = 0;
let usedQuestions = new Set();

// Kategorie-Referenzen (muss NACH der Fragen-JS-Datei eingebunden werden)
const categoryObjects = {
  chaos: chaos,
  classic: classic,
  girlsnight: girlsnight,
  outside: outside,
  dirty: dirty,
  hardcore: hardcore
};

// Screen elements
const setupScreen = document.querySelector('.setup-screen');
const gameScreen = document.querySelector('.game-screen');
const questionScreen = document.querySelector('.question-screen');

// Add player function
function addPlayer() {
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();
    
    if (playerName === '') {
        alert('Bitte gib einen Namen ein!');
        return;
    }
    
    if (players.includes(playerName)) {
        alert('Dieser Name ist bereits vergeben!');
        return;
    }
    
    players.push(playerName);
    playerNameInput.value = '';
    updatePlayerList();
    updateStartButton();
}

// Update player list display
function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    const playersDiv = document.getElementById('players');
    
    if (players.length === 0) {
        playerList.style.display = 'none';
        return;
    }
    
    playerList.style.display = 'block';
    playersDiv.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.innerHTML = `
            <span>${player}</span>
            <button class="remove-btn" onclick="removePlayer(${index})">×</button>
        `;
        playersDiv.appendChild(playerItem);
    });
}

// Remove player function
function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
    updateStartButton();
}

// Toggle dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownContent');
    const arrow = document.querySelector('.dropdown-arrow');
    
    dropdown.classList.toggle('open');
    arrow.classList.toggle('rotated');
}

// Update selected categories
function updateSelectedCategories() {
    const checkboxes = document.querySelectorAll('#dropdownContent input[type="checkbox"]');
    const display = document.getElementById('selectedCategories');
    
    selectedCategories = [];
    const selectedNames = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCategories.push(checkbox.value);
            const label = checkbox.parentElement.querySelector('span').textContent;
            selectedNames.push(label);
        }
    });
    
    if (selectedCategories.length === 0) {
        display.textContent = 'Kategorien wählen...';
    } else if (selectedCategories.length === 1) {
        const categoryNames = {
            'classic': '🎭 Classic',
            'chaos': '🌪️ Chaos',
            'girlsnight': '👭 Girls Night',
            'outside': '🌳 Draussen',
            'dirty': '🔥 Dirty',
            'hardcore': '💀 Hardcore'
        };
        display.textContent = categoryNames[selectedCategories[0]];
    } else {
        display.textContent = `${selectedCategories.length} Kategorien ausgewählt`;
    }
    updateStartButton();
}

// Update start button state
function updateStartButton() {
    const startBtn = document.getElementById('startBtn');

    if (players.length >= 3 && selectedCategories.length > 0) {
        startBtn.disabled = false;
        startBtn.textContent = `Spiel starten (${players.length} Spieler)`;
    } else {
        startBtn.disabled = true;
        if (players.length < 3) {
            startBtn.textContent = 'Spiel starten (min. 3 Spieler)';
        } else {
            startBtn.textContent = 'Spiel starten (Kategorie wählen)';
        }
    }
}

// Start game
function startGame() {
    if (players.length < 3) {
        alert('Mindestens 3 Spieler benötigt!');
        return;
    }
    
    if (selectedCategories.length === 0) {
        alert('Bitte wähle mindestens eine Kategorie!');
        return;
    }
    
    // Shuffle players
    players = shuffleArray([...players]);
    currentPlayerIndex = 0;
    usedQuestions.clear();
    
    // Show game screen
    setupScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    updateCurrentPlayer();
}

// Update current player display
function updateCurrentPlayer() {
    const currentPlayerName = document.getElementById('currentPlayerName');
    currentPlayerName.textContent = players[currentPlayerIndex];
}

// Select choice (truth or dare)
function selectChoice(choice) {
    const question = getRandomQuestion(choice);
    
    if (!question) {
        alert('Keine Fragen mehr in dieser Kategorie!');
        return;
    }
    
    // Show question screen
    gameScreen.classList.remove('active');
    questionScreen.classList.add('active');
    
    // Display question
    displayQuestion(question, choice);
}

// Get random question (ANGEPASST für neues Layout)
function getRandomQuestion(type) {
    const availableQuestions = [];
    
    selectedCategories.forEach(category => {
        if (categoryObjects[category] && categoryObjects[category][type]) {
            const categoryQuestions = categoryObjects[category][type];
            categoryQuestions.forEach((question, index) => {
                const questionId = `${category}-${type}-${index}`;
                if (!usedQuestions.has(questionId)) {
                    availableQuestions.push({
                        text: question,
                        category: category,
                        id: questionId
                    });
                }
            });
        }
    });
    
    if (availableQuestions.length === 0) {
        // Reset used questions if all are used
        usedQuestions.clear();
        return getRandomQuestion(type);
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    usedQuestions.add(selectedQuestion.id);
    return selectedQuestion;
}

// Display question
function displayQuestion(question, type) {
    const questionPlayerName = document.getElementById('questionPlayerName');
    const questionType = document.getElementById('questionType');
    const questionText = document.getElementById('questionText');
    const questionCategory = document.getElementById('questionCategory');
    
    questionPlayerName.textContent = players[currentPlayerIndex];
    questionType.innerHTML = type === 'truth' 
    ? '<img src="/static/emojis/thinking_face.webp" alt="Denkendes Gesicht Emoji"> Wahrheit' 
    : '<img src="/static/emojis/biceps.png" alt="Biceps Emoji"> Tat';
    questionType.className = `question-type ${type}-type`;
    questionText.textContent = question.text;
    questionCategory.textContent = getCategoryName(question.category);
}

// Get category display name (ANGEPASST für neue Kategorien)
function getCategoryName(category) {
    const categoryNames = {
        'classic': '🎭 Classic',
        'chaos': '🌪️ Chaos',
        'girlsnight': '👭 Girls Night',
        'outside': '🌳 Draußen',
        'dirty': '🔥 Dirty',
        'hardcore': '💀 Hardcore'
    };
    return categoryNames[category] || category;
}

// Next player
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    // Go back to game screen
    questionScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    updateCurrentPlayer();
}

// Back to choice
function backToChoice() {
    questionScreen.classList.remove('active');
    gameScreen.classList.add('active');
}

// Reset game
function resetGame() {
    // Reset game state
    players = [];
    selectedCategories = [];
    currentPlayerIndex = 0;
    usedQuestions.clear();
    
    // Reset UI
    document.getElementById('playerName').value = '';
    document.getElementById('playerList').style.display = 'none';
    document.getElementById('players').innerHTML = '';
    
    // Reset categories
    const checkboxes = document.querySelectorAll('#dropdownContent input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedCategories();
    
    // Reset dropdown
    const dropdown = document.getElementById('dropdownContent');
    const arrow = document.querySelector('.dropdown-arrow');
    dropdown.classList.remove('open');
    arrow.classList.remove('rotated');
    
    updateStartButton();
    
    // Show setup screen
    gameScreen.classList.remove('active');
    questionScreen.classList.remove('active');
    setupScreen.classList.add('active');
}

// Shuffle array utility
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Enter key support for player name input
document.getElementById('playerName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.getElementById('dropdownContent');
    
    if (!dropdown.contains(e.target)) {
        dropdownContent.classList.remove('open');
        document.querySelector('.dropdown-arrow').classList.remove('rotated');
    }
});

// Initialize
updateStartButton();