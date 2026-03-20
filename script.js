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
    let currentSlide = 0;
    const totalSlides = slides.length;

    const updateSlides = () => {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'flipped', 'next');
            if (i < currentSlide) {
                slide.classList.add('flipped');
            } else if (i === currentSlide) {
                slide.classList.add('active');
            } else if (i === currentSlide + 1) {
                slide.classList.add('next');
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    // Auto Flip System
    let autoFlipTimer = null;
    const startAutoFlip = () => {
        if (autoFlipTimer) clearInterval(autoFlipTimer);
        autoFlipTimer = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlides();
            } else {
                stopAutoFlip(); // Stop at last page
            }
        }, 3500); // 3.5 seconds interval
    };

    const stopAutoFlip = () => {
        if (autoFlipTimer) clearInterval(autoFlipTimer);
        autoFlipTimer = null;
    };

    const resetAutoFlip = () => {
        stopAutoFlip();
        // Only restart if not at the end
        if (currentSlide < totalSlides - 1) {
            startAutoFlip();
        }
    };

    const handleOpen = () => {
        if (!landingPage) return;
        landingPage.classList.add('hidden');
        updateSlides();
        startAutoFlip(); // Begin auto-advance on open
        
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

    // Page Navigation (Swipe & Click)
    let touchStartX = 0;
    let touchEndX = 0;

    const navigate = (direction) => {
        if (direction === 'next' && currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlides();
            resetAutoFlip();
        } else if (direction === 'prev' && currentSlide > 0) {
            currentSlide--;
            updateSlides();
            resetAutoFlip();
        }
    };

    storyWindow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    storyWindow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(e);
    }, {passive: true});

    const handleSwipe = (e) => {
        const threshold = 50;
        const deltaX = touchStartX - touchEndX;
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) navigate('next'); // Swipe Left -> Forward
            else navigate('prev'); // Swipe Right -> Backward
        }
    };

    // Edge Tap Navigation (Like Instagram/E-readers)
    storyWindow.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.story-dot')) return;
        
        const width = window.innerWidth;
        const x = e.clientX;
        
        if (x < width * 0.3) {
            navigate('prev');
        } else {
            navigate('next');
        }
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent trigger storyWindow click
            currentSlide = index;
            updateSlides();
            resetAutoFlip();
        });
    });

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
