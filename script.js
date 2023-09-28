document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('board');
    const cells = [];
    let currentPlayer = 'red';
    let gameOver = false;
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const modoRadios = document.querySelectorAll('input[name="modoJuego"]');
    

    // Función para crear la cuadrícula
    function createGrid() {
        for (let row = 0; row < 6; row++) {
            cells[row] = [];
            for (let col = 0; col < 6; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoard.appendChild(cell);
                cells[row][col] = cell;
            }
        }
    }

    // Función para limpiar la cuadrícula
    function clearGrid() {
        while (gameBoard.firstChild) {
            gameBoard.removeChild(gameBoard.firstChild);
        }
    }

    // Escuchar el evento de clic en el botón de inicio
    startButton.addEventListener('click', function() {
        gameBoard.style.display = 'grid'; // Mostrar el tablero
        startButton.style.display = 'none'; // Ocultar el botón de inicio
        resetButton.disabled = false; // Habilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = true); // Bloquear radios
        
        clearGrid(); // Limpiar el tablero antes de crear una nueva cuadrícula
        createGrid(); // Llamar a la función para crear la cuadrícula
    });

    // Escuchar el evento de clic en el botón de reinicio
    resetButton.addEventListener('click', function() {
        gameBoard.style.display = 'none'; // Ocultar el tablero
        startButton.style.display = 'block'; // Mostrar el botón de inicio
        resetButton.disabled = true; // Deshabilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = false); // Desbloquear radios
        clearGrid(); // Limpiar el tablero cuando se reinicia el juego
    });

});
