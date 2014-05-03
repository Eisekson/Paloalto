        
	function createCIRC()
	{ 
	var CIRC=new Object();
	CIRC.seri=new Array();
	CIRC.map=new Object();
	CIRC.add=function ADD(name,data){
	   
	   this.seri.push({name:name,y:data});
	   
	}
	CIRC.draw=function draw(obj,seri) {
    	// Build the chart
		
		
		seri= [{
                type: 'pie',
                name: 'Browser share',
                data:this.seri/* [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        //sliced: true,//切片
                        //selected: true//選取
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                ]*/
            }];
		
        $(obj).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2010'
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                                                formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage.toString().substr(0,5) +' %';
                        }
                    },
                    showInLegend: true,
                    
                },
				
            },
           legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 1//框線
            },
            series:seri
        });
    }
	return CIRC;
	}