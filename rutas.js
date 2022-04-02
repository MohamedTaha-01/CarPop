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

    res.render(__dirname+'/vista/index');
});

router.get('/alquilar', (req,res) => {

    res.render(__dirname+'/vista/alquilar');
});

router.all('*', (req,res) => {

    res.render(__dirname+'/vista/404');
});

module.exports = router;