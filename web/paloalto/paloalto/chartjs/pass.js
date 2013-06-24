// JavaScript Document
function ddd(A){
	alert('QQ');
	var R=['asd','qwe','zxc','rty'];
	var m=new Object();
	for(var i=0;i<A.length;i++)
	{
		m[R[i]]=i;
	}
	A=['qwe','asd','zxc','fgh'];
	
	
	var str='';
	for(var i=0;i<A.length;i++)
	{
		str+=m[A[i]]+',';
	}
	alert(str);
}