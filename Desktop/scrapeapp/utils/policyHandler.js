var PolicyHandler=function(){
	this.scrape_dict={};
	this.get_zcdx_bda_api=function(arr){
		 var origin_path='http://zcdx.bda.gov.cn/#/home';
	     var child_path='http://zcdx.bda.gov.cn/#/policy/detail/';
	     var size=arr.length;
	     for(var i=0;i<size;i++){
	     	this.scrape_dict[arr[i].id]=arr[i];
	     }
	     
	     var lists=[];
	     for(var key in this.scrape_dict){
            lists.push(this.scrape_dict[key]);
	     }


	     var policy_list=lists.map((item)=>{
	     	 return {
	     	 	id:item.id,
	     	 	title:item.title,
	     	 	publishDate:item.publishDate,
	     	 	labels:item.labels,
	     	 	origin_path:origin_path,
	     	 	origin_name:'来源 '+origin_path,
	     	 	child_path:child_path+item.id,
	     	 	shortContent:item.shortContent,
	     	 }
	     })

	     return policy_list;
	}


	this.get_zgcgw_beijing_api=async(page)=>{
		 const list = await page.evaluate(() => {
		 	   var ele=document.querySelector('.ui_border');
		 	   console.log('log',ele);
		 })

		 return list;
	}
}


var policyHandler=new PolicyHandler();

module.exports=policyHandler;