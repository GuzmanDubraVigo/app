// Función para decodificar el JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error al decodificar el token JWT:', e);
        return null;
    }
}

// Función para limpiar el local storage
function clearLocalStorage() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
}

// Función para redirigir al login
function redirectToLogin() {
    window.location.href = 'http://localhost:4000/pages/register';
}

// Verifica si el usuario tiene permisos válidos
function checkUserPermissions() {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    
    // Si no hay token o datos de usuario en el local storage, redirige al login
    if (!userData || !token) {
        redirectToLogin();
        return;
    }

    try {
        const user = JSON.parse(userData);
        const parsedToken = parseJwt(token);
        
        // Aquí puedes agregar las verificaciones de permisos que necesites
        const isTokenExpired = parsedToken.exp * 1000 < Date.now();
        const userHasPermission = user.role === 'admin'; // Ejemplo de verificación de permisos

        if (isTokenExpired || !userHasPermission) {
            clearLocalStorage();
            redirectToLogin();
        }
    } catch (e) {
        console.error('Error al verificar permisos del usuario:', e);
        clearLocalStorage();
        redirectToLogin();
    }
}

// Ejecuta la verificación de permisos al cargar la página
checkUserPermissions();

