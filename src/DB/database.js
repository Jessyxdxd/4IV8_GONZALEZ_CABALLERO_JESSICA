const mysql = require('mysql2');

//creamos la conexion

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'HolaCarlitos7v77v7_',
    database : 'practica3_tienda',
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

//la exportamos para poder usuarla
module.exports = pool.promise();