// Importo dotenv al inicio para que todas las variables estén disponibles
require('dotenv').config();

// Importo express para crear el servidor
const express = require('express');
const app = express();

// Importo cors para permitir conexiones desde el frontend
const cors = require('cors');

// Importo las rutas del book-service
const bookRoutes = require('./src/routes/bookRoutes');

// Habilito CORS para que el frontend pueda conectarse al backend
app.use(cors());

// Le digo al servidor que entienda datos en formato JSON
app.use(express.json());

// Conecto las rutas — todo lo que llegue a /books va a bookRoutes
app.use('/books', bookRoutes);

// Uso el puerto del .env, si no existe uso 3002 por defecto
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Book-service corriendo en http://localhost:${PORT}`);
});
