const coneccion = require("./DBController");
const {promisify} = require('util');
const query = promisify(coneccion.query).bind(coneccion);
const {readFile} = require('fs/promises');
const e = require("express");

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
    return Math.floor(Math.random() * 1) ;
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
exports.getfirstPrueba = async (req, res) => {
    if (req.session.user) {
        try {
            
        let id = req.query.id;

        const datos = await readThisFile('./testPsicometrics/Pruebas.json');
            
        let numform = randomNum();

        res.render('Prueb-psico-emple',{datos: datos.pruebas[numform],id: id,numform: numform});
            
        } catch (err) {
            console.error(err);
        }
    }else{
        res.redirect('/');
    }
}


//obtener los resultados de la prueba psicometrica
exports.setfirstResultados = async (req, res) => {
    if(req.session.user){
        let id = req.query.id;
        let numform = req.query.form;
        const formularios = await readThisFile('./testPsicometrics/Pruebas.json');
        const reglasform = formularios.pruebas[numform].reglas_aceptacion[0].PuntajeMin;

        let respuestas = req.body;

        let puntaje = sumarPuntajes(respuestas);

        const resultado = puntaje >= reglasform ? 'Aprobado' : 'Reprobado';

        try{
            let setpuntaje = await query('INSERT INTO pruebas (tip_pru, punt_pru, est_prue, id_emp) VALUES (?,?,?,?)',[numform,puntaje,resultado,id]);
            res.redirect('/Empleado?id='+ id);
        }catch(err){
            console.error(err);
        }
        
    }else{
        res.redirect('/');
    }

};


exports.getSecondPrueba = async (req, res) => {
    if (req.session.user) {
        try {
            
        let id = req.query.id;

        const datos = await readThisFile('./testPsicometrics/Pruebas.json');
            
        let numform = randomNum();

        //actualiza el estado a reaplicar y el puntaje a null
        try{
            let setpuntaje = await query('UPDATE pruebas SET est_prue = ? , punt_pru = ? WHERE (id_emp = ?);',['Reaplicando',null,id]);
        }catch(err){
            console.error(err);
        }

        res.render('PrueB_psico2-emple',{datos: datos.pruebas[numform],id: id,numform: numform});
            
        } catch (err) {
            console.error(err);
        }
    }else{
        res.redirect('/');
    }
}


//obtener los resultados de la prueba psicometrica
exports.setSecondResultados = async (req, res) => {
    if(req.session.user){
        let id = req.query.id;
        let numform = req.query.form;
        const formularios = await readThisFile('./testPsicometrics/Pruebas.json');
        const reglasform = formularios.pruebas[numform].reglas_aceptacion[0].PuntajeMin;

        let respuestas = req.body;

        let puntaje = sumarPuntajes(respuestas);

        const resultado = puntaje >= reglasform ? 'Aprobado' : 'Reprobado';

        console.log(puntaje,resultado,numform,id);

        try{
            let setpuntaje = await query('UPDATE pruebas SET tip_pru = ? , punt_pru = ?, est_prue = ? WHERE (id_emp = ?);',[numform,puntaje,resultado,id]);
            res.redirect('/Empleado?id='+ id);
        }catch(err){
            console.error(err);
        }
        
    }else{
        res.redirect('/');
    }

};



