//importar express
const express =  require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app =  express();

//conectar la base de datos
conectarDB();

//habilitar cors
app.use(cors());

//habilitar exoress.json
app.use(express.json({extended: true }));


//puerto de la app servidor
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


//definir la pag principa
//app.get('/', (req, res)=>{
//   res.send('hola mundo')
//});

// arrancar la app
app.listen (PORT, () => {
    console.log(`el servidor esta funcionando en el puerto ${PORT}`);
    
});