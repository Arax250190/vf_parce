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
  const contentex = new RegExp(re.vodafone.contentService, 'gim');
  const discountex = new RegExp(re.vodafone.discount, 'gim');
  const packpricex = new RegExp(re.vodafone.packPrice, 'gim');

  let dateof = period.exec(con)[0].split('.');
  let dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];

  insertToDb(telex, sumex, packet, dateForm, overex, blockex, roaming, contentex, discountex, packpricex, con);

};


function insertToDb(telex, sumex, packet, dateForm, overex, blockex, roaming, contentex, discountex, packpricex, con) {
  let block = con.match(blockex);
  let tel;
  let sum;
  let over;
  let roam;
  let pack;
  let content;
  let discount;
  let packprice;


  for (let i = 0; i < block.length; i++) {
    let blocki = block[i];
    //console.log(blocki);

    try {
      tel = blocki.match(telex)[0]
    } catch (e) {
      tel = "error parsing tel";
    }

    try {
      sum = blocki.match(sumex)[0];
    } catch (e) {
      sum = "error parsing sum";
    }

    try {
      over = blocki.match(overex)[0];
    } catch (e) {
      over = 0.00;
    }

    try {
      roam = blocki.match(roaming)[0];
    } catch (e) {
      roam = 0.00;
    }

    try {
      content = blocki.match(contentex)[0];
    } catch (e) {
      content = 0.00;
    }

    try {
      pack = blocki.match(packet)[0];
    } catch (e) {
      pack = "error parsing packet"
    }

    try {
      discount = blocki.match(discountex)[0];
    } catch (e) {
      discount = 0.00;
    }

    try {
      packprice = blocki.match(packpricex)[0];
    } catch (e) {
      discount = 0.00;
    }

    let insert_data = "INSERT INTO vf_details (phone, sum, packet, packPrice, discount, overPack, roaming, contentService, period) VALUES" + "('" + tel + "'," + "'" + sum + "'," + "'" + pack + "'," + "'" + packprice + "'," + "'" + discount + "'," + "'" + over + "'," + "'" + roam + "'," + "'" + content + "'," + "'" + dateForm + "')";
    db.query(insert_data, function (err) {
      if (err) throw err;
      else {
        console.log('success')
      }
    });

    //console.log(tel + ' ' + sum + ' ' + over + ' ' + roam + ' ' + pack + ' ' + content + ' ' + dateForm);
  }
}


module.exports = app;