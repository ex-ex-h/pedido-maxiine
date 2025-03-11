// ============================
// VARIABLES Y ASSETS
// ============================
const texturafondo = "assets/imagenes/azul.jpg";
const texturapersonaje = "assets/imagenes/connor.webp";
const texturaenemigo = "assets/imagenes/enemigo.png";
const texturaprincesa = "assets/emanu.png";
const texturaplataforma = "assets/imagenes/velde.jpg";
const texturajaula = "assets/imagenes/nig.jpg";
const texturallave = "assets/imagenes/dorao.jpg";
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
    princesaX = 650; princesaY = 450;
    enemigoX = 400; enemigoY = 500;
    enemigoVelocidadX = 2;
    enemigoDireccion = 1;
    
    plataformas = [
        { x: 0, y: 570, width: 800 },
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
    teclas[event.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (event) => {
    teclas[event.key.toLowerCase()] = false;
});


function moverPersonaje() {
    velocidadX = 0;
    if (teclas['a'] || teclas['arrowleft']) velocidadX = -5;
    if (teclas['d'] || teclas['arrowright']) velocidadX = 5;
    if ((teclas['w'] || teclas['arrowup']) && enSuelo) {
        velocidadY = -10;
        reproducirSonido(); // SONIDO AL SALTAR
    }
}

}

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
function verificarColisiones() {
    // Colisión con la llave
    if (x < llaveX + 30 && x + 50 > llaveX && y < llaveY + 30 && y + 50 > llaveY) {
        jaula = []; // Elimina la jaula
        llaveX = -100; // Mueve la llave fuera de la pantalla
        llaveY = -100;
        reproducirSonido();
    }

    // Colisión con el enemigo
    if (x < enemigoX + 50 && x + 50 > enemigoX && y < enemigoY + 50 && y + 50 > enemigoY) {
        vidas -= 1;
        reproducirSonido();
        if (vidas <= 0) {
            alert("Perdiste. Reiniciando...");
            reiniciarJuego();
        } else {
            x = 100; // Reinicia la posición del personaje
            y = 500;
        }
    }

    // Colisión con la princesa (cuando la jaula ha desaparecido)
    if (jaula.length === 0 && x < princesaX + 50 && x + 50 > princesaX && y < princesaY + 50 && y + 50 > princesaY) {
        reproducirSonido();
        alert("¡Has ganado!");
        juegoEnMarcha = false;
        menu.style.display = "block";
        canvas.style.display = "none";
    }
}


verificarColisiones();

    requestAnimationFrame(actualizar);
}
function actualizar() {
    moverPersonaje();
    velocidadY += 0.5;
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

    enemigoX += enemigoVelocidadX * enemigoDireccion;
    if (enemigoX <= 250 || enemigoX >= 550) enemigoDireccion *= -1;

    verificarColisiones(); // Llamada a la nueva función

    requestAnimationFrame(actualizar);
}

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
