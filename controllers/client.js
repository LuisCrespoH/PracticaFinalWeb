const Cliente = require('../models/client');
const User = require('../models/users');

const crearCliente = async (req, res) => {
  try {
    const { name, cif, address } = req.body;
    const usuarioId = req.user.id;

    const usuario = await User.findById(usuarioId);

    if (!usuario || !usuario.company) {
      return res.status(400).json({ msg: 'El usuario no tiene una compañía asociada' });
    }

    // Verificar existencia de cliente con mismo nombre para el mismo usuario o misma compañía (por cif)
    const clienteExistente = await Cliente.findOne({
      name,
      $or: [
        { usuario: usuarioId },
        { 'company.cif': usuario.company.cif }
      ]
    });

    if (clienteExistente) {
      return res.status(400).json({ msg: 'El cliente ya existe para este usuario o compañía' });
    }

    const nuevoCliente = new Cliente({
      name,
      cif,
      address,
      usuario: usuarioId,
      company: usuario.company
    });

    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el cliente' });
  }
};
const actualizarCliente = async (req, res) => {
    try {
      const clienteId = req.params.id;
      const { name, cif, address } = req.body;
      const usuarioId = req.user.id;
  
      const usuario = await User.findById(usuarioId);
      if (!usuario || !usuario.company) {
        return res.status(400).json({ msg: 'El usuario no tiene una compañía asociada' });
      }
  
      const cliente = await Cliente.findById(clienteId);
  
      if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado' });
      }
  
      if (cliente.usuario.toString() !== usuarioId) {
        return res.status(403).json({ msg: 'No tienes permiso para modificar este cliente' });
      }
  
      cliente.name = name;
      cliente.cif = cif;
      cliente.address = address;
  
      await cliente.save();
  
      res.status(200).json(cliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar el cliente' });
    }
};
const obtenerClientes = async (req, res) => {
    try {
      const usuarioId = req.user.id;
      const usuario = await User.findById(usuarioId);
  
      if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
  
      // Buscar clientes creados por este usuario o por otros usuarios de su compañía
      let clientes;
  
      if (usuario.company && usuario.company.cif) {
        // Buscar todos los usuarios con mismo cif de compañía
        const usuariosMismaCompania = await User.find({ 'company.cif': usuario.company.cif }, '_id');
        const idsUsuarios = usuariosMismaCompania.map(u => u._id);
  
        clientes = await Cliente.find({ usuario: { $in: idsUsuarios } });
      } else {
        clientes = await Cliente.find({ usuario: usuarioId });
      }
  
      res.status(200).json(clientes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener los clientes' });
    }
};
const obtenerClientePorId = async (req, res) => {
    try {
      const usuarioId = req.user.id;
      const clienteId = req.params.id;
  
      const usuario = await User.findById(usuarioId);
      if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
  
      const cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado' });
      }
  
      // Verificamos si el cliente pertenece al usuario o a la misma compañía
      if (
        cliente.usuario.toString() !== usuarioId &&
        (!usuario.company || !usuario.company.cif)
      ) {
        return res.status(403).json({ msg: 'No tienes acceso a este cliente' });
      }
  
      if (cliente.usuario.toString() !== usuarioId && usuario.company?.cif) {
        const usuarioCliente = await User.findById(cliente.usuario);
        if (!usuarioCliente || usuarioCliente.company?.cif !== usuario.company.cif) {
          return res.status(403).json({ msg: 'No tienes acceso a este cliente' });
        }
      }
  
      res.status(200).json(cliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener el cliente' });
    }
};
const archivarCliente = async (req, res) => {
    try {
      const clienteId = req.params.id;
      const usuarioId = req.user.id;
  
      const cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado' });
      }
  
      if (cliente.usuario.toString() !== usuarioId) {
        return res.status(403).json({ msg: 'No tienes permiso para archivar este cliente' });
      }
  
      await cliente.delete(); // esto es soft delete con mongoose-delete
  
      res.status(200).json({ msg: 'Cliente archivado correctamente (soft delete)' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al archivar el cliente' });
    }
};
const eliminarCliente = async (req, res) => {
    try {
      const clienteId = req.params.id;
      const usuarioId = req.user.id;
  
      // Incluir también los clientes archivados
      const cliente = await Cliente.findOneWithDeleted({ _id: clienteId });
  
      if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado' });
      }
  
      if (cliente.usuario.toString() !== usuarioId) {
        return res.status(403).json({ msg: 'No tienes permiso para eliminar este cliente' });
      }
  
      // Hard delete usando deleteOne directamente
      await Cliente.deleteOne({ _id: clienteId });
  
      res.status(200).json({ msg: 'Cliente eliminado permanentemente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al eliminar el cliente' });
    }
};
const listarClientesArchivados = async (req, res) => {
    try {
      const usuarioId = req.user.id;
  
      // Obtener clientes archivados (soft deleted) usando findDeleted()
      const clientesArchivados = await Cliente.findDeleted({ usuario: usuarioId });
  
      res.status(200).json(clientesArchivados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener los clientes archivados' });
    }
  };
const restaurarCliente = async (req, res) => {
    try {
      const clienteId = req.params.id;
      const usuarioId = req.user.id;
  
      const cliente = await Cliente.findOneWithDeleted({ _id: clienteId });
  
      if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado' });
      }
  
      if (cliente.usuario.toString() !== usuarioId) {
        return res.status(403).json({ msg: 'No tienes permiso para restaurar este cliente' });
      }
  
      await cliente.restore();
  
      res.status(200).json({ msg: 'Cliente restaurado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al restaurar el cliente' });
    }
};

module.exports = {crearCliente, actualizarCliente, obtenerClientes, obtenerClientePorId, archivarCliente, eliminarCliente, restaurarCliente, listarClientesArchivados};