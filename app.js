const express = require("express");
const {conectar} = require('./db/conexion');
const app = express();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "clave secreta";

const puerto = 3000;

app.use(express.json());

const db = conectar(); 

app.get('/', (req, res)=>{
    res.send('<h1> Buenos dias y bienvenido </h1>');
});

app.post('/login',(req,res)=>{
    const {username, password} = req.body;
    if(username === "Admin" && password === "1234"){
        const token = jwt.sign({username}, SECRET_KEY)
        res.status(200).json({token})
    }else{
        res.status(401).json({message:"usuario y o contrasenia incorrecto"});
    }
});

app.use("/listado", (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
        console.log(decoded);
        next();
    } catch (err) {
        res.status(401).json({ message: "No tenes permiso amigo" });
        console.log(err);
    }
});

app.get('/listado',(req, res)=>{

   db.query('SELECT * FROM personas', (error, results)=>{ 

    if(error) {
        console.error('Error al ejecutar la consulta', error);
        return res.status(500).send('Error en la consulta');
    }
    res.json(results);
   });
}), 

app.get('/listado/:id', (req, res)=>{

    let i = req.params.id;
    
    db.query('SELECT id, nombre, apellido, email FROM personas WHERE id='+ i, (error, results)=>{
        if(error){
            console.error('Error al ejecutar la consulta', error);
            return res.status(500).send('Error en la consulta');  
        }
        res.json(results);
    });
});

app.put('/listado/:id',(req, res)=>{
    
    let i = req.params.id;
    let info = req.body

    db.query('UPDATE personas SET nombre="'+info.nombre+'", apellido="'+info.apellido+'", email="'+info.email+'" WHERE id='+ i, (error, results)=>{ 
        
        if(error) {
            console.error('Error al ejecutar la consulta', error);
            return res.status(500).send('Error en la consulta');
        }
        res.send("Modificado");
       });
})

app.delete('/listado/:id', (req, res)=>{
    let i = req.params.id;

    db.query('DELETE FROM personas WHERE id='+ i, (error, results)=>{
        if(error) {
            console.error('Error al ejecutar la consulta', error);
            return res.status(500).send('Error en la consulta');
        }
        res.send("Se elimino con exito"); 
    });
});

app.post('/listado', (req, res)=>{
    let info = req.body;
    db.query('INSERT INTO personas(nombre, apellido, email) VALUES ("'+info.nombre+'","'+info.apellido+'","'+info.email+'")', (error,results)=>{
        if(error) {
            console.error('Error al ejecutar la consulta', error);
            return res.status(500).send('Error en la consulta');
        }
        res.send("Se agrego a la lista exitosamente");       
    })
});


app.listen(puerto, ()=>{
    console.log("Servidor funcando");
});