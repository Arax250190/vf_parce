//const mysql = require('mysql');
const config = require('./config');
const db = require('./bin/db');
const fs = require('fs');
const re = require('./regext_test')

    const con = fs.readFileSync('./details.txt').toString();
    const telex = new RegExp(re.vodafone.telephone, 'gim');
    const sumex= new RegExp(re.vodafone.sum, 'gim');
    const packet = new RegExp(re.vodafone.packet, 'gim');
    const period = new RegExp(re.vodafone.period, 'gim');
    const overpack = new RegExp(re.vodafone.overpack, 'im');
    const blockex = new RegExp(re.vodafone.block, 'gim');
    const roaming = new RegExp(re.vodafone.roaming, 'im');
    const contentex = new RegExp(re.vodafone.roaming, 'im');

let dateof = period.exec(con)[0].split('.');
let dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];

let block=con.match(blockex);
//let tel;
//let sum;
//let over;
//let roam;
//let pack;
//let content;


for (let i=0; i<block.length; i++) {
    let blocki = block[i];
    //console.log(blocki);

  let  tel = blocki.match(telex)[0];
  let  sum = blocki.match(sumex)[0];
  let  over = blocki.match(overpack);
  let  roam = blocki.match(roaming);
  let  content = blocki.match(contentex);
  let  pack = blocki.match(packet);


  if (over !=null){
      console.log(tel + ' ' + over[1] + ' ' + over[2]);
    }
  if (roam !=null){
      console.log(tel + ' ' + roam[1] + ' ' + roam[2]);
   }
  //else console.log('0');



    /*let insert_data = "INSERT INTO vf_details (phone, sum, packet, overPack, roaming, contentService, period) VALUES" + "('"+ tel +"', " + "'"+ sum +"', " + "'" + pack +"', " + "'"+ over +"', " + "'"+ roam +"', " +"'"+ content +"', " + "'"+ dateForm + "')";
    db.query(insert_data, function (err) {
        if (err) throw err;
        else {
            console.log('success')
        }
    });
    console.log(insert_data);*/
   //console.log(tel + ' ' + sum + ' ' + over + ' ' + roam + ' ' + pack + ' ' + content +' ' + dateForm);
   // console.log(tel + ' ' + over[0]);
}


/*let block=con.match(blockex);


for (let i=0; i<block.length; i++) {
    let test2 = block[i];
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

for (let i=0; i<block.length; i++){
    par(block)
        .then(function () {
        console.log(telex.exec(block[i])[0]);
    })
        .then(function () {
        //let  tel=telex.exec(block[i]);
        console.log(sumex.exec(block[i])[2]);
    })
        .then(function () {
        try {
            let overp=overpack.exec(block[i]);
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

    let tel = telex.exec(block[i])
for (let i=0; i<block.length; i++){
    parce(i)
    telp(i)
}
*/




 /*   for (let i=0; i<block.length; i++) {
        await console.log(block[i]);


        await tel=telex.exec(block[i]);
         console.log(tel[0]);

        let summer=sumex.exec(block[i]);
        await console.log(summer[2]);

        try {
            let overp=overpack.exec(block[i]);
            await console.log(overp[0])
        } catch (e) {
            await  console.log(0.00)
        }
        try {
            let rom = roaming.exec(block[i]);
            await   console.log(rom[2])
        } catch (e) {
            await    console.log(0.00)

        }

    }
    */
   //blockex.exec(con)
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