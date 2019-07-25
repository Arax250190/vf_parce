const fs = require('fs');
const db = require('../db');
const re = require('../../regext');

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
let cdr;

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
        cdrex = new RegExp(re.vodafone.cdr, 'gim');

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
        let tel = blocki.match(telex);
        let sum = blocki.match(sumex);
        let packprice = blocki.match(packpricex);
        let pack = blocki.match(packet);
        let over = blocki.match(overex);
        let roam = blocki.match(roaming);
        let content = blocki.match(contentex);
        let discount = blocki.match(discountex);




        if ((pack !== null ) && (packprice !== null) && (sum !== null)){
            let contractMonth_todb = "INSERT INTO contractMonth (packet, price, userPhone_id, invoice_id, sum) VALUES " + "('" + pack + "', " + "'" + packprice + "', " + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + ")," + " " + "'" + sum + "')";
            console.log(contractMonth_todb);
            db.query(contractMonth_todb, function (err) {
                if (err) throw err;
                else console.log('contractMonth success')
            });
        }


        if (over != null) {
            let overpackMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + over[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + over[2] + "'" + ")";
            console.log(overpackMonth_todb);
            db.query(overpackMonth_todb, function (err) {
                if (err) throw err;
                else console.log('overpack success')
            });
        }

        if (roam != null) {
            let romingMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + roam[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + roam[2] + "'" + ")";
            db.query(romingMonth_todb, function (err) {
                if (err) throw err;
                else console.log('roaming success')
            });
        }

        if (content != null) {
            let contentMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + content[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + content[2] + "'" + ")";
            db.query(contentMonth_todb, function (err) {
                if (err) throw err;
                else console.log('content success')
            });
        }


        if (discount != null) {
            let discountMonth_todb = "INSERT INTO serviceMonth (userPhone_id, serviceName_id, invoice_id, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + "'" + discount[1] + "'" + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + discount[2] + "'" + ")";
            db.query(discountMonth_todb, function (err) {
                if (err) throw err;
                else console.log('discount success')
            });
        }
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
            } else if (cdr[31] !== undefined) {
                if (cdr[38] !== undefined) {
                    let datereform = cdr[34].split('.');
                    let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[35];
                    let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + '"' + cdr[31] + '"' + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[32] + "', " + "'" + cdr[33] + "'," + "'" + dateTime + "', " + "'" + cdr[37] + "', " + "'" + cdr[36] + "', " + "'" + cdr[38] + "', " + "'" + cdr[39] + "'" + ")";
                    db.query(cdrMonth_todb, function (err) {
                        if (err) throw err;
                        else console.log('internet with bonus success')
                    });
                } else {
                    let datereform = cdr[34].split('.');
                    let dateTime = datereform[2] + '-' + datereform[1] + '-' + datereform[0] + ' ' + cdr[35];
                    let cdrMonth_todb = "INSERT INTO CDR (phoneID, serviceNameID, invoiceID, tariffModel, callerID, dateTime, units, QTY, bonusQTY, sum) VALUES (" + "(SELECT id FROM phones WHERE phoneNumber =" + " " + "'" + tel + "'" + "), " + "(SELECT id FROM services WHERE serviceName = " + '"' + cdr[31] + '"' + "), " + "(SELECT id FROM invoice WHERE paymentPeriod = " + "'" + dateForm + "'" + "), " + "'" + cdr[32] + "', " + "'" + cdr[33] + "'," + "'" + dateTime + "', " + "'" + cdr[37] + "', " + "'" + cdr[36] + "', " + "'" + '0' + "', " + "'" + cdr[39] + "'" + ")";
                    db.query(cdrMonth_todb, function (err) {
                        if (err) throw err;
                        else console.log('internet without bonus success')
                    });
                }

            } else if (cdr[40] !== undefined) {
                if (cdr[46] !== undefined) {
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
            } else if (cdr[48] !== undefined) {
                if (cdr[54] !== undefined) {
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

            } else if (cdr[56] !== undefined) {
                if ((cdr[57] !== undefined) && (cdr[62] !== undefined)) {
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
    }
}