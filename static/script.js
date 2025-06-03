let players = [];
let currentPlayerIndex = 0;
let selectedWord = '';
let selectedCategories = [];
let impostorIndex = -1;
let gameCards = [];

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownContent');
    const arrow = document.querySelector('.dropdown-arrow');
    
    dropdown.classList.toggle('open');
    arrow.classList.toggle('rotated');
}

function updateSelectedCategories() {
    const checkboxes = document.querySelectorAll('#dropdownContent input[type="checkbox"]');
    selectedCategories = [];
    
    checkboxes.forEach(checkbox => {
if (checkbox.checked) {
    selectedCategories.push(checkbox.value);
}
    });
    
    const display = document.getElementById('selectedCategories');
    if (selectedCategories.length === 0) {
        display.textContent = 'Kategorien wählen...';
    } else if (selectedCategories.length === 1) {
        const categoryNames = {
            'gegenstände': '💻 Gegenstände',
            'tiere': '🐮 Tiere', 
            'essen': '🥙 Essen',
            'orte': '⛰️ Orte',
            'berufe': '👮‍♂️ Berufe',
            'sport': '⚽ Sport',
            'promis': '💯 Promis',
            'spicy': '🌶️ Spicy'
        };
        display.textContent = categoryNames[selectedCategories[0]];
    } else {
        display.textContent = `${selectedCategories.length} Kategorien ausgewählt`;
    }
    
    updateStartButton();
}

// Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown.contains(event.target)) {
        document.getElementById('dropdownContent').classList.remove('open');
        document.querySelector('.dropdown-arrow').classList.remove('rotated');
    }
});

function addPlayer() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    
    if (name && !players.includes(name)) {
        players.push(name);
        nameInput.value = '';
        updatePlayerList();
        updateStartButton();
    }
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
    updateStartButton();
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    const playersDiv = document.getElementById('players');
    
    if (players.length > 0) {
        playerList.style.display = 'block';
        playersDiv.innerHTML = players.map((player, index) => `
            <div class="player-item">
                <span>${player}</span>
                <button class="remove-btn" onclick="removePlayer(${index})">×</button>
            </div>
        `).join('');
    } else {
        playerList.style.display = 'none';
    }
}

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

function startGame() {
    if (selectedCategories.length === 0) {
        alert('Bitte wähle mindestens eine Kategorie aus!');
        return;
    }
    
    // Alle Wörter aus ausgewählten Kategorien sammeln
    let allWords = [];
    selectedCategories.forEach(category => {
        allWords = allWords.concat(wordLists[category]);
    });
    
    // Zufälliges Wort auswählen
    selectedWord = allWords[Math.floor(Math.random() * allWords.length)];
    
    // Zufälligen Impostor auswählen
    impostorIndex = Math.floor(Math.random() * players.length);
    
    // Spielkarten erstellen (NICHT mischen, damit Reihenfolge beibehalten wird)
    gameCards = players.map((player, index) => ({
        player: player,
        word: index === impostorIndex ? 'IMPOSTOR' : selectedWord,
        isImpostor: index === impostorIndex
    }));
    
    currentPlayerIndex = 0;
    
    showScreen('game-screen');
    updateGameInfo();
    updateNextPlayerInfo();
}

function showNextCard() {
    if (currentPlayerIndex < gameCards.length) {
        const card = gameCards[currentPlayerIndex];

        document.getElementById('playerNameCard').textContent = card.player;
        document.getElementById('wordDisplay').textContent = card.word;
        document.getElementById('wordDisplay').className = card.isImpostor ? 'word impostor-word' : 'word';

        const categoryText = selectedCategories.length === 1 ? 
            selectedCategories[0].charAt(0).toUpperCase() + selectedCategories[0].slice(1) :
            `${selectedCategories.length} Kategorien`;
        document.getElementById('categoryDisplay').textContent = `Kategorie: ${categoryText}`;

        showScreen('card-screen');
    }
}

function nextPlayer() {
    currentPlayerIndex++;
    updateProgress();
    
    if (currentPlayerIndex < gameCards.length) {
        showScreen('game-screen');
        updateGameInfo();
        updateNextPlayerInfo();
    } else {
        showScreen('game-screen');
        document.getElementById('gameInfo').textContent = 'Alle Karten wurden gezeigt. Diskutiert und findet den Impostor!';
        document.getElementById('nextPlayerInfo').textContent = 'Spiel beendet - bereit für die Auflösung!';
        document.querySelector('.game-screen button').style.display = 'none';
    }
}

function updateGameInfo() {
    const gameInfo = document.getElementById('gameInfo');
    gameInfo.textContent = `Spieler: ${currentPlayerIndex + 1}/${players.length}`;
}

function updateNextPlayerInfo() {
    const nextPlayerInfo = document.getElementById('nextPlayerInfo');
    const nextPlayerName = document.getElementById('nextPlayerName');
    
    if (currentPlayerIndex < gameCards.length) {
        const playerName = gameCards[currentPlayerIndex].player;
        nextPlayerInfo.textContent = `Nächster Spieler: ${playerName}`;
        nextPlayerName.textContent = playerName;
    }
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentPlayerIndex / gameCards.length) * 100;
    progressBar.style.width = progress + '%';
}

function revealImpostor() {
    if (players.length === 0 || impostorIndex === -1) {
        alert('Kein aktives Spiel gefunden!');
        return;
    }
    
    document.getElementById('revealWord').textContent = selectedWord;
    document.getElementById('revealImpostor').textContent = players[impostorIndex];
    showScreen('reveal-screen');
}

function resetGame() {
    players = [];
    currentPlayerIndex = 0;
    selectedWord = '';
    selectedCategories = [];
    impostorIndex = -1;
    gameCards = [];
    
    document.getElementById('playerName').value = '';
    document.getElementById('selectedCategories').textContent = 'Kategorien wählen...';
    
    // Reset checkboxes
    document.querySelectorAll('#dropdownContent input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    updatePlayerList();
    updateStartButton();
    document.querySelector('.game-screen button').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    
    showScreen('setup-screen');
}

function showScreen(screenClass) {
    document.querySelectorAll('.setup-screen, .game-screen, .card-screen, .reveal-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelector('.' + screenClass).classList.add('active');
}

// Enter-Taste für Spielernamen
document.getElementById('playerName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addPlayer();
    }
});