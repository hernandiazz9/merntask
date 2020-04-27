const Usuario = require ('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require ('express-validator');
const jwt = require('jsonwebtoken')


exports.autenticarUsuario = async (req, res) =>{
    //revistar si hay errires
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    //extraer email y password del request
    const { email, password } = req.body;

    try {
        //revisar que sea un us regitrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status (400).json({msg: 'El Usuario no existe'});
        }

        // revistar que el password sea correcto
        const passCorrecto = await bcryptjs.compare( password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: 'Password Incorrecto '})
        }

        //si todo es correcto crear y firmar el jsw
        const payload ={
            usuario:{
                id: usuario.id
            }
        };
        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, { 
            expiresIn: 360000
        },(error, token)=>{
            if (error) throw error;

            //mensaje de confugiracion
            res.json({ token });
        })


    } catch (error) {
        console.log(error);
        
    }

}

//obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req, res) =>{
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password') ;
        res.json({usuario})
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'hubo un error'});
    }
}