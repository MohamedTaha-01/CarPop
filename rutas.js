const express = require('express');
const path = require('path');

const router = express.Router();

/**
 * * ROUTING
 * / /index /index.html
 * resto error 404
 */

router.get(/\/((index)|(index\.html))?/, (req,res) => {

    res.status(200).sendFile(path.resolve(__dirname,'./vista/index.ejs'));
});
router.get('alquilar.html', (req,res) => {

    res.status(200).sendFile(path.resolve(__dirname,'./vista/alquilar.html'));
});

router.all('*', (req,res) => {

    res.status(404).sendFile(path.resolve(__dirname,'./vista/404.html'));
});

module.exports = router;