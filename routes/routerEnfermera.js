const express = require('express')
const routerE = express.Router()
const metodosEnfermeras = require('../controllers_Acces/authEnfermera')
//Registro
routerE.get('/Registrarme_como_enfermera', (req, res) => {
    console.log('aqui pensando')
    console.time()
    res.render('./Enfermera/RegisterE', {alert:false})
})
//Login
routerE.get('/Iniciar_sesion_enfermera', (req, res)=>{
    res.render('./Enfermera/LoginE', {alert:false})
})
//Vacantes
routerE.get('/Visualizar_vacantes', (req, res)=>{
    res.render('./Enfermera/VacantesE', {alert:false})
})
//Info Vacante                                          para verificar              para checarle el permiso
routerE.get('/Informacion_detallada_vacante', metodosEnfermeras.EnfermeraAuth, (req, res)=>{
    res.render('./Enfermera/InfoVacanteE',{Enfermera:semicuci} )
})

//Despues del registro
routerE.get('/postRegistro', (req, res)=>{
    res.render('./Enfermera/registrada',)
})
//sin Verificar
routerE.get('/noautenticado', (req, res)=>{
    res.render('./Enfermera/ViewwithoutVerify', {alert:false})
})


routerE.get('/pagina-deseada', (req, res)=>{
    res.render('./Enfermera/deseada', {alert:false})
})
/**
 * 
//Su Informacion
routerE.get('/Informacion_personal' , (req, res)=>{
    res.render('./Enfermera/InfoE', )
})
 */

//metodos a usar
routerE.post('/registerEn', metodosEnfermeras.registrarUsuario)

routerE.post('/iniciarSesionE', metodosEnfermeras.IniciarSesionEnfermeras)


module.exports = routerE