const express = require('express')
const routerC = express.Router()


routerC.get('/Iniciar_sesion_cuidador', (req, res)=>{
    res.render('./Cuidador/', {alert:false})
})

routerC.get('/Crear_cuenta_cuidador', (req, res)=>{
    res.render('./Cuidador/', {alert:false})
})
/**
 * routerC.get('/', (req, res)=>{
    res.render('./Cuidador/', {alert:false})
})
 */


module.exports = routerC