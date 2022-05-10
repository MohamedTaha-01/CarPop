const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    correo: String,
    contrasena: String,
    telefono: String,
    direccion: String,
    admin: Boolean
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;