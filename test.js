const mysql = require('mysql');

const connect = mysql.createPool({
    host: '10.4.2.125',
    port: '3306',
    user: 'dbuser',
    password: '!QAZxsw2',
    database: 'vf'
});

const select = "SELECT DATE_FORMAT(period, '%m %Y') FROM vf_details";
connect.getConnection(function(err, connection) {
    //Creating details table
    connection.query(select, function (err, result) {
        if (err) throw err;
        else {
            let str = JSON.stringify(result);
            let json = JSON.parse(str);
            let per = "DATE_FORMAT\(period, '%m %Y'\)";
            console.log(json[0].per);
        }
    });
    connection.release();
});
let dateform = new Intl.DateTimeFormat('uk-UA', { year: 'numeric', month: '2-digit'});
//{timeZone: 'Europe/Kiev', year: 'numeric', month: '2-digit', day: 'numeric'}
console.log(dateform.format(Date.now()).toString().replace('/', '.'));












/*function converDate(period, con) {
  let dateof = period.exec(con)[2].split('.');
  let dateform = new Date(dateof[2], dateof[1], dateof[0]);
  console.log(dateform);
  //to_db(dateform);
  return dateform;
}*/