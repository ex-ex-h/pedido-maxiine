// ============================
// VARIABLES Y ASSETS
// ============================
const texturafondo = "assets/imagenes/azul.jpg"; // Fondo azul corregido
const texturapersonaje = "assets/imagenes/connor.webp";
const texturaenemigo = "assets/imagenes/enemigo.png";
const texturaprincesa = "assets/emanu.png";
const texturaplataforma = "assets/imagenes/velde.jpg";
const texturajaula = "assets/imagenes/nig.jpg";
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

const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

// ============================
// VARIABLES DEL JUEGO
// ============================
let nivelActual, vidas, x, y, velocidadX, velocidadY, enSuelo, llaveX, llaveY, princesaX, princesaY, enemigoX, enemigoY, enemigoVelocidadX, enemigoDireccion;
let plataformas, jaula;
let juegoEnMarcha = false;
let teclas = {};

function reiniciarJuego() {
    nivelActual = 1;
    vidas = 3;
    x = 100; y = 500; velocidadX = 0; velocidadY = 0;
    enSuelo = false;
    llaveX = 400; llaveY = 300;
    princesaX = 650; princesaY = 500;
    enemigoX = 500; enemigoY = 500;
    enemigoVelocidadX = 2;
    enemigoDireccion = 1;
    
    plataformas = [
        { x: 0, y: 580, width: 800 }, // Suelo principal
        { x: 50, y: 550, width: 200 },
        { x: 300, y: 450, width: 150 },
        { x: 500, y: 350, width: 150 },
        { x: 650, y: 500, width: 100 }
    ];
    
    jaula = [
        { x: princesaX - 10, y: princesaY - 10, width: 70, height: 10 },
        { x: princesaX - 10, y: princesaY - 10, width: 10, height: 60 },
        { x: princesaX + 50, y: princesaY - 10, width: 10, height: 60 },
        { x: princesaX - 10, y: princesaY + 50, width: 70, height: 10 }
    ];
}

reiniciarJuego();

// ============================
// CARGA DE IMÁGENES
// ============================
const fondo = new Image();
fondo.src = texturafondo;

const personaje = new Image();
personaje.src = texturapersonaje;

const llave = new Image();
llave.src = texturallave;

const princesa = new Image();
princesa.src = texturaprincesa;

const enemigo = new Image();
enemigo.src = texturaenemigo;

const plataforma = new Image();
plataforma.src = texturaplataforma;

const jaulaImg = new Image();
jaulaImg.src = texturajaula;

// ============================
// MOVIMIENTO DEL PERSONAJE
// ============================
document.addEventListener('keydown', (event) => {
    teclas[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    teclas[event.key] = false;
});

function moverPersonaje() {
    if (teclas['a']) velocidadX = -5;
    if (teclas['d']) velocidadX = 5;
    if (teclas['w'] && enSuelo) velocidadY = -10;
}

// ============================
// FUNCIÓN PARA DIBUJAR EL JUEGO
// ============================
function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (fondo.complete) {
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    plataformas.forEach(p => ctx.drawImage(plataforma, p.x, p.y, p.width, 20));
    ctx.drawImage(personaje, x, y, 50, 50);
    ctx.drawImage(princesa, princesaX, princesaY, 50, 50);
    ctx.drawImage(llave, llaveX, llaveY, 30, 30);
    ctx.drawImage(enemigo, enemigoX, enemigoY, 50, 50);
    
    // Dibujar jaula
    jaula.forEach(j => ctx.drawImage(jaulaImg, j.x, j.y, j.width, j.height));
    
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
    moverPersonaje();
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

    // Movimiento del enemigo en zigzag
    enemigoX += enemigoVelocidadX * enemigoDireccion;
    if (enemigoX <= 300 || enemigoX >= 700) {
        enemigoDireccion *= -1;
    }

    // Detección de colisión con el enemigo
    if (x + 50 > enemigoX && x < enemigoX + 50 && y + 50 > enemigoY && y < enemigoY + 50) {
        reproducirSonido();
        vidas--;
    }

    if (vidas === 0) {
        alert('Game Over!');
        juegoEnMarcha = false;
        menu.style.display = "block";
        canvas.style.display = "none";
        return;
    }
    requestAnimationFrame(actualizar);
}

// ============================
// MENÚ PRINCIPAL
// ============================
startButton.addEventListener('click', function() {
    if (!juegoEnMarcha) {
        menu.style.display = "none";
        canvas.style.display = "block";
        reiniciarJuego();
        juegoEnMarcha = true;
        actualizar();
        dibujar();
    }
});
