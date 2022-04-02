const express = require('express');
const path = require('path');

const router = express.Router();

/**
 * * ROUTING
 * / /index
 * /alquilar
 * resto error 404
 */

router.get(/(\/$)|(\/index)/m, (req,res) => {

    res.status(200).render(__dirname+'/vista/index');
});

router.get('/alquilar', (req,res) => {

    res.status(200).render(__dirname+'/vista/alquilar');
});

router.all('*', (req,res) => {

    res.status(404).render(__dirname+'/vista/404');
});

module.exports = router;