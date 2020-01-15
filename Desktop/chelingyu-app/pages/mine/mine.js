// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') //用户详情
    })
  },
  out:function(){
    wx.clearStorage()
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  //按住按钮
  startHandel: function() {
    const timer = setTimeout(() => {
      wx.showToast({
        image: '/img/microphone.png',
        duration: 1000 * 60 * 60,
        title: '接收中'
      })
      clearTimeout(timer)
    }, 500)
    this.setData({
      anmationShow: true,
      isShow: true,
      timer: timer
    })
    wx.getRecorderManager().start({
      duration: 10000
    })
    const self = this
    setTimeout(function() {
      self.setData({
        anmationShow: false
      })
    }, 10000);
  },
  //松开按钮
  endHandle: function() {
    // wx.navigateTo({
    //   url: '../search/search?word=' + result,
    // })
    // clearTimeout()
    this.data.timer ? clearTimeout(this.data.timer) : null
    wx.hideToast()
    this.setData({
      anmationShow: false,
      isShow: false
    })
    //录音停止函数
    var that = this;
    wx.getRecorderManager().onStop((res) => {
      // if (!this.data.inpvalue) {
      //   wx.showLoading({
      //     title: '语音识别中'
      //   })
      // }
      console.log(res)
      const {
        tempFilePath
      } = res; //这里松开按钮 会返回录音本地路径
      // 上传录制的音频到服务器
      wx.uploadFile({
        url: app.apiUrl + '/SASR/SASR', //接口地址
        method: 'POST',
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        filePath: res.tempFilePath,
        success: function(res) { //后台返回给前端识别后的文字
          var json = JSON.parse(res.data).result
          var r = JSON.stringify(json)
          var result =  r.slice(2, r.length-3)
          console.log(result)
          wx.navigateTo({
            url: '../search/search?word=' + result,
          })
        }
      })
    })
    //触发录音停止
    wx.getRecorderManager().stop()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})