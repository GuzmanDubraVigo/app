const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minuto

let inactivityTimer;
let countdownInterval; // Intervalo para la cuenta regresiva

// Función para restablecer el temporizador de inactividad y mostrar la cuenta regresiva
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  clearInterval(countdownInterval);

  let timeLeft = INACTIVITY_TIMEOUT;
  countdownInterval = setInterval(() => {
    timeLeft -= 1000; // Restar 1 segundo
    updateCountdownDisplay(timeLeft);
  }, 1000);

  inactivityTimer = setTimeout(returnToLogin, INACTIVITY_TIMEOUT);
}

// Función para actualizar el elemento HTML con la cuenta regresiva
function updateCountdownDisplay(timeLeft) {
  const countdownDisplay = document.getElementById('countdown');
  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  countdownDisplay.textContent = `Close in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Función para redirigir al usuario al inicio de sesión si está inactivo
function returnToLogin() {
  window.location.href = '/pages/login'; // Redirige al usuario al inicio de sesión
}

// Evento de clic en cualquier parte de la página para restablecer el temporizador de inactividad
document.addEventListener('click', resetInactivityTimer);
// Evento de teclado para restablecer el temporizador de inactividad
document.addEventListener('keydown', resetInactivityTimer);

// Iniciar el temporizador de inactividad al cargar la página
resetInactivityTimer();