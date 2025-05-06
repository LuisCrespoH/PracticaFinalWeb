const express = require('express');
const router = express.Router();
const {crearCliente, actualizarCliente, obtenerClientes, obtenerClientePorId, archivarCliente, eliminarCliente, restaurarCliente, listarClientesArchivados} = require('../controllers/client');
const authMiddleware = require("../middleware/session");
const { crearClienteValidator } = require('../validators/client');

router.get('/archived', authMiddleware, listarClientesArchivados);
router.post('/', authMiddleware, crearClienteValidator, crearCliente);
router.put('/:id', authMiddleware, crearClienteValidator, actualizarCliente);
router.get('/', authMiddleware, obtenerClientes);
router.get('/:id', authMiddleware, obtenerClientePorId);
router.delete('/soft/:id', authMiddleware, archivarCliente);
router.delete('/:id', authMiddleware, eliminarCliente);
router.patch('/restore/:id', authMiddleware, restaurarCliente);

module.exports = router;