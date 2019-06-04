const mysql = require('mysql');
const config = require('../config');

const connect = mysql.createPool(config.db);

module.exports.dbQuery = function dbQuery(queryToDb) {
    connect.getConnection(function(err, connection) {
        //Creating details table
        connection.query(queryToDb, function (err, result) {
            if (err) throw err;
            else {
                return result;
                console.log('Successfully!_DB');
            }
        });
        connection.release();
    });

}