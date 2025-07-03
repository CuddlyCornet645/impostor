function navigateToPage(page) {
  const routes = {
    home: '/',
    impostor: '/impostor',
    'wer-würde-eher': '/wer-würde-eher',
    'wahrheit-oder-tat': '/wahrheit-oder-tat',
    matrix: '/matrix'
  };

  const url = routes[page];

  if (url) {
    window.open(url);
  } else {
    console.error(`Unbekannte Seite: "${page}"`);
  }
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.game-card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.game-card:not(.coming-soon)').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});
