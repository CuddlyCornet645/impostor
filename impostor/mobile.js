// let isDragging = false;
// let dragStartY = 0;
// let dragOffsetY = 0;
// let deckblattMoved = false; // NEU!
// const deckblatt = document.getElementById('deckblatt');
// const wordContainer = document.getElementById('wordContainer');
// const nextBtn = document.getElementById('nextBtn');

// // Hilfsfunktion wie gehabt
// function getEventY(e) {
//     if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
//     if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientY;
//     return e.clientY;
// }

// function onDragStart(e) {
//     if (e.type === 'mousedown' && e.button !== 0) return;
//     isDragging = true;
//     dragStartY = getEventY(e);
//     const match = deckblatt.style.transform.match(/translateY\((-?\d+)px\)/);
//     dragOffsetY = match ? parseInt(match[1]) : 0;
//     if (e.type.startsWith('touch')) e.preventDefault();
//     window.addEventListener('mousemove', onDragMove);
//     window.addEventListener('mouseup', onDragEnd);
//     window.addEventListener('touchmove', onDragMove, { passive: false });
//     window.addEventListener('touchend', onDragEnd);
// }

// function onDragMove(e) {
//     if (!isDragging) return;
//     const currentY = getEventY(e);
//     let newY = dragOffsetY + (currentY - dragStartY);
//     // Begrenzung: Deckblatt darf maximal bis -maxDragY verschoben werden
//     const maxDragY = wordContainer.offsetHeight * 0.95; // nicht ganz raus
//     const maxY = 0;
//     const minY = -maxDragY;
//     newY = Math.min(maxY, Math.max(minY, newY));
//     deckblatt.style.transform = `translateY(${newY}px)`;

//     // Button anzeigen, sobald bewegt
//     if (!deckblattMoved && Math.abs(newY) > 10) {
//         deckblattMoved = true;
//         nextBtn.classList.remove('hidden');
//     }
//     if (e.type.startsWith('touch')) e.preventDefault();
// }

// function onDragEnd() {
//     isDragging = false;
//     window.removeEventListener('mousemove', onDragMove);
//     window.removeEventListener('mouseup', onDragEnd);
//     window.removeEventListener('touchmove', onDragMove);
//     window.removeEventListener('touchend', onDragEnd);
// }

// // Eventlistener initialisieren
// deckblatt.addEventListener('mousedown', onDragStart);
// deckblatt.addEventListener('touchstart', onDragStart, { passive: false });

// // Funktion zum Zurücksetzen beim Kartenwechsel
// function resetDeckblatt() {
//     deckblatt.style.transform = 'translateY(0px)';
//     deckblattMoved = false;
//     nextBtn.classList.add('hidden');
//     // Falls du opacity oder display benutzt, hier zurücksetzen:
//     deckblatt.style.opacity = '1';
//     deckblatt.style.display = '';
// }


let isDragging = false;
let dragStartY = 0;
let dragOffsetY = 0;
let deckblattMoved = false;
const deckblatt = document.getElementById('deckblatt');
const wordContainer = document.getElementById('wordContainer');
const nextBtn = document.getElementById('nextBtn');

// Hilfsfunktion für Y-Koordinaten
function getEventY(e) {
    if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
    if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientY;
    return e.clientY;
}

// Drag-Start
function onDragStart(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    isDragging = true;
    dragStartY = getEventY(e);

    // Aktuelle Y-Position extrahieren
    const match = deckblatt.style.transform.match(/translateY\((-?\d+)px\)/);
    dragOffsetY = match ? parseInt(match[1]) : 0;

    // Animation deaktivieren, um direkte Bewegung zu ermöglichen
    deckblatt.style.transition = 'none';

    if (e.type.startsWith('touch')) e.preventDefault();
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
}

// Drag-Bewegung
function onDragMove(e) {
    if (!isDragging) return;

    const currentY = getEventY(e);
    let newY = dragOffsetY + (currentY - dragStartY);

    const maxDragY = wordContainer.offsetHeight * 0.95;
    const maxY = 0;
    const minY = -maxDragY;
    newY = Math.min(maxY, Math.max(minY, newY));

    deckblatt.style.transform = `translateY(${newY}px)`;

    // Button anzeigen, sobald Bewegung erkannt wurde
    if (!deckblattMoved && Math.abs(newY) > 10) {
        deckblattMoved = true;
        nextBtn.classList.remove('hidden');
    }

    if (e.type.startsWith('touch')) e.preventDefault();
}

// Drag-Ende + automatische Rückkehr mit Animation
function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    // Eventlistener entfernen
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
    window.removeEventListener('touchmove', onDragMove);
    window.removeEventListener('touchend', onDragEnd);

    // Bouncy-Animation aktivieren
    deckblatt.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    deckblatt.style.transform = 'translateY(0px)';
}

// Zurücksetzen beim Kartenwechsel
function resetDeckblatt() {
    deckblatt.style.transition = 'none';
    deckblatt.style.transform = 'translateY(0px)';
    deckblattMoved = false;
    nextBtn.classList.add('hidden');
    deckblatt.style.opacity = '1';
    deckblatt.style.display = '';
}

// Eventlistener initialisieren
deckblatt.addEventListener('mousedown', onDragStart);
deckblatt.addEventListener('touchstart', onDragStart, { passive: false });
