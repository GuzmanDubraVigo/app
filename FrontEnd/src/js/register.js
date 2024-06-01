// frontend/src/js/register.js
import apiUrl from '../config';

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');
  const birthdate = formData.get('birthdate');
  const email = formData.get('email');
  const password = formData.get('password');

  // Limpiar mensajes de error previos
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

  let hasError = false;

  // Validar nombre
  if (!name) {
    document.getElementById('name-error').textContent = 'El nombre es obligatorio.';
    hasError = true;
  }

  // Validar fecha de nacimiento
  const birthdateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
  if (!birthdate) {
    document.getElementById('birthdate-error').textContent = 'La fecha de nacimiento es obligatoria.';
    hasError = true;
  } else if (!birthdateRegex.test(birthdate)) {
    document.getElementById('birthdate-error').textContent = 'La fecha de nacimiento debe estar en el formato dd/mm/yyyy.';
    hasError = true;
  } else {
    const [day, month, year] = birthdate.split('/');
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
  } else {
    // Verificar si el email ya existe
    try {
      const emailResponse = await fetch(`${apiUrl}/user/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (emailResponse.status === 401) {
        throw new Error('Acceso denegado');
      }
      const emailData = await emailResponse.json();
      if (emailData.exists) {
        document.getElementById('email-error').textContent = 'El email ya está registrado.';
        hasError = true;
      }
    } catch (error) {
      console.error('Error al verificar el email:', error);
      document.getElementById('email-error').textContent = 'Error al verificar el email. Inténtalo de nuevo.';
      hasError = true;
    }
  }

  // Validar contraseña
  if (!password) {
    document.getElementById('password-error').textContent = 'La contraseña es obligatoria.';
    hasError = true;
  } else if (password.length < 8) {
    document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 8 caracteres.';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  try {
    // Convertir la fecha a yyyy-mm-dd para enviarla al backend
    const [day, month, year] = birthdate.split('/');
    const formattedBirthdate = `${year}-${month}-${day}`;

    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/user/singup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token, // Añadir el token de autenticación al encabezado de la solicitud
      },
      body: JSON.stringify({
        name,
        birthdate: formattedBirthdate,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data)
    if (data.status === 'succeeded') {
      // Registro exitoso, redirigir al usuario a la página de login
      window.location.href = '/app/pages/login.html';
    } else {
      // Mostrar error al usuario
      document.getElementById('form-error').textContent = data.message;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('form-error').textContent = error.message;
  }
});
