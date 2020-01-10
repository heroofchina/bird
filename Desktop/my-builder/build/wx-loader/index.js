let loaderUtils = require('loader-utils');

console.log('get loaderUtils::::',loaderUtils);

module.exports=function(source){
	console.log('source :::',source);
	return 'source';
}