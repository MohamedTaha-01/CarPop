const express = require('express');
const session = require('express-session');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { findById } = require('../modelo/Anuncio');
require('dotenv').config();

// importar modelos anuncio y usuario
const Anuncio = require('../modelo/Anuncio');
const Usuario = require('../modelo/Usuario');

let autorizado;
let usuario;

const isAuth = (req, res, next) => {

    if(req.session.isAuth){
        next();
    } else {
        res.redirect("/iniciar_sesion");
    }
}
const isAuthRechazar = (req, res, next) => {

    if(req.session.isAuth){
        res.redirect("/");
    } else {
        next();
    }
}

/**
 * * ROUTING Y SESIONES
 */

router.get('/', (req,res) => {

    if (req.session.isAuth) {
        autorizado = true;
        usuario = req.session.usuario;
    } else {
        autorizado = false;
        usuario = null;
    }
    res.status(200).render('index', {autorizado, usuario});
});

router.get('/registrarse', isAuthRechazar, (req, res)=>{

    res.status(200).render("registrarse");
});

router.post('/registrarse', [
    check('nombre', 'El nombre no puede estar vacío').trim().notEmpty(),
    check('apellido', 'El apellido no puede estar vacío').trim().notEmpty(),
    check('correo', 'Correo no válido').escape().isEmail().notEmpty().custom(async (correo) => {
        const correoExiste = await Usuario.findOne({ correo })
        if (correoExiste) {
            throw new Error('El correo introducido ya está en uso')
        }
    }),
    check('contrasena', 'Contraseña no válida').escape().notEmpty(),
    check('telefono', 'Teléfono no válido').isMobilePhone(['es-ES']),
    check('direccion', 'La dirección no puede estar vacía').trim().notEmpty()
], async(req, res)=>{
    
    const erroresVal = validationResult(req);

    if (!erroresVal.isEmpty()) {

        // si hay errores validacion enviar un json con los errores
        console.log(erroresVal);
        return res.status(422).json({erroresVal: erroresVal.array()});

    } else { // si no hay errores validacion continuar

        const body = req.body;

        let user = { // crear usuario con los datos recogidos
            nombre: body.nombre,
            apellido: body.apellido,
            correo: body.correo,
            contrasena: body.contrasena,
            telefono: body.telefono,
            direccion: body.direccion,
            admin: false
        };

        try { // introducir usuario creado en BBDD
            const usuarioDB = new Usuario(user);
            await usuarioDB.save();
            res.redirect('/iniciar_sesion');
        } catch (error) {
            console.log(error);
        }

    }
});

router.get('/iniciar_sesion', isAuthRechazar, (req, res)=>{

    res.status(200).render("iniciar_sesion");
});

router.post('/iniciar_sesion', [
    check('correo', 'Correo no válido').escape().isEmail().notEmpty(),
    check('contrasena', 'Contraseña no válida').escape().notEmpty(),
], async(req, res)=>{

    const erroresVal = validationResult(req);
    const body = req.body;

    if (!erroresVal.isEmpty()) {

        console.log(erroresVal);
        return res.status(422).json({erroresVal: erroresVal.array()});

    } else {

        const user = await Usuario.findOne({ correo: body.correo });
        
        if (!user){

            return res.status(400).json({ ejecutado: false, mensaje: "No existe ningún usuario registrado con el correo proporcionado" });

        } else {
            if (user.contrasena!=body.contrasena){

                return res.status(400).json({ ejecutado: false, mensaje: "Contraseña incorrecta" });

            } else {

                // res.json({
                //     ejecutado: true,
                //     data: {
                //         mensaje: "Login correctamente",
                //         Usuario: user
                //     },
                // })

                // autorizamos sesion y guardamos el id del usuario autorizado
                req.session.isAuth = true;
                try {
                    req.session.usuario = await Usuario.findById(user._id.toString());
                } catch (error) {
                    
                }
                res.redirect("/");
            }
        }
    }
})

router.get('/cerrar_sesion', (req, res)=>{

    req.session.destroy((err)=>{
        if (err) {
            throw err;
        }
        res.redirect('/');
    })
})


// mostrar anuncios
router.get('/alquilar', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuario = req.session.usuario;
    } else {
        autorizado = false;
        usuario = null;
    }

    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayAnuncios = await Anuncio.find(); // encuentra la coleccion anuncios
        res.status(200).render("alquilar", {usuarios: arrayUsuarios, anuncios: arrayAnuncios, autorizado, usuario});
    } catch (error) {
        console.log(error);
        res.render("alquilar", error, autorizado, usuario);
    } 
});

module.exports = router;