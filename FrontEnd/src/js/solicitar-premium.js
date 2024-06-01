// frontend/src/js/solicitar-premium.js
import apiUrl from '../config';

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".btn-solicitar-premium").addEventListener("click", function (event) {
        event.preventDefault();
        
        const token = localStorage.getItem('token');  // Obtener el token del localStorage

        fetch(`${apiUrl}/solicitar-premium`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.message) {
                    Swal.fire('Línea Vencida', 'Tu línea premium está vencida. Se ha enviado una solicitud de reactivación.', 'warning');
                } else {
                    Swal.fire('Solicitud Enviada', 'Tu solicitud ha sido enviada con éxito.', 'success');
                }
            } else if (data.error === 'Ya eres un usuario premium activo') {
                Swal.fire('Error', 'Ya eres un usuario premium activo.', 'error');
            } else if (data.error === 'Tu línea premium está vencida. Por favor, solicita la reactivación.') {
                Swal.fire('Línea Vencida', 'Tu línea premium está vencida. Por favor, solicita la reactivación.', 'warning');
            } else {
                Swal.fire('Error', 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.', 'error');
            }
        })
        .catch(error => {
            Swal.fire('Error', 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.', 'error');
        });
    });
});
