// frontend/src/js/user-details-script.js
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userDetails = document.getElementById('user-details');
    
    if (userData) {
        userDetails.innerHTML = `
            <div class="container-fluid justify-content-center p-2 p-sm-5">
                <div class="col-12 col-md-8 form-control border-success">
                    <div class="d-flex flex-column flex-sm-row align-items-center">
                        <div class="user-detail-img mb-3 mb-sm-0 mr-0 mr-sm-3" style="max-width: 150px;">
                            <img src="/User_icon_2.svg.png" alt="User Icon" class="img-fluid w-100 h-auto">
                        </div>
                        <div class="user-detail-info w-100">
                            <table class="table table-striped table-bordered">
                                <tbody class="border">
                                    <tr class="user">
                                        <td><strong>Nº ID:</strong></td>
                                        <td>${userData._id}</td>
                                    </tr>
                                    <tr class="user">
                                        <td><strong>Nombre:</strong></td>
                                        <td>${userData.name}</td>
                                    </tr>
                                    <tr class="user">
                                        <td><strong>Fecha de Nacimiento:</strong></td>
                                        <td>${formatDate(userData.birthdate)}</td>
                                    </tr>
                                    <tr class="user">
                                        <td><strong>E-mail:</strong></td>
                                        <td>${userData.email}</td>
                                    </tr>
                                    <tr class="user">
                                        <td><strong>Subscripción:</strong></td>
                                        <td>${userData.subscription}</td>
                                    </tr>
                                    <tr class="user">
                                        <td><strong>Rol:</strong></td>
                                        <td>${userData.role}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        userDetails.innerHTML = `
            <div class="alert alert-warning" role="alert">
                No se encontraron datos del usuario. Por favor, inicia sesión nuevamente.
            </div>
        `;
    }
});
