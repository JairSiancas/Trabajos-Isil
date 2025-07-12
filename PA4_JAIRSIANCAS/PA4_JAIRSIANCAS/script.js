let cantidadFilas = 8
let cantidadColumnas = 8
let cantidadMinas = 10

let matrizTablero = []
let matrizRevelado = []
let estadoJuegoTerminado = 0

const crearTablero = () => {
  for (let fila = 0; fila < cantidadFilas; fila++) {
    matrizTablero[fila] = []
    matrizRevelado[fila] = []
    for (let columna = 0; columna < cantidadColumnas; columna++) {
      matrizTablero[fila][columna] = 0
      matrizRevelado[fila][columna] = 0
    }
  }

  let minasColocadas = 0
  while (minasColocadas < cantidadMinas) {
    let filaAleatoria = Math.floor(Math.random() * cantidadFilas)
    let columnaAleatoria = Math.floor(Math.random() * cantidadColumnas)
    if (matrizTablero[filaAleatoria][columnaAleatoria] !== '💣') {
      matrizTablero[filaAleatoria][columnaAleatoria] = '💣'
      minasColocadas += 1
    }
  }

  for (let fila = 0; fila < cantidadFilas; fila++) {
    for (let columna = 0; columna < cantidadColumnas; columna++) {
      if (matrizTablero[fila][columna] !== '💣') {
        let minasCercanas = contarMinasCercanas(fila, columna)
        matrizTablero[fila][columna] = minasCercanas
      }
    }
  }
}

const contarMinasCercanas = (x, y) => {
  let contador = 0
  for (let fila = x - 1; fila <= x + 1; fila++) {
    for (let columna = y - 1; columna <= y + 1; columna++) {
      if (
        fila >= 0 && fila < cantidadFilas &&
        columna >= 0 && columna < cantidadColumnas
      ) {
        if (matrizTablero[fila][columna] === '💣') {
          contador += 1
        }
      }
    }
  }
  return contador
}

const mostrarTablero = () => {
  const contenedor = document.getElementById('tablero')
  contenedor.innerHTML = ''
  for (let fila = 0; fila < cantidadFilas; fila++) {
    for (let columna = 0; columna < cantidadColumnas; columna++) {
      const celda = document.createElement('div')
      celda.classList.add('celda')
      if (matrizRevelado[fila][columna] === 1) {
        celda.classList.add('revelado')
        if (matrizTablero[fila][columna] !== 0) {
          celda.textContent = matrizTablero[fila][columna]
        }
      }
      celda.addEventListener('click', () => revelarCelda(fila, columna))
      contenedor.appendChild(celda)
    }
  }
}

const revelarCelda = (x, y) => {

  matrizRevelado[x][y] = 1

  if (matrizTablero[x][y] === '💣') { 
    Swal.fire({
    title: "¡Perdiste! Presiona el botón de abajo para jugar otra vez.💥",
    icon: "error",
    confirmButtonText: "Reiniciar nivel",
    draggable: true}).then(() => {
      location.reload()
    })
    estadoJuegoTerminado = 1
    mostrarTodasLasMinas()
  }

  if (matrizTablero[x][y] === 0) {
    for (let fila = x - 1; fila <= x + 1; fila++) {
      for (let columna = y - 1; columna <= y + 1; columna++) {
        if (
          fila >= 0 && fila < cantidadFilas &&
          columna >= 0 && columna < cantidadColumnas &&
          matrizRevelado[fila][columna] === 0
        ) {
          revelarCelda(fila, columna)
        }
      }
    }
  }

  mostrarTablero()
  verificarVictoria()
}

const mostrarTodasLasMinas = () => {
  for (let fila = 0; fila < cantidadFilas; fila++) {
    for (let columna = 0; columna < cantidadColumnas; columna++) {
      if (matrizTablero[fila][columna] === '💣') {
        matrizRevelado[fila][columna] = 1
      }
    }
  }
  mostrarTablero()
}

const verificarVictoria = () => {
  let totalCeldasSeguras = cantidadFilas * cantidadColumnas - cantidadMinas
  let totalCeldasReveladas = 0

  for (let fila = 0; fila < cantidadFilas; fila++) {
    for (let columna = 0; columna < cantidadColumnas; columna++) {
      if (matrizRevelado[fila][columna] === 1 && matrizTablero[fila][columna] !== '💣') {
        totalCeldasReveladas += 1
      }
    }
  }

  if (totalCeldasReveladas === totalCeldasSeguras) {
    Swal.fire({
      title: "¡Ganaste! Presiona el botón de abajo para jugar otra vez. 🎉",
      icon: "success",
      confirmButtonText: "Reiniciar nivel",
      draggable: true}).then(() => {
        location.reload()
      })
    estadoJuegoTerminado = 1
    mostrarTodasLasMinas()
  }
}

crearTablero()
mostrarTablero()
