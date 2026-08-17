    //Importa y crea el servidor 
const express = require('express');
const app = express();

    //Conexion a la Base de datos
const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database: 'bookpulse'
});

db.connect(err =>{
    if(err){
        console.error('Error de conexion:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

    //Define el puerto
const PORT = 3000;

    //Permite que el servidor entienda datos en formato json
app.use(express.json());

    //ENDPOINT GET 
app.get('/', (req, res) => {
    res.send('BookPulse funcionando 💜');
});

    //ENDPOINT POST "Modificado"
app.post('/reviews', (req, res) => {
    const { user_id, book_id, review_text, emotion, rating, characters } = req.body;

    const query = `
    INSERT INTO reviews(user_id, book_id, review_text, emotion, rating)
    VALUES (?,?,?,?,?)
    `;

    db.query(query, [user_id, book_id, review_text, emotion, rating], (err,result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al guardar la review');
        }
    //    res.send('Review guardada en la base de datos');

    const reviewId = result.insertId;

    const charQuery = `
        INSERT INTO characters (review_id, character_name, character_type)
        VALUES ?
    `;

    const values = characters.map(c => [
        reviewId,
        c.name,
        c.type
    ]);

    db.query(charQuery, [values], (err2) => {
        if (err2) {
            console.error(err2);
            return res.status(500).send('Error al guardar personajes');
        }

        res.send('Review y personajes guardados 💜');
        });

    });
});

    //GET
app.get('/reviews', (req, res) => {
    db.query('SElECT * FROM reviews', (err, results) => {
        if(err) {
            console.error(err);
            return res.status (500).send('Eroor al obtener reviews');
        }

        res.json(results);
    });
});
    

    //Levanta el servidor
app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});



