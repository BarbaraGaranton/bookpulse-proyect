// Importo express para poder crear las rutas
const express = require('express');

// Creo el router que va a manejar las rutas del review-service
const router = express.Router();

// Importo todas las funciones del controller
const { postReview, getReviews, getReviewsByUser, getReviewById } = require('../controllers/reviewController');

// Importo el middleware de autenticación
// Este middleware verifica que el usuario esté logueado antes de cada request
const { verifyToken } = require('../middlewares/authMiddleware');

// Cuando alguien hace POST a /reviews verifico el token primero
// Solo usuarios logueados pueden crear reseñas
router.post('/', verifyToken, postReview);

// Cuando alguien hace GET a /reviews verifico el token primero
// Solo usuarios logueados pueden ver las reseñas
router.get('/', verifyToken, getReviews);

// Cuando alguien hace GET a /reviews/user/:userId verifico el token primero
// Solo usuarios logueados pueden ver el historial
router.get('/user/:userId', verifyToken, getReviewsByUser);

// Cuando alguien hace GET a /reviews/:id verifico el token primero
// Solo usuarios logueados pueden ver el detalle de una reseña
router.get('/:id', verifyToken, getReviewById);

// Exporto el router para que app.js lo pueda usar
module.exports = router;
