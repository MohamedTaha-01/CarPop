const datos={};
datos.anuncios = require('../modelo/anuncios.json');

const getAnuncios = (req, res) => {

    res.json(datos.anuncios);
}