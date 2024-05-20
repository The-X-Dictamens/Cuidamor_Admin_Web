


exports.ActivacionCuenta = function CuentaActivada (correo,pass,tipe){
    //creacion de los cuerpos de los correos    
    if(tipe == 1){
    
        return `<h1>¡Bienvenido a Cuidamor!</h1>
        <p>¡Hola! Gracias por registrarte en Cuidamor, tu cuenta ha sido validada con exito.</p>
        <p>Para iniciar sesión, utiliza las siguientes credenciales:</p>
        <p>Correo: ${correo}</p>
        <p>Contraseña: ${pass}</p>`
    }else{
        return `<h1>¡Bienvenido a Cuidamor!</h1>
        <p>¡Hola! Gracias por registrarte en Cuidamor, tu cuenta ''${correo}'' ha sido validada con éxito.</p>`
    }
} 