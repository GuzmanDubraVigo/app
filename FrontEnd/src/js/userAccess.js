// frontend/src/js/userAccess.js

// Función para cargar los datos del usuario desde localStorage
const loadUserData = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

// Función para verificar si el usuario es premium
const isPremiumUser = (user) => {
  return user && user.subscription === 'premium';
};

// Función para manejar el acceso a la página premium
const handlePremiumAccess = () => {
  const user = loadUserData();
  if (isPremiumUser(user) && !user.disabled) {
    // Redirigir a la página premium
    window.location.href = "/premium.html";
  } else {
    // Mostrar alerta de falta de permisos con SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      html: 'No tienes permisos premium para acceder a esta página.<br>Pide Acceso a tu Distribuidor',
    });
  }
};

// Agregar eventos a los botones de acceso premium
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll(".btn-premium-access").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevenir comportamiento por defecto del botón
      handlePremiumAccess();
    });
  });
});
