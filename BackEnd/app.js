const express = require("express");
const nodemailer = require('nodemailer');
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const userRouter = require("./routers/userRouter");
const getUserById = require("./controllers/userController").getUserById;
const User = require('./models/userModel'); // Asegúrate de que la ruta sea correcta
const { verifyToken } = require('./middlewares/auth');  // Importar el middleware

const PORT = process.env.PORT || 3000;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const urlMongodb = process.env.DATABASE_URL_DEV;
mongoose.connect(urlMongodb);

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("Error al conectar a MongoDB:", error);
});

db.once("open", () => {
    console.log("Conectado a MongoDB");
});

app.use("/user", userRouter);
app.get('/user/:userId', getUserById);

app.post('/solicitar-premium', verifyToken, async (req, res) => {
    const { userId, email, nombre } = req.payload;

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        if (user.subscription === 'premium' && !user.disabled) {
            return res.status(400).json({ success: false, error: 'Ya eres un usuario premium activo' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        let mailOptionsAdmin;
        let mailOptionsUser;
        if (user.subscription === 'premium' && user.disabled) {
            mailOptionsAdmin = {
                from: process.env.GMAIL_USER,
                to: process.env.GMAIL_USER,
                subject: 'Solicitud de Reactivación de Servicio Premium',
                text: `El usuario ${nombre} con el ID ${userId} y el correo electrónico ${email} ha solicitado la reactivación de su servicio premium.`
            };
            mailOptionsUser = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Confirmación de Solicitud de Reactivación de Servicio Premium',
                text: `Hola ${nombre}, hemos recibido tu solicitud para reactivar tu servicio premium. Nuestro equipo se pondrá en contacto contigo pronto.`
            };
            await transporter.sendMail(mailOptionsAdmin);
            await transporter.sendMail(mailOptionsUser);
            res.status(200).json({ success: true, message: 'Solicitud de reactivación enviada.' });
        } else {
            mailOptionsAdmin = {
                from: process.env.GMAIL_USER,
                to: process.env.GMAIL_USER,
                subject: 'Solicitud de Acceso Premium',
                text: `El usuario ${nombre} con el ID ${userId} y el correo electrónico ${email} ha solicitado acceso premium.`
            };
            mailOptionsUser = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Confirmación de Solicitud de Acceso Premium',
                text: `Hola ${nombre}, hemos recibido tu solicitud para acceso premium. Nuestro equipo se pondrá en contacto contigo pronto.`
            };

            await transporter.sendMail(mailOptionsAdmin);
            await transporter.sendMail(mailOptionsUser);
            res.status(200).json({ success: true });
        }

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ success: false, error: 'Error al procesar la solicitud' });
    }
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Ruta catch-all para manejar el enrutamiento de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
