const express = require('express');
const router = express.Router();

// importar modelo anuncio
const Anuncio = require('../modelo/Anuncio');

router.get('/', (req, res)=>{

    res.render("admin");
});

router.get('/anuncios', async (req, res)=>{

    try {
        // encuentra coleccion anuncio
        const arrayAnuncios = await Anuncio.find();
        res.render("admin_anuncios", {anuncios: arrayAnuncios});
    } catch (error) {
        console.log(error);
        res.render("admin_anuncios", error);
    }
    
});
router.get('/anuncios/crear', (req, res)=>{
    res.render("admin_anuncios_c");
});
// crear anuncio
router.post('/anuncios', async(req,res)=>{

    const body = req.body;
    try {
        const anuncioDB = new Anuncio(body);
        await anuncioDB.save();
        res.redirect('/admin/anuncios');
    } catch (error) {
        console.log(error);
    }
});
router.get('/anuncios/:id_anuncio', async(req,res)=>{

    const id_anuncio = req.params.id_anuncio;
    try {
        const anuncioDB = await Anuncio.findById(id_anuncio);
        res.render("admin_anuncios_e", {anuncio: anuncioDB, error: false});
    } catch (e) {
        res.render("admin_anuncios_e", {error: true, mensaje: "No se ha encontrado el anuncio especificado"});
    }
});

router.get('/usuarios', (req, res)=>{

    res.render("admin_usuarios");
});

module.exports = router;