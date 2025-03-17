class SoundManager {
    constructor() {
        // Create audio context (this is more reliable than HTML5 Audio)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Audio elements
        this.bgMusic = new Audio();
        this.starSound = new Audio();
        this.gameOverSound = new Audio();

        // Set sources
        this.bgMusic.src = 'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3';
        this.starSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3';
        this.gameOverSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3';

        // Configure background music
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;

        // Configure sound effects
        this.starSound.volume = 0.4;
        this.gameOverSound.volume = 0.5;

        // Track music state
        this.isMusicEnabled = false;
        this.hasInteracted = false;

        // Add error handling
        this.bgMusic.onerror = () => console.log('Error loading background music');
        this.starSound.onerror = () => console.log('Error loading star sound');
        this.gameOverSound.onerror = () => console.log('Error loading game over sound');

        // Preload sounds
        this.preloadSounds();
    }

    preloadSounds() {
        this.bgMusic.load();
        this.starSound.load();
        this.gameOverSound.load();
    }

    async startBackgroundMusic() {
        try {
            // Resume audio context if it's suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Start or resume the music
            if (!this.isMusicEnabled) {
                await this.bgMusic.play();
                this.isMusicEnabled = true;
                console.log('Music started successfully');
            }
        } catch (error) {
            console.log('Error starting music:', error);
            // If autoplay was prevented, we'll wait for user interaction
            if (!this.hasInteracted) {
                this.setupInteractionHandler();
            }
        }
    }

    setupInteractionHandler() {
        const handler = async () => {
            this.hasInteracted = true;
            await this.startBackgroundMusic();
            // Remove the handlers after successful interaction
            document.removeEventListener('click', handler);
            document.removeEventListener('keydown', handler);
        };

        document.addEventListener('click', handler);
        document.addEventListener('keydown', handler);
    }

    stopBackgroundMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.isMusicEnabled = false;
    }

    async playStarCollect() {
        try {
            this.starSound.currentTime = 0;
            await this.starSound.play();
        } catch (error) {
            console.log('Error playing star sound:', error);
        }
    }

    async playGameOver() {
        try {
            this.gameOverSound.currentTime = 0;
            await this.gameOverSound.play();
        } catch (error) {
            console.log('Error playing game over sound:', error);
        }
    }

    // Check if music is currently enabled
    isMusicPlaying() {
        return this.isMusicEnabled;
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Setup initial interaction handler
document.addEventListener('DOMContentLoaded', () => {
    soundManager.setupInteractionHandler();
});