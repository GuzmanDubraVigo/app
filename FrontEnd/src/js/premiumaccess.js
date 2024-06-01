// frontend/src/js/premiumaccess.js
import apiUrl from '../config';

// Función para verificar si el usuario es premium
const isPremiumUser = (userId) => {
  const user = window.usersData.find((user) => user._id === userId);
  return user && user.subscription === 'premium';
};

// Función para manejar el acceso a la página premium
const handlePremiumAccess = (userId) => {
  const user = window.usersData.find((user) => user._id === userId);
  if (isPremiumUser(userId) && !user.disabled) {
    // Redirigir a la página premium
    window.location.href = "/premium.html";
  } else {
    // Mostrar alerta de falta de permisos
    alert("No tienes permisos premium para acceder a esta página.");
  }
};

// Función para deshabilitar usuarios premium por el admin
const deshabilitarUsuario = (userId, button) => {
  const user = window.usersData.find((user) => user._id === userId);

  if (user && user.subscription === 'premium') {
    user.disabled = !user.disabled; // Toggle disabled state
    
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    // Enviar solicitud al servidor para actualizar el estado
    fetch(`${apiUrl}/user/disable/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ disabled: user.disabled })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert(`El usuario ha sido ${user.disabled ? 'deshabilitado' : 'habilitado'} exitosamente.`);
        button.nextElementSibling.firstElementChild.checked = user.disabled; // Update checkbox state
        renderUserList(window.usersData);
      } else {
        alert("Error al actualizar el estado del usuario.");
      }
    })
    .catch(error => {
      console.error("Hubo un problema con la solicitud:", error);
      alert("Error al actualizar el estado del usuario.");
    });
  } else {
    alert("No tienes permisos para deshabilitar este usuario.");
  }
};

// Agregar eventos a los botones de acceso premium y deshabilitar premium
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll(".btn-premium-access").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevenir comportamiento por defecto del botón
      const userId = this.getAttribute("data-userid");
      handlePremiumAccess(userId);
    });
  });

  document.querySelectorAll(".btn-warning").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevenir comportamiento por defecto del botón
      const userId = this.getAttribute("data-userid");
      deshabilitarUsuario(userId, this);
    });
  });
});
