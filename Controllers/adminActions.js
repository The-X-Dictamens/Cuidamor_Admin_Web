const coneccion = require("./DBController");
const { promisify } = require("util");
const query = promisify(coneccion.query).bind(coneccion);

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


exports.crearEmpleado = async (req, res) => {
    if (req.session.user) {
        console.log(req.body);
        console.log(req.files);
        
        try {
            let { nombre, apellido_paterno, apellido_materno, correo, numero_telefono, calle, colonia, codigo_postal, alcaldia, cedula_profecional, puesto} = req.body;
            let dataAcces = await query("INSERT INTO datos_acceso (corr_datacc, pass_datacc, rol_datacc) VALUES (?,?,?)", [correo, password, puesto]);
            let idDataAcces = dataAcceso.insertId;
            let dataDireccion = await query("INSERT INTO direccion (del_dir, col_dir, calle_dir, cp_dir) VALUES (?,?,?,?)",[alcaldia, colonia, calle, codigo_postal])
            let idDataDirec = dataDireccion.insertId;
            let empleado = await query("INSERT INTO empleado (nom_emp, pat_emp, mat_emp, tel_emp, id_datacc) VALUES (?,?,?,?,?)", [nombre, paterno, materno, telefono]);
            res.redirect("/Empleadosenproceso");
        } catch (err) {
            console.error(err);
        }
        
    } else {
        res.redirect("/");
    }    
};

