    var table=new Object();
	
	table.xAxis=new Array();
	
	table.seri=new Array();
	table.map=new Object();
	
	
	table.add=function ADD(name,data){
	    if(this.map[name]==null)
		{
		    this.map[name]=new Array();
			this.seri.push({name:name,data:this.map[name]});
		}
		this.map[name].push(data);
	}
	table.addX=function ADDX(data){
		this.xAxis.push(data);
	}
    table.toLINE=function TOLINE(LINE){
		LINE.seri=this.seri;
		LINE.xAxis=this.xAxis;
		
	}
	
	table.toLLL=function TOLLL(LLL){
		LLL.seri=this.seri;
		LLL.xAxis=this.xAxis;
	}
	
	table.toSpiderweb=function Spiderweb(Spiderweb){
		Spiderweb.seri=this.seri;
		Spiderweb.xAxis=this.xAxis;
	}