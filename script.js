const borad = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startbutton = document.querySelector(".start-btn");
const startModal = document.querySelector(".start-game");
const GameOver = document.querySelector(".Game-over");
const restartButton = document.querySelector(".restart-btn");
const writeyourscore = document.querySelector(".writeyourscore");
const Highscore = document.querySelector(".Highscore");

const highscoreElement = document.querySelector("#highscore");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#Time");

const blockheight = 50;
const blockwidth = 50;


let highscore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00-00`;

highscoreElement.textContent = "Highscore: " + highscore;




const cols = Math.floor(borad.clientWidth / blockwidth);
const rows = Math.floor(borad.clientHeight / blockheight);

let intervalId = null;
let timeIntervalId = null;
const blocks = [];

// ✅ IMPORTANT FIX: correct starting direction
let direction = "down";

let snake = [
    { x: 1, y: 5 },
    { x: 1, y: 4 },
    { x: 1, y: 3 },
];

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};

// ✅ Create board
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        borad.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    let head = null;

    // 🎯 Create new head
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    // ❌ Wall collision
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startModal.style.display = "none";
        GameOver.style.display = "flex";
        writeyourscore.textContent = "Your Score: " + score;
        Highscore.textContent = "High Score: " + highscore;
        console.log("game over");
        return;
    }

    // // ❌ Self collision (FIXED)
    for (let i = 2; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            clearInterval(intervalId);
            modal.style.display = "flex";
        startModal.style.display = "none";
        GameOver.style.display = "flex";
            console.log("self collision");
            return;
        }
    }

    // ✅ Move snake
    snake.unshift(head);

    // 🍎 Food logic
    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

        score += 10;
        scoreElement.textContent = "Score : " + score; 
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore.toString());
            highscoreElement.textContent = "Highscore : " + highscore;
        }
            
    } 
   
    else {
        snake.pop();
    }

    // 🧹 Clear board
    Object.values(blocks).forEach(block => {
        block.classList.remove("fill", "food");
    });

    // 🎨 Draw snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });

    // 🍎 Draw food
    blocks[`${food.x}-${food.y}`].classList.add("food");
}

// ✅ Show initial state
render();

// 🎮 Controls
addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (e.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (e.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    } else if (e.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }
});

// ▶️ Start Game
startbutton.addEventListener("click", () => {
    modal.style.display = "none";

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(render, 200); // ✅ FIXED

    timeIntervalId = setInterval(() => {
        let [minutes, seconds] = time.split("-").map(Number);
        
        if (seconds === 59) {
            minutes++;
            seconds = 0;
        }
        else {
            seconds++;
        }
        time = `${minutes}-${seconds}`;
        timeElement.textContent = "Time: " + time;
    }, 1000);
});

// 🔁 Restart Game
restartButton.addEventListener("click", restartgame);
function restartgame() {
    clearInterval(intervalId);

    snake = [
        { x: 1, y: 3 },
        { x: 1, y: 5 },
        { x: 1, y: 4 },
    
    ];

    direction = "down";

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    modal.style.display = "none";
    score = 0;
    let time = `00-00`;
    scoreElement.textContent = "Score:" + score;
    let highscore =  localStorage.getItem("highscore") || 0;
    intervalId = setInterval(render, 200);
}

