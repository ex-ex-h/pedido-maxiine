// ============================
// VARIABLES Y ASSETS
// ============================
const texturafondo = "assets/imagenes/connor.webp";
const texturapersonaje = "assets/imagenes/connor.webp";
const texturaenemigo = "assets/imagenes/enemigo.png";
const texturaprincesa = "assets/emanu.png";
const texturaplataforma = "assets/imagenes/connor.webp";
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

// ============================
// VARIABLES DEL JUEGO
// ============================
let nivelActual = 1;
let vidas = 3;
let x = 100, y = 450, velocidad = 5;
let saltando = false, saltandoAltura = 0, saltandoVelocidad = 0;
let llaveX = 400, llaveY = 300, princesaX = 700, princesaY = 450;
let enemigoX = 600, enemigoY = 450;
let plataformas = [{ x: 200, y: 500 }, { x: 400, y: 400 }, { x: 600, y: 300 }];

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
    plataformas.forEach(p => ctx.drawImage(plataforma, p.x, p.y, 100, 20));
    ctx.drawImage(personaje, x, y, 50, 50);
    ctx.drawImage(princesa, princesaX, princesaY, 50, 50);
    ctx.drawImage(llave, llaveX, llaveY, 30, 30);
    ctx.drawImage(enemigo, enemigoX, enemigoY, 50, 50);
    ctx.fillText(`Vidas: ${vidas}`, 10, 20);
    ctx.fillText(`Nivel: ${nivelActual}`, 10, 40);
    requestAnimationFrame(dibujar);
}

// ============================
// FUNCIÓN PARA ACTUALIZAR EL JUEGO
// ============================
function actualizar() {
    if (x + 50 > enemigoX && x - 50 < enemigoX && y + 50 > enemigoY && y - 50 < enemigoY) {
        vidas--;
        x = 100; y = 450;
        reproducirSonido();
    }
    if (x + 50 > llaveX && x - 50 < llaveX && y + 50 > llaveY && y - 50 < llaveY) {
        llaveX = -100; llaveY = -100;
        reproducirSonido();
    }
    if (x + 50 > princesaX && x - 50 < princesaX && y + 50 > princesaY && y - 50 < princesaY) {
        nivelActual++;
        x = 100; y = 450;
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
    if (event.key === 'ArrowUp' && !saltando) {
        saltando = true;
        let intervaloSalto = setInterval(() => {
            if (saltandoAltura < 100) {
                y -= 5;
                saltandoAltura += 5;
            } else {
                clearInterval(intervaloSalto);
                let intervaloBajada = setInterval(() => {
                    if (saltandoAltura > 0) {
                        y += 5;
                        saltandoAltura -= 5;
                    } else {
                        clearInterval(intervaloBajada);
                        saltando = false;
                    }
                }, 20);
            }
        }, 20);
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

