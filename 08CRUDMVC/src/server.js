const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PUERTO = 3000;

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apuntamos correctamente a la raíz subiendo un nivel con '..'
app.use(express.static(path.join(__dirname, '..', 'public')));

const usuariosRouter = require('./Routers/usuarios');
const productosRouter = require('./Routers/productos');
const comprasRouter = require('./Routers/compras');
const personajesRouter = require('./Routers/personajes');

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/personajes', personajesRouter);

app.use('/api/:comodin', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `La ruta de la API [${req.method}] ${req.originalUrl} no ha sido encontrada.`
    });
});

app.get('/:navegacion', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PUERTO, () => {
    console.log(`====================================================`);
    console.log(` Servidor de la Práctica 3 corriendo en el puerto ${PUERTO}`);
    console.log(` URL base de la API: http://localhost:${PUERTO}/api`);
    console.log(`====================================================`);
});