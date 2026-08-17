// Traigo la lógica del bookService para usarla acá
const bookService = require('../services/bookService');

// Esta función recibe el request cuando alguien hace POST /books
// Su trabajo es agarrar los datos, pasárselos al service y devolver la respuesta
const postBook = (req, res) => {

    // Desestructuro los datos que me mandan en el body del request
    // Por ejemplo desde Postman o desde el formulario del frontend
    const { book_title, author, genre } = req.body;

    // Le paso los datos al service para que busque o cree el libro
    bookService.findOrCreateBook(book_title, author, genre, (err, book) => {
        
        // Si algo salió mal le aviso al cliente con un error 500
        if (err) return res.status(500).json({ error: 'Error con el libro' });

        // Si todo salió bien devuelvo el libro en formato JSON
        res.json(book);
    });
};

// Exporto la función para que las rutas puedan usarla
module.exports = { postBook };