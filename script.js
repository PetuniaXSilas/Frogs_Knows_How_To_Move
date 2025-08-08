const frog = document.getElementById('frog');
const goal = document.getElementById('goal');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');

let frogX = 180;
let frogY = 350;
let obstacle1X = 0;
let obstacle2X = 400;
let gameOver = false;
let score = 0;
let lives = 3;
let gameSpeed = 2;
let level = 1;
let isInvulnerable = false;

// Create score and level display
const scoreDiv = document.createElement('div');
scoreDiv.id = 'score';
scoreDiv.textContent = `Score: ${score} | Level: ${level}`;
scoreDiv.style.position = 'absolute';
scoreDiv.style.top = '10px';
scoreDiv.style.left = '10px';
scoreDiv.style.color = 'white';
scoreDiv.style.zIndex = '100';
document.body.appendChild(scoreDiv);

// Create lives display
const livesDiv = document.createElement('div');
livesDiv.id = 'lives';
livesDiv.textContent = `Lives: ${lives}`;
livesDiv.style.position = 'absolute';
livesDiv.style.top = '10px';
livesDiv.style.right = '10px';
livesDiv.style.color = 'white';
livesDiv.style.zIndex = '100';
document.body.appendChild(livesDiv);

// Create game over screen
const gameOverDiv = document.createElement('div');
gameOverDiv.id = 'gameOverScreen';
gameOverDiv.textContent = 'Game Over! No lives left.';
gameOverDiv.style.position = 'absolute';
gameOverDiv.style.top = '50%';
gameOverDiv.style.left = '50%';
gameOverDiv.style.transform = 'translate(-50%, -50%)';
gameOverDiv.style.color = 'white';
gameOverDiv.style.fontFamily = '"OCR-A", monospace';
gameOverDiv.style.fontSize = '32px';
gameOverDiv.style.textAlign = 'center';
gameOverDiv.style.background = 'black';
gameOverDiv.style.padding = '20px';
gameOverDiv.style.border = '2px solid white';
gameOverDiv.style.boxShadow = '0 0 10px white';
gameOverDiv.style.display = 'none';
gameOverDiv.style.zIndex = '200';
gameOverDiv.style.animation = 'glitch 0.5s infinite, sway 2s ease-in-out infinite';
document.head.appendChild(document.createElement('style')).textContent = `
@keyframes glitch {
    0% { transform: translate(-50%, -50%); }
    25% { transform: translate(-50%, -50%) translateX(5px); }
    50% { transform: translate(-50%, -50%) translateY(5px); }
    75% { transform: translate(-50%, -50%) translateX(-5px); }
    100% { transform: translate(-50%, -50%); }
}
@keyframes floatUp {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(-100px); opacity: 0; }
}
@keyframes sway {
    0% { transform: translate(-50%, -50%) rotate(-5deg); }
    50% { transform: translate(-50%, -50%) rotate(5deg); }
    100% { transform: translate(-50%, -50%) rotate(-5deg); }
}`;
document.body.appendChild(gameOverDiv);

goal.style.top = '50px';
goal.style.left = '180px';
obstacle1.style.top = '150px';
obstacle2.style.top = '250px';

// Handle arrow key inputs for frog movement
document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    switch (event.key) {
        case 'ArrowUp':
            frogY -= 10;
            break;
        case 'ArrowDown':
            frogY += 10;
            break;
        case 'ArrowLeft':
            frogX -= 10;
            break;
        case 'ArrowRight':
            frogX += 10;
            break;
    }
});

// Keep frog within 400x400 game area
function keepFrogInBounds() {
    frogX = Math.max(0, Math.min(360, frogX));
    frogY = Math.max(0, Math.min(360, frogY));
}

// Check for collisions with obstacles
function checkCollision() {
    if (isInvulnerable) return;

    const frogRect = { x: frogX, y: frogY, width: 40, height: 40 };
    const obs1Rect = { x: obstacle1X, y: 150, width: 40, height: 40 };
    const obs2Rect = { x: obstacle2X, y: 250, width: 40, height: 40 };

    function isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    if (isColliding(frogRect, obs1Rect) || isColliding(frogRect, obs2Rect)) {
        // Lives tracking: Decrease lives and update display
        lives -= 1;
        livesDiv.textContent = `Lives: ${lives}`;
        frogX = 180;
        frogY = 350;
        isInvulnerable = true;
        setTimeout(() => { isInvulnerable = false; }, 2000);

        if (lives > 0) {
            // Show encouraging message for first two lives lost
            const messages = ["Don't Give Up!", "Keep Trying!"];
            const message = messages[Math.floor(Math.random() * messages.length)];
            const bubbleDiv = document.createElement('div');
            bubbleDiv.textContent = message;
            bubbleDiv.style.position = 'absolute';
            bubbleDiv.style.left = `${frogX + 40}px`;
            bubbleDiv.style.top = `${frogY - 20}px`;
            bubbleDiv.style.color = 'white';
            bubbleDiv.style.background = 'black';
            bubbleDiv.style.padding = '10px';
            bubbleDiv.style.border = '1px solid white';
            bubbleDiv.style.fontFamily = '"OCR-A", monospace';
            bubbleDiv.style.fontSize = '16px';
            bubbleDiv.style.zIndex = '150';
            bubbleDiv.style.animation = `floatUp ${3 + Math.random() * 2}s forwards`;
            document.body.appendChild(bubbleDiv);
            setTimeout(() => { bubbleDiv.remove(); }, (3 + Math.random() * 2) * 1000);
        } else {
            // Show game over screen when lives reach 0
            gameOver = true;
            gameOverDiv.style.display = 'block';
        }
    }
}

// Check if frog reaches the goal
function checkGoal() {
    const frogRect = { x: frogX, y: frogY, width: 40, height: 40 };
    const goalRect = { x: 180, y: 50, width: 40, height: 40 };

    if (frogRect.x < goalRect.x + goalRect.width &&
        frogRect.x + frogRect.width > goalRect.x &&
        frogRect.y < goalRect.y + goalRect.height &&
        frogRect.y + frogRect.height > goalRect.y) {
        // Score keeping: Increase score by 100
        score += 100;
        // Level tracking: Increment level
        level += 1;
        // Increase obstacle speed
        gameSpeed += 0.5;
        scoreDiv.textContent = `Score: ${score} | Level: ${level}`;
        frogX = 180;
        frogY = 350;
        obstacle1X = 0;
        obstacle2X = 400;
    }
}

// Update frog's position on screen
function updateFrogPosition() {
    frog.style.left = `${frogX}px`;
    frog.style.top = `${frogY}px`;
    
    checkGoal();
    if (!isInvulnerable) {
        checkCollision();
    }
}

// Update obstacle positions
function updateObstacles() {
    obstacle1X += gameSpeed;
    obstacle2X -= gameSpeed;

    if (obstacle1X > 400) obstacle1X = -40;
    if (obstacle2X < -40) obstacle2X = 400;

    obstacle1.style.left = `${obstacle1X}px`;
    obstacle2.style.left = `${obstacle2X}px`;
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        keepFrogInBounds();
        updateFrogPosition();
        updateObstacles();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();