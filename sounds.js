class SoundManager {
    constructor() {
        console.log('Initializing SoundManager...');
        
        // Create audio context (this is more reliable than HTML5 Audio)
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioContext created successfully');
        } catch (error) {
            console.error('Failed to create AudioContext:', error);
        }
        
        // Audio elements
        this.bgMusic = new Audio();
        this.starSound = new Audio();
        this.gameOverSound = new Audio();

        // Set sources using freely available sounds
        this.bgMusic.src = 'https://raw.githubusercontent.com/ghostli123/second-game/main/assets/background-music.mp3';
        this.starSound.src = 'https://raw.githubusercontent.com/ghostli123/second-game/main/assets/collect-star.mp3';
        this.gameOverSound.src = 'https://raw.githubusercontent.com/ghostli123/second-game/main/assets/game-over.mp3';

        // Configure background music
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;
        this.bgMusic.preload = 'auto';

        // Configure sound effects
        this.starSound.volume = 0.4;
        this.gameOverSound.volume = 0.5;

        // Track music state
        this.isMusicEnabled = false;
        this.hasInteracted = false;

        // Add error handling and load events
        this.bgMusic.onerror = (e) => console.error('Error loading background music:', e);
        this.starSound.onerror = (e) => console.error('Error loading star sound:', e);
        this.gameOverSound.onerror = (e) => console.error('Error loading game over sound:', e);

        this.bgMusic.oncanplaythrough = () => console.log('Background music loaded and ready');
        this.starSound.oncanplaythrough = () => console.log('Star sound loaded and ready');
        this.gameOverSound.oncanplaythrough = () => console.log('Game over sound loaded and ready');

        // Preload sounds
        this.preloadSounds();
        
        // Setup initial interaction handler
        this.setupInteractionHandler();
        
        console.log('SoundManager initialization complete');
    }

    preloadSounds() {
        console.log('Preloading sounds...');
        try {
            this.bgMusic.load();
            this.starSound.load();
            this.gameOverSound.load();
        } catch (error) {
            console.error('Error preloading sounds:', error);
        }
    }

    async startBackgroundMusic() {
        console.log('Attempting to start background music...');
        try {
            // Resume audio context if it's suspended
            if (this.audioContext.state === 'suspended') {
                console.log('Resuming suspended AudioContext...');
                await this.audioContext.resume();
            }

            // Start or resume the music
            if (!this.isMusicEnabled) {
                console.log('Playing background music...');
                await this.bgMusic.play();
                this.isMusicEnabled = true;
                console.log('Music started successfully');
                return true;
            }
        } catch (error) {
            console.error('Error starting music:', error);
            // If autoplay was prevented, we'll wait for user interaction
            if (!this.hasInteracted) {
                console.log('Setting up interaction handler due to autoplay prevention');
                this.setupInteractionHandler();
            }
            return false;
        }
    }

    setupInteractionHandler() {
        console.log('Setting up interaction handler...');
        const handler = async () => {
            console.log('User interaction detected');
            this.hasInteracted = true;
            const success = await this.startBackgroundMusic();
            if (success) {
                console.log('Removing interaction handlers');
                document.removeEventListener('click', handler);
                document.removeEventListener('keydown', handler);
                document.removeEventListener('touchstart', handler);
            }
        };

        document.addEventListener('click', handler);
        document.addEventListener('keydown', handler);
        document.addEventListener('touchstart', handler);
    }

    stopBackgroundMusic() {
        console.log('Stopping background music...');
        try {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.isMusicEnabled = false;
            console.log('Background music stopped');
        } catch (error) {
            console.error('Error stopping music:', error);
        }
    }

    async playStarCollect() {
        try {
            this.starSound.currentTime = 0;
            await this.starSound.play();
        } catch (error) {
            console.error('Error playing star sound:', error);
        }
    }

    async playGameOver() {
        try {
            this.gameOverSound.currentTime = 0;
            await this.gameOverSound.play();
        } catch (error) {
            console.error('Error playing game over sound:', error);
        }
    }

    // Check if music is currently enabled
    isMusicPlaying() {
        return this.isMusicEnabled;
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();