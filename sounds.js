class SoundManager {
    constructor() {
        // Create audio elements
        this.bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3');
        this.starSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
        this.gameOverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3');

        // Configure background music
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;

        // Configure sound effects
        this.starSound.volume = 0.4;
        this.gameOverSound.volume = 0.5;

        // Add error handling
        this.bgMusic.onerror = () => console.log('Error loading background music');
        this.starSound.onerror = () => console.log('Error loading star sound');
        this.gameOverSound.onerror = () => console.log('Error loading game over sound');

        // Preload sounds
        this.bgMusic.load();
        this.starSound.load();
        this.gameOverSound.load();
    }

    startBackgroundMusic() {
        // Create user interaction promise
        if (!this.interactionPromise) {
            this.interactionPromise = new Promise(resolve => {
                document.addEventListener('click', () => resolve(), { once: true });
                document.addEventListener('keydown', () => resolve(), { once: true });
            });
        }

        // Play music after user interaction
        this.interactionPromise.then(() => {
            this.bgMusic.play().catch(error => {
                console.log('Error playing background music:', error);
            });
        });
    }

    stopBackgroundMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    playStarCollect() {
        this.starSound.currentTime = 0;
        this.starSound.play().catch(error => {
            console.log('Error playing star sound:', error);
        });
    }

    playGameOver() {
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play().catch(error => {
            console.log('Error playing game over sound:', error);
        });
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();