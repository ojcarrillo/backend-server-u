// requires
var express = require('express');



// inicio variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// rutas/peticiones

// ==================================================
// metodo: busqueda general
// ==================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});

// ==================================================
// metodo: busqueda por coleccion
// ==================================================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                msg: `No existe la coleccion dada [${tabla}] para la busqueda`,
                error: {
                    message: `No existe la coleccion dada [${tabla}] para la busqueda`
                }
            });
            break;
    }

    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            [tabla]: respuesta
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ 'nombre': regex })
            .populate('usuario', 'nombre email')
            .sort('nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error en la busqueda de medicos', err);
                } else {
                    resolve(medicos);
                }
            })
    })
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ 'nombre': regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .sort('nombre')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error en la busqueda de medicos', err);
                } else {
                    resolve(hospitales);
                }
            })
    })
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, '-password')
            .sort('nombre')
            .or([{ 'nombre': regex, 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error en la busqueda de usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    })
}

module.exports = app;