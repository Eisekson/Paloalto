var express = require('express');

var crypto = require('crypto');

var app = express();
var fs = require('fs');
var port = 80;
var encode = "utf-8";

var mysql = require('mysql');
//insertAppData();

a();

var res;

function a() {
    var connection = mysql.createConnection({
        host: '120.110.114.25',
        user: 'Paloalto',
        password: 'password',
        database: 'paloalto'
    });
    connection.connect();

    connection.query("SELECT DISTINCT(app) FROM traffic", function (err, result) {
        if (err) {
            console.log("SELECT DISTINCT(app) FROM traffic");
            throw err;
        }
        var tts = "2013-05-05 10:00:00";
        var tte = "2013-05-05 11:00:00";
        //console.log(result.length);

        for (var i=0; i < result.length; i++) {
            console.log(i);
            var ap = result[i]['app'];
            var time_start = "'" + tts + "'";
            var time_end = "'" + tte + "'";
            var app = "'" + ap + "'";
            var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
            query(sql2);
                      
            
        }
        res = result;
    });
    connection.end(function (err) {
        

    });
}
//setTimeout(b, 1000);

function b() {

    var result = res;
    if (res == null) {
        setTimeout(b, 1000);
        return;
    }
    var tts = "2013-05-05 10:00:00";
    var tte = "2013-05-05 11:00:00";
    //console.log(result.length);

    for (; i < result.length; i++) {
        console.log(i);
        var ap = result[i]['app'];
        var time_start = "'" + tts + "'";
        var time_end = "'" + tte + "'";
        var app = "'" + ap + "'";
        var sql2 = "INSERT INTO  paloalto . traffic_hour_data  ( count , app ,  time_generated , bytes , bytes_sent , bytes_received  , session )  VALUES (NULL, (SELECT DISTINCT(app) FROM  traffic where app=(" + app + ") ), str_to_date((" + time_start + ") ,'%Y-%m-%d %T'),(SELECT sum(bytes) as 'bytes' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app),(SELECT sum(bytes_sent) as 'bytes_sent' FROM  traffic   where app=(" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + "),'%Y-%m-%d %T'))group by app) ,(SELECT sum(bytes_received) as 'bytes_received' FROM  traffic   where app=(" + app + ")&&(  traffic . time_generated  between str_to_date((" + time_start + "),'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T'))group by app),(SELECT count(app) as 'session' FROM  traffic   where app= (" + app + ") &&(  traffic . time_generated  between str_to_date((" + time_start + ") ,'%Y-%m-%d %T') AND str_to_date( (" + time_end + ") ,'%Y-%m-%d %T')) group by app))";
        query(sql2);        
    }
}




var flag = true;

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
    console.log('query');
    connection.connect();
    
    connection.query(sql, function (err, result) {
        flag = false;
        if (err) {
            console.log('err');
            //console.log(sql);
            //throw err;
            //setTimeout(b, 1000);
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
            console.log(sql);
            throw err;
        }
        console.log();
        res.jsonp(result);
    });
    connection.end();

}

//取得traffic 的 app流量
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
//取得結束時間  格式為 2013-05-05 11:00:00
function getCurrentEndTime() {
    var st = "";
    var d = new Date();
    d.setHours(d.getHours() + 1, 0, 0);
    st = d.toJSON();
    st = st.substring(0, 19);
    st = st.replace(/T/g, ' ');
    return st;
}
//取得開始時間  格式為 2013-05-05 10:00:00
function getCurrentStartTime() {
    var st = "";
    var d = new Date();
    d.setMinutes(0, 0);
    st = d.toJSON();
    st = st.substring(0, 19);
    st = st.replace(/T/g, ' ');
    return st;
}
//將資料寫入檔案  將data字串，寫入檔名為fileName的檔案中，如果沒有檔案它會自行建立。
function writeFile(fileName, data) {
    fs.appendFile(fileName, data, function (err) {
        if (err) console.log(err);

    });

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