// requires
var express = require('express');
var fs = require('fs');
var path = require('path');

// inicio variables
var app = express();

// modelos 
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// rutas/peticiones
app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    // Referencia a nuestros modelos
    var Modelos = {
        usuarios: { modelo: Usuario, tipo: 'usuario', img: 'no-img.jpg' },
        medicos: { modelo: Medico, tipo: 'medico', img: 'medico-1.jpg' },
        hospitales: { modelo: Hospital, tipo: 'hospital', img: 'hospital-1.jpg' }
    };
    if (Modelos.hasOwnProperty(tipo)) {
        /* obtenemos el path dentro de la ubicacion del proyecto */
        var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen);
        } else {
            var pathNoImagen = path.resolve(__dirname, `../assets/${ Modelos[tipo].img }`);
            res.sendFile(pathNoImagen);
        }
    }
});

module.exports = app;