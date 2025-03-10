// ============================
// VARIABLES Y ASSETS
// ============================
const texturatodo = "assets/imagenes/connor.webp";
const texturaenemigo = "assets/imagenes/enemigo.png";
const texturaprincesa = "assets/emanu.png";
const sonidotodo = "assets/sonidos/samuel.mp3";

// Cargar sonido
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

// ============================
// VARIABLES DEL JUEGO
// ============================
let nivelActual = 1;
let vidas = 3;
let x = 100, y = 100, velocidad = 5;
let saltando = false;
let llaveX = 0, llaveY = 0, princesaX = 0, princesaY = 0;
let enemigoX = 0, enemigoY = 0;
let plataformas = [], nubes = [], arbustos = [];

// ============================
// CARGA DE IMÁGENES
// ============================
const fondo = new Image();
fondo.src = texturatodo;

const principal = new Image();
principal.src = texturatodo;

const llave = new Image();
llave.src = texturatodo;

const princesa = new Image();
princesa.src = texturaprincesa;

const enemigo = new Image();
enemigo.src = texturaenemigo;

const plataforma = new Image();
plataforma.src = texturatodo;

const nube = new Image();
nube.src = texturatodo;

const arbusto = new Image();
arbusto.src = texturatodo;

// ============================
// FUNCIÓN PARA DIBUJAR EL JUEGO
// ============================
function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondo, 0, 0);
    ctx.drawImage(principal, x, y);
    ctx.drawImage(princesa, princesaX, princesaY);
    ctx.drawImage(llave, llaveX, llaveY);
    ctx.drawImage(enemigo, enemigoX, enemigoY);
    plataformas.forEach(p => ctx.drawImage(plataforma, p.x, p.y));
    nubes.forEach(n => ctx.drawImage(nube, n.x, n.y));
    arbustos.forEach(a => ctx.drawImage(arbusto, a.x, a.y));
    ctx.fillText(`Vidas: ${vidas}`, 10, 10);
    ctx.fillText(`Nivel: ${nivelActual}`, 10, 40);
    requestAnimationFrame(dibujar);
}

// ============================
// FUNCIÓN PARA ACTUALIZAR EL JUEGO
// ============================
function actualizar() {
    if (x + 50 > enemigoX && x - 50 < enemigoX && y + 50 > enemigoY && y - 50 < enemigoY) {
        vidas--;
        x = 100; y = 100;
        reproducirSonido();
    }
    if (x + 50 > llaveX && x - 50 < llaveX && y + 50 > llaveY && y - 50 < llaveY) {
        llaveX = 0; llaveY = 0;
        reproducirSonido();
    }
    if (x + 50 > princesaX && x - 50 < princesaX && y + 50 > princesaY && y - 50 < princesaY) {
        nivelActual++;
        x = 100; y = 100;
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
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') x -= velocidad;
    if (event.key === 'ArrowRight') x += velocidad;
    if (event.key === 'ArrowUp') {
        saltando = true;
        reproducirSonido();
    }
});

// ============================
// INICIALIZAR JUEGO
// ============================
fondo.onload = () => {
    actualizar();
    dibujar();
};
