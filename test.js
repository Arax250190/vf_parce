const mysql = require('mysql');

const connect = mysql.createPool({
    host: '10.4.2.125',
    port: '3306',
    user: 'dbuser',
    password: '!QAZxsw2',
    database: 'vf'
});

const select = "SELECT period FROM vf_details";
connect.getConnection(function(err, connection) {
    //Creating details table
    connection.query(select, function (err, result) {
        if (err) throw err;
        else {
            console.log(result);
        }
    });
    connection.release();
});