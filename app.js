const express = require('express');

const app = express();
const ruta = require('./rutas');

/**
 * * Middleware
 * cargar recursos public
 * cargar htmls 
 */
app.use('/public', express.static(__dirname + '/public'));
app.use('/', ruta);


app.listen(5000, () => {

    console.log("escuchando");
})