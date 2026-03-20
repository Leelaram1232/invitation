let player;
const YT_VIDEO_ID = 'qvzfdkT0QoM'; 
let isPlayerReady = false;

// YouTube API Callback (MUST BE GLOBAL)
window.onYouTubeIframeAPIReady = function() {
    console.log("YouTube API Ready.");
    player = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        videoId: YT_VIDEO_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'mute': 0,
            'loop': 1,
            'playlist': YT_VIDEO_ID,
            'playsinline': 1
        },
        events: {
            'onReady': (event) => {
                console.log("Player Ready.");
                isPlayerReady = true;
            },
            'onStateChange': (event) => {
                if (event.data === YT.PlayerState.ENDED) {
                    player.playVideo(); // Force loop if playlist loop fails
                }
            },
            'onError': (e) => {
                console.error("YouTube Error:", e.data);
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const openBtn = document.getElementById('openInvitation');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.story-dot');
    const flowerLayer = document.getElementById('flowerLayer');
    const audioToggle = document.getElementById('audioToggle');
    let isMuted = false;

    // Handle Opening
    const handleOpen = () => {
        console.log("Attempting to open...");
        landingPage.classList.add('hidden');
        if (slides[0]) slides[0].classList.add('active');
        
        // Attempt to play music exactly when user clicks
        if (isPlayerReady && player) {
            console.log("Playing video...");
            player.unMute();
            player.playVideo();
            audioToggle.querySelector('.music-icon').textContent = '🔊';
        } else {
            console.log("Player not ready yet. Retrying in 1s...");
            // Retry play after a short delay if API was still loading
            setTimeout(() => {
                if (player) {
                    player.unMute();
                    player.playVideo();
                    audioToggle.querySelector('.music-icon').textContent = '🔊';
                }
            }, 1000);
        }
    };

    if (openBtn) openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleOpen();
    });

    // Audio Toggle
    audioToggle.addEventListener('click', () => {
        if (!player) return;
        isMuted = !isMuted;
        if (isMuted) {
            player.mute();
            audioToggle.querySelector('.music-icon').textContent = '🔇';
        } else {
            player.unMute();
            audioToggle.querySelector('.music-icon').textContent = '🔊';
        }
    });

    // Slides Intersection Observer
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

    // Flower Particles
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
