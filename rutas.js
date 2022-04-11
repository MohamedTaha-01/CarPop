const express = require('express');
const router = express.Router();
const path = require('path');
const datos = {};
datos.anuncios = require('./modelo/anuncios.json');
datos.usuarios = require('./modelo/usuarios.json');

/**
 * * ROUTING
 * /
 * /alquilar
 * /crear_anuncio
 * /registrarse
 * /iniciar_sesion
 * resto error 404
 */

router.get('/', (req,res) => {

    res.status(200).render(__dirname+'/vista/index');
});

router.route('/alquilar')
    .get((req,res) => {
        
        res.status(200).render(__dirname+'/vista/alquilar', datos)
        // res.json(datos.anuncios);
    })
    .post((req,res) => {
        
    });

router.route('/alquilar/:id')
    .get((req,res) => {
            
        let inIdUsuario = req.params.id;
        if(inIdUsuario){
            datos.anuncios = datos.anuncios.filter(anuncio => anuncio.id_usuario==inIdUsuario);
        }
        res.status(200).render(__dirname+'/vista/alquilar', datos)
        // res.json(datos.anuncios);
    })

/*
router.get('/alquilar', (req,res) => {

    res.status(200).render(__dirname+'/vista/alquilar');
});*/

router.get('/crear_anuncio', (req,res) => {

    res.status(200).render(__dirname+'/vista/crear_anuncio');
});

router.get('/registrarse', (req,res) => {

    res.status(200).render(__dirname+'/vista/registrarse');
});

router.get('/iniciar_sesion', (req,res) => {

    res.status(200).render(__dirname+'/vista/iniciar_sesion');
});

router.all('*', (req,res) => {

    res.status(404).render(__dirname+'/vista/404');
    console.log("404");
});

module.exports = router;