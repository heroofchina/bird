// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anmationShow: false
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

  },

  //按住按钮
  startHandel: function () {
    this.setData({
      sayimg: '/assets/image/demand/down.png',
      anmationShow: true,
    })
    console.log("开始")
    wx.getRecorderManager().start({
      duration: 10000
    })
    const self = this
    setTimeout(function () {
      self.setData({
        sayimg: '/assets/image/demand/sea.png',
        anmationShow: false
      })
    }, 10000);
  },
  //松开按钮
  endHandle: function () {
    // clearTimeout()
    this.setData({
      sayimg: '/assets/image/demand/sea.png',//图片样式
      anmationShow: false,
    })
    console.log("结束")
    const recorderManager = wx.getRecorderManager()
    //录音停止函数
    var that = this;
    wx.getRecorderManager().onStop((res) => {
      if (!this.data.inpvalue) {
        wx.showLoading({
          title: '语音识别中'
        })
      }
      console.log(res)
      const { tempFilePath } = res; //这里松开按钮 会返回录音本地路径
      //上传录制的音频到服务器
      // wx.uploadFile({
      //   url: '接口地址' + api.voice, //接口地址
      //   name: 'file', //上传文件名
      //   filePath: tempFilePath,
      //   success: function (res) { //后台返回给前端识别后的文字
      //     var model = res.data
      //     var modeljson = JSON.parse(model)
      //     if (modeljson.status_code == 500) {
      //       wx.showToast({
      //         title: '语音转换失败',
      //         image: '/assets/image/icon/fail@2x.png'
      //       })
      //       return false;
      //     }
      //     if (modeljson.meta.status_code === 200 && !modeljson.data.err_msg) {
      //       var saymessage = modeljson.data.message;
      //       wx.setStorageSync('sayinfo', saymessage)
      //       that.setData({
      //         inpvalue: saymessage
      //       })
      //       setTimeout(() => {
      //         wx.navigateTo({
      //           url: '../loding/loding'
      //         })

      //       }, 2000)
      //       setTimeout(() => {
      //         wx.hideLoading();
      //       }, 100)
      //     } else if (modeljson.data.err_msg) {
      //       wx.showToast({
      //         title: '请大声说话',
      //         image: '/assets/image/icon/fail@2x.png'
      //       })
      //       return false;
      //     }
      //   }
      // })
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