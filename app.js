const express = require('express');

const app = express();
const ruta = require('./rutas');

/**
 * * Middleware
 * cargar recursos public
 * establecer render para ejs
 * cargar html y ejs 
 */
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use('/', ruta);

app.listen(5000, () => {

    console.log("escuchando");
})