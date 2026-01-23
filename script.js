const words = ['пилот', 'лыжник', 'учитель', 'повар', 'полицейский', 'психолог'];
let secretWord = 'полицейский';
let guessedLetters = [];
let remainingAttempts = 6;
const maxAttempts = 6;
const bodyParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

const wordDisplayEl = document.getElementById('word-display');
const attemptsLeftEl = document.getElementById('attempts-left');
const keyboardEl = document.getElementById('keyboard');
const messageEl = document.getElementById('message');
const playAgainBtn = document.getElementById('play-again');

function renderGame() {
    const display = secretWord.split('').map(letter => {return guessedLetters.includes(letter) ? letter : '_'; }).join(' ');
    wordDisplayEl.textContent = display;
    attemptsLeftEl.textContent = remainingAttempts;

}

function createKeyboard() {
    keyboardEl.innerHTML = '';
    const russianAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    for (const letter of russianAlphabet) {
        const button = document.createElement('button');
        button.textContent = letter;
        button.onclick = () => handleGuess(letter);
        if (guessedLetters.includes(letter)) {
            button.disabled = true;
        }
        keyboardEl.appendChild(button);
    }
}

function startGame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    remainingAttempts = maxAttempts;
    messageEl.textContent = '';
    playAgainBtn.style.display = 'none';
    bodyParts.forEach(partId => {document.getElementById(partId).style.display = 'none';});

    renderGame();
    createKeyboard();
}


function handleGuess(letter) {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    const buttons = keyboardEl.querySelectorAll('button');
    buttons.forEach(button => {if (button.textContent === letter) {button.disabled = true;} });

    if (secretWord.includes(letter)) {}
    else {remainingAttempts--; drawHangman();}
    renderGame();
    checkGameStatus(); 
}

function drawHangman() {
    const partsToShow = maxAttempts - remainingAttempts;
    if (partsToShow > 0 && partsToShow <= bodyParts.length) {
        const partId = bodyParts[partsToShow - 1];
        document.getElementById(partId).style.display = 'block';
    }
}

function checkGameStatus() {
    const allGuessed = secretWord.split('').every(letter => guessedLetters.includes(letter));
    if (allGuessed) {
        messageEl.textContent = 'Поздравляю! Ты выиграл/а!!!';
        messageEl.style.color = 'green';
        endGame(); }
    else if (remainingAttempts <= 0) {
        messageEl.textContent = `Игра окончена. Правильное слово: "${secretWord}"`;
        messageEl.style.color = 'red';
        endGame();
    }
}

function endGame() {
    const buttons = keyboardEl.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    playAgainBtn.style.display = 'inline-block';
}

startGame();