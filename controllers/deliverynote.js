const PDFDocument = require('pdfkit');
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
const mostrarAlbaran = async (req, res) => {
    try {
      const { id } = req.params;
  
      const albaran = await DeliveryNote.findById(id)
        .populate("userId", "name email") // puedes ajustar los campos
        .populate("clientId", "nombre cif")
        .populate("projectId", "name projectCode");
  
      if (!albaran) {
        return res.status(404).json({ msg: "Albarán no encontrado" });
      }
  
      res.status(200).json(albaran);
    } catch (error) {
      console.error("Error al mostrar el albarán:", error);
      res.status(500).json({ msg: "Error al mostrar el albarán" });
    }
};
const generarPdfAlbaran = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
  
      const albaran = await DeliveryNote.findById(id)
        .populate('userId', 'name email')
        .populate('clientId', 'nombre cif')
        .populate('projectId', 'name projectCode');
  
      if (!albaran) {
        return res.status(404).json({ msg: 'Albarán no encontrado' });
      }
  
      if (albaran.userId._id.toString() !== userId.toString()) {
        return res.status(403).json({ msg: 'No tienes permiso para ver este albarán' });
      }
  
      // Crear PDF
      const doc = new PDFDocument();
      let buffers = [];
  
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=albaran-${albaran._id}.pdf`);
        res.send(pdfData);
      });
  
      // Título
      doc.fontSize(20).text('ALBARÁN', { align: 'center' });
      doc.moveDown();
  
      // Usuario
      doc.fontSize(12).text(`Usuario: ${albaran.userId.name}`);
      doc.text(`Email: ${albaran.userId.email}`);
  
      // Cliente
      doc.moveDown().text(`Cliente: ${albaran.clientId.nombre}`);
      doc.text(`CIF: ${albaran.clientId.cif}`);
  
      // Proyecto
      doc.moveDown().text(`Proyecto: ${albaran.projectId.name}`);
      doc.text(`Código: ${albaran.projectId.projectCode}`);
  
      // Albarán
      doc.moveDown().text(`Formato: ${albaran.format}`);
      doc.text(`Descripción: ${albaran.description}`);
      doc.text(`Fecha de trabajo: ${new Date(albaran.workdate).toLocaleDateString()}`);
  
      if (albaran.format === 'hours') {
        doc.text(`Horas: ${albaran.hours}`);
      } else if (albaran.format === 'material') {
        doc.text(`Material: ${albaran.material}`);
      }
  
      // Firma si está
      if (albaran.sign) {
        doc.moveDown().text(`Firma: ${albaran.sign}`);
      }
  
      doc.end();
  
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).json({ msg: 'Error al generar el PDF' });
    }
};
module.exports = {crearAlbaran, listaAlbaranes, mostrarAlbaran, generarPdfAlbaran};