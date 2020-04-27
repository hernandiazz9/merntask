const mongoose = require ('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true,
        trim: true
    },
    email: {
        type: String,
        requiere: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        requiere: true,
        trim: true
    },
    registro: { 
        type: Date,
        default: Date.now()
    }
});

module.exports =  mongoose.model('Usuario', UsuariosSchema )