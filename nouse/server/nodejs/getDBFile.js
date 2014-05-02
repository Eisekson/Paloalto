function con(s) {
    console.log(s);
}

var express = require('express');
var crypto = require('crypto');

var app = express();
var fs = require('fs');
var port = 8083;
var encode = "utf-8";



var web_path = '../../web/paloalto2/paloalto2/paloalto2/';










app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(web_path));
});

var mysql = require('mysql');


dd();

function dd() {
    sql = "SELECT time_generated ,app , count(app) as AppCount FROM threat_hour_data WHERE time_generated between '2013-08-01 00:00:00' and '2013-08-24 00:00:00' group by app order by time_generated,AppCount desc";
    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();

    connection.query(sql, function (err, result) {
        if (err) {
            console.log(new Date().toString());
            console.log(sql);
            throw err;
        }

        getQuery2Data(result);

    });
    connection.end();


}



function getQuery2Data(da) {

    var q2xAxis = [];
    var q2yAxis = [];


    function query2Data(app, count) {
        this.app = app;
        this.count = count;
    }


    var q2AppName = {};

    var a = {};
    //var debug = document.getElementById('debug');
    var tigen = '';
    //計算有多少種時間，以便於給y軸存資料
    var count = 0;
    for (var i = 0; i < da.length; i++) {
        q2AppName[da[i].app.toString()] = true;
        var dat = new Date(da[i].time_generated.toString()).toJSON();
        if (dat != tigen.toString()) {
            tigen = dat.toString();
            a[tigen.toString()] = [];
            a[tigen.toString()].push(new query2Data(da[i].app.toString(), da[i].AppCount));
            count++;
        } else {
            a[tigen.toString()].push(new query2Data(da[i].app.toString(), da[i].AppCount));
        }
    }

    var q2app = {};
    var tarr = [];
    for (var i = 0; i < count; i++) {
        tarr.push(0);
    }
    for (var q2an in q2AppName) {
        q2app[q2an] = tarr.concat();
    }
    //排序+找前十大APP
    for (var aa in a) {
        q2xAxis.push(aa);
        a[aa].sort(function (b, c) {return c['count'] - b['count'] });
        var maxlength = 10;
        if (a[aa].length > maxlength) {
            var killLength = a[aa].length - maxlength;
            for (var i = 0; i < killLength; i++) {
                a[aa].pop();
            }
        }

        // console.log(aa + JSON.stringify(a[aa]));
        // console.log('length' + a[aa].length);


        //debug.textContent += aa + JSON.stringify(a[aa]) + '\n\n';
        //debug.textContent += 'length' + a[aa].length + '\n\n';
    }
    var inde = 0;
    for (var aa in a) {

        var q2arr = a[aa];
        for (var i = 0; i < q2arr.length; i++) {
            q2app[q2arr[i].app.toString()][inde] = q2arr[i].count;
        }
        inde++;
    }


    //轉換成y軸 name data
    for (var q2appp in q2app) {
        q2yAxis.push({ name: q2appp, data: q2app[q2appp] });

    }

    //debug.textContent += '\n\n\n\n';
    // console.log(JSON.stringify(q2yAxis));

    for (var x in q2xAxis) {
        // console.log(q2xAxis[x] + '\n');
    }


    var q2x = {};
    q2x['categories'] = q2xAxis;

    var sendData = {};
    sendData['x'] = q2x;
    sendData['y'] = q2yAxis;
    //fs.writeFileSync('aa.txt',JSON.stringify(sendData));
	return sendData;
    
    //fs.writeFileSync('aa.txt',str);

}

