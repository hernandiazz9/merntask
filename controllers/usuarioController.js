const Usuario = require ('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require ('express-validator');
const jwt = require('jsonwebtoken')


exports.crearUsuario = async (req, res) => {

    //revistar si hay errires
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario){
            return res.status(400).json({ msg: 'El usuario ya existe'});
        };
        //crea usuario
        usuario = new Usuario (req.body)

        //hashear e password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //crear y firmar el jsw
        const payload ={
            usuario:{
                id: usuario.id
            }
        };
        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, { 
            expiresIn: 3600
        },(error, token)=>{
            if (error) throw error;

            //mensaje de confugiracion
            res.json({ token });
        })

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
        
    }
    
}