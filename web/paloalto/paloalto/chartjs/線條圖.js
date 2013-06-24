    
	function createLINE()
	{
	var LINE=new Object();
	LINE.seri=new Array();
	LINE.xAxis=new Array();
	LINE.map=new Object();
	LINE.add=function ADD(name,data){
	   //this.seri.push({name:name,data:data});
	    if(this.map[name]==null)
		{
		//	alert("QQ1");
		    this.map[name]=new Array();
			this.seri.push({name:name,data:this.map[name]});
		}
		this.map[name].push(data);
	}
	
	LINE.addX=function ADDX(data){
		this.xAxis.push(data);
	}
	
	LINE.draw=function draw(obj,seri,categories) {
		
		seri=this.seri;
		
        $(obj).highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'APP 流量'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: this.xAxis,
                labels: {
                    rotation: -45,
                    style: {
                        fontSize:'0px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: ''
                    
                }
            },
            tooltip: {
                enabled: true,
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>'
                        + ' 時間: ' + this.x + ' 量: ' + (this.y / 1024 ).toFixed(2)+'KB' ;
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {

                                //alert(this.series.name + " " + this.category + " " + this.y);
                                
                                //hs.htmlExpand(null, {
                                //    pageOrigin: {
                                //        x: this.pageX,
                                //        y: this.pageY
                                //    },
                                //    headingText: this.series.name,
                                //    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                //        this.y +' visits',
                                //    width: 200
                                //});
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                },

                line: {
                    dataLabels: {
                        enabled: false
                    },
                    enableMouseTracking: true
                }               
                
            },
			
			legend: {
              //  layout: 'vertical',
              //  align: 'top',
               // verticalAlign: 'top',
				//x:-200,
                borderWidth: 1//框線
            },
            series: seri
        });
    }
	return LINE;
	}

