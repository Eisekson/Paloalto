/**
 * Created by Eisekson on 2014/5/2.
 */

exports.traffic = function(req,res){

    res.render('showchart',{title : 'traffic'});
}





//取得traffic 的 app流量
exports.queryTraffic = function(req,res){

    console.log('/query/traffic');
    var sD = JSON.parse(req.body.data);

    console.log(sD['toDate'] + "" + sD['fromDate'] + "" + sD['appIndex'] + "" + sD['toHour'] + "" + sD['fromHour'] + "" + sD['traffic']);
    var fromTime = sD['fromDate'] + " " + sD['fromHour'];
    var toTime = sD['toDate'] + " " + sD['toHour'];
    var tra = sD['traffic'];
    if (tra == '網路使用量') {
        tra = 'bytes';
    }

    var mysql = require('mysql');
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









};


//以App查詢前Ｎ大ip來源量
exports.apptoip = function(req,res){

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


};


function ti(st) {
    var date = new Date(st);
    date.setHours(date.getHours() + 8);
    st = date.toJSON();
    st = st.substring(0, 13);
    st = st.replace(/T/g, ' ');
    return st;
}
