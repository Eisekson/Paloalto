/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , showchart = require('./routes/showchart');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/showchart', showchart.traffic);
app.get('/apptoip', showchart.apptoipejs);
app.get('/test', routes.test);
app.get('/a/test', routes.atest);
app.get('/control/a', routes.a);
app.get('/control/ipset', routes.ipset);
app.get('/hello', function (req, res) {
    console.log(req.url);
    var data = [
        {name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}
    ];

    res.jsonp(data);
});
app.get('/h1/:id', function (req, res) {

    res.render('h1/' + req.params.id, {});
})

function rendertourl(req, res) {
    var url = req.url;
    res.render(url.substr(1, url.length - 1), {});
}

app.post('/query/traffic', showchart.queryTraffic);
app.post('/query/apptoip', showchart.apptoip);
app.post('/editpolicyrule', function (req, res) {

    console.log(req.body);
    var u = req.body;
    var mysql = require('mysql');
    var sql = "INSERT INTO policyrule VALUES (null," +
        "'"+ u.target+"'," +
        "'"+ u.flow+"'," +
        "'"+ u.session+"'," +
        "'"+ u.application+"'," +
        "'"+ u.violate+"'," +
        "'"+ u.thread+"'," +
        "'"+ u.beginTime+"'," +
        "'"+ u.timeCycle+"'," +
        "'"+ u.enable+"'," +
        "'"+ u.reason+"'," +
        "'"+ u.action+
        "')";
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
            //throw err;
            res.jsonp('error');
        }
        console.log(result);
        res.jsonp('success');

    });
    connection.end();
});
app.post('/getpolicyrule', function (req, res) {
    var mysql = require('mysql');
    var sql = "select * from policyrule";
    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();

    connection.query(sql, function (err, result) {
        if (err) {
            console.log(error);
            //throw err;
            res.jsonp('error');
        }
        console.log(result);

        res.jsonp(result);

    });
    connection.end();
})
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
