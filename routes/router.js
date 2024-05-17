const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});
const adminActions = require('../Controllers/adminActions');
const TestPsycometricController = require('../Controllers/TestPsycometricController');



router.post('/login',adminActions.login);

router.get('/', (req, res) => {
    res.render('index');
});

//visualizar todos los empleaods en proceso
router.get('/Empleadosenproceso',adminActions.getSolicitudProceso);

//ruta de empleados apceptados
router.get('/Empleadosaceptados',adminActions.getSolicitudAceptada);

//ruta de empleados apceptados
router.get('/Empleadosrechazado',adminActions.getSolicitudRechazado);

//captura de de informacion del formulario de agregar
router.post('/crearEmpleado',upload.fields([{name: 'comprobante_domicilio'},{name: 'ine'},{name:'certificados'}]),adminActions.crearEmpleado);

//visualizar la informacion del empleado
router.get('/Empleado',adminActions.verEmpleado);

//eliminar solo un documento de empleado 
router.get('/EliminarDoc',adminActions.eliminarDocumento);

//agregar documento
router.post('/SubirDoc',upload.single('documento'),adminActions.subirDocumento);

//Rechazar solicitud
router.get('/RechazarEmpleado',adminActions.rechazarSolicitud);

//aceptar solicitud
router.get('/AceptarEmpleado',adminActions.aceptarSolicitud);

//procesar solicitud
router.get('/ProcesarEmpleado',adminActions.procesarSolicitud);

//pruebas psicometricas
router.get('/PruebaPsico',TestPsycometricController.getfirstPrueba);

//prueba psicometrica
router.get('/ReaplicarPruebaPsico',TestPsycometricController.getSecondPrueba);

//ruta para obtener resultados de prueba psicometrica
router.post('/enviarResultados',TestPsycometricController.setfirstResultados);

//ruta para obtener resultados de prueba psicometrica
router.post('/enviarReaplicacion',TestPsycometricController.setSecondResultados);



//chachado de error 404
router.use(function(req, res, next) {
    res.status(404).render('catchError', {message:'Página no encontrada'});
});

//manejo de errores
router.use(function(err, req, res, next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send(err.message);
    console.log(err);
});



module.exports = router;