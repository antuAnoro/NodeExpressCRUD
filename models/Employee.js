var mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
  nif: { type: String, unique: true },
  nombre: String,
  direccion: String,
  categoria: String,
  salario: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
