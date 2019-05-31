const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const layout = require('express-layout');

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
  let dateform = dateof[2]+'-'+dateof[1]+'-'+dateof[0];
  //console.log(dateform);

  to_db(telex, semen, packet, dateform, con);

};

const connect = mysql.createPool({
  host: '10.4.2.125',
  port: '3306',
  user: 'dbuser',
  password: '!QAZxsw2',
  database: 'vf'
});

/*function converDate(period, con) {
  let dateof = period.exec(con)[2].split('.');
  let dateform = new Date(dateof[2], dateof[1], dateof[0]);
  console.log(dateform);
  //to_db(dateform);
  return dateform;
}*/

function to_db(telex, semen, packet, dateform, con) {
  let tel;
  let summer;
  let pack;
  //let dateof = period.exec(con);
  //let dateform = dateof.getDate();

  while ((tel=telex.exec(con)) && (summer=semen.exec(con)) && (pack=packet.exec(con))) {
    let insert_data = "INSERT INTO vf_details (phone, sum, packet, period) VALUES" + "('"+ tel[2]+"'," + "'"+ summer[2]+"'," + "'"+ pack[2] +"'," + "'"+dateform + "')";
    //let insert_data = "INSERT INTO vf_details (phone, sum, packet) VALUES" + "('" + tel[2] + "', " + "'" + summer[2] + "', " + "'" + pack[2] + "')";
    connect.getConnection(function(err, connection) {
      //Creating details table
      connection.query(insert_data, function (err) {
        if (err) throw err;
        else {
          console.log('Successfully!');
        }
      });
      connection.release();
    });


  }
}

module.exports = app;
