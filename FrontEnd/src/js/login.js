const form = document.getElementById('login-form');
const errorDiv = document.querySelector('.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch('http://localhost:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
    
    if (data.status === 'succeedad') {
      // Guardar los datos del usuario en el almacenamiento local
      localStorage.setItem('userData', JSON.stringify(data.data)); // Aquí es data.data en lugar de data
      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', data.token);
    
      // Redirigir al usuario según su rol
      if (data.data.role === 'admin') { // Aquí es data.data.role en lugar de data.role
        window.location.href = '/index.html'; // Redirige a index.html si el usuario es administrador
      } else {
        window.location.href = '/user.html'; // Redirige a user.html si el usuario no es administrador
      }
    } else {
      // Mostrar error al usuario
      errorDiv.textContent = data.message;
      errorDiv.classList.remove('oculto');
    }
    
  } catch (error) {
    console.error(error);
    errorDiv.textContent = 'Error al iniciar sesión';
    errorDiv.classList.remove('oculto');
  }
});
