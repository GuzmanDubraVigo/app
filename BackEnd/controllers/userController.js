const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/utils");

const addUser = async (req, res) => {
    try {
        const { name, email, birthdate, password } = req.body;
        const passwordCrypt = await bcrypt.hash(password, 10);

        // Validar y parsear la cadena de fecha de nacimiento en formato yyyy-mm-dd
        const [year, month, day] = birthdate.split('-').map(Number);
        const birthdateDate = new Date(year, month - 1, day);

        // Verificar si la fecha de nacimiento es válida
        if (isNaN(birthdateDate.getTime())) {
            return res.status(400).json({
                status: "Error",
                message: "La fecha de nacimiento es inválida. Debe estar en formato dd/mm/yyyy",
            });
        }

        const user = new User({
            name,
            email,
            birthdate: birthdateDate,
            password: passwordCrypt,
        });

        await user.save();

        res.status(200).json({ status: "succeeded", data: user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                status: "Error",
                message: "El email ya existe",
            });
        }
        res.status(400).json({
            status: "Error",
            message: "No se pudo crear el usuario",
            error: error.message,
        });
    }
};


// Función para realizar el login del usuario
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Buscamos por email si existe en la base de datos
        const user = await User.findOne({ email: email });
        //En caso de que si, entramos en el if , sino , devolvemos el mensaje por else
        if (user) {
            //Comparamos las contraseñas y si nos devuelve un true, es que es correcto
            //de lo contrario nos devuelve un false y manda el mensaje
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                // Generar token
                const payload = {
                    userId: user._id,
                    nombre: user.name,
                    email: user.email,
                    role: user.role,
                };
                const token = generateToken(payload, false);
                const token_refresh = generateToken(payload, true);

                // Devolver los datos del usuario junto con el token
                return res.status(200).json({
                    status: "succeedad",
                    data: user,
                    role: user.role,
                    token: token,
                    token_refresh: token_refresh,
                });
            } else {
                return res.status(200).json({
                    status: "Error",
                    message: "Email y contraseña no coinciden",
                });
            }
        } else {
            return res.status(200).json({
                status: "Error",
                message: "Email y contraseña no coinciden",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: "No se ha podido hacer login",
            error: error.message,
        });
    }
};



const getAllUser = async (req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener los Usuarios",
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) { 
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado",
            });
        }
        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener el usuario",
            error: error.message
        });
    }
};


const refreshToken = (req, res) => {
    try {
        const payload = req.payload;
        if (!payload) return res.status(401).json({ error: "Access denied" });
        const user = {
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
        };

        const token = generateToken(user, false);
        const token_refresh = generateToken(user, true);
        res.status(200).json({
            status: "succeeded",
            data: {
                token,
                token_refresh,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: "No se ha podido refrescar el token",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el usuario con el ID proporcionado"
            });
        }
        res.status(200).json({
            status: "success",
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al eliminar el Usuario",
            error: error.message
        });
    }
};

const patchUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, birthdate, password, subscription, role } = req.body;

        // Buscar el usuario por ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado",
            });
        }

        // Validar y formatear la fecha de nacimiento
        if (birthdate !== undefined) {
            const [year, month, day] = birthdate.split('-');
            const formattedBirthdate = new Date(year, month - 1, day);
            if (isNaN(formattedBirthdate.getTime())) {
                return res.status(400).json({
                    status: "error",
                    message: "La fecha de nacimiento es inválida. Debe estar en formato yyyy-mm-dd.",
                });
            }
            user.birthdate = formattedBirthdate;
        }

        // Actualizar solo los campos proporcionados
        if (name !== undefined) {
            user.name = name;
        }
        if (email !== undefined) {
            user.email = email;
        }
        if (subscription !== undefined) {
            user.subscription = subscription;
        }
        if (role !== undefined) {
            user.role = role;
        }

        // Si se proporciona una nueva contraseña, cifrarla antes de almacenarla
        if (password) {
            const passwordCrypt = await bcrypt.hash(password, 10);
            user.password = passwordCrypt;
        }

        // Guardar el usuario actualizado
        user = await user.save();

        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Error al actualizar el Usuario",
            error: error.message
        });
    }
};



const disableUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { disabled } = req.body;
        const user = await User.findByIdAndUpdate(userId, { disabled: disabled }, { new: true });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el usuario con el ID proporcionado"
            });
        }
        res.status(200).json({
            status: "success",
            message: `Usuario ${disabled ? 'deshabilitado' : 'habilitado'} exitosamente`,
            data: user // Añadir los datos del usuario actualizado en la respuesta
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al actualizar el estado del usuario",
            error: error.message
        });
    }
};
const checkEmailExists = async (req, res) => {
    try {
        const { email, userId } = req.body;
        const user = await User.findOne({ email: email });

        if (user && user._id.toString() !== userId) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al verificar el email',
            error: error.message
        });
    }
};

module.exports = {
    addUser,
    login,
    getAllUser,
    deleteUser,
    patchUser,
    getUserById,
    refreshToken,
    disableUser,
    checkEmailExists
};




