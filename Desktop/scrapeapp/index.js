var puppeteer =require('puppeteer');
var colors=require('colors');
colors.setTheme({
    info: 'green',
    data: 'blue',
    warn: 'yellow',
    error: 'red'
});

var policyHandler=require('./utils/policyHandler');

var utils=require('./utils');


const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})


async  function get_zgcgw_beijing_api(page){
	console.log('get_zgcgw_beijing_api');
	const list = await page.evaluate(() => {
			
		 	   var ele=document.querySelector('.ui_border');
		 	   console.log('log',ele);
    })
}

async function bootstarp() {

	  console.log('启动爬取数据服务'.info);
	  const browser = await puppeteer.launch({
	  	timeout: 100000,
	  	headless: false
	  })
	  console.log('正在启动浏览器'.info);

	  try{

	  	const page = await browser.newPage()
	    page.on('console', msg => {
	      console.log('监听浏览器控制台的日志输出可忽略'.info);
	      if (typeof msg === 'object') {
	        console.log(msg)
	      } else {
	        console.log(msg);
	      }
	    })

	    //    await page.goto('http://zcdx.bda.gov.cn',{
		// 	    timeout: 0
		// });
		// page.on('response', async response => {
		// 	if(response.url().includes('http://zcdx.bda.gov.cn/lron/v2/bones/th/policy/search?region=')){
		// 		console.log('匹配到地址',response.url());
		// 		let labelList=await response.json();
		// 		 console.log('labelList',labelList);
		// 		 if(labelList.code==0&&labelList.requestTimeQueue){
		// 		 	let {list}=labelList.data;
		// 		 	var policyList=policyHandler.get_zcdx_bda_api(list);
		// 		 	console.log('get policy list:::',policyList);
		// 		 	utils.save_data_2_json(policyList,{
		// 		 		path:__dirname+'/jsons/',
		// 		 		name:'zcdx.bda.gov.cn.json'
		// 		 	});
		// 		 }
		// 	}
		// })
		await page.goto('http://zgcgw.beijing.gov.cn/zgc/zwgk/tzgg/index.html',{
			    timeout: 0
		});

		await get_zgcgw_beijing_api(page);








		// var wuhangbox=await page.$('.w_ul_list li');
		// console.log(wuhangbox);
		// var size=wuhangbox.length;
		
		
		// 	    for(var i=0;i<size;i++){
		// 	        var flname=$(wuhangbox[i]).find('.fl');
		// 	        var fltime=$(wuhangbox[i]).find('.fr');
		// 	        console.log(fltime.text());
		// 	    }
	    


	  }catch(e){
	  	console.log(e);
	  	await browser.close()
	  }finally{
	  	//process.exit(0)
	  }
  
}
bootstarp()