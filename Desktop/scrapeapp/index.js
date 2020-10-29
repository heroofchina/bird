var puppeteer =require('puppeteer');
var colors=require('colors');
colors.setTheme({
    info: 'green',
    data: 'blue',
    warn: 'yellow',
    error: 'red'
});


async function bootstarp() {

	  console.log('启动爬取数据服务'.info);
	  const browser = await puppeteer.launch({
	  	timeout: 30000,
	  	headless: false
	  })
	  console.log('正在启动浏览器'.info);

	  try{

	  	const page = await browser.newPage()
	    page.on('console', msg => {
	      console.log('监听浏览器控制台的日志输出可忽略'.info);
	      if (typeof msg === 'object') {

	        console.log(JSON.stringify(msg).error)
	      } else {
	        console.log(msg);
	      }
	    })

	    await page.goto('http://zcdx.bda.gov.cn');

	    const aHandle = await page.evaluateHandle(() => document.body);

		const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
		console.log(await resultHandle.jsonValue());
		await resultHandle.dispose();


		// page.on('response', async response => {
		// 	console.log('get api data:::',response.url());
		// 	if(response.url() =='http://zcdx.bda.gov.cn/lron/v2/bones/th/policy/search?region=110115403&pageSize=8&enabled=Y&sort=11&remote=Y'){
		// 		 const data=await response.json();
		// 		 console.log(data);
		// 	}
		   
		// })
	    


	  }catch(e){
	  	console.log(e);
	  	await browser.close()
	  }finally{
	  	//process.exit(0)
	  }
  
}
bootstarp()