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
	  	timeout: 30000
	  })
	  console.log('正在启动浏览器'.info);

	  try{

	  	const page = await browser.newPage()
	    page.on('console', msg => {
	      if (typeof msg === 'object') {
	        console.log(msg.error)
	      } else {
	        console.log(msg.error);
	      }
	    })
	    await page.goto('http://zcdx.bda.gov.cn/#/themeTypeDetail?themeTypeId=770294634592575488');
	  }catch(e){
	  	 console.log(e);
	  	await browser.close()
	  }finally{
	  	//process.exit(0)
	  }
  
}
bootstarp()