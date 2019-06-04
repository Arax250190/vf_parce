const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const layout = require('express-layout');
const db = require('./bin/db');
//const config = require('./config');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set ('layouts', './views/layouts');
app.set ('layout', 'layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layout());
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports.fileRead = function readFile(invName) {

  const con = fs.readFileSync(invName).toString();
  const telex = /(Номер телефону: )(38050\d{7})/gim;
  const semen = /(ЗАГАЛОМ ЗА КОНТРАКТОМ \(БЕЗ ПДВ ТА ПФ\):  . . . . . . . . . . . . . . . . . . . . . . . . . . .)\s+(\d+\.\d\d)/gim;
  const packet = /(Тарифний Пакет:)\s([A-z]+\s[A-z]+\s[A-z]+)/gim;
  const period = /(Номер рахунку: +\d{7,12} від )(\d{2}.\d{2}.\d{4})/gim;


  let dateof = period.exec(con)[2].split('.');
  let dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];
  //let checkdate = dateof[1]+ '.' +dateof[2];
  //console.log(checkdate);

  //checkInv(telex, semen, packet, dateForm, con, dateof);
  insertToDb(telex, semen, packet, dateForm, con);

};

/*function checkInv(telex, semen, packet, dateForm, con, dateof) {
  let checkdate = dateof[1]+ '.' +dateof[2];
  const select_date = "SELECT DATE_FORMAT(period, '%m %Y') AS \"period\" FROM vf_details";
  connect.getConnection(function(err, connection) {
    //Creating details table
    connection.query(select_date, function (err, result) {
      if (err) throw err;
      else {
        let str = JSON.stringify(result[0].period.replace(" ", "."));
        let dateIndb = str.replace(/"/g, '');
        if (checkdate === dateIndb) console.log('the same invoice');
        else {
          insertToDb(telex, semen, packet, dateForm, con);
        }
        console.log(dateIndb);
        console.log(checkdate);
      }

});*/

function insertToDb(telex, semen, packet, dateForm, con) {
  let tel;
  let summer;
  let pack;
  //let dateof = period.exec(con);
  //let dateform = dateof.getDate();

  while ((tel=telex.exec(con)) && (summer=semen.exec(con)) && (pack=packet.exec(con))) {
    let insert_data = "INSERT INTO vf_details (phone, sum, packet, period) VALUES" + "('"+ tel[2]+"'," + "'"+ summer[2]+"'," + "'"+ pack[2] +"'," + "'"+dateForm + "')";
    //let insert_data = "INSERT INTO vf_details (phone, sum, packet) VALUES" + "('" + tel[2] + "', " + "'" + summer[2] + "', " + "'" + pack[2] + "')";
    db.dbQuery(insert_data);

    console.log('Successfully!_func');



  }
}



module.exports = app;