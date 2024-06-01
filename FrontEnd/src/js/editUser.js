// frontend/src/js/editUser.js
import apiUrl from '../config';

// Función para verificar si el email ya existe
function verificarEmailExistente(email, userId) {
    return fetch(`${apiUrl}/user/check-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ email, userId })
    })
    .then(response => response.json());
}

// Función para editar usuario
function editarUsuario(userId) {
    // Obtener referencia al formulario de edición en el HTML
    const form = document.getElementById('editForm');

    // Asignar el userId al campo oculto en el formulario
    form.elements['id'].value = userId;

    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    // Solicitar datos del usuario al servidor
    fetch(`${apiUrl}/user/${userId}`, {
        headers: {
            'auth-token': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hubo un problema al obtener los datos del usuario. Código de estado: ' + response.status);
        }
        return response.json();
    })
    .then(responseData => {
        // Verificar si la respuesta tiene el campo "data"
        if (!responseData || !responseData.hasOwnProperty('data')) {
            throw new Error('Los datos del usuario son inválidos o están incompletos. Datos recibidos:', responseData);
        }

        const userData = responseData.data;

        // Rellenar el formulario con los datos del usuario
        form.elements['nombre'].value = userData.name;
        form.elements['email'].value = userData.email;

        // Convertir la fecha de yyyy-mm-dd a dd/mm/yyyy
        const birthdate = new Date(userData.birthdate);
        const day = String(birthdate.getDate()).padStart(2, '0');
        const month = String(birthdate.getMonth() + 1).padStart(2, '0');
        const year = birthdate.getFullYear();
        form.elements['birthdate'].value = `${day}/${month}/${year}`;

        form.elements['password'].value = ''; // Dejar el campo de la contraseña vacío inicialmente
        form.elements['subscription'].value = userData.subscription;
        form.elements['role'].value = userData.role;

        // Guardar la contraseña original para comparación
        form.elements['password'].dataset.originalValue = userData.password;

        // Mostrar el formulario de edición
        $('#editModal').modal('show');
    })
    .catch(error => {
        console.error('Hubo un problema al obtener los datos del usuario:', error);
    });
}

// Función para guardar los cambios
function guardarCambios() {
    // Obtener referencia al formulario de edición en el HTML
    const form = document.getElementById('editForm');

    // Obtener el valor del userId del campo oculto
    const userId = form.elements['id'].value;
    const email = form.elements['email'].value;

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let hasError = false;

    // Validar nombre
    if (!form.elements['nombre'].value) {
        document.getElementById('nombre-error').textContent = 'El nombre es obligatorio.';
        hasError = true;
    }

    // Validar fecha de nacimiento
    const birthdateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
    const birthdateValue = form.elements['birthdate'].value;
    if (!birthdateValue) {
        document.getElementById('birthdate-error').textContent = 'La fecha de nacimiento es obligatoria.';
        hasError = true;
    } else if (!birthdateRegex.test(birthdateValue)) {
        document.getElementById('birthdate-error').textContent = 'La fecha de nacimiento debe estar en el formato dd/mm/yyyy.';
        hasError = true;
    } else {
        const [day, month, year] = birthdateValue.split('/');
        const birthdateObj = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        if (birthdateObj > today) {
            document.getElementById('birthdate-error').textContent = 'Aún no has nacido.';
            hasError = true;
        }
    }

    // Validar email
    if (!email) {
        document.getElementById('email-error').textContent = 'El email es obligatorio.';
        hasError = true;
    }

    // Validar contraseña
    const newPassword = form.elements['password'].value;
    const originalPassword = form.elements['password'].dataset.originalValue;
    if (newPassword && newPassword.length < 8) {
        document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 8 caracteres.';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Convertir la fecha de dd/mm/yyyy a yyyy-mm-dd
    const [day, month, year] = birthdateValue.split('/');
    const formattedBirthdate = `${year}-${month}-${day}`;

    // Crear el objeto de datos del usuario a enviar en la solicitud PATCH
    const userData = {
        name: form.elements['nombre'].value,
        email: email,
        birthdate: formattedBirthdate,
        subscription: form.elements['subscription'].value,
        role: form.elements['role'].value
    };

    // Solo agregar la contraseña si ha sido modificada
    if (newPassword && newPassword !== originalPassword) {
        userData.password = newPassword;
    }

    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    // Verificar si el email ya existe
    verificarEmailExistente(email, userId)
        .then(data => {
            if (data.exists) {
                // Mostrar mensaje de error si el email ya existe
                document.getElementById('email-error').textContent = 'El email ya existe. Por favor, elija otro email.';
                throw new Error('El email ya existe');
            } else {
                // Si el email no existe, proceder con la solicitud PATCH
                return fetch(`${apiUrl}/user/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    },
                    body: JSON.stringify(userData)
                });
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema al guardar los cambios. Código de estado: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Mostrar mensaje de éxito dentro del modal
            const alertPlaceholder = document.getElementById('alertPlaceholder');
            alertPlaceholder.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Los cambios se guardaron correctamente.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            // Recargar la página después de un breve retraso
            setTimeout(() => {
                location.reload();
            }, 1000);
        })
        .catch(error => {
            if (error.message !== 'El email ya existe') {
                // Mostrar mensaje de error dentro del modal
                const alertPlaceholder = document.getElementById('alertPlaceholder');
                alertPlaceholder.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                console.error('Hubo un problema al guardar los cambios:', error);
            }
        });
}
