// ============================
// VARIABLES Y ASSETS
// ============================
const texturafondo = "assets/imagenes/azul.jpg";
const texturapersonaje = "assets/imagenes/connor.webp";
const texturaenemigo = "assets/imagenes/enemigo.png";
const texturaprincesa = "assets/emanu.png";
const texturaplataforma = "assets/imagenes/velde.jpg";
const sonidotodo = "assets/sonidos/samuel.mp3";

const sonido = new Audio(sonidotodo);

function reproducirSonido() {
    sonido.currentTime = 0;
    sonido.play();
}

// ============================
// CANVAS Y CONTEXTO
// ============================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
canvas.style.display = "none"; // Ocultar canvas hasta que inicie el juego

const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

// ============================
// VARIABLES DEL JUEGO
// ============================
let nivelActual = 1;
let vidas = 3;
let x = 100, y = 500, velocidadX = 0, velocidadY = 0;
let enSuelo = false;
let llaveX = 400, llaveY = 300, princesaX = 650, princesaY = 500;
let enemigoX = 600, enemigoY = 500;
let plataformas = [
    { x: 50, y: 550, width: 200 },
    { x: 300, y: 450, width: 150 },
    { x: 500, y: 350, width: 150 },
    { x: 650, y: 500, width: 100 }
];

// ============================
// CARGA DE IMÁGENES
// ============================
const fondo = new Image();
fondo.src = texturafondo;

const personaje = new Image();
personaje.src = texturapersonaje;

const llave = new Image();
llave.src = texturapersonaje;

const princesa = new Image();
princesa.src = texturaprincesa;

const enemigo = new Image();
enemigo.src = texturaenemigo;

const plataforma = new Image();
plataforma.src = texturaplataforma;

// ============================
// FUNCIÓN PARA DIBUJAR EL JUEGO
// ============================
function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    plataformas.forEach(p => ctx.drawImage(plataforma, p.x, p.y, p.width, 20));
    ctx.drawImage(personaje, x, y, 50, 50);
    ctx.drawImage(princesa, princesaX, princesaY, 50, 50);
    ctx.drawImage(llave, llaveX, llaveY, 30, 30);
    ctx.drawImage(enemigo, enemigoX, enemigoY, 50, 50);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Vidas: ${vidas}`, 10, 20);
    ctx.fillText(`Nivel: ${nivelActual}`, 10, 40);
    requestAnimationFrame(dibujar);
}

// ============================
// FUNCIÓN PARA ACTUALIZAR EL JUEGO
// ============================
function actualizar() {
    velocidadY += 0.5; // Gravedad
    velocidadX *= 0.9; // Inercia
    x += velocidadX;
    y += velocidadY;

    enSuelo = false;
    plataformas.forEach(p => {
        if (y + 50 >= p.y && y + 50 <= p.y + 10 && x + 50 > p.x && x < p.x + p.width) {
            y = p.y - 50;
            velocidadY = 0;
            enSuelo = true;
        }
    });

    // Limites del canvas
    if (x < 0) x = 0;
    if (x + 50 > canvas.width) x = canvas.width - 50;
    if (y > canvas.height) {
        vidas--;
        x = 100; y = 500; velocidadX = 0; velocidadY = 0;
    }

    // Colisión con enemigo
    if (x + 50 > enemigoX && x - 50 < enemigoX && y + 50 > enemigoY && y - 50 < enemigoY) {
        vidas--;
        x = 100; y = 500;
        reproducirSonido();
    }
    // Recoger llave
    if (x + 50 > llaveX && x - 50 < llaveX && y + 50 > llaveY && y - 50 < llaveY) {
        llaveX = -100; llaveY = -100;
        reproducirSonido();
    }
    // Llegar a la princesa
    if (x + 50 > princesaX && x - 50 < princesaX && y + 50 > princesaY && y - 50 < princesaY) {
        nivelActual++;
        x = 100; y = 500;
        reproducirSonido();
    }
    if (vidas === 0) {
        alert('Game Over!');
        location.reload();
    }
    requestAnimationFrame(actualizar);
}

// ============================
// EVENTOS DEL TECLADO
// ============================
let teclas = {};
document.addEventListener('keydown', function(event) {
    teclas[event.key] = true;
});
document.addEventListener('keyup', function(event) {
    teclas[event.key] = false;
});

function manejarMovimiento() {
    if (teclas['ArrowLeft']) velocidadX = -5;
    else if (teclas['ArrowRight']) velocidadX = 5;
    if (teclas['ArrowUp'] && enSuelo) {
        velocidadY = -12;
        enSuelo = false;
        reproducirSonido();
    }
    requestAnimationFrame(manejarMovimiento);
}
manejarMovimiento();

// ============================
// MENÚ PRINCIPAL
// ============================
startButton.addEventListener('click', function() {
    menu.style.display = "none";
    canvas.style.display = "block";
    fondo.onload = () => {
        actualizar();
        dibujar();
    };
});
