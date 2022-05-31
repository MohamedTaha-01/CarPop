const express = require('express');
const session = require('express-session');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { findById } = require('../modelo/Anuncio');
require('dotenv').config();

// importar modelos anuncio y usuario
const Anuncio = require('../modelo/Anuncio');
const Usuario = require('../modelo/Usuario');
const Reserva = require('../modelo/Reserva');

let autorizado;
let usuarioAutentificado;

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
 * * ROUTING -------------------------------------------------------------------------------------
 */

router.get('/', async(req,res) => {

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    try {
        const arrayAnuncios = await Anuncio.find();
        res.status(200).render('index', {
        autorizado,
        usuarioAutentificado, 
        arrayAnuncios});
    } catch (error) {
        res.status(200).render('index', {
        autorizado,
        usuarioAutentificado, 
        arrayAnuncios: false});
    }
    
});

//* Sesiones //

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

                // autorizamos sesion y guardamos el id del usuario autorizado
                req.session.isAuth = true;
                try {
                    req.session.usuarioAutentificado = await Usuario.findById(user._id.toString());
                } catch (error) {
                    console.log(error);
                }
                res.redirect("back");
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

//* Anuncios //

router.get('/anuncios', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayAnuncios = await Anuncio.find(); // encuentra la coleccion anuncios
        res.status(200).render("anuncios", {usuarios: arrayUsuarios, anuncios: arrayAnuncios, autorizado, usuarioAutentificado});
    } catch (error) {
        console.log(error);
        res.render("anuncios", error, autorizado, usuarioAutentificado);
    } 
});

router.get('/anuncios/:id_anuncio', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    const id_anuncio = req.params.id_anuncio;
    try {
        const anuncioDB = await Anuncio.findById(id_anuncio);
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayReservas = await Reserva.find({id_anuncio: id_anuncio});
        res.render("anuncio", {
            anuncio: anuncioDB,
            usuarios: arrayUsuarios,
            reservas: arrayReservas,
            error: false,
            autorizado, 
            usuarioAutentificado
        });
    } catch (e) {
        res.render("anuncio", {
            error: true, 
            mensaje: "No se ha encontrado el anuncio especificado",
            autorizado, 
            usuarioAutentificado
        });
    }
});

router.get('/anuncios/editar/:id_anuncio', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    const id_anuncio = req.params.id_anuncio;
    try {
        const anuncioDB = await Anuncio.findById(id_anuncio); // encuentra el anuncio con esa id
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        res.render("editar_anuncio", {
            anuncio: anuncioDB, 
            usuarios: arrayUsuarios,
            error: false,
            autorizado, 
            usuarioAutentificado
        });
    } catch (e) {
        res.render("editar_anuncio", {
            error: true, 
            mensaje: "No se ha encontrado el anuncio especificado",
            autorizado, 
            usuarioAutentificado
        });
    }
});

router.post('/anuncios/reservar', async(req,res)=>{

    req.body.reservar_fecha1 = new Date(req.body.reservar_fecha1);
    req.body.reservar_fecha2 = new Date(req.body.reservar_fecha2);

    let reserva = {
        id_anuncio: req.body.reservar_id_anuncio,
        id_usuario: req.body.reservar_id_usuario,
        fecha1: req.body.reservar_fecha1,
        fecha2: req.body.reservar_fecha2,
        reservado: new Date()
    };

    try { //! falta mandar respuesta al cliente y validar en cliente y servidor
        const reservaDB = new Reserva(reserva);
        await reservaDB.save();
        res.status(200).send({
            error: false,
            mensaje: "reserva correcta"
        })
        console.log("reserva correcta");
    } catch (error) {
        res.status(422).send({
            error: error
        })
    }
});

router.get('/crear_anuncio', isAuth, async(req,res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }
    res.status(200).render("crear_anuncio", {autorizado, usuarioAutentificado});

});
router.post('/crear_anuncio', [
    // Validación servidor
    // ! falta validar imágen
    check('titulo', 'Título no válido').trim().escape().isLength({ min: 3, max:50}),
    check('descripcion', 'Descripción no válida').trim().escape().isLength({ min: 3, max:300}),
    check('matricula', 'Matrícula no válida').matches(/^\d{4}[A-Z]{3}$/).custom(async (matricula) => {
        const matriculaExiste = await Anuncio.findOne({ matricula })
        if (matriculaExiste) {
            throw new Error('La matrícula ya está en uso')
        }
    }),
    check('combustible', 'Tipo de combustible no válido').isIn(['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido']),
    check('transmision', 'Tipo de transmisión no válido').isIn(['Manual', 'Automático']),
    check('precio', 'Precio no válido').isInt({ gt: 0, lt:1000})
], async(req,res)=>{

    const erroresVal = validationResult(req);
    if (!erroresVal.isEmpty()) {
        // si hay errores enviar un json con los errores
        console.log(erroresVal);
        return res.status(422).json({erroresVal: erroresVal.array()});
    } else {
        // si no hay errores crear anuncio
        req.body.id_usuario = req.session.usuarioAutentificado._id; // asignar el id del usuario autentificado en la sesión
        req.body.creado = new Date();
        const body = req.body;
        try {
            const anuncioDB = new Anuncio(body);
            await anuncioDB.save();
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
});

//* Perfiles //

router.get('/perfiles/:id_usuario', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    const id_usuario = req.params.id_usuario;
    try {
        const usuarioDB = await Usuario.findById(id_usuario);
        res.render("perfil", {
            usuario: usuarioDB, 
            error: false,
            autorizado,
            usuarioAutentificado
        });
    } catch (e) {
        res.render("perfil", {
            error: true, 
            mensaje: "No se ha encontrado el anuncio especificado",
            autorizado, 
            usuarioAutentificado
        });
    }
});

router.get('/perfiles/:id_usuario/datos', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    const id_usuario = req.params.id_usuario;
    try {
        const usuarioDB = await Usuario.findById(id_usuario);
        res.render("perfil_datos", {
            usuario: usuarioDB, 
            error: false,
            autorizado,
            usuarioAutentificado
        });
    } catch (e) {
        res.render("perfil_datos", {
            error: true, 
            mensaje: "No se ha encontrado el anuncio especificado",
            autorizado, 
            usuarioAutentificado
        });
    }
})

router.post('/perfiles/:id_usuario/datos', [
    check('nombre', 'El nombre no puede estar vacío').trim().notEmpty(),
    check('apellido', 'El apellido no puede estar vacío').trim().notEmpty(),
    check('correo', 'Correo no válido').escape().isEmail().notEmpty(),
    check('contrasena', 'Contraseña no válida').escape().notEmpty(),
    check('telefono', 'Teléfono no válido').isMobilePhone(['es-ES']),
    check('direccion', 'La dirección no puede estar vacía').trim().notEmpty()
], async(req, res)=>{

    const id_usuario = req.params.id_usuario;
    const erroresVal = validationResult(req);
    const body = req.body;

    if (!erroresVal.isEmpty()) {

        console.log(erroresVal);
        return res.status(422).json({erroresVal: erroresVal.array()});

    } else {

        try {
            const anuncioDB = await Usuario.findByIdAndUpdate({ _id: id_usuario }, body, {useFindAndModify: false});
            res.json({
                editado: true,
                mensaje: 'Se han modificado los datos del usuario'
            });
        } catch (error) {
            console.log(error);
            res.json({
                editado: false,
                mensaje: error.toString()
            });
        }
        
    }
})

router.get('/perfiles/:id_usuario/anuncios', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    const id_usuario = req.params.id_usuario;
    try {
        const usuarioDB = await Usuario.findById(id_usuario);
        const anuncioDB = await Anuncio.find({id_usuario: id_usuario});
        res.render("perfil_anuncios", {
            usuario: usuarioDB, 
            anuncios: anuncioDB,
            error: false,
            autorizado,
            usuarioAutentificado
        });
    } catch (e) {
        res.render("perfil_anuncios", {
            error: true, 
            mensaje: "No se ha encontrado el anuncio especificado",
            autorizado, 
            usuarioAutentificado
        });
    }
})

router.get('/perfiles/:id_usuario/reservas', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    const id_usuario = req.params.id_usuario;
    try {
        const usuarioDB = await Usuario.findById(id_usuario);
        const anuncioDB = await Anuncio.find();
        const arrayReservas = await Reserva.find({id_usuario: id_usuario});
        res.render("perfil_reservas", {
            usuario: usuarioDB, 
            anuncios: anuncioDB,
            reservas: arrayReservas,
            error: false,
            autorizado,
            usuarioAutentificado
        });
    } catch (e) {
        res.render("perfil_anuncios", {
            error: true, 
            mensaje: "No se han encontrado reservas",
            autorizado, 
            usuarioAutentificado
        });
    }
})

module.exports = router;