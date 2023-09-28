document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.querySelector('.game-board');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const modoRadios = document.querySelectorAll('input[name="modoJuego"]');

    // Ocultar el tablero y deshabilitar el botón de reinicio al cargar
    gameBoard.style.display = 'none';
    resetButton.disabled = true;

    // Escuchar el evento de clic en el botón de inicio
    startButton.addEventListener('click', function() {
        gameBoard.style.display = 'grid'; // Mostrar el tablero
        this.style.display = 'none'; // Ocultar el botón de inicio
        resetButton.disabled = false; // Habilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = true); // Bloquear radios
    });

    // Escuchar el evento de clic en el botón de reinicio
    resetButton.addEventListener('click', function() {
        gameBoard.style.display = 'none'; // Ocultar el tablero
        startButton.style.display = 'block'; // Mostrar el botón de inicio
        resetButton.disabled = true; // Deshabilitar el botón de reinicio
        modoRadios.forEach(radio => radio.disabled = false); // Desbloquear radios
    });
});
