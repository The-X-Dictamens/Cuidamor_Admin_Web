const coneccion = require("./DBController");
const { promisify } = require("util");
const query = promisify(coneccion.query).bind(coneccion);
const cloudController = require("./cloudController");
const gmailController = require("./gmailcontroller");
const e = require("express");

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

exports.getSolicitudRechazado = async (req, res) => {
  if (req.session.user) {
    try {
      const empleados = await query(
        "SELECT e.id_emp, e.nom_emp, e.pat_emp, e.mat_emp, e.fot_emp, e.tel_emp, e.est_emp, da.* FROM empleado e JOIN datos_acceso da ON e.id_datacc = da.id_datacc;"
      );
      res.render("Emple-rech", { empleados: empleados });
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
            var namecomuser = comprobante_domicilio.fieldname + "-" + idDataAcces + "." + comprobante_domicilio.originalname.split(".").pop();
            let ine = req.files["ine"][0];
            var nameineuser = ine.fieldname + "-" + idDataAcces + "." + ine.originalname.split(".").pop();
            let certificados = req.files["certificados"][0];
            var nameceruser = certificados.fieldname + "-" + idDataAcces + "." + certificados.originalname.split(".").pop();

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
            let id = req.query.id;
            let empleado = await query("SELECT e.id_emp, e.nom_emp, e.pat_emp, e.mat_emp, e.fot_emp, e.tel_emp, e.est_emp, da.*, d.* FROM empleado e JOIN datos_acceso da ON e.id_datacc = da.id_datacc JOIN direccion d ON e.id_dir = d.id_dir WHERE e.id_emp = ?", [id]);
            let pruebas = await query("SELECT * FROM pruebas WHERE id_emp = ? ",[id]);
            let perfil = await query("SELECT * FROM perfil_profecional WHERE id_emp = ?", [id]);
            
          
            //urls de las fotos de los documenstos
            let comprobante = await cloudController.getUrl(perfil[0].comdom_prof);
            let ine = await cloudController.getUrl(perfil[0].ine_prof);
            let certificados = await cloudController.getUrl(perfil[0].cert_prof);
            let documentos = {comprobante,ine,certificados};

            

            res.render("Empleado", { empleado: empleado, documentos: documentos, pruebas: pruebas});

        } catch (err) {
            console.error(err);
        }
    } else {
        res.redirect("/");
    }
}




exports.eliminarDocumento = async (req, res) => {

  if(req.session.user){

    let iduser = req.query.id;
    let archivo = req.query.doc;

    console.log(iduser,archivo);

    try {
      let perfil = await query("SELECT * FROM perfil_profecional WHERE id_emp = ?", [iduser]);
      switch (archivo) {
        case "comprobante":
          await cloudController.delete(perfil[0].comdom_prof);
          await query("UPDATE perfil_profecional SET comdom_prof = null WHERE id_emp = ?", [iduser]);
          break;
        case "ine":
          await cloudController.delete(perfil[0].ine_prof);
          await query("UPDATE perfil_profecional SET ine_prof = null WHERE id_emp = ?", [iduser]);
          break;
        case "certificados":
          await cloudController.delete(perfil[0].cert_prof);
          await query("UPDATE perfil_profecional SET cert_prof = null WHERE id_emp = ?", [iduser]);
          break;
      }
    } catch (err) {
      console.error(err);
    }
    
    res.redirect("/Empleado?id="+iduser);

  }else{
    res.redirect("/")
  }

}




//subir documento a expediente de empleado
exports.subirDocumento = async (req, res) => {
  if (req.session.user) {
    try {
      let id = req.query.id;
      let tipo = req.query.tipo;
      

      try{
        let documento = req.file;
        let name = tipo + "_" + id + "." + documento.originalname.split(".").pop();
        switch (tipo) {
          case "comprobante_domincilio":
            await query("UPDATE perfil_profecional SET comdom_prof = ? WHERE id_emp = ?", [name, id]);
            await cloudController.upload(documento, name);
            break;
          case "ine":
            await query("UPDATE perfil_profecional SET ine_prof = ? WHERE id_emp = ?", [name, id]);
            await cloudController.upload(documento, name);
            break;
          case "certificados":
            await query("UPDATE perfil_profecional SET cert_prof = ? WHERE id_emp = ?", [name, id]);
            await cloudController.upload(documento, name);
            break;
        }
        res.redirect("/Empleado?id="+id);
      }catch(err){
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect("/");
  }
};





exports.rechazarSolicitud = async (req, res) => {
  if (req.session.user) {
    try {
      let id = req.query.id;
      await query("UPDATE empleado SET est_emp = 'Rechazado' WHERE id_emp = ?", [id]);
      res.redirect("/Empleadosenproceso");
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect("/");
  }
};

exports.aceptarSolicitud = async (req, res) => {
  if (req.session.user) {
    try {
      let id = req.query.id;
      await query("UPDATE empleado SET est_emp = 'Aceptado' WHERE id_emp = ?", [id]);

      /*
      //veo si la contraseña es null o ya tiene una
      let data = await query("SELECT * FROM datos_acceso WHERE id_datacc = ?", [id]);
      if (data[0].pass_datacc == null) {
        //si no tiene contraseña se le envia un correo para que la genere
        let correo = data[0].cor_datacc;

        let pass = 

        let token = await gmailController.sendEmail(correo,`Cuidamos Datos para acceder a tu correo",<h1>correo:  ${correo}</h1><br><h1>contraseña: ${password}`);
        await query("UPDATE datos_acceso SET pas_datacc = ? WHERE id_datacc = ?", [token, id]);
      }
      */

      res.redirect("/Empleadosaceptados");
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect("/");
  }
}


exports.procesarSolicitud = async (req, res) => {
  if (req.session.user) {
    try {
      let id = req.query.id;
      await query("UPDATE empleado SET est_emp = 'Proceso' WHERE id_emp = ?", [id]);
      res.redirect("/Empleadosenproceso");
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect("/");
  }
}









//generar una contraseña pseudo aleatoria

