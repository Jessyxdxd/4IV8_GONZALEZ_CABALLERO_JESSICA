const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// RECURSO: CHICAS MÁGICAS
// ============================================================

// GET - Listar todas
router.get('/chicas', async (req, res) => {
    try {
        const [filas] = await db.execute('SELECT id, nombre, deseo, arma, foto FROM chicas_magicas');
        const mapeado = filas.map(f => ({
            id: f.id,
            nombre: f.nombre,
            deseo: f.deseo,
            arma: f.arma,
            foto: f.foto ? f.foto.toString('base64') : null
        }));
        res.json({ status: 'success', data: mapeado, count: mapeado.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET - Obtener una sola Chica por ID (Para cargar en el formulario al editar)
router.get('/chicas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [filas] = await db.execute('SELECT id, nombre, deseo, arma, foto FROM chicas_magicas WHERE id = ?', [id]);
        if (filas.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Chica mágica no encontrada' });
        }
        const f = filas[0];
        res.json({
            status: 'success',
            data: {
                id: f.id,
                nombre: f.nombre,
                deseo: f.deseo,
                arma: f.arma,
                foto: f.foto ? f.foto.toString('base64') : null
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST - Crear nueva Chica Mágica
router.post('/chicas', async (req, res) => {
    try {
        const { nombre, deseo, arma, foto } = req.body;
        if (!nombre || !deseo) {
            return res.status(400).json({ status: 'error', message: 'Nombre y deseo son obligatorios' });
        }
        const fotoBinaria = foto ? Buffer.from(foto, 'base64') : null;
        await db.execute(
            'INSERT INTO chicas_magicas (nombre, deseo, arma, foto) VALUES (?, ?, ?, ?)',
            [nombre, deseo, arma, fotoBinaria]
        );
        res.json({ status: 'success', message: 'Chica Mágica registrada correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT - Actualizar Chica Mágica
router.put('/chicas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, deseo, arma, foto } = req.body;

        if (!nombre || !deseo) {
            return res.status(400).json({ status: 'error', message: 'Nombre y deseo son obligatorios' });
        }

        // Si mandan una nueva foto se actualiza, si no, se conservan los campos de texto sin alterar la foto previa
        if (foto) {
            const fotoBinaria = Buffer.from(foto, 'base64');
            await db.execute(
                'UPDATE chicas_magicas SET nombre = ?, deseo = ?, arma = ?, foto = ? WHERE id = ?',
                [nombre, deseo, arma, fotoBinaria, id]
            );
        } else {
            await db.execute(
                'UPDATE chicas_magicas SET nombre = ?, deseo = ?, arma = ? WHERE id = ?',
                [nombre, deseo, arma, id]
            );
        }

        res.json({ status: 'success', message: 'Chica Mágica actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE - Eliminar Chica Mágica
router.delete('/chicas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM chicas_magicas WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Chica Mágica eliminada' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// ============================================================
// RECURSO: BRUJAS
// ============================================================

// GET - Listar todas
router.get('/brujas', async (req, res) => {
    try {
        const query = `
            SELECT b.id, b.nombre_bruja, b.naturaleza, b.foto, b.chica_id, c.nombre AS rival_nombre 
            FROM brujas b 
            LEFT JOIN chicas_magicas c ON b.chica_id = c.id
        `;
        const [filas] = await db.execute(query);
        const mapeado = filas.map(f => ({
            id: f.id,
            nombre_bruja: f.nombre_bruja,
            naturaleza: f.naturaleza,
            chica_id: f.chica_id,
            rival_nombre: f.rival_nombre || 'Ninguna (Libre)',
            foto: f.foto ? f.foto.toString('base64') : null
        }));
        res.json({ status: 'success', data: mapeado, count: mapeado.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET - Obtener una sola Bruja por ID
router.get('/brujas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [filas] = await db.execute('SELECT id, nombre_bruja, naturaleza, chica_id, foto FROM brujas WHERE id = ?', [id]);
        if (filas.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Bruja no encontrada' });
        }
        const f = filas[0];
        res.json({
            status: 'success',
            data: {
                id: f.id,
                nombre_bruja: f.nombre_bruja,
                naturaleza: f.naturaleza,
                chica_id: f.chica_id,
                foto: f.foto ? f.foto.toString('base64') : null
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST - Crear Bruja
router.post('/brujas', async (req, res) => {
    try {
        const { nombre_bruja, naturaleza, foto, chica_id } = req.body;
        if (!nombre_bruja) {
            return res.status(400).json({ status: 'error', message: 'El nombre de la bruja es obligatorio' });
        }
        const fotoBinaria = foto ? Buffer.from(foto, 'base64') : null;
        const rivalId = chica_id ? parseInt(chica_id) : null;
        await db.execute(
            'INSERT INTO brujas (nombre_bruja, naturaleza, foto, chica_id) VALUES (?, ?, ?, ?)',
            [nombre_bruja, naturaleza, fotoBinaria, rivalId]
        );
        res.json({ status: 'success', message: 'Bruja registrada correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT - Actualizar Bruja
router.put('/brujas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_bruja, naturaleza, foto, chica_id } = req.body;

        if (!nombre_bruja) {
            return res.status(400).json({ status: 'error', message: 'El nombre de la bruja es obligatorio' });
        }

        const rivalId = chica_id ? parseInt(chica_id) : null;

        if (foto) {
            const fotoBinaria = Buffer.from(foto, 'base64');
            await db.execute(
                'UPDATE brujas SET nombre_bruja = ?, naturaleza = ?, chica_id = ?, foto = ? WHERE id = ?',
                [nombre_bruja, naturaleza, rivalId, fotoBinaria, id]
            );
        } else {
            await db.execute(
                'UPDATE brujas SET nombre_bruja = ?, naturaleza = ?, chica_id = ? WHERE id = ?',
                [nombre_bruja, naturaleza, rivalId, id]
            );
        }

        res.json({ status: 'success', message: 'Bruja actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE - Eliminar Bruja
router.delete('/brujas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM brujas WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Bruja eliminada' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;