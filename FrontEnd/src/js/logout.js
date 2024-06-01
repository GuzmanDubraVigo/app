document.getElementById("logout").addEventListener("click", () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');

    // Redirigir a la página de inicio de sesión
    document.location.href = "/app/pages/login.html";
});
