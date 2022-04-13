const express = require('express');
const router = express.Router();

/**
 * * ROUTING
 */

router.get('/', (req,res) => {

    res.status(200).render('index');
});

router.get('/alquilar', (req,res) => {

    res.status(200).render('alquilar');
});

module.exports = router;