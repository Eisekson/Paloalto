    function createLLL()
	{
	var LLL=new Object();
	LLL.seri=new Array();
	LLL.xAxis=new Array();
	LLL.map=new Object();
	LLL.add=function ADD(name,data){
	   
	   //this.seri.push({name:name,data:data});
	   //alert(name+":"+data);
	   //alert(this.map[name]);
	    if(this.map[name]==null)
		{
		//	alert("QQ1");
		    this.map[name]=new Array();
			this.seri.push({name:name,data:this.map[name]});
		}
		this.map[name].push(data);
	}
	LLL.addX=function ADDX(data){
		this.xAxis.push(data);
	}
	
	LLL.draw=function draw(obj,seri,categories) {
		
		seri=this.seri;
		$(obj).highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Stacked bar chart'
            },
            xAxis: {
                categories:this.xAxis
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                }
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            plotOptions: {
                series: {
					dataLabels: {
                        enabled: true,
						formatter: function() {
                            return '<b>'+ this.series.name +'</b>: '+ this.percentage.toString().substr(0,5) +' %';
                        },
						color:'white',
						//connectEnds:true
                    },
                    stacking: 'normal',
					
                }
            },
                series: seri
        });
        
    };
	return LLL;
	}

