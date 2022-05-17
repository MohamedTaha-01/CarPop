const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
require('dotenv').config();

// importar modelos anuncio y usuario
const Anuncio = require('../modelo/Anuncio');
const Usuario = require('../modelo/Usuario');

/**
 * * ROUTING Y SESIONES
 */

router.get('/', (req,res) => {

    res.status(200).render('index');
});

router.get('/registrarse', (req, res)=>{

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
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }

    }
});

router.get('/iniciar_sesion', (req, res)=>{

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

                res.json({
                    ejecutado: true,
                    data: {
                        mensaje: "Login correctamente",
                        Usuario: user
                    },
                })
            }
        }
    }
})


// mostrar anuncios
router.get('/alquilar', async (req, res)=>{

    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayAnuncios = await Anuncio.find(); // encuentra la coleccion anuncios
        res.status(200).render("alquilar", {usuarios: arrayUsuarios, anuncios: arrayAnuncios});
        console.log(req.user);
    } catch (error) {
        console.log(error);
        res.render("alquilar", error);
    } 
});

module.exports = router;