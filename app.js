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
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let con;
let telex;
let sumex;
let packet;
let period;
let overex;
let blockex;
let roaming;
let contentex;
let discountex;
let packpricex;
let checkProvEx;
let dateForm;

module.exports.fileRead = function readFile(invName) {
try{
  con = fs.readFileSync(invName).toString();
  telex = new RegExp(re.vodafone.telephone, 'im');
  sumex = new RegExp(re.vodafone.sum, 'im');
  packet = new RegExp(re.vodafone.packet, 'im');
  period = new RegExp(re.vodafone.period, 'im');
  overex = new RegExp(re.vodafone.overpack, 'im');
  blockex = new RegExp(re.vodafone.block, 'gim');
  roaming = new RegExp(re.vodafone.roaming, 'im');
  contentex = new RegExp(re.vodafone.contentService, 'im');
  discountex = new RegExp(re.vodafone.discount, 'im');
  packpricex = new RegExp(re.vodafone.packPrice, 'im');
  checkProvEx = new RegExp(re.vodafone.checkProvider, 'gim');

  let dateof = period.exec(con)[0].split('.');
  dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];
  let checkProvider = con.search(checkProvEx);
  //console.log(dateForm);

  checkProv(checkProvider, invName);
 }
catch (e) {
  console.log('Wrong File')
  }

};

function checkProv(checkProvider, invName) {
  if (checkProvider > -1){

  try {
    let selectInv_fromdb = "SELECT TRUE paymentPeriod from invoice where paymentPeriod = " + "'" + dateForm + "'" + " " + "LIMIT 1";
    db.query(selectInv_fromdb, function (err, result) {
      if (err) throw err;
      else {
       insertInv(result, invName);
      }
    });
  }
  catch (e) {
    console.log('error');
   }
  }
  else {
    console.log('wrong file');
  }
}

function insertInv(selectInv, invName) {
  try {
  if (selectInv.length <= 0) {
    let insertInv_todb = "INSERT INTO invoice (provider_id, paymentPeriod, fileName) VALUES ((select id from providers where provider like 'vodafone%'), " + "'" + dateForm + "', " + "'" + invName + "'" + ")";
    db.query(insertInv_todb, function (err) {
      if (err) throw err;
      else {
        insertToDb();
      }
    })
  }
  else {
    console.log('file exist')
  }
  }
  catch (e) {
    console.log(e);
  }
}



function insertToDb() {
  let block = con.match(blockex);

  for (let i = 0; i < block.length; i++) {
    let blocki = block[i];
    let tel = blocki.match(telex)[0];
    let sum = blocki.match(sumex)[0];
    let packprice = blocki.match(packpricex)[0];
    let pack = blocki.match(packet)[0];
    let over = blocki.match(overex);
    let roam = blocki.match(roaming);
    let content = blocki.match(contentex);
    let discount = blocki.match(discountex);

    let contractMonth_todb = "INSERT INTO contractMonth (packet, price, userPhone_id, invoice_id, sum) VALUES " + "('" + pack + "', " +  "'" + packprice + "', " + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" +")," + " " + "'" + sum + "')";
    console.log(contractMonth_todb);
    db.query(contractMonth_todb, function (err) {
       if (err) throw err;
       else console.log('contractMonth success')
    });


    if (over !=null){
      let overpackMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" +over[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" +"), " + "'" + over[2] + "'" + ")";
      console.log(overpackMonth_todb);
      db.query(overpackMonth_todb, function (err) {
        if (err) throw err;
        else console.log('overpack success')
      });
    }

    if (roam !=null){
      let romingMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" +roam[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" +"), " + "'" + roam[2] + "'" + ")";
      db.query(romingMonth_todb, function (err) {
        if (err) throw err;
        else console.log('roaming success')
      });
    }

    if (content !=null){
      let contentMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" +content[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" +"), " + "'" + content[2] + "'" + ")";
      db.query(contentMonth_todb, function (err) {
        if (err) throw err;
        else console.log('content success')
      });
    }


    if (discount !=null){
      let discountMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" +discount[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" +"), " + "'" + discount[2] + "'" + ")";
      db.query(discountMonth_todb, function (err) {
        if (err) throw err;
        else console.log('discount success')
      });
    }
  }
}


module.exports = app;