const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { crearProyecto, actualizarProyecto, getAllProjects, getProjectById, archivarProyecto, eliminarProyecto, listarProyectosArchivados, restaurarProyecto } = require('../controllers/project');
const validateProject = require('../validators/project');

router.post('/', authMiddleware, validateProject, crearProyecto);
router.put('/:id', authMiddleware, actualizarProyecto);
router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProjectById);
router.delete('/soft/:id', authMiddleware, archivarProyecto);
router.delete('/:id', authMiddleware, eliminarProyecto);
router.get('/archived', authMiddleware, listarProyectosArchivados);
router.patch('/restore/:id', authMiddleware, restaurarProyecto);

module.exports = router;