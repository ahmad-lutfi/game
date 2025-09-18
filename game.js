const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 16;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;

// State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1),
    size: BALL_SIZE
};

// Player paddle control via mouse
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw functions
function drawRect(x, y, w, h, color="#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

// Basic AI: move paddle towards ball
function moveAI() {
    const centerAI = aiY + PADDLE_HEIGHT / 2;
    const centerBall = ball.y + ball.size / 2;
    if (centerAI < centerBall - 10) {
        aiY += 4;
    } else if (centerAI > centerBall + 10) {
        aiY -= 4;
    }
    // Clamp
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball physics and collisions
function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collisions
    if (ball.y < 0) {
        ball.y = 0;
        ball.vy = -ball.vy;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.vy = -ball.vy;
    }

    // Paddle collisions: Left (Player)
    if (
        ball.x < PLAYER_X + PADDLE_WIDTH &&
        ball.x > PLAYER_X &&
        ball.y + ball.size > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH;
        ball.vx = -ball.vx;
        // Add some "spin" based on hit position
        let collidePoint = (ball.y + ball.size/2) - (playerY + PADDLE_HEIGHT/2);
        ball.vy = collidePoint * 0.25;
    }

    // Paddle collisions: Right (AI)
    if (
        ball.x + ball.size > AI_X &&
        ball.x + ball.size < AI_X + PADDLE_WIDTH + 2 &&
        ball.y + ball.size > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - ball.size;
        ball.vx = -ball.vx;
        let collidePoint = (ball.y + ball.size/2) - (aiY + PADDLE_HEIGHT/2);
        ball.vy = collidePoint * 0.25;
    }

    // Score (reset on miss)
    if (ball.x < 0 || ball.x + ball.size > canvas.width) {
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0ff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f0f");

    // Draw ball
    drawBall();

    // Move AI
    moveAI();

    // Update ball
    updateBall();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();