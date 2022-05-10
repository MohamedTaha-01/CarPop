const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureIndexes } = require('../modelo/Anuncio');
require('dotenv').config();

// importar modelos anuncio y usuario
const Anuncio = require('../modelo/Anuncio');
const Usuario = require('../modelo/Usuario');

function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'});
}

function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'];
    if (!accessToken) res.send('Acceso denegado'); // comprueba si existe o no un accessToken
    else {
        jwt.verify(accessToken, process.env.SECRET, (err, user)=>{ // verifica el access token y recoge errores para mostrarlos
            if (err) {
                res.send('Acceso denegado, token expirado o incorrecto')
            } else {
                req.user = user;
                next();
            }
        });
    }
}

/**
 * * ROUTING
 */

router.get('/', (req,res) => {

    res.status(200).render('index');
});

router.get('/registrarse', (req, res)=>{

    res.status(200).render("registrarse");
});

router.post('/registrarse', async(req, res)=>{
    
    const body = req.body;
    
    //! validar datos
    //! consultar BBDD para ver si ya existe el correo, si existe detener proceso

    let user = {
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        contrasena: body.contrasena,
        telefono: body.telefono,
        direccion: body.direccion,
        admin: false
    };

    const accessToken = generateAccessToken(body.correo); // genera el token ligado al correo

    //! guardar token en bbdd o navegador...

    // crear usuario
    //const erroresVal = validationResult(req);
    //if (!erroresVal.isEmpty()) {
        // si hay errores enviar un json con los errores
        //console.log(erroresVal);
        //return res.status(422).json({erroresVal: erroresVal.array()});
    //} else {
        // si no hay errores crear usuario
        try {
            const usuarioDB = new Usuario(user);
            await usuarioDB.save();
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    //}

    //res.header('authorization', accessToken).json({ // manda respuesta en forma de json al cliente
        //mensaje: 'Usuario autentificado',
        //token: accessToken
    //});
});

// mostrar anuncios
router.get('/alquilar', validateToken, async (req, res)=>{

    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayAnuncios = await Anuncio.find(); // encuentra la coleccion anuncios
        res.status(200).render("alquilar", {usuarios: arrayUsuarios, anuncios: arrayAnuncios});
    } catch (error) {
        console.log(error);
        res.render("alquilar", error);
    } 
});

module.exports = router;