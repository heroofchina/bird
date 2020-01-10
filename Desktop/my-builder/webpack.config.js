var path=require('path');

var webpack =require('webpack')

var VueLoaderPlugin =require('vue-loader/lib/plugin')

const vueConfigLoader={
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}


module.exports={
	
		entry:__dirname+'/src/App.vue',
		output:{
			path: __dirname+'/static',
			filename:'app.js'
		},
		module:{
		    rules:[
			   
				{
			        test: /\.(vue)$/,
			        loader: path.resolve(__dirname, './build/wx-loader/index.js'),
			        exclude: path.resolve(__dirname, '../node_modules'),
			        options: {
				          replace:'./static/'
				    }
				}
		    ]

	    },
}