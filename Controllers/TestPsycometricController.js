const coneccion = require("./DBController");
const {promisify} = require('util');
const query = promisify(coneccion.query).bind(coneccion);
const {readFile} = require('fs/promises');

////////////////////////////////////////////////
/*Funciones para el control y manejo de datos*/
async function readThisFile(dirpath){
    try{
        const data = await readFile(dirpath);
        return JSON.parse(data.toString());
    }catch(err){
        console.error(err);
    }
    
}


//ontener un numero aleatorio entre uno y dos
function randomNum(){
    return Math.floor(Math.random() * 2) ;
} 

function sumarPuntajes(objeto) {
    let suma = 0;
    for (let key in objeto) {
        suma += parseInt(objeto[key]);
    }
    return suma;
}
//////////////////////////////////////////////////




//funcion para generar y renderizar prueba psicometrica por json
exports.getPrueba = async (req, res) => {
    try {
        
       let id = 1;

       const datos = await readThisFile('./testPsicometrics/Pruebas.json');
        
       let numform = randomNum();

       res.render('Prueb-emple',{datos: datos.pruebas[numform],id: id,numform: numform});
        
    } catch (error) {
        res.status(500).send(error);
    }
}


//obtener los resultados de la prueba psicometrica
exports.getResultados = async (req, res) => {
    let dat = req.query;
    let respuestas = req.body;
    let puntaje = sumarPuntajes(respuestas);
    console.log(puntaje);  
    console.log(dat);
    console.log(respuestas);


};

