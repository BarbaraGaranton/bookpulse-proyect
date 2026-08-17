// Importo express para poder crear las rutas
const express = require('express');

// Creo el router que va a manejar las rutas del user-service
const router = express.Router();

// Importo las funciones del controller para usarlas en las rutas
const { register, login } = require('../controllers/userController');

// Cuando alguien hace POST a /users/register ejecuto la función register
// Acá es donde el usuario manda su nombre, email y contraseña para crear su cuenta
router.post('/register', register);

// Cuando alguien hace POST a /users/login ejecuto la función login
// Acá es donde el usuario manda su email y contraseña para iniciar sesión
router.post('/login', login);

// Exporto el router para que app.js lo pueda usar
module.exports = router;
