const Project = require('../models/project');
const Cliente = require('../models/client');

const crearProyecto = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      projectCode,
      email,
      address,
      code,
      clientId
    } = req.body;

    // Verificar si el cliente existe
    const cliente = await Cliente.findById(clientId);
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    // Comprobar si ya existe un proyecto con el mismo projectCode para este usuario y cliente
    const proyectoExistente = await Project.findOne({ projectCode, userId, clientId });
    if (proyectoExistente) {
      return res.status(400).json({ msg: 'Ya existe un proyecto con este código para este usuario y cliente' });
    }

    // Crear el nuevo proyecto
    const nuevoProyecto = new Project({
      name,
      projectCode,
      email,
      address,
      code,
      userId,
      clientId
    });

    const proyectoGuardado = await nuevoProyecto.save();

    // Respuesta exitosa
    res.status(201).json({
      userId: proyectoGuardado.userId,
      clientId: proyectoGuardado.clientId,
      name: proyectoGuardado.name,
      code: proyectoGuardado.code,
      _id: proyectoGuardado._id,
      createdAt: proyectoGuardado.createdAt,
      updatedAt: proyectoGuardado.updatedAt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el proyecto' });
  }
};
const actualizarProyecto = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
  
      // Busca el proyecto por ID y que pertenezca al usuario autenticado
      const proyecto = await Project.findOne({ _id: id, userId });
  
      if (!proyecto) {
        return res.status(404).json({ msg: 'Proyecto no encontrado o no autorizado' });
      }
  
      // Actualiza campos
      Object.assign(proyecto, req.body);
  
      const proyectoActualizado = await proyecto.save();
      res.status(200).json(proyectoActualizado);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar el proyecto' });
    }
};
const getAllProjects = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const proyectos = await Project.find({ userId });
      res.status(200).json(proyectos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener los proyectos' });
    }
};
  
  const getProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
  
      const proyecto = await Project.findOne({ _id: id, userId });
  
      if (!proyecto) {
        return res.status(404).json({ msg: 'Proyecto no encontrado o no autorizado' });
      }
  
      res.status(200).json(proyecto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener el proyecto' });
    }
};
const archivarProyecto = async (req, res) => {
    try {
      const { id } = req.params;
      const proyecto = await Project.delete({ _id: id });
      res.status(200).json({ msg: 'Proyecto archivado correctamente' });
    } catch (error) {
      res.status(500).json({ msg: 'Error al archivar el proyecto' });
    }
};
const eliminarProyecto = async (req, res) => {
    try {
      const { id } = req.params;
      await Project.deleteOne({ _id: id });
      res.status(200).json({ msg: 'Proyecto eliminado permanentemente' });
    } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar el proyecto' });
    }
};
  const listarProyectosArchivados = async (req, res) => {
    try {
      const userId = req.user.id; // Asumimos que `authMiddleware` mete el usuario en req.user
      const proyectosArchivados = await Project.findDeleted({ userId });
      res.status(200).json(proyectosArchivados);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener los proyectos archivados' });
    }
};
const restaurarProyecto = async (req, res) => {
    try {
      const { id } = req.params;
      await Project.restore({ _id: id });
      res.status(200).json({ msg: 'Proyecto restaurado correctamente' });
    } catch (error) {
      res.status(500).json({ msg: 'Error al restaurar el proyecto' });
    }
};
module.exports = {crearProyecto, actualizarProyecto, getAllProjects, getProjectById, archivarProyecto, eliminarProyecto, listarProyectosArchivados, restaurarProyecto};