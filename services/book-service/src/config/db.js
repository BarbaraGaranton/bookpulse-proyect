// Importo dotenv para poder leer las variables del archivo .env
require('dotenv').config();

// Importo mysql2 para conectarme a la base de datos
const mysql = require('mysql2');

// Importo fs y path para poder leer el certificado SSL de Aiven
const fs = require('fs');
const path = require('path');

// Creo la conexión usando las variables de entorno del .env
// Así los datos sensibles no están escritos directamente en el código
// Aiven exige SSL, por eso paso el certificado de la CA (ca.pem en la raíz del repo)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '../../../../ca.pem'))
    }
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
