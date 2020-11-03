var express = require('express');
var cors = require('cors');//requiriendo modulo express y cors
var app = express();//inicializando servidor web
app.use(express.json());//usando json
app.use(cors());//usando cors para que admita solicitudes que vienen de páginas de otros dominios/puertos(en este caso pasar del 4200 al 3000)
app.listen(3000, () => console.log("Server runing on Port 3000"));
//si se hace /url retorna el json
var ciudades = [ "Paris", "Barcelona", "Barranquilla", "Montevideo", "Santiago de Chile", "Mexico DF", "New York" ];
app.get("/ciudades", (req, res, next) => res.json(ciudades.filter((c) => c.toLowerCase().indexOf(req.query.q.toString().toLowerCase()) > -1))); //toLowerCase-pasa a minuscula-- q-es el que pusimos en el form que hace la peticion-- indexof- si coincide con alguna de las ciudades
//req-es lo que llega(la consulta) y res- la respuesta(json)
var misDestinos = [];
app.get("/my", (req, res, next) => res.json(misDestinos));
app.post("/my", (req, res, next) => {
    console.log(req.body);
    misDestinos.push(req.body.nuevo);
    res.json(misDestinos);
});
// un get sobre traducciones, el cual devuelve el lenguaje 
app.get("/api/translation", (req, res, next) => res.json([
    { lang: req.query.lang, key: 'HOLA', value: 'HOLA ' + req.query.lang }//lang: (siglas idioma), key: hola en el idoma que corresponda, value: traduccion
]));