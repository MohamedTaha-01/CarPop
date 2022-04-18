const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// BODYPARSER configurar para formularios y json
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// variables de entorno
require('dotenv').config();
const puerto = process.env.PORT || 5000;

// conexión BBDD
const mongoose = require('mongoose');

// establecer ruta plantillas ejs y motor de render
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// cargar recursos public
app.use(express.static(__dirname + '/public'));

// renderizar rutas a partir de las rutas / y /admin
app.use('/', require('./router/rutas'));
app.use('/admin', require('./router/rutas_admin'));

app.use((req, res, next) => {
    res.status(404).render("404");
})

/**
 * *Mongoose
 */
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.8vyfx.mongodb.net/carpop?retryWrites=true&w=majority`)
.then(()=>{
    console.log("conectado a BBDD");
})
.catch(e=>{
    console.error("error conexion a BBDD: "+e);
});

app.listen(puerto, () => {

    console.log("escuchando");
})