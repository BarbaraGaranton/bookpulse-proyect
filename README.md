BookPulse
Plataforma web donde los usuarios registran y expresan sus experiencias emocionales de lectura: qué sintieron con cada libro,
qué personajes los marcaron, y llevan un historial personal de sus lecturas.

A diferencia de otras plataformas de libros, BookPulse no se centra en la búsqueda o venta de libros, sino en la experiencia emocional
del lector.

Proyecto desarrollado de forma individual en el marco de la Práctica Profesionalizante de la Tecnicatura Superior en Programación (Teclab),
y utilizado como base práctica para aplicar QA manual, testing de APIs y automatización de pruebas.

✨Funcionalidades
Registro e inicio de sesión de usuarios
Registro de experiencias de lectura: reseña, emoción principal y puntuación
Destacado de personajes favoritos y menos queridos por libro
Historial personal de experiencias registradas
Arquitectura

El backend está organizado en microservicios independientes, cada uno con responsabilidad única:

Microservicio	Responsabilidad
user-service	Registro y autenticación de usuarios
book-service	Gestión de información de libros
review-service	Gestión de reseñas, emociones y personajes

Cada microservicio sigue la misma estructura interna: controllers, routes, services, models y config.

Stack tecnológico
Backend: Node.js, Express
Base de datos: MySQL (modelo relacional — tablas users, books, reviews, characters)
Testing de APIs: Postman
Entorno de desarrollo: Visual Studio Code
En camino: automatización de pruebas con Playwright y TypeScript
📂 Estructura del proyecto
bookpulse-proyect/
├── services/
│   ├── user-service/
│   ├── book-service/
│   └── review-service/
├── database/
│   └── scripts/        # scripts SQL de creación de tablas
├── docs/                # documentación del proyecto
├── frontend/            # interfaz de usuario (en desarrollo)
└── index.js
Cómo correrlo localmente
bash
# Clonar el repositorio
git clone https://github.com/BarbaraGaranton/bookpulse-proyect.git
cd bookpulse-proyect

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# completar .env con tus credenciales de MySQL

# Levantar el servidor
node index.js
📌 Estado del proyecto

Backend funcional. El frontend está en desarrollo. Próximos pasos: completar la interfaz de usuario y sumar tests 
automatizados con Playwright.
Autora
Bárbara Garantón — QA Tester LinkedIn · barbaragaranton1@gmail.com
