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
        for (let row = 0; row < 7; row++) {
            cells[row] = [];
            for (let col = 0; col < 6; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoard.appendChild(cell);
                cells[row][col] = cell;

                cell.addEventListener('click', function() {
                    if (!gameOver) {
                        dropPiece(col);
                    }
                });
            }
        }
    }

    // Función para verificar si hay una línea ganadora
    function checkWinner(row, col) {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]]; // Direcciones para comprobar

        for (const [dx, dy] of directions) {
            let count = 1;
            for (let i = 1; i <= 3; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 6 &&
                    cells[newRow][newCol].classList.contains(currentPlayer)) {
                    count++;
                } else {
                    break;
                }
            }
            for (let i = 1; i <= 3; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 6 &&
                    cells[newRow][newCol].classList.contains(currentPlayer)) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 4) {
                return true;
            }
        }

        return false;
    }

    // Función para mostrar un modal de felicitaciones
    function showWinnerModal() {
        const winnerModal = document.getElementById('winner-modal');
        const winnerText = document.getElementById('winner-text');
        winnerText.innerText = `¡Felicidades ${currentPlayer}! ¡Ganaste el juego!`;

        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop');
        document.body.appendChild(backdrop);

        winnerModal.style.display = 'block';

        // Cerrar modal al hacer clic fuera de él
        backdrop.addEventListener('click', function() {
            winnerModal.style.display = 'none';
            backdrop.remove();
        });
    }

    
    // Función para dejar caer una ficha en la columna seleccionada
    function dropPiece(col) {
        for (let row = 6; row >= 0; row--) {
            if (!cells[row][col].classList.contains('red') && !cells[row][col].classList.contains('yellow')) {
                cells[row][col].classList.add(currentPlayer);
                if (checkWinner(row, col)) {
                    showWinnerModal();
                }
                currentPlayer = (currentPlayer === 'red') ? 'yellow' : 'red';
                break;
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
    startButton.addEventListener('click', function () {
        gameBoard.style.display = 'grid'; // Mostrar el tablero
        startButton.style.display = 'none'; // Ocultar el botón de inicio
        resetButton.disabled = false; // Habilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = true); // Bloquear radios

        clearGrid(); // Limpiar el tablero antes de crear una nueva cuadrícula
        createGrid(); // Llamar a la función para crear la cuadrícula
    });

    // Escuchar el evento de clic en el botón de reinicio
    resetButton.addEventListener('click', function () {
        gameBoard.style.display = 'none'; // Ocultar el tablero
        startButton.style.display = 'block'; // Mostrar el botón de inicio
        resetButton.disabled = true; // Deshabilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = false); // Desbloquear radios
        clearGrid(); // Limpiar el tablero cuando se reinicia el juego

        // Restablecer el jugador actual a 'red'
        currentPlayer = 'red';
    });

});
