// Importo dotenv para leer las variables del archivo .env
require('dotenv').config();

// Traigo la conexión a la base de datos que configuré en db.js
const db = require('../config/db');

// Estas son las emociones válidas del proyecto BookPulse
// Solo se pueden usar estas opciones al crear una reseña
const EMOCIONES_VALIDAS = ['amor', 'tristeza', 'impacto', 'enojo', 'confusión'];

// Esta función valida que los campos requeridos no estén vacíos
const validateFields = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || value.toString().trim() === '') {
            return `El campo ${key} es requerido`;
        }
    }
    return null;
};

// Esta función crea una reseña nueva y guarda los personajes asociados
const createReview = (data, callback) => {
    const { user_id, book_id, review_text, emotion, rating, characters } = data;

    // Valido que todos los campos requeridos estén completos
    const error = validateFields({ user_id, book_id, review_text, emotion, rating });
    if (error) return callback(null, { error });

    // Valido que la emoción sea una de las opciones válidas del proyecto
    if (!EMOCIONES_VALIDAS.includes(emotion.toLowerCase())) {
        return callback(null, { 
            error: `La emoción debe ser una de las siguientes: ${EMOCIONES_VALIDAS.join(', ')}` 
        });
    }

    // Valido que el rating esté entre 1 y 5
    if (rating < 1 || rating > 5) {
        return callback(null, { error: 'El rating debe ser entre 1 y 5' });
    }

    // Inserto la reseña en la tabla reviews
    const query = `
        INSERT INTO reviews (user_id, book_id, review_text, emotion, rating)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [user_id, book_id, review_text, emotion.toLowerCase(), rating], (err, result) => {
        if (err) return callback(err);

        const reviewId = result.insertId;

        // Si no hay personajes termino acá
        if (!characters || characters.length === 0) {
            return callback(null, { reviewId });
        }

        // Valido que cada personaje tenga nombre y tipo
        for (const c of characters) {
            if (!c.name || !c.type) {
                return callback(null, { error: 'Cada personaje debe tener nombre y tipo' });
            }
        }

        // Los tipos válidos de personajes en BookPulse
        const TIPOS_VALIDOS = ['top', 'amor', 'odio'];
        for (const c of characters) {
            if (!TIPOS_VALIDOS.includes(c.type.toLowerCase())) {
                return callback(null, { 
                    error: `El tipo de personaje debe ser: ${TIPOS_VALIDOS.join(', ')}` 
                });
            }
        }

        // Inserto todos los personajes asociados a la reseña
        const charQuery = `
            INSERT INTO characters (review_id, character_name, character_type)
            VALUES ?
        `;

        const values = characters.map(c => [reviewId, c.name, c.type.toLowerCase()]);

        db.query(charQuery, [values], (err2) => {
            if (err2) return callback(err2);
            callback(null, { reviewId });
        });
    });
};

// Esta función trae todas las reseñas de la base de datos
const getAllReviews = (callback) => {
    db.query('SELECT * FROM reviews', callback);
};

// Esta función trae el historial de reseñas de un usuario específico
// Junto con el título del libro de cada reseña
const getReviewsByUser = (userId, callback) => {
    const query = `
        SELECT reviews.*, books.book_title, books.author, books.genre
        FROM reviews
        JOIN books ON reviews.book_id = books.id
        WHERE reviews.user_id = ?
        ORDER BY reviews.created_at DESC
    `;
    db.query(query, [userId], callback);
};

// Esta función trae el detalle completo de una reseña con sus personajes
const getReviewById = (reviewId, callback) => {
    const query = `
        SELECT reviews.*, books.book_title, books.author, books.genre
        FROM reviews
        JOIN books ON reviews.book_id = books.id
        WHERE reviews.id = ?
    `;

    db.query(query, [reviewId], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);

        const review = results[0];

        db.query('SELECT * FROM characters WHERE review_id = ?', [reviewId], (err2, characters) => {
            if (err2) return callback(err2);
            review.characters = characters;
            callback(null, review);
        });
    });
};

// Exporto todas las funciones para usarlas en el controller
module.exports = { createReview, getAllReviews, getReviewsByUser, getReviewById };
