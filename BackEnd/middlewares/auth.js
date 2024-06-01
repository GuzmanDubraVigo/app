const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        console.log("Token no proporcionado");
        return res.status(401).send("Acceso denegado: Token no proporcionado");
    }
    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        req.payload = payload;
        console.log("Token verificado correctamente:", payload);
        next();
    } catch (error) {
        console.log("Token no válido:", error.message);
        res.status(401).send("Acceso denegado: Token no válido");
    }
};

const verifyRoleAdmin = (req, res, next) => {
    try {
        const payload = req.payload;
        if (!payload.role || payload.role !== "admin") {
            console.log("Acceso denegado: No tienes permisos de administrador");
            return res.status(403).send("Acceso denegado: No tienes permisos de administrador");
        }
        console.log("Usuario tiene permisos de administrador");
        next();
    } catch (error) {
        console.log("Error al verificar el rol de usuario:", error.message);
        res.status(401).send("Acceso denegado: Token no válido");
    }
};

module.exports = { verifyToken, verifyRoleAdmin };
