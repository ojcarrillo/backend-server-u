var moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = moongose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'El rol {VALUE} no es permitido'
}

var usuaroSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: [true, 'El correo ya se encuentra registrado'], required: [true, 'El correo es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
	google: { type: Boolean, required: false, default: false }
});

usuaroSchema.plugin(uniqueValidator, { message: 'el campo {PATH} debe ser único' })

module.exports = moongose.model('Usuario', usuaroSchema);