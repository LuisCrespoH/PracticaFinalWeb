const express = require("express");
const router = express.Router();
const { crearAlbaran, listaAlbaranes, mostrarAlbaran } = require("../controllers/deliverynote");
const authMiddleware = require("../middleware/session");
const validarAlbaran = require("../validators/deliverynote");

router.post("/", authMiddleware, validarAlbaran, crearAlbaran);
router.get("/", authMiddleware, listaAlbaranes);
router.get('/:id', authMiddleware, mostrarAlbaran);



module.exports = router;