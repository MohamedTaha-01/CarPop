const express = require('express');
const ruta = require('./rutas');
const mongoose = require('mongoose');

const app = express();
const puerto = process.env.PORT || 5000;

/**
 * * Middleware
 * cargar recursos public
 * establecer render para ejs
 * cargar html y ejs 
 */
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
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