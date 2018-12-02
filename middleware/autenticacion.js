var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==================================================
// metodo: verificar token
// ==================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                msg: 'token invalido!',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
};

// ==================================================
// metodo: verificar admin_role
// ==================================================

exports.verificaAdmin = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            msg: 'token invalido!',
            errors: { message: 'No tiene permisos' }
        });
    }
};

// ==================================================
// metodo: verificar admin_role o mismo usuario
// ==================================================

exports.verificaPermiso = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario.id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            msg: 'token invalido!',
            errors: { message: 'No tiene permisos' }
        });
    }
};