const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  status: String
});

module.exports = mongoose.model('Tarefas', tarefaSchema);


