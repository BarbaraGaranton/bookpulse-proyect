// Traigo las funciones del reviewService para usarlas acá
const reviewService = require('../services/reviewService');

// Esta función maneja la creación de una reseña nueva
// Se ejecuta cuando alguien hace POST a /reviews
const postReview = (req, res) => {

    // Verifico que el user_id del body coincida con el usuario del token
    // Así un usuario no puede crear reseñas a nombre de otro
    if (parseInt(req.body.user_id) !== req.user.id) {
        return res.status(403).json({ error: 'No podés crear reseñas a nombre de otro usuario' });
    }

    // Verifico que el rating sea un número entero
    const rating = parseInt(req.body.rating);
    if (isNaN(rating) || rating !== parseFloat(req.body.rating)) {
        return res.status(400).json({ error: 'El rating debe ser un número entero entre 1 y 5' });
    }

    // Reemplazo el rating en el body con el valor entero validado
    req.body.rating = rating;

    reviewService.createReview(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al guardar la review' });

        // Si hubo un error de validación lo aviso con un 400
        if (result.error) return res.status(400).json({ error: result.error });

        res.json({ message: 'Review guardada 💜', reviewId: result.reviewId });
    });
};

// Esta función trae todas las reseñas
// Se ejecuta cuando alguien hace GET a /reviews
const getReviews = (req, res) => {
    reviewService.getAllReviews((err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener reviews' });
        res.json(results);
    });
};

// Esta función trae el historial de reseñas de un usuario específico
// Se ejecuta cuando alguien hace GET a /reviews/user/:userId
const getReviewsByUser = (req, res) => {
    const { userId } = req.params;
    reviewService.getReviewsByUser(userId, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener el historial' });
        res.json(results);
    });
};

// Esta función trae el detalle completo de una reseña con sus personajes
// Se ejecuta cuando alguien hace GET a /reviews/:id
const getReviewById = (req, res) => {
    const { id } = req.params;
    reviewService.getReviewById(id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al obtener la reseña' });
        if (!result) return res.status(404).json({ error: 'Reseña no encontrada' });
        res.json(result);
    });
};

// Exporto todas las funciones para que las rutas puedan usarlas
module.exports = { postReview, getReviews, getReviewsByUser, getReviewById };
