const express = require('express');
const router = express.Router();
const {crearCliente} = require('../controllers/client');
const authMiddleware = require("../middleware/session");
const { crearClienteValidator } = require('../validators/client');

router.post('/', authMiddleware, crearClienteValidator, crearCliente);

module.exports = router;