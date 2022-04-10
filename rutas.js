const express = require('express');
const path = require('path');

const router = express.Router();

/**
 * * ROUTING
 * / /index
 * /alquilar
 * /crear_anuncio
 * /registrarse
 * /iniciar_sesion
 * resto error 404
 */

router.get(/(\/$)|(\/index)/m, (req,res) => {

    res.status(200).render(__dirname+'/vista/index');
});

router.get('/alquilar', (req,res) => {

    res.status(200).render(__dirname+'/vista/alquilar');
});

router.get('/crear_anuncio', (req,res) => {

    res.status(200).render(__dirname+'/vista/crear_anuncio');
});

router.get('/registrarse', (req,res) => {

    res.status(200).render(__dirname+'/vista/registrarse');
});

router.get('/iniciar_sesion', (req,res) => {

    res.status(200).render(__dirname+'/vista/iniciar_sesion');
});

router.get('/api/alquilar', (req,res) => {

    res.status(200).json(__dirname+'/public/test/anuncios.json');
});

router.all('*', (req,res) => {

    res.status(404).render(__dirname+'/vista/404');
});

module.exports = router;