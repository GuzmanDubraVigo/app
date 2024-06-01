// Función para formatear la fecha
const formatBirthdate = (birthdate) => {
  return new Date(birthdate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Función para obtener todos los usuarios
function getAllUsers() {
  const token = localStorage.getItem('token'); 

  if (!token) {
    console.error('No se encontró un token de autenticación en el almacenamiento local.');
    return;
  }

  fetch("http://localhost:3000/user/", {
    method: "GET",
    headers: {
      "auth-token": token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log("Datos de usuarios obtenidos:", data);

      const usersData = data.data;

      window.usersData = usersData;

      renderUserList(usersData);
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    });
}

function renderUserList(usersData) {
  const html = usersData
    .map(
      (userData) => `
      <div class="container-fluid form-control border-success mb-3">
      <table class="table table-striped">
        <thead>
          <tr>
            <th colspan="2" class="fs-4 text-start">Detalles del Usuario</th>
          </tr>
        </thead>
        <tbody class="border">
          <tr class="user ${userData.disabled ? 'disabled-user' : ''}" data-userid="${userData._id}">
            <td class="fw-bold text-start">Nº ID:</td>
            <td class="text-end">${userData._id}</td>
          </tr>
          <tr class="user ${userData.disabled ? 'disabled-user' : ''}" data-userid="${userData._id}">
            <td class="fw-bold text-start">Nombre:</td>
            <td class="text-end">${userData.name}</td>
          </tr>
          <tr class="user ${userData.disabled ? 'disabled-user' : ''}" data-userid="${userData._id}">
            <td class="fw-bold text-start">Suscripción:</td>
            <td class="text-end fw-bold">${userData.subscription}</td>
          </tr>
          <tr class="user ${userData.disabled ? 'disabled-user' : ''}" data-userid="${userData._id}">
            <td class="fw-bold text-start">E-mail:</td>
            <td class="text-end">${userData.email}</td>
          </tr>
          <tr>
            <td colspan="2" class="text-center">
              <div class="d-flex flex-column flex-md-row justify-content-center">
                <button class="btn btn-warning btn-sm flex-fill mx-1 mb-2 mb-md-0" data-userid="${userData._id}">
                  <i class="bi bi-x-circle"></i> Habilitar o Deshabilitar - Acceso Premium
                </button>
                <div class="form-check form-switch flex-fill mx-1 d-flex align-items-center justify-content-center mb-2 mb-md-0">
                  <input class="form-check-input" type="checkbox" ${userData.disabled ? 'checked' : ''} onclick="cambiarEstado('${userData._id}', this)">
                </div>
                <button class="btn btn-success btn-sm flex-fill mx-1 mb-2 mb-md-0" onclick="editarUsuario('${userData._id}')">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm flex-fill mx-1 mb-2 mb-md-0" onclick="eliminarUsuario('${userData._id}')">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
                <button class="btn btn-primary btn-sm flex-fill mx-1 mb-2 mb-md-0 btn-premium-access" data-userid="${userData._id}">
                  <i class="bi bi-star"></i> Acceso Premium
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
        `
    )
    .join("");

  const containerUsers = document.getElementById("user_list_box");

  if (!containerUsers) {
    console.log("El elemento containerUsers no fue encontrado");
  } else {
    containerUsers.innerHTML = html;

    document.querySelectorAll(".user").forEach((item) => {
      item.addEventListener("click", function () {
        const userId = this.getAttribute("data-userid");
        displayUserDetails(usersData, userId);

        containerUsers.style.display = "none";
      });
    });

    document.querySelectorAll(".btn-premium-access").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const userId = this.getAttribute("data-userid");
        handlePremiumAccess(userId);
      });
    });

    document.querySelectorAll(".btn-warning").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const userId = this.getAttribute("data-userid");
        deshabilitarUsuario(userId, this);
      });
    });
  }
}

function getAllUserslistener() {
  const getAllUsersLink = document.getElementById("get-all-users");
  getAllUsersLink.addEventListener("click", function () {
    const userDetails = document.getElementById("user-details");
    if (userDetails) {
      userDetails.style.display = "none";
    }

    const containerUsers = document.getElementById("user_list_box");
    if (containerUsers) {
      containerUsers.style.display = "block";
    }

    getAllUsers();
  });
}

const displayUserDetails = (users, userId) => {
  console.log("Mostrando detalles del usuario con ID:", userId);

  const containerUsers = document.getElementById("user_list_box");
  if (containerUsers) {
    containerUsers.innerHTML = "";
    containerUsers.style.display = "none";
  }

  const userDetails = document.getElementById("user-details");
  if (!userDetails) {
    console.error("Detalles de usuario no encontrados");
    return;
  }

  userDetails.innerHTML = "";

  const user = users.find((user) => user._id === userId);
  if (user) {
    const birthdate = formatBirthdate(user.birthdate);

    userDetails.innerHTML = `
    <div class="container" id="user-details">
    <div class="text-center">
        <h1 class="text-white p-4 fs-1 btn btn-primary disabled mx-auto">Usuario</h1>
    </div>
    <div class="row justify-content-center p-4">
        <div class="col-12 col-md-8 form-control border-success">
            <div class="d-flex flex-column align-items-center">
                <div class="user-detail-img mb-3 text-center">
                    <img src="/User_icon_2.svg.png" alt="User Icon" class="img-fluid" style="max-width: 100px;">
                </div>
                <div class="user-detail-info w-100">
                    <table class="table table-striped table-bordered">
                        <tbody class="border">
                            <tr class="user" data-userid="${user._id}">
                                <td><strong>Nº ID:</strong></td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td>${user._id}</td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td><strong>Nombre:</strong></td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td>${user.name}</td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td><strong>Fecha de Nacimiento:</strong></td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td>${birthdate}</td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td><strong>E-mail:</strong></td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td>${user.email}</td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td><strong>Subscripción:</strong></td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td>${user.subscription}</td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td><strong>Rol:</strong></td>
                            </tr>
                            <tr class="user" data-userid="${user._id}">
                                <td>${user.role}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </div>
    </div>
</div>
        `;

    userDetails.style.display = "block";

    userDetails.classList.add("hide-background");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  } else {
    console.error("Usuario no encontrado con ID:", userId);
  }
};

function searchUsersByName() {
  const searchInput = document.getElementById("search-user");

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredUsers = window.usersData.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );

    renderUserList(filteredUsers);
  });
}

getAllUserslistener();

getAllUsers();

searchUsersByName();
