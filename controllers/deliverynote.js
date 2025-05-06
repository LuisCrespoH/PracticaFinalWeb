const DeliveryNote = require('../models/deliverynote');
const Cliente = require('../models/client');

const crearAlbaran = async (req, res) => {
  try {
    const { clientId, projectId, format, material, hours, description, workdate } = req.body;
    const userId = req.user._id; // token decodificado

    const cliente = await Cliente.findById(clientId);
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });

    if (cliente.usuario.toString() !== userId.toString()) {
      return res.status(403).json({ msg: 'No tienes permiso para crear un albarán para este cliente' });
    }

    const albaran = await DeliveryNote.create({
      userId,
      clientId,
      projectId,
      format,
      material,
      hours,
      description,
      workdate,
      sign: '/path/to/sign', // placeholder
      pdf: '/path/to/pdf',   // placeholder
      pending: true
    });

    res.status(201).json(albaran);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el albarán', error });
  }
};
const listaAlbaranes = async (req, res) => {
    try {
      const userId = req.user._id; // Lo que venga del token
      console.log("Usuario autenticado en listarAlbaranes:", req.user);
      // Buscar todos los albaranes que pertenezcan a este usuario
      const deliveryNotes = await DeliveryNote.find({ userId });
      console.log("Buscando albaranes para userId:", userId);
      console.log("Albaranes encontrados:", deliveryNotes);
      res.status(200).json(deliveryNotes);
    } catch (error) {
      console.error("Error al obtener los albaranes:", error);
      res.status(500).json({ message: "Error al obtener los albaranes" });
    }
};
module.exports = {crearAlbaran, listaAlbaranes};