// requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/autenticacion');

var limit = require('../config/config').limitQuery;

// inicio variables
var app = express();

var Hospital = require('../models/hospital');

// peticione

// ==================================================
// metodo: listado de hospitales
// ==================================================

app.get('/', (req, res, next) => {

    var offset = Number(req.query.desde || 0);

    Hospital.find({}, '')
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'error consultando hospitales!',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales: hospitales
                    });
                });
            })
});

// ==================================================
// metodo: crear nuevo hospital
// ==================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el body del request */
    var body = req.body;
    /* crea el objeto nuevo hospital */
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    /* guardamos el hospital a la bd */
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'error almacenando hospital!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});


// ==================================================
// metodo: actualizar hospital
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el id del hospital para actualizar */
    var id = req.params.id;
    /* obtiene el body del request */
    var body = req.body;

    Hospital.findById(id, '')
        .exec((err, hospitalDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'error actalizando hospital!',
                    errors: err
                });
            }
            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'error actalizando hospital!',
                    errors: { message: `No existe el hospital con el id ${id}` }
                });
            }
            /* asignamos los valores al registro */
            Object.keys(body).forEach(key => {
                hospitalDB[key] = body[key];
            });
            /* guardamos el usuario a la bd */
            hospitalDB.save((err, hospitalGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'error actualizando hospital!',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado
                });
            });
        });
});


// ==================================================
// metodo: borrar usuario
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el id del usuario para actualizar */
    var id = req.params.id;
    /* busca y elimina el registro por el id */
    Hospital.findByIdAndRemove(id, (err, hospitalDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error eliminando hospital!',
                errors: err
            });
        }
        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                msg: 'error eliminando hospital!',
                errors: { message: `No existe el hospital con el id ${id}` }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });
    });
});

module.exports = app;