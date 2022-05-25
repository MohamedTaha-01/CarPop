const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const app = express();

/**
 * * BODYPARSER parsea body para acceso a req.body ------------
 */
//  
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/**
 * * Variables de entorno -------------------------------------
 */
require('dotenv').config();

/**
 * * MongoDB --------------------------------------------------
 */

const puerto = process.env.PORT || 5000;

// conectar BBDD
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.8vyfx.mongodb.net/carpop?retryWrites=true&w=majority`)
.then(()=>{
    console.log("conectado a BBDD");
})
.catch(e=>{
    console.error("error conexion a BBDD: "+e);
});
// configuracion para guardar las sesiones en la BBDD
const store = new MongoDBSession({
    uri: `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.8vyfx.mongodb.net/carpop?retryWrites=true&w=majority`,
    collection: "sesiones",

});

// middleware que crea en el objeto request una session y lo guarda en la BBDD
app.use(session({
    secret: process.env.SECRET,
    resave: false, // no crear nueva sesion por cada request
    saveUninitialized: false, //no guardar sesiones vacías (no autentificadas, sin loguear)
    store: store
}))

/**
 * * EJS y Routers --------------------------------------------
 */

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
 * * Iniciar servidor -----------------------------------------
 */
app.listen(puerto, () => {

    console.log("escuchando");
})