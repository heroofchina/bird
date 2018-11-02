var colors=require('colors');
var http=require('http');
var urlutil =require('url');
var qs=require('querystring');
var bird=(function(){
	var routerstack={};
	var net=function(request,response){
		response.writeHead(200,{
			'Content-Type':'application/json;charset=8tf8'
		});
		pathname=urlutil.parse(request.url).pathname;
		console.log(pathname);
		request.requrl=pathname;
		response.send=function(obj){
			if(typeof obj!=='stirng'){
				obj=JSON.stringify(obj);
			}
			response.write(obj);
			response.end();
		}
		if(pathname!=='/favicon.ico'){routerstack[pathname](request,response);}
		
	}
	var start=function(port,ops,callback){
		//console.log(ops);
		if(typeof port!=='undefined'){
			port=3000;
		}
		if(typeof callback!=='undefined'){
			callback();
		}
		//console.log(routerstack);
		http.createServer(net).listen(port);
	}
	var router=function(){
		return {
			get:function(url,callback){
				routerstack[url]=callback;
			},
			post:function(){
				routerstack[url]=callback;
			}
		}
	}

	return {
		start:start,
		router:router
	}
})();


//测试部分
var router=bird.router();
router.get('/login',(request,response)=>{
   console.log('开始执行登录路由');
   response.send({
   	'message':'登录成功',
   	'no':'0',
   	'userid':'1000111001101esced768sda'
   });
});
bird.start(3000,router,()=>{
	console.log('server start'.green);
});












