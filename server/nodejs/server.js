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



var t;
(function (t) {
    var a = (function () {
        function a() {
            this.b = 'a';
        }
        a.prototype.bb = function (b) {
            this.b = b;
        };
        a.prototype.print = function () {
            console.log(this.b);
        };
        return a;
    })();
    t.a = a;
})(t || (t = {}));

var tt = new t.a();
var t2 = new t.a();
t2.bb('b');
tt.print();
t2.print();


/**ThreatChart Query Data class */
var QueryData = (function () {
    function QueryData() {
        /**開始日期*/
        this.fromDate = null;
        /**開始小時*/
        this.fromHour = null;
        /**結束日期*/
        this.toDate = null;
        /**結束小時*/
        this.toHour = null;
        /**APP 0前十大 1前二十大 2前三十大 3前四十大*/
        this.appIndex = null;
    }
    QueryData.prototype.setDate = function () {
        this.fromDate = (document.getElementById('fromDate')).value.toString().replace(/\//g, '-');
        this.fromHour = (document.getElementById('fromHour')).value + ":00";
        this.toDate = (document.getElementById('toDate')).value.toString().replace(/\//g, '-');
        this.toHour = (document.getElementById('toHour')).value + ":00";
        this.appIndex = (document.getElementById('app')).selectedIndex;
    };
    return QueryData;
})();

/**y軸 資料*/
var YAxis = (function () {
    function YAxis(name, data) {
        this.name = null;
        this.data = null;
        this.name = name;
        this.data = data;
    }
    return YAxis;
})();

/**x軸 資料*/
var XAxis = (function () {
    function XAxis() {
        this.categories = null;
        this.categories = [];
    }
    return XAxis;
})();

/**圖表的資料*/
var ChartData = (function () {
    function ChartData() {
        this.yAxis = null;
        this.xAxis = null;
        this.xAxis = new XAxis();
    }
    return ChartData;
})();







app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(web_path));
});

var mysql = require('mysql');


qthr("SELECT * FROM `threat` where  threat.time_generated between str_to_date('2013-06-14 23:00:00','%Y-%m-%d %T') AND str_to_date('2013-06-14 23:59:59','%Y-%m-%d %T')");

function qthr(sql) {
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
        console.log(result[0]);
        console.log(result.length);
        console.log('success');
    });
    connection.end();
}






app.post('/ShowChart/getApp', function (req, res) {
    QueryAppName("SELECT DISTINCT(app) FROM traffic", res);

});

//取得traffic 的 app流量
app.post('/query/traffic', function (req, res) {
    console.log('/query/traffic');
    var sD = JSON.parse(req.body.data);

    console.log(sD['toDate'] + "" + sD['fromDate'] + "" + sD['appIndex'] + "" + sD['toHour'] + "" + sD['fromHour'] + "" + sD['traffic']);
    var fromTime = sD['fromDate'] + " " + sD['fromHour'];
    var toTime = sD['toDate'] + " " + sD['toHour'];
    var tra = sD['traffic'];
    if (tra == '網路使用量') {
        tra = 'bytes';
    }

    sql = "select app, a.time_generated ,a." + tra + " from traffic_hour_data as a NATURAL JOIN (SELECT app   FROM traffic_hour_data    where    time_generated between str_to_date(('" + fromTime + "')    ,'%m-%d-%Y %T') AND str_to_date( ('" + toTime + "')    ,'%m-%d-%Y %T')group by app order by sum(" + tra + ") desc limit 0," + (sD['appIndex'] * 10 + 10) + ") as b    where    time_generated between str_to_date(('" + fromTime + "')    ,'%m-%d-%Y %T') AND str_to_date( ('" + toTime + "')    ,'%m-%d-%Y %T')";
    //sql = "SELECT DISTINCT(app) FROM traffic";
    console.log(sql);
    /*
    * appIndex  0 前十大 1 前二十大 2 前三十大 3 前四十大
    */
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
            //throw err;
            res.jsonp('error');
        }
        try {
            for (var i = 0; i < result.length; i++) {
                if (result[i][tra] == null)
                    result[i][tra] = 0;
            }
            //顯示資料表查詢結果
            //console.log(result);

            var x_arr = new Array();
            var appname = result[0]['app'];

            var sendData = new Object();
            for (var i = 0; i < result.length; i++) {
                if (appname != result[i]['app']) {
                    break;
                }
                x_arr.push(ti(result[i]['time_generated'].toString()));
            }

            sendData['x'] = x_arr;

            var y = new Array();

            appname = result[0]['app'];


            var array = new Array();
            var te = new Object();
            te['name'] = appname;


            for (var i = 0; i < result.length; i++) {
                //console.log(result[i]['app']);
                if (appname != result[i]['app']) {
                    te['name'] = appname;
                    te['data'] = array;
                    //console.log(appname);
                    y.push(te);
                    te = new Object();
                    appname = result[i]['app'];
                    array = new Array();
                }
                array.push(result[i][tra]);

            }
            te['name'] = appname;
            te['data'] = array;
            y.push(te);
            sendData['y'] = y;

            //console.log(result);
            console.log('sendData traffic app ');
            //console.log(JSON.stringify(sendData));

            res.jsonp(sendData);
        } catch (err) {
            console.log(new Date().toString());
            console.log(err.toString());
            res.jsonp('error');
        }

    });
    connection.end();









});

//以App查詢前Ｎ大ip來源量
app.post('/query/apptoip', function (req, res) {
    console.log('/query/apptoip');
    console.log(req.body.data);
    var sD = JSON.parse(req.body.data);

    console.log(sD['time'] + "" + sD['app'] + "" + sD['traffic']);
    var time = sD['time'];
    var sTime = time + ':00:00';
    var eTime = time + ':59:59';
    var app = sD['app'];
    var traffic = sD['traffic'];
    var sql;
    var x_name;
    var y_name;
    var y_data_name;

    //網路使用量
    if (traffic == '網路使用量') {
        x_name = 'src_ip';
        y_name = 'app';
        y_data_name = 'sum(bytes)'
        traffic = 'bytes';
        sql = "select app,src_ip ,sum(bytes)  FROM traffic where app='" + app + "' &&        time_generated between str_to_date(('" + sTime + "')        ,'%Y-%m-%d %T') AND str_to_date( ('" + eTime + "')        ,'%Y-%m-%d %T')        group by app,src_ip order by sum(bytes) desc limit 0,30";

    }
        //session
    else {
        x_name = 'src_ip';
        y_name = 'app';
        y_data_name = 'session';
        sql = "select app,src_ip ,count(app) as 'session'  FROM traffic where app='" + app + "' &&        time_generated between str_to_date(('" + sTime + "')        ,'%Y-%m-%d %T') AND str_to_date( ('" + eTime + "')        ,'%Y-%m-%d %T')        group by app,src_ip  order by count(app) desc limit 0,30";
    }
    console.log(sql);




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
            //throw err;
            res.jsonp('error');
        }
        try {
            console.log("result");
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                if (result[i][traffic] == null)
                    result[i][traffic] = 0;
            }
            console.log(result);

            var x_arr = new Array();
            var appname = result[0][y_name];
            console.log('appname');
            console.log(appname);
            var sendData = new Object();


            for (var i = 0; i < result.length; i++) {
                console.log(result[i][y_name]);
                if (appname != result[i][y_name]) {
                    break;
                }
                x_arr.push(result[i][x_name]);
            }
            console.log(JSON.stringify(x_arr));
            sendData['x'] = x_arr;
            console.log(1);
            var y = new Array();

            appname = result[0][y_name];
            console.log(1);

            var array = new Array();
            var te = new Object();
            te['name'] = appname;
            console.log(1);

            for (var i = 0; i < result.length; i++) {
                console.log(result[i][y_name]);
                if (appname != result[i][y_name]) {
                    te['name'] = appname;
                    te['data'] = array;
                    //console.log(appname);
                    y.push(te);
                    te = new Object();
                    appname = result[i]['app'];
                    array = new Array();
                }
                array.push(result[i][y_data_name]);

            }
            te['name'] = appname;
            te['data'] = array;
            y.push(te);
            sendData['y'] = y;
            sendData['traffic'] = sD['traffic'];
            sendData['app'] = sD['app'];
            sendData['x_name'] = x_name;
            sendData['y_name'] = y_name;
            sendData['y_data_name'] = y_data_name;
            sendData['time'] = sD['time'];
            sendData['N'] = '前三十大';
            //console.log(result);
            console.log(JSON.stringify(sendData));

            res.jsonp(sendData);
        } catch (err) {
            console.log(new Date().toString());
            console.log(err.toString());
            res.jsonp('error');
        }

    });
    connection.end();









});



var queryData;





/**當整點到的時候會呼叫所有的function*/
function onTheHour() {
    var fun = [];
    //插入threat Data
    fun.push(insertThreatData);
    //插入App Data
    fun.push(insertAppData);
    //插入Threat Data
    fun.push(insertTrafficAppData);

    for (var i = 0; i < fun.length; i++) {
        fun[i]();
        setInterval(fun[i], 60 * 60 * 1000);
    }

}


/**在整點的時候執行onTheHour，亦即整點時執行所有我要執行的東西*/
function findOnTheHour() {
    var d = new Date();
    var m = d.getMinutes();
    var time = (60 - m) * 1000 * 60;
    setTimeout(onTheHour, time);
    onTheHour();

    //if (m >= 0 && m <= 1 || m>=59&&m<=60) {
    //    onTheHour();
    //}
}

/**插入Threat的資料*/
function insertThreatData() {

    //var st = '2013-06-15 10:00:00';
    //var et ='2013-06-15 11:00:00';

    var st = getCurrentStartTime();
    var et = getCurrentEndTime();
    var sql = "INSERT INTO paloalto.threat_hour_data (count, time_generated ,session,subtype,app,severity) SELECT * FROM(select null,str_to_date('" + st + "','%Y-%m-%d %T') as time_generated,count(*),subtype, app,severity from threat where (threat.time_generated between  str_to_date('" + st + "','%Y-%m-%d %T') AND str_to_date('" + et + "','%Y-%m-%d %T')) group by  app,severity,subtype) AS tb";
    query(sql);



}


testQuery();

function testQuery() {
    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();


    //st   et
    var sql = "SELECT app,count(app) as appCount FROM `threat_hour_data` WHERE time_generated between '2013-08-15 00:00:00' and '2013-08-23 00:00:00' group by app order by appCount desc limit 10";
    connection.query(sql, function (err, rows) {
        var appp = rows[0]['app'];
        console.log(appp);
        var sql2 = "SELECT * FROM threat_hour_data WHERE app = 'web-browsing' limit 10";

        connection.query(sql2, function (err2, rows2) {
            console.log('testQuery');
            console.log(rows2);
        });
        

    });
    connection.end();
}




//Threat Query1
app.post('/query/threatQuery1', function (req, res) {
    queryData = JSON.parse(req.body.data);
    con(queryData);


    var st = queryData.fromDate + ' ' + queryData.fromHour;
    var et = queryData.toDate + ' ' + queryData.toHour;


    st = transDateMDYToYMD(st);
    et = transDateMDYToYMD(et);


    console.log(st);
    console.log(et);

    var xx = new XAxis();
    var y = new YAxis();
    var xA = [];
    var yA = [];


    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();


    //st   et
    var sql = "SELECT time_generated,subtype,count('subtype') as countSutbype FROM threat_hour_data WHERE time_generated between '"+st+"' and '"+et+"' group by time_generated,subtype";
    connection.query(sql, function (err, rows) {
        if (err) {
            res.jsonp('error');
        }
        else {
            var time_generated = '';
            var map = {};
            var count = 0;
            var subtype = {};

            time_generated = rows[0]['time_generated'].toString();
            for (var i = 0; i < rows.length; i++) {
                subtype[rows[i]['subtype']] = true;
                if (rows[i]['time_generated'].toString() == time_generated.toString()) {
                    //console.log(rows[i]['time_generated']);
                } else {
                    count++;
                    xx.categories.push(rows[i]['time_generated']);
                    time_generated = rows[i]['time_generated'];
                }
            }
            //[0,0,0,0,0,0,0,0]
            var array = [];
            for (var i = 0; i < count; i++) {
                array.push(0);
            }
            //初始化每一個subtype的data陣列
            for (var x in subtype) {
                map[x] = array.concat();
            }
            var count = 0;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i]['time_generated'].toString() == time_generated.toString()) {
                } else {
                    count++;
                    time_generated = rows[i]['time_generated'];
                }
                console.log(rows[i]['countSutbype']);
                map[rows[i]['subtype']][count] = rows[i]['countSutbype'];
            }
            //{url:[0,1],file:[1,2]}  => [{name:url,data:[0,1]},{name:file,data:[1,2]}]
            for (var m in map) {
                yA.push({ name: m, data: map[m] });
            }

            var sendData = {};
            sendData['x'] = JSON.stringify(xx);
            sendData['y'] = JSON.stringify(yA);
            console.log(sendData);


            res.jsonp(sendData);
        }
    });
    connection.end();
});

//Threat Query2
app.post('/query/threatQuery2', function (req, res) {

    queryData = JSON.parse(req.body.data);
    con(queryData);


    var st = queryData.fromDate + ' ' + queryData.fromHour;
    var et = queryData.toDate + ' ' + queryData.toHour;


    st = transDateMDYToYMD(st);
    et = transDateMDYToYMD(et);


    console.log(st);
    console.log(et);
    
    var sql = "SELECT time_generated ,app , count(app) as AppCount FROM threat_hour_data WHERE time_generated between '"+st+"' and '"+et+"' group by app order by time_generated,AppCount desc";
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
        var sendData = getQuery2Data(result);
        res.jsonp(sendData);

    });
    connection.end();

    

});


////Threat Query3
app.post('/query/threatQuery3', function (req, res) {


    queryData = JSON.parse(req.body.data);
    con(queryData);

    //取
    var sql = "select app,count(*),severity from threat_hour_data where (threat_hour_data.time_generated between  str_to_date('" + queryData.fromDate + " " + queryData.fromHour + "','%Y-%m-%d %T') AND str_to_date('" + queryData.toDate + " " + queryData.toHour + "','%Y-%m-%d %T')) group by  app,severity order by count(*) desc limit 0 ,10";

    console.log(sql);
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
        console.log(result);
        //parse X   Y

        var x = new XAxis();
        var y = new YAxis();











        res.jsonp(result);
        console.log('success');

    });
    connection.end();





});





//查詢threat 時間區段Threat
app.post('/ShowChart/threat/subType', function (req, res) {
    console.log('/ShowChart/threat/subType');
    var sD = JSON.parse(req.body.data);

    console.log(sD['toDate'] + "" + sD['fromDate'] + "" + sD['subType'] + "" + sD['toHour'] + "" + sD['fromHour']);
    var fromTime = sD['fromDate'] + " " + sD['fromHour'];
    var toTime = sD['toDate'] + " " + sD['toHour'];
    var st = sD['subType'];

    //var tra = sD['traffic'];
    //if (tra == '網路使用量') {
    //    tra = 'bytes';
    //}

    var sql = "select count(count) as session from paloalto.threat where (time_generated BETWEEN str_to_date( ( '" + fromTime + "'), '%Y-%m-%d %T' ) AND str_to_date( ('" + toTime + "'), '%Y-%m-%d %T' )) && subtype =" + "'" + st + "'"


    //sql = "SELECT DISTINCT(app) FROM traffic";
    console.log(sql);
    /*
    * appIndex  0 前十大 1 前二十大 2 前三十大 3 前四十大
    */
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
            //throw err;
            res.jsonp('error');
        }
        try {
            console.log(result);







            for (var i = 0; i < result.length; i++) {
                if (result[i][st] == null)
                    result[i][st] = 0;
            }



            //x軸
            var x_arr = new Array();
            //y軸
            var y = new Array();
            //送出的資料
            var sendData = new Object();
            //name
            var stName = result[0]['subtype'];


            //塞入x軸資料   時間

            for (var i = 0; i < result.length; i++) {
                if (stName != result[i]['subtype']) {
                    break;
                }
                x_arr.push(ti(result[i]['time_generated'].toString()));
            }
            sendData['x'] = x_arr;


            //塞入y軸資料
            var array = new Array();
            var te = new Object();
            te['name'] = stName;

            for (var i = 0; i < result.length; i++) {
                //console.log(result[i]['app']);
                if (appname != result[i]['subtype']) {
                    te['name'] = stName;
                    te['data'] = array;
                    //console.log(appname);
                    y.push(te);
                    te = new Object();
                    stName = result[i]['subtype'];
                    array = new Array();
                }
                array.push(result[i]['session']);

            }
            te['name'] = stName;
            te['data'] = array;
            y.push(te);
            sendData['y'] = y;


            /*
            var appname = result[0]['app'];
            
            appname = result[0]['app'];

            var array = new Array();
            var te = new Object();
            te['name'] = appname;


            for (var i = 0; i < result.length; i++) {
                //console.log(result[i]['app']);
                if (appname != result[i]['app']) {
                    te['name'] = appname;
                    te['data'] = array;
                    //console.log(appname);
                    y.push(te);
                    te = new Object();
                    appname = result[i]['app'];
                    array = new Array();
                }
                array.push(result[i][tra]);

            }
            te['name'] = appname;
            te['data'] = array;
            y.push(te);
            sendData['y'] = y;

            //console.log(result);
            console.log('sendData traffic app ');
            //console.log(JSON.stringify(sendData));

            res.jsonp(sendData);
            */
        } catch (err) {
            console.log(new Date().toString());
            console.log(err.toString());
            res.jsonp('error');
        }

    });
    connection.end();






});


//查詢 subtype 
app.post('/query/threat/subtype', function (req, res) {

    var sql = 'select DISTINCT(subtype) from  threat';
    console.log(sql);
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
        console.log(result);
        res.jsonp(result);
        console.log('success');

    });
    connection.end();





});





app.listen(port);




//插入每小時的資料
//setInterval(insertAppData, 60 * 60 * 1000);
//setInterval(insertThreatAppData, 60 * 60 * 1000);
findOnTheHour();

//插入app資料，比較慢，但是不會報錯
function insertAppData() {

    var pool = mysql.createPool({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });


    pool.getConnection(function (err, connection) {
        var sql = "SELECT DISTINCT(app) FROM traffic";
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(new Date().toString());
                console.log(sql);
                throw err;
            }
            ;
            writeFile('Server_Log.txt', '\nInsertAppData:\n' + 'startTime: ' + getCurrentStartTime() + '  endTime: ' + getCurrentEndTime());

            count = 0;
            for (var i = 0; i < result.length; i++) {
                var ap = result[i]['app'];
                var time_start = "'" + getCurrentStartTime() + "'";
                var time_end = "'" + getCurrentEndTime() + "'";
                var app = "'" + ap + "'";
                var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
                pool.getConnection(function (err2, connection2) {
                    connection2.query(sql2, function (err2, result) {
                        if (err2) {
                            console.log(new Date().toString());
                            //console.log(sql2);
                        }
                        count++;
                        writeFile('Server_Log.txt', count + ',');
                        if (result.length <= count) {
                            writeFile('Server_Log.txt', '\n');
                        }
                    });

                    connection2.end();
                });
            }
        });
        connection.end();
    });

    /*
    //var ts = getCurrentStartTime();
    //var te = getCurrentEndTime();
    //var ap = "dns";
    //var time_start = "'"+ts+"'";
    //var time_end = "'"+te+"'";  
    //var app = "'" + ap + "'";
    //var sql = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=('dns') ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=('dns')&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
    //query(sql);
    */
}


//插入Threat的app資料，比較慢，但是不會報錯
function insertTrafficAppData() {

    var pool = mysql.createPool({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });


    pool.getConnection(function (err, connection) {

        connection.query("SELECT DISTINCT(app) FROM traffic", function (err, result) {
            if (err) {
                console.log(new Date().toString());
                console.log(sql);
                throw err;
            }
            ;
            writeFile('Server_Log.txt', '\nInsertAppData:\n' + 'startTime: ' + getCurrentStartTime() + '  endTime: ' + getCurrentEndTime());

            count = 0;
            for (var i = 0; i < result.length; i++) {
                var ap = result[i]['app'];
                var time_start = "'" + getCurrentStartTime() + "'";
                var time_end = "'" + getCurrentEndTime() + "'";
                var app = "'" + ap + "'";
                var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
                pool.getConnection(function (err2, connection2) {
                    connection2.query(sql2, function (err2, result) {
                        if (err2) {
                            console.log(new Date().toString());
                            //console.log(sql2);
                        }
                        count++;
                        writeFile('Server_Log.txt', count + ',');
                        if (result.length <= count) {
                            writeFile('Server_Log.txt', '\n');
                        }
                    });

                    connection2.end();
                });
            }
        });
        connection.end();
    });

    /*
    //var ts = getCurrentStartTime();
    //var te = getCurrentEndTime();
    //var ap = "dns";
    //var time_start = "'"+ts+"'";
    //var time_end = "'"+te+"'";  
    //var app = "'" + ap + "'";
    //var sql = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=('dns') ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=('dns')&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
    //query(sql);
    */
}



function insertAppData_quick() {


    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });


    connection.connect();
    //查詢所有APP
    connection.query("SELECT DISTINCT(app) FROM traffic", function (err, result) {
        if (err) {
            console.log(new Date().toString());
            console.log(sql);
            throw err;
        }
        ;
        writeFile('Server_Log.txt', '\nInsertAppData:\n' + 'startTime: ' + getCurrentStartTime() + '  endTime: ' + getCurrentEndTime());

        count = 0;
        for (var i = 0; i < result.length; i++) {
            var ap = result[i]['app'];
            var ts = getCurrentStartTime();
            var te = getCurrentEndTime();
            var time_start = "'" + ts + "'";
            var time_end = "'" + te + "'";
            var app = "'" + ap + "'";
            var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
            //插入一個小時內的app使用量
            connection.query(sql2, function (err2, result2) {
                if (err2) {
                    console.log(new Date().toString());
                    //console.log(sql2);
                }
                count++;
                writeFile('Server_Log.txt', count + ',');
                if (result.length <= count) {
                    writeFile('Server_Log.txt', '\n');
                }
                //console.log(count++);
            });
            //query(sql2);           

        }
    });
    connection.end();

    /*
    //var ts = getCurrentStartTime();
    //var te = getCurrentEndTime();
    //var ap = "dns";
    //var time_start = "'"+ts+"'";
    //var time_end = "'"+te+"'";  
    //var app = "'" + ap + "'";
    //var sql = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=('dns') ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=('dns')&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
    //query(sql);
    */
}





//console.log(getMyTime(4,3,2));
//insertAppData2();


//insertAppData2();
//插入app資料
function insertAppData2() {

    var pool = mysql.createPool({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto',
        connectionLimit: 100
    });


    pool.getConnection(function (err, connection) {

        connection.query("SELECT DISTINCT(app) FROM traffic", function (err, result) {

            console.log(result.length);
            var sday = 2;
            var eday = 5;
            var mm = 5;
            //2號到5號
            for (j = 2; j <= 5; j++) {
                //24小時
                for (var k = 0; k < 24; k++) {
                    for (var i = 0; i < result.length; i++) {
                        var tts = getMyTime(mm, j, k);
                        var tte = getMyTime(mm, j, k + 1);
                        console.log(tts);
                        console.log(tte);

                        var ap = result[i]['app'];
                        var time_start = "'" + tts + "'";
                        var time_end = "'" + tte + "'";
                        var app = "'" + ap + "'";
                        var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
                        pool.getConnection(function (err, connection2) {
                            connection2.query(sql2, function (err, result) {
                                console.log(new Date().toString());
                                if (err) console.log(err);

                                console.log(result);
                            });
                            connection2.end();
                        });
                    }

                }
            }



        });
        connection.end();
    });



    //var res;
    //connection.connect();
    ////查詢所有APP
    //connection.query("SELECT DISTINCT(app) FROM traffic", function (err, result) {
    //    if (err) {
    //        console.log("SELECT DISTINCT(app) FROM traffic");
    //        throw err;
    //    }
    //    var tts = "2013-05-05 12:00:00";
    //    var tte = "2013-05-05 13:00:00";
    //    writeFile('Server_Log.txt', '\nTestInsertAppData:\n' + 'startTime: ' +tts + '  endTime: ' + tte);


    //    res = result;
    //    count = 0;
    //    for (var i = 0; i < result.length; i++) {
    //        var ap = result[i]['app'];

    //        var time_start = "'" + tts + "'";
    //        var time_end = "'" + tte + "'";
    //        var app = "'" + ap + "'";
    //        var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
    //        //插入一個小時內的app使用量
    //        //query(sql2);
    //        //connection.query(sql2, function (err2, result2) {
    //        //    if (err2) {
    //        //        console.log(err2);
    //        //    }
    //        //    count++;
    //        //    writeFile('Server_Log.txt', count + ',');
    //        //    if (result.length == count) {
    //        //        writeFile('Server_Log.txt', 'finish\n');
    //        //    }
    //        //    //console.log(count++);
    //        //});
    //        ////query(sql2);           

    //    }
    //});
    //connection.end(function (result) {
    //    console.log(res);
    //    count = 0;
    //    for (var i = 0; i < result.length; i++) {
    //        var ap = result[i]['app'];

    //        var time_start = "'" + tts + "'";
    //        var time_end = "'" + tte + "'";
    //        var app = "'" + ap + "'";
    //        var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
    //        //插入一個小時內的app使用量
    //        //query(sql2);
    //        //connection.query(sql2, function (err2, result2) {
    //        //    if (err2) {
    //        //        console.log(err2);
    //        //    }
    //        //    count++;
    //        //    writeFile('Server_Log.txt', count + ',');
    //        //    if (result.length == count) {
    //        //        writeFile('Server_Log.txt', 'finish\n');
    //        //    }
    //        //    //console.log(count++);
    //        //});
    //        ////query(sql2);           

    //    }


    //    });

    //    //console.log(res);


    //    /*
    //    //var ts = getCurrentStartTime();
    //    //var te = getCurrentEndTime();
    //    //var ap = "dns";
    //    //var time_start = "'"+ts+"'";
    //    //var time_end = "'"+te+"'";  
    //    //var app = "'" + ap + "'";
    //    //var sql = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=('dns') ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=('dns')&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= ('dns') &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
    //    //query(sql);
    //    */
}



//-------------------------------------------------------------------------------------
//-------------------------------------Query Function----------------------------------

//單純Query
function query(sql) {

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
        console.log('success');
    });
    connection.end();

}

//找app所有的名稱
function QueryAppName(sql) {

    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();

    connection.query(sql.toString(), function (err, result) {
        if (err) {
            console.log(new Date().toString());
            console.log(sql);
            throw err;
        }
        console.log();
        res.jsonp(result);
    });
    connection.end();

}


function QueryTrafficOfApp(sql) {

    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();

    connection.query(sql.toString(), function (err, result) {
        if (err) {
            console.log(new Date().toString());
            console.log(sql);
            throw err;
        }
        console.log();
        res.jsonp(result);
    });
    connection.end();
}




//-------------------------------------------------------------------------------------
//-----------------------------------------function------------------------------------

//轉換時間 07-20-2013 00:00:00 成 2013-07-20 00:00:00
function transDateMDYToYMD(time) {
    var d = new Date(time);
    var ti = d.toJSON();
    ti = ti.substring(0, 19);
    ti = ti.replace(/T/g, ' ');
    return ti;
}

//取得結束時間  格式為 2013-05-05 11:00:00
function getCurrentEndTime() {
    var st = "";
    var d = new Date();
    d.setHours(d.getHours() + 1 + 8, 0, 0);
    st = d.toJSON();
    st = st.substring(0, 19);
    st = st.replace(/T/g, ' ');
    return st;
}
//取得開始時間  格式為 2013-05-05 10:00:00
function getCurrentStartTime() {
    var st = "";
    var d = new Date();
    d.setHours(d.getHours() + 8, 0, 0);
    d.setMinutes(0, 0);
    st = d.toJSON();
    st = st.substring(0, 19);
    st = st.replace(/T/g, ' ');
    return st;
}
//取得指定的時間 month day hour
function getMyTime(mm, dd, hh) {
    mm -= 1;
    hh += 8;
    var st = "";
    var d = new Date();
    d.setMonth(mm, dd);
    d.setHours(hh, 0, 0);
    st = d.toJSON();
    st = st.substring(0, 19);
    st = st.replace(/T/g, ' ');
    return st;
}
/**取得指定的時間 year month day hour*/
function getMyTime(yyyy, mm, dd, hh) {
    mm -= 1;
    hh += 8;
    var st = "";
    var d = new Date();
    d.setYear(yyyy);
    d.setMonth(mm, dd);
    d.setHours(hh, 0, 0);
    st = d.toJSON();
    st = st.substring(0, 19);
    st = st.replace(/T/g, ' ');
    return st;
}
//將資料寫入檔案  將data字串，寫入檔名為fileName的檔案中，如果沒有檔案它會自行建立。
function writeFile(fileName, data) {
    fs.appendFile(fileName, data, function (err) {
        if (err)
            console.log(new Date().toString());
        console.log(err);

    });

}

function ti(st) {
    var date = new Date(st);
    date.setHours(date.getHours() + 8);
    st = date.toJSON();
    st = st.substring(0, 13);
    st = st.replace(/T/g, ' ');
    return st;
}



/**回傳下一小時的 年 月 日 時
* @param t 2013/05/05 10:00:00
*/
function getNextHour(t) {
    var d = new Date(t.replace('-', '/'));
    d.setHours(d.getHours() + 1 + 8);
    alert(d.toString());
    alert(d.toJSON());
    var s = d.toJSON();
    //s.replace('/', '-');
    s = s.replace('T', ' ');
    s = s.substr(0, 19);
    return t;
}


//--------function-----------------------
/* 
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒 
* 或者可以 10-12-2010
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00 
* 2010-10-12 01:00:00
* 2010-9-12 01:00:00
* 返回精度为：秒，分，小时，天 
*/
function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写 
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间 
    var eTime = new Date(endTime); //结束时间 
    //作为除数的数字 
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }

    return ((eTime.getTime() - sTime.getTime()) / divNum);
}

/**把每一小時的時間轉成x軸 st 開始時間  總共有幾小時*/
function getAxisEachHour(st,len) {
    var axis = [];
    for (var i = 0; i < len; i++) {
        axis.push(getNextHour(st));
    }
    return axis;
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
        q2xAxis.push(aa.substr(11,2));
        a[aa].sort(function (b, c) { return c['count'] - b['count'] });
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

    var sendData = {};
    sendData['x'] = JSON.stringify(q2xAxis);
    sendData['y'] = JSON.stringify(q2yAxis);
    //fs.writeFileSync('aa.txt',JSON.stringify(sendData));
    return sendData;

    //fs.writeFileSync('aa.txt',str);

}










//connection.connect();

//connection.query('INSERT INTO traffic VALUES ("","<14>Apr  5 15:22:33 1","2013/04/05 15:22:33","001606000830","TRAFFIC","end","1","2013/04/05 15:22:32","120.110.114.22","199.47.216.174","","","rule1","","","incomplete","vsys1","trust","untrust","ethernet1/2","ethernet1/1","PU-1","2013/04/05 15:22:33","27392","1","64953","443","0","0","0x0","tcp","allow","132","132","0","2","2013/04/05 15:22:25","3","any","0","35841150","0x0","Taiwan ROC","United States","0","2","0");', function (err, result) {
//    if (err) throw err;
//    console.log('The result is: ', result);
//});


//connection.end();

//connection.connect();

//connection.query('SELECT * from traffic', function (err, rows, fields) {
//    if (err) throw err;
//    console.log('The solution is: ', rows);
//});

//connection.end();







//// Json 資料解析轉換
//var qs = require('querystring');
//var patt1 = "['~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
//// 資料庫
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('DrawData.db');
//var Stroke_writing_path = "Stroke_Write_P_no,User_no,Draw_Text,Draw_Env,CC_Level_Start_Time_End_Time_Text_File_Path,Picture_File_Path,Red"
//		.split(",");
//var file_path_and_name = "";
//// 將資料存入資料庫中
//// 儲存檔名
//var data_file_name = "";
//// 合併資料暫存
//var data = new Array(10);
//// 將傳入的使用者寫字資訊拆解成可以存入SQL內的資料
//function add_data(d, res) {

//	// 計算傳入值
//	var da;

//	// Stroke_Write_P_no
//	// 要先取出最新的值+1後放入
//	// 不在這裡增加，要記得在insert into 時給data[0] 值
//	/*
//	 * da = d.start_time + "" + d.end_time; data[0] = "'" + da + "'";
//	 */

//	// User_no
//	da = d.user_no;
//	if (da.match(patt1) != null) {
//		da = "";
//	}
//	data[1] = "'" + da + "'";

//	// Draw_Text
//	da = d.draw_text;
//	if (da.match(patt1) != null) {
//		da = "";
//	}
//	data[2] = "'" + da + "'";

//	// Draw_Env
//	da = d.draw_env;
//	data[3] = "'" + da + "'";

//	// CC_Level
//	da = d.cc_level;
//	if (da.match(patt1) != null) {
//		da = "";
//	}
//	data[4] = "'" + da + "'";

//	// Start_Time
//	da = d.start_time;
//	data[5] = "'" + da + "'";

//	// End_Time
//	da = d.end_time;
//	data[6] = "'" + da + "'";

//	// Text_File_Path
//	// da = d.start_time + "" + d.end_time + ".txt";
//	// data[7] = "'" + da + "'";

//	// Picture_File_Path
//	// da = d.start_time + "" + d.end_time + ".png";
//	// data[8] = "'" + da + "'";
//	insert_to_sql(d, res);
//}

//// 新增資料到 "Stroke_writing_path" 資料表
//function insert_to_sql(usr, res) {
//	var table_name = "Stroke_writing_path";
//	db.serialize(function() {
//		var sqldata;
//		var i;
//		var file_data = usr.pen_draw;
//		var img_data = usr.pen_draw_picture;
//		var file_encode = 'u';
//		var img_encode = 'u';

//		// 將書寫路徑寫入檔案中
//		// save_file(file_path_and_name, file_encode, file_data);

//	    // db.run("insert into test values(123,'d');");

//	    //red 是否有描紅		
//		data[9] = "'" + usr.red + "'";

//		db.all("select * from " + table_name, function(err, rows) {
//			console.log(rows);
//			// 如果還沒有資料時的處理
//			if (rows.length == 0) {
//				console.log('undefined!!!!!!!!!!!!!!!!!!!!!!');
//				data[0] = "'1'";
//				data[7] = "'1.txt'";
//				data[8] = "'1.txt'";
//				file_path_and_name = data_text_path + "1.txt";
//				img_path_and_name = data_img_path + "1.txt";
//				data_file_name = "1";
//				sqldata = data.toString();
//			}
//			// 新增最新的資料
//			else {
//				console.log('not undefined');
//				i = rows[rows.length - 1].Stroke_Write_P_no;
//				i++;
//				console.log("Hello" + rows);
//				data[0] = "'" + i + "'";
//				data[7] = "'" + i + ".txt'";
//				data[8] = "'" + i + ".txt'";
//				file_path_and_name = data_text_path + i + ".txt";
//				img_path_and_name = data_img_path + i + ".txt";
//				sqldata = data.toString();
//			}

//			save_file(img_path_and_name, img_encode, img_data);
//			save_file(file_path_and_name, file_encode, file_data);
//			res_image(img_path_and_name, res);
//            //回傳資料庫語法   
//			//res.jsonp(sqldata);
//			db.run("insert into " + table_name + " values(" + sqldata + ");");
//			console.log(sqldata);
//			console.log("insert data");
//		});

//	});
//}
//function res_image(file_path, res) {
//	var encode = 'binary';
//	try {
//		fs.readFile(file_path, encode, function(err, data) {
//			res.send(data);
///*
// * res.set('Content-Type', file_type);
// *  // // console.log('send '+file_path+' file'); // console.log(data); if
// * (encode == 'binary') { res.writeHead(200, { "Content-Type" : file_type }); //
// * console.log("test1"); // console.log(data);
// * 
// * res.write(data, "binary"); // console.log("test2"); res.end();
// *  } else { res.writeHead(200, { "Content-Type" : file_type }); //
// * console.log("test1"); // console.log(data);
// * 
// * res.write(data); // console.log("test2"); res.end();
// *  }
// */
//		});
//	} catch (err) {
//		console.log(err);
//	}
//}

//// 寫入檔案
//function save_file(file_path_and_name, file_encode, file_data) {

//	// file path and name
//	// EX: C:/dd/d.txt
//	// ./text/xx.txt

//	// file_type
//	// EX: image is binary
//	// default is utf-8
//	// text had better to utf-8

//	if (file_encode = 'u') {
//		file_encode = "utf-8";
//	} else if (file_encode = 'b') {
//		file_encode = 'binary';
//	}

//	fs.writeFile(file_path_and_name, file_data, file_encode, function(err) {
//		if (err) {
//			console.log(file_path_and_name);
//			console.log(err);
//		} else {
//			console.log("The " + file_path_and_name + " file was saved!");
//		}
//	});

//}

//function send_file(file_path, res) {
//	var flag = true;
//	var file_type;

//	var type = file_path.match('.html|.js|.css|.png');

//	// console.log(type);
//	if (type == null)
//		flag = false;
//	else
//		switch (type[0]) {
//		case '.html':
//			encode = 'utf-8';
//			file_type = 'text/html';
//			break;
//		case '.js':
//			encode = 'utf-8';
//			file_type = 'text/javascript';
//			break;
//		case '.css':
//			encode = 'utf-8';
//			file_type = 'text/css';
//			break;
//		case '.png':
//			encode = 'binary';
//			file_type = 'image/png';
//			break;
//		default:
//			flag = false;
//			break;
//		}

//	if (flag && file_path != "undefined.png")
//		try {
//			fs.readFile(file_path, encode, function(err, data) {
//				res.set('Content-Type', file_type);
//				// // console.log('send '+file_path+' file');
//				// console.log(data);
//				if (encode == 'binary') {
//					res.writeHead(200, {
//						"Content-Type" : "image/png"
//					});
//					// console.log("test1");
//					// console.log(data);

//					res.write(data, "binary");
//					// console.log("test2");
//					res.end();

//				} else {
//					res.writeHead(200, {
//						"Content-Type" : file_type
//					});
//					// console.log("test1");
//					// console.log(data);

//					res.write(data);
//					// console.log("test2");
//					res.end();

//				}

//			});
//		} catch (err) {
//			console.log(err);
//		}
//}

//app.post('/textdraw', function(req, res) {
//	console.log("seu");
//	var formData = "";
//	req.on("data", function(data) {
//		formData += data;
//	});
//	req.on("end", function() {

//		user = qs.parse(formData);
//		console.log(user);

//		// 基本資料放入sqlite
//		// 合併資料+存入資料庫+將書寫路徑寫入檔案中
//		add_data(user);

//		try {
//			res.redirect(req.url);
//		} catch (e) {
//			// TODO: handle exception
//		}

//	});
//	console.log(req.route);

//});

////app.get('/', function(req, res) {
////	res.redirect('\index.html');
////});

////app.get('/:id', function(req, res) {
////	try {
////		var path = req.params.id;
////		console.log(path);
////		path = root_path + path;
////		console.log(path);
////		send_file(path, res);
////	} catch (err) {
////		console.log(err);
////	}

////});




////app.get('/img/:data', function(req, res) {
////	// //console.log('djdsfsdf');
////	var path = req.params.data;
////	path = root_path + image_path + path;
////	// //console.log(path);
////	send_file(path, res);
////});

//app.post('/data/randomText', function (req, res) {
//    var str = '的不一我是人有了大國來生在子們中上他時小地出以學可自這會成家到為天心年然要得說過個著能下動發臺麼車那行經去好開現就作後多方如事公看也長面力起裡高用業你因而分市於道外';
//    var c = '';
//    var d;
//    for (var i = 0; i < 30; i++) {
//        var x = Math.random() * 100;
//        var s = str.charAt(x % str.length);
//        if (c.indexOf(s) == -1) {
//            c += s;
//        } else {
//            i--;
//        }
//    }
//    console.log(c);

//    res.jsonp(JSON.stringify(c));
//});

//app.post('/data/data', function(req, res) {


//    var formdata = "";
//    console.log('data');
//    var usr = JSON.parse(req.body.data);
//    console.log(usr);

//    	    console.log('/data/data  接收學生寫字資料解析結果'+usr);

//		var flag = false;
//		var data_md5 = usr.md5;
//		delete usr['md5'];
//		var sr = JSON.stringify(usr);
//		var shasum = crypto.createHash('md5');
//		shasum.update(sr);
//		var d = shasum.digest('hex');

//		if (data_md5 == d)
//		    flag = true;
//		else {
//		    console.log('資料接收不完全');
//		    res.jsonp('資料接收不完全');
//		    return; 
//		}
//		if (flag) {
//			add_data(usr,res);
//			// res.send(usr['pen_draw_picture']);
//		}
//    //回傳資訊
//		res.jsonp("OK");
//		// 可在這裡測試讀取檔案後是否可以正常顯示

//});

////取得所有學生的書寫資料
//app.post('/data/tn', function(req, res) {
//	var table_name = "Stroke_writing_path";
//	db.serialize(function() {
//		db.all("select * from "+table_name, function(err, rows) {
//			console.log(rows);
//			var map = new Object();
//			var sa = new Array();
//			var ta = new Array();
//			//將每個學生找出來
//			var i =0;
//			//var taa = new Object();
//			//
//			var stu = new Object(); 
//			while(i<rows.length){
//				//console.log(rows[i].User_no);
//				var row = rows[i];
//				var un = row.User_no;				
//				stu[un]=un;			
//				i++;
//			}
//			for(var s in stu){
//				sa.push(s);
//			}
//			map['S']= sa;
//			for(var i=0;i<sa.length;i++){
//				var s = sa[i];
//				var taa = new Array();
//				for(var j=0;j<rows.length;j++){
//					var row = rows[j];
//					if(row.User_no == s){
//						var tam = new Object();
//						tam['text'] = row.Draw_Text;
//						tam['Stroke_Write_P_no']=row.Stroke_Write_P_no;
//						//path & picture
//						tam['path'] = row.Text_File_Path;
//						tam['picture'] =row.Picture_File_Path;
//						taa.push(tam);
//					}
//				}
//				ta.push(taa);
//			}
//			map['T']=ta;
//			var jstr = JSON.stringify(map);
//			var md5sum = crypto.createHash('md5');
//			md5sum.update(jstr);
//			var d = md5sum.digest('hex');
//			map['MD5'] = d;
//			console.log(d);
//			var jstr = JSON.stringify(map);
//			res.send(jstr);
//		});
//	});
//});



////取得使用者要求書寫路徑的請求並送出路徑
//app.post('/data/textpath', function(req, res) {
//	var formData = "";
//	req.on("data", function(data) {
//		formData += data;
//	});
//	req.on("end", function() {
//		//var filename = qs.parse(formData);
//		var filename = JSON.parse(formData);
//		var file_path = data_text_path + filename;
//		res_data(file_path, res);
//	});

//});
////取得使用者要求書寫字圖片的請求並送出圖片
//app.post('/data/textimage', function(req, res) {
//	var formData = "";
//	req.on("data", function(data) {
//		formData += data;
//	});
//	req.on("end", function() {
//		//var filename = qs.parse(formData);
//		var filename = JSON.parse(formData);
//		var file_path = data_img_path + filename;
//		res_data(file_path, res);
//	});
//});
////送出檔案裡面的資料
//function res_data(file_path, res) {
//	var encode = 'binary';
//	try {
//		fs.readFile(file_path, encode, function(err, data) {
//			console.log(file_path);	
//			console.log(data);	
//			res.send(data);
//		});
//	} catch (err) {
//		console.log(err);
//	}
//}
////接收教師評分的資料，並且存進資料庫內
//app.post('/Tea_Eva/Grade',function(req,res){
//	var receiveDataStr = "";
//	req.on("data", function(data) {
//		receiveDataStr += data;
//	});
//	req.on("end", function() {
//		//var filename = qs.parse(formData);
//		var receiveData = JSON.parse(receiveDataStr);
//		console.log(receiveData);
//		var rdmd5 = receiveData['MD5'];
//		delete receiveData['MD5'];
//		var rdtomd5 = MD5(receiveData);
//		console.log('rdmd5'+rdmd5);
//		console.log('rdtomd5'+rdtomd5);
//		//如果接收資料正確的話才會寫入資料庫，未來還要新增錯誤重傳的功能
//		if(rdmd5 == rdtomd5){
//			console.log('receive Tea_Eva MD5 checked right.');
//			console.log(receiveData);
//			insert_teaEva_to_database(receiveData['evaData']);
//		}

//	});

//});

////將教師評分資料放入資料庫中
//function insert_teaEva_to_database(insertData){
//		var table_name = "Teacher_Evaluation";
//		db.serialize(function() {
//			console.log(insertData);
//			console.log(insertData.length);
//			//
//			var Tea_Eva_No = 1;
//			var sqldata = "";	
//			var da=new Array();			
//			db.all("select * from " + table_name, function(err, rows) {
//				// 新增最新的資料
//				if (rows.length != 0) {
//					Tea_Eva_No = rows.length+1;
//				}
//				for(var i =0;i<insertData.length;i++,Tea_Eva_No++){
//					da[0]="'" + Tea_Eva_No + "'";					
//					da[1]="'"+insertData[i]['Writ_Eva_R_no']+"'";
//					da[2]="'"+insertData[i]['Teacher_No'] +"'";
//					da[3]="'"+insertData[i]['Level']+"'";
//					sqldata = da.toString();
//					db.run("insert into " + table_name + " values(" + sqldata + ");");
//				}				
//			});
//		});	
//}



////測試將資料接收分割出來，接收後要有MD5驗證
//function parseReceiveData(req){
//	var receiveDataStr = "";
//	var receiveData = new Object();
//	req.on("data", function(data) {
//		receiveDataStr += data;
//	});
//	req.on("end", function() {
//		//var filename = qs.parse(formData);
//		receiveData = JSON.parse(receiveDataStr);	

//	});
//	console.log('parseReceiveData:'+JSON.stringify(receiveData));

//	return receiveData;
//}
//function MD5(data){	
//	var dataStr = JSON.stringify(data);
//	var md5sum = crypto.createHash('md5');
//	md5sum.update(dataStr);
//	var dataMD5 = md5sum.digest('hex');
//	return dataMD5;
//}

////取得電腦評分後的資料  假定一個字只會有一筆分數
//app.post('/ComputerEvaluation/TotalGrade/:id',function(req,res){
//	console.log("app.post('/ComputerEvaluation/TotalGrade/:id',function(req,res){");
//	var stroke_write_p_no = req.params.id;
//	//group
//	var gro = 1;
//	var table_name = "Computer_Evaluation";
//	var totalGrade;
//	db.serialize(function() {		
//		db.all("select total_grade from " + table_name +" where Stroke_Write_P_no = "+stroke_write_p_no+" and Gro = "+gro, function(err, rows) {
//			if(err){
//				console.log(err);
//			}

//			res.send(stroke_write_p_no);

//			// console.log(rows);
//			// // 如果還沒有資料時的處理
//			// if (rows.length == 0) {
//				// console.log('did not find '+stroke_write_p_no+' stroke data');
//				// //找不到時回傳-1
//				// res.send("-1");
//			// }
//			// // 取得總分
//			// else {			
//				// totalGrade = rows[0].Total_Grade;
//				// console.log('total Grade is '+totalGrade);				
//				// res.send(totalGrade.toString());
//			// }
//			// console.log("app.post('/ComputerEvaluation/TotalGrade/:id',function(req,res){");
//		});
//	});

//});


//app.post('/ShowChart/getApp', function (req, res) {

//    var usr = JSON.parse(req.body.data);
//    var sql = ;



//    QueryAppName("SELECT DISTINCT(app) FROM traffic", res);


//    /*
//    SELECT app,count(app) as "session數量",sum('bytes') as "流量bytes" FROM 'traffic' 
//where 'receive_time' between str_to_date('2013-04-29 00:00:00','%Y-%m-%d %T') AND now()
//group by app
//ORDER BY session數量 DESC
//    */

//});