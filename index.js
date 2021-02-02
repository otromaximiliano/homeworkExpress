const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
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

server.use(bodyParser)
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


server.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`)
})