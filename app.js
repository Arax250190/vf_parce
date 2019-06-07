const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const layout = require('express-layout');
const db = require('./bin/db');
const re = require('./regext');
//const index = require('./routes/index');
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
  const telex = new RegExp(re.vodafone.telephone, 'gim');
  const sumex = new RegExp(re.vodafone.sum, 'gim');
  const packet = new RegExp(re.vodafone.packet, 'gim');
  const period = new RegExp(re.vodafone.period, 'gim');
  const overex = new RegExp(re.vodafone.overpack, 'gim');
  const blockex = new RegExp(re.vodafone.block, 'gim');
  const roaming = new RegExp(re.vodafone.roaming, 'gim');
  const contentex = new RegExp(re.vodafone.roaming, 'gim');

  let dateof = period.exec(con)[0].split('.');
  let dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];

  insertToDb(telex, sumex, packet, dateForm, overex, blockex, roaming, contentex, con);

};


function insertToDb(telex, sumex, packet, dateForm, overex, blockex, roaming, contentex, con) {
  let test = con.match(blockex);
  let tel;
  let sum;
  let over;
  let roam;
  let pack;
  let content;


  for (let i = 0; i < test.length; i++) {
    let test2 = test[i];
    //console.log(test2);

    try {
      tel = test2.match(telex)[0]
    } catch (e) {
      tel = "error parsing tel";
    }

    try {
      sum = test2.match(sumex)[0];
    } catch (e) {
      sum = "error parsing sum";
    }

    try {
      over = test2.match(overex)[0];
    } catch (e) {
      over = 0.00;
    }

    try {
      roam = test2.match(roaming)[0];
    } catch (e) {
      roam = 0.00;
    }

    try {
      content = test2.match(contentex)[0];
    } catch (e) {
      content = 0.00;
    }

    try {
      pack = test2.match(packet)[0];
    } catch (e) {
      pack = "error parsing packet"
    }
    let insert_data = "INSERT INTO vf_details (phone, sum, packet, overPack, roaming, contentService, period) VALUES" + "('" + tel + "'," + "'" + sum + "'," + "'" + pack + "'," + "'" + over + "'," + "'" + roam + "'," + "'" + content + "'," + "'" + dateForm + "')";
    db.query(insert_data, function (err) {
      if (err) throw err;
      else {
        console.log('success')
      }
    });

    console.log(tel + ' ' + sum + ' ' + over + ' ' + roam + ' ' + pack + ' ' + content + ' ' + dateForm);
  }
}


module.exports = app;