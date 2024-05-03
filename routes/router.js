const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});
const adminActions = require('../Controllers/adminActions');



router.post('/login',adminActions.login);

router.get('/', (req, res) => {
    res.render('index');
});

//visualizar todos los empleaods en proceso
router.get('/Empleadosenproceso',adminActions.getSolicitudProceso);

//ruta de empleados apceptados
router.get('/Empleadosaceptados',adminActions.getSolicitudAceptada);

//captura de de informacion del formulario de agregar
router.post('/crearEmpleado',upload.fields([{name: 'comprobante_domicilio'},{name: 'ine'},{name:'certificados'}]),adminActions.crearEmpleado);

//visualizar la informacion del empleado
router.get('/Empleado/:id',adminActions.verEmpleado);





router.use(function(req, res, next) {
    res.status(404).render('catchError', {message:'Página no encontrada'});
});

router.use(function(err, req, res, next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send(err.message);
    console.log(err);
});







module.exports = router;