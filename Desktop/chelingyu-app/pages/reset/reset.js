// pages/reset/reset.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title: '设置密码'
    });
    this.setData({
      account: options.account
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  doClick: function (e) {
    var that = this
    var password1 = e.detail.value;
    console.log(password1)
    that.setData({
      password1: password1
    })
  },
  click: function (e) {
    var that = this
    var password = e.detail.value;
    console.log(password)
    that.setData({
      password: password
    })
  },
  forget: function () {
    var that = this
    var account = that.data.account
    var password1 = that.data.password1
    var password = that.data.password
    if (password1 != password){
        wx.showToast({
          title: '两次密码不一致',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
    }
    wx.request({
      url: app.apiUrl + '/serviceUser/forget',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        account: account,
        password: password
      },
      success: function (r) {
        wx.redirectTo({
          url: '../login/login',
        })
      },
      fail: function (r) {

      }
    })
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