const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const toggleMusicButton = document.getElementById('toggleMusic');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game objects
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: '#00ff00'
};

const stars = [];
const obstacles = [];
let score = 0;
let isMusicPlaying = false;

// Game settings
const starCount = 5;
const obstacleCount = 3;
const starSize = 20;
const obstacleSize = 40;

// Initialize stars
function createStar() {
    return {
        x: Math.random() * (canvas.width - starSize),
        y: Math.random() * (canvas.height - starSize),
        size: starSize,
        color: '#ffff00'
    };
}

// Initialize obstacles
function createObstacle() {
    return {
        x: Math.random() * (canvas.width - obstacleSize),
        y: Math.random() * (canvas.height - obstacleSize),
        size: obstacleSize,
        color: '#ff0000',
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4
    };
}

// Initialize game objects
for (let i = 0; i < starCount; i++) {
    stars.push(createStar());
}

for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(createObstacle());
}

// Handle keyboard input
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Music controls
toggleMusicButton.addEventListener('click', () => {
    if (isMusicPlaying) {
        soundManager.stopBackgroundMusic();
        toggleMusicButton.textContent = '🔈 Toggle Music';
        toggleMusicButton.classList.add('muted');
    } else {
        soundManager.startBackgroundMusic();
        toggleMusicButton.textContent = '🔊 Toggle Music';
        toggleMusicButton.classList.remove('muted');
    }
    isMusicPlaying = !isMusicPlaying;
});

// Update player position
function updatePlayer() {
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.size) player.x += player.speed;
}

// Update obstacles position
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.speedX;
        obstacle.y += obstacle.speedY;

        // Bounce off walls
        if (obstacle.x <= 0 || obstacle.x >= canvas.width - obstacle.size) {
            obstacle.speedX *= -1;
        }
        if (obstacle.y <= 0 || obstacle.y >= canvas.height - obstacle.size) {
            obstacle.speedY *= -1;
        }
    });
}

// Check collisions
function checkCollisions() {
    // Check star collisions
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (isColliding(player, star)) {
            stars.splice(i, 1);
            stars.push(createStar());
            score += 10;
            scoreElement.textContent = score;
            soundManager.playStarCollect();
        }
    }

    // Check obstacle collisions
    obstacles.forEach(obstacle => {
        if (isColliding(player, obstacle)) {
            // Game over
            soundManager.playGameOver();
            alert(`Game Over! Final Score: ${score}`);
            resetGame();
        }
    });
}

// Collision detection helper
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.size &&
           obj1.x + obj1.size > obj2.x &&
           obj1.y < obj2.y + obj2.size &&
           obj1.y + obj1.size > obj2.y;
}

// Reset game
function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // Reset stars and obstacles
    stars.length = 0;
    obstacles.length = 0;

    for (let i = 0; i < starCount; i++) {
        stars.push(createStar());
    }

    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push(createObstacle());
    }
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Draw stars
    stars.forEach(star => {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.moveTo(star.x + star.size / 2, star.y);
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(
                star.x + star.size / 2 + star.size / 2 * Math.cos((i * 4 * Math.PI) / 5),
                star.y + star.size / 2 + star.size / 2 * Math.sin((i * 4 * Math.PI) / 5)
            );
        }
        ctx.closePath();
        ctx.fill();
    });

    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateObstacles();
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();