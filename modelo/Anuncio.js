const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anuncioSchema = new Schema({
    id_usuario: String,
    titulo: String,
    descripcion: String,
    img: String,
    matricula: String,
    marca: String,
    modelo: String,
    combustible: String,
    transmision: String,
    precio: Number,
    creado: Date
});

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;