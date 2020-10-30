var fs=require('fs');
var utils={
	/**
	获取爬虫进度
	**/
	get_scrape_process(currentpage,totalpage,currentpageindex){

	},
	//将数据保存成json
	save_data_2_json(data,jsons){
		const {name,path}=jsons;
		let jsonName=path+name;
		console.log(jsonName);
	    fs.writeFileSync(jsonName,JSON.stringify(data,null,"\t"))
	}
}


module.exports=utils;