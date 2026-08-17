// Importo dotenv para leer las variables del archivo .env
require('dotenv').config();

// Traigo la conexión a la base de datos que configuré en db.js
const db = require('../config/db');

// Esta función valida que los campos requeridos no estén vacíos
const validateFields = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || value.toString().trim() === '') {
            return `El campo ${key} es requerido`;
        }
    }
    return null;
};

// Esta función busca si el libro ya existe en la base de datos
// Si existe lo devuelve, si no existe lo crea
// Así evito tener el mismo libro duplicado
const findOrCreateBook = (title, author, genre, callback) => {

    // Valido que el título del libro esté completo
    // El autor y género son opcionales
    const error = validateFields({ book_title: title });
    if (error) return callback(null, { error });

    // Primero busco en la tabla books si ya existe un libro con ese título
    db.query('SELECT * FROM books WHERE book_title = ?', [title], (err, results) => {

        // Si hay un error en la búsqueda lo paso al callback y freno
        if (err) return callback(err);

        // Si ya encontré el libro lo devuelvo sin crear uno nuevo
        if (results.length > 0) return callback(null, results[0]);

        // Si el libro no existe lo creo con título, autor y género
        db.query(
            'INSERT INTO books (book_title, author, genre) VALUES (?, ?, ?)',
            [title, author || null, genre || null],
            (err2, result) => {
                // Si hay error al insertar lo paso al callback
                if (err2) return callback(err2);

                // Devuelvo el libro recién creado con su nuevo ID
                callback(null, { id: result.insertId, book_title: title, author, genre });
            }
        );
    });
};

// Exporto la función para usarla en el controller
module.exports = { findOrCreateBook };
