// pages/login/login.js
var app = getApp();
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
        title: '登录'
    });
    var userInfo = wx.getStorageSync('userInfo') //用户详情
    if (userInfo){
      wx.switchTab({
        url: "/pages/index/index"
      })
    }
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
  onGotUserInfo: function (e) {
    console.log(e)
    var that = this
    wx.login({
      success(res) {
        wx.request({
          url: app.apiUrl + '/decode/get',
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          success: function (r) {
            console.log(r)
            that.setData({
              phoneNumber: r.data.phoneNumber
            })
            if (r.data.phoneNumber){
              that.wxlogin();
            }
          }
        })
      }
    })
  },
  wxlogin: function (data) {
    var that = this
    var phoneNumber = that.data.phoneNumber
    wx.request({
      url: app.apiUrl + '/serviceUser/wxlogin',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { account: phoneNumber},
      success: function (e) {
        if(e.data.data){
          wx.setStorageSync("userInfo", e.data.data)
          wx.switchTab({
              url: "/pages/index/index"
            })
        } else {
          wx.navigateTo({
            url: '/pages/register/register?account='+ phoneNumber,
          })
        }
      }
    })
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