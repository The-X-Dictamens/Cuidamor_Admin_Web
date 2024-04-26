const coneccion = require("./DBController");
const {promisify} = require('util');
const query = promisify(coneccion.query).bind(coneccion);


exports.login = async (req, res)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        console.log(email);
        console.log(password);
        console.log(req.body);
        let user = await query('SELECT * FROM admin WHERE corr_adm = ? AND pass_adm = ?', [email, password]);
        console.log(user);
        if(user.length > 0){
            req.session.user = user[0];
            res.redirect('/solicitudes');
        }else{
            res.render('index', {message: 'Usuario o contraseña incorrectos'});
        }
    }catch(err){
        res.render('index', {message: 'Error al iniciar sesión'});
    }
}



exports.logout = async (req, res)=>{
    req.session.destroy();
    res.redirect('/');
}




exports.getSolicitudes = async(req, res)=>{

    if(req.session.user){
        let solicitudes = await query('SELECT e.id_emp, e.nom_emp, e.pat_emp, e.mat_emp, e.fot_emp, e.tel_emp, e.est_emp, da.* FROM empleado e JOIN datos_scceso da ON e.id_datacc = da.id_datacc;');
        console.log(solicitudes);
        //res.render('soliEmpleados', {solicitudes: solicitudes});
    }else{
        res.redirect('/');
    }

}