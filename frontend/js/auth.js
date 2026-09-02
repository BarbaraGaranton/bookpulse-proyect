// ============================================
// AUTH.JS - Lógica de login y registro
// Conectado al user-service en puerto 3003
// ============================================

// URL base del user-service
const USER_SERVICE = 'https://bookpulse-api.onrender.com';

// ============================================
// FUNCIÓN: Mostrar tab de login o registro
// ============================================
const showTab = (tab) => {

    // Agarro los dos formularios y los dos botones de tab
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.auth-tab');

    // Oculto el alert cuando cambio de tab
    hideAlert();

    // Muestro el formulario correspondiente
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
    }
};

// ============================================
// FUNCIÓN: Mostrar mensaje de alerta
// ============================================
const showAlert = (message, type) => {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} visible`;
};

// ============================================
// FUNCIÓN: Ocultar mensaje de alerta
// ============================================
const hideAlert = () => {
    const alert = document.getElementById('alert');
    alert.className = 'alert';
};

// ============================================
// FUNCIÓN: Manejar el login
// Se ejecuta cuando el usuario envía el form de login
// ============================================
const handleLogin = async (event) => {

    // Prevengo que el formulario recargue la página
    event.preventDefault();

    // Agarro los valores del formulario
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Cambio el texto del botón mientras espero la respuesta
    const btn = event.target.querySelector('button[type="submit"]');
    btn.textContent = 'Iniciando sesión...';
    btn.disabled = true;

    try {
        // Hago el POST al user-service para iniciar sesión
        const response = await fetch(`${USER_SERVICE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si hay error lo muestro en el alert
            showAlert(data.error || 'Error al iniciar sesión', 'error');
            return;
        }

        // Si el login fue exitoso guardo el token y los datos del usuario
        // en localStorage para usarlos en las otras páginas
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);

        // Muestro mensaje de éxito y redirijo al dashboard
        showAlert('¡Bienvenida! Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        // Si hay un error de conexión lo muestro
        showAlert('No se pudo conectar con el servidor. ¿Está corriendo el backend?', 'error');
    } finally {
        // Restauro el botón
        btn.textContent = 'Iniciar sesión 💜';
        btn.disabled = false;
    }
};

// ============================================
// FUNCIÓN: Manejar el registro
// Se ejecuta cuando el usuario envía el form de registro
// ============================================
const handleRegister = async (event) => {

    // Prevengo que el formulario recargue la página
    event.preventDefault();

    // Agarro los valores del formulario
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    // Cambio el texto del botón mientras espero la respuesta
    const btn = event.target.querySelector('button[type="submit"]');
    btn.textContent = 'Creando cuenta...';
    btn.disabled = true;

    try {
        // Hago el POST al user-service para registrar el usuario
        const response = await fetch(`${USER_SERVICE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si hay error lo muestro en el alert
            showAlert(data.error || 'Error al registrar usuario', 'error');
            return;
        }

        // Si el registro fue exitoso muestro mensaje y cambio al tab de login
        showAlert('¡Cuenta creada exitosamente! Ahora podés iniciar sesión 💜', 'success');
        setTimeout(() => {
            showTab('login');
        }, 2000);

    } catch (error) {
        showAlert('No se pudo conectar con el servidor. ¿Está corriendo el backend?', 'error');
    } finally {
        btn.textContent = 'Crear cuenta 💜';
        btn.disabled = false;
    }
};

// ============================================
// Al cargar la página verifico si ya hay sesión
// Si el usuario ya está logueado lo mando al dashboard
// ============================================
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }
});
