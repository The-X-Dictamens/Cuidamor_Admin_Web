const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});
const adminActions = require('../Controllers/adminActions');


router.post('/login',adminActions.login);

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/solicitudes',(req,res)=> {
    res.render('soliEmpleados');
})

router.use(function(req, res, next) {
    res.status(404).render('catchError', {message: 'Página no encontrada'});
});

router.use(function(err, req, res, next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send(err.message);
    console.log(err);
}); 



module.exports = router;