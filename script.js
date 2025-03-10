const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Cargar imagen principal
const image = new Image();
image.src = "assets/imagenes/connor.webp"; // Reemplaza con tu URL

// Cargar imagen de enemigo y meta
const enemyImage = new Image();
enemyImage.src = "assets/imagenes/enemigo.png";
const goalImage = new Image();
goalImage.src = "URL_META";

// Cargar sonido
const sound = new Audio("assets/sonidos/samuel.mp3");

// Jugador
const player = {
    x: 100, y: 500, width: 40, height: 40, speed: 5, velocityY: 0, gravity: 0.5,
    jumping: false, cameraX: 0
};

let hasKey = false;
let level = 0;
const levels = [
    { platforms: [{ x: 0, y: 550, width: 1200, height: 50 }, { x: 300, y: 450, width: 150, height: 20 }], 
      key: { x: 600, y: 420 }, door: { x: 1100, y: 500 },
      enemies: [{ x: 500, y: 510 }] },
    { platforms: [{ x: 0, y: 550, width: 1200, height: 50 }, { x: 400, y: 400, width: 200, height: 20 }], 
      key: { x: 800, y: 370 }, door: { x: 1100, y: 500 },
      enemies: [{ x: 700, y: 510 }] }
];

const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

function movePlayer() {
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;
    if (keys["w"] && !player.jumping) {
        player.velocityY = -10;
        player.jumping = true;
        sound.play();
    }
    
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    
    let onPlatform = false;
    levels[level].platforms.forEach(p => {
        if (player.y + player.height > p.y && player.y + player.height - player.velocityY <= p.y &&
            player.x + player.width > p.x && player.x < p.x + p.width) {
            player.y = p.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            onPlatform = true;
        }
    });
    
    if (!onPlatform && player.y + player.height < canvas.height) {
        player.jumping = true;
    }
    
    player.cameraX = player.x - canvas.width / 2 + player.width / 2;
    if (player.cameraX < 0) player.cameraX = 0;
    
    // Si toca la puerta y tiene la llave, avanza de nivel
    if (player.x + player.width > levels[level].door.x && player.x < levels[level].door.x + 40 &&
        player.y + player.height > levels[level].door.y && player.y < levels[level].door.y + 50 && hasKey) {
        level = (level + 1) % levels.length;
        player.x = 100;
        player.y = 500;
        hasKey = false;
    }
    
    // Si toca la llave, la recoge
    if (!hasKey && player.x + player.width > levels[level].key.x && player.x < levels[level].key.x + 30 &&
        player.y + player.height > levels[level].key.y && player.y < levels[level].key.y + 30) {
        hasKey = true;
    }
}

function drawLevel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-player.cameraX, 0);
    
    drawTransparentImage(image, 0, 0, 1200, canvas.height, "rgba(0, 0, 255, 0.3)"); // Cielo azulado
    drawTransparentImage(image, 700, 50, 50, 50, "rgba(255, 255, 0, 0.5)"); // Sol
    
    const currentLevel = levels[level];
    currentLevel.platforms.forEach(p => ctx.drawImage(image, p.x, p.y, p.width, p.height));
    drawTransparentImage(image, 150, 520, 50, 30, "rgba(0, 255, 0, 0.5)"); // Arbusto
    
    ctx.drawImage(image, player.x, player.y, player.width, player.height); // Personaje
    if (!hasKey) ctx.drawImage(image, currentLevel.key.x, currentLevel.key.y, 30, 30); // Llave
    ctx.drawImage(goalImage, currentLevel.door.x, currentLevel.door.y, 40, 50); // Meta
    currentLevel.enemies.forEach(e => ctx.drawImage(enemyImage, e.x, e.y, 40, 40));
    
    ctx.restore();
}

function drawTransparentImage(img, x, y, width, height, color) {
    ctx.save();
    ctx.drawImage(img, x, y, width, height);
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
}

function gameLoop() {
    movePlayer();
    drawLevel();
    requestAnimationFrame(gameLoop);
}

gameLoop();
