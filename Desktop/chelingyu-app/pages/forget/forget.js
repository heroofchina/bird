// pages/forget/forget.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: "获取验证码",
    b: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title: '找回密码'
    });
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

  countdown: function () {
    var that = this
    var msg = that.data.msg
    if (msg == 0) {
      that.setData({
        msg: "获取验证码",
        b: false
      });
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        msg: msg - 1
      });
      that.countdown();
    }, 1000)
  },
  code: function () {
    var that = this
    var phone = that.data.phone
    wx.request({
      url: app.apiUrl + '/common/sendSMS',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        phoneNum: phone
      },
      success: function (r) {
        console.log(r)
        if (r.data.success) {
          that.setData({
            sessionid: r.data.data.sessionid,
            b: true,
            msg: 60
          })
          that.countdown()
          console.log(that.data.sessionid)
        }
      },
      fail: function (r) {

      }
    })
  },
  doClick: function (e) {
    var that = this
    var code = e.detail.value;
    console.log(code)
    that.setData({
      code: code
    })
  },
  click: function (e) {
    var that = this
    var phone = e.detail.value;
    console.log(phone)
    that.setData({
      phone: phone
    })
  },
  next:function(){
    var that= this
    var code = that.data.code
    var phone = that.data.phone
    if(code && phone){
      wx.navigateTo({
        url: '../reset/reset?account=' + phone,
      })
    } else {
      wx.showToast({
        title: '请输入对应信息',
        icon: '',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }

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