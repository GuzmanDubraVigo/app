const router = require("express").Router();
const {
    addUser,
    login,
    deleteUser,
    patchUser,
    getAllUser,
    getUserById,
    refreshToken,
    disableUser,
    checkEmailExists 
} = require("../controllers/userController.js");

const { verifyToken, verifyRoleAdmin } = require("../middlewares/auth");

// Endpoint para registrar un nuevo usuario
router.post("/singup", addUser);

// Endpoint para iniciar sesión de usuario
router.post("/login", login);

// Endpoint para verificar si el email ya existe
router.post('/check-email', checkEmailExists);

// Endpoint para obtener todos los usuarios
router.get("/", getAllUser );

// Endpoint para obtener un usuario por su ID
router.get("/:id", getUserById);

// Endpoint para eliminar un usuario por su ID, con verificación de token y rol de administrador
router.delete("/:id", verifyToken, verifyRoleAdmin, deleteUser);

// Endpoint para actualizar la información del usuario por su ID, con verificación de token y rol de administrador
router.patch("/:id", verifyToken, verifyRoleAdmin, patchUser);

// Endpoint para deshabilitar un usuario por su ID
router.put("/disable/:id", disableUser);

// Endpoint para refrescar el token, con verificación de token
router.get("/refreshToken", verifyToken, refreshToken);

module.exports = router;
