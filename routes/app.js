// requires
var express = require('express');

// inicio variables
var app = express();

// rutas/peticiones
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'peticion realizada correctamente'
    });
});

module.exports = app;