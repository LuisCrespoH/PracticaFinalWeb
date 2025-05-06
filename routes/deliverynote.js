const express = require("express");
const router = express.Router();
const { crearAlbaran, listaAlbaranes, mostrarAlbaran, generarPdfAlbaran } = require("../controllers/deliverynote");
const authMiddleware = require("../middleware/session");
const validarAlbaran = require("../validators/deliverynote");

router.post("/", authMiddleware, validarAlbaran, crearAlbaran);
router.get("/", authMiddleware, listaAlbaranes);
router.get('/:id', authMiddleware, mostrarAlbaran);
router.get('/pdf/:id', authMiddleware, generarPdfAlbaran);



module.exports = router;