const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservaSchema = new Schema({
    id_anuncio: String,
    id_usuario: String,
    fecha1: Date,
    fecha2: Date,
    reservado: Date
});

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;