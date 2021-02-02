const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
let INICIO = 1;
const STATUSES = {
  SERVER_ERROR : 500,
  NOT_FOUND: 404,
  OK: 200,
  BAD_REQUEST: 400
}

const server = express();
const empleados = [];

function nuestroPropioLoguer(req, res, next){
  console.log(req.url);
  next();
}

server.use(bodyParser.json())
server.use("/",nuestroPropioLoguer);

server.get("/empleados", (req, res)=>{
  try {
    if(req.query.hasOwnProperty("name") || req.query.hasOwnProperty("salary")){
      // Requiere investigación
      let data = empleados.filter(empleado => empleado.name.includes(req.query.name) || empleado.salary == req.query.salary)
      if(data.length > 0){
        res.status(STATUSES.OK).json(data)
      }else{
        res.status(STATUSES.OK).json(empleados)
      }
    }else{
      res.status(STATUSES.OK).json(empleados);
    }
  } catch (error) {
    res.status(STATUSES.SERVER_ERROR).json()
  }
})

server.post('/empleados', (req, res) => {
  let { name, surname, dni, salary } = req.body;
  if(name && surname && dni && salary){
    
    empleados.push({
      name,
      surname,
      dni,
      salary,
      id: INICIO++
    })
    res.status(STATUSES.OK).json(empleados[empleados.length-1])

  }else{
    res.status(STATUSES.BAD_REQUEST).json({loco: "Manda bien chamigo!" })
  }
});

server.put('/empleados', (req, res) => {
  let {name, surname, dni, salary, id }= req.body
  if(id){
    let empleadoEncontrado = empleados.findIndex(empleado => empleado.id === id)
    if(empleadoEncontrado >= 0){
      empleados[empleadoEncontrado].name = name
      empleados[empleadoEncontrado].surname = surname
      empleados[empleadoEncontrado].dni = dni
      empleados[empleadoEncontrado].salary = salary
      res.status(STATUSES.OK).json(empleados[empleadoEncontrado])
    }
  }else{
    res.status(STATUSES.BAD_REQUEST).json({boludo: "Manda un id valido!"})
  }
});

server.delete('/empleados/:id', (req, res) => {
  let id = req.params.id;
  if(id){
    let empleadoFiltrado = empleados.find(empleado => empleado.id === id);
    if(empleadoFiltrado){
      let resultado = empleados.filter(empleado => empleado.id !== empleadoFiltrado.id);
      empleados = resultado;
      res.status(STATUSES.OK).json({success: true})
    }else{
      res.status().json({error: "No determino su id"})
    }
  }else{
    res.status(STATUSES.BAD_REQUEST).json({error: ""})
  }

});


server.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`)
})