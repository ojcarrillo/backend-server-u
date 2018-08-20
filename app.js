// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicio variables
var app = express();

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// midelware routes
app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);

// conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos Mongo [hospitalDB]: \x1b[32m%s\x1b[0m', 'online');
});

// listener de peticiones
app.listen(3000, () => {
    console.log('express server [puerto 3000]: \x1b[32m%s\x1b[0m', 'online');
});