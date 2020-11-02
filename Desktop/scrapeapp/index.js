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





async function bootstarp() {

	  console.log('启动爬取数据服务'.info);
	  const browser = await puppeteer.launch({
	  	timeout: 100000,
	  	headless: false,
	  	slowMo:250,
	  	//args: ["--user-data-dir=/var/chrome-data/session-data"]
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


		const res=await page.$$('.w_ul_list ul .clearfix');
		console.log(res.length);
		for(var i=0;i<res.length;i++){
			await res[i].click();
			await page.setDefaultNavigationTimeout(0);
		    //await page.waitForTimeout(2500);
			await page.waitForNavigation();
			//await page.waitForSelector('.easysite-news-peruse .easysite-font-peruse');
			await page.evaluate(()=>{
				  console.log('get val');
				  console.log($(res[i]).html());
			})
			const title=await page.$eval('.easysite-news-title > h2', el => el.innerText);
			console.log(title);
			
		}




		
		// const result = await page.evaluate(async () => {
	 //          let data = [];
		// 	  let elements = document.querySelectorAll('.w_ul_list ul .clearfix');   //获取所有的li
		// 	    for (var element of elements){ // 循环
		// 	      const href=$(element).find('.fl>a').attr('href');
		// 	      const title=$(element).find('.fl>a').attr('title');
		// 	      const time=$(element).find('.fr').html();
		// 	      console.log({href,title,time});
		// 	      data.push({title, href,time}); // 存入数组
		// 	  }
	 //          return data;
  //      })
	    


	  }catch(e){
	  	console.log(e);
	  	await browser.close()
	  }finally{
	  	//process.exit(0)
	  }
  
}
bootstarp()