const mysql2 = require('mysql2');

const coneccion = mysql2.createConnection({
    host: 'localhost', 
    user: 'root',  
    password: '11608041211',
    database: 'cuidamor_users'
});

coneccion.connect((err) => {
    if(err){
        console.log('Error al conectar con la base de datos n\ '+ err +"---" );
        return;
    }
    console.log('Conexión exitosa');
});

module.exports = coneccion;