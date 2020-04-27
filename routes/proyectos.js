const express =  require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crea proyecots
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)
//obtener los proyectos de un usuario
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)

//actualizar un proyecto por id

router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;
