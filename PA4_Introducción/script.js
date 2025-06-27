const game = document.getElementById('game');
const status = document.getElementById('status');
const restart = document.getElementById('restart');

let player, traps, enemies, treasure;
let level = 1;
let gameOver = false;
const gridSize = 10;
const totalCells = gridSize * gridSize;

// Función para obtener posición aleatoria no repetida
const randomPositions = (cantidad, excluir) => {
  let posiciones = [];
  while (posiciones.length < cantidad) {
    let pos = Math.floor(Math.random() * totalCells);
    if (excluir.indexOf(pos) === -1 && posiciones.indexOf(pos) === -1) {
      posiciones.push(pos);
    }
  }
  return posiciones;
};

// Crear el mapa
const renderizar = () => {
  game.innerHTML = '';
  for (let i = 0; i < totalCells; i++) {
    let celda = document.createElement('div');
    celda.classList.add('cell');
    if (i === player) celda.classList.add('player');
    else if (traps.indexOf(i) !== -1) celda.classList.add('trap');
    else if (enemies.indexOf(i) !== -1) celda.classList.add('enemy');
    else if (i === treasure) celda.classList.add('treasure');
    game.appendChild(celda);
  }
};

// Generar nuevo nivel
const iniciarNivel = () => {
  gameOver = false;
  player = 0;
  let ocupadas = [player];
  traps = randomPositions(4 + level, ocupadas);
  ocupadas = ocupadas.concat(traps);
  enemies = randomPositions(level, ocupadas);
  ocupadas = ocupadas.concat(enemies);
  treasure = randomPositions(1, ocupadas)[0];
  status.textContent = `Nivel ${level} - Evita trampas y enemigos`;
  restart.style.display = 'none';
  renderizar();
};

// Movimiento del jugador
const moverJugador = (direccion) => {
  if (gameOver) return;

  let fila = Math.floor(player / gridSize);
  let col = player % gridSize;
  let nuevaPos = player;

  if (direccion === 'w' && fila > 0) nuevaPos -= gridSize;
  else if (direccion === 's' && fila < gridSize - 1) nuevaPos += gridSize;
  else if (direccion === 'a' && col > 0) nuevaPos -= 1;
  else if (direccion === 'd' && col < gridSize - 1) nuevaPos += 1;

  player = nuevaPos;
  verificarEstado();
  moverEnemigos();
  verificarEstado();
  renderizar();
};

// Movimiento básico enemigo (se acerca al jugador)
const moverEnemigos = () => {
  let nuevosEnemigos = [];

  for (let i = 0; i < enemies.length; i++) {
    let enemigo = enemies[i];
    let filaE = Math.floor(enemigo / gridSize);
    let colE = enemigo % gridSize;
    let filaP = Math.floor(player / gridSize);
    let colP = player % gridSize;

    let nuevaFila = filaE;
    let nuevaCol = colE;

    if (filaP < filaE) nuevaFila--;
    else if (filaP > filaE) nuevaFila++;

    if (colP < colE) nuevaCol--;
    else if (colP > colE) nuevaCol++;

    let nuevaPos = nuevaFila * gridSize + nuevaCol;

    // Verificar que no se mueva a trampa, jugador ni otro enemigo
    if (
      nuevaPos !== player &&
      traps.indexOf(nuevaPos) === -1 &&
      nuevosEnemigos.indexOf(nuevaPos) === -1
    ) {
      nuevosEnemigos.push(nuevaPos);
    } else {
      nuevosEnemigos.push(enemigo); // No se mueve si hay conflicto
    }
  }

  enemies = nuevosEnemigos;
};


// Verificar colisiones
const verificarEstado = () => {
  if (traps.indexOf(player) !== -1) {
    status.textContent = '💀 ¡Caíste en una trampa!';
    finalizar();
  } else if (enemies.indexOf(player) !== -1) {
    status.textContent = '👾 ¡Un enemigo te atrapó!';
    finalizar();
  } else if (player === treasure) {
    level++;
    status.textContent = '🎉 ¡Tesoro encontrado! Nivel siguiente...';
    setTimeout(iniciarNivel, 1000);
  }
};

// Finaliza el juego
const finalizar = () => {
  gameOver = true;
  restart.style.display = 'inline-block';
};

// Teclado
document.addEventListener('keydown', (e) => {
  const tecla = e.key.toLowerCase();
  if (['w', 'a', 's', 'd'].indexOf(tecla) !== -1) {
    moverJugador(tecla);
  }
});

// Reiniciar
restart.addEventListener('click', () => {
  level = 1;
  iniciarNivel();
});

// Empezar juego
iniciarNivel();
