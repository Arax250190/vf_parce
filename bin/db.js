const mysql = require('mysql');
const config = require('../config');

const connect = mysql.createPool(config.db);

//module.exports.dbQuery = function dbQuery(queryToDb) {
connect.getConnection(function(err, connection) {

    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
               console.error('Database connection was closed.')
           }
           if (err.code === 'ER_CON_COUNT_ERROR') {
               console.error('Database has too many connections.')
           }
           if (err.code === 'ECONNREFUSED') {
               console.error('Database connection was refused.')
           }
       }
    if (connection) connection.release();
      return;
        //Creating details table
       /* connection.query(queryToDb, function (err, result) {
            if (err) throw err;
            else {

            }
        });
        //connection.end();*/
        //connection.release();
    });

module.exports = connect;

/*module.exports.dbResult = function dbResult(dbAns) {
    return dbAns;
};*/

