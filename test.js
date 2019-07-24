//const mysql = require('mysql');
const config = require('./config');
const db = require('./bin/db');
const fs = require('fs');
const re = require('./regext_test');
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
let outBoundEx;
let cdr;

try{
    con = fs.readFileSync('./invoice2019_06.txt').toString();
    telex = new RegExp(re.vodafone.telephone, 'im');
    sumex = new RegExp(re.vodafone.sum, 'im');
    packet = new RegExp(re.vodafone.packet, 'im');
    period = new RegExp(re.vodafone.period, 'im');
    overex = new RegExp(re.vodafone.overpack, 'im');
    blockex = new RegExp(re.vodafone.cdrBlock, 'gm');
    roaming = new RegExp(re.vodafone.roaming, 'im');
    contentex = new RegExp(re.vodafone.contentService, 'im');
    discountex = new RegExp(re.vodafone.discount, 'im');
    packpricex = new RegExp(re.vodafone.packPrice, 'im');
    checkProvEx = new RegExp(re.vodafone.checkProvider, 'gim');
    outBoundEx = new RegExp(re.vodafone.outBoundCalls, 'gim');
    cdrex = new RegExp(re.vodafone.cdr, 'gim');

    let dateof = period.exec(con)[0].split('.');
    dateForm = dateof[2]+'-'+dateof[1]+'-'+dateof[0];
    let checkProvider = con.search(checkProvEx);
    //console.log(dateForm);

    //checkProv(checkProvider, invName);
}
catch (e) {
    console.log('Wrong File')
}

let block=con.match(blockex);


for (let i = 0; i < block.length; i++) {
    let blocki = block[i];
    let tel = blocki.match(telex);
    let sum = blocki.match(sumex);
    let packprice = blocki.match(packpricex);
    let pack = blocki.match(packet);
    let over = blocki.match(overex);
    let roam = blocki.match(roaming);
    let content = blocki.match(contentex);
    let discount = blocki.match(discountex);



   while (cdr = cdrex.exec(blocki)) {
       if (cdr[1] !== undefined) {
           if (cdr[7] !== undefined) {
               let datereform = cdr[4].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[5];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[2] + "', " + "'" + cdr[3] + "'," + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[6] + "', " + "'" + cdr[7] + "', " + "'" + cdr[8] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('outbound with bonus success')
               });
           } else {
               let datereform = cdr[4].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[5];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[2] + "', " + "'" + cdr[3] + "', " + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[6] + "', " + "'" + '0' + "', " + "'" + cdr[8] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('outbound without bonus success')
               });
           }
       } else if (cdr[9] !== undefined) {
           if (cdr[10] !== undefined) {
               let datereform = cdr[12].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[13];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[9] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[10] + "', " + "'" + cdr[11] + "', " + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[14] + "', " + "'" + '0' + "', " + "'" + cdr[15] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('inbound with tariff model success')
               });
           } else {
               let datereform = cdr[12].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[13];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[9] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + 'Стандартна' + "', " + "'" + cdr[11] + "', " + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[14] + "', " + "'" + '0' + "', " + "'" + cdr[15] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('inbound without tariff model success')
               });
           }
       } else if (cdr[16] !== undefined) {
           if (cdr[17] !== undefined) {
               let datereform = cdr[19].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[20];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[16] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[17] + "', " + "'" + cdr[18] + "', " + "'" + dateTime + "', " + "'" + 'шт' + "', " + "'" + cdr[21] + "', " + "'" + '0' + "', " + "'" + cdr[22] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('inbound message with tariff success')
               });
           } else {
               let datereform = cdr[19].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[20];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[16] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + 'Стандартна' + "', " + "'" + cdr[18] + "', " + "'" + dateTime + "', " + "'" + 'шт' + "', " + "'" + cdr[21] + "', " + "'" + '0' + "', " + "'" + cdr[22] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('inbound message without tariff success')
               });
           }
       } else if (cdr[23] !== undefined) {
           if (cdr[29] !== undefined) {
               let datereform = cdr[26].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[27];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[23] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[24] + "', " + "'" + cdr[25] + "'," + "'" + dateTime + "', " + "'" + 'шт' + "', " + "'" + cdr[28] + "', " + "'" + cdr[29] + "', " + "'" + cdr[30] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('outbound message with bonus success')
               });
           } else {
               let datereform = cdr[26].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[27];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[23] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[24] + "', " + "'" + cdr[25] + "', " + "'" + dateTime + "', " + "'" + 'шт' + "', " + "'" + cdr[28] + "', " + "'" + '0' + "', " + "'" + cdr[30] + "'" + ")";
               //console.log(cdrMonth_todb)
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('outbound message without bonus success')
               });
           }
       }
       else if (cdr[31] !== undefined) {
           if (cdr[38] !== undefined) {
               let datereform = cdr[34].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[35];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + '"' + cdr[31] + '"' + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[32] + "', " + "'" + cdr[33] + "'," + "'" + dateTime + "', " + "'" + cdr[37] + "', " + "'" + cdr[36] + "', " + "'" + cdr[38] + "', " + "'" + cdr[39] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('internet with bonus success')
               });
           }  else {
               let datereform = cdr[34].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[35];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + '"' + cdr[31] + '"' + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[32] + "', " + "'" + cdr[33] + "'," + "'" + dateTime + "', " + "'" + cdr[37] + "', " + "'" + cdr[36] + "', " + "'" + '0' + "', " + "'" + cdr[39] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('internet without bonus success')
               });
           }

       }
       else if (cdr[40] !== undefined) {
           if (cdr[46] !== undefined){
               let datereform = cdr[43].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[44];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[40] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[41] + "', " + "'" + cdr[42] + "'," + "'" + dateTime + "', " + "'" + cdr[46] + "', " + "'" + cdr[45] + "', " + "'" + '0' + "', " + "'" + cdr[47] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('service with qty success')
               });
           } else {
               let datereform = cdr[43].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[44];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[40] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[41] + "', " + "'" + cdr[42] + "'," + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[45] + "', " + "'" + '0' + "', " + "'" + cdr[47] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('service without qty success')
               });
           }
       }
       else if (cdr[48] !== undefined){
           if (cdr[54] !== undefined){
               let datereform = cdr[51].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[52];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[48] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[49] + "', " + "'" + cdr[50] + "'," + "'" + dateTime + "', " + "'" + 'шт' + "', " + "'" + cdr[53] + "', " + "'" + cdr[54] + "', " + "'" + cdr[55] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('outbound  message report with bonus qty success')
               });
           } else {
               let datereform = cdr[51].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[52];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[48] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[49] + "', " + "'" + cdr[50] + "'," + "'" + dateTime + "', " + "'" + 'шт' + "', " + "'" + cdr[53] + "', " + "'" + '0' + "', " + "'" + cdr[55] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('outbound  message report without bonus qty success')
               });
           }

       }
       else if (cdr[56] !== undefined){
           if ((cdr[57] !== undefined) && (cdr[62] !== undefined)){
               let datereform = cdr[59].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[60];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[56] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[57] + "', " + "'" + cdr[58] + "'," + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[61] + "', " + "'" + cdr[62] + "', " + "'" + cdr[63] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('redirected call with tariff model and bonusQTY success')
               });
           } else {
               let datereform = cdr[59].split('.');
               let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[60];
               let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + cdr[56] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + 'Стандартна' + "', " + "'" + cdr[58] + "'," + "'" + dateTime + "', " + "'" + 'min' + "', " + "'" + cdr[61] + "', " + "'" + '0' + "', " + "'" + cdr[63] + "'" + ")";
               db.query(cdrMonth_todb, function (err) {
                   if (err) throw err;
                   else console.log('redirected call without tariff model and bonusQTY success')
               });
           }
       }

   }






























    /* if (over !== null){
           console.log(tel + ' ' + over[1] + ' ' + over[2]);
       }
       if (roam !== null){
           console.log(tel + ' ' + roam[1] + ' ' + roam[2]);
       }*/

    //console.log('################'+ ' '+ tel + ' ' + '#########################');



   /* while (cdr = cdrex.exec(blocki)) {
        if (cdr[1] !== undefined){
            if (cdr[7] !== undefined){
                console.log(cdr[1] + ' ' + cdr[2] + ' ' + cdr[3] + ' ' + cdr[4] + ' ' + cdr[5] + ' ' + cdr[6] + ' ' + cdr[7] + ' ' + cdr[8]);
            }
            else{
                console.log(cdr[1] + ' ' + cdr[2] + ' ' + cdr[3] + ' ' + cdr[4] + ' ' + cdr[5] + ' ' + cdr[6] + ' ' + cdr[8]);
            }
        }
        else if (cdr[9] !== undefined){
            if (cdr[10] !== undefined){
                console.log(cdr[9] + ' ' + cdr[10] + ' ' + cdr[11] + ' ' + cdr[12] + ' ' + cdr[13] + ' ' + cdr[14] + ' ' + cdr[15]);
            }
            else{
                console.log(cdr[9] + ' '  + cdr[11] + ' ' + cdr[12] + ' ' + cdr[13] + ' ' + cdr[14] + ' ' + cdr[15]);
            }
        }
        else if (cdr[16] !== undefined){
            if (cdr[17]!== undefined){
                console.log(cdr[16] + ' ' + cdr[17] + ' ' + cdr[18] + ' ' + cdr[19] + ' ' + cdr[20] + ' ' + cdr[21] + ' ' + cdr[22]);
            }
            else {
                console.log(cdr[16] + ' ' + cdr[18] + ' ' + cdr[19] + ' ' + cdr[20] + ' ' + cdr[21] + ' ' + cdr[22]);
            }
        }
        else if (cdr[39] !== undefined){
            if (cdr[45] !== undefined){
                console.log(cdr[39] + ' ' + cdr[40] + ' ' + cdr[41] + ' ' + cdr[42] + ' ' + cdr[43] + ' ' + cdr[44] + ' ' + cdr[45] + ' ' + cdr[46]);
            }
            else {
                console.log(cdr[39] + ' ' + cdr[40] + ' ' + cdr[41] + ' ' + cdr[42] + ' ' + cdr[43] + ' ' + cdr[44] + ' ' + cdr[46]);
            }
        }
        else if (cdr[31] !== undefined){
            console.log(cdr[31] + ' ' + cdr[32] + ' ' + cdr[33] + ' ' + cdr[34] + ' ' + cdr[35] + ' ' + cdr[36] + ' ' + cdr[37] + ' ' + cdr[38]);
        }
    }*/













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