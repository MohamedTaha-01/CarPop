const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

// importar modelos anuncio y usuario
const Anuncio = require('../modelo/Anuncio');
const Usuario = require('../modelo/Usuario');

const esAdmin = (req, res, next) => {

    if (req.session.isAuth) {
        let usuarioAutentificado = req.session.usuarioAutentificado;
        if (usuarioAutentificado.admin) {
            next();
        } else {
            res.status(403).render("403");
        }
    } else res.status(403).render("403");
}

router.get('/', esAdmin, (req, res)=>{

    res.render("admin");
});

//* ANUNCIOS ---------------------------------------------------------------------------------------------------
// mostrar anuncios
router.get('/anuncios', esAdmin, async (req, res)=>{

    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayAnuncios = await Anuncio.find(); // encuentra la coleccion anuncios
        res.render("admin_anuncios", {usuarios: arrayUsuarios, anuncios: arrayAnuncios});
    } catch (error) {
        console.log(error);
        res.render("admin_anuncios", error);
    }
    
});
// crear anuncio
router.get('/anuncios/crear', esAdmin, async(req, res)=>{
    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        res.render("admin_anuncios_c", {usuarios: arrayUsuarios});
    } catch (error) {
        console.log(error);
    }
    
});
router.post('/anuncios', [
    check('id_usuario', 'ID de usuario no válida').notEmpty().isLength({min: 12, max:50}),
    check('titulo', 'Título no válido').trim().escape().isLength({ min: 3, max:50}),
    check('descripcion', 'Descripción no válida').trim().escape().isLength({ min: 3, max:300}),
    check('matricula', 'Matrícula no válida').matches(/^\d{4}[A-Z]{3}$/).custom(async (matricula) => {
        const matriculaExiste = await Anuncio.findOne({ matricula })
        if (matriculaExiste) {
            throw new Error('La matrícula ya está en uso')
        }
    }),
    check('marca', 'Debes seleccionar una marca').trim().notEmpty(),
    check('modelo', 'Debes seleccionar un modelo').trim().notEmpty(),
    check('combustible', 'Tipo de combustible no válido').isIn(['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido']),
    check('transmision', 'Tipo de transmisión no válido').isIn(['Manual', 'Automático']),
    check('precio', 'Precio no válido').isInt({ gt: 0, lt:1000})
], async(req,res)=>{

    const erroresVal = validationResult(req);
    var stringErrores = erroresVal.errors.map(function(error) {
        return " "+error['msg'];
    });

    if (!erroresVal.isEmpty()) {
        
        return res.status(422).json({estado: false, mensaje: stringErrores});

    } else {
        
        req.body.creado = new Date();
        const body = req.body;
        try {
            const anuncioDB = new Anuncio(body);
            await anuncioDB.save();
            res.status(500).json({
                estado: true,
                mensaje: "Anuncio creado"
            });
        } catch (error) {
            res.status(500).json({
                estado: false,
                mensaje: 'Error: '+error.toString()
            });
        }
    }
});
// eliminar anuncio by id
router.delete('/anuncios/eliminar/:id_anuncio', async(req,res)=>{

    const id_anuncio = req.params.id_anuncio;
    try {
        const anuncioDB = await Anuncio.findByIdAndDelete(id_anuncio);
        if (anuncioDB) {
            res.json({
                eliminado: true,
                mensaje: 'Se ha eliminado el anuncio'
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            eliminado: false,
            mensaje: error.toString()
        });
    }
});
// get anuncio by id
router.get('/anuncios/:id_anuncio', esAdmin, async(req,res)=>{

    const id_anuncio = req.params.id_anuncio;
    try {
        const anuncioDB = await Anuncio.findById(id_anuncio); // encuentra el anuncio con esa id
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        res.render("admin_anuncios_e", {
            anuncio: anuncioDB, 
            usuarios: arrayUsuarios,
            error: false
        });
    } catch (e) {
        res.render("admin_anuncios_e", {
            error: true, 
            mensaje: "No se ha encontrado el anuncio especificado"
        });
    }
});
// Editar anuncio
router.put('/anuncios/:id_anuncio', [
    // Validación servidor
    // ! falta validar imágen
    check('id_usuario', 'ID de usuario no válida').notEmpty().isLength({min: 12, max:50}),
    check('titulo', 'Título no válido').trim().escape().isLength({ min: 3, max:50}),
    check('descripcion', 'Descripción no válida').trim().escape().isLength({ min: 3, max:300}),
    check('matricula', 'Matrícula no válida').matches(/^\d{4}[A-Z]{3}$/),
    check('combustible', 'Tipo de combustible no válido').isIn(['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido']),
    check('transmision', 'Tipo de transmisión no válido').isIn(['Manual', 'Automático']),
    check('precio', 'Precio no válido').isInt({ gt: 0, lt:1000})
],async(req,res)=>{

    const erroresVal = validationResult(req);
    var stringErrores = erroresVal.errors.map(function(error) {
        return " "+error['msg'];
    });

    if (!erroresVal.isEmpty()) {
        
        return res.status(422).json({estado: false, mensaje: stringErrores});

    } else {
        
        const id_anuncio = req.params.id_anuncio;
        req.body.id_usuario = req.body.id_usuario.trim();
        const body = req.body;
        try {
            const anuncioDB = await Anuncio.findByIdAndUpdate(id_anuncio, body, {useFindAndModify: false});
            res.status(200).json({
                estado: true,
                mensaje: 'Se ha editado el anuncio'
            });
        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.toString()
            });
        }
    }
})

//* USUARIOS ---------------------------------------------------------------------------------------------------

router.get('/usuarios', esAdmin, async (req, res)=>{

    try {
        const arrayUsuarios = await Usuario.find(); // encuentra la coleccion usuario
        const arrayAnuncios = await Anuncio.find(); // encuentra la coleccion anuncios
        res.render("admin_usuarios", {usuarios: arrayUsuarios, anuncios: arrayAnuncios});
    } catch (error) {
        console.log(error);
        res.render("admin_usuarios", error);
    }
});

module.exports = router;