// ============================================
// NUEVA-RESENA.JS - Lógica del formulario
// Conectado al book-service (3002) y review-service (3001)
// ============================================

const BOOK_SERVICE = 'http://localhost:3002';
const REVIEW_SERVICE = 'http://localhost:3001';

// Variable para guardar el rating seleccionado
let selectedRating = 0;

// ============================================
// Al cargar la página verifico si hay sesión
// ============================================
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Si no hay sesión mando al login
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Muestro el nombre del usuario en el navbar
    document.getElementById('nav-username').textContent = username;
});

// ============================================
// FUNCIÓN: Seleccionar emoción
// ============================================
const selectEmotion = (emotion) => {

    // Quito la selección de todas las opciones
    document.querySelectorAll('.emotion-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Marco la opción seleccionada
    event.target.classList.add('selected');

    // Guardo el valor en el input oculto
    document.getElementById('emotion-value').value = emotion;
};

// ============================================
// FUNCIÓN: Seleccionar rating con estrellas
// ============================================
const setRating = (rating) => {
    selectedRating = rating;

    // Actualizo el input oculto
    document.getElementById('rating-value').value = rating;

    // Actualizo el texto del rating
    const texts = {
        1: 'No me gustó 😕',
        2: 'Estuvo bien 🙂',
        3: 'Me gustó 😊',
        4: 'Muy bueno 😍',
        5: '¡Increíble! 🤩'
    };
    document.getElementById('rating-text').textContent = texts[rating];

    // Actualizo el color de las estrellas
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
};

// ============================================
// FUNCIÓN: Armar la lista de personajes
// Solo incluye los que tienen nombre escrito
// ============================================
const getCharacters = () => {
    const characters = [];

    const top1 = document.getElementById('char-top1').value.trim();
    const top2 = document.getElementById('char-top2').value.trim();
    const top3 = document.getElementById('char-top3').value.trim();
    const amor = document.getElementById('char-amor').value.trim();
    const odio = document.getElementById('char-odio').value.trim();

    if (top1) characters.push({ name: top1, type: 'top' });
    if (top2) characters.push({ name: top2, type: 'top' });
    if (top3) characters.push({ name: top3, type: 'top' });
    if (amor) characters.push({ name: amor, type: 'amor' });
    if (odio) characters.push({ name: odio, type: 'odio' });

    return characters;
};

// ============================================
// FUNCIÓN: Mostrar alerta
// ============================================
const showAlert = (message, type) => {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} visible`;

    // Scroll al inicio para ver el mensaje
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================
// FUNCIÓN: Manejar el envío del formulario
// ============================================
const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'));

    // Agarro los valores del formulario
    const bookTitle = document.getElementById('book-title').value.trim();
    const bookAuthor = document.getElementById('book-author').value.trim();
    const bookGenre = document.getElementById('book-genre').value.trim();
    const reviewText = document.getElementById('review-text').value.trim();
    const emotion = document.getElementById('emotion-value').value;
    const rating = parseInt(document.getElementById('rating-value').value);

    // Validaciones del frontend
    if (!emotion) {
        showAlert('Por favor seleccioná una emoción 😊', 'error');
        return;
    }

    if (rating === 0) {
        showAlert('Por favor seleccioná una puntuación ⭐', 'error');
        return;
    }

    // Deshabilito el botón mientras proceso
    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        // PASO 1: Creo o busco el libro en el book-service
        const bookResponse = await fetch(`${BOOK_SERVICE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                book_title: bookTitle,
                author: bookAuthor || null,
                genre: bookGenre || null
            })
        });

        const bookData = await bookResponse.json();

        if (!bookResponse.ok) {
            showAlert(bookData.error || 'Error al registrar el libro', 'error');
            return;
        }

        // PASO 2: Creo la reseña en el review-service con el book_id que me devolvió
        const reviewResponse = await fetch(`${REVIEW_SERVICE}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Mando el token JWT para autenticarme
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                book_id: bookData.id,
                review_text: reviewText,
                emotion: emotion,
                rating: rating,
                characters: getCharacters()
            })
        });

        const reviewData = await reviewResponse.json();

        if (!reviewResponse.ok) {
            showAlert(reviewData.error || 'Error al guardar la reseña', 'error');
            return;
        }

        // Si todo salió bien muestro mensaje y redirijo al dashboard
        showAlert('¡Experiencia guardada exitosamente! 💜', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        showAlert('No se pudo conectar con el servidor. ¿Está corriendo el backend?', 'error');
    } finally {
        btn.textContent = 'Guardar experiencia 💜';
        btn.disabled = false;
    }
};

// ============================================
// FUNCIÓN: Cerrar sesión
// ============================================
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}; 
