// Configuración del canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Cargar imagen de texturas
const texture = new Image();
texture.src = "textura.png"; // Cambia esto por tu imagen de texturas

// Variables del jugador
const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0,
    dy: 0,
    onGround: false
};

// Teclas
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Plataforma de prueba
const platforms = [
    { x: 0, y: 350, width: 800, height: 50 }, // Suelo
    { x: 200, y: 280, width: 100, height: 20 },
    { x: 400, y: 200, width: 150, height: 20 }
];

// Dibujar plataformas
function drawPlatforms() {
    platforms.forEach(plat => {
        ctx.drawImage(texture, 0, 0, 32, 32, plat.x, plat.y, plat.width, plat.height);
    });
}

// Dibujar jugador
function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Lógica de movimiento
function updatePlayer() {
    player.dx = 0;
    if (keys["a"]) player.dx = -player.speed;
    if (keys["d"]) player.dx = player.speed;
    if (keys["w"] && player.onGround) {
        player.dy = -10;
        player.onGround = false;
    }

    player.dy += 0.5; // Gravedad
    player.x += player.dx;
    player.y += player.dy;
    checkCollisions();
}

// Detección de colisiones con plataformas
function checkCollisions() {
    player.onGround = false;
    platforms.forEach(plat => {
        if (player.y + player.height > plat.y && player.y + player.height - player.dy <= plat.y &&
            player.x + player.width > plat.x && player.x < plat.x + plat.width) {
            player.y = plat.y - player.height;
            player.dy = 0;
            player.onGround = true;
        }
    });
}

// Bucle del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
    updatePlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();
