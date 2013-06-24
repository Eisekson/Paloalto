    
	function createSpiderweb()
	{ 
    var Spiderweb=new Object();
	Spiderweb.seri=new Array();
	Spiderweb.xAxis=new Array();
	Spiderweb.map=new Object();
	Spiderweb.add=function ADD(name,data){
		//alert("QQ");
	   	if(this.map[name]==null)
		{
		    this.map[name]=new Array();
			this.seri.push({name:name,data:this.map[name]});
		}
		this.map[name].push(data);
		//alert("QQ");
	}
	
	Spiderweb.addX=function ADDX(data){
		this.xAxis.push(data);
	}
	
	Spiderweb.draw=function draw(obj) {
		$(obj).highcharts({
	            
	    chart: {
	        polar: true,
	        type: 'line'
	    },
	    
	    title: {
	        text: 'Budget vs spending',
	        x: -80
	    },
	    
	    pane: {
	    	size: '80%'
	    },
	    
	    xAxis: {
	       categories: this.xAxis,
	        tickmarkPlacement: 'on',
	        lineWidth: 0
	    },
	        
	    yAxis: {
	        gridLineInterpolation: 'polygon',
	        lineWidth: 0,
	        min: 0
	    },
	    
	    tooltip: {
	    	shared: true,
	        pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
	    },
	    
	    legend: {
	        align: 'right',
	        verticalAlign: 'top',
	        y: 100,
	        layout: 'vertical'
	    },
	    
	    series: this.seri
	
	});
    }
	return Spiderweb;
	}