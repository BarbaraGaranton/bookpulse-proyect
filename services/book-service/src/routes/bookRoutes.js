// Importo express para poder crear las rutas
const express = require('express');

// Router es como un mini servidor que maneja las rutas de este servicio
const router = express.Router();

// Importo la función postBook del controller para usarla en la ruta
const { postBook } = require('../controllers/bookController');

// Cuando alguien hace POST a /books, ejecuto la función postBook
// Acá es donde el usuario manda el título, autor y género del libro
router.post('/', postBook);

// Exporto el router para que app.js lo pueda usar
module.exports = router;