// pages/history/history.js
var app = getApp()
var timeUtil = require('../../utils/util.js');
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
    this.setData({
      customerId: options.customerId
    })
    this._list()
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
  _list:function(){
    var that = this 
    var customerId = that.data.customerId
    wx.request({
      url: app.apiUrl + '/projectOrder/list',
      method: 'GET',
      data: { customerId: customerId },
      success: function (e) {
        console.log(e.data.data)
        var list = e.data.data
        for(i=0; i<list.length; i++){
          list[i].createTime = timeUtil.formatTimeTwo(list[i].createTime, 'Y/M/D');
        }
        that.setData({
          list: list 
        })
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