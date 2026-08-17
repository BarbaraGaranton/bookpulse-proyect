// Importo dotenv para leer las variables del .env
require('dotenv').config();

// Importo jwt para verificar el token que manda el usuario
const jwt = require('jsonwebtoken');

// Este middleware verifica que el usuario esté autenticado
// Se ejecuta antes de que el request llegue al controller
const verifyToken = (req, res, next) => {

    // El token viene en el header Authorization con el formato "Bearer TOKEN"
    const authHeader = req.headers['authorization'];

    // Si no hay header de autorización aviso que falta el token
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido' });
    }

    // Separo el "Bearer" del token real
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido' });
    }

    // Verifico que el token sea válido usando el SECRET del .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        // Si el token es inválido o expiró aviso el error
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }

        // Si el token es válido guardo los datos del usuario en el request
        // Así los controllers pueden saber quién está haciendo el request
        req.user = decoded;

        // Llamo a next() para que el request continúe al controller
        next();
    });
};

// Exporto el middleware para usarlo en las rutas
module.exports = { verifyToken };
