// ============================================
// DASHBOARD.JS - Lógica del historial
// Conectado al review-service en puerto 3001
// ============================================

// URLs de los servicios
const REVIEW_SERVICE = 'https://bookpulse-api.onrender.com';

// ============================================
// Al cargar la página verifico si hay sesión
// Si no hay token redirijo al login
// ============================================
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    // Si no hay sesión mando al login
    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    // Muestro el nombre del usuario en el navbar y el saludo
    document.getElementById('nav-username').textContent = username;
    document.getElementById('welcome-msg').textContent = `Hola, ${username} 👋`;

    // Cargo las reseñas del usuario
    loadReviews(userId, token);
});

// ============================================
// FUNCIÓN: Cargar reseñas del usuario
// ============================================
const loadReviews = async (userId, token) => {
    try {
        // Hago el GET al review-service con el token en el header
        const response = await fetch(`${REVIEW_SERVICE}/reviews/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Mando el token JWT para que el middleware lo valide
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Si el token expiró mando al login
            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }
            throw new Error('Error al obtener las reseñas');
        }

        const reviews = await response.json();

        // Oculto el loading
        document.getElementById('loading').classList.add('hidden');

        // Si no hay reseñas muestro el estado vacío
        if (reviews.length === 0) {
            document.getElementById('empty-state').classList.remove('hidden');
            return;
        }

        // Renderizo las reseñas en el contenedor
        renderReviews(reviews);

    } catch (error) {
        document.getElementById('loading').classList.add('hidden');
        showAlert('No se pudieron cargar las lecturas. ¿Está corriendo el backend?', 'error');
    }
};

// ============================================
// FUNCIÓN: Renderizar las reseñas en el HTML
// ============================================
const renderReviews = (reviews) => {
    const container = document.getElementById('reviews-container');

    // Mapeo cada reseña a su HTML correspondiente
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-card-header">
                <div>
                    <div class="book-title">📖 ${review.book_title}</div>
                    <div class="book-meta">${review.author || 'Autor desconocido'}</div>
                </div>
                <span class="emotion-badge emotion-${review.emotion}">
                    ${getEmotionEmoji(review.emotion)} ${review.emotion}
                </span>
            </div>
            <div class="review-text">${review.review_text}</div>
            <div class="stars">${getStars(review.rating)}</div>
            <div class="review-card-footer">
                <span class="review-date">📅 ${formatDate(review.created_at)}</span>
                ${review.genre ? `<span class="review-genre">${review.genre}</span>` : ''}
            </div>
        </div>
    `).join('');
};

// ============================================
// FUNCIÓN: Obtener emoji según la emoción
// ============================================
const getEmotionEmoji = (emotion) => {
    const emojis = {
        'amor': '😍',
        'tristeza': '😢',
        'impacto': '😱',
        'enojo': '😡',
        'confusión': '🤯'
    };
    return emojis[emotion] || '💜';
};

// ============================================
// FUNCIÓN: Generar estrellas según el rating
// ============================================
const getStars = (rating) => {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
};

// ============================================
// FUNCIÓN: Formatear la fecha
// ============================================
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// ============================================
// FUNCIÓN: Mostrar alerta
// ============================================
const showAlert = (message, type) => {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} visible`;
};

// ============================================
// FUNCIÓN: Cerrar sesión
// ============================================
const logout = () => {
    // Borro todos los datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    // Redirijo al login
    window.location.href = 'login.html';
};
