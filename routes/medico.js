// requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/autenticacion');

var limit = require('../config/config').limitQuery;

// inicio variables
var app = express();

var Medico = require('../models/medico');

// ==================================================
// metodo: listado de medicos
// ==================================================

app.get('/', (req, res, next) => {

    var offset = Number(req.query.desde || 0);

    Medico.find({})
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'error consultando medicos!',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos: medicos
                    });
                })
            })
});

// ==================================================
// metodo: crear nuevo medico
// ==================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el body del request */
    var body = req.body;
    /* crea el objeto nuevo medico */
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    /* guardamos el medico a la bd */
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'error almacenando medico!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});


// ==================================================
// metodo: actualizar medico
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el id del medico para actualizar */
    var id = req.params.id;
    /* obtiene el body del request */
    var body = req.body;

    Medico.findById(id, '')
        .exec((err, medicoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'error actalizando medico!',
                    errors: err
                });
            }
            if (!medicoDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'error actalizando medico!',
                    errors: { message: `No existe el medico con el id ${id}` }
                });
            }
            /* asignamos los valores al registro */
            Object.keys(body).forEach(key => {
                medicoDB[key] = body[key];
            });
            /* guardamos el medico a la bd */
            medicoDB.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'error actualizando medico!',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospital: medicoGuardado
                });
            });
        });
});


// ==================================================
// metodo: borrar medico
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el id del medico para actualizar */
    var id = req.params.id;
    /* busca y elimina el registro por el id */
    Medico.findByIdAndRemove(id, (err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error eliminando medico!',
                errors: err
            });
        }
        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'error eliminando medico!',
                errors: { message: `No existe el hospital con el id ${id}` }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: medicoDB
        });
    });
});

module.exports = app;