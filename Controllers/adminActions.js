const coneccion = require("./DBController");
const { promisify } = require("util");
const query = promisify(coneccion.query).bind(coneccion);
const cloudController = require("./cloudController");
const gmailController = require("./gmailcontroller");

exports.login = async (req, res) => {
  try {
    //verificamos quexista el usuario
    let email = req.body.email;
    let password = req.body.password;
    let user = await query(
      "SELECT * FROM admin WHERE corr_adm = ? AND pass_adm = ?",
      [email, password]
    );
    if (user.length > 0) {
      //redirijimos a los usuarios en proceso
      req.session.user = user[0];
      res.redirect("/Empleadosenproceso");
    } else {
      //enviar mensaje de error
      res.render("index", { message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    //cachado de error en el frontend
    res.render("chatError", {
      message: "Error al intentar iniciar sesión" + err,
    });
    console.error(err);
  }
};

exports.logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.getSolicitudProceso = async (req, res) => {
  if (req.session.user) {
    try {
      const empleados = await query(
        "SELECT e.id_emp, e.nom_emp, e.pat_emp, e.mat_emp, e.fot_emp, e.tel_emp, e.est_emp, da.* FROM empleado e JOIN datos_acceso da ON e.id_datacc = da.id_datacc;"
      );
      res.render("Emple-proc", { empleados: empleados });
    } catch (err) {
        console.error(err)
    }
  } else {
    res.redirect("/");
  }
};

exports.getSolicitudAceptada = async (req, res) => {
  if (req.session.user) {
    try {
      const empleados = await query(
        "SELECT e.id_emp, e.nom_emp, e.pat_emp, e.mat_emp, e.fot_emp, e.tel_emp, e.est_emp, da.* FROM empleado e JOIN datos_acceso da ON e.id_datacc = da.id_datacc;"
      );
      res.render("Emple-acep", { empleados: empleados });
    } catch (err) {
        console.error(err)
    }
  } else {
    res.redirect("/");
  }
};


exports.crearEmpleado = async (req, res) => {
    if (req.session.user) {
        try {
            //obtencion de los datos del formulario
            let { nombre, apellido_paterno, apellido_materno, correo, numero_telefono, calle, colonia, codigo_postal, alcaldia, cedula_profesional, puesto} = req.body;
            let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc, rol_datacc) VALUES (?,?)", [correo, puesto]);
            let idDataAcces = dataAcces.insertId;

            //obtencion de los los carchivos y sus nombres
            let comprobante_domicilio = req.files["comprobante_domicilio"][0];
            var namecomuser = comprobante_domicilio.fieldname + "-" + idDataAcces;
            let ine = req.files["ine"][0];
            var nameineuser = ine.fieldname + "-" + idDataAcces;
            let certificados = req.files["certificados"][0];
            var nameceruser = certificados.fieldname + "-" + idDataAcces;

            //utilizaremos la funcion de gardado de documentos en los dockers
            let subrcomprobante = cloudController.upload(comprobante_domicilio, namecomuser);
            let subrine = cloudController.upload(ine, nameineuser);
            let subrcertificados = cloudController.upload(certificados, nameceruser);

            //incercion de los datos en la base de datos
            let dataDireccion = await query("INSERT INTO direccion (del_dir, col_dir, calle_dir, cp_dir) VALUES (?,?,?,?)",[alcaldia, colonia, calle, codigo_postal])
            let idDataDirec = dataDireccion.insertId;

            let empleado = await query("INSERT INTO empleado (nom_emp, pat_emp, mat_emp, fot_emp, tel_emp, est_emp, id_datacc, id_dir) VALUES (?,?,?,'N/A',?,'Proceso',?,?)", [nombre, apellido_paterno, apellido_materno, numero_telefono, idDataAcces, idDataDirec]);
            let idEmpleado = empleado.insertId;

            let perProfesional = await query("INSERT INTO perfil_profecional (cedu_prof,cert_prof,ine_prof,comdom_prof,id_emp) VALUES (?,?,?,?,?)", [cedula_profesional,nameceruser,nameineuser,namecomuser,idEmpleado]);

            //redireccion a la pagina de empleados en proceso
            res.redirect("/Empleadosenproceso");
            

        } catch (err) {
            console.error(err);
        }
        
    } else {
        res.redirect("/");
    }    
};







exports.verEmpleado = async (req, res) => {
    if (req.session.user) {
        try {

            let id = req.params.id;
            
            
            res.render("Empleado", { empleado: empleado });

        } catch (err) {
            console.error(err);
        }
    } else {
        res.redirect("/");
    }
}



