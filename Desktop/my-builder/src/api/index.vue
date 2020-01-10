<template>


	<view class="index-cxt">
		this is wx mini app components
	</view>
	


</template>



<style>
	.index-cxt{
		width: 100%;
		height:100%;
		background-color: #fff;
	}


</style>


<script>
	
	export default {

		 type:'pages',
		 name:'index-page',
		 onLoad:function(){
		 	console.log('init weixin mini app');
		 },
		 data(){
		 	 return {
		 	 	message:'hello',
		 	 }
		 }

	}

</script>


