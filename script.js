document.addEventListener('DOMContentLoaded', () => {
    const introDoors = document.getElementById('introDoors');
    const landingPage = document.getElementById('landingPage');
    const openBtn = document.getElementById('openInvitation');
    const storyWindow = document.getElementById('storyWindow');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.story-dot');
    const flowerLayer = document.getElementById('flowerLayer');
    const audioToggle = document.getElementById('audioToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isMuted = false;

    // Phase 1: Tap Doors (Start Music & Reveal Landing)
    const handleDoorOpen = () => {
        if (!introDoors || introDoors.classList.contains('opened')) return;
        introDoors.classList.add('opened');
        
        // Mobile Audio Trigger on first user interaction
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.error("Audio blocked by browser:", e));
        }

        setTimeout(() => {
            introDoors.classList.add('hidden');
        }, 1500);
    };

    if (introDoors) {
        introDoors.addEventListener('click', handleDoorOpen);
        introDoors.addEventListener('touchstart', handleDoorOpen, {passive: true});
    }

    // Phase 2: Open Stories (Landing to Reel)
    const handleOpen = () => {
        if (!landingPage) return;
        landingPage.classList.add('hidden');
        if (slides[0]) slides[0].classList.add('active');
        
        // Second attempt to ensure audio is playing
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.error("Audio start error:", e));
        }
        audioToggle.querySelector('.music-icon').textContent = '🔊';
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (landingPage) landingPage.addEventListener('touchstart', (e) => {
        if (e.target.id === 'openInvitation') handleOpen();
    }, {passive: true});

    // Audio Control Toggle
    audioToggle.addEventListener('click', () => {
        if (!bgMusic) return;
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        audioToggle.querySelector('.music-icon').textContent = isMuted ? '🔇' : '🔊';
    });

    // Story Slide Observer (RELIABLE FLOW)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Deactivate all first
                slides.forEach(s => s.classList.remove('active'));
                entry.target.classList.add('active');
                
                const index = Array.from(slides).indexOf(entry.target);
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            }
        });
    }, { 
        threshold: 0.5,
        root: storyWindow 
    });

    slides.forEach(slide => observer.observe(slide));

    // Particles System
    function createPetal() {
        if (!flowerLayer) return;
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const isGold = Math.random() > 0.7;
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 6 + 4 + 's';
        petal.style.backgroundColor = isGold ? '#FFD700' : '#FFC0CB';
        flowerLayer.appendChild(petal);
        setTimeout(() => petal.remove(), 12000);
    }
    setInterval(createPetal, 1200);
});
