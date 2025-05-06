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

module.exports = {crearCliente, actualizarCliente};