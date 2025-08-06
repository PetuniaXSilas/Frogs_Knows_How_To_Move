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

const scoreDiv = document.createElement('div');
scoreDiv.id = 'score';
scoreDiv.textContent = `Score: ${score} | Level: ${level}`;
scoreDiv.style.position = 'absolute';
scoreDiv.style.top = '10px';
scoreDiv.style.left = '10px';
scoreDiv.style.color = 'white';
document.body.appendChild(scoreDiv);

const livesDiv = document.createElement('div');
livesDiv.id = 'lives';
livesDiv.textContent = `Lives: ${lives}`;
livesDiv.style.position = 'absolute';
livesDiv.style.top = '10px';
livesDiv.style.right = '10px';
livesDiv.style.color = 'white';
document.body.appendChild(livesDiv);

goal.style.top = '50px';
goal.style.left = '180px';
obstacle1.style.top = '150px';
obstacle2.style.top = '250px';

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

function keepFrogInBounds() {
    frogX = Math.max(0, Math.min(360, frogX));
    frogY = Math.max(0, Math.min(360, frogY));
}

function checkCollision() {
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
        gameOver = true;
        alert('Game Over! You hit an obstacle.');
    }
}

function checkGoal() {
    const frogRect = { x: frogX, y: frogY, width: 40, height: 40 };
    const goalRect = { x: 180, y: 50, width: 40, height: 40 };

    if (frogRect.x < goalRect.x + goalRect.width &&
        frogRect.x + frogRect.width > goalRect.x &&
        frogRect.y < goalRect.y + goalRect.height &&
        frogRect.y + frogRect.height > goalRect.y) {
        gameOver = true;
        alert('You Win! You reached the goal!');
    }
}

function updateFrogPosition() {
    frog.style.left = `${frogX}px`;
    frog.style.top = `${frogY}px`;
    
    checkGoal();
    if (!isInvulnerable) {
        checkCollision();
    }
}

function updateObstacles() {
    obstacle1X += gameSpeed;
    obstacle2X -= gameSpeed;

    if (obstacle1X > 400) obstacle1X = -40;
    if (obstacle2X < -40) obstacle2X = 400;

    obstacle1.style.left = `${obstacle1X}px`;
    obstacle2.style.left = `${obstacle2X}px`;
}

function gameLoop() {
    if (!gameOver) {
        keepFrogInBounds();
        updateFrogPosition();
        updateObstacles();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();