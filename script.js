document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('board');
    const cells = [];
    let currentPlayer = 'red';
    let gameOver = false;
    let isHumanVsAI = false; // Variable para determinar si el modo es Humano vs IA
    let isAIvsHuman = false; // Variable para determinar si el modo es IA vs Humano
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const modoRadios = document.querySelectorAll('input[name="modoJuego"]');

    // Variables adicionales para controlar los turnos
    let isFirstMoveByAI = false;

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
                    if (!gameOver && !(isAIvsHuman && currentPlayer === 'yellow' && isFirstMoveByAI)) {
                        dropPiece(col);
                    }
                });
            }
        }
    }

    // Escuchar cambios en los modos de juego
    modoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            isHumanVsAI = (this.value === 'hi' || this.value === 'ih');
            isAIvsHuman = (this.value === 'ih');
        });
    });

    // Función para obtener los movimientos válidos para la IA
    function getValidMoves() {
        const validMoves = [];
        for (let col = 0; col < 6; col++) {
            if (!cells[0][col].classList.contains('red') && !cells[0][col].classList.contains('yellow')) {
                validMoves.push(col);
            }
        }
        return validMoves;
    }

    // Función para evaluar la puntuación de un tablero
    function evaluateBoard() {
        let score = 0;

        // Evaluar filas
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 3; col++) {
                let window = [cells[row][col], cells[row][col + 1], cells[row][col + 2], cells[row][col + 3]];
                score += evaluateWindow(window);
            }
        }

        // Evaluar columnas
        for (let col = 0; col < 6; col++) {
            for (let row = 0; row < 4; row++) {
                let window = [cells[row][col], cells[row + 1][col], cells[row + 2][col], cells[row + 3][col]];
                score += evaluateWindow(window);
            }
        }

        // Evaluar diagonales
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                let windowDown = [cells[row][col], cells[row + 1][col + 1], cells[row + 2][col + 2], cells[row + 3][col + 3]];
                score += evaluateWindow(windowDown);

                let windowUp = [cells[row + 3][col], cells[row + 2][col + 1], cells[row + 1][col + 2], cells[row][col + 3]];
                score += evaluateWindow(windowUp);
            }
        }

        return score;
    }

    function evaluateWindow(window) {
        const AI_PIECE = 'yellow';
        const HUMAN_PIECE = 'red';

        let aiCount = window.filter(cell => cell.classList.contains(AI_PIECE)).length;
        let humanCount = window.filter(cell => cell.classList.contains(HUMAN_PIECE)).length;
        let emptyCount = window.filter(cell => !cell.classList.contains(AI_PIECE) && !cell.classList.contains(HUMAN_PIECE)).length;

        if (aiCount === 4) {
            return 1000;
        } else if (aiCount === 3 && emptyCount === 1) {
            return 100;
        } else if (aiCount === 2 && emptyCount === 2) {
            return 10;
        }

        if (humanCount === 4) {
            return -1000;
        } else if (humanCount === 3 && emptyCount === 1) {
            return -100;
        } else if (humanCount === 2 && emptyCount === 2) {
            return -10;
        }

        return 0;
    }

    // Función que implementa el algoritmo Minimax
    function minimax(depth, maximizingPlayer) {
        if (depth === 0 || gameOver) {
            return evaluateBoard();
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            const validMoves = getValidMoves();
            for (const move of validMoves) {
                // Simular un movimiento
                const col = move;
                const row = getEmptyRow(col);
                cells[row][col].classList.add('yellow');
                const eval = minimax(depth - 1, false);
                cells[row][col].classList.remove('yellow');

                maxEval = Math.max(maxEval, eval);
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            const validMoves = getValidMoves();
            for (const move of validMoves) {
                // Simular un movimiento
                const col = move;
                const row = getEmptyRow(col);
                cells[row][col].classList.add('red');
                const eval = minimax(depth - 1, true);
                cells[row][col].classList.remove('red');

                minEval = Math.min(minEval, eval);
            }
            return minEval;
        }
    }

    // Función para determinar el mejor movimiento para la IA
    function findBestMove() {
        const validMoves = getValidMoves();
        let bestMove = -1;
        let bestEval = -Infinity;
        for (const move of validMoves) {
            // Simular un movimiento
            const col = move;
            const row = getEmptyRow(col);
            cells[row][col].classList.add('yellow');
            const eval = minimax(4, false); // Profundidad de búsqueda, puedes ajustarla según lo desees
            cells[row][col].classList.remove('yellow');

            if (eval > bestEval) {
                bestEval = eval;
                bestMove = move;
            }
        }
        return bestMove;
    }

    // Función para obtener la fila vacía en una columna
    function getEmptyRow(col) {
        for (let row = 6; row >= 0; row--) {
            if (!cells[row][col].classList.contains('red') && !cells[row][col].classList.contains('yellow')) {
                return row;
            }
        }
        return -1; // Si la columna está llena
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
        backdrop.addEventListener('click', function () {
            winnerModal.style.display = 'none';
            backdrop.remove();
        });
    }

    // Función para dejar caer una ficha en la columna seleccionada
    function dropPiece(col) {
        if (gameOver) return; // Si el juego ya ha terminado, no hacer nada

        for (let row = 6; row >= 0; row--) {
            if (!cells[row][col].classList.contains('red') && !cells[row][col].classList.contains('yellow')) {
                cells[row][col].classList.add(currentPlayer);
                if (checkWinner(row, col)) {
                    showWinnerModal();
                    gameOver = true; // Marcar el juego como terminado
                }
                currentPlayer = (currentPlayer === 'red') ? 'yellow' : 'red';
                break;
            }
        }
        console.log(`Turno del jugador: ${currentPlayer}`);

        // Si está en un modo con IA y no es el turno de la IA vs Humano, es el turno de la IA
        if (isHumanVsAI && currentPlayer === 'yellow' && (!isAIvsHuman || (isAIvsHuman && currentPlayer === 'red'))) {
            playAI();
        }

        // En el modo "IA vs Humano", marcar que la primera jugada es de la IA
        if (isAIvsHuman && currentPlayer === 'red' && !isFirstMoveByAI) {
            isFirstMoveByAI = true;
            playAI();
        }
    }


    // Función para que la IA juegue
   function playAI() {
    const bestMove = findBestMove();
    dropPiece(bestMove);
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

        // Si está en el modo "IA vs Humano", la IA juega primero
        if (document.querySelector('input[name="modoJuego"]:checked').value === 'ih') {
            playAI();
        }
    });

    // Escuchar el evento de clic en el botón de reinicio
    resetButton.addEventListener('click', function () {
        gameBoard.style.display = 'none'; // Ocultar el tablero
        startButton.style.display = 'block'; // Mostrar el botón de inicio
        resetButton.disabled = true; // Deshabilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = false); // Desbloquear radios
        clearGrid(); // Limpiar el tablero cuando se reinicia el juego

        // Resetear variables y configuraciones
        currentPlayer = 'red';
        gameOver = false;

        console.log('Nueva parrtida')
    });

});
