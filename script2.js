const wordsDB = [
    { word: "ПРОГРАММИРОВАНИЕ", hint: "Язык, на котором пишут код" },
    { word: "ВИСЕЛИЦА", hint: "Название этой игры" },
    { word: "РАЗРАБОТЧИК", hint: "Тот, кто создаёт игры и приложения" },
    { word: "КОМПЬЮТЕР", hint: "Устройство для игр и работы" },
    { word: "АЛГОРИТМ", hint: "Последовательность действий для решения задачи" },
    { word: "ДИЗАЙН", hint: "Внешний вид и стиль интерфейса" },
    { word: "КЛАВИАТУРА", hint: "На ней печатают буквы" },
    { word: "МОНИТОР", hint: "Экран, на который смотрят" },
    { word: "ИНТЕРНЕТ", hint: "Глобальная сеть" },
    { word: "САЙТ", hint: "Страница в интернете" }
];

let currentWordObj = null;
let currentWord = "";
let guessedLetters = new Set();
let wrongLetters = new Set();
let maxMistakes = 6;
let gameActive = true;
let currentMistakes = 0;

const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");
const wordDisplayDiv = document.getElementById("wordDisplay");
const hintTextDiv = document.getElementById("hintText");
const mistakesSpan = document.getElementById("mistakesCount");
const messageBox = document.getElementById("messageBox");
const keyboardContainer = document.getElementById("keyboardContainer");


function drawHangman(steps) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#b036d4";
    ctx.fillStyle = "#2e241a";
    

    ctx.beginPath();
    ctx.moveTo(20, 250);
    ctx.lineTo(200, 250);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(60, 250);
    ctx.lineTo(60, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(60, 40);
    ctx.lineTo(150, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(150, 40);
    ctx.lineTo(150, 65);
    ctx.stroke();
    
    if (steps >= 1) {
        ctx.beginPath();
        ctx.arc(150, 80, 15, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (steps >= 2) {
        ctx.beginPath();
        ctx.moveTo(150, 95);
        ctx.lineTo(150, 155);
        ctx.stroke();
    }
    if (steps >= 3) {
        ctx.beginPath();
        ctx.moveTo(150, 110);
        ctx.lineTo(120, 135);
        ctx.stroke();
    }
    if (steps >= 4) {
        ctx.beginPath();
        ctx.moveTo(150, 110);
        ctx.lineTo(180, 135);
        ctx.stroke();
    }
    if (steps >= 5) {
        ctx.beginPath();
        ctx.moveTo(150, 155);
        ctx.lineTo(120, 190);
        ctx.stroke();
    }
    if (steps >= 6) {
        ctx.beginPath();
        ctx.moveTo(150, 155);
        ctx.lineTo(180, 190);
        ctx.stroke();
    }
}

function updateWordDisplay() {
    let display = "";
    for (let ch of currentWord) {
        if (guessedLetters.has(ch.toLowerCase())) {
            display += ch + " ";
        } else {
            display += "_ ";
        }
    }
    wordDisplayDiv.innerText = display.trim() === "" ? "ПОБЕДА!" : display;
}

function checkWin() {
    let allGuessed = true;
    for (let ch of currentWord) {
        if (!guessedLetters.has(ch.toLowerCase())) {
            allGuessed = false;
            break;
        }
    }
    if (allGuessed && gameActive && currentWord !== "") {
        gameActive = false;
        messageBox.innerHTML = "ПОБЕДА! Ты спас человечка!";
        messageBox.style.color = "#b9f6ca";
        drawHangman(currentMistakes);
        disableKeyboard(true);
        return true;
    }
    return false;
}

function checkLoss() {
    if (currentMistakes >= maxMistakes && gameActive) {
        gameActive = false;
        messageBox.innerHTML = `ВЫ ПРОИГРАЛИ! Загадано слово: ${currentWord}`;
        messageBox.style.color = "#ffaa88";
        disableKeyboard(true);
        drawHangman(maxMistakes);
        return true;
    }
    return false;
}

function guessLetter(letter) {
    if (!gameActive) return false;
    const lowerLetter = letter.toLowerCase();
    if (guessedLetters.has(lowerLetter) || wrongLetters.has(lowerLetter)) return false;
    
    const isCorrect = currentWord.toLowerCase().includes(lowerLetter);
    
    if (isCorrect) {
        guessedLetters.add(lowerLetter);
        updateWordDisplay();
        updateKeyStyle(letter, "correct");
        if (checkWin()) return true;
    } else {
        wrongLetters.add(lowerLetter);
        currentMistakes++;
        updateMistakesUI();
        drawHangman(currentMistakes);
        updateKeyStyle(letter, "wrong");
        if (checkLoss()) return true;
    }
    return true;
}

function updateMistakesUI() {
    mistakesSpan.innerText = `Ошибки: ${currentMistakes} / ${maxMistakes}`;
}

function updateKeyStyle(letter, status) {
    const keyDiv = document.getElementById(`key_${letter}`);
    if (keyDiv) {
        if (status === "correct") {
            keyDiv.classList.add("correct");
            keyDiv.classList.remove("wrong");
        } else if (status === "wrong") {
            keyDiv.classList.add("wrong");
        }
        keyDiv.classList.add("disabled");
    }
}

function disableKeyboard(disabled) {
    const allKeys = document.querySelectorAll(".key");
    allKeys.forEach(key => {
        if (disabled) {
            key.style.pointerEvents = "none";
        } else {
            key.style.pointerEvents = "auto";
        }
    });
}


function generateKeyboard() {
    const russianAlphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
    keyboardContainer.innerHTML = "";
    russianAlphabet.forEach(letter => {
        const keyDiv = document.createElement("div");
        keyDiv.className = "key";
        keyDiv.id = `key_${letter}`;
        keyDiv.innerText = letter;
        keyDiv.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!gameActive) return;
            if (guessedLetters.has(letter.toLowerCase()) || wrongLetters.has(letter.toLowerCase())) return;
            guessLetter(letter);
        });
        keyboardContainer.appendChild(keyDiv);
    });
}

function resetGameState() {
    gameActive = true;
    guessedLetters.clear();
    wrongLetters.clear();
    currentMistakes = 0;
    updateMistakesUI();
    drawHangman(0);
    updateWordDisplay();
    messageBox.innerHTML = "Игра продолжается! Выбери букву";
    messageBox.style.color = "#cbd5e6";
    
    document.querySelectorAll(".key").forEach(key => {
        key.classList.remove("correct", "wrong", "disabled");
        key.style.pointerEvents = "auto";
    });
    disableKeyboard(false);
    if (currentWordObj) {
        hintTextDiv.innerHTML = `Подсказка: ${currentWordObj.hint}`;
    }
}

function loadNewWord() {
    const randomIndex = Math.floor(Math.random() * wordsDB.length);
    currentWordObj = { ...wordsDB[randomIndex] };
    currentWord = currentWordObj.word.toUpperCase();
    hintTextDiv.innerHTML = `Подсказка: ${currentWordObj.hint}`;
    resetGameState();
}


function fullReset() {
    resetGameState();
}

function initGame() {
    generateKeyboard();
    const randomIndex = Math.floor(Math.random() * wordsDB.length);
    currentWordObj = { ...wordsDB[randomIndex] };
    currentWord = currentWordObj.word.toUpperCase();
    hintTextDiv.innerHTML = `Подсказка: ${currentWordObj.hint}`;
    gameActive = true;
    guessedLetters.clear();
    wrongLetters.clear();
    currentMistakes = 0;
    updateMistakesUI();
    drawHangman(0);
    updateWordDisplay();
    messageBox.innerHTML = "Угадывай буквы!";
    disableKeyboard(false);
    
    document.querySelectorAll(".key").forEach(key => {
        key.classList.remove("correct", "wrong", "disabled");
        key.style.pointerEvents = "auto";
    });
}

document.getElementById("newGameBtn").addEventListener("click", () => {
    loadNewWord();
});
document.getElementById("resetGameBtn").addEventListener("click", () => {
    fullReset();
});
initGame();