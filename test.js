//const mysql = require('mysql');
const config = require('./config');
const db = require('./bin/db');
const fs = require('fs');
const re = require('./regext_test')

    const con = fs.readFileSync('./invoice2019_06.txt').toString();
    const telex = new RegExp(re.vodafone.telephone, 'gim');
    const sumex= new RegExp(re.vodafone.sum, 'gim');
    const packet = new RegExp(re.vodafone.packet, 'gim');
    const period = new RegExp(re.vodafone.period, 'gim');
    const overpack = new RegExp(re.vodafone.overpack, 'gim');
    const testex = new RegExp(re.vodafone.block, 'gim');
    const roaming = new RegExp(re.vodafone.roaming, 'gim');
    const contentex = new RegExp(re.vodafone.roaming, 'gim');

let dateof = period.exec(con)[0].split('.');
let dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];

let test=con.match(testex);
let tel;
let sum;
let over;
let roam;
let pack;
let content;


for (let i=0; i<test.length; i++) {
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
       over = test2.match(overpack)[0];
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
    let insert_data = "INSERT INTO vf_details (phone, sum, packet, overPack, roaming, contentService, period) VALUES" + "('"+ tel+"'," + "'"+ sum+"'," + "'"+ pack+"'," + "'"+over+"'," + "'"+roam+"'," +"'"+content+"'," + "'"+dateForm + "')";
    db.query(insert_data, function (err) {
        if (err) throw err;
        else {
            console.log('success')
        }
    });

    console.log(tel + ' ' + sum + ' ' + over + ' ' + roam + ' ' + pack + ' ' + content +' ' + dateForm);
}


/*let test=con.match(testex);


for (let i=0; i<test.length; i++) {
    let test2 = test[i];
    console.log(test2);

    try {
        console.log(test2.match(telex)[0])
    } catch (e) {
        console.log("error parsing tel");
    }

    try {
        console.log(test2.match(sumex)[0]);
    } catch (e) {
        console.log("error parsing sum");
    }

    try {
        console.log(test2.match(overpack)[0])
    } catch (e) {
        console.log(0.00)
    }

    try {
        console.log(test2.match(roaming)[0])
    } catch (e) {
        console.log(0.00)

    }

}*/


//let overp=overpack.exec(test2);
//let rom = roaming.exec(test2);

/*function f(item) {
    tel=telex.exec(item)
    console.log(tel[0])
}*/
/*
let par = function () {
 return new Promise (function (resolve, reject) {
        resolve();
     });
};

for (let i=0; i<test.length; i++){
    par(test)
        .then(function () {
        console.log(telex.exec(test[i])[0]);
    })
        .then(function () {
        //let  tel=telex.exec(test[i]);
        console.log(sumex.exec(test[i])[2]);
    })
        .then(function () {
        try {
            let overp=overpack.exec(test[i]);
           console.log(overp[0])
        } catch (e) {
           console.log(0.00)
        }
    })
        .catch(console.log('error'))
}
*/

/*function telp(i){
    console.log(tel[0])
}

    let tel = telex.exec(test[i])
for (let i=0; i<test.length; i++){
    parce(i)
    telp(i)
}
*/




 /*   for (let i=0; i<test.length; i++) {
        await console.log(test[i]);


        await tel=telex.exec(test[i]);
         console.log(tel[0]);

        let summer=sumex.exec(test[i]);
        await console.log(summer[2]);

        try {
            let overp=overpack.exec(test[i]);
            await console.log(overp[0])
        } catch (e) {
            await  console.log(0.00)
        }
        try {
            let rom = roaming.exec(test[i]);
            await   console.log(rom[2])
        } catch (e) {
            await    console.log(0.00)

        }

    }
    */
   //testex.exec(con)
    //let dateof = period.exec(con)[2].split('.');
    //let dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];

    //checkInv(telex, sumex, packet, dateForm, con, dateof);
    //insertToDb(telex, sumex, packet, dateForm, overpack, con);
    //checkInv(dateof);


//(ПОСЛУГИ, НАДАНІ ЗА МЕЖАМИ ПАКЕТА: \W+)(\d*.\d\d)


//Контр.+\n.+\n\W+\d.+\d{1,5}\n\W+\d+.\d+\n\W+\d+.\d+





/*const select = "SELECT DATE_FORMAT(period, '%m' '.' '%Y') AS \"date\" FROM vf_details";

    db.query(select, function (err, result) {
        if (err) throw err;
        else {
           /* let js = JSON.stringify(result.date);
            let len = js.length;
            for (let i = 0; i <= len; i++){
                console.log(js[i])
            }*/
           /* console.log(JSON.stringify(result))



            //let str = JSON.stringify(result.period);
            //let str2 = JSON.parse(result)
            //console.log(JSON.stringify(result))
            //console.log(str)
            //let json = JSON.parse(str);
           //let per = "DATE_FORMAT\(period, '%m %Y'\)";
           // console.log(str.replace(/"/g, ''));
        }
    });
*/
   // connection.release();
//});
//let dateform = new Intl.DateTimeFormat('uk-UA', { year: 'numeric', month: '2-digit'});
//{timeZone: 'Europe/Kiev', year: 'numeric', month: '2-digit', day: 'numeric'}
//console.log(dateform.format(Date.now()).toString().replace('/', '.'));


/*function converDate(period, con) {
  let dateof = period.exec(con)[2].split('.');
  let dateform = new Date(dateof[2], dateof[1], dateof[0]);
  console.log(dateform);
  //to_db(dateform);
  return dateform;
};*/


/*function checkInv(dateof) {
  let checkdate = dateof[1]+ '.' +dateof[2];
  let dbdate;
  const select_date = "SELECT DATE_FORMAT(period, '%m %Y') AS \"period\" FROM vf_details";
  db.query(select_date, function (err, result) {
    if (err) throw err;
    else {
      let str = JSON.stringify(result[0].period.replace(" ", "."));
      dbdate = str.replace(/"/g, '');
    }
    if (dbdate === checkdate) {
      console.log('You trying to load inv for existent period');
       }
    else console.log('different date' + ' ' + checkdate + ' ' + dbdate)
  });
}*/