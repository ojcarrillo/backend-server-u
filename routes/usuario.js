// requires
var express = require('express');
var bcrypt = require('bcryptjs');

// inicio variables
var app = express();

var Usuario = require('../models/usuario');

// rutas/peticiones

// ==================================================
// metodo: listado de usuarios
// ==================================================
app.get('/', (req, res, next) => {

    Usuario.find({}, '-password')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'error consultando usuarios!',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
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
        role: body.role
    });
    /* guardamos el usuario a la bd */
    usuario.save((err, usaurioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'error alamcenando usuario!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usaurioGuardado
        });
    });
});

module.exports = app;