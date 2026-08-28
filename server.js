// server.js
// Punto de entrada único para el deploy en Render.
// Une los 3 microservicios (user, book, review) en un solo proceso Express,
// sin modificar ni un archivo de adentro de cada servicio.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Habilito CORS para que el frontend (Vercel) pueda conectarse
app.use(cors());

// Le digo al servidor que entienda datos en formato JSON
app.use(express.json());

// Ruta de salud, para verificar rápido que el servicio está vivo
app.get('/', (req, res) => {
    res.send('BookPulse API funcionando 💜');
});

// Monto las rutas de cada microservicio, tal cual ya estaban armadas
app.use('/users', require('./services/user-service/src/routes/userRoutes'));
app.use('/books', require('./services/book-service/src/routes/bookRoutes'));
app.use('/reviews', require('./services/review-service/src/routes/reviewRoutes'));

// Render asigna el puerto por variable de entorno
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`BookPulse API corriendo en el puerto ${PORT}`);
});
