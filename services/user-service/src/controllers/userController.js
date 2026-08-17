// Traigo las funciones del userService para usarlas acá
const userService = require('../services/userService');

// Esta función maneja el registro de un usuario nuevo
// Se ejecuta cuando alguien hace POST a /users/register
const register = (req, res) => {

    // Agarro los datos que manda el usuario desde Postman o el frontend
    const { username, email, password } = req.body;

    // Le paso los datos al service para que encripte la contraseña y guarde el usuario
    userService.createUser(username, email, password, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });

        // Si el email ya existe le aviso al usuario
        if (result.error) return res.status(400).json({ error: result.error });

        // Si todo salió bien confirmo el registro
        res.json({ message: 'Usuario registrado 💜', userId: result.id });
    });
};

// Esta función maneja el login del usuario
// Se ejecuta cuando alguien hace POST a /users/login
const login = (req, res) => {

    // Agarro el email y contraseña que manda el usuario
    const { email, password } = req.body;

    // Le paso los datos al service para que verifique las credenciales
    userService.loginUser(email, password, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al iniciar sesión' });

        // Si hubo un error de credenciales lo aviso
        if (result.error) return res.status(400).json({ error: result.error });

        // Si todo está bien devuelvo el token y los datos del usuario
        res.json({ message: 'Login exitoso 💜', token: result.token, userId: result.userId, username: result.username });
    });
};

// Exporto las dos funciones para que las rutas puedan usarlas
module.exports = { register, login };
