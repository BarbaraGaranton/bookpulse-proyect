// Importo dotenv para poder leer las variables del archivo .env
require('dotenv').config();

// Importo mysql2 para conectarme a la base de datos
const mysql = require('mysql2');

// Creo la conexión usando las variables de entorno del .env
// Así los datos sensibles no están escritos directamente en el código
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Intento conectarme a MySQL
db.connect((err) => {
    if (err) {
        console.error('Error de conexion en book-service:', err);
        return;
    }
    console.log('Book-service conectado a MySQL');
});

// Exporto la conexión para usarla en otros archivos
module.exports = db;
