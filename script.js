document.addEventListener('DOMContentLoaded', () => {
    const introDoors = document.getElementById('introDoors');
    const landingPage = document.getElementById('landingPage');
    const openBtn = document.getElementById('openInvitation');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.story-dot');
    const flowerLayer = document.getElementById('flowerLayer');
    const audioToggle = document.getElementById('audioToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isMuted = false;

    // Phase 1: OPEN DOORS
    const handleDoorOpen = () => {
        if (introDoors.classList.contains('opened')) return;
        introDoors.classList.add('opened');
        
        // OPTIONAL: Start music on first tap to be more immersive
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.error("Audio block:", e));
        }

        // Remove doors from DOM after animation
        setTimeout(() => {
            introDoors.classList.add('hidden');
        }, 1500);
    };

    introDoors.addEventListener('click', handleDoorOpen);
    introDoors.addEventListener('touchstart', (e) => {
        handleDoorOpen();
        e.preventDefault();
    }, {passive: false});

    // Phase 2: OPEN INVITATION (Landing to Reel)
    const handleOpen = () => {
        landingPage.classList.add('hidden');
        if (slides[0]) slides[0].classList.add('active');
        
        // Ensure music is playing
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.error("Audio error:", e));
        }
        audioToggle.querySelector('.music-icon').textContent = '🔊';
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    landingPage.addEventListener('touchstart', handleOpen, {passive: true});

    // Audio & Particles
    audioToggle.addEventListener('click', () => {
        if (!bgMusic) return;
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        audioToggle.querySelector('.music-icon').textContent = isMuted ? '🔇' : '🔊';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const index = Array.from(slides).indexOf(entry.target);
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            }
        });
    }, { threshold: 0.6 });
    slides.forEach(slide => observer.observe(slide));

    function createPetal() {
        if (!flowerLayer) return;
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const isGold = Math.random() > 0.7;
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 6 + 4 + 's';
        petal.style.backgroundColor = isGold ? '#FFD700' : '#FFC0CB';
        flowerLayer.appendChild(petal);
        setTimeout(() => petal.remove(), 10000);
    }
    setInterval(createPetal, 1000);
});
