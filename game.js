// Game Variables
let gridSize = 4; // Default 4x4 Grid
let emptyPos = gridSize * gridSize - 1;
let moveCount = 0;
let timer;
let timeElapsed = 0;
let grid = [];

// DOM Elements
const gameGrid = document.getElementById('game-grid');
const moveCounter = document.getElementById('move-counter');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const gridSizeInput = document.getElementById('grid-size');

// Timer Setup
function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
        const seconds = String(timeElapsed % 60).padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Create Grid
function createGrid() {
    const grid = [];
    for (let i = 1; i < gridSize * gridSize; i++) {
        grid.push(i);
    }
    grid.push(null); // Empty space
    return grid;
}

// Shuffle Grid
function shuffleGrid(grid) {
    for (let i = grid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [grid[i], grid[j]] = [grid[j], grid[i]]; // Swap elements
    }
    return grid;
}

// Render Grid
function renderGrid(grid) {
    document.getElementById('win-message').textContent="";
    gameGrid.innerHTML = ''; // Clear existing grid
    gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;  // Adjust columns based on grid size
    
    grid.forEach((cell, index) => {
        const div = document.createElement('div');
        div.classList.add('game-cell');
        if (cell !== null) {
            div.textContent = cell;
        } else {
            div.classList.add('empty');
        }
        div.addEventListener('click', () => handleCellClick(index, grid));
        gameGrid.appendChild(div);
    });
}

// Swap Cells
function swapCells(index1, index2, grid) {
    [grid[index1], grid[index2]] = [grid[index2], grid[index1]];
}

// Handle Cell Click
function handleCellClick(index, grid) {
    const emptyIndex = grid.indexOf(null);
    const isAdjacent = [
        index - 1, index + 1, index - gridSize, index + gridSize
    ].includes(emptyIndex);

    if (isAdjacent) {
        swapCells(index, emptyIndex, grid);
        moveCount++;
        moveCounter.textContent = moveCount;
        renderGrid(grid);
        checkWin(grid);
    }
}

// Check if Puzzle is Solved
function checkWin(grid) {
    const target = [...Array(gridSize * gridSize).keys()].slice(1);
    target.push(null);
    
    if (grid.join('') === target.join('')) {
        clearInterval(timer);

        // Show win message
        const winMessage = document.getElementById('win-message');
        winMessage.textContent = `You solved the puzzle in ${moveCount} moves! Time: ${timerDisplay.textContent}`;
        winMessage.classList.remove('hidden');
        winMessage.classList.add('visible');
    }
}


// Reset Game

function resetGame() {
    // Clear any existing timer to avoid multiple intervals running
    clearInterval(timer);

    timeElapsed = 0;
    moveCount = 0;
    moveCounter.textContent = moveCount;
    timerDisplay.textContent = '00:00';
    grid = shuffleGrid(createGrid()); // Recreate grid and shuffle it
    renderGrid(grid);
    startTimer(); // Start the new timer
}


// Change Grid Size
gridSizeInput.addEventListener('input', () => {
    gridSize = parseInt(gridSizeInput.value);
    resetGame(); // Reset game with new grid size
});


const slider = document.getElementById("grid-size");
const gridSizeValue = document.getElementById("grid-size-value");

slider.addEventListener("input", function() {
    gridSizeValue.textContent = slider.value;
});


// Initialize Game
resetBtn.addEventListener('click', resetGame);
resetGame(); // Start the game on page load

