const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('button-restart');
let circleTurn
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

restartButton.addEventListener("click", startGame);

function handleCLick(e) {
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    // place the mark
    placeMark(cell, currentClass);
    // check for win
    if(checkWin(currentClass)) {
        //console.log("winn")
        endGame(false);
    }
    // check for draw
    else if(isDraw()) {
        endGame(true);
    }
    else {
        // switch turn
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = `It's a Draw!`;
    }
    else {
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Won!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    //console.log("draw called")
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleCLick)
        cell.addEventListener('click', handleCLick, {once: true});
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');

}

function swapTurns() {
    circleTurn = !circleTurn;
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if(circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    }
    else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    //console.log("check win is callled")
    return WINNING_COMBINATIONS.some(combinations => {
        return combinations.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}