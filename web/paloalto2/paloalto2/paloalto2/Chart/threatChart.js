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
        Chart.prototype.setxFontSize = function (size) {
            this.xFontSize = size;
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
                    },
                    labels: {
                        format: '{value} 個'
                    }
                },
                xAxis: {
                    title: {
                        text: this.xTitle.toString()
                    },
                    categories: this.cd.xAxis.categories,
                    labels: {
                        rotation: -30,
                        style: {
                            fontSize: (this.xFontSize == null) ? "12px" : this.xFontSize.toString()
                        }
                    }
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

                    var c1 = new Chart('c1', 'column', cd);
                    c1.setTitle("每小時的Subtype量");
                    c1.setYTitle("Subtype");
                    c1.setXTitle("Time");
                    c1.setxFontSize("0px");
                    c1.show();
                    query2();
                }
            },
            error: function (data) {
                alert('No Data');
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

                    var c2 = new Chart('c2', 'column', cd);
                    c2.setTitle("每小時的前十大app的session量");
                    c2.setXTitle("Time");
                    c2.setYTitle("APP");
                    c2.setxFontSize('0px');
                    c2.show();

                    query3();
                }
            },
            error: function (data) {
                alert('No Data');
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
                    var cd = new ChartData();

                    cd.xAxis.categories = data['x'];
                    cd.yAxis = data['y'];

                    var c3 = new Chart('c3', 'column', cd);
                    c3.setTitle("前十大app的每個Subtype量");
                    c3.setYTitle("Subtype");
                    c3.setXTitle("APP");

                    c3.show();
                }
            },
            error: function (data) {
                alert('No Data');
                alert(JSON.stringify(data));
            }
        });
    }

    window.onload = function () {
        var btn_query = document.getElementById('btn_query');
        btn_query.onclick = function () {
            query1();
        };
        query1();
    };
})(TC || (TC = {}));
//@ sourceMappingURL=threatChart.js.map
