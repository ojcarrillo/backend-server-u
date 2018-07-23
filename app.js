// requires
var express = require('express');
var mongoose = require('mongoose');

// inicio variables
var app = express();


// conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos Mongo [hospitalDB]: \x1b[32m%s\x1b[0m', 'online');
});

// rutas/peticiones
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'peticion realizada correctamente'
    });
});


// listener de peticiones
app.listen(3000, () => {
    console.log('express server [puerto 3000]: \x1b[32m%s\x1b[0m', 'online');
});