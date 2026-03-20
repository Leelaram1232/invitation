document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const openBtn = document.getElementById('openInvitation');
    const container = document.getElementById('storyWindow');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.story-dot');
    const flowerLayer = document.getElementById('flowerLayer');

    // Opening Control
    const handleOpen = () => {
        landingPage.classList.add('hidden');
        // Initial slide animation if first slide is already visible
        slides[0].classList.add('active');
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    landingPage.addEventListener('touchstart', handleOpen, {passive: true});

    // Side Progress Tracking
    const observerOptions = {
        threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update dots
                const index = Array.from(slides).indexOf(entry.target);
                updateDots(index);
            }
        });
    }, observerOptions);

    slides.forEach(slide => observer.observe(slide));

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Flower VFX Generator
    function createPetal() {
        if (!flowerLayer) return;
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize
        const isGold = Math.random() > 0.7; // 30% Gold petals
        petal.style.width = Math.random() * 15 + 10 + 'px';
        petal.style.height = petal.style.width;
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 6 + 4 + 's';
        petal.style.opacity = Math.random() * 0.6 + 0.3;
        
        // Color / Image Fallback
        petal.style.backgroundColor = isGold ? '#FFD700' : '#FFC0CB';
        petal.style.borderRadius = '20px 0 20px 0';
        petal.style.filter = 'blur(1px)';
        
        flowerLayer.appendChild(petal);
        
        // Remove after animation
        setTimeout(() => {
            petal.remove();
        }, 10000);
    }

    // Spawn more flowers
    setInterval(createPetal, 1000); // 1 flower per second

    // Audio Control
    const audioToggle = document.getElementById('audioToggle');
    let isPlaying = false;
    audioToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        audioToggle.querySelector('.music-icon').textContent = isPlaying ? '🔊' : '🎵';
        // if(window.bgAudio) isPlaying ? window.bgAudio.play() : window.bgAudio.pause();
    });

    // Mobile Orientation Fix (Visual)
    const resizeBook = () => {
        // Enforce aspect ratio logic or just ensure container fits
    };
    window.addEventListener('resize', resizeBook);
    resizeBook();
});
