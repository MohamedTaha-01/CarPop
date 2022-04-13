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
router.post('/', async(req,res)=>{

    const body = req.body;
    try {
        const anuncioDB = new Anuncio(body);
        await anuncioDB.save();
        res.redirect('/admin/anuncios');
    } catch (error) {
        console.log(error);
    }
});

router.get('/usuarios', (req, res)=>{

    res.render("admin_usuarios");
});

module.exports = router;