/**
 * Created by Eisekson on 2014/3/18.
 */

var express = require('express');
var app = express();
var port = 10002;
var encode = "utf-8";
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.session());
});

var mysql = require('mysql');


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

app.listen(port);

app.get('/pa/getData', function (req, res) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    var url = require('url').parse(req.url, true),
        query = url.query;
    var data = [100, 100, 100, 100, 100];
    console.log(data);
    res.jsonp(data);


    //res.jsonp();
});




