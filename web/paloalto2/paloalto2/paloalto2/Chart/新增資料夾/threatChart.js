var TC;
(function (TC) {
    var queryData;

    var QueryData = (function () {
        function QueryData() {
            this.fromDate = null;
            this.fromHour = null;
            this.toDate = null;
            this.toHour = null;
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

    var Chart = (function () {
        function Chart(id, type, cd) {
            this.charId = id;
            this.type = type;
            this.cd = cd;
        }
        Chart.prototype.setTitle = function (t) {
            this.title = t;
        };
        Chart.prototype.setYTitle = function (t) {
            this.yTitle = t;
        };
        Chart.prototype.setXTitle = function (t) {
            this.xTitle = t;
        };
        Chart.prototype.show = function () {
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.charId,
                    type: this.type
                },
                yAxis: {
                    title: {
                        text: this.yTitle.toString()
                    }
                },
                xAxis: {
                    text: this.xTitle.toString(),
                    categories: this.cd.xAxis.categories
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: this.cd.yAxis,
                title: {
                    text: this.title
                }
            });
        };
        return Chart;
    })();

    var YAxis = (function () {
        function YAxis(name, data) {
            this.name = null;
            this.data = null;
            this.name = name;
            this.data = data;
        }
        return YAxis;
    })();

    var XAxis = (function () {
        function XAxis() {
            this.categories = null;
        }
        return XAxis;
    })();

    var ChartData = (function () {
        function ChartData() {
            this.yAxis = null;
            this.xAxis = null;
            this.xAxis = new XAxis();
        }
        return ChartData;
    })();

    function query() {
    }

    function query1() {
        var queryData = new QueryData();
        queryData.setDate();

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
                } else {
                    var cd = new ChartData();

                    cd.xAxis.categories = JSON.parse(data['x']);
                    cd.yAxis = JSON.parse(data['y']);
                    alert(JSON.stringify(cd.yAxis));
                    var c1 = new Chart('c1', 'column', cd);
                    c1.setTitle("每小時的Subtype量");
                    c1.setYTitle("Subtype");
                    c1.setXTitle("Time");
                    c1.show();
                    query2();
                }
            },
            error: function (data) {
                alert('error');
                alert(JSON.stringify(data));
            }
        });
    }
    function query2() {
        var queryData = new QueryData();
        queryData.setDate();
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
                    var cd = new ChartData();

                    cd.xAxis.categories = JSON.parse(data['x']);
                    cd.yAxis = JSON.parse(data['y']);
                    alert(JSON.stringify(cd.yAxis));
                    var c2 = new Chart('c2', 'column', cd);
                    c2.setTitle("每小時的前十大app的session量");
                    c2.setXTitle("time");
                    c2.setYTitle("APP");
                    c2.show();
                    query3();
                }
            },
            error: function (data) {
                alert('error');
                alert(JSON.stringify(data));
            }
        });
    }
    function query3() {
        var queryData = new QueryData();
        queryData.setDate();
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
                    alert(JSON.stringify(data));
                    var cd = new ChartData();

                    cd.xAxis.categories = data['x'];
                    cd.yAxis = data['y'];
                    alert(JSON.stringify(cd.yAxis));
                    var c3 = new Chart('c3', 'column', cd);
                    c3.setTitle("前十大app的每個Subtype量");
                    c3.setYTitle("Subtype");
                    c3.setXTitle("APP");
                    c3.show();
                }
            },
            error: function (data) {
                alert('error');
                alert(JSON.stringify(data));
            }
        });
    }

    window.onload = function () {
        var btn_query = document.getElementById('btn_query');
        btn_query.onclick = function () {
            alert('query');
            query1();
        };

        var cd = new ChartData();
        queryData = new QueryData();
        queryData.setDate();

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
        c1.setTitle("每小時的Subtype量");
        c1.setYTitle("Subtype");
        c1.setXTitle("Time");
        c1.show();
        var c2 = new Chart('c2', 'column', cd);
        c2.setTitle('每小時的前十大app的session量');
        c2.setXTitle("time");
        c2.setYTitle("APP");
        c2.show();
        var c3 = new Chart('c3', 'column', cd);
        c3.setTitle('前十大app的每個Subtype量');
        c3.setYTitle("Subtype");
        c3.setXTitle("APP");
        c3.show();
    };
})(TC || (TC = {}));
//@ sourceMappingURL=threatChart.js.map
