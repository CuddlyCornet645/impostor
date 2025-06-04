let isDragging = false;
let startY = 0;
let currentY = 0;
let deckblatt = document.getElementById('deckblatt');
let wordContainer = document.getElementById('wordContainer');

// Eventlistener für Maus und Touch
deckblatt.addEventListener('mousedown', startDrag);
deckblatt.addEventListener('touchstart', startDrag, { passive: false });
window.addEventListener('mousemove', drag);
window.addEventListener('touchmove', drag, { passive: false });
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

function startDrag(e) {
    isDragging = true;
    startY = e.clientY || e.touches[0].clientY;
    currentY = parseInt(getComputedStyle(deckblatt).transform.split(',')[5]) || 0;
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    const y = e.clientY || e.touches[0].clientY;
    const diff = y - startY;
    let newY = currentY + diff;
    // Begrenze das Verschieben auf die Kartenhöhe
    const maxY = wordContainer.offsetHeight;
    if (newY < -maxY) newY = -maxY;
    if (newY > 0) newY = 0;
    deckblatt.style.transform = `translateY(${newY}px)`;
    e.preventDefault();
}

function endDrag() {
    isDragging = false;
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
        // Deckblatt zurücksetzen
        document.getElementById('deckblatt').style.transform = '';
        showScreen('card-screen');
    }
}
