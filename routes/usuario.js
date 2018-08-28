// requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/autenticacion');

var limit = require('../config/config').limitQuery;

// inicio variables
var app = express();

var Usuario = require('../models/usuario');

// rutas/peticiones

// ==================================================
// metodo: listado de usuarios
// ==================================================
app.get('/', (req, res, next) => {

    var offset = Number(req.query.desde || 0);

    Usuario.find({}, '-password')
        .skip(offset)
        .limit(limit)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'error consultando usuarios!',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        usuarios: usuarios
                    });
                });
            })
});


// ==================================================
// metodo: crear nuevo usuario
// ==================================================
app.post('/', (req, res) => {
    /* obtiene el body del request */
    var body = req.body;
    /* crea el objeto nuevo usuario */
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
		google: body.google ? body.google : false
    });
    /* guardamos el usuario a la bd */
    usuario.save((err, usaurioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'error almacenando usuario!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usaurioGuardado
        });
    });
});


// ==================================================
// metodo: actualizar usuario
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    /* obtiene el id del usuario para actualizar */
    var id = req.params.id;
    /* obtiene el body del request */
    var body = req.body;

    Usuario.findById(id, '-password')
        .exec((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'error actalizando usuario!',
                    errors: err
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'error actalizando usuario!',
                    errors: { message: `No existe el usuario con el id ${id}` }
                });
            }
            /* asignamos los valores al registro */
            Object.keys(body).forEach(key => {
                usuarioDB[key] = body[key];
            });
            /* guardamos el usuario a la bd */
            usuarioDB.save((err, usaurioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'error actualizando usuario!',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuario: usaurioGuardado
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
    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error eliminando usuario!',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'error eliminando usuario!',
                errors: { message: `No existe el usuario con el id ${id}` }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;