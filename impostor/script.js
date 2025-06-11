let randomPlayer = '';
let players = [];
let currentPlayerIndex = 0;
let selectedWord = '';
let selectedCategories = [];
let impostorIndex = -1;
let gameCards = [];
let impostorIndices = [];
let progressBarFirstShow = true;

updatePlayerList();
updateSelectedCategories();

function getImpostorCount() {
    return Math.max(1, Math.floor(players.length / 6) + (players.length >= 6 ? 1 : 0));
}

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
            'around_the_world': '🌍 Um die Welt',
            'entertainment': '🎬 Unterhaltung', 
            'dailyLife': '🏡 Alltag',
            'animals_and_nature': '🐮 Tiere & Natur',
            'sports_and_leisure': '⚽ Sport & Freizeit',
            'knowledge_and_school': '👨‍🏫 Wissen & Schule',
            'festivals_and_celebrations': '🥳 Feste & Ferien',
            'stars_and_celebrities': '🤵‍♂️ Stars & Promis'
        };
        display.textContent = categoryNames[selectedCategories[0]];
    } else {
        display.textContent = `${selectedCategories.length} Kategorien ausgewählt`;
    }
    updateStartButton();
}
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
        updateImpostorCountDisplay();
    }
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
    updateStartButton();
    updateImpostorCountDisplay();
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
    const revealBtn = document.getElementById('revealBtn');
    if (revealBtn) {
        revealBtn.disabled = true;
        revealBtn.style.display = 'none';
    }
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
    progressBarFirstShow = true;
    document.getElementById('progressBar').style.transition = 'none';
    document.getElementById('progressBar').style.width = '0%';
    if (selectedCategories.length === 0) {
        alert('Bitte wähle mindestens eine Kategorie aus!');
        return;
    }
    if (players.length < 3) {
        alert('Mindestens 3 Spieler benötigt!');
        return;
    }

    let allWords = [];
    selectedCategories.forEach(category => {
        allWords = allWords.concat(wordLists[category]);
    });
    selectedWord = allWords[Math.floor(Math.random() * allWords.length)];
    const impostorCount = getImpostorCount();
    impostorIndices = [];
    let indices = Array.from({length: players.length}, (_, i) => i);
    for (let i = 0; i < impostorCount; i++) {
        const idx = Math.floor(Math.random() * indices.length);
        impostorIndices.push(indices[idx]);
        indices.splice(idx, 1);
    }

    gameCards = players.map((player, index) => ({
        player: player,
        word: impostorIndices.includes(index) ? 'IMPOSTOR' : selectedWord,
        isImpostor: impostorIndices.includes(index)
    }));
    currentPlayerIndex = 0;
    showScreen('game-screen');
    updateGameInfo();
    updateProgress();
    updateNextPlayerInfo();
    updateImpostorCountDisplay(); // NEU: Anzeige aktualisieren
}

function showNextCard() {
    updateProgress()
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
    resetDeckblatt();
    if (currentPlayerIndex < gameCards.length) {
        showScreen('game-screen');
        updateGameInfo();
        updateNextPlayerInfo();
    } else {
        showScreen('before-reveal-screen');
        if (players.length > 0) {
            const randomIndex = Math.floor(Math.random() * players.length);
            randomPlayer = players[randomIndex];
            // Schreibe den Namen in das gewünschte Feld (z.B. mit id="randomPlayerDisplay")
            const randomPlayerDisplay = document.getElementById('randomPlayerDisplay');
            if (randomPlayerDisplay) {
                randomPlayerDisplay.textContent = randomPlayer;
            }
        }
        const gameScreen = document.querySelector('.game-screen');
        const showCardBtn = gameScreen.querySelector('button');
        if (showCardBtn) showCardBtn.style.display = 'none';
    }
    updateProgress();
}

function showRevealScreen() {
    showScreen('reveal-screen');
    document.getElementById('revealBtn').style.display = 'none';
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
    const progressLabel = document.getElementById('progressLabel');
    const percent = Math.round((currentPlayerIndex / gameCards.length) * 100);

    // Sofortige Positionierung ohne Animation beim ersten Mal
    if (progressBarFirstShow) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        progressBarFirstShow = false;
    }
    
    // Erzwinge Layout-Neuberechnung
    void progressBar.offsetHeight;
    
    // Animation im nächsten Frame starten
    requestAnimationFrame(() => {
        progressBar.style.transition = 'width 0.5s cubic-bezier(.4,2,.6,1)';
        progressBar.style.width = percent + '%';
    });
    
    progressLabel.textContent = percent + '%';
}

function showProgressBar(targetPercent) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.transition = 'none'; // Übergang ausschalten
    progressBar.style.width = '0%';        // Sofort auf 0%

    // Im nächsten Frame (Browser-Rendering) aktivieren wir die Animation:
    requestAnimationFrame(() => {
        progressBar.style.transition = 'width 0.5s cubic-bezier(.4,2,.6,1)';
        // Jetzt Zielwert setzen:
        progressBar.style.width = targetPercent + '%';
    });
}

function updateImpostorCountDisplay() {
    const display = document.getElementById('impostorCountDisplay');
    if (!display) return;
    const count = getImpostorCount();
    display.textContent = count === 1
        ? "Es gibt 1 Impostor im Spiel."
        : `Es gibt ${count} Impostors im Spiel.`;
}

function revealImpostor() {
    if (players.length === 0 || impostorIndices.length === 0) {
        alert('Kein aktives Spiel gefunden!');
        return;
    }
    document.getElementById('revealWord').textContent = selectedWord;
    // Alle Impostor-Namen sammeln
    const impostorNames = impostorIndices.map(idx => players[idx]);
    document.getElementById('revealImpostor').textContent = 
        impostorNames.length === 1
        ? `${impostorNames[0]}`
        : `${impostorNames.join(', ')}`;
    showScreen('reveal-screen');
    showConfetti();
}

function resetGame() {
    randomPlayer = '';
    currentPlayerIndex = 0;
    selectedWord = '';
    impostorIndex = -1;
    gameCards = [];
    
    progressBarFirstShow = true;
    updatePlayerList();
    updateSelectedCategories();
    impostorIndices = [];

    document.getElementById('playerName').value = '';
    
    updatePlayerList();
    updateSelectedCategories();
    updateImpostorCountDisplay();
    updateStartButton();
    document.querySelector('.game-screen button').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    
    showScreen('setup-screen');
}

function showScreen(screenClass) {
    document.querySelectorAll('.setup-screen, .game-screen, .card-screen, .before-reveal-screen, .reveal-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelector('.' + screenClass).classList.add('active');
}

// Formatting
function fitRevealWord() {
  const word = document.querySelector('.reveal-word');
  if (!word) return;
  const parent = word.parentElement;
  word.style.fontSize = '3rem'; // Startgröße
  word.style.whiteSpace = 'normal';
  word.style.wordBreak = 'break-word';
  word.style.overflowWrap = 'break-word';
  while (word.scrollWidth > parent.clientWidth && parseFloat(word.style.fontSize) > 0.8) { // 0.8 statt 0.5
    word.style.fontSize = (parseFloat(word.style.fontSize) - 0.1) + 'rem';
  }
}
window.addEventListener('resize', fitRevealWord);
fitRevealWord();

function fitRevealText() {
  const text = document.querySelector('.reveal-text');
  if (!text) return;
  const parent = text.parentElement;
  text.style.fontSize = '1.7rem'; // Startgröße
  while (text.scrollWidth > parent.clientWidth && parseFloat(text.style.fontSize) > 0.7) {
    text.style.fontSize = (parseFloat(text.style.fontSize) - 0.05) + 'rem';
  }
}
window.addEventListener('resize', fitRevealText);
fitRevealText();


// Fun
document.getElementById('playerName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addPlayer();
        updateImpostorCountDisplay(); // NEU
    }
});

function showConfetti() {
    const colors = [
        '#ff6b6b', '#38d39f', '#764ba2', '#ffe066', '#2ecc71',
        '#ffb347', '#f67280', '#6c5ce7', '#00b894', '#fdcb6e',
        '#e17055', '#00cec9', '#fab1a0', '#636e72', '#fd79a8',
        '#f9ca24', '#00b894', '#d35400', '#c0392b', '#8e44ad'
    ];
    const confettiCount = 120;
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Position des Reveal-Words ermitteln
    const revealWord = document.querySelector('.reveal-word');
    if (!revealWord) return;
    const rect = revealWord.getBoundingClientRect();
    // Mittelpunkt des Reveal-Words im Viewport
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < confettiCount; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Startposition: Mitte des Reveal-Words
        piece.style.left = `${originX}px`;
        piece.style.top = `${originY}px`;

        // Explosion: zufälliger Winkel und Entfernung
        const angle = Math.random() * 2 * Math.PI;
        const distance = 120 + Math.random() * 340;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        piece.style.setProperty('--dx', `${dx}px`);
        piece.style.setProperty('--dy', `${dy}px`);
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.animationDelay = (Math.random() * 0.3) + 's';

        confetti.appendChild(piece);
    }
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3500);
}

document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'k') {
        showConfetti();
    }
});