// JavaScript Document
function TEST(){
	 $("#div_sign_out").animate({height: "toggle",opacity:"toggle"});
}
function TEST2(){
	$("#div_sign_in").animate({opacity:"toggle"});
	var div_sign_in=document.getElementById("div_sign_in");
	
	div_sign_in.style.left=innerWidth/2-(document.getElementById("SignInForm").width)/2+"px";
	div_sign_in.style.top=innerHeight/2-(document.getElementById("SignInForm").height)/2+"px";
}
function init(){
	
	var paloalto_logo=document.getElementById("paloalto_logo");
	paloalto_logo.style.left=innerWidth/2-paloalto_logo.width/2+"px";
	paloalto_logo.style.top=innerHeight/2-paloalto_logo.height/2+"px";

	var Above_AnalysisForm=document.getElementById("Above_AnalysisForm");
	Above_AnalysisForm.onmouseover=function(){
	Above_AnalysisForm.src="20130709/已匯出/天花板/天花板/分析表格0.png";
	};
	Above_AnalysisForm.onmouseout=function(){
	Above_AnalysisForm.src="20130709/已匯出/天花板/天花板/分析表格.png";
	};
	
	var Above_UserPermissionSettings=document.getElementById("Above_UserPermissionSettings");
	Above_UserPermissionSettings.onmouseover=function(){
		console.log("QQ1");
	Above_UserPermissionSettings.src="20130709/已匯出/天花板/天花板/使用者權限設定0.png";
	};
	Above_UserPermissionSettings.onmouseout=function(){
	Above_UserPermissionSettings.src="20130709/已匯出/天花板/天花板/使用者權限設定.png";
	};
	
	var Above_AccountManagement=document.getElementById("Above_AccountManagement");
	Above_AccountManagement.onmouseover=function(){
	Above_AccountManagement.src="20130709/已匯出/天花板/天花板/帳號管理0.png";
	};
	Above_AccountManagement.onmouseout=function(){
	Above_AccountManagement.src="20130709/已匯出/天花板/天花板/帳號管理.png";
	};
	//hide();
	
	//div_sign_out
	var sign_out_OK_btn=document.getElementById("sign_out_OK_btn");
	sign_out_OK_btn.onmouseover=function(){
	sign_out_OK_btn.src="20130709/已匯出/Sign out/新資料夾/確定按鈕(滑鼠滑過).png";
	};
	sign_out_OK_btn.onmouseout=function(){
	sign_out_OK_btn.src="20130709/已匯出/Sign out/新資料夾/確定按鈕.png";
	};
	
	var sign_out_X_btn=document.getElementById("sign_out_X_btn");
	sign_out_X_btn.onmouseover=function(){
	sign_out_X_btn.src="20130709/已匯出/Sign out/新資料夾/X按鈕(滑鼠滑過).png";
	};
	sign_out_X_btn.onmouseout=function(){
	sign_out_X_btn.src="20130709/已匯出/Sign out/新資料夾/X按鈕.png";
	};
	sign_out_X_btn.onclick=function(){//按下 X_btn
	    $("#div_sign_out").animate({height: "hide",opacity:"hide"});
	};
	
	//div_sign_in

	var sign_in_OK_btn=document.getElementById("sign_in_OK_btn");
	sign_in_OK_btn.onmouseover=function(){
	sign_in_OK_btn.src="20130709/已匯出/sign in/sign in/確定按鈕(滑鼠滑過).png";
	};
	sign_in_OK_btn.onmouseout=function(){
	sign_in_OK_btn.src="20130709/已匯出/sign in/sign in/確定按鈕.png";
	};

	var sign_in_Register_btn=document.getElementById("sign_in_Register_btn");
	sign_in_Register_btn.onmouseover=function(){
	sign_in_Register_btn.src="20130709/已匯出/sign in/sign in/Register按鈕(滑鼠滑過).png";
	};
	sign_in_Register_btn.onmouseout=function(){
	sign_in_Register_btn.src="20130709/已匯出/sign in/sign in/Register按鈕.png";
	};
	sign_in_Register_btn.onclick=function(){
	$("#div_Register").animate({opacity:"show"});
	$("#div_sign_in").animate({opacity:"hide"});
	var div_Register=document.getElementById("div_Register");
	div_Register.style.left=innerWidth/2-(document.getElementById("RegisterForm").width)/2+"px";
	div_Register.style.top=innerHeight/2-(document.getElementById("RegisterForm").height)/2+"px";
	};
	
	var sign_in_NoAccount_btn=document.getElementById("sign_in_NoAccount_btn");
	sign_in_NoAccount_btn.onmouseover=function(){
	sign_in_NoAccount_btn.src="20130709/已匯出/sign in/sign in/Ican’t access my accountRegister按鈕(滑鼠滑過).png";
	};
	sign_in_NoAccount_btn.onmouseout=function(){
	sign_in_NoAccount_btn.src="20130709/已匯出/sign in/sign in/Ican’t access my accountRegister按鈕.png";
	};
	
	//div_Register
	var Register_OK_btn=document.getElementById("Register_OK_btn");
	Register_OK_btn.onmouseover=function(){
	Register_OK_btn.src="20130709/已匯出/register/register/確定按鈕(滑鼠滑過).png";
	};
	Register_OK_btn.onmouseout=function(){
	Register_OK_btn.src="20130709/已匯出/register/register/確定按鈕.png";
	};
	
	var Register_X_btn=document.getElementById("Register_X_btn");
	Register_X_btn.onmouseover=function(){
	Register_X_btn.src="20130709/已匯出/register/register/X按鈕(滑鼠滑過).png";
	};
	Register_X_btn.onmouseout=function(){
	Register_X_btn.src="20130709/已匯出/register/register/X按鈕.png";
	};
	Register_X_btn.onclick=function(){
	$("#div_Register").animate({opacity:"hide"});
	$("#div_sign_in").animate({opacity:"show"});
	var div_sign_in=document.getElementById("div_sign_in");
	div_sign_in.style.left=innerWidth/2-(document.getElementById("SignInForm").width)/2+"px";
	div_sign_in.style.top=innerHeight/2-(document.getElementById("SignInForm").height)/2+"px";
	};
	
	//div main
	//將套用到center的字體圖片置中
	var cls_center=document.getElementsByClassName("center");
	for(var i=0;i<cls_center.length;i++)
	{
	    cls_center.item(i).style.left=108-cls_center.item(i).width/2+"px";
		cls_center.item(i).style.top=108-cls_center.item(i).height/2+"px";
		//alert(cls_center.item(i).height);
	}
	
	var div_main=document.getElementById("div_main");
	div_main.style.left=innerWidth/2-parseInt(div_main.style.width)/2+"px";
	div_main.style.top=innerHeight/2-parseInt(div_main.style.height)/2+"px";
	
	var main_NetworkUsageAnalysisChart=document.getElementById("main_NetworkUsageAnalysisChart");
	main_NetworkUsageAnalysisChart.onmouseover=function(){
	main_NetworkUsageAnalysisChart.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_NetworkUsageAnalysisChart.onmouseout=function(){
	main_NetworkUsageAnalysisChart.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};
	
	main_NetworkUsageAnalysisChart.onclick=function(){
		fnc("#main_NetworkUsageAnalysisChart");
	};

	var main_AdministratorMainScreen=document.getElementById("main_AdministratorMainScreen");
	main_AdministratorMainScreen.onmouseover=function(){
	main_AdministratorMainScreen.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_AdministratorMainScreen.onmouseout=function(){
	main_AdministratorMainScreen.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};

	var main_ControllingHistoricalDataInquiry=document.getElementById("main_ControllingHistoricalDataInquiry");
	main_ControllingHistoricalDataInquiry.onmouseover=function(){
	main_ControllingHistoricalDataInquiry.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_ControllingHistoricalDataInquiry.onmouseout=function(){
	main_ControllingHistoricalDataInquiry.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};

	var main_ApplicationAnalysis=document.getElementById("main_ApplicationAnalysis");
	main_ApplicationAnalysis.onmouseover=function(){
	main_ApplicationAnalysis.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_ApplicationAnalysis.onmouseout=function(){
	main_ApplicationAnalysis.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};

	var main_MaintainControlPolicy=document.getElementById("main_MaintainControlPolicy");
	main_MaintainControlPolicy.onmouseover=function(){
	main_MaintainControlPolicy.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_MaintainControlPolicy.onmouseout=function(){
	main_MaintainControlPolicy.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};

	var main_SearchHistory=document.getElementById("main_SearchHistory");
	main_SearchHistory.onmouseover=function(){
	main_SearchHistory.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_SearchHistory.onmouseout=function(){
	main_SearchHistory.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};

	var main_WhiteList=document.getElementById("main_WhiteList");
	main_WhiteList.onmouseover=function(){
	main_WhiteList.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_WhiteList.onmouseout=function(){
	main_WhiteList.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};

	var main_WebUserQueries=document.getElementById("main_WebUserQueries");
	main_WebUserQueries.onmouseover=function(){
	main_WebUserQueries.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%950.png)";
	};
	main_WebUserQueries.onmouseout=function(){
	main_WebUserQueries.style.backgroundImage="url(20130709/%E5%B7%B2%E5%8C%AF%E5%87%BA/%E6%8C%89%E9%88%95/1%E6%8C%89%E9%88%95/%E6%8C%89%E9%88%95.png)";
	};
	
	var show_X_btn=document.getElementById("show_X_btn");
	show_X_btn.onmouseover=function(){
	show_X_btn.src="20130709/已匯出/按鈕/1按鈕/X按鈕(滑鼠滑過).png";
	};
	show_X_btn.onmouseout=function(){
	show_X_btn.src="20130709/已匯出/按鈕/1按鈕/X按鈕.png";
	};
	show_X_btn.onclick=function(){
	stop0();
	};
	
}
function hide(){
	//document.getElementById("div_sign_out").style.display="none";
}

function fnc0(obj) {
        $("#"+obj).highcharts({
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });
    }


function fnc(obj){

	var tx=$(obj).css("left"),ty=$(obj).css("top"),th=$(obj).css("height"),tw=$(obj).css("width");//可刪
	var mw="600px",mh="600px";//可刪
	var show_form=document.getElementById("show_form");
	show_form.style.left=parseInt(tx)+(innerWidth-1024)/2+"px";
	show_form.style.top=parseInt(ty)+(innerHeight-768)/2+"px";
	show_form.style.width=tw;
	show_form.style.height=th;
	alert(show_form.outeWidth);
	$("#show_form").animate({
	opacity: "show",
	top:"61px",
	left:"0px",
	width:innerWidth-4+"px",
	height:innerHeight-65+"px",
	borderWidth: "2px"//可刪
	}, 700 ,function(){
	fnc0("show_form");
	$("#show_X_btn").css("display","block");
	});
	
	
	/*
	show_form.style.top="61px";
	show_form.style.border="2px solid";//可刪
	show_form.style.width=innerWidth+"px";
	show_form.style.height=innerHeight+"px";
	*/
	//alert(innerWidth+":"+innerHeight);
	//alert(show_form+show_form.style.width+""+show_form.style.height);
	
	//alert(tx+ty+th+tw);
	/*
	document.getElementById("container").style.display="none";
	document.getElementById("container").style.width=mw;
	document.getElementById("container").style.height=mh;
	fnc0();
	document.getElementById("container").style.width=tw;
	document.getElementById("container").style.height=th;
	//alert("ASD");
	document.getElementById("container").style.display="block";
	*/

	

}
function stop0(){
	//alert(document.getElementById("container").HIDE)
	
	if(document.getElementById("show_form").innerHTML=="")
	    return ;
	document.getElementById("show_form").innerHTML="";
	$("#show_form").animate({
	opacity: "hide",
	borderWidth: "0px",
	},function(){$("#show_X_btn").css("display","none");});

}