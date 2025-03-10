const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameSound = document.getElementById('gameSound');
canvas.width = 800;
canvas.height = 600;

let levels = [
    { platforms: [{ x: 0, y: 550, width: 800, height: 50 }, { x: 300, y: 400, width: 200, height: 20 }], key: { x: 500, y: 370, width: 30, height: 30 }, princess: { x: 750, y: 500, width: 40, height: 50 }, enemies: [{ x: 400, y: 500, width: 40, height: 40, speed: 2, direction: 1 }] },
    { platforms: [{ x: 0, y: 550, width: 800, height: 50 }, { x: 100, y: 400, width: 150, height: 20 }, { x: 400, y: 300, width: 200, height: 20 }], key: { x: 450, y: 270, width: 30, height: 30 }, princess: { x: 750, y: 500, width: 40, height: 50 }, enemies: [{ x: 600, y: 500, width: 40, height: 40, speed: 3, direction: -1 }] },
    { platforms: [{ x: 0, y: 550, width: 800, height: 50 }, { x: 200, y: 350, width: 150, height: 20 }, { x: 500, y: 250, width: 150, height: 20 }], key: { x: 550, y: 220, width: 30, height: 30 }, princess: { x: 750, y: 500, width: 40, height: 50 }, enemies: [{ x: 300, y: 500, width: 40, height: 40, speed: 4, direction: 1 }] }
];
let currentLevel = 0;

let player = { x: 50, y: 500, width: 50, height: 50, speed: 5, velY: 0, jumping: false, hasKey: false };
let gravity = 0.5;
let keys = {};
let gameStarted = false;

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function startGame() {
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    gameStarted = true;
    gameLoop();
}

function playSound() {
    gameSound.currentTime = 0;
    gameSound.play();
}

function update() {
    if (keys['a']) player.x -= player.speed;
    if (keys['d']) player.x += player.speed;
    if (keys['w'] && !player.jumping) {
        player.velY = -10;
        player.jumping = true;
        playSound();
    }
    player.y += player.velY;
    player.velY += gravity;
    let level = levels[currentLevel];
    
    level.platforms.forEach(p => {
        if (player.y + player.height >= p.y && player.y + player.height - player.velY < p.y && player.x < p.x + p.width && player.x + player.width > p.x) {
            player.y = p.y - player.height;
            player.jumping = false;
            player.velY = 0;
        }
    });
    
    if (!player.hasKey && player.x < level.key.x + level.key.width && player.x + player.width > level.key.x && player.y < level.key.y + level.key.height && player.y + player.height > level.key.y) {
        player.hasKey = true;
        playSound();
    }
    
    if (player.hasKey && player.x < level.princess.x + level.princess.width && player.x + player.width > level.princess.x && player.y < level.princess.y + level.princess.height && player.y + player.height > level.princess.y) {
        nextLevel();
        playSound();
    }
}

function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        alert('¡Ganaste!');
        currentLevel = 0;
    }
    player.x = 50;
    player.y = 500;
    player.hasKey = false;
}

gameLoop();
