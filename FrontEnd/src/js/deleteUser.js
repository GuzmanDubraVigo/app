// Obtener el token de autenticación del almacenamiento local
const token = localStorage.getItem("token");

// Función para eliminar un usuario con confirmación y mostrar sus datos
function eliminarUsuario(userId) {
    // Solicitar datos del usuario al servidor
    fetch(`http://localhost:3000/user/${userId}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Hubo un problema al obtener los datos del usuario.");
        })
        .then((responseData) => {
            // Verificar si hay datos en la respuesta
            if (responseData && responseData.data) {
                const userData = responseData.data;

                // Mostrar ventana de confirmación con los datos del usuario
                const confirmacion =
                    confirm(`¿Estás seguro de que deseas eliminar al usuario:
Nombre: ${userData.name}
Correo electrónico: ${userData.email}`);

                // Si el usuario confirmó la eliminación
                if (confirmacion) {
                    // Enviar solicitud para eliminar el usuario
                    fetch(`http://localhost:3000/user/${userId}`, {
                        method: "DELETE",
                        headers: {
                            'auth-token': localStorage.getItem('token')
                        },
                    })
                        .then((response) => {
                            if (response.ok) {
                                // Mostrar ventana emergente con mensaje de eliminación exitosa
                                alert("Usuario eliminado correctamente.");
                                // Recargar la página después de aceptar la alerta
                                window.location.reload();
                            } else {
                                // Mostrar mensaje de fallo en la eliminación
                                console.error("Hubo un problema al eliminar el usuario.");
                            }
                        })
                        .catch((error) => {
                            console.error("Hubo un problema con la solicitud:", error);
                        });
                }
            } else {
                throw new Error(
                    "No se encontraron datos del usuario en la respuesta del servidor."
                );
            }
        })
        .catch((error) => {
            console.error(
                "Hubo un problema al obtener los datos del usuario:",
                error
            );
        });
}