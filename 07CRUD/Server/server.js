require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const app = express();

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const db = pool.promise();

app.use(cors()); 
app.use(express.json()); 

app.get('/api/usuarios', async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM usuarios ORDER BY id DESC');
        res.json(filas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios de la base de datos' });
    }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const { nombre, fecha_nacimiento, nota } = req.body;

        if (!nombre || !fecha_nacimiento || nota === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const query = 'INSERT INTO usuarios (nombre, fecha_nacimiento, nota) VALUES (?, ?, ?)';
        const [resultado] = await db.query(query, [nombre, fecha_nacimiento, nota]);

        res.status(201).json({ id: resultado.insertId, nombre, fecha_nacimiento, nota });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al insertar usuario en la base de datos' });
    }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM usuarios WHERE id = ?';
        await db.query(query, [id]);

        res.json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, fecha_nacimiento, nota } = req.body;

        if (!nombre || !fecha_nacimiento || nota === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const query = 'UPDATE usuarios SET nombre = ?, fecha_nacimiento = ?, nota = ? WHERE id = ?';
        await db.query(query, [nombre, fecha_nacimiento, nota, id]);

        res.json({ id, nombre, fecha_nacimiento, nota });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario en la base de datos' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../')));

app.use((req, res) => {
    res.status(404).json({ error: `La ruta ${req.originalUrl} con el método ${req.method} no existe en este servidor.` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo con éxito en http://localhost:${PORT}`);
    console.log('Para salir presiona Ctrl + C');
});