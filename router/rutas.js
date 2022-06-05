const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { findById } = require('../modelo/Anuncio');
require('dotenv').config();
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPESECRET);
const endpointSecret = process.env.STRIPEWHSECRET;
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRIDKEY)

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
router.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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
    check('nombre', 'El campo nombre no puede estar vacío').trim().notEmpty(),
    check('apellido', 'El campo apellido no puede estar vacío').trim().notEmpty(),
    check('correo', 'El correo no es un correo válido o ya está en uso').escape().isEmail().notEmpty().custom(async (correo) => {
        const correoExiste = await Usuario.findOne({ correo })
        if (correoExiste) {
            throw new Error('El correo introducido ya está en uso')
        }
    }),
    check('contrasena', 'El campo contraseña no puede estar vacío').escape().notEmpty(),
    check('telefono', 'El teléfono introducido no es válido').isMobilePhone(['es-ES']),
    check('direccion', 'El campo dirección no puede estar vacío').trim().notEmpty()
], async(req, res)=>{
    
    const erroresVal = validationResult(req);
    var stringErrores = erroresVal.errors.map(function(error) {
        return " "+error['msg'];
    });

    if (!erroresVal.isEmpty()) {

        res.status(422).json({ estado: false, mensaje: stringErrores});

    } else {

        const body = req.body;

        let user = {
            nombre: body.nombre,
            apellido: body.apellido,
            correo: body.correo,
            contrasena: body.contrasena.trim(),
            telefono: body.telefono,
            direccion: body.direccion,
            admin: false
        };

        try { // encriptar contrasena e introducir usuario creado en BBDD, mandar correo de bienvenida
            const salt = await bcrypt.genSalt();
            user.contrasena = await bcrypt.hash(user.contrasena, salt);

            const usuarioDB = new Usuario(user);
            await usuarioDB.save();

            sgMail.send({
                to: user.correo,
                from: 'carpop531@gmail.com',
                templateId: "d-ad8f70443ae54daba1b7005b2e49417c",
                dynamicTemplateData: {
                    name: user.nombre,
                }
            }).then(() => {
                console.log('Email de registro enviado');
            }).catch((error) => {
                console.error(error);
            })

            res.status(200).redirect('/iniciar_sesion');

        } catch (error) {
            res.status(500).json({ estado: false, mensaje: error});
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
    var stringErrores = erroresVal.errors.map(function(error) {
        return " "+error['msg'];
    });
    const body = req.body;

    if (!erroresVal.isEmpty()) {

        res.status(422).json({estado: false, mensaje: stringErrores});

    } else {

        const user = await Usuario.findOne({ correo: body.correo });
        
        if (!user){

            res.status(422).json({ estado: false, mensaje: "No existe ningún usuario registrado con el correo proporcionado" });

        } else {
            
            if (await bcrypt.compare(body.contrasena, user.contrasena)){

                // autorizamos sesion y guardamos el id del usuario autorizado
                req.session.isAuth = true;
                try {
                    req.session.usuarioAutentificado = await Usuario.findById(user._id.toString());
                    res.status(200).json({ estado: true });
                } catch (error) {
                    console.log(error);
                }

            } else {
                res.status(422).json({ estado: false, mensaje: "Contraseña incorrecta" });
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

    let filtro = {};
    if(req.query.combustible){
        filtro['combustible'] = req.query.combustible;
    }
    if(req.query.transmision){
        filtro['transmision'] = req.query.transmision;
    }
    let precios = {};
    if(req.query.preciomin){
        precios['$gt'] = parseInt(req.query.preciomin);
    }
    if(req.query.preciomax){
        precios['$lt'] = parseInt(req.query.preciomax)+1;
    }
    if (req.query.preciomin || req.query.preciomax) {
        filtro['precio'] = precios;
    }

    try {
        const arrayUsuarios = await Usuario.find();
        const arrayAnuncios = await Anuncio.find(filtro);
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

router.post('/anuncios/reservar/:id_anuncio', async(req,res)=>{

    const {product} = req.body;

    let fechas = product.description.split(",");
    function treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }
    function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return ((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay)+1;
    }

    try {

        const anuncioDB = await Anuncio.findById(req.params.id_anuncio);
        const diasTotal = daysBetween(fechas[0], fechas[1]);
        let precioTotal = diasTotal*anuncioDB.precio;
        if (diasTotal>=7) {
            var descuento = precioTotal*0.10;
            precioTotal = precioTotal-descuento;
            var descripcion = `Precio por día: ${anuncioDB.precio}€ | Días totales:${diasTotal} días | Descuento: ${descuento.toFixed(2)}€ (10%) | TOTAL A PAGAR: ${precioTotal}€`;
        } else {
            var descripcion = `Precio por día: ${anuncioDB.precio}€ | Días totales:${diasTotal} días | TOTAL A PAGAR: ${precioTotal}€`;
            var descuento = 0;
        }
        

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.session.usuarioAutentificado.correo,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: product.name,
                            description: descripcion
                        },
                        unit_amount: precioTotal*100
                    },
                    quantity: product.quantity
                }
            ],
            mode: 'payment',
            success_url: `http://localhost:5000/reservar/correcta`,
            cancel_url: `http://localhost:5000/reservar/cancelada`
        })

        sgMail.send({
            to: req.session.usuarioAutentificado.correo,
            from: 'carpop531@gmail.com',
            templateId: "d-8ee95e9d58ef4220b0882ab56222a3f0",
            dynamicTemplateData: {
                tituloanuncio: product.name,
                resdesde: new Date(fechas[0]).toLocaleDateString('es-ES'),
                reshasta: new Date(fechas[1]).toLocaleDateString('es-ES'),
                resdias: diasTotal,
                preciodia: anuncioDB.precio,
                descuento: descuento.toFixed(2),
                preciototal: precioTotal
            }
        }).then(() => {
            console.log('Email de reserva enviado');
        }).catch((error) => {
            console.error(error);
        })
    
        res.json({id: stripeSession.id});

    } catch (error) {
        console.log(error);
    }
    
});

router.post('/reservabbdd', async(req, res) => {
    const {reservaDB} = req.body;
    try {
        const reserva = new Reserva(reservaDB);
        await reserva.save();
    } catch (error) {
        console.log(error);
    }
})

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            console.log("Creating order", session);
            if (session.payment_status === 'paid') {
                console.log("Fulfilling order", session);
            }
            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;
            console.log("Fulfilling order", session);
            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;
            console.log("Emailing customer", session);
            break;
        }
    }

    response.status(200);
});

router.get('/reservar/correcta', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    res.status(200).render('correcta.ejs');
})

router.get('/reservar/cancelada', isAuth, async (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    res.status(400).render('cancelada.ejs');
})


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

// router.get('/perfiles/:id_usuario', isAuth, async (req, res)=>{

//     if (req.session.isAuth) {
//         autorizado = true;
//         usuarioAutentificado = req.session.usuarioAutentificado;
//     } else {
//         autorizado = false;
//         usuarioAutentificado = null;
//     }

//     const id_usuario = req.params.id_usuario;
//     try {
//         const usuarioDB = await Usuario.findById(id_usuario);
//         res.render("perfil", {
//             usuario: usuarioDB, 
//             error: false,
//             autorizado,
//             usuarioAutentificado
//         });
//     } catch (e) {
//         res.render("perfil", {
//             error: true, 
//             mensaje: "No se ha encontrado el anuncio especificado",
//             autorizado, 
//             usuarioAutentificado
//         });
//     }
// });

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
    check('telefono', 'Teléfono no válido').isMobilePhone(['es-ES']),
    check('direccion', 'La dirección no puede estar vacía').trim().notEmpty()
], async(req, res)=>{

    const id_usuario = req.params.id_usuario;
    const erroresVal = validationResult(req);
    var stringErrores = erroresVal.errors.map(function(error) {
        return " "+error['msg'];
    });
    
    if (!erroresVal.isEmpty()) {
        
        return res.status(422).json({estado: false, mensaje: stringErrores});
        
    } else {
        
        try {
            const body = req.body;
            const anuncioDB = await Usuario.findByIdAndUpdate({ _id: id_usuario }, body, {useFindAndModify: false});
            res.status(200).json({
                estado: true,
                mensaje: 'Se han modificado los datos del usuario'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                estado: false,
                mensaje: error.toString()
            });
        }
        
    }
})

router.post('/perfiles/:id_usuario/contrasena', [
    check('contrasena', 'Contraseña no válida').escape().notEmpty()
], async(req, res)=>{

    const id_usuario = req.params.id_usuario;
    const erroresVal = validationResult(req);
    var stringErrores = erroresVal.errors.map(function(error) {
        return " "+error['msg'];
    });

    if (!erroresVal.isEmpty()) {

        res.status(422).json({ estado: false, mensaje: stringErrores});
        
    } else {
        
        try {

            const salt = await bcrypt.genSalt();
            req.body.contrasena = await bcrypt.hash(req.body.contrasena, salt);

            const body = req.body;
            const anuncioDB = await Usuario.findByIdAndUpdate({ _id: id_usuario }, body, {useFindAndModify: false});
            res.json({
                estado: true,
                mensaje: 'Se ha modificado la contraseña'
            });
        } catch (error) {
            console.log(error);
            res.json({
                estado: false,
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

router.get('/funciona', (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    res.status(200).render('funciona', {autorizado, usuarioAutentificado});
})
router.get('/normas', (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    res.status(200).render('normas', {autorizado, usuarioAutentificado});
})
router.get('/preguntas', (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    res.status(200).render('preguntas', {autorizado, usuarioAutentificado});
})
router.get('/contacto', (req, res)=>{

    if (req.session.isAuth) {
        autorizado = true;
        usuarioAutentificado = req.session.usuarioAutentificado;
    } else {
        autorizado = false;
        usuarioAutentificado = null;
    }

    res.status(200).render('contacto', {autorizado, usuarioAutentificado});
})

module.exports = router;