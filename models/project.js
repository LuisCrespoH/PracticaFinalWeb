const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  projectCode: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    number: { type: Number, required: true },
    postal: { type: Number, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true }
  },
  code: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Activar soft delete
projectSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Project', projectSchema);
