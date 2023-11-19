// Dobivanje referenci na canvas i 2D kontekst
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player;
let asteroids = [];
let startTime;

// Dodavanje event listenera za tipkovnicu
window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
    // Kretanje igrača (gore, dolje, lijevo, desno)
    if (e.key === "ArrowUp") {
        player.y -= 5;
    } else if (e.key === "ArrowDown") {
        player.y += 5;
    } else if (e.key === "ArrowLeft") {
        player.x -= 5;
    } else if (e.key === "ArrowRight") {
        player.x += 5;
    }
}

// Glavna petlja animacije
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Crtanje igrača
    ctx.shadowBlur = 10;
    ctx.shadowColor = "black";
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 5;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Crtanje asteroida
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        ctx.shadowBlur = 10;
        ctx.shadowColor = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
        ctx.fillStyle = asteroid.color;
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);

        // Detekcija kolizije
        if (checkCollision(player, asteroid)) {
            handleCollision();
        }

        // Ažuriranje položaja asteroida
        asteroid.x += asteroid.speedX;
        asteroid.y += asteroid.speedY;

        // Provjera je li asteroid daleko izvan ekrana, resetiraj ga
        if (asteroid.x + asteroid.width < -90 || asteroid.x > canvas.width + 90 ||
            asteroid.y + asteroid.height < 0 || asteroid.y > canvas.height) {
            resetAsteroid(asteroid);
        }
    }

    // Ažuriranje vremena
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime);
    const formattedTime = formatTime(elapsedTime);
    let bestTime = localStorage.getItem("bestTime") || 0 ;
    const formattedBestTime = formatTime(bestTime);

    // Ispis vremena
    ctx.fillStyle = "black";
    ctx.font = "32px Arial";
    ctx.fillText(`Current Time: ${formattedTime}`, canvas.width - 500, 40);
    ctx.fillText(`Best Time: ${formattedBestTime}`, canvas.width - 500, 80);

    // Ažuriranje najboljeg vremena
    if (elapsedTime > bestTime) {
        bestTime = elapsedTime;
        localStorage.setItem("bestTime", bestTime);
    }

    // Poziv funkcije ponovno za sljedeći korak animacije
    requestAnimationFrame(gameLoop);
}

// Funkcija za resetiranje položaja asteroida
function resetAsteroid(asteroid) {
    asteroid.x = Math.random() < 0.5 ? -80 : canvas.width + 80,
    asteroid.y = Math.random() * canvas.height;
    asteroid.speedX = (Math.random() - 0.5) * 2;
    asteroid.speedY = (Math.random() - 0.5) * 2;
}

// Funkcija za detekciju kolizije između dva objekta
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Funkcija koja se poziva prilikom detekcije kolizije
function handleCollision() {
    alert("Game Over!");
    // Resetiraj igru
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        asteroid.x = Math.random() < 0.5 ? -80 : canvas.width + 80;
        asteroid.y = Math.random() * canvas.height;
    }
    startTime = new Date().getTime();
}
// Funkcija za formatiranje vremena
function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    const millisecondsPart = milliseconds % 1000;

    return `${pad(minutes)}:${pad(seconds)}.${pad(millisecondsPart, 3)}`;
}
// Pomocna funkcija za formatiranje vremena, dodavanje nule ispred brojeva manjih od 10
function pad(number, length = 2) {
    return (new Array(length).fill('0').join('') + number).slice(-length);
}

// Inicijalizacija igre nakon što se stranica učita
window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Inicijalizacija igraca
    const playa = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 75,
        height: 75,
        color: "red"
    };
    player = playa;

    // Generiranje 15 asteroida na početku igre
    for (let i = 0; i < 15; i++) {
        const boja = Math.floor(Math.random() * 255);
        const asteroid = {
            x: Math.random() < 0.5 ? -80 : canvas.width + 80,
            y: Math.random() * canvas.height,
            width: 50 + Math.random() * 30,
            height: 50 + Math.random() * 30,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: `rgb(${boja}, ${boja}, ${boja})`
        };
        asteroids.push(asteroid);
    }

    // Gumb za resetiranje najboljeg vremena
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetBestTime);

    startTime = new Date().getTime();

    // Pokreni glavnu petlju animacije
    gameLoop();
};

// Funckija za resetiranje najboljeg vremena
function resetBestTime() {
    localStorage.removeItem("bestTime");
}
