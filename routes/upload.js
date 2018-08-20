// requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// inicio variables
var app = express();

app.use(fileUpload());

// modelos 
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// rutas/peticiones

// ==================================================
// metodo: para cargar imagenes y actualizar registro
// ==================================================
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    /* validamos la carpeta de destino */
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: 'carpeta invalida!',
            errors: { message: 'Tipo de coleccion invalida' }
        });
    }
    /* validamos que halla un archivo */
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'no existen archivos seleccionados!',
            errors: { message: 'Debe seleccionar al menos una imagen' }
        });
    }
    /* obtenemos el nombre del archivo */
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var ext = nombreCortado.pop().toLowerCase();
    /* extensiones validas */
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];
    /* validamos la extension */
    if (extValidas.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            msg: 'extension no valida!',
            errors: { message: 'las extensiones validas son ' + extValidas.join(', ') }
        });
    }
    /* nombre del archivo */
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ ext }`;
    /* movemos el archivo */
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error al mover archivo !',
                errors: err
            });
        }
        return subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

// ==================================================
// metodo: para actualizar registro de la coleccion
// ==================================================
function subirPorTipo(tipo, id, archivo, res) {
    // Referencia a nuestros modelos
    var Modelos = {
        usuarios: { modelo: Usuario, tipo: 'usuario' },
        medicos: { modelo: Medico, tipo: 'medico' },
        hospitales: { modelo: Hospital, tipo: 'hospital' }
    };
    if (Modelos.hasOwnProperty(tipo)) {
        Modelos[tipo].modelo.findById(id, '-password')
            .exec((error, modelo) => {
                /* si existe el modelo */
                if (!modelo) {
                    return res.status(400).json({
                        ok: false,
                        msg: `el ${Modelos[tipo].tipo} no existe!`,
                        errors: { message: `el ${Modelos[tipo].tipo} no existe!` }
                    });
                }
                /* para eliminar imagen previamente cargada */
                var pathViejo = `./uploads/${ tipo }/${ modelo.img }`;
                if (pathViejo && fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                msg: 'error al eliminar archivo !',
                                errors: err
                            });
                        }
                    });
                }
                /* actualiza la ruta de la imagen */
                modelo.img = archivo;
                modelo.save((error, modeloActualizado) => {
                    if (!error) {
                        return res.status(200).json({
                            ok: true,
                            msg: 'imagen actualizada correctamente',
                            [Modelos[tipo].tipo]: modeloActualizado
                        });
                    }
                });
            })
    }
}

module.exports = app;