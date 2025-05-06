const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const deliveryNoteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  format: { type: String, enum: ["material", "hours"], required: true },
  material: { type: String }, // solo si format === material
  hours: { type: Number }, // solo si format === hours
  description: { type: String },
  workdate: { type: Date, required: true },
  sign: { type: String, default: "" },
  pdf: { type: String, default: "" },
  pending: { type: Boolean, default: true }
}, {
  timestamps: true,
  versionKey: false
});

deliveryNoteSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model("DeliveryNote", deliveryNoteSchema);