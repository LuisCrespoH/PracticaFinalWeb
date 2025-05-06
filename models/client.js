const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const clienteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cif: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    number: { type: Number, required: true },
    postal: { type: Number, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true }
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  company: {
    name: { type: String },
    cif: { type: String },
    street: { type: String },
    number: { type: Number },
    postal: { type: Number },
    city: { type: String },
    province: { type: String },
    url: { type: String },
    logo: { type: String }
  }
}, {
  timestamps: true,
  versionKey: false
});

// 🔹 Plugin para soft delete con timestamp
clienteSchema.plugin(mongooseDelete, {
  deletedAt: true,        // Marca la fecha de borrado
  overrideMethods: 'all'  // Para que find(), findOne(), etc. ignoren los eliminados
});

module.exports = mongoose.model('Cliente', clienteSchema);