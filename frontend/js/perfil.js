// ============================================
// PERFIL.JS - Lógica de la página de perfil
// Conectado al review-service en puerto 3001
// ============================================

const REVIEW_SERVICE = 'https://bookpulse-api.onrender.com';
const USER_SERVICE = 'https://bookpulse-api.onrender.com';

// ============================================
// Al cargar la página verifico si hay sesión
// ============================================
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    // Si no hay sesión mando al login
    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    // Muestro el nombre en el navbar
    document.getElementById('nav-username').textContent = username;

    // Cargo los datos del perfil
    loadPerfil(userId, token, username, email);
});

// ============================================
// FUNCIÓN: Cargar datos del perfil
// ============================================
const loadPerfil = async (userId, token, username, email) => {
    try {
        // Traigo las reseñas del usuario para las estadísticas
        const response = await fetch(`${REVIEW_SERVICE}/reviews/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }
            throw new Error('Error al obtener datos');
        }

        const reviews = await response.json();

        // Muestro la inicial del usuario en el avatar
        const inicial = username.charAt(0).toUpperCase();
        document.getElementById('perfil-avatar').textContent = inicial;

        // Muestro el nombre y username
        document.getElementById('perfil-name').textContent = username;
        document.getElementById('nav-username').textContent = username;
        document.getElementById('info-username').textContent = username;

        // Muestro el email
        document.getElementById('perfil-email').textContent = email;
        document.getElementById('info-email').textContent = email;

        // Muestro el total de lecturas
        document.getElementById('total-reviews').textContent = reviews.length;

        // Calculo la emoción más frecuente
        if (reviews.length > 0) {
            const emocionFrecuente = getEmocionFrecuente(reviews);
            document.getElementById('emocion-favorita').textContent = getEmotionEmoji(emocionFrecuente);
        }

        // Muestro la fecha de hoy como referencia
        document.getElementById('info-fecha').textContent = new Date().toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long'
        });

    } catch (error) {
        showAlert('No se pudieron cargar los datos del perfil', 'error');
    }
};

// ============================================
// FUNCIÓN: Obtener la emoción más frecuente
// ============================================
const getEmocionFrecuente = (reviews) => {

    // Cuento cuántas veces aparece cada emoción
    const conteo = {};
    reviews.forEach(review => {
        conteo[review.emotion] = (conteo[review.emotion] || 0) + 1;
    });

    // Devuelvo la que más aparece
    return Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
};
