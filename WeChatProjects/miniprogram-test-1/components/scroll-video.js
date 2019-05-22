// components/scroll-video.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //父组件传入的视频列表
    videoList:{
      type: Array,
      value: [],
      observer: function(newVal, oldVal){
        this.setData({
          videoSize: newVal.length
        });
      }
    },
    //超过多少页数的时候 进行列表内存回收 防止长列表性能问题
    maxPage:{
      type: Number,
      value: 1,
      observer: function (newVal, oldVal) {
        
      }
    },
    //视频当前所在服务端接口中的页数
    currentPage:{
      type: Number,
      value: 1,
      observer: function (newVal, oldVal) {
        
      }
    },
    //滑动距离的设置 超过该距离回出现页面下滑或者上滑的情况
    thresholdValue:{
      type: Number,
      value: 100,
      observer: function (newVal, oldVal) {
        console.log(newVal,oldVal);
      }
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    startY: 0,//开始y点
    screenHeight:0,//获取当前屏幕高度
    scrollAnimate:0,
    videoidx:0,//保存切换下标
    videoSize:0,//视频列表的长度
  },
  ready:function(){
   this.animation = wx.createAnimation({
     duration:600,
     timingFunction:'linear',
   });
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight
        })
      }
    })
    console.log(this.properties.videoList.length);
    this.setData({
      videoSize:this.properties.videoList.length
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTouchStart: function (e) {
      const {pageY } = e.changedTouches[0]; //记录手指位置
      this.setData({
        startY: pageY
      });
    },
      
    onTouchEnd: function (e) {
      var { videoidx } = e.currentTarget.dataset;
      videoidx = parseInt(videoidx)
      console.log(videoidx);
      var thresholdValue = this.properties.thresholdValue;
      const {startY } = this.data;
      var movey = e.changedTouches[0].pageY;
      var changeY = movey - startY;
      if (changeY > 0) {
        if (changeY >= thresholdValue) {
          if (videoidx===0){
             wx.showToast({
               title: '第一个视频',
               icon:'none'
             })
            this.triggerEvent('swipeToStart', {
              oldindex: 0,
              newindex: videoidx,
            });
            return false;
          }
          var top_height = -((videoidx - 1) * this.data.screenHeight);
          console.log('手指向下滑动,往上切换视频');
          this.triggerEvent('swipeDown',{
            oldindex: videoidx,
            newindex: videoidx-1,
          });
          this.animation.translateY(top_height).step();
          this.setData({
            scrollAnimate: this.animation.export(),
            videoidx: videoidx,
          });
        }
      }else{
        var abschangeY = Math.abs(changeY);
        if (abschangeY >= thresholdValue) {
          if (videoidx+1 === this.data.videoSize) {
            wx.showToast({
              title: '到头了',
              icon: 'none'
            })
            this.triggerEvent('swipeToEnd', { 
              oldindex: videoidx + 1,
              newindex:videoidx
              });
            return false;
          }
          var btm_height = -((videoidx + 1) * this.data.screenHeight);
          this.triggerEvent('swipeUpper', {
            oldindex: videoidx,
            newindex: videoidx +1,
          });
          this.animation.translateY(btm_height).step();
          console.log('向上滑动,往下切换视频');
          this.setData({
            scrollAnimate:this.animation.export(),
            videoidx: videoidx,
          });
        }
      }
    }
  }
})
