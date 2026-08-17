// Importo dotenv al inicio para que todas las variables estén disponibles
require('dotenv').config();

// Importo express para crear el servidor
const express = require('express');
const app = express();

// Importo cors para permitir conexiones desde el frontend
const cors = require('cors');

// Importo las rutas del user-service
const userRoutes = require('./src/routes/userRoutes');

// Habilito CORS para que el frontend pueda conectarse al backend
app.use(cors());

// Le digo al servidor que entienda datos en formato JSON
app.use(express.json());

// Conecto las rutas — todo lo que llegue a /users va a userRoutes
app.use('/users', userRoutes);

// Uso el puerto del .env, si no existe uso 3003 por defecto
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`User-service corriendo en http://localhost:${PORT}`);
});
