const mysql = require('mysql2');

function conectar(){
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'pruebasrandoom'
    });

    return connection;
};

module.exports = {
    conectar,
};