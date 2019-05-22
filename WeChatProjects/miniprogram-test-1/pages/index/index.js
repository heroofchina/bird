//index.js
//获取应用实例
const app = getApp()

Page({
  data: {


    //测试视频列表
    videoList: [{ "typeid": 2, "videoimg": "https://pxjj.shotsspace.live/uploads/image/20190514/2e8b73c5a806b67ab73cdc711e355676.png", "videoid": 110757, "videoname": "测试视频1", "videonumber": 0, "videoauthid": 10752, "videoauth": "俊江", "videomsgnumber": 0, "videosharenumber": 0, "videourl": "https://pxjj.shotsspace.live/uploads/file/20190514/20190514230535_66695.mp4" }, { "typeid": 2, "videoimg": "https://pxjj.shotsspace.live/uploads/image/20190514/89b6f8b88a82da0b65c2ec4841426d72.png", "videoid": 110758, "videoname": "测试短视频2", "videonumber": 0, "videoauthid": 10750, "videoauth": "谢小东", "videomsgnumber": 0, "videosharenumber": 0, "videourl": "https://pxjj.shotsspace.live/uploads/file/20190514/20190514230332_43564.mp4" }, { "typeid": 2, "videoimg": "https://pxjj.shotsspace.live/uploads/image/20190518/055fefbeaa2951a8742023855f533467.png", "videoid": 321905181606186940, "videoname": "dssdd3", "videonumber": 0, "videoauthid": 10752, "videoauth": "俊江", "videomsgnumber": 0, "videosharenumber": 0, "videourl": "https://pxjj.shotsspace.live/uploads/file/20190514/20190514230535_66695.mp4" }],

    maxPage:2,//超过多少页 进行内存回收
    thresholdValue:100,//上下滑动多少距离会出现翻页效果
    videoPage:1,//请求服务端返回的页数
    maxNumber:8,
  },
  swipeUpper:function(e){
    console.log(e);
  },
  swipeDown:function(e){
    console.log(e);
  },
  swipeToEnd: function (e) {

    var newdata = [{ "typeid": 2, "videoimg": "https://pxjj.shotsspace.live/uploads/image/20190514/2e8b73c5a806b67ab73cdc711e355676.png", "videoid": 110757, "videoname": "测试视频4", "videonumber": 0, "videoauthid": 10752, "videoauth": "俊江", "videomsgnumber": 0, "videosharenumber": 0, "videourl": "https://pxjj.shotsspace.live/uploads/file/20190514/20190514230535_66695.mp4" }, { "typeid": 2, "videoimg": "https://pxjj.shotsspace.live/uploads/image/20190514/2e8b73c5a806b67ab73cdc711e355676.png", "videoid": 110757, "videoname": "测试视频5", "videonumber": 0, "videoauthid": 10752, "videoauth": "俊江", "videomsgnumber": 0, "videosharenumber": 0, "videourl": "https://pxjj.shotsspace.live/uploads/file/20190514/20190514230535_66695.mp4" }]

    var res = this.data.videoList;
    var videoPage = this.data.videoPage;
    videoPage = videoPage+1;
    console.log('res', res.concat(newdata));
    this.setData({
      videoList: res.concat(newdata),
      videoPage: videoPage
    });
  },

  swipeToStart: function (e) {
     console.log(e);
  },
  
})
