const gridSize = 10;
const totalCells = gridSize * gridSize;
const game = document.getElementById('game');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let level = 1;
let playerPosition;
let trapPositions = [];
let enemyPositions = [];
let treasurePosition;
let gameActive = true;

function getRandomEmptyPositions(exclude = [], count = 1) {
  const positions = [];
  while (positions.length < count) {
    let pos = Math.floor(Math.random() * totalCells);
    if (!exclude.includes(pos) && !positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

function generateLevel() {
  gameActive = true;
  restartBtn.style.display = 'none';
  playerPosition = 0;
  const exclude = [playerPosition];
  trapPositions = getRandomEmptyPositions(exclude, 5 + level); // Más trampas cada nivel
  exclude.push(...trapPositions);
  enemyPositions = getRandomEmptyPositions(exclude, Math.min(1 + Math.floor(level / 2), 5));
  exclude.push(...enemyPositions);
  [treasurePosition] = getRandomEmptyPositions(exclude, 1);
  status.textContent = `Nivel ${level} - Usa WASD para moverte`;
  renderGrid();
}

function renderGrid() {
  game.innerHTML = '';
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (i === playerPosition) cell.classList.add('player');
    if (trapPositions.includes(i)) cell.classList.add('trap');
    if (i === treasurePosition) cell.classList.add('treasure');
    if (enemyPositions.includes(i)) cell.classList.add('enemy');
    game.appendChild(cell);
  }
}

function movePlayer(direction) {
  if (!gameActive) return;

  let row = Math.floor(playerPosition / gridSize);
  let col = playerPosition % gridSize;

  switch (direction) {
    case 'w': if (row > 0) playerPosition -= gridSize; break;
    case 's': if (row < gridSize - 1) playerPosition += gridSize; break;
    case 'a': if (col > 0) playerPosition -= 1; break;
    case 'd': if (col < gridSize - 1) playerPosition += 1; break;
  }

  checkState();
  moveEnemies();
  checkState();
  renderGrid();
}

function moveEnemies() {
  enemyPositions = enemyPositions.map(enemyPos => {
    let enemyRow = Math.floor(enemyPos / gridSize);
    let enemyCol = enemyPos % gridSize;
    let playerRow = Math.floor(playerPosition / gridSize);
    let playerCol = playerPosition % gridSize;

    let newRow = enemyRow;
    let newCol = enemyCol;

    if (enemyRow < playerRow) newRow++;
    else if (enemyRow > playerRow) newRow--;

    if (enemyCol < playerCol) newCol++;
    else if (enemyCol > playerCol) newCol--;

    let newPos = newRow * gridSize + newCol;
    if (
      newPos !== playerPosition &&
      !trapPositions.includes(newPos) &&
      !enemyPositions.includes(newPos)
    ) {
      return newPos;
    } else {
      return enemyPos; // No se mueve
    }
  });
}

function checkState() {
  if (trapPositions.includes(playerPosition)) {
    endGame("💀 ¡Has caído en una trampa!");
  } else if (enemyPositions.includes(playerPosition)) {
    endGame("👾 ¡Un enemigo te atrapó!");
  } else if (playerPosition === treasurePosition) {
    level++;
    status.textContent = "🎉 ¡Nivel completado! Cargando siguiente nivel...";
    setTimeout(generateLevel, 1000);
  }
}

function endGame(message) {
  gameActive = false;
  status.textContent = message;
  restartBtn.style.display = 'inline-block';
}

function keyHandler(e) {
  const key = e.key.toLowerCase();
  if (['w', 'a', 's', 'd'].includes(key)) {
    movePlayer(key);
  }
}

restartBtn.addEventListener('click', () => {
  level = 1;
  generateLevel();
});

document.addEventListener('keydown', keyHandler);
generateLevel();
