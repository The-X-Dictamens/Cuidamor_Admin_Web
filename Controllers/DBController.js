const mysql2 = require('mysql2');
const fs = require('fs');


const coneccion = mysql2.createConnection({
    host: 'dictamens-cuidamor.mysql.database.azure.com', 
    user: 'Dsj3392',  
    password: 'X-Dictamens',
    database: 'cuidamor_users_unificado',
    port: 3306,
    ssl:{ca:fs.readFileSync(__dirname + '/../env/DigiCertGlobalRootCA.crt.pem'), rejectUnauthorized: false},
});

/*
const coneccion = mysql2.createConnection({
    host: 'localhost', 
    user: 'root',  
    password: '',
    database: 'cuidamor_users_unificado',
    port: 3306,
});
*/


coneccion.connect((err) => {
    if(err){
        console.log('Error al conectar con la base de datos \n ---'+ err +"---" );
        return;
    }
    console.log('Conexión exitosa');
});

module.exports = coneccion;