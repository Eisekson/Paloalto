var express = require('express');

var crypto = require('crypto');

var fs = require('fs');
var encode = "utf-8";



var mysql = require('mysql');


function qu(srcdata, sql) {

    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();

    connection.query(sql.toString(), function (err, result) {
        if (err) {
            console.log(srcdata);
            console.log(sql);
            var str1 = '\n';
            str1 += 'source data: ' + srcdata;
            str1 += 'sql' + sql;
            str1 += '\n';

            fs.appendFile('../../data/ErrorData.txt', str1, function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                else {
                    //console.log(showdata);
                }
            });


            var sa = sql.split(',');
            for (var i = 0; i < sa.length; i++) {
                console.log((i + 1) + "  " + sa[i]);
            }
            console.log(sql.split(',').length);
            throw err;
        }
        console.log('The inseerid is: ', result.insertId);
    });
    connection.end();
}



function logServer() {
    var PORT = 514;
    var HOST = '120.110.114.33';

    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');
    var fs = require('fs');

    server.on('message', function (message, remote) {

        var str = ',' + message.toString();


        

        str = ddd(str);
        /*
        //console.log("原始資料" + str);
        str = str.replace(/\"/g, '');
        str = str.replace(/\'/g, '');
        //console.log("去除'"+'"'+str);
        
        var showdata = str + "\n";
        var data = '("' + str.replace(/\,/g, '","') + '");';
        */
        data = str;
        //console.log(data);

        if (str.search("TRAFFIC") != -1) {
            var sql = 'INSERT INTO traffic VALUES ' + data;
            qu(message.toString(), sql);
        } else if (str.search("THREAT") != -1) {
            console.log(message.toString());
            var sql = 'INSERT INTO threat VALUES ' + data;
            qu(message.toString(), sql);
            //因為
            /*
            if (sql.split(',').length == 44) {
                qu(message.toString(), sql);
            }*/
        }

        fs.appendFile('../../data/log.txt', str, function (err) {
            if (err) {
                console.log(err);
                throw err;
            }
            else {

                //console.log(showdata);
            }
        });
        
    });

    server.bind(PORT, HOST);
}
logServer();


//解決'",問題
function ddd(A) {
    var OUT;
    var start = A.indexOf('"');
    var end = A.lastIndexOf('"');
    var sstr = A.substring(start + 1, end);
    sstr = sstr.replace(/"/g, '\\"');
    return '("' + A.substring(0, start).replace(/,/g, '","') + sstr + A.substring(end + 1, A.length).replace(/,/g, '","') + '");';
}