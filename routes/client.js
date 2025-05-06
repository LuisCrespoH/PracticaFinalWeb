const express = require('express');
const router = express.Router();
const {crearCliente, actualizarCliente, obtenerClientes, obtenerClientePorId} = require('../controllers/client');
const authMiddleware = require("../middleware/session");
const { crearClienteValidator } = require('../validators/client');

router.post('/', authMiddleware, crearClienteValidator, crearCliente);
router.put('/:id', authMiddleware, crearClienteValidator, actualizarCliente);
router.get('/', authMiddleware, obtenerClientes);
router.get('/:id', authMiddleware, obtenerClientePorId);

module.exports = router;