var app = getApp()
Page({

  data: {
    tip: '跳转中……'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    console.log(query.id)
    var userInfo = wx.getStorageSync('userInfo') //用户详情
    if (userInfo){
      wx.reLaunch({
        url: "/pages/details/details?id=" + query.id
      })
    } else {
      this.setData({
        tip: '跳转失败'
      })
    }
  }
})