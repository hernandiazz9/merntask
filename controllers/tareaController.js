const Tarea =  require('../models/Tarea');
const Proyecto =  require('../models/Proyecto');
const {validationResult}= require('express-validator');

//crea una nueva tarea

exports.crearTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
       return res.status(400).json({ errores: errores.array() })
    }

    
    try {
        //extraer proyecyo y comprobar ixiste
        const { proyecto } = req.body
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})

        //revisar si el proyecto  actual pertence al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id ) return res.status(401).json({ msg: 'No autorizado'});

        //crear la tarea 
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')   
    }
}

exports.obtenerTareas = async (req, res) =>{
    try {
        
        
        //extraer proyecyo y comprobar ixiste
        const { proyecto } = req.query

        console.log(req.query);
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {return res.status(404).json({msg: 'Proyecto no encontradoo'})}

        //revisar si el proyecto  actual pertence al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id ) {return res.status(401).json({ msg: 'No autorizado'})};

        //obtener tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: -1});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error fichero');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        //extraer proyecyo 
        const { proyecto, nombre, estado } = req.body
        //tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste)return res.status(404).json({ msg: 'No existe esa tarea '});


        //existe proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //revisar si el proyecto  actual pertence al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id ) return res.status(401).json({ msg: 'No autorizado'});

        //crear un objeto con la nueva info
        const nuevaTarea = {}
            nuevaTarea.nombre=nombre;
            nuevaTarea.estado=estado;

        //guardar tarea
        tareaExiste = await Tarea.findOneAndUpdate({ _id : req.params.id}, nuevaTarea, {new:true});
        res.json({tareaExiste})

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error ')
    }
}
 //eliminar tarea 
exports.eliminarTarea = async (req, res) => {
    try {
        //extraer proyecyo 
        const { proyecto } = req.query
        //tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste)return res.status(404).json({ msg: 'No existe esa tarea '});

        //existe proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //revisar si el proyecto  actual pertence al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id ) return res.status(401).json({ msg: 'No autorizado'});

        //eliminar
        await Tarea.findOneAndRemove({_id: req.params.id })
        res.json({msg: 'tarea eliminada'})
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error ')
    }
}