// Sound management system
class SoundManager {
    constructor() {
        this.bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3');
        this.starSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
        this.gameOverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3');

        // Configure background music
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;

        // Configure sound effects
        this.starSound.volume = 0.4;
        this.gameOverSound.volume = 0.5;
    }

    startBackgroundMusic() {
        this.bgMusic.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
    }

    stopBackgroundMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    playStarCollect() {
        this.starSound.currentTime = 0;
        this.starSound.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
    }

    playGameOver() {
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();