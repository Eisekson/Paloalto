///<reference path="..\Scripts\typings\jquery\jquery.d.ts"/>
///<reference path="..\Scripts\typings\highcharts\highcharts.d.ts"/>
var TC;
(function (TC) {
    /**查詢的資料*/
    var queryData;

    /**儲存資料*/
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

    /**圖表*/
    var Chart = (function () {
        /**  @param id div的id @param type 圖的type  如 line column */
        function Chart(id, type, cd) {
            this.charId = id;
            this.type = type;
            this.cd = cd;
        }
        /** 設定 Title  @param t title 名稱*/
        Chart.prototype.setTitle = function (t) {
            this.title = t;
        };
        Chart.prototype.show = function () {
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.charId,
                    type: this.type
                },
                xAxis: [this.cd.xAxis],
                series: this.cd.yAxis,
                title: {
                    text: this.title
                }
            });
        };
        return Chart;
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
        }
        return XAxis;
    })();

    /**圖表的資料*/
    var ChartData = (function () {
        function ChartData() {
            this.yAxis = null;
            this.xAxis = null;
            this.xAxis = new XAxis();
            //this.xAxis.categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            //    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
        return ChartData;
    })();

    function query() {
    }

    function query1() {
        alert(JSON.stringify(queryData));
        $.ajax({
            type: "POST",
            url: "/query/threatQuery1",
            data: { data: JSON.stringify(queryData) },
            dataType: "jsonp",
            jsonpCallback: "_testcb",
            cache: false,
            timeout: 50000,
            success: function (data) {
                if (data == 'error') {
                    alert('can not find the data');
                } else {
                    alert(JSON.stringify(data));
                }
            },
            error: function (data) {
                alert('error');
                alert(JSON.stringify(data));
            }
        });
    }
    function query2() {
        $.ajax({
            type: "POST",
            url: "/query/threatQuery2",
            data: { data: JSON.stringify(queryData) },
            dataType: "jsonp",
            jsonpCallback: "_testcb",
            cache: false,
            timeout: 50000,
            success: function (data) {
                if (data == 'error') {
                    alert('can not find the data');
                } else {
                    console.log(JSON.stringify(data));
                }
            },
            error: function (data) {
                alert('error');
                alert(JSON.stringify(data));
            }
        });
    }
    function query3() {
        $.ajax({
            type: "POST",
            url: "/query/threatQuery3",
            data: { data: JSON.stringify(queryData) },
            dataType: "jsonp",
            jsonpCallback: "_testcb",
            cache: false,
            timeout: 50000,
            success: function (data) {
                if (data == 'error') {
                    alert('can not find the data');
                } else {
                    console.log(JSON.stringify(data));
                }
            },
            error: function (data) {
                alert('error');
                alert(JSON.stringify(data));
            }
        });
    }

    window.onload = function () {
        var cd = new ChartData();
        queryData = new QueryData();
        queryData.setDate();

        query1();

        cd.xAxis.categories = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        cd.yAxis = [
            {
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            },
            {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            },
            {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            },
            {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }
        ];

        var c1 = new Chart('c1', 'column', cd);
        c1.setTitle("c1");

        c1.show();
        var c2 = new Chart('c2', 'column', cd);
        c2.setTitle('c2');
        c2.show();
        var c3 = new Chart('c3', 'column', cd);
        c3.setTitle('c3');
        c3.show();
    };
})(TC || (TC = {}));
//# sourceMappingURL=threatChart.js.map
