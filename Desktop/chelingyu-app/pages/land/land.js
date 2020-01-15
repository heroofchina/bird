// pages/land/land.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   // 13483586669
   //15694861657
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    wx.setNavigationBarTitle({
        title: '账号登录'
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
  formSubmit: function (e) {
    console.log(e)
    var account = e.detail.value.account
    var password = e.detail.value.password
    wx.request({
      url: app.apiUrl + '/serviceUser/login',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data:{
        account :account,
        password:password
      },
      success: function (e) {
        if (e.data.success){
          wx.clearStorageSync()
          wx.setStorageSync("userInfo", e.data.data)
          wx.switchTab({
            url: "/pages/index/index"
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '账号或密码错误',
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