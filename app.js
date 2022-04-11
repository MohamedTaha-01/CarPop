const express = require('express');
const ruta = require('./rutas');
const mongoose = require('mongoose');

const app = express();
const puerto = process.env.PORT || 5000;

// establecer ruta plantillas ejs y motor de render
app.set('view engine', 'ejs');
app.set('/vista', express.static(__dirname + '/vista'));

// cargar recursos public
app.use('/public', express.static(__dirname + '/public'));

app.use('/', ruta);

/**
 * *Mongoose
 */
mongoose.connect("mongodb+srv://admin:Njuy23.@cluster0.8vyfx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(()=>{
    console.log("conectado a BBDD");
})
.catch(()=>{
    console.error("error conexion a BBDD");
});

app.listen(puerto, () => {

    console.log("escuchando");
})