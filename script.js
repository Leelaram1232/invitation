document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const openBtn = document.getElementById('openInvitation');
    const container = document.getElementById('storyWindow');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.story-dot');
    const flowerLayer = document.getElementById('flowerLayer');
    const audioToggle = document.getElementById('audioToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isMuted = false;

    // Opening Control
    const handleOpen = () => {
        landingPage.classList.add('hidden');
        if (slides[0]) slides[0].classList.add('active');
        
        // Start Local Music on Open
        if (bgMusic) {
            bgMusic.play().catch(e => console.error("Audio error:", e));
            audioToggle.querySelector('.music-icon').textContent = '🔊';
        }
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    landingPage.addEventListener('touchstart', handleOpen, {passive: true});

    // Mute/Unmute Toggle
    audioToggle.addEventListener('click', () => {
        if (!bgMusic) return;
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        audioToggle.querySelector('.music-icon').textContent = isMuted ? '🔇' : '🔊';
    });

    // Story Tracking
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

    // Flower VFX Generator
    function createPetal() {
        if (!flowerLayer) return;
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const isGold = Math.random() > 0.7;
        petal.style.width = Math.random() * 15 + 10 + 'px';
        petal.style.height = petal.style.width;
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 6 + 4 + 's';
        petal.style.opacity = Math.random() * 0.6 + 0.3;
        petal.style.backgroundColor = isGold ? '#FFD700' : '#FFC0CB';
        petal.style.borderRadius = '20px 0 20px 0';
        flowerLayer.appendChild(petal);
        setTimeout(() => petal.remove(), 10000);
    }
    setInterval(createPetal, 1000);
});
