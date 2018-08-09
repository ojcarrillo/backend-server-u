// requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// inicio variables
var app = express();

var Usuario = require('../models/usuario');

// ==================================================
// metodo: validacion de usario/contraseña
// ==================================================

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error login!',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'error login!',
                errors: { message: 'Credenciales incorrectas' }
            });
        }
        /* comparamos el password encriptado */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                msg: 'error login!',
                errors: { message: 'Credenciales incorrectas' }
            });
        }
        /* generamos el token con duracion de 4 horas */
        usuarioDB.password = null;
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
        /* devolvemos el token */
        res.status(200).json({
            ok: true,
            msg: 'login correcto!',
            token: token,
            usuario: usuarioDB,
            id: usuarioDB.id
        });
    });
});

module.exports = app;