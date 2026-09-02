// Importo dotenv para leer las variables del archivo .env
require('dotenv').config();

// Traigo la conexión a la base de datos que configuré en db.js
const db = require('../config/db');

// Traigo bcrypt para encriptar contraseñas antes de guardarlas
const bcrypt = require('bcrypt');

// Traigo jwt para generar tokens cuando el usuario se loguea
const jwt = require('jsonwebtoken');

// Esta función valida que los campos requeridos no estén vacíos
// La voy a usar antes de procesar cualquier dato
const validateFields = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || value.toString().trim() === '') {
            return `El campo ${key} es requerido`;
        }
    }
    return null;
};

// Esta función valida que el email tenga un formato correcto
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Esta función crea un usuario nuevo con la contraseña encriptada
const createUser = (username, email, password, callback) => {

    // Valido que todos los campos requeridos estén completos
    const error = validateFields({ username, email, password });
    if (error) return callback(null, { error });

    // Valido que el email tenga un formato correcto
    if (!validateEmail(email)) {
        return callback(null, { error: 'El formato del email no es válido' });
    }

    // Valido que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
        return callback(null, { error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verifico si el email ya está registrado
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return callback(err);

        // Si ya existe un usuario con ese email aviso el error
        if (results.length > 0) return callback(null, { error: 'El email ya está registrado' });

        // Encripto la contraseña con bcrypt usando 10 rondas de seguridad
        bcrypt.hash(password, 10, (err, password_hash) => {
            if (err) return callback(err);

            // Guardo el usuario con la contraseña encriptada
            db.query(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                [username, email, password_hash],
                (err, result) => {
                    if (err) return callback(err);
                    callback(null, { id: result.insertId });
                }
            );
        });
    });
};

// Esta función verifica el login del usuario
const loginUser = (email, password, callback) => {

    // Valido que los campos requeridos estén completos
    const error = validateFields({ email, password });
    if (error) return callback(null, { error });

    // Valido que el email tenga un formato correcto
    if (!validateEmail(email)) {
        return callback(null, { error: 'El formato del email no es válido' });
    }

    // Busco el usuario por email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return callback(err);

        // Si no encuentro el usuario aviso que no existe
        if (results.length === 0) return callback(null, { error: 'Usuario no encontrado' });

        const user = results[0];

        // Comparo la contraseña ingresada con la encriptada en la base de datos
        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (err) return callback(err);

            // Si la contraseña no coincide aviso el error
            if (!match) return callback(null, { error: 'Contraseña incorrecta' });

            // Genero el token JWT usando el SECRET del archivo .env
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Devuelvo el token y los datos básicos del usuario
            callback(null, { token, userId: user.id, username: user.username, email: user.email });
        });
    });
};


// Exporto las funciones para usarlas en el controller
module.exports = { createUser, loginUser };
